import { describe, expect, it } from "vitest";

async function assertClientAccepted(url: string, clientId: string, clientSecret: string) {
  const body = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code: "credential-validation-only", redirect_uri: "https://unimailapp-aje7zwqe.manus.space/api/mail/oauth/callback", grant_type: "authorization_code" });
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  const text = await response.text();
  expect(response.status).toBe(400);
  expect(text.toLowerCase()).not.toMatch(/invalid_client|unauthorized_client|client does not exist/);
}

describe("provider OAuth credentials", () => {
  it("accepts the Google OAuth client", async () => {
    await assertClientAccepted("https://oauth2.googleapis.com/token", process.env.GOOGLE_CLIENT_ID ?? "", process.env.GOOGLE_CLIENT_SECRET ?? "");
  }, 15000);

  it("accepts the Microsoft OAuth client", async () => {
    await assertClientAccepted("https://login.microsoftonline.com/common/oauth2/v2.0/token", process.env.MICROSOFT_CLIENT_ID ?? "", process.env.MICROSOFT_CLIENT_SECRET ?? "");
  }, 15000);
});
