import { createContext } from "react";
interface SettingsContextProps {
  theme: string;
  alwaysShowChatBar: boolean;
  objectives: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}
export const SettingsContext = createContext<{
  settings: SettingsContextProps;
  setSettings: (settings: SettingsContextProps) => unknown;
}>({
  settings: {
    theme: "dark",
    alwaysShowChatBar: false,
    objectives: {
      daily: 0,
      weekly: 0,
      monthly: 0,
    },
  },
  setSettings: () => {},
});
