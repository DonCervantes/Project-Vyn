/**
 * E2E: wallet journey — onboarding → home → deposit method picker.
 *
 * Covers the critical path for issue #49 without requiring a real extension
 * or on-chain signature. Session keys are seeded; Freighter/Privy are not used.
 *
 * Run: npm run test:e2e -- e2e/wallet-onboarding-deposit.spec.ts
 */

import { test, expect } from "../playwright-fixture";
import { seedWalletSession, stubCreditApi } from "./helpers";

test.describe("Wallet flow: onboarding → deposit", () => {
  test.beforeEach(async ({ page }) => {
    await stubCreditApi(page);
    // Wallet connected, onboarding not finished → /bienvenida
    await seedWalletSession(page, { onboarded: false, language: "es" });
  });

  test("completes onboarding and opens the deposit method modal", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // RequireOnboarding should send us to the welcome carousel.
    await expect(page).toHaveURL(/\/bienvenida/);
    await expect(page.getByTestId("onboarding-cta")).toBeVisible();

    // Step 1 → 2
    await page.getByTestId("onboarding-cta").click();
    await expect(page.getByTestId("onboarding-cta")).toBeVisible();

    // Step 2 → 3 (last)
    await page.getByTestId("onboarding-cta").click();
    await expect(page.getByTestId("onboarding-cta")).toContainText(/vamos|let'?s go/i);

    // Finish onboarding → login redirect → home (session already has wallet)
    await page.getByTestId("onboarding-cta").click();

    await expect(page.getByTestId("open-deposit")).toBeVisible({ timeout: 20_000 });
    await expect(page).toHaveURL(/\/$/);

    // Open deposit modal and assert the method picker (wallet vs SPEI).
    await page.getByTestId("open-deposit").click();
    await expect(page.getByTestId("deposit-method-title")).toBeVisible();
    await expect(page.getByText(/wallet|SPEI|stellar/i).first()).toBeVisible();
  });
});
