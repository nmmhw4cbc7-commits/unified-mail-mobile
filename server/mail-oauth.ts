import type { Express, Request, Response } from "express";
import { encryptToken, verifyMailOAuthState } from "./mail-security";
import { upsertMailAccount } from "./db";
import { getRedirectUri, type MailProvider } from "./mail-providers";

async function exchangeCode(provider: MailProvider, code: string, redirectUri: string) {
  const isGoogle = provider === "gmail";
  const tokenUrl = isGoogle ? "https://oauth2.googleapis.com/token" : "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  const body = new URLSearchParams({
    client_id: isGoogle ? process.env.GOOGLE_CLIENT_ID ?? "" : process.env.MICROSOFT_CLIENT_ID ?? "",
    client_secret: isGoogle ? process.env.GOOGLE_CLIENT_SECRET ?? "" : process.env.MICROSOFT_CLIENT_SECRET ?? "",
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const response = await fetch(tokenUrl, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error(`Provider token exchange failed (${response.status})`);
  return await response.json() as { access_token: string; refresh_token?: string; expires_in?: number };
}

async function getProfile(provider: MailProvider, accessToken: string) {
  const url = provider === "gmail" ? "https://openidconnect.googleapis.com/v1/userinfo" : "https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName";
  const response = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`Provider profile request failed (${response.status})`);
  const profile = await response.json() as { email?: string; mail?: string; userPrincipalName?: string; name?: string; displayName?: string };
  return { email: profile.email ?? profile.mail ?? profile.userPrincipalName ?? "", displayName: profile.name ?? profile.displayName ?? null };
}

export function registerMailOAuthRoutes(app: Express) {
  app.get("/api/mail/oauth/callback", async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query as { code?: string; state?: string; error?: string };
      if (error) return res.status(400).send(`Provider-Anmeldung abgebrochen: ${error}`);
      if (!code || !state) return res.status(400).send("OAuth-Callback benötigt code und state.");
      const claims = await verifyMailOAuthState(state);
      const redirectUri = getRedirectUri(req);
      const token = await exchangeCode(claims.provider, code, redirectUri);
      const profile = await getProfile(claims.provider, token.access_token);
      if (!profile.email) return res.status(400).send("Provider hat keine E-Mail-Adresse zurückgegeben.");
      await upsertMailAccount({ userId: claims.userId, provider: claims.provider, email: profile.email, displayName: profile.displayName, encryptedAccessToken: encryptToken(token.access_token), encryptedRefreshToken: token.refresh_token ? encryptToken(token.refresh_token) : undefined, tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined });
      return res.status(200).send("Konto erfolgreich verbunden. Du kannst dieses Fenster schließen und zur App zurückkehren.");
    } catch (error) {
      console.error("[Mail OAuth] callback failed", error);
      return res.status(500).send("Die Provider-Verbindung konnte nicht abgeschlossen werden.");
    }
  });
}
