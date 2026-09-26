# End-to-end tests (Playwright)

Automated coverage for the wallet journey and i18n layout checks.

## What is covered

| Spec | Journey | Notes |
|------|---------|--------|
| `e2e/wallet-onboarding-deposit.spec.ts` | Onboarding carousel → home → deposit method modal | Seeds `vinculo_wallet` without onboarding; does **not** sign on-chain deposits or open Freighter/Privy |
| `e2e/locale-and-overflow.spec.ts` | Locale survives reload; mobile English UI does not horizontal-scroll | Uses a 375×812 viewport for overflow |

## Prerequisites

```bash
npm install
npx playwright install chromium
```

A real `.env.local` is optional. The Playwright `webServer` injects placeholder `VITE_PRIVY_APP_ID` / contract IDs so Vite can boot.

## Run

```bash
# All E2E specs (starts Vite on http://127.0.0.1:4173)
npm run test:e2e

# One file
npm run test:e2e -- e2e/wallet-onboarding-deposit.spec.ts

# Interactive UI mode
npm run test:e2e:ui
```

## Fixtures / mocks

- Session keys: `vinculo_wallet`, `vinculo_wallet_provider`, `vinculo_onboarded`, `vinculo_language` (see `e2e/helpers.ts`).
- `POST /api/get-available-credit` is stubbed so the home dashboard does not wait on Soroban.
- `VITE_E2E=1` aliases `@privy-io/react-auth` to `e2e/mocks` so the app boots without a real Privy app id.
- Reset between runs by clearing site storage, or rely on `addInitScript` which runs before each page load.
