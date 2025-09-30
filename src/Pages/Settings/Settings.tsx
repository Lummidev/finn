import { useEffect, useState } from "react";
import "./Settings.css";
export const Settings = () => {
  const [theme, setTheme] = useState("dark");

  const saveTheme = (theme: string) => {
    document.querySelector("body")?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  return (
    <div className="options">
      <h1>Opções</h1>
      <ul className="options__list">
        <li className="options__list-item">
          <label htmlFor="theme-select">Mudar Tema</label>
          <select
            onChange={(e) => {
              const theme = e.target.value;
              setTheme(theme);
              saveTheme(theme);
            }}
            className="options__select"
            name="Theme"
            id="theme-select"
            value={theme}
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </li>
      </ul>
    </div>
  );
};
