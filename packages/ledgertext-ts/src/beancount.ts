import type { LedgerAdapter, Ledger, Posting, Transaction } from "./base.js";

/**
 * Minimal Beancount adapter — sufficient for the exhibit replay use case.
 * Recognises `open`, `*` transactions, and currency-amount postings.
 * For full fidelity (options, pad, balance assertions, prices), swap in
 * `beancount-parser` via `registerAdapter`.
 */
export class BeancountAdapter implements LedgerAdapter {
  readonly name = "beancount";

  load(text: string): Ledger {
    const lines = text.split(/\r?\n/);
    const accounts: string[] = [];
    const transactions: Transaction[] = [];
    const errors: string[] = [];

    let current: { date: string; narration: string; postings: Posting[] } | null = null;
    const flush = () => {
      if (current) {
        transactions.push({
          date: current.date,
          narration: current.narration,
          postings: current.postings,
        });
      }
      current = null;
    };

    const dateRe = /^(\d{4}-\d{2}-\d{2})\s+/;
    const openRe = /^(\d{4}-\d{2}-\d{2})\s+open\s+([A-Za-z][\w:-]*)/;
    const txnRe = /^(\d{4}-\d{2}-\d{2})\s+\*\s+"([^"]*)"/;
    const postingRe = /^\s+([A-Za-z][\w:-]*)\s+(-?\d+(?:\.\d+)?)\s+([A-Z]{2,})/;

    for (const raw of lines) {
      const line = raw.replace(/;.*$/, "").trimEnd();
      if (!line.trim()) continue;

      const open = openRe.exec(line);
      if (open) {
        flush();
        accounts.push(open[2]);
        continue;
      }

      const txn = txnRe.exec(line);
      if (txn) {
        flush();
        current = { date: txn[1], narration: txn[2], postings: [] };
        continue;
      }

      const posting = postingRe.exec(line);
      if (posting && current) {
        current.postings.push({
          account: posting[1],
          amount: Number(posting[2]),
          currency: posting[3],
        });
        continue;
      }

      // Stray date-prefixed directive we don't model; ignore silently.
      if (dateRe.test(line)) {
        flush();
        continue;
      }

      if (current === null && line.trim() && !line.startsWith(";")) {
        errors.push(`unrecognised line: ${line}`);
      }
    }
    flush();

    return { accounts, transactions, errors };
  }
}
