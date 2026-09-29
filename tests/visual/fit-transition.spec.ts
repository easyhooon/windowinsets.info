import { expect, test, type Page } from "@playwright/test";

async function choose(page: Page, label: string, option: string) {
  // Pose and navigation are always-visible buttons; the rest open a menu.
  if (label !== "Pose" && label !== "Navigation") await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("button", { name: option, exact: true }).click();
}
async function settled(page: Page, angle: number) {
  await expect(page.locator("[data-displayed-angle]")).toHaveAttribute("data-displayed-angle", angle.toFixed(2));
}
async function sample(page: Page) {
  return page.evaluate(() => {
    const scale = document.querySelector<HTMLElement>(".diagram-position > [data-orientation-turn] > div")!;
    return {
      angle: Number(document.querySelector<HTMLElement>("[data-displayed-angle]")!.dataset.displayedAngle),
      scale: new DOMMatrix(getComputedStyle(scale).transform).a,
      pan: document.querySelector<HTMLElement>(".diagram-position")!.style.transform,
    };
  });
}
for (const slug of ["galaxy-z-fold8", "galaxy-z-flip8"]) {
  test(`${slug} automatic fit holds scale while folding, then fits the new pose`, async ({ page }) => {
    await page.goto(`/${slug}`);
    await settled(page, 0);
    const closed = await sample(page);
    const zoomButton = page.getByRole("button", { name: /^Zoom:/ });
    const closedZoom = await zoomButton.textContent();
    expect(closed.scale).toBeGreaterThan(0);
    let previous = closed.scale;
    // Sample the actual CSS transform and rendered angle in the same animation frame.
    for (const [pose, target] of [["Open", 180], ["Partially Folded", 90], ["Closed", 0]] as const) {
      const frames = page.evaluate(() => new Promise<Array<{ angle: number; scale: number }>>(resolve => {
        const samples: Array<{ angle: number; scale: number }> = [];
        const start = performance.now();
        const tick = () => {
          const el = document.querySelector<HTMLElement>("[data-displayed-angle]")!;
          const transform = getComputedStyle(document.querySelector(".diagram-position > [data-orientation-turn] > div")!).transform;
          samples.push({ angle: Number(el.dataset.displayedAngle), scale: new DOMMatrix(transform).a });
          if (performance.now() - start < 1000) requestAnimationFrame(tick);
          else resolve(samples);
        };
        requestAnimationFrame(tick);
      }));
      await page.getByRole("button", { name: pose, exact: true }).click();
      const values = await frames;
      const moving = values.filter(v => Math.abs(v.angle - target) > 1 && v.angle > 1 && v.angle < 179);
      expect(moving.length).toBeGreaterThan(2);
      for (const frame of moving) expect(frame.scale).toBeCloseTo(previous, 4);
      await settled(page, target);
      await page.waitForTimeout(400);
      previous = (await sample(page)).scale;
    }
    expect(previous).toBeCloseTo(closed.scale, 2);
    await expect(zoomButton).toHaveText(closedZoom!);
    await choose(page, "Pose", "Open");
    await settled(page, 180);
    await page.waitForTimeout(400);
    // The open pose refits instead of keeping the closed scale. Fold8's landscape inner
    // display can fit larger than its tall cover on a height-bound desktop canvas.
    expect((await sample(page)).scale).not.toBeCloseTo(closed.scale, 2);
    await page.screenshot({ path: test.info().outputPath(`${slug}-open.png`) });
  });

  test(`${slug} manual scale and pan survive poses and Fit recovery`, async ({ page }) => {
    await page.goto(`/${slug}`);
    await settled(page, 0);
    const before = await sample(page);
    await page.locator("#device-canvas").dispatchEvent("wheel", { deltaX: -36, deltaY: -24 });
    const manual = await sample(page);
    expect(manual.scale).toBeCloseTo(before.scale, 4);
    for (const pose of ["Open", "Partially Folded", "Closed"]) {
      await choose(page, "Pose", pose);
      await settled(page, pose === "Open" ? 180 : pose === "Closed" ? 0 : 90);
      expect(await sample(page)).toMatchObject({ scale: manual.scale, pan: manual.pan });
    }
    await choose(page, "Zoom", "200%");
    await choose(page, "Pose", "Open");
    await settled(page, 180);
    await expect(page.getByRole("button", { name: "Zoom: 200%" })).toBeVisible();
    const zoomed = await sample(page);
    await page.locator("#device-canvas").focus();
    await page.keyboard.press("0");
    expect((await sample(page)).pan).toBe("translate(0px, 0px)");
    expect((await sample(page)).scale).toBeLessThan(zoomed.scale);
    await choose(page, "Pose", "Closed");
    await settled(page, 0);
    await page.waitForTimeout(400);
    expect((await sample(page)).scale).toBeCloseTo(before.scale, 2);
  });

  test(`${slug} reduced motion synchronizes fit and hinge endpoints`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${slug}`);
    await settled(page, 0);
    const closed = await sample(page);
    for (const [pose, angle] of [["Open", 180], ["Partially Folded", 90], ["Closed", 0]] as const) {
      await choose(page, "Pose", pose);
      await settled(page, angle);
      // The endpoint fit settles once labels are laid out at the pose's base scale.
      await page.waitForTimeout(400);
      const current = await sample(page);
      expect(current.scale).toBeGreaterThan(0);
      if (angle === 0) expect(current.scale).toBeCloseTo(closed.scale, 2);
      // An explicit Fit must reproduce the scale already reached at the endpoint.
      await page.locator('#device-canvas').focus();
      await page.keyboard.press('0');
      await expect.poll(async () => (await sample(page)).scale).toBeCloseTo(current.scale, 4);
    }
  });
}

test("fully measured Fold6 shows both inner navigation modes", async ({ page }) => {
  await page.goto("/galaxy-z-fold6");
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  const toggle = page.getByRole("button", { name: "Metrics", exact: true });
  if (await toggle.isVisible()) await toggle.click();
  await page.locator(".screen-tabs").getByRole("button", { name: "Inner", exact: true }).click();
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("fold6-inner-three-button.png") });
  await choose(page, "Navigation", "Gesture");
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("fold6-inner-gesture.png") });
  await page.locator(".screen-tabs").getByRole("button", { name: "Outer", exact: true }).click();
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  expect((await page.locator(".diagram-position > [data-orientation-turn] > div").boundingBox())!.width).toBeGreaterThan(0);
  await page.screenshot({ path: test.info().outputPath("fold6-complete-measurements.png") });
});
