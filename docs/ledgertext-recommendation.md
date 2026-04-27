---
title: LedgerText syntax recommendation
status: proposed
date: 2026-04-27
deciders: [curriculum, engineering]
---

# LedgerText syntax recommendation

> **Recommendation: adopt Beancount as the canonical LedgerText syntax for TutorFin (Python notebooks + TS/JS web app), and design the LedgerText module as an interface that *could* later add Ledger / hLedger adapters if needed.**

## Why we need to decide
TutorFin's design.md calls for a "LedgerText" abstraction over Beancount, Ledger, and hLedger. We need parity in two runtimes:
- **Python** — Jupyter notebooks (also JupyterLite xeus and Google Colab).
- **TypeScript/JavaScript** — the SPA (OpenNext + R3F) for the in-exhibit replay slider.

Maintaining three first-class syntaxes triples authoring, testing, and tooling cost. Picking a primary lets us ship a working vertical slice now without precluding the others.

## Options surveyed (April 2026)

### Beancount
- **Python**: Beancount itself is a Python project (`pip install beancount`); reference parser, validator, and reporting are Python. Works directly in Jupyter and Colab. Runs in JupyterLite via the `beancount-wasm` Pyodide wheels.
- **TS/JS** (recent, actively maintained on npm):
  - `lezer-beancount` — Lezer grammar (CodeMirror 6 editor integration).
  - `tree-sitter-beancount` — tree-sitter grammar (LSPs, tooling).
  - `beancount-parser` — TypeScript port of Beancount's lexer/parser/loader/types.
  - `beancount` (npm package) — TypeScript Beancount parsing with full type safety.
  - `@rustledger/wasm` — Beancount WASM bindings for JS/TS.
  - `beancount-wasm` — Pyodide-compatible Beancount wheels for browser use.
- **Strengths**: strict by design (catches errors early — important for "check figures"), strong typing of currencies and accounts, rich Python ecosystem (Fava, importers), most active modern TS ecosystem of the three.

### hLedger
- **Python**: no native parser; integrations shell out to the `hledger` Haskell binary, which is awkward in JupyterLite/Colab.
- **TS/JS**: a handful of recent packages — `hledger-wasm` (browser via WASM), `tree-sitter-hledger`, `@giduru/codemirror-lang-hledger`, `hledger-parser` (Chevrotain). Smaller ecosystem than Beancount; some are early-stage.
- **Strengths**: friendlier syntax for casual use; great CLI reports.
- **Weaknesses**: Python story is the weakest of the three for in-notebook authoring.

### Ledger (ledger-cli)
- **Python**: `ledger` exposes Python bindings, but they require building C++ (`libledger`) — painful for Colab/JupyterLite.
- **TS/JS**: npm packages (`ledger-cli`, `ledger-analytics`, `ledger-rest`, `ledger-types`) are 8–10 years stale; no actively maintained TS parser.
- **Strengths**: original syntax, very flexible.
- **Weaknesses**: weakest *modern* TS ecosystem; install friction in browser-Python.

## Decision drivers
1. **Runs in JupyterLite + Colab without native compilation** → Beancount (Pyodide wheels) wins.
2. **Active, typed TS parser available today** → Beancount has multiple; hLedger has some; Ledger has none current.
3. **Strictness for educational check figures** → Beancount.
4. **Single syntax authors only need to learn once** → easier on curriculum team.

## Proposal
- Adopt Beancount syntax as the canonical LedgerText for v1.
- Encapsulate parsing/balancing behind a `LedgerText` interface in both runtimes:
  - Python: `tutorfin.ledgertext` wrapping `beancount.loader` + `beancount.core`.
  - TS: `@tutorfin/ledgertext` wrapping `beancount-parser` (or `@rustledger/wasm` if WASM perf is needed).
- Adapter seams (parser, validator, balance query) stay generic, so a future `HledgerAdapter` or `LedgerAdapter` can be added behind the same interface without touching curriculum content.
- All curriculum scenarios author `.beancount` snippets; the SPA replay slider consumes the parsed AST directly.

## Out of scope (for this decision)
- The LedgerText TS/Python implementation itself.
- Cross-syntax conversion utilities (defer until there is concrete demand from a partner using Ledger or hLedger).
