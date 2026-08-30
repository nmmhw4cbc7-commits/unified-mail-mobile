import { useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getAccount } from "@/lib/mail-data";
import { useMailStore } from "@/lib/mail-store";
import { useColors } from "@/hooks/use-colors";

export default function MailDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, markRead, toggleStar } = useMailStore();
  const mail = useMemo(() => messages.find((item) => item.id === id) ?? messages[0], [id, messages]);
  useEffect(() => { if (mail) markRead(mail.id); }, [mail, markRead]);
  if (!mail) return <ScreenContainer edges={["top", "left", "right", "bottom"]}><View style={styles.emptyState}><Text style={[styles.subject, { color: colors.foreground }]}>Nachricht nicht gefunden</Text><Text style={[styles.email, { color: colors.muted }]}>Diese Nachricht ist nicht mehr verfügbar.</Text></View></ScreenContainer>;
  const account = getAccount(mail.accountId);
  if (!account) return <ScreenContainer edges={["top", "left", "right", "bottom"]}><View style={styles.emptyState}><Text style={[styles.subject, { color: colors.foreground }]}>Konto nicht verbunden</Text><Text style={[styles.email, { color: colors.muted }]}>Verbinde das zugehörige Postfach erneut, um diese Nachricht zu sehen.</Text></View></ScreenContainer>;

  return <ScreenContainer edges={["top", "left", "right", "bottom"]}>
    <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
      <Pressable accessibilityLabel="Zurück" onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><IconSymbol name="chevron.left" size={25} color={colors.foreground} /></Pressable>
      <Text style={[styles.topTitle, { color: colors.foreground }]}>Nachricht</Text>
      <Pressable accessibilityLabel="Mehr Optionen" style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><IconSymbol name="ellipsis" size={22} color={colors.foreground} /></Pressable>
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.subjectRow}><Text style={[styles.subject, { color: colors.foreground }]}>{mail.subject}</Text><Pressable accessibilityLabel="Favorit umschalten" onPress={() => toggleStar(mail.id)} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><IconSymbol name={mail.starred ? "star.fill" : "star"} size={21} color={mail.starred ? "#E2A62C" : colors.muted} /></Pressable></View>
      <View style={styles.senderRow}><View style={[styles.avatar, { backgroundColor: `${account.color}22` }]}><Text style={[styles.avatarText, { color: account.color }]}>{mail.senderName.split(" ").map((part) => part[0]).join("")}</Text></View><View style={styles.senderInfo}><Text style={[styles.senderName, { color: colors.foreground }]}>{mail.senderName}</Text><Text style={[styles.email, { color: colors.muted }]}>{mail.senderEmail}</Text></View><Text style={[styles.time, { color: colors.muted }]}>{mail.dateLabel}</Text></View>
      <View style={[styles.accountPill, { backgroundColor: `${account.color}14` }]}><View style={[styles.dot, { backgroundColor: account.color }]} /><Text style={[styles.accountPillText, { color: account.color }]}>Gesendet an {account.email}</Text></View>
      <Text style={[styles.body, { color: colors.foreground }]}>{mail.body}</Text>
      {mail.hasAttachment && <View style={[styles.attachment, { backgroundColor: colors.surface, borderColor: colors.border }]}><IconSymbol name="doc.fill" size={22} color={colors.primary} /><View style={styles.attachmentText}><Text style={[styles.fileName, { color: colors.foreground }]}>Launch-Timeline.pdf</Text><Text style={[styles.fileMeta, { color: colors.muted }]}>PDF · 2,4 MB</Text></View><IconSymbol name="arrow.down.circle" size={22} color={colors.primary} /></View>}
    </ScrollView>
    <View style={[styles.actions, { borderTopColor: colors.border, backgroundColor: colors.background }]}><Pressable onPress={() => router.push({ pathname: "/compose", params: { replyTo: mail.senderEmail, subject: `Re: ${mail.subject}` } })} style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><IconSymbol name="arrowshape.turn.up.left.fill" size={18} color="#FFF" /><Text style={styles.actionText}>Antworten</Text></Pressable><Pressable onPress={() => router.push({ pathname: "/compose", params: { replyTo: mail.senderEmail, subject: `Fwd: ${mail.subject}` } })} style={({ pressed }) => [styles.forwardButton, { borderColor: colors.border }, pressed && styles.pressed]}><IconSymbol name="arrowshape.turn.up.right.fill" size={18} color={colors.foreground} /><Text style={[styles.forwardText, { color: colors.foreground }]}>Weiterleiten</Text></Pressable></View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({ topBar: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingHorizontal: 16 }, iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" }, pressed: { opacity: 0.65 }, topTitle: { fontSize: 16, fontWeight: "700" }, content: { padding: 20, paddingBottom: 130 }, subjectRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" }, subject: { flex: 1, fontSize: 25, fontWeight: "800", lineHeight: 31, letterSpacing: -0.5 }, senderRow: { flexDirection: "row", alignItems: "center", marginTop: 24, gap: 11 }, avatar: { width: 43, height: 43, borderRadius: 22, alignItems: "center", justifyContent: "center" }, avatarText: { fontWeight: "800" }, senderInfo: { flex: 1 }, senderName: { fontSize: 15, fontWeight: "700" }, email: { fontSize: 12, marginTop: 3 }, time: { fontSize: 12 }, accountPill: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, marginTop: 16 }, dot: { width: 6, height: 6, borderRadius: 3 }, accountPillText: { fontSize: 11, fontWeight: "700" }, body: { fontSize: 16, lineHeight: 27, marginTop: 26 }, attachment: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14, padding: 13, marginTop: 24, gap: 11 }, emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }, attachmentText: { flex: 1 }, fileName: { fontSize: 13, fontWeight: "700" }, fileMeta: { fontSize: 12, marginTop: 3 }, actions: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1 }, actionButton: { flex: 1, height: 48, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, actionText: { color: "#FFF", fontWeight: "800" }, forwardButton: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, forwardText: { fontWeight: "800" } });
