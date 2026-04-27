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
  slug: TODO-slug
  title: TODO Title
  position: 0
  status: draft
  tags: []
---

# TODO Title

One-paragraph framing of the lesson.

## Learning objectives
- TODO objective 1
- TODO objective 2

## Schema.org metadata

```{code-cell} python
:tags: [hide-input]
import json
LD = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": "urn:tutorfin:module:COURSE-SLUG:MODULE-SLUG",
    "name": "TODO Title",
    "position": 0,
    "isPartOf": {"@id": "urn:tutorfin:course:COURSE-SLUG"},
    "learningResourceType": "Module",
    "teaches": [],
    "citation": [],
}
print(json.dumps(LD, indent=2))
```

## Exercise 1 — TODO

```{code-cell} python
# TODO: compute something
result = 1 + 1
assert result == 2, "Replace with the real check figure."
```
