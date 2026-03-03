# A/B Comparison Report: Blank-Screen Hardening

## Context
- Date: 2026-03-03
- Branch: `codex/ab-blank-screen-hardening`
- Base commit: `e524811` (from `main`)
- Local URL for all browser checks: `http://127.0.0.1:4173`

## Exact Commands Used
```bash
# A baseline (same behavior as main)
VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= npm run build
npm run preview -- --host 127.0.0.1 --port 4173

# B validation with missing Supabase env
VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= npm run build
npm run preview -- --host 127.0.0.1 --port 4173

# B validation with configured env (.env)
npm run build
npm run preview -- --host 127.0.0.1 --port 4173

# Regression checks
npm run lint
npm run build
```

## A: Baseline (pre-fix, missing env)
- Screenshot: [a-main-missing-env.png](./a-main-missing-env.png)
- Console log: [a-main-console.txt](./a-main-console.txt)
- Network log: [a-main-network.txt](./a-main-network.txt)

Console snippet:
```text
Error: supabaseUrl is required.
    at C4 (http://127.0.0.1:4173/assets/index-BJm7S7G6.js:91:39289)
    at new T4 (http://127.0.0.1:4173/assets/index-BJm7S7G6.js:91:39659)
    at P4 (http://127.0.0.1:4173/assets/index-BJm7S7G6.js:91:42956)
```

Network snippet:
```text
[GET] / => 200
[GET] /assets/index-BJm7S7G6.js => 200
[GET] /assets/index-B-ll_3ql.css => 200
```

Observed result:
- JS and CSS load successfully.
- App fails at runtime before render due missing Supabase env.
- Viewport appears blank.

## B: Hardened (missing env)
- Screenshot: [b-missing-env.png](./b-missing-env.png)
- Console log: [b-missing-env-console.txt](./b-missing-env-console.txt)
- Network log: [b-missing-env-network.txt](./b-missing-env-network.txt)

Console snippet:
```text
[WARNING] Missing frontend configuration: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

Observed result:
- Homepage renders fully.
- Contact form stays visible but disabled.
- Inline alert explains temporary unavailability and config issue.
- No fatal runtime crash.

## B: Hardened (configured env)
- Screenshot: [b-configured-env.png](./b-configured-env.png)
- Console log: [b-configured-env-console.txt](./b-configured-env-console.txt)
- Network log: [b-configured-env-network.txt](./b-configured-env-network.txt)

Observed result:
- Homepage renders fully.
- Contact form is enabled.
- No console warnings/errors on initial load.

## Manual Smoke: 404 Route
- Screenshot: [b-404-route.png](./b-404-route.png)
- Console log: [b-404-console.txt](./b-404-console.txt)

Observed result:
- `/does-not-exist` renders NotFound UI correctly.

## Acceptance Checklist
- [x] Missing both Supabase vars: homepage renders, no blank screen.
- [x] Missing both Supabase vars: contact form disabled with clear message.
- [x] Configured vars: homepage renders and contact form enabled.
- [x] Manual smoke on `/` and `*` route completed.
- [x] CI deploy-time env validation added for required frontend secrets.
- [ ] CI deploy failure path executed live in GitHub Actions (not run locally).

## Diff Summary (Grouped)
### Runtime Guard / Frontend Safety
- Added: `src/lib/runtime-config.ts`
- Updated: `src/components/landing/ContactSection.tsx`
- Updated locales: `src/i18n/locales/en/common.json`, `src/i18n/locales/es/common.json`, `src/i18n/locales/pt/common.json`

### CI / Workflow Hardening
- Updated: `.github/workflows/deploy-frontend.yml`
- Updated: `.github/workflows/deploy.yml`
- Changes:
  - Inject `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into frontend build env.
  - Add deploy-job validation step to fail when required frontend secrets are missing.

### Docs Alignment
- Updated: `DEPLOYMENT.md`
- Updated: `.github/DEPLOYMENT.md`
- Updated: `README.md`
- Changes:
  - Frontend required env list now includes Supabase vars.
  - Local setup guidance reflects Supabase requirement for contact form availability.

## Regression Check Notes
- `npm run build`: passes.
- `npm run lint`: fails due pre-existing errors in `.claude/worktrees/objective-hofstadter/...` and unrelated existing UI lint warnings; no new lint errors from this change set.
