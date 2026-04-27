#!/usr/bin/env node
// Parses Playwright JSON results + monocart-coverage-reports v8 output
// from .tmp/e2e-coverage/, ranks files by missed statements, and emits a plan.
//
// Usage:
//   node .github/skills/runtests-e2e/scripts/plan-e2e-coverage.mjs [target-percent]
//
// Reads (relative to cwd, expected to be tutorfin/):
//   .tmp/e2e-coverage/results.json           - Playwright reporter output
//   .tmp/e2e-coverage/coverage-summary.json  - monocart summary (pct totals + per-file)
//   .tmp/e2e-coverage/coverage-final.json    - per-file v8 statement maps
//
// Writes JSON plan to stdout.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const target = Number(process.argv[2] ?? 100);
const root = process.cwd();
const covDir = resolve(root, '.tmp/e2e-coverage');

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

const results = readJson(resolve(covDir, 'results.json'), { suites: [], stats: {} });
const summary = readJson(resolve(covDir, 'coverage-summary.json'), null);
const finalCov = readJson(resolve(covDir, 'coverage-final.json'), {});

if (!summary) {
  console.error(JSON.stringify({
    error: 'missing coverage-summary.json',
    hint: 'Run the e2e suite via the runtests-e2e skill (step 1) first.',
  }, null, 2));
  process.exit(2);
}

// --- failing / flaky specs --------------------------------------------------
const failed = [];
const flaky = [];
function walkSuite(suite) {
  for (const s of suite.suites ?? []) walkSuite(s);
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const last = t.results?.[t.results.length - 1];
      if (!last) continue;
      const id = `${spec.file}::${spec.title}`;
      if (last.status === 'failed' || last.status === 'timedOut') {
        failed.push({ id, error: last.error?.message ?? 'unknown' });
      } else if ((t.results.length ?? 0) > 1 && last.status === 'passed') {
        flaky.push({ id, attempts: t.results.length });
      }
    }
  }
}
for (const s of results.suites ?? []) walkSuite(s);

// --- per-file gaps ----------------------------------------------------------
const totals = summary.total ?? {};
const files = [];
for (const [path, entry] of Object.entries(summary)) {
  if (path === 'total') continue;
  const stmts = entry.statements ?? { total: 0, covered: 0, pct: 100 };
  if (stmts.pct >= 100) continue;

  const fileCov = finalCov[path];
  const missedRanges = [];
  if (fileCov?.statementMap && fileCov?.s) {
    for (const [id, hit] of Object.entries(fileCov.s)) {
      if (hit) continue;
      const m = fileCov.statementMap[id];
      if (!m) continue;
      missedRanges.push([m.start.line, m.end.line]);
    }
  }
  files.push({
    path: relative(root, path) || path,
    missedStatements: stmts.total - stmts.covered,
    totalStatements: stmts.total,
    hitStatements: stmts.covered,
    pct: stmts.pct,
    missedLineRanges: missedRanges,
  });
}
files.sort((a, b) => b.missedStatements - a.missedStatements);

// --- recommendation ---------------------------------------------------------
const currentPct = totals.statements?.pct ?? 0;
const totalStmts = totals.statements?.total ?? 0;
const coveredStmts = totals.statements?.covered ?? 0;
const needed = Math.max(0, Math.ceil((target / 100) * totalStmts) - coveredStmts);

const recommendation = [];
let projectedCovered = coveredStmts;
for (const f of files) {
  if (projectedCovered - coveredStmts >= needed) break;
  recommendation.push({
    path: f.path,
    addsStatements: f.missedStatements,
    projectedPct: Number((((projectedCovered + f.missedStatements) / Math.max(1, totalStmts)) * 100).toFixed(2)),
  });
  projectedCovered += f.missedStatements;
}

const out = {
  target,
  summary: {
    statements: totals.statements?.pct ?? 0,
    branches: totals.branches?.pct ?? 0,
    functions: totals.functions?.pct ?? 0,
    lines: totals.lines?.pct ?? 0,
    gap: Math.max(0, target - currentPct),
    neededStatements: needed,
  },
  failed,
  flaky,
  files,
  recommendation,
};

process.stdout.write(JSON.stringify(out, null, 2));
