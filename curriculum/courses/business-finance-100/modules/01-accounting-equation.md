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
  slug: accounting-equation
  title: The Accounting Equation
  position: 1
  status: draft
  tags: [accounting-equation, assets, liabilities, equity]
---

# The Accounting Equation

$$\text{Assets} = \text{Liabilities} + \text{Equity}$$

## Learning objectives
- State and apply the accounting equation to a given balance sheet.
- Show that any valid transaction preserves the equation.

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:business-finance-100:accounting-equation",
    "name": "The Accounting Equation",
    "position": 1,
    "isPartOf": {"@id": "urn:tutorfin:course:business-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["assets", "liabilities", "equity", "accounting equation"],
    "citation": [
        {"@type": "CreativeWork", "name": "The Balance Sheet and Accounting Equation",
         "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Solve for the missing variable

Assets $50,000; Liabilities $20,000. What's Equity?

```{code-cell} python
assets, liabilities = 50_000, 20_000
equity = assets - liabilities
print(f"Equity = ${equity}")
assert equity == 30_000
```

## Exercise 2 — Equation invariance under transactions

A company borrows $5,000 cash from a bank. Show how Assets, Liabilities, and Equity each change and that the equation still balances.

```{code-cell} python
def equation(a, l, e):
    assert a == l + e, f"Equation violated: {a} != {l} + {e}"

# Before
A, L, E = 50_000, 20_000, 30_000
equation(A, L, E)

# Borrow $5,000 cash
A += 5_000   # cash increases
L += 5_000   # loan payable increases
equation(A, L, E)
print(f"After loan: A={A}, L={L}, E={E}")
```

## Exercise 3 — Owner contribution

Owner contributes $10,000 cash. Update and verify the equation.

```{code-cell} python
A, L, E = 55_000, 25_000, 30_000
A += 10_000  # cash up
E += 10_000  # equity up
equation(A, L, E)
print(f"After contribution: A={A}, L={L}, E={E}")
```
