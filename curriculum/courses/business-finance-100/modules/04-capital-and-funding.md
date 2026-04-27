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
  slug: capital-and-funding
  title: Capital & Funding
  position: 4
  status: draft
  tags: [bootstrapping, debt, equity, capital]
---

# Capital & Funding

Bootstrapping, debt financing, and equity.

## Learning objectives
- Compare bootstrapping, debt, and equity along cost, control, and risk.
- Decide an appropriate funding mix for a given scenario.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:business-finance-100:capital-and-funding",
    "name": "Capital & Funding",
    "position": 4,
    "isPartOf": {"@id": "urn:tutorfin:course:business-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["bootstrapping", "debt financing", "equity financing"],
    "citation": [
        {"@type": "CreativeWork", "name": "Stocks and Bonds, Raising Capital",
         "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Cost / control / risk trade-offs

Score each funding source 1 (low) – 3 (high) on cost-of-capital, loss-of-control, and personal-risk-to-founder.

```{code-cell} ipython3
sources = {
    "bootstrapping": {"cost": 1, "control_loss": 1, "founder_risk": 3},
    "debt":          {"cost": 2, "control_loss": 1, "founder_risk": 2},
    "equity":        {"cost": 3, "control_loss": 3, "founder_risk": 1},
}
assert sources["equity"]["control_loss"] == 3
assert sources["bootstrapping"]["founder_risk"] == 3
print(sources)
```

## Exercise 2 — Dilution math

Founders own 100%. They raise $200k by selling new shares at a $800k pre-money valuation. What % do founders own after?

```{code-cell} ipython3
pre_money = 800_000
investment = 200_000
post_money = pre_money + investment
founders_after = pre_money / post_money
print(f"Founders own: {founders_after:.1%}")
assert founders_after == 0.8
```

## Exercise 3 — Debt service coverage

Project EBITDA $120k/yr; annual loan payments $40k. Compute the debt-service coverage ratio (DSCR). Is it healthy (≥ 1.25)?

```{code-cell} ipython3
ebitda, debt_service = 120_000, 40_000
dscr = ebitda / debt_service
print(f"DSCR: {dscr:.2f}")
assert dscr == 3.0
assert dscr >= 1.25
```
