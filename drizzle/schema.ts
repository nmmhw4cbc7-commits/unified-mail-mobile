import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const mailAccounts = mysqlTable("mail_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  provider: mysqlEnum("provider", ["gmail", "outlook", "icloud", "imap"]).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  displayName: varchar("displayName", { length: 255 }),
  encryptedAccessToken: text("encryptedAccessToken"),
  encryptedRefreshToken: text("encryptedRefreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ userProviderEmailIdx: uniqueIndex("mail_accounts_user_provider_email_idx").on(table.userId, table.provider, table.email) }));

export type MailAccount = typeof mailAccounts.$inferSelect;
export type InsertMailAccount = typeof mailAccounts.$inferInsert;

export const mailMessages = mysqlTable("mail_messages", {
  id: int("id").autoincrement().primaryKey(),
  accountId: int("accountId").notNull(),
  providerMessageId: varchar("providerMessageId", { length: 512 }).notNull(),
  threadId: varchar("threadId", { length: 512 }),
  senderName: varchar("senderName", { length: 255 }),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  recipientsJson: text("recipientsJson").notNull(),
  subject: varchar("subject", { length: 998 }).notNull(),
  preview: text("preview").notNull(),
  body: text("body").notNull(),
  receivedAt: timestamp("receivedAt").notNull(),
  unread: boolean("unread").default(true).notNull(),
  starred: boolean("starred").default(false).notNull(),
  hasAttachment: boolean("hasAttachment").default(false).notNull(),
  labelsJson: text("labelsJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ accountProviderMessageIdx: uniqueIndex("mail_messages_account_provider_message_idx").on(table.accountId, table.providerMessageId), accountReceivedIdx: index("mail_messages_account_received_idx").on(table.accountId, table.receivedAt) }));

export type MailMessage = typeof mailMessages.$inferSelect;
export type InsertMailMessage = typeof mailMessages.$inferInsert;
