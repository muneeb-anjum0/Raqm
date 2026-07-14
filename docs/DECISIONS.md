# Decisions

- SvelteKit was selected as requested.
- Tailwind CSS was selected directly rather than adding a heavier component kit. The UI uses a small local component set and named theme tokens.
- Zod was selected for validation because it is concise, mature, and TypeScript-friendly.
- No backend was added because the MVP flow does not require one and financial data must not leave the browser.
- Rule values are placeholder values and the UI/docs show `Verification Required`; official tax rules were not silently invented.
- npm audit currently reports transitive low/moderate issues from dependencies. No blind breaking `audit fix --force` was applied.
- GitHub push/PR/merge depends on local GitHub authentication. If unavailable, run:

```bash
git push -u origin codex/raqm-mvp
gh pr create --base main --head codex/raqm-mvp --title "feat: build Raqm MVP" --body "Builds the SvelteKit local-first Raqm MVP."
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
```
