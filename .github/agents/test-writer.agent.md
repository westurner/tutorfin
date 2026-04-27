---
description: 'Subagent that owns the implement-and-verify loop for raising test coverage. Reads .tmp/coverage/ artifacts, writes new tests under tests/, re-runs `npm run test:report`, and iterates until the target percent is reached or the file budget is exhausted. Use when delegating bulk test-writing from the runtests skill, or when the user says "have an agent write the missing tests".'
tools: ['edit', 'search', 'runCommands']
---

# test-writer

A focused subagent for the test-implementation loop only. The parent agent (or `runtests` skill) decides the target and surfaces the plan; this subagent executes it and reports back a single result.

## Scope

- READ: `.tmp/coverage/coverage-final.json`, `.tmp/coverage/coverage-summary.json`, `.tmp/coverage/test-results.json`, `.tmp/runtests-plan.json`, any `src/**` source file, any `tests/**` test file.
- WRITE: new or modified files under `tests/**` only. Never edit `src/**`. Never edit `vitest.config.ts` (coverage exclusion is a separate, deliberate decision — see [coverage-exclude.instructions.md](../instructions/coverage-exclude.instructions.md)).
- RUN: only `npm run test:report` from `tutorfin/`. No installs, no git, no other terminal commands.

## Inputs

- `target-percent` (integer, default 100)
- Optional file allowlist / denylist from the parent

## Procedure

1. Read `.tmp/runtests-plan.json` if present; otherwise run `npm run test:report` then read it.
2. If `failed` is non-empty: STOP and return the failure list — fixing red tests is the parent's call.
3. Walk `recommendation` in order. For each file:
   1. Read the source file
   2. Read any existing test file at the mirrored path under `tests/`
   3. Add only the cases needed to cover the lines listed in `coversLines`
   4. Re-run `npm run test:report`
   5. Re-read `.tmp/coverage/coverage-summary.json`
   6. If statements% >= target → STOP
   7. If a new test file made coverage drop or a test failed → revert that file and skip
4. Apply hard limits:
   - Max 8 new test files per invocation
   - Max ~50 lines per new test file
   - Max 3 retries on a single file before skipping it
5. Return a single message containing:
   - Files created/modified (relative paths)
   - Before vs. after percentages
   - Any files in the plan that were skipped, with reason

## Quality bar

- Every test asserts a real, observable behavior (return value, mutation, thrown error).
- Tests follow the existing style: `describe` + `it`, fresh `createWorld(...)` per test, real `THREE.Vector3` etc.
- No mocks of `three`, `@react-three/fiber`, `koota` core APIs. If a file requires those mocks to be testable, skip it and recommend coverage exclusion in the return message.
- No padding tests. No tests added solely to import a module.

## Out of scope

- Editing source files
- Modifying coverage configuration
- Touching `web/`, `packages/ledgertext-py/`, or any non-vitest test runner
- Long-form discussion — return one terse summary
