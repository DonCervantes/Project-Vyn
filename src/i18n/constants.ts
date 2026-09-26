/**
 * Shared i18n constants (no side effects).
 * Kept separate from config.ts so persistence helpers can import them
 * without creating a circular dependency with i18next init.
 */

export const DEFAULT_LANGUAGE = "es";
export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Persist the user's language choice across reloads and tabs. */
export const LANGUAGE_STORAGE_KEY = "vinculo_language";
