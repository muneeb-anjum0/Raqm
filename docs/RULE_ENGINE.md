# Rule Engine

The rule engine lives in `apps/web/src/lib/tax-engine.ts` and is intentionally separate from UI components.

It:

- Validates input with Zod.
- Loads the Pakistan tax-year 2026 placeholder pack.
- Calculates annual salary.
- Applies salary slabs.
- Applies employer and bank withholding as adjustable tax paid.
- Returns payable/refund estimates.
- Produces audit-trail entries with rule IDs.
- Produces Iris mapping and checklist data.

The MVP rule pack is marked `Verification Required`; values must be manually checked against official sources before production reliance.

## Controlled Update Pipeline

Official FBR/source update -> developer updates rule pack -> tests run -> rule pack is signed/checksummed -> frontend receives manifest -> browser verifies checksum/signature -> user sees updated status.

## Update Policy

- Major update: yearly after Finance Act / budget.
- Minor update: whenever FBR circulars, withholding cards, or clarifications change.
- Emergency update: if a calculation bug is found.
