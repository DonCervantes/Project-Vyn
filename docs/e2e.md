# End-to-end tests (Playwright)

Covers the wallet journey for issue #49: onboarding → home → deposit method picker.

## Run

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Or a single file:

```bash
npm run test:e2e -- e2e/wallet-onboarding-deposit.spec.ts
```

## What is covered / not covered

- **Covered:** finish `/bienvenida`, land on home, open the deposit method modal.
- **Not covered:** Freighter/Privy UI, on-chain signing, SPEI transfer.

## Fixtures

- Seeds `vinculo_wallet` / `vinculo_wallet_provider` without `vinculo_onboarded` (see `e2e/helpers.ts`).
- Stubs `POST /api/get-available-credit` and `POST /api/calculate-score`.
- `VITE_E2E=1` aliases Privy to `e2e/mocks` so Vite boots without a real Privy app id.
