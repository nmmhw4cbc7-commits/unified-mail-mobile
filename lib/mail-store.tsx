import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { MailMessage } from "@/lib/mail-data";
import { getDeviceId } from "@/lib/device-identity";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "unified-mail:messages:v2";

type MailStoreValue = {
  messages: MailMessage[];
  markRead: (id: string) => void;
  toggleStar: (id: string) => void;
  addSentMessage: (message: MailMessage) => void;
  moveToTrash: (id: string) => void;
  moveToFolder: (id: string, folder: NonNullable<MailMessage["folder"]>) => void;
};

const MailStoreContext = createContext<MailStoreValue | null>(null);

function formatDate(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function mapRemoteMessage(message: any): MailMessage {
  let recipients: string[] = [];
  let labels: string[] = [];
  try { recipients = JSON.parse(message.recipientsJson); } catch { recipients = []; }
  try { labels = JSON.parse(message.labelsJson); } catch { labels = []; }
  const folder = labels.includes("TRASH") ? "trash" : labels.includes("SPAM") ? "spam" : labels.includes("CATEGORY_PROMOTIONS") ? "promotions" : labels.includes("SENT") ? "sent" : "inbox";
  return {
    id: `server-${message.id}`,
    accountId: String(message.accountId),
    senderName: message.senderName || message.senderEmail,
    senderEmail: message.senderEmail,
    recipients,
    subject: message.subject,
    preview: message.preview,
    body: message.body,
    timestamp: formatDate(message.receivedAt),
    dateLabel: new Date(message.receivedAt).toLocaleDateString(),
    unread: Boolean(message.unread),
    starred: Boolean(message.starred),
    hasAttachment: Boolean(message.hasAttachment) || labels.includes("ATTACHMENT"),
    folder,
  };
}

export function MailStoreProvider({ children }: { children: ReactNode }) {
  const [mailMessages, setMailMessages] = useState<MailMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const syncStartedFor = useRef(new Set<number>());
  const accountQuery = trpc.mail.accounts.useQuery({ deviceId }, { enabled: deviceId.length >= 16 });
  const remoteQuery = trpc.mail.messages.useQuery({ deviceId }, { enabled: deviceId.length >= 16 });
  const syncMutation = trpc.mail.sync.useMutation();
  const updateStatusMutation = trpc.mail.updateStatus.useMutation();

  useEffect(() => { getDeviceId().then(setDeviceId).catch(() => undefined); }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setMailMessages(JSON.parse(raw) as MailMessage[]); } catch { setMailMessages([]); }
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mailMessages)).catch(() => undefined);
  }, [hydrated, mailMessages]);

  useEffect(() => {
    if (deviceId.length < 16 || !accountQuery.data?.length) return;
    let cancelled = false;
    (async () => {
      for (const account of accountQuery.data) {
        if (cancelled || syncStartedFor.current.has(account.id)) continue;
        syncStartedFor.current.add(account.id);
        try { await syncMutation.mutateAsync({ deviceId, accountId: account.id }); } catch { /* UI remains usable; the next refresh can retry. */ }
      }
      if (!cancelled) await remoteQuery.refetch();
    })();
    return () => { cancelled = true; };
  }, [accountQuery.data, deviceId]);

  const remoteMessages = useMemo(() => (remoteQuery.data ?? []).map(mapRemoteMessage), [remoteQuery.data]);
  const messages = useMemo(() => {
    const combined = [...remoteMessages, ...mailMessages];
    return Array.from(new Map(combined.map((mail) => [mail.id, mail])).values());
  }, [mailMessages, remoteMessages]);

  const markRead = useCallback((id: string) => {
    setMailMessages((current) => current.some((mail) => mail.id === id && mail.unread) ? current.map((mail) => mail.id === id ? { ...mail, unread: false } : mail) : current);
    if (id.startsWith("server-") && deviceId.length >= 16) updateStatusMutation.mutate({ deviceId, messageId: Number(id.replace("server-", "")), unread: false });
  }, [deviceId, updateStatusMutation]);
  const toggleStar = useCallback((id: string) => {
    setMailMessages((current) => {
      const target = current.find((mail) => mail.id === id);
      if (id.startsWith("server-") && deviceId.length >= 16 && target) updateStatusMutation.mutate({ deviceId, messageId: Number(id.replace("server-", "")), starred: !target.starred });
      return current.map((mail) => mail.id === id ? { ...mail, starred: !mail.starred } : mail);
    });
  }, [deviceId, updateStatusMutation]);
  const addSentMessage = useCallback((message: MailMessage) => setMailMessages((current) => [message, ...current]), []);
  const moveToFolder = useCallback((id: string, folder: NonNullable<MailMessage["folder"]>) => setMailMessages((current) => {
    const existing = current.find((mail) => mail.id === id);
    const fallback = existing ?? messages.find((mail) => mail.id === id);
    return fallback ? [...current.filter((mail) => mail.id !== id), { ...fallback, folder, unread: folder === "trash" ? false : fallback.unread }] : current;
  }), [messages]);
  const moveToTrash = useCallback((id: string) => moveToFolder(id, "trash"), [moveToFolder]);
  const value = useMemo(() => ({ messages, markRead, toggleStar, addSentMessage, moveToTrash, moveToFolder }), [messages, markRead, toggleStar, addSentMessage, moveToTrash, moveToFolder]);

  return <MailStoreContext.Provider value={value}>{children}</MailStoreContext.Provider>;
}

export function useMailStore() {
  const value = useContext(MailStoreContext);
  if (!value) throw new Error("useMailStore must be used inside MailStoreProvider");
  return value;
}
