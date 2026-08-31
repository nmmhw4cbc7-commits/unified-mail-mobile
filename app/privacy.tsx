import { ScrollView, StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function PrivacyScreen() {
  const colors = useColors();
  return <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5"><ScrollView contentContainerStyle={styles.content}><Text style={[styles.title, { color: colors.foreground }]}>Datenschutz</Text><Text style={[styles.copy, { color: colors.foreground }]}>Unified Mail verarbeitet verbundene E-Mail-Konten ausschließlich, um Nachrichten anzuzeigen und auf ausdrücklichen Wunsch zu versenden. OAuth-Tokens werden serverseitig verschlüsselt gespeichert. Passwörter werden von Unified Mail nicht gespeichert.</Text><Text style={[styles.copy, { color: colors.foreground }]}>Du kannst verbundene Konten jederzeit in der Kontenansicht entfernen. Für Fragen zur Datenverarbeitung nutze bitte die Kontaktmöglichkeit des Projekts.</Text></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { paddingVertical: 36, gap: 18 }, title: { fontSize: 28, fontWeight: "800" }, copy: { fontSize: 16, lineHeight: 25 } });
