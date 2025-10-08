import { use, useEffect, useState } from "react";
import "./Settings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../Context/ThemeContext";
export const Settings = () => {
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("blue");
  const themeContext = use(ThemeContext);
  const saveTheme = (theme: string) => {
    document.querySelector("body")?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeContext.setTheme(theme);
  };
  const saveColor = (accentColor: string) => {
    document
      .querySelector("body")
      ?.setAttribute("data-accentcolor", accentColor);
    localStorage.setItem("accentColor", accentColor);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedAccentColor = localStorage.getItem("accentColor");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
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
      name: "Céu",
      value: "sky",
      code: {
        light: "#04a5e5",
        dark: "#91d7e3",
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
    <div className="options">
      <h1>Ajustes</h1>
      <ul className="options__list">
        <li className="options__list-item">
          <span className="options__item-title">Tema</span>
          <div className="options__theme-buttons">
            <button
              onClick={() => {
                setTheme("light");
                saveTheme("light");
              }}
              type="button"
              className={`options__theme-button ${theme === "light" ? "options__theme-button--selected" : ""}`}
            >
              <FontAwesomeIcon icon={faSun} />
              Latte
            </button>
            <button
              onClick={() => {
                setTheme("dark");
                saveTheme("dark");
              }}
              type="button"
              className={`options__theme-button ${theme === "dark" ? "options__theme-button--selected" : ""}`}
            >
              <FontAwesomeIcon icon={faMoon} />
              Machiatto
            </button>
          </div>
        </li>
        <li className="options__list-item">
          <span className="options__item-title">Cor de Destaque</span>
          <div className="options__color-select">
            {accentColors.map((color) => {
              const { name, value } = color;
              let code;
              switch (theme) {
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
                    saveColor(value);
                  }}
                  style={{ backgroundColor: code, color: code }}
                  className="options__color-button"
                  checked={accentColor === value}
                />
              );
            })}
          </div>
        </li>
      </ul>
    </div>
  );
};
