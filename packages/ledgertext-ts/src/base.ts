export interface Posting {
  readonly account: string;
  readonly amount: number;
  readonly currency: string;
}

export interface Transaction {
  readonly date: string; // ISO YYYY-MM-DD
  readonly narration: string;
  readonly postings: readonly Posting[];
}

export interface Ledger {
  readonly transactions: readonly Transaction[];
  readonly accounts: readonly string[];
  readonly errors: readonly string[];
}

export interface LedgerAdapter {
  readonly name: string;
  load(text: string): Ledger;
}

const TOLERANCE = 0.005;

export function isBalanced(txn: Transaction): boolean {
  const byCcy = new Map<string, number>();
  for (const p of txn.postings) {
    byCcy.set(p.currency, (byCcy.get(p.currency) ?? 0) + p.amount);
  }
  for (const v of byCcy.values()) {
    if (Math.abs(v) > TOLERANCE) return false;
  }
  return true;
}
