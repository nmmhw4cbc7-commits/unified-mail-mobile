import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { MailProvider } from "./mail-providers";

function signingKey() {
  const raw = process.env.MAIL_TOKEN_ENCRYPTION_KEY ?? "";
  const decoded = Buffer.from(raw, "base64");
  if (decoded.byteLength !== 32) throw new Error("MAIL_TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
  return decoded;
}

export async function createMailOAuthState(userId: number, provider: MailProvider) {
  return new SignJWT({ userId, provider }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("10m").sign(signingKey());
}

export async function verifyMailOAuthState(state: string) {
  const result = await jwtVerify(state, signingKey(), { algorithms: ["HS256"] });
  return result.payload as { userId: number; provider: MailProvider };
}

export function encryptToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", signingKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decryptToken(value: string) {
  const [ivRaw, tagRaw, ciphertextRaw] = value.split(".");
  if (!ivRaw || !tagRaw || !ciphertextRaw) throw new Error("Invalid encrypted token format");
  const decipher = createDecipheriv("aes-256-gcm", signingKey(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ciphertextRaw, "base64url")), decipher.final()]).toString("utf8");
}

export function tokenFingerprint(token: string) {
  return createHash("sha256").update(token).digest("hex").slice(0, 16);
}
