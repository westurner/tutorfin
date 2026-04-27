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
  slug: unit-economics
  title: Unit Economics
  position: 3
  status: draft
  tags: [revenue, cogs, gross-margin]
---

# Unit Economics

Revenue, Cost of Goods Sold (COGS), and Gross Margin.

## Learning objectives
- Compute gross margin from revenue and COGS for a single unit.
- Explain why unit economics drive scaling decisions.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:business-finance-100:unit-economics",
    "name": "Unit Economics",
    "position": 3,
    "isPartOf": {"@id": "urn:tutorfin:course:business-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["revenue", "COGS", "gross margin"],
    "citation": [
        {"@type": "CreativeWork", "name": "Income Statement Basics",
         "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Per-unit gross margin

Sell a cup of lemonade for $2. Lemons + cup cost $0.80.

```{code-cell} ipython3
price, cogs = 2.00, 0.80
unit_margin = (price - cogs) / price
print(f"Unit margin: {unit_margin:.0%}")
assert unit_margin == 0.6
```

## Exercise 2 — Break-even units

Fixed monthly costs $300. Per-unit gross profit $1.20.

```{code-cell} ipython3
fixed = 300
unit_profit = 1.20
break_even = fixed / unit_profit
print(f"Break-even units/month: {break_even:.1f}")
assert 249 < break_even < 251
```

## Exercise 3 — Why bad unit economics don't scale

If per-unit gross profit is **negative**, what happens as you sell more? Demonstrate.

```{code-cell} ipython3
price, cogs = 1.00, 1.20
loss_per_unit = price - cogs
losses = [loss_per_unit * n for n in (10, 100, 1000)]
print(f"Losses at 10/100/1000 units: {losses}")
assert all(loss < 0 for loss in losses)
assert losses[2] < losses[0], "Losses grow more negative as volume grows."
```
