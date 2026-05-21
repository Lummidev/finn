import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import languageDetector from "i18next-browser-languagedetector";
import { namespacesByLocale, supportedLanguages } from "./languages";

await i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: supportedLanguages,
    ns: ["common"],
    debug: true,
    fallbackLng: "en",
    fallbackNS: "common",
    interpolation: {
      escapeValue: false, // React escapes values by default
    },
    resources: namespacesByLocale,
  });

export default i18n;
