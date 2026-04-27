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
  slug: credit-and-debt
  title: Credit & Debt
  position: 2
  status: draft
  tags: [credit, debt, interest, credit-score]
---

# Credit & Debt

Understanding credit scores, credit cards, and interest rates.

## Learning objectives
- Define a credit score and list factors that affect it.
- Compare simple and revolving (credit-card) interest.
- Compute total interest on a balance under minimum payments.

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:personal-finance-100:credit-and-debt",
    "name": "Credit & Debt",
    "position": 2,
    "isPartOf": {"@id": "urn:tutorfin:course:personal-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["credit score", "credit cards", "interest rates", "revolving debt"],
    "citation": [
        {"@type": "CreativeWork", "name": "Interest and Debt",
         "url": "https://www.khanacademy.org/college-careers-more/personal-finance/pf-interest-and-debt"},
        {"@type": "CreativeWork", "name": "Financial Literacy: Consumer Credit",
         "url": "https://www.khanacademy.org/college-careers-more/financial-literacy/xa6995ea67a8e9fdd:consumer-credit"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Simple vs. compound interest

$1,000 at 10% for 3 years: simple vs. annually compounded.

```{code-cell} python
principal, rate, years = 1000, 0.10, 3
simple = principal * rate * years
compound = principal * (1 + rate) ** years - principal
print(f"Simple: ${simple:.2f}, Compound: ${compound:.2f}")
assert simple == 300
assert abs(compound - 331.0) < 0.01
```

## Exercise 2 — Credit-card minimum payment trap

$1,000 balance at 24% APR. Minimum payment = max(2% of balance, $25). Simulate 12 months of minimum payments and report total interest paid.

```{code-cell} python
def simulate_min_payments(balance: float, apr: float, months: int) -> tuple[float, float]:
    monthly_rate = apr / 12
    total_interest = 0.0
    for _ in range(months):
        interest = balance * monthly_rate
        total_interest += interest
        balance += interest
        payment = max(0.02 * balance, 25.0)
        balance = max(0.0, balance - payment)
    return balance, total_interest

remaining, interest = simulate_min_payments(1000, 0.24, 12)
print(f"After 12 months: balance=${remaining:.2f}, interest paid=${interest:.2f}")
assert interest > 200, "At 24% APR most of a year is interest."
```

## Exercise 3 — Credit-score factors

Rank these factors by approximate FICO weight: payment history, amounts owed, length of history, new credit, credit mix.

```{code-cell} python
weights = {
    "payment history": 0.35,
    "amounts owed": 0.30,
    "length of history": 0.15,
    "new credit": 0.10,
    "credit mix": 0.10,
}
assert abs(sum(weights.values()) - 1.0) < 1e-9
ranked = sorted(weights.items(), key=lambda kv: -kv[1])
print(ranked)
```
