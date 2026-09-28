import { expect, test, type Page } from "@playwright/test";

async function choose(page: Page, control: string, value: string) {
  // Pose and navigation are always-visible buttons; the rest open a menu.
  if (control !== "Pose" && control !== "Navigation") await page.getByRole("button", { name: new RegExp(`^${control}:`) }).click();
  await page.getByRole("button", { name: value, exact: true }).click();
}

test("TriFold renders both hinges, switches measured modes, and fits each pose", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/galaxy-z-trifold");
  const diagram = page.getByRole("img", { name: /TriFold fold diagram/ });
  await expect(diagram.locator("canvas")).toBeVisible();
  await expect(diagram).toHaveAttribute("data-left-angle", "0.00");
  await expect(diagram).toHaveAttribute("data-right-angle", "0.00");
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("trifold-closed.png");
  const poseZoom = await page.getByRole("button", { name: /^Zoom:/ }).textContent();
  for (const [pose, left, right] of [["Partially Folded", "90.00", "180.00"], ["Open", "180.00", "180.00"]]) {
    await choose(page, "Pose", pose);
    await expect(diagram).toHaveAttribute("data-left-angle", left);
    await expect(diagram).toHaveAttribute("data-right-angle", right);
    await expect(page.locator(".metrics-panel")).toHaveAttribute("aria-busy", "false");
    // Perspective brings the folded left wing nearer the camera, so the fit may
    // shrink there; the settled scale then carries into the open pose.
    expect(parseInt((await page.getByRole("button", { name: /^Zoom:/ }).textContent())!.slice(5))).toBeLessThanOrEqual(parseInt(poseZoom!.slice(5)));
    await expect(page).toHaveScreenshot(`trifold-${pose === "Open" ? "open" : "partial"}.png`);
  }
  const slider = page.getByRole("slider", { name: "Fold sequence" });
  await slider.fill("135");
  await expect(diagram).toHaveAttribute("data-left-angle", "90.00");
  await expect(diagram).toHaveAttribute("data-right-angle", "180.00");
  await slider.press("Escape");
  await expect(page).toHaveScreenshot("trifold-left-hinge.png");
  await slider.fill("45");
  await expect(diagram).toHaveAttribute("data-left-angle", "0.00");
  await expect(diagram).toHaveAttribute("data-right-angle", "90.00");
  await slider.press("Escape");
  await expect(page).toHaveScreenshot("trifold-right-hinge.png");
  await choose(page, "Pose", "Closed");
  await choose(page, "Navigation", "3-button");
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await choose(page, "Navigation", "Gesture");
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await page.getByRole("button", { name: "View settings" }).click();
  await expect(page.getByRole("radio", { name: "px", exact: true })).toBeEnabled();
  await page.getByRole("checkbox", { name: "Show Frame" }).uncheck();
  await page.getByRole("button", { name: "View settings" }).click();
  await choose(page, "Pose", "Open");
  await expect(diagram).toHaveAttribute("data-left-angle", "180.00");
  await choose(page, "Orientation", "Portrait");
  await page.getByRole("button", { name: "View settings" }).click();
  await expect(page.getByRole("checkbox", { name: "Show Frame" })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "Show Frame" }).check();
  await page.getByRole("button", { name: "View settings" }).click();
  await expect(page).toHaveScreenshot("trifold-rotated.png");
  await choose(page, "Zoom", "200%");
  await choose(page, "Pose", "Closed");
  await expect(diagram).toHaveAttribute("data-right-angle", "0.00");
  await expect(page.getByRole("button", { name: "Zoom: 200%" })).toBeVisible();
  await choose(page, "Zoom", "Fit to canvas");
  await expect(page.getByRole("button", { name: "Zoom: 200%" })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("TriFold reduced motion and WebGL fallback select the correct official screen", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/galaxy-z-trifold");
  const diagram = page.getByRole("img", { name: /TriFold fold diagram/ });
  await expect(diagram.locator("canvas")).toBeVisible();
  await choose(page, "Pose", "Open");
  await expect(diagram).toHaveAttribute("data-left-angle", "180.00");
  await expect(diagram).toHaveAttribute("data-right-angle", "180.00");
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).includes("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.reload();
  const fallback = page.getByRole("img", { name: "TriFold fold flat fallback diagram" });
  await expect(fallback).toBeVisible();
  await expect(fallback.locator('image[href^="/skins/galaxy-z-trifold/cover/device."]')).toBeAttached();
  await choose(page, "Pose", "Open");
  await expect(fallback.locator('image[href^="/skins/galaxy-z-trifold/main/device."]')).toBeAttached();
});
