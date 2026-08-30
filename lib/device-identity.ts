import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "unified-mail-device-id";

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export async function getDeviceId() {
  const stored = Platform.OS === "web" ? await AsyncStorage.getItem(KEY) : await SecureStore.getItemAsync(KEY);
  if (stored) return stored;
  const created = randomId();
  if (Platform.OS === "web") await AsyncStorage.setItem(KEY, created);
  else await SecureStore.setItemAsync(KEY, created);
  return created;
}
