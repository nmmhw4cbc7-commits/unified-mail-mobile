import { describe, expect, it } from "vitest";

const hasProviderSecrets = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.MICROSOFT_CLIENT_ID &&
  process.env.MICROSOFT_CLIENT_SECRET &&
  process.env.MAIL_TOKEN_ENCRYPTION_KEY,
);

describe("provider configuration", () => {
  it.runIf(!hasProviderSecrets)("requires OAuth configuration before live integration", () => {
    expect(hasProviderSecrets).toBe(true);
  });

  it.runIf(hasProviderSecrets)("accepts the configured encryption key format", () => {
    const decoded = Buffer.from(process.env.MAIL_TOKEN_ENCRYPTION_KEY!, "base64");
    expect(decoded.byteLength).toBe(32);
  });

  it.runIf(hasProviderSecrets)("reaches the Google OAuth token endpoint with configured client credentials", async () => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: "configuration-validation-only",
      }),
    });
    expect([400, 401]).toContain(response.status);
  }, 10000);
});
