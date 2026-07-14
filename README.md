# Raqm

Private by design. Ready for Iris.

Raqm is a Pakistan-only, local-first tax preparation workspace for salaried filers preparing their information before filing manually on FBR Iris.

Raqm is not an FBR replacement, AI accountant, legal guarantee, direct Iris submission tool, cloud filing system, or substitute for a qualified tax professional in complex cases.

## Stack

- SvelteKit, Svelte, TypeScript, Vite
- Tailwind CSS theme tokens
- IndexedDB with Dexie
- Web Crypto API with AES-GCM and PBKDF2
- Zod validation
- TypeScript rule engine with versioned Pakistan rule-pack files
- pdf-lib, ExcelJS, safe CSV export
- Vitest and Playwright

## Local Development

```bash
cd apps/web
npm install
npm run dev
```

Open `http://localhost:5173`.

## Quality Commands

```bash
cd apps/web
npm run check
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
```

## Docker

```bash
docker compose up --build
```

The container access hub is served on `http://localhost:8080/hub`.

Available endpoints:

- Hub: `http://localhost:8080/hub`
- Raqm web app via hub proxy: `http://localhost:8080/raqm`
- Raqm web app direct: `http://localhost:3000`

Backend and database interfaces are intentionally absent in the MVP because Raqm does not send financial data to a backend or store it in a server database.

## Privacy Model

Financial data stays in the browser in an encrypted IndexedDB vault. Raqm does not include accounts, analytics, cloud records, or backend financial-data processing in the MVP. The password and raw encryption key are never stored.

## Rule Update Process

The MVP rule pack is marked `Verification Required`. A production rule update should be performed by a maintainer after official source review, tests, checksum/signature generation, and user-visible manifest updates.

## Known Limitations

- Salaried filer mode only.
- Rule values are placeholders and must be verified before production reliance.
- No direct FBR Iris submission.
- No CNIC verification, ATL lookup, bank integrations, OCR, or cloud sync.
- Local browser vault recovery is impossible if the password is lost.
