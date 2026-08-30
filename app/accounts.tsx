import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { providerLabel } from "@/lib/mail-data";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { getDeviceId } from "@/lib/device-identity";

const providerColors = { gmail: "#E95C5C", outlook: "#3A78D4", icloud: "#8B72D8", imap: "#26A69A" } as const;

type Account = { id: number; provider: keyof typeof providerColors; email: string; displayName: string | null };

export default function AccountsScreen() {
  const colors = useColors();
  const [deviceId, setDeviceId] = useState("");
  useEffect(() => { getDeviceId().then(setDeviceId); }, []);
  const { data } = trpc.mail.accounts.useQuery({ deviceId }, { enabled: deviceId.length >= 16 });
  const connectedAccounts = (data ?? []) as Account[];
  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.icon, pressed && styles.pressed]}><IconSymbol name="chevron.left" size={25} color={colors.foreground} /></Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Konten</Text><View style={styles.icon} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.intro, { color: colors.muted }]}>Verwalte deine verbundenen Postfächer. Konten werden ausschließlich nach einer erfolgreichen Nutzeranmeldung angezeigt.</Text>
        {connectedAccounts.length === 0 ? <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}><IconSymbol name="tray.fill" size={24} color={colors.muted} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Noch kein Konto verbunden</Text><Text style={[styles.emptyText, { color: colors.muted }]}>Füge dein erstes Postfach hinzu, um die Unified Inbox zu aktivieren.</Text></View> : connectedAccounts.map((account) => <AccountCard key={account.id} account={account} colors={colors} />)}
        <Pressable onPress={() => router.push("/add-account")} style={({ pressed }) => [styles.addCard, { borderColor: colors.primary }, pressed && styles.pressed]}><View style={[styles.plus, { backgroundColor: `${colors.primary}14` }]}><IconSymbol name="plus" size={22} color={colors.primary} /></View><View><Text style={[styles.addTitle, { color: colors.primary }]}>Konto hinzufügen</Text><Text style={[styles.addSubtitle, { color: colors.muted }]}>Gmail, Outlook, iCloud oder IMAP</Text></View></Pressable>
        <View style={[styles.securityNote, { backgroundColor: colors.surface }]}><IconSymbol name="lock.fill" size={18} color={colors.primary} /><Text style={[styles.securityText, { color: colors.muted }]}>Zugangsdaten werden verschlüsselt und nutzerbezogen verarbeitet.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

function AccountCard({ account, colors }: { account: Account; colors: ReturnType<typeof useColors> }) {
  const color = providerColors[account.provider];
  const label = account.displayName ?? account.email;
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={[styles.providerIcon, { backgroundColor: `${color}20` }]}><Text style={[styles.providerLetter, { color }]}>{account.email[0].toUpperCase()}</Text></View><View style={styles.cardText}><Text style={[styles.accountName, { color: colors.foreground }]}>{label}</Text><Text style={[styles.email, { color: colors.muted }]}>{account.email}</Text><View style={styles.statusRow}><View style={[styles.statusDot, { backgroundColor: colors.success }]} /><Text style={[styles.status, { color: colors.success }]}>Verbunden · {providerLabel[account.provider]}</Text></View></View><Pressable accessibilityLabel={`${label} Optionen`} style={({ pressed }) => [styles.more, pressed && styles.pressed]}><IconSymbol name="ellipsis" size={21} color={colors.muted} /></Pressable></View>;
}

const styles = StyleSheet.create({ header: { height: 58, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }, icon: { width: 42, height: 42, justifyContent: "center" }, title: { fontSize: 17, fontWeight: "800" }, content: { padding: 20, paddingBottom: 40 }, intro: { fontSize: 14, lineHeight: 21, marginBottom: 20 }, empty: { borderWidth: 1, borderRadius: 17, padding: 20, alignItems: "center", marginBottom: 12 }, emptyTitle: { fontSize: 16, fontWeight: "800", marginTop: 12 }, emptyText: { fontSize: 13, textAlign: "center", lineHeight: 19, marginTop: 6 }, card: { borderWidth: 1, borderRadius: 17, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 10 }, providerIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 12 }, providerLetter: { fontSize: 20, fontWeight: "800" }, cardText: { flex: 1 }, accountName: { fontSize: 15, fontWeight: "800" }, email: { fontSize: 12, marginTop: 3 }, statusRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 }, statusDot: { width: 6, height: 6, borderRadius: 3 }, status: { fontSize: 11, fontWeight: "700" }, more: { padding: 8 }, addCard: { borderWidth: 1.5, borderStyle: "dashed", borderRadius: 17, padding: 15, flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 }, plus: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" }, addTitle: { fontWeight: "800", fontSize: 15 }, addSubtitle: { fontSize: 12, marginTop: 3 }, securityNote: { flexDirection: "row", gap: 9, padding: 15, borderRadius: 14, marginTop: 24 }, securityText: { flex: 1, fontSize: 12, lineHeight: 18 }, pressed: { opacity: 0.65 } });
