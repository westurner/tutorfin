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
  slug: project-budgeting
  title: Project Budgeting
  position: 1
  status: draft
  tags: [project-budgeting, estimates, actuals, labor, materials]
---

# Project Budgeting

Estimating costs (labor, materials) vs. actuals.

## Learning objectives
- Build a project budget from labor hours and materials.
- Compare budget vs. actuals and explain variance.

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:project-accounting-100:project-budgeting",
    "name": "Project Budgeting",
    "position": 1,
    "isPartOf": {"@id": "urn:tutorfin:course:project-accounting-100"},
    "learningResourceType": "Module",
    "teaches": ["project budget", "labor cost", "materials cost", "variance"],
    "citation": [
        {"@type": "CreativeWork", "name": "Saving and Budgeting (adapted to project scope)",
         "url": "https://www.khanacademy.org/college-careers-more/personal-finance/pf-saving-and-budgeting"},
    ],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — Build a lemonade-stand budget

Estimate: 20 labor-hours @ $10/hr, $40 in cups, $60 in lemons & sugar.

```{code-cell} python
labor = 20 * 10
materials = 40 + 60
budget = labor + materials
print(f"Budget: ${budget}")
assert budget == 300
```

## Exercise 2 — Variance analysis

Actuals come in at: 25 hours @ $10, $45 cups, $70 lemons & sugar. Compute the variance vs. the $300 budget and classify each line as favorable or unfavorable.

```{code-cell} python
budget = {"labor": 200, "cups": 40, "lemons_sugar": 60}
actual = {"labor": 250, "cups": 45, "lemons_sugar": 70}
variance = {k: actual[k] - budget[k] for k in budget}  # positive = unfavorable
total_var = sum(variance.values())
print(variance, "total:", total_var)
assert variance == {"labor": 50, "cups": 5, "lemons_sugar": 10}
assert total_var == 65
```

## Exercise 3 — Contingency reserve

Add a 10% contingency to the original $300 budget. What's the new ceiling?

```{code-cell} python
budget = 300
ceiling = budget * 1.10
print(f"New ceiling: ${ceiling:.2f}")
assert ceiling == 330.0
```
