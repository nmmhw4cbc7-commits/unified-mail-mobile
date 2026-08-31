import { ScrollView, StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function TermsScreen() {
  const colors = useColors();
  return <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5"><ScrollView contentContainerStyle={styles.content}><Text style={[styles.title, { color: colors.foreground }]}>Nutzungsbedingungen</Text><Text style={[styles.copy, { color: colors.foreground }]}>Unified Mail ist ein Werkzeug zum Verbinden und Verwalten eigener E-Mail-Konten. Du bist dafür verantwortlich, nur Konten zu verbinden, für die du eine Berechtigung besitzt, und die Versandfunktionen rechtmäßig zu verwenden.</Text><Text style={[styles.copy, { color: colors.foreground }]}>Provider können Zugriffe, Versandlimits oder Zustellzeiten unabhängig von Unified Mail begrenzen. Die Nutzung erfolgt unter Beachtung der Bedingungen des jeweiligen E-Mail-Anbieters.</Text></ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { paddingVertical: 36, gap: 18 }, title: { fontSize: 28, fontWeight: "800" }, copy: { fontSize: 16, lineHeight: 25 } });
