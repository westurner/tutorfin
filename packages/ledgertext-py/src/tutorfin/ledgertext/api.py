"""Public API: adapter registry + thin convenience helpers."""
from __future__ import annotations

from decimal import Decimal

from .base import Ledger, LedgerAdapter
from .beancount_adapter import BeancountAdapter

_REGISTRY: dict[str, LedgerAdapter] = {}


def register_adapter(adapter: LedgerAdapter) -> None:
    _REGISTRY[adapter.name] = adapter


def get_adapter(name: str) -> LedgerAdapter:
    if name not in _REGISTRY:
        raise KeyError(f"No LedgerText adapter registered for {name!r}. "
                       f"Available: {sorted(_REGISTRY)}")
    return _REGISTRY[name]


def load(text: str, syntax: str = "beancount") -> Ledger:
    return get_adapter(syntax).load(text)


def balances(ledger: Ledger) -> dict[str, Decimal]:
    """Sum signed amounts per account, ignoring currency.

    Suitable for single-currency exhibit scenarios. For multi-currency cases,
    consume `ledger.transactions` directly.
    """
    out: dict[str, Decimal] = {}
    for txn in ledger.transactions:
        for p in txn.postings:
            out[p.account] = out.get(p.account, Decimal(0)) + p.amount
    return out


# Default adapter
register_adapter(BeancountAdapter())
