import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  testMatch: ["**/tests/e2e/**/*.spec.ts"],
  testIgnore: ["**/node_modules/**", "**/.tmp/**", "**/dist/**"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: ".tmp/e2e-coverage/results.json" }],
  ],
  use: {
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "vite-root",
      testDir: "./tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
      },
      // dev server is started manually before running; see README in tests/e2e
    },
    {
      name: "web",
      testDir: "./web/tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
      },
    },
  ],
  webServer: [
    {
      command: "pnpm exec vite --port 5173 --strictPort",
      cwd: ".",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: "pnpm exec next dev --port 3000",
      cwd: "./web",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
});
