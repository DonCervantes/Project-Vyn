/**
 * E2E helpers — deterministic wallet session seeding.
 *
 * The app loads the wallet session once from sessionStore (localStorage + cookie).
 * Seeding these keys before the first navigation lets tests skip Freighter/Privy
 * and still exercise RequireWallet / RequireOnboarding / DepositModal.
 *
 * Important: sessionStore falls back to cookies when localStorage is empty, so
 * helpers must clear (or set) both stores together.
 */

import type { Page } from "@playwright/test";

/** Deterministic fake Stellar public key used across E2E fixtures. */
export const E2E_WALLET =
  "GBUQWP3BOUZX34GTHWEQ2RKCVFJCFZWYY5JWXLRJVZGQXY2USRY5JK4F";

export const WALLET_KEY = "vinculo_wallet";
export const ONBOARDED_KEY = "vinculo_onboarded";
export const PROVIDER_KEY = "vinculo_wallet_provider";
export const LANGUAGE_KEY = "vinculo_language";

export type SeedSessionOptions = {
  /** When false, the user still needs to finish /bienvenida. Default true. */
  onboarded?: boolean;
  /**
   * Locale to seed. Pass `null` to leave vinculo_language untouched
   * (needed for persistence tests that must survive reload).
   * Default: "es".
   */
  language?: "es" | "en" | null;
};

/** Seed session storage before the app bootstraps (addInitScript). */
export async function seedWalletSession(
  page: Page,
  options: SeedSessionOptions = {}
): Promise<void> {
  const { onboarded = true, language = "es" } = options;

  await page.addInitScript(
    ({ wallet, onboarded, language, WALLET_KEY, ONBOARDED_KEY, PROVIDER_KEY, LANGUAGE_KEY }) => {
      const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
      const setStore = (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          /* ignore */
        }
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
          value
        )}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
      };
      const removeStore = (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch {
          /* ignore */
        }
        document.cookie = `${encodeURIComponent(key)}=; max-age=0; path=/; SameSite=Lax`;
      };

      setStore(WALLET_KEY, wallet);
      setStore(PROVIDER_KEY, "freighter");
      if (onboarded) {
        setStore(ONBOARDED_KEY, "1");
      } else {
        removeStore(ONBOARDED_KEY);
      }
      if (language !== null) {
        setStore(LANGUAGE_KEY, language);
      }
    },
    {
      wallet: E2E_WALLET,
      onboarded,
      language,
      WALLET_KEY,
      ONBOARDED_KEY,
      PROVIDER_KEY,
      LANGUAGE_KEY,
    }
  );
}

/** Stub noisy APIs so the home dashboard does not hang without a backend. */
export async function stubCreditApi(page: Page): Promise<void> {
  const ok = {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      success: true,
      availableCredit: 0,
      tierName: "Bronce",
      tier: 0,
      score: 0,
    }),
  };
  await page.route("**/api/get-available-credit", async (route) => {
    await route.fulfill(ok);
  });
  await page.route("**/api/calculate-score", async (route) => {
    await route.fulfill(ok);
  });
}
