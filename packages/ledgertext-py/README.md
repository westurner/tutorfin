# `@tutorfin/ledgertext` — Python

Plaintext-accounting abstraction layer. Beancount is the canonical syntax
(see [docs/ledgertext-recommendation.md](../../docs/ledgertext-recommendation.md));
the abstract interface lives behind `LedgerAdapter` so additional adapters
(hLedger, Ledger) can be added later without touching curriculum content.

## Install

```bash
pip install -e ".[notebooks,test]"   # from the repo root pyproject.toml
```

## Use

```python
from tutorfin.ledgertext import load, balances

journal = '''
2026-04-01 open Assets:Cash
2026-04-01 open Equity:Opening-Balances

2026-04-01 * "Seed money"
  Assets:Cash               100.00 USD
  Equity:Opening-Balances  -100.00 USD
'''

ledger = load(journal)               # uses the Beancount adapter by default
print(balances(ledger))              # {'Assets:Cash': 100.00, 'Equity:Opening-Balances': -100.00}
```
