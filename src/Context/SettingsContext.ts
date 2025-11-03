import { createContext } from "react";
interface SettingsContextProps {
  theme: string;
  alwaysShowChatBar: boolean;
}
export const SettingsContext = createContext<{
  settings: SettingsContextProps;
  setSettings: (settings: SettingsContextProps) => unknown;
}>({
  settings: {
    theme: "dark",
    alwaysShowChatBar: false,
  },
  setSettings: () => {},
});
