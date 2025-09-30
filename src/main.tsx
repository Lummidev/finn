import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import "./darkTheme.css";
import App from "./App/App.tsx";
import "@fontsource-variable/roboto";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { BrowserRouter, Route } from "react-router";
import { Routes } from "react-router";
import { Dashboard } from "./Pages/Dashboard/Dashboard.tsx";
import { Categories } from "./Pages/Categories/Categories.tsx";
import { Chat } from "./Pages/Chat/Chat.tsx";
import { CategoryForm } from "./Pages/CategoryForm/CategoryForm.tsx";
import { ViewCategory } from "./Pages/Category/ViewCategory.tsx";
dayjs.extend(localizedFormat);
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
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
