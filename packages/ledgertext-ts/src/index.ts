import { BeancountAdapter } from "./beancount.js";
import type { Ledger, LedgerAdapter, Posting, Transaction } from "./base.js";

export type { Ledger, LedgerAdapter, Posting, Transaction };
export { isBalanced } from "./base.js";

const registry = new Map<string, LedgerAdapter>();

export function registerAdapter(adapter: LedgerAdapter): void {
  registry.set(adapter.name, adapter);
}

export function getAdapter(name: string): LedgerAdapter {
  const a = registry.get(name);
  if (!a) {
    throw new Error(
      `No LedgerText adapter registered for "${name}". Available: ${[...registry.keys()].join(", ")}`,
    );
  }
  return a;
}

export function load(text: string, syntax: string = "beancount"): Ledger {
  return getAdapter(syntax).load(text);
}

/** Sum signed amounts per account, ignoring currency. */
export function balances(ledger: Ledger): Record<string, number> {
  const out: Record<string, number> = {};
  for (const txn of ledger.transactions) {
    for (const p of txn.postings) {
      out[p.account] = (out[p.account] ?? 0) + p.amount;
    }
  }
  return out;
}

// Default adapter
registerAdapter(new BeancountAdapter());
