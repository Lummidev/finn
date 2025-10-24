import { use, useEffect, useState } from "react";
import "./Settings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { SettingsContext } from "../../Context/SettingsContext";
import { Settings as SettingsManager } from "../../settings";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
export const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("blue");
  const [alwaysShowChatBar, setAlwaysShowChatBar] = useState(false);
  const [changed, setChanged] = useState(false);
  const settingsContext = use(SettingsContext);
  const saveSettings = () => {
    SettingsManager.theme = theme;
    SettingsManager.accentColor = accentColor;
    SettingsManager.alwaysShowChatBar = alwaysShowChatBar;
    settingsContext.setSettings({
      ...settingsContext.settings,
      alwaysShowChatBar,
      theme,
    });
    setChanged(false);
  };

  useEffect(() => {
    const { accentColor, alwaysShowChatBar, theme } = SettingsManager.load();
    setTheme(theme);
    setAccentColor(accentColor);
    setAlwaysShowChatBar(alwaysShowChatBar);
  }, []);

  const accentColors = [
    {
      name: "Flamingo",
      value: "flamingo",
      code: {
        light: "#dd7878",
        dark: "#f0c6c6",
      },
    },
    {
      name: "Rosa",
      value: "pink",
      code: {
        light: "#ea76cb",
        dark: "#f5bde6",
      },
    },
    {
      name: "Malva",
      value: "mauve",
      code: {
        light: "#8839ef",
        dark: "#c6a0f6",
      },
    },
    {
      name: "Castanho",
      value: "maroon",
      code: {
        light: "#e64553",
        dark: "#ee99a0",
      },
    },
    {
      name: "Pêssego",
      value: "peach",
      code: {
        light: "#fe640b",
        dark: "#f5a97f",
      },
    },
    {
      name: "Azul-petróleo",
      value: "teal",
      code: {
        light: "#179299",
        dark: "#8bd5ca",
      },
    },
    {
      name: "Azul",
      value: "blue",
      code: {
        light: "#1e66f5",
        dark: "#8aadf4",
      },
    },
  ];
  return (
    <div className="settings">
      <PageHeader
        title="Ajustes"
        buttons={
          changed
            ? {
                primary: {
                  submit: true,
                  formID: "settings-form",
                  name: "Salvar Alterações",
                },
              }
            : undefined
        }
      />
      <form
        id="settings-form"
        className="settings__form"
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings();
        }}
      >
        <fieldset className="settings__group">
          <legend className="settings__group-legend">Geral</legend>
          <div className="settings__group-container">
            <fieldset className="settings__sub-group">
              <legend className="settings__sub-group-legend">Tema</legend>
              <div className="settings__theme-buttons">
                <label className="settings__theme-label">
                  <input
                    name="theme-options"
                    className="settings__theme-radio"
                    type="radio"
                    value="light"
                    checked={theme === "light"}
                    onChange={(e) => {
                      setTheme(e.target.value);
                      setChanged(true);
                    }}
                  />
                  <FontAwesomeIcon icon={faSun} />
                  Latte
                </label>
                <label className="settings__theme-label">
                  <input
                    name="theme-options"
                    type="radio"
                    className="settings__theme-radio"
                    value="dark"
                    checked={theme === "dark"}
                    onChange={(e) => {
                      setTheme(e.target.value);
                      setChanged(true);
                    }}
                  />
                  <FontAwesomeIcon icon={faMoon} />
                  Machiatto
                </label>
              </div>
            </fieldset>
            <fieldset className="settings__sub-group">
              <legend className="settings__sub-group-legend">
                Cor de Destaque
              </legend>
              <div className="settings__color-select">
                {accentColors.map((color) => {
                  const { name, value } = color;
                  let code;
                  switch (settingsContext.settings.theme) {
                    case "light": {
                      code = color.code.light;
                      break;
                    }
                    case "dark": {
                      code = color.code.dark;
                      break;
                    }
                    default: {
                      code = color.code.dark;
                    }
                  }
                  return (
                    <input
                      key={value}
                      type="radio"
                      name="accent-color"
                      aria-label={name}
                      onChange={() => {
                        setAccentColor(value);
                      }}
                      style={{ backgroundColor: code, color: code }}
                      className="settings__color-button"
                      checked={accentColor === value}
                    />
                  );
                })}
              </div>
            </fieldset>
            <div className="settings__sub-group">
              <label
                htmlFor="always-show-chat-bar"
                className="settings__list-label"
              >
                <span className="settings__sub-group-legend">
                  Manter barra de chat visível
                </span>
                <div className="settings__switch-container">
                  <input
                    id="always-show-chat-bar"
                    type="checkbox"
                    className="settings__checkbox"
                    checked={alwaysShowChatBar}
                    onChange={(e) => {
                      setAlwaysShowChatBar(e.target.checked);
                      setChanged(true);
                    }}
                  />
                  <div
                    className={`settings__switch settings__switch--${alwaysShowChatBar ? "on" : "off"}`}
                  >
                    <div className="settings__switch-dummy"></div>
                    <div className="settings__switch-slider"></div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
