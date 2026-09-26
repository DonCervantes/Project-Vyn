/**
 * E2E: locale persistence (#70) and mobile overflow smoke (#72).
 */

import { test, expect } from "../playwright-fixture";
import { LANGUAGE_KEY, seedWalletSession, stubCreditApi } from "./helpers";

test.describe("Locale persistence", () => {
  test("keeps the selected language after reload", async ({ page }) => {
    await stubCreditApi(page);
    // language: null → init script must not overwrite the locale on reload
    await seedWalletSession(page, { onboarded: true, language: null });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("language-toggle")).toBeVisible();

    await page.getByTestId("lang-en").click();
    await expect(page.getByTestId("open-deposit")).toContainText(/Deposit Earnings/i);
    await expect(page.getByTestId("lang-en")).toHaveAttribute("aria-pressed", "true");

    const stored = await page.evaluate((key) => localStorage.getItem(key), LANGUAGE_KEY);
    expect(stored).toBe("en");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("open-deposit")).toContainText(/Deposit Earnings/i);
    await expect(page.getByTestId("lang-en")).toHaveAttribute("aria-pressed", "true");
  });

  test("falls back to Spanish when the stored locale is invalid", async ({ page }) => {
    await stubCreditApi(page);
    await page.addInitScript((key) => {
      const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
      const setStore = (k: string, value: string) => {
        try {
          localStorage.setItem(k, value);
        } catch {
          /* ignore */
        }
        document.cookie = `${encodeURIComponent(k)}=${encodeURIComponent(
          value
        )}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
      };
      setStore(key, "fr");
      setStore("vinculo_wallet", "GBUQWP3BOUZX34GTHWEQ2RKCVFJCFZWYY5JWXLRJVZGQXY2USRY5JK4F");
      setStore("vinculo_wallet_provider", "freighter");
      setStore("vinculo_onboarded", "1");
    }, LANGUAGE_KEY);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Default UI is Spanish.
    await expect(page.getByTestId("open-deposit")).toContainText(/depositar/i);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
  });
});

test.describe("Translation overflow on mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("login and bottom nav do not overflow the viewport in English", async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, "en");
    }, LANGUAGE_KEY);

    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("language-toggle")).toBeVisible();

    const loginOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    expect(loginOverflow).toBe(false);

    // Seed an onboarded session and check the shell + bottom nav.
    await stubCreditApi(page);
    await seedWalletSession(page, { onboarded: true, language: "en" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("open-deposit")).toBeVisible();

    const shellOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const nav = document.querySelector("nav");
      const navOverflow = nav ? nav.scrollWidth > nav.clientWidth + 1 : false;
      return {
        page: doc.scrollWidth > doc.clientWidth + 1,
        nav: navOverflow,
      };
    });

    expect(shellOverflow.page).toBe(false);
    expect(shellOverflow.nav).toBe(false);
  });
});
