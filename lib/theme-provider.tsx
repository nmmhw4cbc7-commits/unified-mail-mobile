import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";
import { SchemeColors, type ColorScheme } from "@/constants/theme";

export type ThemePreference = ColorScheme | "system";
type ThemeContextValue = { colorScheme: ColorScheme; preference: ThemePreference; setPreference: (preference: ThemePreference) => void; setColorScheme: (scheme: ColorScheme) => void };
const THEME_KEY = "unified-mail:theme-preference:v1";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const colorScheme: ColorScheme = preference === "system" ? systemScheme : preference;

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      Object.entries(SchemeColors[scheme]).forEach(([token, value]) => root.style.setProperty(`--color-${token}`, value));
    }
  }, []);

  useEffect(() => { AsyncStorage.getItem(THEME_KEY).then((value) => { if (value === "light" || value === "dark" || value === "system") setPreferenceState(value); }).catch(() => undefined); }, []);
  useEffect(() => { applyScheme(colorScheme); }, [applyScheme, colorScheme]);

  const setPreference = useCallback((next: ThemePreference) => { setPreferenceState(next); AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined); }, []);
  const themeVariables = useMemo(() => vars(Object.fromEntries(Object.entries(SchemeColors[colorScheme]).map(([token, value]) => [`color-${token}`, value]))), [colorScheme]);
  const setColorScheme = useCallback((scheme: ColorScheme) => setPreference(scheme), [setPreference]);
  const value = useMemo(() => ({ colorScheme, preference, setPreference, setColorScheme }), [colorScheme, preference, setPreference, setColorScheme]);
  return <ThemeContext.Provider value={value}><View style={[{ flex: 1 }, themeVariables]}>{children}</View></ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
