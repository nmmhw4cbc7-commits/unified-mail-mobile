import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, mailAccounts, mailMessages, users, type InsertMailAccount, type InsertMailMessage } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listMailAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: mailAccounts.id, provider: mailAccounts.provider, email: mailAccounts.email, displayName: mailAccounts.displayName, tokenExpiresAt: mailAccounts.tokenExpiresAt }).from(mailAccounts).where(eq(mailAccounts.userId, userId));
}

export async function upsertMailAccount(account: InsertMailAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(mailAccounts).values(account).onDuplicateKeyUpdate({ set: { displayName: account.displayName, encryptedAccessToken: account.encryptedAccessToken, encryptedRefreshToken: account.encryptedRefreshToken, tokenExpiresAt: account.tokenExpiresAt, updatedAt: new Date() } });
}

export async function getMailAccountForUser(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(mailAccounts).where(and(eq(mailAccounts.id, id), eq(mailAccounts.userId, userId))).limit(1);
  return result[0];
}

export async function listMailMessages(userId: number, accountId?: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ message: mailMessages, account: mailAccounts }).from(mailMessages).innerJoin(mailAccounts, eq(mailMessages.accountId, mailAccounts.id)).where(accountId ? and(eq(mailAccounts.userId, userId), eq(mailMessages.accountId, accountId)) : eq(mailAccounts.userId, userId)).orderBy(mailMessages.receivedAt);
  return rows.map(({ message, account }) => ({ ...message, accountId: String(message.accountId), account: { id: String(account.id), email: account.email, displayName: account.displayName, provider: account.provider } }));
}

export async function upsertMailMessage(message: InsertMailMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(mailMessages).values(message).onDuplicateKeyUpdate({ set: { threadId: message.threadId, senderName: message.senderName, senderEmail: message.senderEmail, recipientsJson: message.recipientsJson, subject: message.subject, preview: message.preview, body: message.body, receivedAt: message.receivedAt, unread: message.unread, hasAttachment: message.hasAttachment, labelsJson: message.labelsJson, updatedAt: new Date() } });
}

export async function updateMailAccountTokens(id: number, tokens: Pick<InsertMailAccount, "encryptedAccessToken" | "encryptedRefreshToken" | "tokenExpiresAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mailAccounts).set({ ...tokens, updatedAt: new Date() }).where(eq(mailAccounts.id, id));
}
