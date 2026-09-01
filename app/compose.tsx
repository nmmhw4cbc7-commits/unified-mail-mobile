import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getDeviceId } from "@/lib/device-identity";
import { trpc } from "@/lib/trpc";
import { useMailStore } from "@/lib/mail-store";
import { validateComposeFields } from "@/lib/compose-utils";
import { useColors } from "@/hooks/use-colors";
import { SkeuomorphicInput } from "@/components/ui/skeuomorphic-input";
import { SkeuomorphicButton } from "@/components/ui/skeuomorphic";

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
      addSentMessage({ id: `sent-${Date.now()}`, accountId: String(account.id), senderName: "Du", senderEmail: from, recipients: [to.trim()], subject: subject.trim(), preview: body.trim(), body: body.trim(), sentAt: new Date().toISOString() });
      Alert.alert("Vom Provider angenommen", `Die Nachricht wurde an ${result.provider === "gmail" ? "Gmail" : "Outlook"} übergeben. Die Zustellung beim Empfänger kann je nach Provider etwas dauern.`);
      router.back();
    } catch (error) {
      Alert.alert("Versand nicht möglich", error instanceof Error ? error.message : "Der Provider konnte die Nachricht nicht senden.");
    } finally { setSending(false); }
  };
  return <ScreenContainer edges={["top", "left", "right", "bottom"]}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <SkeuomorphicButton title="Zurück" onPress={() => router.back()} style={styles.headerButton} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Verfassen</Text>
        <SkeuomorphicButton title="Speichern" onPress={saveDraft} style={styles.headerButton} />
      </View>
      <View style={styles.form}>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>Von</Text>
          <SkeuomorphicInput value={from} onChangeText={setFrom} placeholder="Absender" />
        </View>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>An</Text>
          <SkeuomorphicInput value={to} onChangeText={setTo} placeholder="to@example.com" keyboardType="email-address" />
        </View>
        <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.muted }]}>Betreff</Text>
          <SkeuomorphicInput value={subject} onChangeText={setSubject} placeholder="Betreff" />
        </View>
        <SkeuomorphicInput value={body} onChangeText={setBody} placeholder="Nachricht schreiben …" multiline style={{ height: 160 }} />
      </View>
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <SkeuomorphicButton title="Anhang" onPress={() => Alert.alert("Anhang", "Anhänge werden in Kürze unterstützt.")} style={styles.bottomAction} />
        <SkeuomorphicButton title={sending ? "Senden…" : "Senden"} onPress={send} style={styles.sendButton} />
      </View>
    </KeyboardAvoidingView>
  </ScreenContainer>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, header: { height: 58, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, headerButton: { width: 110 }, headerTitle: { fontSize: 16, fontWeight: "700" }, form: { padding: 16, flex: 1 }, fieldRow: { paddingVertical: 8, borderBottomWidth: 1 }, label: { fontSize: 12, marginBottom: 6 }, bodyInput: { flex: 1 }, bottomBar: { height: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, bottomAction: { flex: 1, marginRight: 12 }, sendButton: { width: 140 } });
