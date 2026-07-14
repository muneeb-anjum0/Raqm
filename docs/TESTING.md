# Testing

Run:

```bash
cd apps/web
npm run check
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
```

Tax engine tests cover slab boundaries, withholding/refund/payable behavior, bank tax adjustment, validation failures, audit trail IDs, and immutability.

Vault tests cover derivation, encryption/decryption, IV uniqueness, wrong password failure, plaintext avoidance, and panic wipe.

Playwright covers the critical browser flow.
