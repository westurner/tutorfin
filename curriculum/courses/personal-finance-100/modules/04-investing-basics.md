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
  slug: investing-basics
  title: Investing Basics
  position: 4
  status: draft
  tags: [investing, stocks, bonds, index-funds, retirement]
---

# Investing Basics

Risk/reward, stocks, bonds, index funds, and retirement planning.

## Learning objectives
- Distinguish stocks, bonds, and index funds.
- Reason about risk vs. expected return.
- Project a retirement balance from monthly contributions and an assumed real return.

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:personal-finance-100:investing-basics",
    "name": "Investing Basics",
    "position": 4,
    "isPartOf": {"@id": "urn:tutorfin:course:personal-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["risk and reward", "stocks", "bonds", "index funds", "retirement planning"],
    "citation": [
        {"@type": "CreativeWork", "name": "Investments and Retirement",
         "url": "https://www.khanacademy.org/college-careers-more/personal-finance/pf-investments-and-retirement"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Risk vs. return classification

Match each asset to its typical risk profile (low/medium/high).

```{code-cell} python
risk = {
    "savings account": "low",
    "treasury bond": "low",
    "broad index fund": "medium",
    "single stock": "high",
}
assert risk["savings account"] == "low"
assert risk["single stock"] == "high"
print(risk)
```

## Exercise 2 — Retirement projection

$500/month into an index fund averaging 7% real return for 40 years.

```{code-cell} python
def future_value_annuity(monthly: float, annual_rate: float, years: int) -> float:
    r = annual_rate / 12
    n = years * 12
    return monthly * (((1 + r) ** n - 1) / r)

balance = future_value_annuity(500, 0.07, 40)
print(f"Projected balance: ${balance:,.0f}")
assert balance > 1_000_000, "Forty years of $500/mo at 7% should crack $1M."
```

## Exercise 3 — Diversification intuition

A portfolio of one stock has variance $\sigma^2$. Two uncorrelated equally-weighted stocks each with variance $\sigma^2$ have portfolio variance $\sigma^2 / 2$. Why does combining help?

```{code-cell} python
import math
sigma2 = 1.0
single = sigma2
two_uncorrelated = 0.5 * 0.5 * sigma2 + 0.5 * 0.5 * sigma2  # = sigma2 / 2
print(f"single={single}, two_uncorrelated={two_uncorrelated}")
assert math.isclose(two_uncorrelated, sigma2 / 2)
```
