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

/** Map a raw storage value to a supported locale. Unknown values use Spanish. */
export function resolveStoredLanguage(raw: string | null): SupportedLanguage {
  if (raw && (SUPPORTED_LANGUAGES as readonly string[]).includes(raw)) {
    return raw as SupportedLanguage;
  }
  return DEFAULT_LANGUAGE;
}

function readStoredLanguage(): SupportedLanguage {
  try {
    return resolveStoredLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    /* localStorage blocked or unavailable */
    return DEFAULT_LANGUAGE;
  }
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
