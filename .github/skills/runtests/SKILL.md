---
name: runtests
description: 'Run the TutorFin test suite, parse vitest+v8 coverage and JSON test results from .tmp/coverage/, plan minimum-effort but sufficient tests to reach a target coverage percentage while keeping the build fast, then implement those tests under tests/. Use when: user asks to "run tests", "raise coverage", "get to 100% coverage", "plan tests", "write missing tests", "fix coverage gaps", or mentions runtests, vitest, coverage, uncovered lines, test plan. Operates on the TS/TSX side (vitest under tutorfin/) and respects the existing tests/ layout that mirrors src/.'
argument-hint: '[target-percent] (default 100)'
---

# runtests

Run tests, parse machine-readable coverage + result artifacts, propose a plan to reach a target coverage percentage with the smallest, fastest set of new tests, then implement that plan.

## When to Use

- "Run the tests and tell me what's missing"
- "Get coverage to N%"
- "Plan tests to reach 100% coverage"
- "Why is coverage low?"
- "Write tests for the uncovered lines"
- Any work that should react to vitest's `coverage-final.json` / `coverage-summary.json` / `test-results.json` in `.tmp/coverage/`

Do NOT use this skill for: Python (pytest) coverage, the `web/` Next.js package, or e2e/Playwright. Use `runtests` only for the TS/TSX vitest project rooted at `tutorfin/`.

## Inputs

- Optional argument: target coverage percent (default `100`). Interpreted as the **statements** percentage from `coverage-summary.json`.
- Optional user constraints to honor when planning: time budget, files to skip, "no React rendering tests", etc.

## Outputs

1. A **plan** written to `.tmp/runtests-plan.md` listing the smallest set of new test files / cases to reach the target, ordered by ROI (lines covered ÷ estimated test cost).
2. New test files under `tests/` mirroring `src/` paths.
3. A final coverage delta (before → after) printed to chat.

## Procedure

### 1. Run the report

```sh
cd tutorfin && npm run test:report
```

This populates:
- `.tmp/coverage/coverage-final.json` — per-file v8 statement maps with hit counts
- `.tmp/coverage/coverage-summary.json` — totals per file
- `.tmp/coverage/test-results.json` — vitest per-test results

If the script fails (non-zero exit, missing files), STOP and report the failure — do not invent tests against a broken baseline.

### 2. Parse and rank gaps

Run the parser and read its JSON output:

```sh
cd tutorfin && node ./.github/skills/runtests/scripts/plan-coverage.mjs <target-percent> > .tmp/runtests-plan.json
```

The parser reads the three artifacts and emits a JSON document with:

- `summary`: current totals (`statements`, `branches`, `functions`, `lines`) and the gap vs. target
- `files`: ordered list of `{ path, missedStatements, missedLineRanges, totalStatements, hitStatements }`
  - sorted descending by `missedStatements`
  - excluding files already at 100%
- `failed`: any failing tests from `test-results.json` that must be fixed first
- `recommendation`: chosen file order and the predicted new totals after each step

### 3. Triage failing tests first

If `failed` is non-empty, fix those tests before adding new ones. A red baseline invalidates planning.

### 4. Build the plan

Convert `.tmp/runtests-plan.json` into `.tmp/runtests-plan.md` with this shape:

```markdown
# Test Plan — target N%

Current: STMT% / BRANCH% / FUNC% / LINE%
Need: +X statements to clear target

## Files (ordered by ROI)
1. `src/<path>` — covers lines L1–L2, L5; ~M new test cases; **strategy**: pure-fn unit | ECS world fixture | mock R3F
2. ...

## Out of scope (skip)
- src/main.tsx — bootstrap; no logic
- src/components/*.tsx — R3F scenes; require WebGL fixtures (cost > ROI)
```

Apply these **planning rules** to keep the build fast and avoid waste:

| Rule | Why |
|---|---|
| Prefer `pure-fn unit` tests over ECS-world tests over R3F render tests | 10× speed difference per file |
| Skip files where uncovered code is unreachable in tests (e.g. `main.tsx`, framer-only components) | Add to `coverage.exclude` in `vitest.config.ts` instead |
| Group related uncovered lines into ONE test file | Reuse fixtures, lower transform cost |
| Don't add tests that re-execute already-covered branches | Zero ROI |
| Cap any single new test file at ~50 lines / 5 cases unless it's the only way | Keep iteration fast |
| If reaching target requires > 8 new test files, surface the trade-off and ask before continuing | User confirmation gate |

### 5. Implement tests

Following the [tutorfin codebase conventions](../../../README.md):

- Tests live under `tests/` mirroring `src/` (e.g. `src/utils/foo.ts` → `tests/utils/foo.test.ts`).
- Use vitest (`describe`, `it`, `expect`, `beforeEach`).
- For ECS code, build a fresh `createWorld(...)` per test; never share state.
- For Three.js values, use real `THREE.Vector3` etc. — they're cheap and the existing tests already do this.
- Do NOT add coverage-padding tests (calling a function just to bump %). Each test must assert a real behavior. If a function genuinely has no observable behavior worth asserting, exclude it via config instead.

After each new test file, re-run `npm run test:report` and re-read `coverage-summary.json`. Stop as soon as the target is met.

### 6. Validate and report

Final actions, in order:

1. `npm run test:report` (must exit 0)
2. Read updated `.tmp/coverage/coverage-summary.json`
3. Reply to the user with:
   - Files added / modified
   - Before-vs-after totals (statements / branches / functions / lines)
   - Any remaining gaps and why they were left (with config-exclusion suggestion if applicable)

## Resources

- [scripts/plan-coverage.mjs](./scripts/plan-coverage.mjs) — coverage parser + planner
- [vitest.config.ts](../../../vitest.config.ts) — test glob and coverage include/exclude
- [tests/](../../../tests/) — existing test layout to mirror

## Notes

- All intermediate artifacts go in `.tmp/` (gitignored). Never commit `.tmp/`.
- The Python LedgerText package has its own pytest+coverage flow; this skill ignores it.
- The `@tutorfin/web` Next.js package has no vitest config yet; this skill ignores it.
