---
description: 'How to decide whether to write a test for uncovered code or exclude it from coverage. Applies whenever planning new vitest or pytest tests in this repo.'
applyTo: 'tests/**/*.{ts,tsx},packages/*/tests/**/*.py,vitest.config.ts,pyproject.toml,packages/*/vitest.config.ts'
---

# Coverage Exclusion vs Writing a Test

Default action: **write a test**. Excluding code from coverage is a deliberate decision that should be documented in-config, not silently dropped.

## Exclude from coverage when ALL of these hold

1. The file is a **bootstrap / wiring entry point** with no branchable logic
   - `src/main.tsx` (calls `createRoot(...).render(<App/>)`)
   - `next.config.mjs`, `wrangler.toml` wrappers
2. OR the file is a **pure declarative scene** that only composes React Three Fiber primitives and would require a real WebGL context to execute
   - `src/components/*-renderer.tsx`, `src/components/postprocessing.tsx`
   - These render `<mesh>`, `<Canvas>`, `<EffectComposer>` etc. with no testable conditional logic
3. AND there is **no branching, computation, or state mutation** worth asserting

If any one of those is false, write a test instead.

## How to exclude — TypeScript / vitest

Edit [vitest.config.ts](../../vitest.config.ts):

```ts
coverage: {
  include: ['src/**/*.{ts,tsx}'],
  exclude: [
    'src/vite-env.d.ts',
    'src/main.tsx',                     // bootstrap
    'src/components/*-renderer.tsx',    // R3F scenes; need WebGL
    'src/components/postprocessing.tsx',
  ],
}
```

Add a one-line code comment next to each entry stating the rule (#1, #2, etc.) so the next agent doesn't re-litigate.

## How to exclude — Python / pytest

Edit [pyproject.toml](../../pyproject.toml):

```toml
[tool.coverage.run]
omit = [
  "packages/ledgertext-py/src/tutorfin/ledgertext/_cli.py",  # entry point
]
```

Or use `# pragma: no cover` on a single block when the un-coverable path is local (rare; prefer config-level exclusion).

## Anti-patterns

- **Padding tests**: calling a function only to bump coverage without asserting behavior. Forbidden.
- **Mock-the-world R3F tests**: stubbing `@react-three/fiber` and `three` to make a renderer "execute" 0 statements. The execution is fake — exclude the file instead.
- **Excluding to hide a real branch**: if a function has an `if` you can't reach in tests, that's a design smell. Refactor or document why the branch is unreachable; do not exclude.

## When in doubt

Prefer writing a tiny pure-function test. The `runtests` and `runtests-py` skills will already steer you toward the cheap-test files first; only fall back to exclusion for files those skills flag as `r3f-render-or-skip` or equivalent.
