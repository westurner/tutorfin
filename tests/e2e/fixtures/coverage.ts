// Playwright fixture: collects V8 JS coverage per test, merges via
// monocart-coverage-reports into .tmp/e2e-coverage/.
//
// Usage in specs:
//   import { test, expect } from "../fixtures/coverage";
import { test as base, expect } from "@playwright/test";
// @ts-expect-error - monocart ships its own types but we keep import loose
import MCR from "monocart-coverage-reports";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

const mcr = MCR({
  name: "TutorFin E2E Coverage",
  outputDir: path.join(repoRoot, ".tmp/e2e-coverage"),
  reports: [
    ["v8"],
    ["json"],
    ["json-summary"],
  ],
  cleanCache: false,
  sourceFilter: (sourcePath: string) => {
    if (!sourcePath) return false;
    if (sourcePath.includes("/node_modules/")) return false;
    return (
      sourcePath.includes("/tutorfin/src/") ||
      sourcePath.includes("/tutorfin/web/app/") ||
      sourcePath.includes("/tutorfin/web/components/") ||
      sourcePath.includes("/tutorfin/web/lib/")
    );
  },
});

export const test = base.extend<{ autoCoverage: void }>({
  autoCoverage: [
    async ({ page, browserName }, use) => {
      const supportsV8 = browserName === "chromium";
      if (supportsV8) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });
      }
      await use();
      if (supportsV8) {
        const entries = await page.coverage.stopJSCoverage();
        await mcr.add(entries);
      }
    },
    { auto: true },
  ],
});

test.afterAll(async () => {
  await mcr.generate();
});

export { expect };
