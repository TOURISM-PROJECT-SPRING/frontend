import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import km from "./locales/km.json";

const STORAGE_KEY = "tourism_lang";
const savedLang = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
const defaultLang = savedLang || "km";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
  },
  lng: defaultLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safeguards from XSS
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = defaultLang;
}

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
