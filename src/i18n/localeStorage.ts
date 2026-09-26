/**
 * Locale persistence helpers.
 *
 * Uses sessionStore (localStorage + cookie mirror) so the selected language
 * survives reloads, new tabs, and mobile browsers where localStorage alone
 * can be flaky. Invalid or unknown values always fall back to DEFAULT_LANGUAGE.
 */

import * as sessionStore from "@/lib/sessionStore";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "./constants";

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  );
}

/** Resolve a raw storage value to a supported locale (or the default). */
export function resolveStoredLanguage(
  raw: string | null = sessionStore.getItem(LANGUAGE_STORAGE_KEY)
): SupportedLanguage {
  if (isSupportedLanguage(raw)) return raw;
  return DEFAULT_LANGUAGE;
}

/** Persist the locale so reloads and new tabs reuse it. */
export function persistLanguage(lang: SupportedLanguage): void {
  sessionStore.setItem(LANGUAGE_STORAGE_KEY, lang);
}

/** Apply the active locale to <html lang="…"> for a11y and SEO. */
export function syncDocumentLanguage(lang: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
}
