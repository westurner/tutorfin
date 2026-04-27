---
name: runtests-e2e
description: 'Run the TutorFin Playwright e2e suite across BOTH the @tutorfin/web Next.js app and the root vite app under tutorfin/src/, parse Playwright JSON results + V8 coverage merged via monocart-coverage-reports from .tmp/e2e-coverage/, plan the smallest set of new e2e specs to reach a target coverage percentage, then implement them under tutorfin/web/tests/e2e/ and tutorfin/tests/e2e/. Auto-bootstraps playwright.config.ts and the coverage fixture if missing. Use when: user asks to "run e2e tests", "run playwright", "raise e2e coverage", "plan e2e tests", "write missing e2e specs", "fix e2e coverage gaps", or mentions runtests-e2e, playwright, end-to-end, browser tests, e2e coverage, monocart.'
argument-hint: '[target-percent] (default 100)'
---

# runtests-e2e

Run Playwright e2e tests against **both** TutorFin frontends — the `@tutorfin/web` Next.js app and the root vite app under `tutorfin/src/` — parse machine-readable test results + V8 coverage merged via `monocart-coverage-reports`, propose a plan to reach a target coverage percentage with the smallest, fastest set of new specs, then implement that plan.

## When to Use

- "Run the e2e tests and tell me what's missing"
- "Get e2e coverage to N%"
- "Plan e2e specs to cover the checkout flow"
- "Why is e2e coverage low?"
- "Write Playwright tests for the uncovered routes"
- Any work that should react to Playwright's `results.json` and the V8/istanbul coverage report in `.tmp/e2e-coverage/`

Do NOT use this skill for: vitest unit/component coverage (use `runtests`) or Python pytest coverage (use `runtests-py`). This skill drives Playwright across two projects: `web` (Next.js, port 3000) and `vite-root` (the root vite app, port 5173).

## Inputs

- Optional argument: target coverage percent (default `100`). Interpreted as the **statements** percentage from the merged coverage summary across e2e runs.
- Optional user constraints: browsers to run (chromium/firefox/webkit), routes/flows to skip, max wall-clock budget, headed vs. headless.

## Outputs

1. A **plan** written to `.tmp/runtests-e2e-plan.md` listing the smallest set of new spec files / user flows to reach the target, ordered by ROI (routes covered ÷ estimated spec cost).
2. New spec files under `web/tests/e2e/` mirroring `web/app/` route paths.
3. A final coverage delta (before → after) and Playwright pass/fail counts printed to chat.

## Procedure

### 0. Bootstrap (auto, idempotent)

If `tutorfin/playwright.config.ts` is missing, scaffold it before doing anything else:

1. Add devDeps to root `tutorfin/package.json`:
   - `@playwright/test`
   - `monocart-coverage-reports`
2. Install browsers: `pnpm exec playwright install --with-deps chromium`
3. Create `tutorfin/playwright.config.ts` with two projects (`web` against `http://localhost:3000`, `vite-root` against `http://localhost:5173`), each using a `webServer` block to start its dev command.
4. Create `tutorfin/tests/e2e/` (vite-root specs) and `tutorfin/web/tests/e2e/` (next specs) with a placeholder `.gitkeep`.
5. Wire a Playwright fixture that calls `page.coverage.startJSCoverage({ resetOnNavigation: false })` before each test and feeds entries to `monocart-coverage-reports` (`MCR`) configured to write to `.tmp/e2e-coverage/` with `reports: ['v8', 'json-summary', 'json']` and `sourceFilter` restricted to `tutorfin/src/**` and `tutorfin/web/**`.
6. Add a root script `"test:e2e:report": "playwright test --reporter=json --output=.tmp/e2e-coverage/playwright-output > .tmp/e2e-coverage/results.json"`.

Bootstrap is idempotent — re-running detects existing files and skips them.

### 1. Run the e2e report

```sh
cd tutorfin && npm run test:e2e:report
```

This runs both projects (`web` and `vite-root`) and populates:
- `.tmp/e2e-coverage/results.json` — Playwright per-spec results (status, duration, errors)
- `.tmp/e2e-coverage/coverage-final.json` — per-file V8 statement maps merged by `monocart-coverage-reports`
- `.tmp/e2e-coverage/coverage-summary.json` — totals per file (statements/branches/functions/lines)

If any artifact is missing, the bootstrap step (0) was skipped or failed — re-run it before planning.

If the run exits non-zero for reasons other than test failures (e.g. browser install missing), run `pnpm exec playwright install --with-deps` once, then retry.

### 2. Parse and rank gaps

Run the parser and read its JSON output:

```sh
cd tutorfin && node ./.github/skills/runtests-e2e/scripts/plan-e2e-coverage.mjs <target-percent> > .tmp/runtests-e2e-plan.json
```

