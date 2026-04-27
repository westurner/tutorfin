---
description: Conventions for Playwright e2e specs in TutorFin (web + vite-root). Enforced by the runtests-e2e skill.
applyTo: tutorfin/**/tests/e2e/**/*.spec.ts
---

# Playwright Spec Conventions

Apply these rules to every Playwright spec in `tutorfin/web/tests/e2e/` and `tutorfin/tests/e2e/`.

## Structure

- One top-level route per spec file. Sub-route assertions go in the same file (reuses browser context).
- File path mirrors the source route: `web/app/dashboard/page.tsx` → `web/tests/e2e/dashboard.spec.ts`.
- Cap each file at ~30 lines / 3 cases unless the flow genuinely requires more.

## Imports & fixtures

- Import only from `@playwright/test`: `import { test, expect } from '@playwright/test';`.
- Never import from `playwright-core` directly.
- Use the project `baseURL` from `playwright.config.ts` — call `page.goto('/')`, never `page.goto('http://localhost:3000/...')`.
- For auth-gated routes use the storage-state fixture defined in `playwright.config.ts`; do not re-implement login per spec.

## Network

- Mock all third-party HTTP via `page.route(pattern, route => route.fulfill({...}))`.
- Never hit live external APIs (Stripe, OpenAI, etc.) — flaky and slow.
- First-party API routes (`/api/*`) MAY be hit, but prefer mocking when the test's intent is UI behavior.

## Assertions

- Every spec must assert at least one user-visible behavior — text, role, URL, or DOM state. No "load page, do nothing" specs.
- Prefer `expect(locator).toHaveText(...)` / `toBeVisible()` over `expect(await locator.textContent()).toBe(...)`.
- Use role-based selectors (`page.getByRole`, `getByLabel`) over CSS selectors.

## Anti-patterns

- No `page.waitForTimeout(...)` — use auto-waiting locators or `expect.poll`.
- No screenshots / video assertions in the planning loop (only on final validation).
- No coverage-padding visits (navigating just to bump %).
- No headed-only flows (drag/drop, WebGL canvas) without an explicit user request.
