import React from "react";
import { View, Text, Pressable, type ViewProps, type PressableProps, StyleSheet } from "react-native";
import { cn } from "@/lib/utils";

export interface SkeuomorphicCardProps extends ViewProps {
  inset?: boolean; // if true, render an inset (pressed) look
}

export function SkeuomorphicCard({ children, style, inset = false, ...props }: SkeuomorphicCardProps) {
  return (
    <View style={[styles.outer, inset ? styles.outerInset : styles.outerRaised] as any} {...props}>
      <View style={[styles.inner, inset ? styles.innerInset : styles.innerRaised, style] as any}>{children}</View>
    </View>
  );
}

export interface SkeuomorphicButtonProps extends PressableProps {
  title?: string;
}

export function SkeuomorphicButton({ title, children, style, ...props }: SkeuomorphicButtonProps) {
  return (
    <Pressable
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      style={({ pressed }) => [styles.buttonBase, pressed ? styles.buttonPressed : styles.buttonNormal, style] as any}
      {...props}
    >
      {title ? <Text style={styles.buttonText}>{title}</Text> : children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 16,
    padding: 2,
    marginVertical: 8,
  },
  outerRaised: {
    backgroundColor: "#efe9e2",
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  outerInset: {
    backgroundColor: "#e7e1da",
    shadowColor: "#fff",
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 1,
  },
  inner: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
  },
  innerRaised: {
    shadowColor: "#fff",
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  innerInset: {
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    backgroundColor: "#efe9e2",
  },
  buttonBase: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNormal: {
    backgroundColor: "#f8efe6",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: "#e6dcd2",
    shadowColor: "#fff",
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonText: {
    color: "#2b2b2b",
    fontWeight: "600",
    fontSize: 16,
  },
});
