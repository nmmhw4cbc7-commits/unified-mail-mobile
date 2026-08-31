import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getDeviceId } from "@/lib/device-identity";
import { trpc } from "@/lib/trpc";
import { useMailStore } from "@/lib/mail-store";
import { validateComposeFields } from "@/lib/compose-utils";
import { useColors } from "@/hooks/use-colors";

export default function ComposeScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ replyTo?: string; subject?: string }>();
  const { addSentMessage } = useMailStore();
  const [deviceId, setDeviceId] = useState("");
  const accountQuery = trpc.mail.accounts.useQuery({ deviceId }, { enabled: deviceId.length >= 16 });
  const sendMutation = trpc.mail.send.useMutation();
  const connectedAccounts = accountQuery.data ?? [];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState(params.replyTo ?? "");
  const [subject, setSubject] = useState(params.subject ?? "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => { getDeviceId().then(setDeviceId).catch(() => undefined); }, []);
  useEffect(() => { if (!from && connectedAccounts[0]) setFrom(connectedAccounts[0].email); }, [connectedAccounts, from]);
  const saveDraft = async () => {
    await AsyncStorage.setItem("unified-mail-draft", JSON.stringify({ from, to: to.trim(), subject: subject.trim(), body: body.trim(), savedAt: new Date().toISOString() }));
    Alert.alert("Entwurf gespeichert", "Der aktuelle Entwurf wurde auf diesem Gerät gespeichert.");
  };
  const send = async () => {
    const account = connectedAccounts.find((item) => item.email === from);
    if (!account || !from) { Alert.alert("Kein Postfach verbunden", "Verbinde zuerst ein E-Mail-Konto, bevor du eine Nachricht verfasst."); return; }
    if (!validateComposeFields(to, subject, body)) { Alert.alert("Noch nicht vollständig", "Bitte ergänze Empfänger, Betreff und Nachricht."); return; }
    setSending(true);
    try {
      const result = await sendMutation.mutateAsync({ deviceId, accountId: account.id, to: to.trim(), subject: subject.trim(), body: body.trim() });
      addSentMessage({ id: `sent-${Date.now()}`, accountId: String(account.id), senderName: "Du", senderEmail: from, recipients: [to.trim()], subject: subject.trim(), preview: body.trim(), body: body.trim(), timestamp: "Jetzt", dateLabel: "Heute", unread: false, starred: false });
      Alert.alert("Vom Provider angenommen", `Die Nachricht wurde an ${result.provider === "gmail" ? "Gmail" : "Outlook"} übergeben. Die Zustellung beim Empfänger kann je nach Provider etwas dauern.`, [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert("Versand nicht möglich", error instanceof Error ? error.message : "Der Provider konnte die Nachricht nicht senden.");
    } finally { setSending(false); }
  };
  return <ScreenContainer edges={["top", "left", "right", "bottom"]}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}><IconSymbol name="xmark" size={22} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>{params.replyTo ? "Antworten" : "Neue Mail"}</Text><Pressable disabled={sending} onPress={send} style={({ pressed }) => [styles.sendButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}><Text style={styles.sendText}>{sending ? "…" : "Senden"}</Text></Pressable></View>
      <View style={styles.form}>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.muted }]}>Von</Text><Pressable disabled={connectedAccounts.length < 2} accessibilityState={{ disabled: connectedAccounts.length < 2 }} onPress={() => { if (connectedAccounts.length > 1) setFrom(from === connectedAccounts[0]?.email ? connectedAccounts[1].email : connectedAccounts[0].email); }} style={({ pressed }) => [styles.accountSelect, pressed && styles.pressed]}><Text numberOfLines={1} style={[styles.value, { color: colors.foreground }]}>{from}</Text><IconSymbol name="chevron.down" size={15} color={colors.muted} /></Pressable></View>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.muted }]}>An</Text><TextInput value={to} onChangeText={setTo} placeholder="name@beispiel.de" placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="email-address" style={[styles.input, { color: colors.foreground }]} /></View>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.muted }]}>Betreff</Text><TextInput value={subject} onChangeText={setSubject} placeholder="Betreff" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground }]} /></View>
        <TextInput value={body} onChangeText={setBody} placeholder="Nachricht schreiben …" placeholderTextColor={colors.muted} multiline textAlignVertical="top" style={[styles.bodyInput, { color: colors.foreground }]} />
      </View>
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}><View style={styles.bottomAction}><IconSymbol name="paperclip" size={21} color={colors.muted} /><Text style={[styles.bottomLabel, { color: colors.muted }]}>Anhänge folgen</Text></View><Pressable accessibilityRole="button" onPress={saveDraft} style={({ pressed }) => [styles.bottomAction, pressed && styles.pressed]}><IconSymbol name="doc" size={21} color={colors.primary} /><Text style={[styles.bottomLabel, { color: colors.foreground }]}>Entwurf speichern</Text></Pressable></View>
    </KeyboardAvoidingView>
  </ScreenContainer>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, header: { height: 58, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, headerButton: { width: 42, height: 42, justifyContent: "center" }, title: { fontWeight: "800", fontSize: 16 }, sendButton: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 9 }, sendText: { color: "#FFF", fontWeight: "800", fontSize: 13 }, form: { paddingHorizontal: 20, flex: 1 }, fieldRow: { minHeight: 54, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, gap: 14 }, label: { width: 43, fontSize: 14 }, value: { flex: 1, fontSize: 14 }, accountSelect: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, input: { flex: 1, fontSize: 15, paddingVertical: 14 }, bodyInput: { flex: 1, fontSize: 16, lineHeight: 25, paddingTop: 20 }, bottomBar: { borderTopWidth: 1, flexDirection: "row", padding: 14, gap: 22 }, bottomAction: { flexDirection: "row", alignItems: "center", gap: 7 }, bottomLabel: { fontSize: 12 }, pressed: { opacity: 0.65, transform: [{ scale: 0.98 }] } });
