import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { providerLabel, type Provider } from "@/lib/mail-data";
import { useColors } from "@/hooks/use-colors";

export const PROVIDER_COLORS_KEY = "unified-mail:provider-colors:v1";
const defaults: Record<Provider, string> = { gmail: "#E95C5C", outlook: "#3A78D4", icloud: "#7B61C8", imap: "#159A8C" };
const swatches = ["#E95C5C", "#3A78D4", "#7B61C8", "#159A8C", "#D38B2C", "#5B6B7A"];

export default function ProviderColorsScreen() {
  const colors = useColors();
  const [providerColors, setProviderColors] = useState(defaults);
  useEffect(() => { AsyncStorage.getItem(PROVIDER_COLORS_KEY).then((raw) => { if (raw) setProviderColors({ ...defaults, ...JSON.parse(raw) }); }).catch(() => undefined); }, []);
  const setProviderColor = (provider: Provider, color: string) => { const next = { ...providerColors, [provider]: color }; setProviderColors(next); AsyncStorage.setItem(PROVIDER_COLORS_KEY, JSON.stringify(next)).catch(() => undefined); };
  return <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]}><View style={[styles.header, { borderBottomColor: colors.border }]}><Pressable accessibilityLabel="Zurück" onPress={() => router.back()} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><IconSymbol name="chevron.left" size={24} color={colors.foreground} /></Pressable><Text style={[styles.title, { color: colors.foreground }]}>Anbieterfarben</Text><View style={styles.iconButton} /></View><ScrollView contentContainerStyle={styles.content}><Text style={[styles.intro, { color: colors.muted }]}>Lege für jeden Anbieter eine Farbe fest. Die Farbe erscheint an den Filterkarten und Nachrichten.</Text>{(Object.keys(providerColors) as Provider[]).map((provider) => <View key={provider} style={[styles.row, { borderBottomColor: colors.border }]}><View style={[styles.dot, { backgroundColor: providerColors[provider] }]} /><Text style={[styles.provider, { color: colors.foreground }]}>{providerLabel[provider]}</Text><View style={styles.swatches}>{swatches.map((swatch) => <Pressable key={swatch} accessibilityLabel={`${providerLabel[provider]} ${swatch}`} onPress={() => setProviderColor(provider, swatch)} style={({ pressed }) => [styles.swatch, { backgroundColor: swatch, borderColor: providerColors[provider] === swatch ? colors.foreground : colors.background, borderWidth: providerColors[provider] === swatch ? 2 : 1 }, pressed && styles.pressed]} />)}</View></View>)}</ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ header: { minHeight: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1 }, iconButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" }, title: { fontSize: 18, fontWeight: "800" }, content: { paddingTop: 18, paddingBottom: 28 }, intro: { fontSize: 14, lineHeight: 21, marginBottom: 12 }, row: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1 }, dot: { width: 12, height: 12, borderRadius: 6 }, provider: { fontSize: 15, fontWeight: "700", width: 92 }, swatches: { flex: 1, flexDirection: "row", justifyContent: "flex-end", flexWrap: "wrap", gap: 6 }, swatch: { width: 22, height: 22, borderRadius: 11 }, pressed: { opacity: 0.65 } });
