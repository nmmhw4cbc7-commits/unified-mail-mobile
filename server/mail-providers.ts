import { createMailOAuthState } from "./mail-security";

export type MailProvider = "gmail" | "outlook";

function getRedirectUri(req: { protocol: string; get: (name: string) => string | undefined }) {
  const forwardedProto = req.get("x-forwarded-proto") ?? req.protocol;
  const forwardedHost = req.get("x-forwarded-host") ?? req.get("host");
  if (!forwardedHost) throw new Error("OAuth redirect host is unavailable");
  const stableBaseUrl = process.env.MAIL_OAUTH_BASE_URL ?? "https://unimailapp-aje7zwqe.manus.space";
  return `${stableBaseUrl}/api/mail/oauth/callback`;
}

export async function createOAuthRequest(provider: MailProvider, req: { protocol: string; get: (name: string) => string | undefined }, userId: number) {
  const state = await createMailOAuthState(userId, provider);
  const redirectUri = getRedirectUri(req);
  if (provider === "gmail") {
    const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID ?? "", redirect_uri: redirectUri, response_type: "code", access_type: "offline", prompt: "consent", scope: "openid email https://www.googleapis.com/auth/gmail.modify", state });
    return { provider, state, redirectUri, authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` };
  }
  const params = new URLSearchParams({ client_id: process.env.MICROSOFT_CLIENT_ID ?? "", redirect_uri: redirectUri, response_type: "code", response_mode: "query", scope: "openid profile offline_access User.Read Mail.Read Mail.Send", state });
  return { provider, state, redirectUri, authorizationUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}` };
}

export function providerIsConfigured(provider: MailProvider) {
  return provider === "gmail" ? Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) : Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);
}
