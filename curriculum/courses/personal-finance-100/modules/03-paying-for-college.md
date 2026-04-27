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
  slug: paying-for-college
  title: Paying for College
  position: 3
  status: draft
  tags: [college, financial-aid, student-loans, roi]
---

# Paying for College

Financial aid, student loans, and ROI on education.

## Learning objectives
- Identify grants vs. scholarships vs. loans.
- Estimate the lifetime ROI of a degree given tuition and projected earnings deltas.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:personal-finance-100:paying-for-college",
    "name": "Paying for College",
    "position": 3,
    "isPartOf": {"@id": "urn:tutorfin:course:personal-finance-100"},
    "learningResourceType": "Module",
    "teaches": ["financial aid", "student loans", "education ROI"],
    "citation": [
        {"@type": "CreativeWork", "name": "Paying for College",
         "url": "https://www.khanacademy.org/college-careers-more/college-admissions/paying-for-college"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Net cost of attendance

Sticker price $30,000/yr. Grants $8,000, scholarships $4,000. What's the annual net cost?

```{code-cell} ipython3
sticker, grants, scholarships = 30_000, 8_000, 4_000
net = sticker - grants - scholarships
print(f"Net cost per year: ${net}")
assert net == 18_000
```

## Exercise 2 — Loan amortization

$20,000 student loan at 6% APR over 10 years. Compute monthly payment using the standard amortization formula.

```{code-cell} ipython3
def monthly_payment(principal: float, apr: float, years: int) -> float:
    r = apr / 12
    n = years * 12
    return principal * r / (1 - (1 + r) ** -n)

pmt = monthly_payment(20_000, 0.06, 10)
print(f"Monthly payment: ${pmt:.2f}")
assert abs(pmt - 222.04) < 0.5, "~$222/month"
```

## Exercise 3 — ROI on a degree

A degree raises lifetime earnings by $20,000/yr over 30 years. Total cost (tuition + foregone wages) $150,000. Simple ROI?

```{code-cell} ipython3
extra_earnings = 20_000 * 30
total_cost = 150_000
roi = (extra_earnings - total_cost) / total_cost
print(f"ROI: {roi:.0%}")
assert roi == 3.0, "Expected 300% lifetime ROI."
```
