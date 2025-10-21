import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import "./darkTheme.css";
import "./lightTheme.css";
import "./accentColors.css";
import App from "./App/App.tsx";
import "@fontsource-variable/roboto";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import { Dashboard } from "./Pages/Dashboard/Dashboard.tsx";
import { Categories } from "./Pages/Categories/Categories.tsx";
import { Chat } from "./Pages/Chat/Chat.tsx";
import { CategoryForm } from "./Pages/CategoryForm/CategoryForm.tsx";
import { ViewCategory } from "./Pages/ViewCategory/ViewCategory.tsx";
import { Settings } from "./Pages/Settings/Settings.tsx";
import { Expenses } from "./Pages/Expenses/Expenses.tsx";
import { ViewExpense } from "./Pages/ViewExpense/ViewExpense.tsx";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  LogarithmicScale,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  LogarithmicScale,
);
ChartJS.defaults.font.family = "'Roboto Variable', serif";
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:id" element={<ViewCategory />} />
          <Route path="chat" element={<Chat />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/:id" element={<ViewExpense />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
