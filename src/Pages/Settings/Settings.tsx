import {
  use,
  useEffect,
  useId,
  useState,
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import "./Settings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCoins,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { SettingsContext } from "../../Context/SettingsContext";
import { Settings as SettingsManager } from "../../settings";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { AutoResizeInput } from "../../Components/AutoResizeInput/AutoResizeInput";
import { NumericFormat } from "react-number-format";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Trans, useTranslation } from "react-i18next";
const SettingsFieldsetWithRadioOptions = ({
  title,
  radioGroup,
  options,
  currentState,
}: {
  title: string;
  radioGroup: string;
  currentState: string;
  options: {
    name: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
    icon?: ReactNode;
  }[];
}) => {
  return (
    <fieldset className="settings__sub-group">
      <legend className="settings__sub-group-legend">{title}</legend>
      <div className="settings__theme-buttons">
        {options.map((option) => (
          <label key={option.name} className="settings__theme-label">
            <input
              name={radioGroup}
              className="settings__theme-radio"
              type="radio"
              value={option.value}
              checked={currentState === option.value}
              onChange={option.onChange}
            />
            {option.icon ?? <></>}
            {option.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
};
export const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("blue");
  const [alwaysShowChatBar, setAlwaysShowChatBar] = useState(false);
  const [changed, setChanged] = useState(false);
  const [dailyExpense, setDailyExpense] = useState<number | undefined>(0);
  const [weeklyExpense, setWeeklyExpense] = useState<number | undefined>(0);
  const [monthlyExpense, setMonthlyExpense] = useState<number | undefined>(0);
  const settingsContext = use(SettingsContext);
  const { t, i18n } = useTranslation("settings");
  const saveSettings = () => {
    const [daily, weekly, monthly] = [
      dailyExpense,
      weeklyExpense,
      monthlyExpense,
    ].map((num) => num ?? 0);
    SettingsManager.dailyObjective = daily;
    SettingsManager.weeklyObjective = weekly;
    SettingsManager.monthlyObjective = monthly;
    SettingsManager.theme = theme;
    SettingsManager.accentColor = accentColor;
    SettingsManager.alwaysShowChatBar = alwaysShowChatBar;

    settingsContext.setSettings({
      ...settingsContext.settings,
      alwaysShowChatBar,
      theme,
    });
    i18n.changeLanguage(language).catch((e) => {
      throw e;
    });
    setChanged(false);
  };

  useEffect(() => {
    const {
      accentColor,
      alwaysShowChatBar,
      theme,
      objectives: { daily, weekly, monthly },
    } = SettingsManager.load();
    const language = i18n.language;
    if (language) {
      setLanguage(language);
    }
    setTheme(theme);
    setAccentColor(accentColor);
    setAlwaysShowChatBar(alwaysShowChatBar);

    setDailyExpense(daily);
    setWeeklyExpense(weekly);
    setMonthlyExpense(monthly);
  }, []);

  const accentColors = [
    {
      name: t("accentColors.flamingo"),
      value: "flamingo",
      code: {
        light: "#dd7878",
        dark: "#f0c6c6",
      },
    },
    {
      name: t("accentColors.pink"),
      value: "pink",
      code: {
        light: "#ea76cb",
        dark: "#f5bde6",
      },
    },
    {
      name: t("accentColors.mauve"),
      value: "mauve",
      code: {
        light: "#8839ef",
        dark: "#c6a0f6",
      },
    },
    {
      name: t("accentColors.peach"),
      value: "peach",
      code: {
        light: "#fe640b",
        dark: "#f5a97f",
      },
    },
    {
      name: t("accentColors.teal"),
      value: "teal",
      code: {
        light: "#179299",
        dark: "#8bd5ca",
      },
    },
    {
      name: t("accentColors.blue"),
      value: "blue",
      code: {
        light: "#1e66f5",
        dark: "#8aadf4",
      },
    },
  ];
  const dailyExpenseId = useId();
  const weeklyExpenseId = useId();
  const monthlyExpenseId = useId();
  const objectives: {
    label: string;
    id: string;
    state: number | undefined;
    setState: Dispatch<SetStateAction<number | undefined>>;
  }[] = [
    {
      label: t("goals.daily"),
      id: dailyExpenseId,
      state: dailyExpense,
      setState: setDailyExpense,
    },
    {
      label: t("goals.weekly"),
      id: weeklyExpenseId,
      state: weeklyExpense,
      setState: setWeeklyExpense,
    },
    {
      label: t("goals.monthly"),
      id: monthlyExpenseId,
      state: monthlyExpense,
      setState: setMonthlyExpense,
    },
  ];
  return (
    <div className="settings">
      <PageHeader
        title={t("pageNames.settings", { ns: "common" })}
        buttons={
          changed
            ? {
                primary: {
                  submit: true,
                  formID: "settings-form",
                  name: t("saveChanges", { ns: "common" }),
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
          <legend className="settings__group-legend">
            {t("sectionTitles.general")}
          </legend>
          <div className="settings__group-container">
            <SettingsFieldsetWithRadioOptions
              title={t("sectionTitles.theme")}
              radioGroup="theme-options"
              currentState={theme}
              options={[
                {
                  name: t("themes.light"),
                  value: "light",
                  onChange: (e) => {
                    setTheme(e.target.value);
                    setChanged(true);
                  },
                  icon: <FontAwesomeIcon icon={faSun} />,
                },
                {
                  name: t("themes.dark"),
                  value: "dark",
                  onChange: (e) => {
                    setTheme(e.target.value);
                    setChanged(true);
                  },
                  icon: <FontAwesomeIcon icon={faMoon} />,
                },
              ]}
            />
            <SettingsFieldsetWithRadioOptions
              title={t("sectionTitles.language")}
              radioGroup="language-options"
              currentState={language}
              options={[
                {
                  name: "English",
                  value: "en",
                  onChange: (e) => {
                    setLanguage(e.target.value);
                    setChanged(true);
                  },
                },
                {
                  name: "Português",
                  value: "pt-BR",
                  onChange: (e) => {
                    setLanguage(e.target.value);
                    setChanged(true);
                  },
                },
              ]}
            />
            <fieldset className="settings__sub-group">
              <legend className="settings__sub-group-legend">
                {t("sectionTitles.accentColor")}
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
                        setChanged(true);
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
                  {t("keepChatBarVisible")}
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
        <fieldset className="settings__group">
          <legend className="settings__group-legend">
            {t("sectionTitles.goals")}
          </legend>
          <div className="settings__group-container">
            {objectives.map((objective) => {
              return (
                <div className="settings__sub-group" key={objective.id}>
                  <label
                    htmlFor={objective.id}
                    className="settings__list-label"
                  >
                    {objective.label}
                  </label>

                  <NumericFormat
                    customInput={AutoResizeInput}
                    allowNegative={false}
                    allowedDecimalSeparators={[",", "."]}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    className="settings__money-input"
                    id={objective.id}
                    value={objective.state}
                    enterKeyHint="done"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                        return;
                      }
                    }}
                    onValueChange={(values, { source }) => {
                      objective.setState(values.floatValue);

                      // I would import { SourceType } from "react-number-format/types/types",
                      // but for some reason the code doesn't compile when I try it.
                      // It says the file doesn't exist :thinking:
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                      if (source === "event") setChanged(true);
                    }}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 300);
                    }}
                    onBlur={() => {
                      if (!objective.state) {
                        objective.setState(0);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      </form>
      <div className="settings__about">
        <div className="settings__logo-container">
          <FontAwesomeIcon icon={faCoins} />
        </div>
        <h2 className="settings__logo-title">Finn</h2>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Lummidev/finn"
          className="settings__github-link"
        >
          <FontAwesomeIcon icon={faGithub} /> {t("seeOnGithub")}
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            color="var(--theme-overlay0)"
          />
        </a>
        <div className="settings__credits">
          <p>
            <Trans
              i18nKey={"credits.libraries"}
              ns="settings"
              components={{
                name: <span className="settings__my-name" />,
                react: (
                  <a
                    href="https://react.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings__link settings__link--react"
                  />
                ),
                vite: (
                  <a
                    href="https://vite.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings__link settings__link--vite"
                  />
                ),
                dexie: (
                  <a
                    href="https://dexie.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings__link settings__link--dexie"
                  />
                ),
              }}
            />
          </p>
          <p>
            <Trans
              i18nKey={"credits.more"}
              ns="settings"
              components={{
                fa: (
                  <a
                    href="https://fontawesome.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings__link"
                  />
                ),
                chart: (
                  <a
                    href="https://www.chartjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="settings__link"
                  />
                ),
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};
