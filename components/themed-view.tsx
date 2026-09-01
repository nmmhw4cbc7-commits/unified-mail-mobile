import React from "react";
import { ImageBackground, View, type ViewProps, StyleSheet } from "react-native";
import { cn } from "@/lib/utils";
import { useAppearance } from "@/hooks/use-appearance";

export interface ThemedViewProps extends ViewProps {
  className?: string;
  skeuomorphic?: boolean;
}

// Tiny 1x1 PNG data URI (transparent). We use a very low-opacity overlay to create a subtle texture.
const textureDataUri =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

export function ThemedView({ children, style, skeuomorphic, ...otherProps }: ThemedViewProps) {
  const { mode, reducedEffects, forceHeavy } = useAppearance();

  const useSkeuo = typeof skeuomorphic === "boolean" ? skeuomorphic : mode === "light";
  const heavy = forceHeavy || (!reducedEffects && useSkeuo);

  if (!useSkeuo) {
    return (
      <View
        style={[styles.flatBackground, style] as any}
        {...otherProps}
      >
        {children}
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: textureDataUri }}
      resizeMode="repeat"
      style={[styles.textureBackground, heavy ? styles.heavy : styles.soft, style] as any}
      imageStyle={styles.textureImage}
      {...otherProps}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flatBackground: { flex: 1, backgroundColor: "#f7f5f2" },
  textureBackground: { flex: 1, backgroundColor: "#efe9e2" },
  textureImage: { opacity: 0.06 },
  heavy: {
    // stronger inset/outer lighting cues for high realism
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
});
