import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import * as WebBrowser from "expo-web-browser";

const providers = [
  { id: "gmail", name: "Gmail", detail: "Google-Konto verbinden", color: "#E95C5C", icon: "G" },
  { id: "outlook", name: "Outlook", detail: "Microsoft 365 oder Outlook.com", color: "#3A78D4", icon: "O" },
  { id: "icloud", name: "iCloud Mail", detail: "Apple Mail-Adresse", color: "#8B72D8", icon: "i" },
  { id: "imap", name: "Anderer Anbieter", detail: "IMAP / SMTP manuell einrichten", color: "#26A69A", icon: "@" },
];

export default function AddAccountScreen() {
  const colors = useColors();
  const oauthStart = trpc.mail.oauthStart.useMutation();
  const choose = async (providerId: string, name: string) => {
    if (providerId !== "gmail" && providerId !== "outlook") { Alert.alert("In Vorbereitung", `${name} wird als nächster Provider über IMAP/SMTP ergänzt.`); return; }
    try {
      const result = await oauthStart.mutateAsync({ provider: providerId });
      await WebBrowser.openBrowserAsync(result.authorizationUrl);
    } catch (error) {
      Alert.alert("Verbindung nicht möglich", error instanceof Error ? error.message : "Bitte melde dich zuerst an und versuche es erneut.");
    }
  };
  return <ScreenContainer edges={["top", "left", "right", "bottom"]}><View style={[styles.header, { borderBottomColor: colors.border }]}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.icon, pressed && styles.pressed]}><IconSymbol name="chevron.left" size={25} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>Konto hinzufügen</Text><View style={styles.icon} /></View><ScrollView contentContainerStyle={styles.content}><Text style={[styles.heading, { color: colors.foreground }]}>Welches Konto möchtest du verbinden?</Text><Text style={[styles.intro, { color: colors.muted }]}>Wähle deinen Anbieter. Deine Anmeldung findet direkt beim jeweiligen Dienst statt.</Text>{providers.map((provider) => <Pressable key={provider.id} onPress={() => choose(provider.id, provider.name)} style={({ pressed }) => [styles.provider, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.providerIcon, { backgroundColor: `${provider.color}20` }]}><Text style={[styles.providerLetter, { color: provider.color }]}>{provider.icon}</Text></View><View style={styles.providerText}><Text style={[styles.providerName, { color: colors.foreground }]}>{provider.name}</Text><Text style={[styles.providerDetail, { color: colors.muted }]}>{provider.detail}</Text></View><IconSymbol name="chevron.right" size={19} color={colors.muted} /></Pressable>)}<View style={[styles.note, { backgroundColor: `${colors.primary}10` }]}><IconSymbol name="lock.fill" size={18} color={colors.primary} /><Text style={[styles.noteText, { color: colors.foreground }]}>Unified Mail speichert keine Passwörter. Provider-Zugriffe können jederzeit in den Kontoeinstellungen widerrufen werden.</Text></View></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ header: { height: 58, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, icon: { width: 42, height: 42, justifyContent: "center" }, title: { fontSize: 17, fontWeight: "800" }, content: { padding: 20 }, heading: { fontSize: 24, fontWeight: "800", lineHeight: 30, letterSpacing: -0.4 }, intro: { fontSize: 14, lineHeight: 21, marginTop: 9, marginBottom: 24 }, provider: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 17, padding: 15, marginBottom: 10 }, providerIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 12 }, providerLetter: { fontSize: 20, fontWeight: "800" }, providerText: { flex: 1 }, providerName: { fontSize: 15, fontWeight: "800" }, providerDetail: { fontSize: 12, marginTop: 3 }, note: { borderRadius: 15, padding: 15, flexDirection: "row", gap: 10, marginTop: 18 }, noteText: { flex: 1, fontSize: 12, lineHeight: 18 }, pressed: { opacity: 0.65, transform: [{ scale: 0.99 }] } });
