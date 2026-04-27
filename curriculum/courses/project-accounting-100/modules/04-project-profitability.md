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
  slug: project-profitability
  title: Project Profitability
  position: 4
  status: draft
  tags: [profitability, roi, margin]
---

# Project Profitability

Calculating ROI and margin of specific projects.

## Learning objectives
- Compute gross margin and ROI for a project from revenue and total costs.
- Compare profitability across two scenario projects.

## Schema.org metadata

```{code-cell} ipython3
:tags: [hide-input]

import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:project-accounting-100:project-profitability",
    "name": "Project Profitability",
    "position": 4,
    "isPartOf": {"@id": "urn:tutorfin:course:project-accounting-100"},
    "learningResourceType": "Module",
    "teaches": ["ROI", "gross margin", "scenario comparison"],
    "citation": [
        {"@type": "CreativeWork", "name": "CS007: Evaluating Investments",
         "url": "https://cs007.blog/"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Gross margin

Lemonade stand: revenue $300, COGS $120. Gross margin?

```{code-cell} ipython3
revenue, cogs = 300, 120
gross_margin = (revenue - cogs) / revenue
print(f"Gross margin: {gross_margin:.0%}")
assert gross_margin == 0.6
```

## Exercise 2 — Project ROI

Total costs $200, revenue $300, project ran 1 month. Compute ROI.

```{code-cell} ipython3
revenue, cost = 300, 200
roi = (revenue - cost) / cost
print(f"ROI: {roi:.0%}")
assert roi == 0.5
```

## Exercise 3 — Scenario comparison

Project A: rev $1000, cost $700. Project B: rev $400, cost $200. Which has higher ROI? Higher absolute profit?

```{code-cell} ipython3
def stats(rev: float, cost: float) -> dict:
    profit = rev - cost
    return {"profit": profit, "roi": profit / cost}

A, B = stats(1000, 700), stats(400, 200)
print(f"A: {A}, B: {B}")
assert A["profit"] > B["profit"], "A makes more absolute profit."
assert B["roi"] > A["roi"], "B has higher ROI."
```
