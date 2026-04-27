"""Adapter-neutral data model and the `LedgerAdapter` interface."""
from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal
from typing import Protocol


@dataclass(frozen=True)
class Posting:
    account: str
    amount: Decimal
    currency: str


@dataclass(frozen=True)
class Transaction:
    date: str  # ISO YYYY-MM-DD
    narration: str
    postings: tuple[Posting, ...]

    def is_balanced(self, tolerance: Decimal = Decimal("0.005")) -> bool:
        by_ccy: dict[str, Decimal] = {}
        for p in self.postings:
            by_ccy[p.currency] = by_ccy.get(p.currency, Decimal(0)) + p.amount
        return all(abs(v) <= tolerance for v in by_ccy.values())


@dataclass
class Ledger:
    transactions: list[Transaction] = field(default_factory=list)
    accounts: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


class LedgerAdapter(Protocol):
    """Minimal interface every plaintext-accounting backend must provide."""

    name: str

    def load(self, text: str) -> Ledger: ...
