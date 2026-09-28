import { expect, test } from "@playwright/test";

test("S26 Ultra shows both verified RTL modes and distinguishes window from panel", async ({ page }) => {
  await page.goto("/galaxy-s26-ultra");
  const metricsToggle = page.getByRole("button", { name: "Metrics" });
  if (await metricsToggle.isVisible()) await metricsToggle.click();

  await expect(page.getByRole("button", { name: "Logical Size 384 × 832 dp" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resolution 1440 × 3120 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Captured Window 1080 × 2340 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Top 37.33 dp" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Bottom 48 dp" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Gesture", exact: true }).click();
  await expect(page.getByRole("button", { name: "Bottom 14.93 dp" }).first()).toBeVisible();

  await page.getByRole("button", { name: "View settings" }).click();
  await page.getByRole("radio", { name: "px" }).click();
  await expect(page.getByRole("button", { name: "Top 105 px" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Bottom 42 px" }).first()).toBeVisible();
});
