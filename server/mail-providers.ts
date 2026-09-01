import { createMailOAuthState } from "./mail-security";
import { ENV } from "./_core/env";

export type MailProvider = "gmail" | "outlook";

export function getRedirectUri(req: { protocol: string; get: (name: string) => string | undefined }) {
  // Prefer an explicit environment-configured OAuth server URL so deployments
  // (incl. preview URLs) can override the redirect URI used for provider
  // configuration. Fall back to deriving from the incoming request.
  if (ENV.oAuthServerUrl) {
    return `${ENV.oAuthServerUrl.replace(/\/$/, "")}/api/mail/oauth/callback`;
  }
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol || "https";
  return `${protocol}://${host}/api/mail/oauth/callback`;
}

export async function createOAuthRequest(provider: MailProvider, req: { protocol: string; get: (name: string) => string | undefined }, userId: number) {
  const state = await createMailOAuthState(userId, provider);
  const redirectUri = getRedirectUri(req);
  if (provider === "gmail") {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      redirect_uri: redirectUri,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: "openid email profile",
      state,
    });
    return { provider, state, redirectUri, authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` };
  }
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope: "openid profile offline_access email",
    state,
  });
  return { provider, state, redirectUri, authorizationUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}` };
}

export function providerIsConfigured(provider: MailProvider) {
  return provider === "gmail"
    ? Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    : Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);
}
