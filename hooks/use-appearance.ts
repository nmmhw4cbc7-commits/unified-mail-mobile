import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "appearance:settings";

export function useAppearance() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [reducedEffects, setReducedEffects] = useState(false);
  const [forceHeavy, setForceHeavy] = useState(true); // you asked to force heavy by default

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.mode) setMode(parsed.mode);
          if (typeof parsed.reducedEffects === "boolean") setReducedEffects(parsed.reducedEffects);
          if (typeof parsed.forceHeavy === "boolean") setForceHeavy(parsed.forceHeavy);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const save = async (next: { mode?: "light" | "dark"; reducedEffects?: boolean; forceHeavy?: boolean }) => {
    try {
      const merged = { mode, reducedEffects, forceHeavy, ...next };
      setMode(merged.mode);
      setReducedEffects(Boolean(merged.reducedEffects));
      setForceHeavy(Boolean(merged.forceHeavy));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      // ignore
    }
  };

  return { mode, reducedEffects, forceHeavy, setMode: (m: "light" | "dark") => save({ mode: m }), setReducedEffects: (v: boolean) => save({ reducedEffects: v }), setForceHeavy: (v: boolean) => save({ forceHeavy: v }) };
}
