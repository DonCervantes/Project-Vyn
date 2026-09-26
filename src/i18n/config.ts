/**
 * i18n configuration
 *
 * - Default / fallback language: Spanish (es)
 * - Selected locale is restored from localStorage before first render (#70)
 * - Invalid stored values fall back to DEFAULT_LANGUAGE
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es";
import en from "./locales/en";

export const DEFAULT_LANGUAGE = "es";
export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "vinculo_language";

function readStoredLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && (SUPPORTED_LANGUAGES as readonly string[]).includes(saved)) {
      return saved as SupportedLanguage;
    }
  } catch {
    /* localStorage blocked or unavailable */
  }
  return DEFAULT_LANGUAGE;
}

const initialLang = readStoredLanguage();

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],

  interpolation: {
    escapeValue: false,
  },

  parseMissingKeyHandler: (key) => key,
});

export default i18n;
