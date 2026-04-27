---
slug: tracking-and-ledger-basics
title: Tracking & Ledger Basics
position: 3
status: draft
tags: [double-entry, ledger, ledgertext, beancount]
---

# Tracking & Ledger Basics

Introduction to double-entry accounting (using LedgerText) on a per-project basis.

## Learning objectives
- Explain the debit/credit symmetry of double-entry bookkeeping.
- Record a project transaction in LedgerText (Beancount syntax) and verify the journal balances.

## Check figures
- A balanced posting must sum to zero across all legs.

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": "urn:tutorfin:module:project-accounting-100:tracking-and-ledger-basics",
  "name": "Tracking & Ledger Basics",
  "position": 3,
  "isPartOf": { "@id": "urn:tutorfin:course:project-accounting-100" },
  "learningResourceType": "Module",
  "teaches": ["double-entry accounting", "journal entries", "LedgerText (Beancount)"],
  "citation": [
    { "@type": "CreativeWork", "name": "Cash vs. Accrual Accounting", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme" }
  ]
}
```
