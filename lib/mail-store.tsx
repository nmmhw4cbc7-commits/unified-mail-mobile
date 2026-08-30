import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MailMessage } from "@/lib/mail-data";

const STORAGE_KEY = "unified-mail:messages:v2";

type MailStoreValue = {
  messages: MailMessage[];
  markRead: (id: string) => void;
  toggleStar: (id: string) => void;
  addSentMessage: (message: MailMessage) => void;
};

const MailStoreContext = createContext<MailStoreValue | null>(null);

export function MailStoreProvider({ children }: { children: ReactNode }) {
  const [mailMessages, setMailMessages] = useState<MailMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

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

  const markRead = useCallback((id: string) => {
    setMailMessages((current) => current.some((mail) => mail.id === id && mail.unread) ? current.map((mail) => mail.id === id ? { ...mail, unread: false } : mail) : current);
  }, []);
  const toggleStar = useCallback((id: string) => {
    setMailMessages((current) => current.map((mail) => mail.id === id ? { ...mail, starred: !mail.starred } : mail));
  }, []);
  const addSentMessage = useCallback((message: MailMessage) => setMailMessages((current) => [message, ...current]), []);
  const value = useMemo(() => ({ messages: mailMessages, markRead, toggleStar, addSentMessage }), [mailMessages, markRead, toggleStar, addSentMessage]);

  return <MailStoreContext.Provider value={value}>{children}</MailStoreContext.Provider>;
}

export function useMailStore() {
  const value = useContext(MailStoreContext);
  if (!value) throw new Error("useMailStore must be used inside MailStoreProvider");
  return value;
}
