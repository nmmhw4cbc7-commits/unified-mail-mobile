// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "tray.fill": "inbox",
  "gearshape.fill": "settings",
  "magnifyingglass": "search",
  "xmark.circle.fill": "cancel",
  "line.3.horizontal.decrease.circle": "filter-list",
  "star.fill": "star",
  "star": "star-border",
  "paperclip": "attach-file",
  "square.and.pencil": "edit",
  "chevron.left": "chevron-left",
  "chevron.down": "keyboard-arrow-down",
  "chevron.right": "chevron-right",
  "ellipsis": "more-horiz",
  "doc.fill": "description",
  "doc": "insert-drive-file",
  "arrow.down.circle": "file-download",
  "arrowshape.turn.up.left.fill": "reply",
  "arrowshape.turn.up.right.fill": "forward",
  "xmark": "close",
  "plus": "add",
  "lock.fill": "lock",
  "bell.fill": "notifications",
  "moon.fill": "dark-mode",
  "person.crop.circle.fill": "account-circle",
  "arrow.triangle.2.circlepath": "sync",
  "questionmark.circle.fill": "help",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
