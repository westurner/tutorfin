import { test, expect } from "../../../tests/e2e/fixtures/coverage";

test.describe("@tutorfin/web home page", () => {
  test("renders title, tagline, and language switcher", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /TutorFin/i })).toBeVisible();
    await expect(page.getByText(/financial-literacy exhibit/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "es-US" })).toBeEnabled();
  });

  test("switching locale disables active button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "es-US" }).click();
    await expect(page.getByRole("button", { name: "es-US" })).toBeDisabled();
  });

  test("reset button: cancel confirm leaves page unchanged", async ({ page }) => {
    await page.goto("/");
    page.on("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("button", { name: /Reset exhibit/i }).click();
    // locale buttons still present — page not reset
    await expect(page.getByRole("button", { name: "en-US" })).toBeVisible();
  });

  test("reset button: accept confirm calls manualReset", async ({ page }) => {
    await page.goto("/");
    // Switch locale first so we can observe the reset
    await page.getByRole("button", { name: "es-US" }).click();
    await expect(page.getByRole("button", { name: "es-US" })).toBeDisabled();
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /Reiniciar exhibición/i }).click();
    // After reset, en-US should be active again (disabled)
    await expect(page.getByRole("button", { name: "en-US" })).toBeDisabled();
  });
});
