---
description: Bootstrap (or re-bootstrap idempotently) the TutorFin Playwright e2e setup — playwright.config.ts with web (:3000) and vite-root (:5173) projects, monocart-coverage-reports fixture, tests/e2e/ folders, and the test:e2e:report script. Does NOT plan or run coverage.
---

# /e2e-bootstrap

Scaffold the Playwright + monocart coverage harness for TutorFin without running tests or planning coverage. Idempotent — safe to re-run; existing files are detected and left alone.

## Steps

1. **Add devDeps** to `tutorfin/package.json` (root) if missing:
   - `@playwright/test`
   - `monocart-coverage-reports`
   Then run `pnpm install` from `tutorfin/`.

2. **Install browsers** (once): `pnpm exec playwright install --with-deps chromium`.

3. **Create `tutorfin/playwright.config.ts`** if missing, with two projects:
   - `web` — `baseURL: 'http://localhost:3000'`, `webServer: { command: 'pnpm --filter @tutorfin/web run dev', port: 3000, reuseExistingServer: !process.env.CI }`
   - `vite-root` — `baseURL: 'http://localhost:5173'`, `webServer: { command: 'npm run dev', port: 5173, reuseExistingServer: !process.env.CI }`
   - `testDir: './'`, `testMatch: ['**/tests/e2e/**/*.spec.ts']`
   - `reporter: [['list'], ['json', { outputFile: '.tmp/e2e-coverage/results.json' }]]`
   - `use: { trace: 'on-first-retry' }`

4. **Create the coverage fixture** at `tutorfin/tests/e2e/fixtures/coverage.ts`:
   - Wraps `test` from `@playwright/test`.
   - `beforeEach`: `await page.coverage.startJSCoverage({ resetOnNavigation: false })`.
   - `afterEach`: collect entries, feed to `monocart-coverage-reports` (`MCR`) configured with `outputDir: '.tmp/e2e-coverage'`, `reports: ['v8', 'json-summary', 'json']`, and `entryFilter`/`sourceFilter` restricted to `tutorfin/src/**` and `tutorfin/web/**`.
   - Re-export `test` and `expect`.

5. **Create placeholder spec folders** if missing:
   - `tutorfin/web/tests/e2e/.gitkeep`
   - `tutorfin/tests/e2e/.gitkeep`

6. **Add root script** to `tutorfin/package.json`:
   ```json
   "test:e2e:report": "playwright test --reporter=json --output=.tmp/e2e-coverage/playwright-output > .tmp/e2e-coverage/results.json"
   ```

7. **Ensure `.tmp/` is gitignored** (check `tutorfin/.gitignore`; add `.tmp/` if missing).

## Out of scope

- Do NOT run `playwright test` after bootstrap — that's the `runtests-e2e` skill's job.
- Do NOT write any specs — let the user (or `runtests-e2e`) drive that.
- Do NOT modify existing `playwright.config.ts` / fixture / scripts — report what already exists and skip.

## Output

Reply with a checklist of what was created vs. what already existed, and the next suggested command (`/runtests-e2e` to plan + write specs).