The parser reads the artifacts and emits a JSON document with:

- `summary`: current totals (`statements`, `branches`, `functions`, `lines`) and the gap vs. target
- `routes`: ordered list of `{ route, sourceFile, missedStatements, missedLineRanges, totalStatements, hitStatements }`
  - sorted descending by `missedStatements`
  - excluding routes already at 100%
- `failed`: any failing specs from `results.json` that must be fixed first
- `flaky`: specs that retried before passing (flag for stabilization, do not plan against)
- `recommendation`: chosen route order and predicted new totals after each spec

### 3. Triage failing and flaky specs first

If `failed` is non-empty, fix those specs before adding new ones — a red baseline invalidates planning.
If `flaky` is non-empty, surface them to the user and ask whether to stabilize before extending coverage.

### 4. Build the plan

Convert `.tmp/runtests-e2e-plan.json` into `.tmp/runtests-e2e-plan.md` with this shape:

```markdown
# E2E Test Plan — target N%

Current: STMT% / BRANCH% / FUNC% / LINE%
Need: +X statements to clear target

## Flows (ordered by ROI)
1. `/<route>` — covers `web/app/<route>/page.tsx` lines L1–L2; ~M new spec cases; **strategy**: smoke nav | form submit | auth redirect | API mock
2. ...

## Out of scope (skip)
- /api/* — covered by vitest contract tests; not an e2e responsibility
- /_next/* — framework internals
- Headed-only flows (drag/drop, WebGL canvas) unless explicitly requested
```

Apply these **planning rules** to keep the e2e suite fast and deterministic:

| Rule | Why |
|---|---|
| Prefer `smoke nav` (load + assert title) over `form submit` over `multi-step flow` | 5–10× wall-clock difference per spec |
| One spec per top-level route; group sub-route assertions in same file | Reuse browser context, lower fixture cost |
| Skip routes where uncovered code is server-only (RSC, route handlers) | Add unit tests in `runtests` flow instead |
| Mock external HTTP via `page.route()`; never hit live third-party APIs | Determinism + speed |
| Cap any single spec at ~30 lines / 3 cases unless it's the only way | Keep CI iteration fast |
| Run only `chromium` in the planning loop; expand to firefox/webkit only on final validation | Save ~3× run time |
| If reaching target requires > 6 new spec files, surface the trade-off and ask before continuing | User confirmation gate |

### 5. Implement specs

Following the [tutorfin conventions](../../../tutorfin/README.md):

- **Next.js specs** live under `tutorfin/web/tests/e2e/` mirroring `tutorfin/web/app/` (e.g. `web/app/dashboard/page.tsx` → `web/tests/e2e/dashboard.spec.ts`).
- **Vite-root specs** live under `tutorfin/tests/e2e/` mirroring `tutorfin/src/` (e.g. `src/app.tsx` → `tests/e2e/app.spec.ts`).
- Use Playwright's `test`, `expect` from `@playwright/test`.
- Reuse each project's `baseURL` from `playwright.config.ts`; never hard-code ports.
- For auth-gated routes, use a storage-state fixture rather than logging in per spec.
- Do NOT add coverage-padding specs (visiting a route just to bump %). Each spec must assert a real user-visible behavior.

After each new spec, re-run the report command from step 1 and re-read `coverage-summary.json`. Stop as soon as the target is met.

### 6. Validate and report

Final actions, in order:

1. Re-run the full suite across all configured browsers: `pnpm exec playwright test`
2. Read updated `.tmp/e2e-coverage/coverage-summary.json`
3. Reply to the user with:
   - Spec files added / modified
   - Before-vs-after totals (statements / branches / functions / lines)
   - Pass / fail / flaky counts per browser
   - Any remaining gaps and why they were left (with rationale: server-only, framework, deferred to unit tests)

## Resources

- [scripts/plan-e2e-coverage.mjs](./scripts/plan-e2e-coverage.mjs) — Playwright + monocart V8 coverage parser/planner
- [tutorfin/playwright.config.ts](../../../tutorfin/playwright.config.ts) — `web` and `vite-root` projects, baseURL, coverage fixture wiring (created by bootstrap)
- [tutorfin/web/tests/e2e/](../../../tutorfin/web/tests/e2e/) and [tutorfin/tests/e2e/](../../../tutorfin/tests/e2e/) — spec layouts to mirror

## Notes

- All intermediate artifacts go in `.tmp/e2e-coverage/` (gitignored). Never commit `.tmp/`.
- The vitest unit-coverage flow lives in `runtests`; this skill ignores `tutorfin/src/` and `tutorfin/tests/`.
- The Python LedgerText package has its own pytest+coverage flow (`runtests-py`); this skill ignores it.
- E2E coverage is a **floor**, not a ceiling — a route at 100% e2e coverage may still need unit tests for branch logic.
