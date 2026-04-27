# Test artifacts

CI writes per-run artifacts here under directories of the form:

```
.artifacts/<UTC-timestamp>-<github-run-id>-<job>/
  ├── junit.xml         # JUnit-format test results
  ├── coverage.xml      # Coverage (Cobertura format)
  ├── pytest.log        # stdout/stderr
  ├── notebooks.log     # notebook execution log
  ├── ts-build.log
  ├── vitest.log
  ├── next-build.log
  └── playwright/...    # Playwright HTML report + traces
```

The directory is also uploaded as a GitHub Actions artifact for the run.
Locally, you can produce the same layout by setting `ARTIFACT_DIR=.artifacts/local` and re-running the test commands from `.github/workflows/ci.yml`.
