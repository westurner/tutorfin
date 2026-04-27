#!/usr/bin/env node
// Parse Coverage.py JSON + JUnit XML for packages/ledgertext-py and emit
// a machine-readable plan to reach the target line-coverage percentage.
//
// Usage: node plan-coverage-py.mjs [target-percent]
//
// Reads:
//   packages/ledgertext-py/.tmp/coverage.json
//   packages/ledgertext-py/.tmp/junit.xml
// Writes plan JSON to stdout.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const cwd = process.cwd();
const target = Math.min(100, Math.max(1, Number(process.argv[2]) || 100));
const PKG = resolve(cwd, 'packages/ledgertext-py/.tmp');
const COV = resolve(PKG, 'coverage.json');
const JUNIT = resolve(PKG, 'junit.xml');

if (!existsSync(COV)) {
	process.stderr.write(
		`missing ${COV}; run the pytest command from runtests-py SKILL.md first\n`,
	);
	process.exit(2);
}

const cov = JSON.parse(readFileSync(COV, 'utf8'));

function collapseRanges(lines) {
	const sorted = [...new Set(lines)].sort((a, b) => a - b);
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
	return ranges;
}

const files = [];
let totalStmts = 0,
	hitStmts = 0;
for (const [path, entry] of Object.entries(cov.files || {})) {
	const summary = entry.summary || {};
	const numStmts = summary.num_statements ?? 0;
	const missing = entry.missing_lines || [];
	totalStmts += numStmts;
	hitStmts += numStmts - missing.length;
	if (missing.length === 0) continue;
	files.push({
		path,
		totalStatements: numStmts,
		hitStatements: numStmts - missing.length,
		missedStatements: missing.length,
		missedLineRanges: collapseRanges(missing),
		strategy:
			path.includes('adapter') || path.includes('api')
				? 'adapter-fixture'
				: 'pure-fn-unit',
	});
}
files.sort((a, b) => b.missedStatements - a.missedStatements);

// Failing tests from JUnit XML — minimal regex parse (sufficient for pytest)
const failed = [];
if (existsSync(JUNIT)) {
	const xml = readFileSync(JUNIT, 'utf8');
	const re =
		/<testcase\b[^>]*\bclassname="([^"]+)"[^>]*\bname="([^"]+)"[^>]*>[\s\S]*?<(failure|error)\b[^>]*message="([^"]*)"/g;
	let m;
	while ((m = re.exec(xml)) !== null) {
		failed.push({ classname: m[1], name: m[2], kind: m[3], message: m[4] });
	}
}

const need = Math.max(0, Math.ceil((target / 100) * totalStmts) - hitStmts);
let projected = hitStmts;
const recommendation = [];
for (const f of files) {
	if (projected >= hitStmts + need) break;
	projected += f.missedStatements;
	recommendation.push({
		path: f.path,
		strategy: f.strategy,
		coversStatements: f.missedStatements,
		coversLines: f.missedLineRanges,
		projectedStatementsPct: +((projected / totalStmts) * 100).toFixed(2),
	});
}

const plan = {
	target,
	summary: {
		statementsPct: totalStmts ? +((hitStmts / totalStmts) * 100).toFixed(2) : 100,
		statementsCovered: hitStmts,
		statementsTotal: totalStmts,
		neededStatementsToReachTarget: need,
	},
	failed,
	files,
	recommendation,
	notes: [
		'Strategies: pure-fn-unit (fastest), adapter-fixture (loads beancount).',
		'If a file should never be covered (e.g. CLI entry point), add to [tool.coverage.run] omit in pyproject.toml.',
	],
};

process.stdout.write(JSON.stringify(plan, null, 2) + '\n');
