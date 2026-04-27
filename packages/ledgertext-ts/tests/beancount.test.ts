import { describe, expect, it } from "vitest";
import { balances, isBalanced, load } from "../src/index.js";

const JOURNAL = `
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
`;

describe("BeancountAdapter", () => {
  it("collects accounts and transactions", () => {
    const ledger = load(JOURNAL);
    expect(ledger.accounts).toContain("Assets:Cash");
    expect(ledger.transactions).toHaveLength(3);
    expect(ledger.errors).toEqual([]);
  });

  it("each transaction balances", () => {
    const ledger = load(JOURNAL);
    for (const txn of ledger.transactions) {
      expect(isBalanced(txn)).toBe(true);
    }
  });

  it("matches check figures", () => {
    const b = balances(load(JOURNAL));
    expect(b["Assets:Cash"]).toBeCloseTo(125, 2);
    expect(b["Income:Sales"]).toBeCloseTo(-60, 2);
    expect(b["Expenses:Materials"]).toBeCloseTo(35, 2);
  });

  it("unknown syntax throws", () => {
    expect(() => load("", "hledger")).toThrowError(/No LedgerText adapter/);
  });
});
