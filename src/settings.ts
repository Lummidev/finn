const defaults = {
  theme: "dark",
  accentColor: "blue",
  alwaysShowChatBar: false,
};

export class Settings {
  private static getSetting(key: string): string | null {
    return localStorage.getItem(key);
  }
  private static setSetting(key: string, value: unknown) {
    return localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  }
  private static setDataAttribute(attribute: string, value: string) {
    document.querySelector("body")?.setAttribute(`data-${attribute}`, value);
  }
  public static get theme(): string | null {
    return Settings.getSetting("theme");
  }
  public static set theme(value: string) {
    Settings.setSetting("theme", value);
    Settings.setDataAttribute("theme", value);
  }
  public static get accentColor(): string | null {
    return Settings.getSetting("accentColor") ?? "blue";
  }
  public static set accentColor(value: string) {
    Settings.setSetting("accentColor", value);
    document.querySelector("body")?.setAttribute("data-accentcolor", value);
  }
  public static get alwaysShowChatBar(): boolean | null {
    try {
      const saved = Settings.getSetting("alwaysShowChatBar");
      if (saved === null) return null;
      const parsed: unknown = JSON.parse(saved);
      if (typeof parsed === "boolean") {
        return parsed;
      }
      throw new Error("alwaysShowChatBar not a boolean");
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  public static set alwaysShowChatBar(value: boolean) {
    Settings.setSetting("alwaysShowChatBar", value);
  }
  public static load() {
    const theme = Settings.theme ?? defaults.theme;
    const accentColor = Settings.accentColor ?? defaults.accentColor;
    const alwaysShowChatBar =
      Settings.alwaysShowChatBar ?? defaults.alwaysShowChatBar;
    this.setDataAttribute("theme", theme);
    this.setDataAttribute("accentcolor", accentColor);
    return { theme, accentColor, alwaysShowChatBar };
  }
}
