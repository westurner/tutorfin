#!/usr/bin/env node
// Parse vitest+v8 coverage and JSON test results from .tmp/coverage/
// and emit a JSON plan to reach the target statement-coverage percentage
// with the fewest, fastest new tests.
//
// Usage: node plan-coverage.mjs [target-percent]
//   target-percent: integer 1–100, default 100
//
// Reads:
//   .tmp/coverage/coverage-final.json
//   .tmp/coverage/coverage-summary.json
//   .tmp/coverage/test-results.json
// Writes plan JSON to stdout.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const cwd = process.cwd();
const target = Math.min(100, Math.max(1, Number(process.argv[2]) || 100));
const COV_DIR = resolve(cwd, '.tmp/coverage');
const FINAL = resolve(COV_DIR, 'coverage-final.json');
const SUMMARY = resolve(COV_DIR, 'coverage-summary.json');
const RESULTS = resolve(COV_DIR, 'test-results.json');

for (const f of [FINAL, SUMMARY, RESULTS]) {
	if (!existsSync(f)) {
		process.stderr.write(`missing ${f}; run \`npm run test:report\` first\n`);
		process.exit(2);
	}
}

const finalCov = JSON.parse(readFileSync(FINAL, 'utf8'));
const summary = JSON.parse(readFileSync(SUMMARY, 'utf8'));
const results = JSON.parse(readFileSync(RESULTS, 'utf8'));

// Per-file uncovered statement line ranges
function fileGaps(entry) {
	const missed = [];
	const lines = new Set();
	for (const [id, count] of Object.entries(entry.s)) {
		if (count === 0) {
			const loc = entry.statementMap[id];
			if (!loc) continue;
			missed.push([loc.start.line, loc.end.line]);
			for (let l = loc.start.line; l <= loc.end.line; l++) lines.add(l);
		}
	}
	// Collapse contiguous lines to ranges
	const sorted = [...lines].sort((a, b) => a - b);
	const ranges = [];
	let s = null,
		p = null;
	for (const l of sorted) {
		if (s === null) {
			s = p = l;
			continue;
		}
		if (l === p + 1) {
			p = l;
			continue;
		}
		ranges.push(s === p ? `${s}` : `${s}-${p}`);
		s = p = l;
	}
	if (s !== null) ranges.push(s === p ? `${s}` : `${s}-${p}`);
	return { missedStatements: missed.length, missedLineRanges: ranges };
}

const total = summary.total;
const files = [];
for (const [absPath, entry] of Object.entries(finalCov)) {
	const totalStmts = Object.keys(entry.s).length;
	const hitStmts = Object.values(entry.s).filter((c) => c > 0).length;
	if (totalStmts === 0 || hitStmts === totalStmts) continue;
	const { missedStatements, missedLineRanges } = fileGaps(entry);
	files.push({
		path: relative(cwd, absPath),
		totalStatements: totalStmts,
		hitStatements: hitStmts,
		missedStatements,
		missedLineRanges,
		// crude strategy hint
		strategy: absPath.endsWith('.tsx')
			? 'r3f-render-or-skip'
			: absPath.includes('/systems/') || absPath.includes('/actions')
				? 'ecs-world-fixture'
				: 'pure-fn-unit',
	});
}
files.sort((a, b) => b.missedStatements - a.missedStatements);

// Failing tests (must fix first)
const failed = [];
function walk(node) {
	if (!node) return;
	if (Array.isArray(node)) return node.forEach(walk);
	if (node.assertionResults) {
		for (const a of node.assertionResults) {
			if (a.status === 'failed') {
				failed.push({
					file: node.name,
					title: a.fullName || a.title,
					messages: a.failureMessages || [],
				});
			}
		}
	}
	if (node.testResults) walk(node.testResults);
}
walk(results);

// Build incremental plan: add files in ROI order until predicted >= target
const totalStmtsAll = total.statements.total;
const hitStmtsAll = total.statements.covered;
const need = Math.max(0, Math.ceil((target / 100) * totalStmtsAll) - hitStmtsAll);

let projectedHit = hitStmtsAll;
const recommendation = [];
for (const f of files) {
	if (projectedHit >= hitStmtsAll + need) break;
	projectedHit += f.missedStatements;
	recommendation.push({
		path: f.path,
		strategy: f.strategy,
		coversStatements: f.missedStatements,
		coversLines: f.missedLineRanges,
		projectedStatementsPct: +((projectedHit / totalStmtsAll) * 100).toFixed(2),
	});
}

const plan = {
	target,
	summary: {
		statementsPct: total.statements.pct,
		branchesPct: total.branches.pct,
		functionsPct: total.functions.pct,
		linesPct: total.lines.pct,
		statementsCovered: hitStmtsAll,
		statementsTotal: totalStmtsAll,
		neededStatementsToReachTarget: need,
	},
	failed,
	files,
	recommendation,
	notes: [
		'Strategies: pure-fn-unit (fastest), ecs-world-fixture (medium), r3f-render-or-skip (slow; prefer config exclude).',
		'If a file is in `r3f-render-or-skip` and pulling it in alone breaks the budget, add it to coverage.exclude in vitest.config.ts instead of writing a render test.',
	],
};

process.stdout.write(JSON.stringify(plan, null, 2) + '\n');
