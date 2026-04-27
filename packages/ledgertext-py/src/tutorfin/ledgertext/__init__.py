"""TutorFin LedgerText — plaintext accounting abstraction.

Public API is intentionally tiny:

- `Posting`, `Transaction`, `Ledger` — adapter-neutral data classes.
- `LedgerAdapter` — interface adapters implement.
- `load(text, syntax="beancount")` — parse text into a `Ledger`.
- `balances(ledger)` — return {account: signed total} per posting currency-agnostic.
"""
from .base import Ledger, LedgerAdapter, Posting, Transaction
from .api import balances, get_adapter, load, register_adapter

__all__ = [
    "Ledger",
    "LedgerAdapter",
    "Posting",
    "Transaction",
    "balances",
    "get_adapter",
    "load",
    "register_adapter",
]
