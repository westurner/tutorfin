"""Beancount adapter for LedgerText.

Wraps `beancount.loader.load_string` and projects entries onto the
adapter-neutral `Ledger` data model.
"""
from __future__ import annotations

from decimal import Decimal

from .base import Ledger, Posting, Transaction


class BeancountAdapter:
    name = "beancount"

    def load(self, text: str) -> Ledger:
        # Imported lazily so test collection works even when beancount isn't
        # installed (e.g. a TS-only contributor).
        from beancount import loader  # type: ignore[import-not-found]
        from beancount.core import data  # type: ignore[import-not-found]

        entries, errors, _options = loader.load_string(text)

        accounts: list[str] = []
        txns: list[Transaction] = []
        for entry in entries:
            if isinstance(entry, data.Open):
                accounts.append(entry.account)
            elif isinstance(entry, data.Transaction):
                postings = tuple(
                    Posting(
                        account=p.account,
                        amount=Decimal(str(p.units.number)) if p.units else Decimal(0),
                        currency=p.units.currency if p.units else "",
                    )
                    for p in entry.postings
                )
                txns.append(
                    Transaction(
                        date=entry.date.isoformat(),
                        narration=entry.narration or "",
                        postings=postings,
                    )
                )

        return Ledger(
            transactions=txns,
            accounts=accounts,
            errors=[str(e) for e in errors],
        )
