import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { accounts, getAccount } from "@/lib/mail-data";
import { useMailStore } from "@/lib/mail-store";
import { useColors } from "@/hooks/use-colors";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function InboxScreen() {
  const colors = useColors();
  const { messages, markRead } = useMailStore();
  const [query, setQuery] = useState("");
  const [activeAccount, setActiveAccount] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = useMemo(() => messages.filter((mail) => {
    const matchesAccount = activeAccount === "all" || mail.accountId === activeAccount;
    const haystack = `${mail.senderName} ${mail.senderEmail} ${mail.subject} ${mail.preview}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    return matchesAccount && matchesQuery && (!unreadOnly || mail.unread);
  }), [activeAccount, query, unreadOnly, messages]);

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>DEIN POSTEINGANG</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Alle Mails</Text>
        </View>
        <Pressable accessibilityLabel="Konten öffnen" onPress={() => router.push("/accounts")} style={({ pressed }) => [styles.avatarButton, { backgroundColor: colors.foreground }, pressed && styles.pressed]}>
          <Text style={[styles.avatarText, { color: colors.background }]}>A</Text>
        </Pressable>
      </View>

      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Mails durchsuchen" placeholderTextColor={colors.muted} style={[styles.searchInput, { color: colors.foreground }]} returnKeyType="search" />
        {query.length > 0 && <Pressable onPress={() => setQuery("")} style={({ pressed }) => pressed && styles.pressed}><IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} /></Pressable>}
      </View>

      <View style={styles.filterRow}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={[{ id: "all", label: "Alle" }, ...accounts.map((a) => ({ id: a.id, label: a.name }))]} keyExtractor={(item) => item.id} renderItem={({ item }) => {
          const active = item.id === activeAccount;
          return <Pressable onPress={() => setActiveAccount(item.id)} style={({ pressed }) => [styles.chip, { backgroundColor: active ? colors.foreground : colors.surface, borderColor: active ? colors.foreground : colors.border }, pressed && styles.pressed]}><Text style={[styles.chipText, { color: active ? colors.background : colors.muted }]}>{item.label}</Text></Pressable>;
        }} />
        <Pressable accessibilityLabel="Nur ungelesene Mails" onPress={() => setUnreadOnly((value) => !value)} style={({ pressed }) => [styles.filterButton, { borderColor: unreadOnly ? colors.primary : colors.border, backgroundColor: unreadOnly ? `${colors.primary}14` : colors.surface }, pressed && styles.pressed]}>
          <IconSymbol name="line.3.horizontal.decrease.circle" size={18} color={unreadOnly ? colors.primary : colors.muted} />
        </Pressable>
      </View>

      <View style={styles.listHeading}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Posteingang</Text><Text style={[styles.count, { color: colors.muted }]}>{filtered.length} Mails</Text></View>
      <FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
        const account = getAccount(item.accountId);
        return <Pressable onPress={() => { markRead(item.id); router.push(`/mail/${item.id}`); }} style={({ pressed }) => [styles.mailRow, { borderBottomColor: colors.border }, pressed && { opacity: 0.7 }]}>
          <View style={[styles.senderAvatar, { backgroundColor: `${account.color}22` }]}><Text style={[styles.senderInitials, { color: account.color }]}>{initials(item.senderName)}</Text></View>
          <View style={styles.mailContent}>
            <View style={styles.rowBetween}><Text numberOfLines={1} style={[styles.sender, { color: colors.foreground }, item.unread && styles.bold]}>{item.senderName}</Text><Text style={[styles.time, { color: item.unread ? colors.primary : colors.muted }, item.unread && styles.bold]}>{item.timestamp}</Text></View>
            <View style={styles.rowBetween}><Text numberOfLines={1} style={[styles.subject, { color: colors.foreground }, item.unread && styles.bold]}>{item.subject}</Text>{item.starred && <IconSymbol name="star.fill" size={15} color="#E2A62C" />}</View>
            <Text numberOfLines={1} style={[styles.preview, { color: colors.muted }]}>{item.preview}</Text>
            <View style={styles.metaRow}><View style={[styles.accountDot, { backgroundColor: account.color }]} /><Text style={[styles.accountName, { color: colors.muted }]}>{account.name}</Text>{item.hasAttachment && <IconSymbol name="paperclip" size={14} color={colors.muted} />}</View>
          </View>
        </Pressable>;
      }} ListEmptyComponent={<View style={styles.empty}><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Keine passenden Mails</Text><Text style={[styles.emptyText, { color: colors.muted }]}>Versuche einen anderen Suchbegriff oder Filter.</Text></View>} />
      <Pressable accessibilityLabel="Neue Mail verfassen" onPress={() => router.push("/compose")} style={({ pressed }) => [styles.compose, { backgroundColor: colors.primary }, pressed && styles.pressed]}><IconSymbol name="square.and.pencil" size={22} color="#FFFFFF" /></Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 12, paddingBottom: 22 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }, title: { fontSize: 32, fontWeight: "800", letterSpacing: -1.1, marginTop: 5 }, avatarButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" }, avatarText: { fontSize: 16, fontWeight: "800" }, searchBox: { height: 48, borderWidth: 1, borderRadius: 15, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 9 }, searchInput: { flex: 1, fontSize: 15 }, filterRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 16 }, chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, marginRight: 7 }, chipText: { fontSize: 13, fontWeight: "700" }, filterButton: { width: 36, height: 36, borderWidth: 1, borderRadius: 18, alignItems: "center", justifyContent: "center" }, listHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8 }, sectionTitle: { fontSize: 18, fontWeight: "800" }, count: { fontSize: 12 }, list: { paddingBottom: 90 }, mailRow: { flexDirection: "row", gap: 12, paddingVertical: 15, borderBottomWidth: 1 }, senderAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" }, senderInitials: { fontWeight: "800", fontSize: 13 }, mailContent: { flex: 1, minWidth: 0 }, rowBetween: { flexDirection: "row", alignItems: "center", gap: 8 }, sender: { flex: 1, fontSize: 14 }, subject: { flex: 1, fontSize: 14, marginTop: 3 }, preview: { fontSize: 13, marginTop: 4, lineHeight: 18 }, time: { fontSize: 12 }, bold: { fontWeight: "800" }, metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 }, accountDot: { width: 6, height: 6, borderRadius: 3 }, accountName: { fontSize: 11, flex: 1 }, compose: { position: "absolute", right: 20, bottom: 22, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", shadowColor: "#122033", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 5 }, pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] }, empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 30 }, emptyTitle: { fontSize: 18, fontWeight: "800" }, emptyText: { textAlign: "center", marginTop: 7, lineHeight: 20 },});
