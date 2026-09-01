import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SkeuomorphicCard } from "@/components/ui/skeuomorphic";
import { IconSymbol } from "@/components/ui/icon-symbol";

export function SkeuomorphicListRow({ mail, accountColor, onOpen }: any) {
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [{ opacity: pressed ? 0.86 : 1.0 }, styles.container]}>
      <SkeuomorphicCard>
        <View style={styles.inner}>
          <View style={[styles.avatar, { backgroundColor: `${accountColor}22` }]}>
            <Text style={[styles.avatarText, { color: accountColor }]}>{(mail.senderName || mail.senderEmail || "?").charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.sender}>{mail.senderName || mail.senderEmail}</Text>
            <Text style={styles.subject} numberOfLines={1}>{mail.subject}</Text>
          </View>
          <IconSymbol name="chevron.right" size={18} color="#999" />
        </View>
      </SkeuomorphicCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 6 },
  inner: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontWeight: "700" },
  meta: { flex: 1 },
  sender: { fontWeight: "700", fontSize: 14, color: "#2b2b2b" },
  subject: { fontSize: 13, color: "#6b6b6b" },
});
