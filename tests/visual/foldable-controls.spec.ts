import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { isInCoverage } from "../../app/data/coverage";

const catalog = JSON.parse(readFileSync("app/data/skinCatalog.json", "utf8")) as Array<{
  slug: string; formFactor: string;
}>;
const foldables = catalog.filter(device =>
  (device.formFactor === "foldable-book" || device.formFactor === "foldable-flip")
  && isInCoverage({ ...device, releaseYear: null }));

test("every published Fold and Flip exposes a working hinge control", async ({ page }) => {
  test.setTimeout(120_000);

  for (const device of foldables) {
    await page.goto(`/${device.slug}`);
    await expect(page.getByRole("group", { name: "Device pose and hinge" })).toBeVisible();
    const hinge = page.getByRole("status", { name: "Hinge angle" });
    await expect(hinge).toBeVisible();

    const slider = page.getByRole("slider", { name: "Hinge angle in degrees" });
    await expect(slider).toBeVisible();
    const bounds = await slider.boundingBox();
    expect(bounds, `${device.slug}: hinge slider must have a clickable track`).not.toBeNull();
    await slider.click({ position: { x: bounds!.width * 0.6, y: bounds!.height / 2 } });
    const value = Number(await slider.inputValue());
    expect(value, `${device.slug}: slider must move away from an endpoint`).toBeGreaterThan(0);
    expect(value).toBeLessThan(180);
    await expect(hinge).toContainText(`${value}°`);
    await expect(page.getByRole("img", { name: /fold diagram/ })).toHaveAttribute(
      "data-displayed-angle", value.toFixed(2), { timeout: 5_000 });
  }
});
