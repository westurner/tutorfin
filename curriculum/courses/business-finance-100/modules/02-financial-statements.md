---
jupytext:
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.13
kernelspec:
  display_name: Python 3 (ipykernel)
  language: python
  name: python3
tutorfin:
  slug: financial-statements
  title: Financial Statements
  position: 2
  status: draft
  tags: [balance-sheet, income-statement, cash-flow]
---

# Financial Statements

Reading the Balance Sheet, Income Statement, and Cash Flow Statement.

## Learning objectives
- Identify the three core statements and what each answers.
- Trace how a single transaction flows through all three.

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:business-finance-100:financial-statements",
    "name": "Financial Statements",
    "position": 2,
    "isPartOf": {"@id": "urn:tutorfin:course:business-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["balance sheet", "income statement", "cash flow statement"],
    "citation": [
        {"@type": "CreativeWork", "name": "Basic Financial Statements",
         "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Identify the statement

Match each question to the statement that answers it.

```{code-cell} python
mapping = {
    "What does the company own and owe right now?": "Balance Sheet",
    "Did the company make a profit last quarter?":   "Income Statement",
    "Where did cash come from and go this quarter?": "Cash Flow Statement",
}
assert mapping["Did the company make a profit last quarter?"] == "Income Statement"
print(mapping)
```

## Exercise 2 — Net income

Revenue $500k, COGS $200k, OpEx $150k, taxes $40k.

```{code-cell} python
rev, cogs, opex, tax = 500_000, 200_000, 150_000, 40_000
gross = rev - cogs
operating = gross - opex
net = operating - tax
print(f"Gross: ${gross}, Operating: ${operating}, Net: ${net}")
assert (gross, operating, net) == (300_000, 150_000, 110_000)
```

## Exercise 3 — Cash-flow categories

Classify each item as Operating (O), Investing (I), or Financing (F).

```{code-cell} python
flows = {
    "cash from customers": "O",
    "purchase of equipment": "I",
    "issued new shares": "F",
    "paid suppliers": "O",
    "repaid loan principal": "F",
}
assert flows["issued new shares"] == "F"
assert flows["purchase of equipment"] == "I"
print(flows)
```
