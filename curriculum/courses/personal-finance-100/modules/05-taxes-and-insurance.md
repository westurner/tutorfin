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
  slug: taxes-and-insurance
  title: Taxes & Insurance
  position: 5
  status: draft
  tags: [taxes, insurance, paycheck, risk]
---

# Taxes & Insurance

Reading a paycheck, basic tax brackets, and mitigating risk.

## Learning objectives
- Read a sample paycheck stub: gross, FICA, federal/state withholding, net.
- Compute marginal vs. effective tax rate at a given income.
- Explain how insurance pools risk.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:personal-finance-100:taxes-and-insurance",
    "name": "Taxes & Insurance",
    "position": 5,
    "isPartOf": {"@id": "urn:tutorfin:course:personal-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["paycheck", "tax brackets", "insurance", "risk mitigation"],
    "citation": [
        {"@type": "CreativeWork", "name": "Taxes",
         "url": "https://www.khanacademy.org/college-careers-more/personal-finance/pf-taxes"},
        {"@type": "CreativeWork", "name": "Financial Literacy: Insurance",
         "url": "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:insurance"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Paycheck breakdown

Gross $5,000/month. FICA 7.65%, federal withholding 12%, state 5%. Compute net pay.

```{code-cell} ipython3
gross = 5_000
fica = gross * 0.0765
fed = gross * 0.12
state = gross * 0.05
net = gross - fica - fed - state
print(f"FICA: ${fica:.2f}, Fed: ${fed:.2f}, State: ${state:.2f}, Net: ${net:.2f}")
assert abs(net - 3767.50) < 0.01
```

## Exercise 2 — Marginal vs. effective tax rate

Simplified brackets: 10% to $10k, 20% to $40k, 30% above. Income = $60k. Compute total tax and effective rate.

```{code-cell} ipython3
def progressive_tax(income: float) -> float:
    brackets = [(10_000, 0.10), (30_000, 0.20), (float("inf"), 0.30)]
    tax, remaining = 0.0, income
    for width, rate in brackets:
        taxed = min(remaining, width)
        tax += taxed * rate
        remaining -= taxed
        if remaining <= 0:
            break
    return tax

income = 60_000
tax = progressive_tax(income)
effective = tax / income
print(f"Tax: ${tax:.0f}, Effective rate: {effective:.1%}, Marginal: 30%")
assert tax == 13_000
assert abs(effective - 0.2167) < 0.001
```

## Exercise 3 — Insurance expected value

10,000 people each pay $200/yr into a pool. Each year ~100 file a $20,000 claim. Does the pool break even?

```{code-cell} ipython3
premiums = 10_000 * 200
claims = 100 * 20_000
print(f"Premiums: ${premiums}, Claims: ${claims}, Surplus: ${premiums - claims}")
assert premiums == claims, "Expected to break even at these numbers."
```
