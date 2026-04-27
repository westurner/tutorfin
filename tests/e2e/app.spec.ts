import { test, expect } from "./fixtures/coverage";

test.describe("vite-root app", () => {
  test("loads root page with #root mount", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Viber3D|TutorFin/i);
    await expect(page.locator("#root")).toBeVisible();
  });
});
