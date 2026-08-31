import { getMailAccountForUser } from "./db";
import { getValidAccessToken } from "./mail-sync";

function base64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function headerValue(value: string) {
  return value.replace(/[\r\n]/g, " ").trim();
}

async function sendGmail(accessToken: string, from: string, to: string, subject: string, body: string) {
  const raw = [`From: ${headerValue(from)}`, `To: ${headerValue(to)}`, `Subject: ${headerValue(subject)}`, "Content-Type: text/plain; charset=utf-8", "", body].join("\r\n");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" }, body: JSON.stringify({ raw: base64Url(raw) }) });
  if (!response.ok) throw new Error(`Gmail send failed (${response.status})`);
}

async function sendOutlook(accessToken: string, from: string, to: string, subject: string, body: string) {
  const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", { method: "POST", headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" }, body: JSON.stringify({ message: { subject: headerValue(subject), body: { contentType: "Text", content: body }, from: { emailAddress: { address: from } }, toRecipients: [{ emailAddress: { address: headerValue(to) } }] }, saveToSentItems: true }) });
  if (!response.ok) throw new Error(`Microsoft Graph send failed (${response.status})`);
}

export async function sendMail(userId: number, accountId: number, input: { to: string; subject: string; body: string }) {
  const account = await getMailAccountForUser(accountId, userId);
  if (!account || !account.encryptedAccessToken) throw new Error("Mailkonto ist nicht verbunden oder benötigt eine erneute Anmeldung.");
  const accessToken = await getValidAccessToken(account);
  if (account.provider === "gmail") await sendGmail(accessToken, account.email, input.to, input.subject, input.body);
  else if (account.provider === "outlook") await sendOutlook(accessToken, account.email, input.to, input.subject, input.body);
  else throw new Error("Dieser Anbieter unterstützt noch keinen Versand.");
  return { sent: true as const };
}
