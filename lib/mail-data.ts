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

export const accounts: MailAccount[] = [
  { id: "personal", name: "Persönlich", email: "alex@beispiel.de", provider: "gmail", color: "#E95C5C", unread: 3, status: "synced" },
  { id: "work", name: "Arbeit", email: "alex@studio-nord.de", provider: "outlook", color: "#3A78D4", unread: 2, status: "synced" },
  { id: "icloud", name: "iCloud", email: "alex@icloud.com", provider: "icloud", color: "#8B72D8", unread: 0, status: "syncing" },
];

export const messages: MailMessage[] = [
  { id: "1", accountId: "work", senderName: "Mara Klein", senderEmail: "mara@studio-nord.de", recipients: ["alex@studio-nord.de"], subject: "Q3 Launch: Die nächsten Schritte", preview: "Danke für den starken Workshop gestern. Im Anhang findest du die aktualisierte Timeline und die drei Entscheidungen…", body: "Danke für den starken Workshop gestern. Im Anhang findest du die aktualisierte Timeline und die drei Entscheidungen, die wir für den Launch noch bestätigen sollten.\n\nIch habe die Timeline aktualisiert und die offenen Punkte nach Priorität sortiert. Lass uns morgen kurz die Verantwortlichkeiten festziehen.\n\nViele Grüße\nMara", timestamp: "09:42", dateLabel: "Heute", unread: true, starred: true, hasAttachment: true },
  { id: "2", accountId: "personal", senderName: "Jonas Weber", senderEmail: "jonas@webermail.de", recipients: ["alex@beispiel.de"], subject: "Dein Wochenende in Hamburg", preview: "Hast du am Samstag Lust auf den Flohmarkt? Ich habe schon zwei Tickets für die Ausstellung…", body: "Hast du am Samstag Lust auf den Flohmarkt? Ich habe schon zwei Tickets für die Ausstellung reserviert. Danach könnten wir noch an die Alster gehen.\n\nSag einfach Bescheid, wann du ankommst!", timestamp: "08:17", dateLabel: "Heute", unread: true, starred: false },
  { id: "3", accountId: "work", senderName: "Notion Updates", senderEmail: "team@notion.so", recipients: ["alex@studio-nord.de"], subject: "Neue Kommentare in Projekt Atlas", preview: "Sven und 2 weitere Personen haben neue Kommentare zu deinen Seiten hinterlassen.", body: "Sven und 2 weitere Personen haben neue Kommentare zu deinen Seiten hinterlassen. Öffne Notion, um die Diskussion fortzusetzen und die offenen Punkte zu prüfen.", timestamp: "Gestern", dateLabel: "Gestern", unread: true, starred: false },
  { id: "4", accountId: "personal", senderName: "Finanzblick", senderEmail: "service@finanzblick.de", recipients: ["alex@beispiel.de"], subject: "Dein Monatsreport ist da", preview: "Deine Ausgaben im August auf einen Blick. Du hast diesen Monat 8 % weniger ausgegeben.", body: "Dein persönlicher Monatsreport für August ist verfügbar. Du hast diesen Monat 8 % weniger ausgegeben als im Vormonat. Öffne die App für weitere Details.", timestamp: "Mo", dateLabel: "25. Aug.", unread: false, starred: false },
  { id: "5", accountId: "icloud", senderName: "Lena Fischer", senderEmail: "lena@fischer.design", recipients: ["alex@icloud.com"], subject: "Re: Moodboard Sommerkollektion", preview: "Das neue Farbschema gefällt mir sehr. Ich habe noch zwei Varianten für die Typografie ergänzt.", body: "Das neue Farbschema gefällt mir sehr. Ich habe noch zwei Varianten für die Typografie ergänzt. Die Dateien liegen im gemeinsamen Ordner.\n\nLiebe Grüße\nLena", timestamp: "So", dateLabel: "24. Aug.", unread: false, starred: true, hasAttachment: true },
  { id: "6", accountId: "personal", senderName: "Dr. Anna Roth", senderEmail: "anna@praxis-roth.de", recipients: ["alex@beispiel.de"], subject: "Terminbestätigung", preview: "Hiermit bestätigen wir Ihren Termin am 4. September um 14:30 Uhr.", body: "Hiermit bestätigen wir Ihren Termin am 4. September um 14:30 Uhr. Bitte bringen Sie, falls vorhanden, Ihre aktuellen Unterlagen mit.", timestamp: "22. Aug.", dateLabel: "22. Aug.", unread: false, starred: false },
];

export const providerLabel: Record<Provider, string> = { gmail: "Gmail", outlook: "Outlook", icloud: "iCloud", imap: "IMAP / SMTP" };

export function getAccount(accountId: string) {
  return accounts.find((account) => account.id === accountId) ?? accounts[0];
}
