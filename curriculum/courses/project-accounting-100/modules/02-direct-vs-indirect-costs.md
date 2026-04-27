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
  slug: direct-vs-indirect-costs
  title: Direct vs. Indirect Costs
  position: 2
  status: draft
  tags: [direct-cost, indirect-cost, overhead]
---

# Direct vs. Indirect Costs

Understanding how overhead affects a project.

## Learning objectives
- Classify a cost as direct or indirect with respect to a given project.
- Allocate overhead across multiple projects with a chosen driver.

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:project-accounting-100:direct-vs-indirect-costs",
    "name": "Direct vs. Indirect Costs",
    "position": 2,
    "isPartOf": {"@id": "urn:tutorfin:course:project-accounting-100"},
    "learningResourceType": "Module",
    "teaches": ["direct cost", "indirect cost", "overhead allocation"],
    "citation": [
        {"@type": "CreativeWork", "name": "Accounting and Financial Statements",
         "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Classify the cost

For "Project: build a treehouse," classify each cost.

```{code-cell} python
costs = {
    "lumber": "direct",
    "nails": "direct",
    "carpenter wages on this project": "direct",
    "shop electricity": "indirect",
    "manager salary": "indirect",
    "tool depreciation": "indirect",
}
assert costs["lumber"] == "direct"
assert costs["manager salary"] == "indirect"
print(costs)
```

## Exercise 2 — Allocate overhead by labor hours

Total monthly overhead $6,000. Project A used 80 labor-hours; Project B used 120. Allocate by labor hours.

```{code-cell} python
overhead = 6_000
hours = {"A": 80, "B": 120}
total = sum(hours.values())
allocation = {p: overhead * h / total for p, h in hours.items()}
print(allocation)
assert allocation == {"A": 2_400.0, "B": 3_600.0}
assert sum(allocation.values()) == overhead
```

## Exercise 3 — Burdened labor rate

Direct wage $20/hr. Overhead loading 35%. What's the fully burdened cost per labor-hour?

```{code-cell} python
wage = 20.0
burdened = wage * 1.35
print(f"Burdened rate: ${burdened}/hr")
assert burdened == 27.0
```
