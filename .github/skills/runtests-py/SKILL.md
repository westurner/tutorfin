---
name: runtests-py
description: 'Run the TutorFin Python test suite (pytest + coverage on packages/ledgertext-py), parse JUnit XML + coverage.xml + .coverage data into a machine-readable plan, then add the smallest set of new tests to reach a target line-coverage percentage. Use when: user asks to "run python tests", "raise python coverage", "pytest coverage", "ledgertext-py tests", "fix python coverage gaps", or mentions pytest, coverage.xml, ledgertext-py, beancount adapter tests. Operates only on the Python side (packages/ledgertext-py) and respects the existing tests/ layout under that package.'
argument-hint: '[target-percent] (default 100)'
---

# runtests-py

Python sibling of the `runtests` skill. Runs `pytest` with coverage on `packages/ledgertext-py`, parses the XML/JSON artifacts, plans minimal additional tests, and implements them.

## When to Use

- "Get python coverage to N%"
- "Plan python tests for the ledgertext package"
- "Why is python coverage low?"
- Any request that should react to `coverage.xml` / `junit.xml` from `packages/ledgertext-py/.tmp/`

Do NOT use for the TS/vitest side — use `runtests` for that.

## Inputs

- Optional argument: target line-coverage percent (default `100`).

## Outputs

1. `.tmp/runtests-py-plan.md` — ROI-ordered list of files to test
2. New `tests/test_*.py` files under `packages/ledgertext-py/tests/`
3. Final coverage delta (before → after) reported to chat

## Procedure

### 1. Run the report

```sh
cd tutorfin && \
  source ../.venv/bin/activate && \
  mkdir -p packages/ledgertext-py/.tmp && \
  pytest packages/ledgertext-py/tests \
    --cov=tutorfin.ledgertext \
    --cov-report=xml:packages/ledgertext-py/.tmp/coverage.xml \
    --cov-report=json:packages/ledgertext-py/.tmp/coverage.json \
    --cov-report=term \
    --junitxml=packages/ledgertext-py/.tmp/junit.xml
```

If pytest exits non-zero, STOP and surface failures — never plan against a red baseline.

### 2. Parse and rank gaps

```sh
node ./.github/skills/runtests-py/scripts/plan-coverage-py.mjs <target-percent> \
  > .tmp/runtests-py-plan.json
```

Parser reads:
- `packages/ledgertext-py/.tmp/coverage.json` (Coverage.py JSON: per-file `executed_lines` / `missing_lines`)
- `packages/ledgertext-py/.tmp/junit.xml` (test failures)

Emits the same JSON shape as the TS planner: `summary`, `files` (sorted by missing line count), `failed`, `recommendation`.

### 3. Triage

If `failed` is non-empty, fix existing tests first.

### 4. Plan

Apply Python-specific planning rules:

| Rule | Why |
|---|---|
| Prefer parametrized tests (`@pytest.mark.parametrize`) for adapter edge cases | One file covers many missing branches |
| Use `pytest.importorskip("beancount")` for any beancount-touching test | Keeps tests runnable when the optional dep is absent |
| Prefer testing `LedgerAdapter` Protocol contracts via the `api.register_adapter` registry, not internals | Keeps refactors safe |
| Don't write tests that simply import a module to bump coverage | Each test must assert behavior |
| If reaching target requires a new optional dep (e.g. another adapter), surface and ask | User confirmation gate |

### 5. Implement

- Tests live under `packages/ledgertext-py/tests/test_*.py`
- Use the existing `BeancountAdapter` test as a style reference
- One test module per source module being covered
- After each new file, re-run the report and re-read `coverage.json`. Stop when target met.

### 6. Validate and report

1. Re-run the pytest command above (exit 0 required)
2. Read `packages/ledgertext-py/.tmp/coverage.json` totals
3. Reply with: files added, before→after percentages, any remaining gaps with rationale (or a `pyproject.toml` `[tool.coverage.run] omit` suggestion).

## Resources

- [scripts/plan-coverage-py.mjs](./scripts/plan-coverage-py.mjs) — Python coverage parser + planner
- [packages/ledgertext-py/](../../../packages/ledgertext-py/) — package under test
- Sibling skill: [runtests](../runtests/SKILL.md) for the TS side

## Notes

- All intermediate artifacts go in `packages/ledgertext-py/.tmp/` (gitignored).
- This skill does not run jupytext lesson notebooks or Python in `web/`.
