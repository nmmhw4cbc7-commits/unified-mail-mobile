import { decryptToken, encryptToken } from "./mail-security";
import { getMailAccountForUser, updateMailAccountTokens, upsertMailMessage } from "./db";
import type { MailAccount, InsertMailMessage } from "../drizzle/schema";

type TokenResponse = { access_token: string; refresh_token?: string; expires_in?: number };
type NormalizedMessage = Omit<InsertMailMessage, "accountId">;

function textFromHtml(value: string) {
  return value.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function decodeBase64Url(value: string) {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function header(headers: Array<{ name?: string; value?: string }> | undefined, name: string) {
  return headers?.find((item) => item.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function address(value: string) {
  const match = value.match(/^(.*?)\s*<([^>]+)>$/);
  return { name: (match?.[1] ?? "").replace(/^\"|\"$/g, "").trim(), email: match?.[2] ?? value.trim() };
}

function recipientsJson(values: Array<{ emailAddress?: { address?: string } }> | undefined) {
  return JSON.stringify((values ?? []).map((item) => item.emailAddress?.address).filter(Boolean));
}

async function providerFetch(url: string, accessToken: string, init: RequestInit = {}) {
  const response = await fetch(url, { ...init, headers: { authorization: `Bearer ${accessToken}`, accept: "application/json", ...init.headers } });
  if (!response.ok) throw new Error(`Provider API request failed (${response.status})`);
  return response.json();
}

export async function getValidAccessToken(account: MailAccount) {
  const accessToken = account.encryptedAccessToken ? decryptToken(account.encryptedAccessToken) : "";
  const expiresSoon = !account.tokenExpiresAt || account.tokenExpiresAt.getTime() < Date.now() + 60_000;
  if (!expiresSoon || !account.encryptedRefreshToken) return accessToken;
  const isGoogle = account.provider === "gmail";
  const body = new URLSearchParams({ client_id: isGoogle ? process.env.GOOGLE_CLIENT_ID ?? "" : process.env.MICROSOFT_CLIENT_ID ?? "", client_secret: isGoogle ? process.env.GOOGLE_CLIENT_SECRET ?? "" : process.env.MICROSOFT_CLIENT_SECRET ?? "", refresh_token: decryptToken(account.encryptedRefreshToken), grant_type: "refresh_token" });
  const response = await fetch(isGoogle ? "https://oauth2.googleapis.com/token" : "https://login.microsoftonline.com/common/oauth2/v2.0/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error(`Provider token refresh failed (${response.status})`);
  const token = await response.json() as TokenResponse;
  await updateMailAccountTokens(account.id, { encryptedAccessToken: encryptToken(token.access_token), encryptedRefreshToken: token.refresh_token ? encryptToken(token.refresh_token) : account.encryptedRefreshToken, tokenExpiresAt: token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : undefined });
  return token.access_token;
}

function gmailBody(payload: any): string {
  if (payload?.body?.data) return decodeBase64Url(payload.body.data);
  for (const part of payload?.parts ?? []) {
    const value = gmailBody(part);
    if (value) return value;
  }
  return "";
}

async function fetchGmail(account: MailAccount, accessToken: string): Promise<NormalizedMessage[]> {
  const list = await providerFetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=25", accessToken) as { messages?: Array<{ id: string }> };
  const messages: NormalizedMessage[] = [];
  for (const item of list.messages ?? []) {
    const raw = await providerFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(item.id)}?format=full`, accessToken) as any;
    const sender = address(header(raw.payload?.headers, "From"));
    const recipients = header(raw.payload?.headers, "To").split(",").map((entry: string) => address(entry).email).filter(Boolean);
    const bodyRaw = gmailBody(raw.payload);
    const body = raw.payload?.mimeType?.includes("html") ? textFromHtml(bodyRaw) : bodyRaw;
    messages.push({ providerMessageId: item.id, threadId: raw.threadId, senderName: sender.name || sender.email, senderEmail: sender.email, recipientsJson: JSON.stringify(recipients), subject: header(raw.payload?.headers, "Subject") || "(Ohne Betreff)", preview: raw.snippet ?? body.slice(0, 240), body, receivedAt: new Date(Number(raw.internalDate ?? Date.now())), unread: (raw.labelIds ?? []).includes("UNREAD"), starred: (raw.labelIds ?? []).includes("STARRED"), hasAttachment: Boolean(raw.payload?.parts?.some((part: any) => part.filename)), labelsJson: JSON.stringify(raw.labelIds ?? []) });
  }
  return messages;
}

async function fetchOutlook(account: MailAccount, accessToken: string): Promise<NormalizedMessage[]> {
  const data = await providerFetch("https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=25&$orderby=receivedDateTime%20desc&$select=id,conversationId,subject,bodyPreview,body,from,toRecipients,receivedDateTime,isRead,flag,hasAttachments", accessToken) as any;
  return (data.value ?? []).map((item: any) => ({ providerMessageId: item.id, threadId: item.conversationId, senderName: item.from?.emailAddress?.name || item.from?.emailAddress?.address || "", senderEmail: item.from?.emailAddress?.address || "", recipientsJson: recipientsJson(item.toRecipients), subject: item.subject || "(Ohne Betreff)", preview: item.bodyPreview || "", body: item.body?.contentType === "html" ? textFromHtml(item.body.content ?? "") : item.body?.content ?? "", receivedAt: new Date(item.receivedDateTime), unread: !item.isRead, starred: item.flag?.flagStatus === "flagged", hasAttachment: Boolean(item.hasAttachments), labelsJson: JSON.stringify(["INBOX"]) }));
}

export async function syncMailAccount(userId: number, accountId: number) {
  const account = await getMailAccountForUser(accountId, userId);
  if (!account || !account.encryptedAccessToken) throw new Error("Mailkonto ist nicht verbunden oder benötigt eine erneute Anmeldung.");
  const accessToken = await getValidAccessToken(account);
  const messages = account.provider === "gmail" ? await fetchGmail(account, accessToken) : await fetchOutlook(account, accessToken);
  for (const message of messages) await upsertMailMessage({ ...message, accountId: account.id });
  return { accountId: account.id, count: messages.length };
}
