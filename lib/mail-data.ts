export type Provider = "gmail" | "outlook" | "icloud" | "imap";

export type MailAccount = {
  id: string;
  name: string;
  email: string;
  provider: Provider;
  color: string;
  unread: number;
  status: "synced" | "syncing" | "attention";
};

export type MailMessage = {
  id: string;
  accountId: string;
  senderName: string;
  senderEmail: string;
  recipients: string[];
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  dateLabel: string;
  unread: boolean;
  starred: boolean;
  hasAttachment?: boolean;
};

/** Nutzerbezogene Daten werden nach einer erfolgreichen Provider-Verbindung geladen. */
export const accounts: MailAccount[] = [];
export const messages: MailMessage[] = [];

export const providerLabel: Record<Provider, string> = {
  gmail: "Gmail",
  outlook: "Outlook",
  icloud: "iCloud",
  imap: "IMAP / SMTP",
};

export function getAccount(accountId: string, accountList: MailAccount[] = accounts) {
  return accountList.find((account) => account.id === accountId);
}
