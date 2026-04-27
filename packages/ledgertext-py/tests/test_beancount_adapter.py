from decimal import Decimal

import pytest

beancount = pytest.importorskip("beancount")  # noqa: F841

from tutorfin.ledgertext import balances, load


JOURNAL = """
2026-04-01 open Assets:Cash
2026-04-01 open Equity:Opening-Balances
2026-04-01 open Income:Sales
2026-04-01 open Expenses:Materials

2026-04-01 * "Seed money"
  Assets:Cash               100.00 USD
  Equity:Opening-Balances  -100.00 USD

2026-04-02 * "Buy lemons"
  Expenses:Materials         35.00 USD
  Assets:Cash               -35.00 USD

2026-04-03 * "Sales day 1"
  Assets:Cash                60.00 USD
  Income:Sales              -60.00 USD
"""


def test_load_collects_accounts_and_transactions():
    ledger = load(JOURNAL)
    assert "Assets:Cash" in ledger.accounts
    assert len(ledger.transactions) == 3
    assert ledger.errors == []


def test_each_transaction_balances():
    ledger = load(JOURNAL)
    for txn in ledger.transactions:
        assert txn.is_balanced(), f"unbalanced: {txn}"


def test_balances_match_check_figures():
    ledger = load(JOURNAL)
    b = balances(ledger)
    assert b["Assets:Cash"] == Decimal("125.00")
    assert b["Income:Sales"] == Decimal("-60.00")
    assert b["Expenses:Materials"] == Decimal("35.00")


def test_unknown_syntax_raises():
    with pytest.raises(KeyError):
        load("", syntax="hledger")
