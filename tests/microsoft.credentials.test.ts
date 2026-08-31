import { describe, expect, it } from "vitest";

describe("Microsoft OAuth credentials", () => {
  it("accepts the configured client credentials at the token endpoint", async () => {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

    expect(clientId).toBe("94f1c171-f990-4a06-9f21-ee42435889e2");
    expect(clientSecret).toBeTruthy();

    const body = new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      code: "validation-code-that-does-not-exist",
      redirect_uri: "https://unimailapp-aje7zwqe.manus.space/api/mail/oauth/callback",
      grant_type: "authorization_code",
    });

    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const payload = (await response.json()) as { error?: string; error_description?: string };

    expect(response.status).not.toBe(401);
    expect(payload.error).not.toBe("invalid_client");
    expect(payload.error).toBe("invalid_grant");
  }, 20_000);
});
