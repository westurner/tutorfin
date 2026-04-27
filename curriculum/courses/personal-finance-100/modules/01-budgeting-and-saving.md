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
  slug: budgeting-and-saving
  title: Budgeting & Saving
  position: 1
  status: draft
  tags: [budgeting, saving, compound-interest, emergency-fund]
---

# Budgeting & Saving

Income vs. expenses, emergency funds, and the power of compound interest.

## Learning objectives
- Distinguish income from expenses and compute a simple monthly budget.
- Explain the purpose of an emergency fund.
- Demonstrate compound interest over time.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:personal-finance-100:budgeting-and-saving",
    "name": "Budgeting & Saving",
    "position": 1,
    "isPartOf": {"@id": "urn:tutorfin:course:personal-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["income vs expenses", "emergency fund", "compound interest"],
    "educationalAlignment": [{
        "@type": "AlignmentObject", "alignmentType": "teaches",
        "educationalFramework": "Common Core",
        "targetName": "CCSS.MATH.CONTENT.7.RP.A.3",
    }],
    "citation": [
        {"@type": "CreativeWork", "name": "Saving and Budgeting",
         "url": "https://www.khanacademy.org/college-careers-more/personal-finance/pf-saving-and-budgeting"},
        {"@type": "CreativeWork", "name": "Financial Literacy: Budgeting and Saving",
         "url": "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:budgeting-and-saving"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Build a monthly budget

A learner earns $2,000/month and spends $1,400 on needs, $300 on wants. How much is left for saving?

```{code-cell} ipython3
income = 2000
needs = 1400
wants = 300
savings = income - needs - wants
print(f"Monthly savings: ${savings}")
assert savings == 300, "Income minus needs minus wants should equal $300."
```

## Exercise 2 — Compound interest check figure

A $100 monthly deposit at 5% APY (compounded monthly) for 10 years.

```{code-cell} ipython3
def future_value_annuity(monthly: float, annual_rate: float, years: int) -> float:
    r = annual_rate / 12
    n = years * 12
    return monthly * (((1 + r) ** n - 1) / r)

fv = future_value_annuity(100, 0.05, 10)
print(f"Future value: ${fv:,.2f}")
assert abs(fv - 15528.23) < 1.0, "Expected ~$15,528 after 10 years."
```

## Exercise 3 — Emergency fund target

Recommended emergency fund = 3–6 months of essential expenses. For monthly essentials of $1,400, compute the 3-month and 6-month targets.

```{code-cell} ipython3
essentials = 1400
target_3mo = essentials * 3
target_6mo = essentials * 6
print(f"3-month target: ${target_3mo}, 6-month target: ${target_6mo}")
assert (target_3mo, target_6mo) == (4200, 8400)
```
