import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  isSupportedLanguage,
  resolveStoredLanguage,
  persistLanguage,
} from "./localeStorage";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from "./constants";

describe("localeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0]?.trim();
      if (name) document.cookie = `${name}=; max-age=0; path=/`;
    });
  });

  it("accepts only supported language codes", () => {
    expect(isSupportedLanguage("es")).toBe(true);
    expect(isSupportedLanguage("en")).toBe(true);
    expect(isSupportedLanguage("fr")).toBe(false);
    expect(isSupportedLanguage("")).toBe(false);
    expect(isSupportedLanguage(null)).toBe(false);
  });

  it("falls back to the default locale for invalid stored values", () => {
    expect(resolveStoredLanguage(null)).toBe(DEFAULT_LANGUAGE);
    expect(resolveStoredLanguage("fr")).toBe(DEFAULT_LANGUAGE);
    expect(resolveStoredLanguage("ES")).toBe(DEFAULT_LANGUAGE);
    expect(resolveStoredLanguage("en")).toBe("en");
  });

  it("persists the locale so reloads and new tabs can restore it", () => {
    persistLanguage("en");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(resolveStoredLanguage()).toBe("en");

    persistLanguage("es");
    expect(resolveStoredLanguage()).toBe("es");
  });

  it("reads from storage when no explicit raw value is passed", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
    expect(resolveStoredLanguage()).toBe("en");
  });
});
