import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { accounts } from "@/lib/mail-data";
import { useMailStore } from "@/lib/mail-store";
import { validateComposeFields } from "@/lib/compose-utils";
import { useColors } from "@/hooks/use-colors";

export default function ComposeScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ replyTo?: string; subject?: string }>();
  const { addSentMessage } = useMailStore();
  const [from, setFrom] = useState(accounts[0]?.email ?? "");
  const [to, setTo] = useState(params.replyTo ?? "");
  const [subject, setSubject] = useState(params.subject ?? "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const send = () => {
    if (accounts.length === 0 || !from) { Alert.alert("Kein Postfach verbunden", "Verbinde zuerst ein E-Mail-Konto, bevor du eine Nachricht verfasst."); return; }
    if (!validateComposeFields(to, subject, body)) { Alert.alert("Noch nicht vollständig", "Bitte ergänze Empfänger, Betreff und Nachricht."); return; }
    setSending(true);
    setTimeout(() => {
      const account = accounts.find((item) => item.email === from);
      if (!account) { setSending(false); return; }
      addSentMessage({ id: `sent-${Date.now()}`, accountId: account.id, senderName: "Du", senderEmail: from, recipients: [to.trim()], subject: subject.trim(), preview: body.trim(), body: body.trim(), timestamp: "Jetzt", dateLabel: "Heute", unread: false, starred: false });
      setSending(false);
      Alert.alert("Gesendet", `Deine Nachricht wurde über ${from} versendet.`, [{ text: "OK", onPress: () => router.back() }]);
    }, 500);
  };
  return <ScreenContainer edges={["top", "left", "right", "bottom"]}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}><IconSymbol name="xmark" size={22} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>{params.replyTo ? "Antworten" : "Neue Mail"}</Text><Pressable disabled={sending} onPress={send} style={({ pressed }) => [styles.sendButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.sendText}>{sending ? "…" : "Senden"}</Text></Pressable></View>
      <View style={styles.form}>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.muted }]}>Von</Text><Pressable onPress={() => setFrom(from === accounts[0].email ? accounts[1].email : accounts[0].email)} style={({ pressed }) => [styles.accountSelect, pressed && styles.pressed]}><Text numberOfLines={1} style={[styles.value, { color: colors.foreground }]}>{from}</Text><IconSymbol name="chevron.down" size={15} color={colors.muted} /></Pressable></View>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.muted }]}>An</Text><TextInput value={to} onChangeText={setTo} placeholder="name@beispiel.de" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" style={[styles.input, { color: colors.foreground }]} /></View>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.muted }]}>Betreff</Text><TextInput value={subject} onChangeText={setSubject} placeholder="Betreff" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground }]} /></View>
        <TextInput value={body} onChangeText={setBody} placeholder="Nachricht schreiben …" placeholderTextColor={colors.muted} multiline textAlignVertical="top" style={[styles.bodyInput, { color: colors.foreground }]} />
      </View>
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}><Pressable style={({ pressed }) => [styles.bottomAction, pressed && styles.pressed]}><IconSymbol name="paperclip" size={21} color={colors.muted} /><Text style={[styles.bottomLabel, { color: colors.muted }]}>Anhang</Text></Pressable><Pressable style={({ pressed }) => [styles.bottomAction, pressed && styles.pressed]}><IconSymbol name="doc" size={21} color={colors.muted} /><Text style={[styles.bottomLabel, { color: colors.muted }]}>Entwurf speichern</Text></Pressable></View>
    </KeyboardAvoidingView>
  </ScreenContainer>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, header: { height: 58, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, headerButton: { width: 42, height: 42, justifyContent: "center" }, title: { fontWeight: "800", fontSize: 16 }, sendButton: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 16 }, sendText: { color: "#FFF", fontWeight: "800", fontSize: 13 }, form: { paddingHorizontal: 20, flex: 1 }, fieldRow: { minHeight: 54, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, gap: 14 }, label: { width: 43, fontSize: 14 }, value: { flex: 1, fontSize: 14 }, accountSelect: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, input: { flex: 1, fontSize: 15, paddingVertical: 14 }, bodyInput: { flex: 1, fontSize: 16, lineHeight: 25, paddingTop: 20 }, bottomBar: { borderTopWidth: 1, flexDirection: "row", padding: 14, gap: 22 }, bottomAction: { flexDirection: "row", alignItems: "center", gap: 7 }, bottomLabel: { fontSize: 12 }, pressed: { opacity: 0.65, transform: [{ scale: 0.98 }] } });
