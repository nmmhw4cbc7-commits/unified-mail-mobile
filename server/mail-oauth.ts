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
  if (!response.ok) {
    const providerBody = await response.text();
    let providerError = "";
    try {
      providerError = (JSON.parse(providerBody) as { error?: string }).error ?? "";
    } catch {
      // Keep the response generic if the provider did not return JSON.
    }
    const error = new Error(`Provider token exchange failed (${response.status})`);
    (error as Error & { providerCode?: string }).providerCode = providerError;
    throw error;
  }
  return await response.json() as { access_token: string; refresh_token?: string; expires_in?: number };
}

async function getProfile(provider: MailProvider, accessToken: string) {
  const url = provider === "gmail" ? "https://openidconnect.googleapis.com/v1/userinfo" : "https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName";
  const response = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`Provider profile request failed (${response.status})`);
  const profile = await response.json() as { email?: string; mail?: string; userPrincipalName?: string; name?: string; displayName?: string };
  return { email: profile.email ?? profile.mail ?? profile.userPrincipalName ?? "", displayName: profile.name ?? profile.displayName ?? null };
}

function resultPage(title: string, message: string, success: boolean) {
  const safe = (value: string) => value.replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character] ?? character);
  return `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe(title)}</title><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:560px;margin:15vh auto;padding:24px;color:#17202a"><h1>${success ? "Konto verbunden" : "Verbindung fehlgeschlagen"}</h1><p>${safe(message)}</p><p>Du kannst dieses Fenster jetzt schließen und in Unified Mail die Kontenansicht öffnen.</p></body></html>`;
}

export function registerMailOAuthRoutes(app: Express) {
  app.get("/api/mail/oauth/callback", async (req: Request, res: Response) => {
    try {
      const { code, state, error, error_description: errorDescription } = req.query as { code?: string; state?: string; error?: string; error_description?: string };
      if (error) return res.status(400).type("html").send(resultPage("Microsoft-Anmeldung abgebrochen", errorDescription || `Der Anbieter meldete: ${error}.`, false));
      if (!code || !state) return res.status(400).type("html").send(resultPage("Ungültige Rückgabe", "Die Anmeldung hat keinen gültigen Code zurückgegeben. Starte die Verbindung bitte erneut.", false));
      const claims = await verifyMailOAuthState(state);
      const redirectUri = getRedirectUri(req);
      const token = await exchangeCode(claims.provider, code, redirectUri);
      const profile = await getProfile(claims.provider, token.access_token);
      if (!profile.email) return res.status(400).type("html").send(resultPage("E-Mail-Adresse fehlt", "Der Provider hat keine nutzbare E-Mail-Adresse zurückgegeben.", false));
      await upsertMailAccount({ userId: claims.userId, provider: claims.provider, email: profile.email, displayName: profile.displayName, encryptedAccessToken: encryptToken(token.access_token), encryptedRefreshToken: token.refresh_token ? encryptToken(token.refresh_token) : undefined, tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined });
      return res.status(200).type("html").send(resultPage("Konto verbunden", `${profile.email} wurde erfolgreich mit Unified Mail verbunden.`, true));
    } catch (error) {
      console.error("[Mail OAuth] callback failed", error);
      const providerCode = error instanceof Error ? (error as Error & { providerCode?: string }).providerCode : undefined;
      const message = providerCode === "invalid_client"
        ? "Die Microsoft-App-Konfiguration wurde vom Provider abgelehnt. Prüfe Client-ID, Secret und Redirect-URI."
        : providerCode === "invalid_grant"
          ? "Der Anmeldecode ist abgelaufen oder wurde bereits verwendet. Starte die Verbindung bitte erneut."
          : "Die Provider-Verbindung konnte nicht abgeschlossen werden. Starte die Verbindung bitte erneut.";
      return res.status(500).type("html").send(resultPage("Verbindung fehlgeschlagen", message, false));
    }
  });
}
