# `@tutorfin/ledgertext` — TypeScript

Mirror of the Python package. Canonical syntax: **Beancount**. Adapters are
pluggable so an `HledgerAdapter` or `LedgerAdapter` can be added later
without changing call sites.

## Use

```ts
import { load, balances } from "@tutorfin/ledgertext";

const journal = `
2026-04-01 open Assets:Cash
2026-04-01 open Equity:Opening-Balances

2026-04-01 * "Seed money"
  Assets:Cash               100.00 USD
  Equity:Opening-Balances  -100.00 USD
`;

const ledger = load(journal);          // syntax: "beancount" by default
console.log(balances(ledger));         // { "Assets:Cash": 100, "Equity:Opening-Balances": -100 }
```

The current adapter uses a small hand-rolled tokeniser sufficient for the
exhibit's read-only / replay use case. To swap in `beancount-parser` (full
fidelity), implement `LedgerAdapter` and call `registerAdapter`.
