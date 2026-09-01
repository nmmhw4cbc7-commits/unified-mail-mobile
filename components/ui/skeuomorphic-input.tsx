import React from "react";
import { View, TextInput, type TextInputProps, StyleSheet } from "react-native";
import { SkeuomorphicCard } from "@/components/ui/skeuomorphic";
import { cn } from "@/lib/utils";

export function SkeuomorphicInput({ style, ...props }: TextInputProps) {
  return (
    <SkeuomorphicCard style={[styles.card]}>
      <TextInput style={[styles.input, style] as any} placeholderTextColor="#9a8f84" {...props} />
    </SkeuomorphicCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, borderRadius: 12 },
  input: { paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, color: "#2b2b2b" },
});
