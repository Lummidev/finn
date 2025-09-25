import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import "./darkTheme.css";
import App from "./App/App.tsx";
import "@fontsource-variable/roboto";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
