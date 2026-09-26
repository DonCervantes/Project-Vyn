/**
 * useLanguage — thin wrapper around i18next for language switching.
 * Persists the choice to localStorage so reloads and new tabs reuse it (#70).
 */

import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY, type SupportedLanguage } from "./config";

export function useLanguage() {
  const { i18n } = useTranslation();

  return {
    language: i18n.language as SupportedLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    changeLanguage: (lang: SupportedLanguage) => {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        /* localStorage blocked — language still switches for this session */
      }
      return i18n.changeLanguage(lang);
    },
  };
}
