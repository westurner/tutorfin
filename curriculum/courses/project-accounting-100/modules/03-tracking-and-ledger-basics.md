---
jupytext:
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.13
    jupytext_version: 1.19.1
kernelspec:
  display_name: Python 3 (ipykernel)
  language: python
  name: python3
tutorfin:
  slug: tracking-and-ledger-basics
  title: Tracking & Ledger Basics
  position: 3
  status: draft
  tags: [double-entry, ledger, ledgertext, beancount]
---

# Tracking & Ledger Basics

Introduction to double-entry accounting using **LedgerText** (Beancount syntax — see [docs/ledgertext-recommendation.md](../../../../docs/ledgertext-recommendation.md)).

## Learning objectives
- Explain the debit/credit symmetry of double-entry bookkeeping.
- Record a project transaction in LedgerText (Beancount) and verify the journal balances.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:project-accounting-100:tracking-and-ledger-basics",
    "name": "Tracking & Ledger Basics",
    "position": 3,
    "isPartOf": {"@id": "urn:tutorfin:course:project-accounting-100"},
    "learningResourceType": "Module",
    "teaches": ["double-entry accounting", "journal entries", "LedgerText (Beancount)"],
    "citation": [
        {"@type": "CreativeWork", "name": "Cash vs. Accrual Accounting",
         "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme"},
    ],
}
print(json.dumps(LD, indent=2))
```

## A first Beancount journal

Below is the lemonade-stand startup posted in Beancount syntax.

```{code-cell} ipython3
journal = """
2026-04-01 open Assets:Cash
2026-04-01 open Equity:Opening-Balances
2026-04-01 open Expenses:Project:Lemonade:Materials
2026-04-01 open Income:Project:Lemonade:Sales

2026-04-01 * "Owner contributes seed money"
  Assets:Cash                           100.00 USD
  Equity:Opening-Balances              -100.00 USD

2026-04-02 * "Buy lemons & cups"
  Expenses:Project:Lemonade:Materials    35.00 USD
  Assets:Cash                           -35.00 USD

2026-04-03 * "First sales day"
  Assets:Cash                            60.00 USD
  Income:Project:Lemonade:Sales         -60.00 USD
""".strip()
print(journal)
```

## Exercise 1 — Each transaction balances

Verify that every transaction's postings sum to zero.

```{code-cell} ipython3
import re

def split_transactions(text: str) -> list[list[str]]:
    txns, current = [], []
    for line in text.splitlines():
        if re.match(r"^\d{4}-\d{2}-\d{2}\s+\*", line):
            if current:
                txns.append(current)
            current = []
        elif line.startswith("  "):
            current.append(line)
    if current:
        txns.append(current)
    return txns

def amount(line: str) -> float:
    m = re.search(r"(-?\d+\.\d+)\s+USD", line)
    return float(m.group(1)) if m else 0.0

for i, txn in enumerate(split_transactions(journal), 1):
    total = sum(amount(line) for line in txn)
    print(f"txn {i}: sum = {total:+.2f}")
    assert abs(total) < 1e-9, f"Transaction {i} does not balance."
```

## Exercise 2 — Cash balance

Compute the closing balance of `Assets:Cash`.

```{code-cell} ipython3
def account_balance(text: str, account: str) -> float:
    bal = 0.0
    for line in text.splitlines():
        if account in line:
            bal += amount(line)
    return bal

cash = account_balance(journal, "Assets:Cash")
print(f"Assets:Cash = ${cash:.2f}")
assert cash == 125.00, "Started 100, spent 35, sold 60 → 125."
```

## Exercise 3 — Add a transaction

Add a `2026-04-04` posting that records selling $40 more lemonade for cash, then re-run the balance.

```{code-cell} ipython3
addition = """
2026-04-04 * "Day-2 sales"
  Assets:Cash                            40.00 USD
  Income:Project:Lemonade:Sales         -40.00 USD
"""
extended = journal + "\n" + addition.strip()
new_cash = account_balance(extended, "Assets:Cash")
print(f"New Assets:Cash = ${new_cash:.2f}")
assert new_cash == 165.00
```
