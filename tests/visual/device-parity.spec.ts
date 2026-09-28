import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const devices = [
  { slug: "galaxy-z-fold8", label: "Fold8" },
  { slug: "galaxy-z-fold7", label: "Fold7" },
  { slug: "galaxy-z-flip8", label: "Flip8" },
] as const;

const poses = ["Closed", "Partially Folded", "Open"] as const;

async function waitForDiagram(page: Page) {
  await page.locator("canvas[data-engine]").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_000);
}

async function openMetricsIfCollapsed(page: Page) {
  const toggle = page.getByRole("button", { name: "Metrics" });
  if (await toggle.isVisible()) await toggle.click();
}

async function waitForFoldTransition(page: Page) {
  const metrics = page.locator(".metrics-panel");
  await expect(metrics).toHaveAttribute("aria-busy", "true");
  await expect(metrics).toHaveAttribute("aria-busy", "false", { timeout: 5_000 });
}

async function chooseDropdown(page: Page, label: string, option: string) {
  await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("button", { name: option, exact: true }).click();
}

async function chooseUnits(page: Page, units: "dp" | "px") {
  await page.getByRole("button", { name: "View settings" }).click();
  await page.getByRole("radio", { name: units }).click();
  await page.getByRole("button", { name: "View settings" }).click();
}

test("sidebar inquiry opens the GitHub issue template chooser", async ({ page }, testInfo) => {
  await page.goto("/galaxy-z-flip8");
  if (testInfo.project.name === "mobile") {
    await page.locator(".mobile-model").click();
  }

  const inquiry = page.getByRole("link", { name: "Send feedback or report an issue on GitHub (opens in a new tab)" });
  await expect(inquiry).toBeVisible();
  await expect(inquiry).toHaveAttribute(
    "href",
    "https://github.com/easyhooon/windowinsets.info/issues/new/choose",
  );
  await expect(page.locator('.sidebar-footer a[href="https://github.com/easyhooon/windowinsets.info"]')).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Star windowinsets.info on GitHub (opens in a new tab)" })).toBeVisible();
  const support = page.getByRole("link", { name: "Support windowinsets.info on Ko-fi (opens in a new tab)" });
  await expect(support).toBeVisible();
  await expect(support).toHaveAttribute("href", "https://ko-fi.com/easyhooon");
  await expect(page.locator(".sidebar-footer")).toHaveScreenshot("sidebar-footer-inquiry.png");
});

test("per-device JSON export downloads the complete versioned device payload", async ({ page }) => {
  await page.goto("/galaxy-z-flip8");
  const link = page.getByRole("link", { name: "JSON link" });
  await expect(link).toHaveAttribute("href", "/data/galaxy-z-flip8.json");
  const button = page.getByRole("button", { name: "Export JSON" });
  await expect(button).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await button.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("galaxy-z-flip8-window-insets.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = JSON.parse(await readFile(path!, "utf8"));
  expect(exported.schema).toBe("https://windowinsets.info/schemas/device-window-insets-v1.schema.json");
  expect(exported.schemaVersion).toBe(1);
  expect(exported.screens.map((screen: { id: string }) => screen.id)).toEqual(["cover", "main"]);
  expect(exported.screens[0].navigationModes.gesture.status).toBe("measured");
  expect(exported.screens[0].navigationModes.threeButton.status).toBe("measured");
  const response = await page.request.get("/data/galaxy-z-flip8.json");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual(exported);
  const direct = await page.goto("/data/galaxy-z-flip8.json");
  expect(direct?.ok()).toBe(true);
  expect(direct?.headers()["content-type"]).toContain("application/json");
});

test("Fold5 shows measured cover and inner values on both viewports", async ({ page }) => {
  await page.goto("/galaxy-z-fold5");
  await openMetricsIfCollapsed(page);
  await expect(page.getByRole("heading", { name: /Galaxy Z Fold5 Window Insets/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logical Size 344.38 × 882.29 dp" })).toBeVisible();
  await page.getByRole("button", { name: "Inner", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resolution 1812 × 2176 px" })).toBeVisible();
  await chooseDropdown(page, "Navigation", "Gesture");
  await expect(page.getByRole("button", { name: "Bottom 14.86 dp" })).toBeVisible();
  await expect(page.locator("#device-canvas")).toBeVisible();
});

test("Fold4 shows upright cover and Taskbar-free inner measurements", async ({ page }) => {
  await page.goto("/galaxy-z-fold4");
  await openMetricsIfCollapsed(page);
  await expect(page.getByRole("heading", { name: /Galaxy Z Fold4 Window Insets/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Logical Size 344.38 × 882.29 dp" })).toBeVisible();
  await page.getByRole("button", { name: "Inner", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resolution 1812 × 2176 px" })).toBeVisible();
  await chooseDropdown(page, "Navigation", "Gesture");
  await expect(page.getByRole("button", { name: "Bottom 14.86 dp" })).toBeVisible();
  await expect(page.locator("#device-canvas")).toBeVisible();
});

test("Fold3 official cover and inner artwork show captured insets", async ({ page }) => {
  await page.goto("/galaxy-z-fold3");
  await openMetricsIfCollapsed(page);
  await expect(page.getByRole("heading", { name: /Galaxy Z Fold3 Window Insets/ })).toBeVisible();
  await expect(page.locator("#device-canvas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Outer", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Inner", exact: true }).click();
  await expect(page.locator("#device-canvas")).toBeVisible();
  await expect(page.locator(".pending-notice")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Bottom 48 dp" })).toBeVisible();
});

test("Flip6 main shows both measured navigation modes", async ({ page }) => {
  await page.goto("/galaxy-z-flip6");
  await openMetricsIfCollapsed(page);
  await expect(page.getByRole("heading", { name: /Galaxy Z Flip6 Window Insets/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resolution 1080 × 2640 px" })).toBeVisible();
  await chooseDropdown(page, "Navigation", "Gesture");
  await expect(page.getByRole("button", { name: "Bottom 15 dp" })).toBeVisible();
});

for (const device of devices) {
  for (const pose of poses) {
    test(`${device.label} ${pose} remains readable`, async ({ page }, testInfo) => {
      await page.goto(`/${device.slug}`);
      await waitForDiagram(page);
      if (pose !== "Closed") {
        await page.getByRole("button", { name: "Pose: Closed" }).click();
        await page.getByRole("button", { name: pose, exact: true }).click();
        await waitForFoldTransition(page);
      }
      await expect(page).toHaveScreenshot(`${device.slug}-${pose.toLowerCase().replaceAll(" ", "-")}.png`, {
        fullPage: true,
      });

      await expect(page.getByRole("button", { name: /^Navigation:/ })).toBeVisible();
      await expect(page.getByRole("button", { name: `Pose: ${pose}` })).toBeVisible();
      if (testInfo.project.name === "mobile") {
        await expect(page.locator('[aria-label="Region legend"]')).toBeVisible();
      }
    });
  }
}

test("Fold8 gesture px diagrams remain readable through every pose", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await chooseDropdown(page, "Navigation", "Gesture");
  await chooseUnits(page, "px");
  for (const pose of poses) {
    if (pose !== "Closed") {
      await page.getByRole("button", { name: /^Pose:/ }).click();
      await page.getByRole("button", { name: pose, exact: true }).click();
      await waitForFoldTransition(page);
    }
    await expect(page).toHaveScreenshot(`galaxy-z-fold8-gesture-px-${pose.toLowerCase().replaceAll(" ", "-")}.png`, { fullPage: true });
  }
});

test("Flip8 gesture diagrams and exact inner px remain readable", async ({ page }) => {
  await page.goto("/galaxy-z-flip8");
  await waitForDiagram(page);
  await chooseDropdown(page, "Navigation", "Gesture");
  await expect(page).toHaveScreenshot("galaxy-z-flip8-gesture-dp-closed.png", { fullPage: true });
  for (const pose of ["Partially Folded", "Open"] as const) {
    await page.getByRole("button", { name: /^Pose:/ }).click();
    await page.getByRole("button", { name: pose, exact: true }).click();
    await waitForFoldTransition(page);
    await expect(page).toHaveScreenshot(`galaxy-z-flip8-gesture-dp-${pose.toLowerCase().replaceAll(" ", "-")}.png`, { fullPage: true });
  }
  await chooseUnits(page, "px");
  await expect(page).toHaveScreenshot("galaxy-z-flip8-gesture-px-open.png", { fullPage: true });
});

test("S25 Ultra exposes exact captured px separately from panel resolution", async ({ page }) => {
  await page.goto("/galaxy-s25-ultra");
  await expect(page.getByRole("button", { name: "Copy Top inset: 34.13 dp", exact: true })).toBeVisible();
  await openMetricsIfCollapsed(page);
  await page.getByRole("button", { name: "View settings" }).click();
  await page.getByRole("radio", { name: "px" }).click();

  await expect(page.getByRole("button", { name: "Logical Size 1080 × 2340 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resolution 1440 × 3120 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Captured Window 1080 × 2340 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Top 96 px" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Right 514 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bottom 2244 px" })).toBeVisible();
});

test("S25 Ultra remains readable across navigation, units, and orientation", async ({ page }) => {
  await page.goto("/galaxy-s25-ultra");
  const orientations = ["Portrait", "Landscape Left", "Landscape Right"];
  for (const navigation of ["3-button", "Gesture"]) {
    await chooseDropdown(page, "Navigation", navigation);
    for (const units of ["dp", "px"] as const) {
      await chooseDropdown(page, "Orientation", "Portrait");
      await chooseUnits(page, units);
      for (const orientation of orientations) {
        await chooseDropdown(page, "Orientation", orientation);
        await expect(page).toHaveScreenshot(
          `galaxy-s25-ultra-${navigation.toLowerCase()}-${units}-${orientation.toLowerCase().replaceAll(" ", "-")}.png`,
          { fullPage: true },
        );
      }
    }
  }
});

test("S23+ landscape uses its own measured insets", async ({ page }) => {
  await page.goto("/galaxy-s23-plus");
  await openMetricsIfCollapsed(page);
  await expect(page.getByRole("button", { name: "Logical Size 384 × 832 dp" })).toBeVisible();
  await chooseDropdown(page, "Orientation", "Landscape Left");
  await expect(page.getByRole("button", { name: "Logical Size 832 × 384 dp" })).toBeVisible();
  await chooseUnits(page, "px");
  await expect(page.getByRole("button", { name: "Logical Size 2340 × 1080 px" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Top 84 px" }).first()).toBeVisible();
  if (page.viewportSize()?.width && page.viewportSize()!.width < 600) {
    await page.getByRole("button", { name: "Metrics" }).click();
  }
  await expect(page).toHaveScreenshot("galaxy-s23-plus-measured-landscape-left.png", { fullPage: true });

  await chooseDropdown(page, "Navigation", "Gesture");
  await chooseDropdown(page, "Orientation", "Landscape Right");
  await chooseDropdown(page, "Orientation", "Landscape Left");
  await expect(page.locator(".canvas-footer .pending-notice")).toContainText("insets are not measured yet");
  await expect(page).toHaveScreenshot("galaxy-s23-plus-pending-landscape-right.png", { fullPage: true });
});

test("Galaxy Tab keeps the upside-down portrait option", async ({ page }) => {
  await page.goto("/galaxy-tab-s10-plus");
  await chooseDropdown(page, "Orientation", "Portrait Upside Down");
  await expect(page.locator(".canvas-footer .pending-notice")).toContainText("insets are not measured yet");
  await expect(page).toHaveScreenshot("galaxy-tab-s10-plus-upside-down.png", { fullPage: true });
});

test("flat orientation change animates the frame and upright content together", async ({ page }) => {
  await page.goto("/galaxy-s23-plus");
  await page.evaluate(() => {
    const calls: number[] = [];
    const animate = Element.prototype.animate;
    (window as typeof window & { turnDurations: number[] }).turnDurations = calls;
    Element.prototype.animate = function (...args) {
      if (Array.isArray(args[0]) && args[0].some(frame => "transform" in frame)) {
        calls.push(typeof args[1] === "object" ? Number(args[1]?.duration) : Number(args[1]));
      }
      return animate.apply(this, args);
    };
  });
  await chooseDropdown(page, "Orientation", "Landscape Left");
  await expect.poll(() => page.evaluate(() => (window as typeof window & { turnDurations: number[] }).turnDurations)).toEqual(expect.arrayContaining([300]));
});

test("screen content and measurement numbers stay upright while the frame turns", async ({ page }) => {
  await page.goto("/galaxy-s23-plus");
  await chooseDropdown(page, "Orientation", "Landscape Left");
  const angles = await page.evaluate(() => {
    const wrap = document.querySelector("[data-orientation-turn]")!;
    const content = wrap.querySelector("[data-screen-content]")!;
    const badge = wrap.querySelector("[data-ruler-label]")!;
    const rulers = wrap.querySelector("[data-measurement-rulers]")!;
    for (const animation of document.getAnimations()) {
      animation.pause();
      animation.currentTime = 150;
    }
    const angle = (element: Element) => {
      const m = new DOMMatrix(getComputedStyle(element).transform);
      return Math.atan2(m.b, m.a) * 180 / Math.PI;
    };
    return { frame: angle(wrap), content: angle(content), badge: angle(badge), rulersOpacity: Number(getComputedStyle(rulers).opacity) };
  });
  expect(Math.abs(angles.frame)).toBeGreaterThan(10);
  expect(Math.abs(angles.frame + angles.content)).toBeLessThan(2);
  expect(Math.abs(angles.frame + angles.badge)).toBeLessThan(2);
  expect(angles.rulersOpacity).toBeLessThan(.1);
  await expect(page.locator(".canvas-panel")).toHaveScreenshot("galaxy-s23-plus-mid-turn-upright.png", { animations: "allow" });
});

test("screen content and every measurement number stay upright when returning to portrait", async ({ page }) => {
  await page.goto("/galaxy-s23-plus");
  await chooseDropdown(page, "Orientation", "Landscape Left");
  await expect(page.locator("[data-ruler-label]").filter({ hasText: "832" })).toBeVisible();
  await page.waitForTimeout(350);
  await chooseDropdown(page, "Orientation", "Portrait");
  const angles = await page.evaluate(() => {
    const wrap = document.querySelector("[data-orientation-turn]")!;
    const content = wrap.querySelector("[data-screen-content]")!;
    const badges = [...wrap.querySelectorAll("[data-ruler-label]")];
    for (const animation of wrap.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = 150;
    }
    const angle = (element: Element) => {
      const m = new DOMMatrix(getComputedStyle(element).transform);
      return Math.atan2(m.b, m.a) * 180 / Math.PI;
    };
    return { frame: angle(wrap), content: angle(content), badges: badges.map(angle) };
  });
  expect(Math.abs(angles.frame)).toBeGreaterThan(10);
  expect(Math.abs(angles.frame + angles.content)).toBeLessThan(2);
  expect(angles.badges.length).toBeGreaterThan(0);
  for (const badge of angles.badges) expect(Math.abs(angles.frame + badge)).toBeLessThan(2);
  await expect(page.locator("[data-ruler-label]").filter({ hasText: "384" })).toBeVisible();
});

test("Fold7 animation switches from measured cover to measured inner display", async ({ page }) => {
  await page.goto("/galaxy-z-fold7");
  await waitForDiagram(page);
  await openMetricsIfCollapsed(page);
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await waitForFoldTransition(page);
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Inner" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Logical Size 749.71 × 832 dp" })).toBeVisible();
});

test("fold pose changes preserve an explicit zoom", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.getByRole("button", { name: /^Zoom:/ }).click();
  await page.getByRole("button", { name: "200%", exact: true }).click();
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await waitForFoldTransition(page);
  await expect(page.getByRole("button", { name: "Zoom: 200%" })).toBeVisible();
});

test("fold pose changes preserve pan and 0 restores automatic fit", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  const viewport = page.getByRole("region", { name: "Device visualization" }).getByLabel("Zoomable device canvas");
  const position = viewport.locator(".diagram-position");
  await viewport.dispatchEvent("wheel", { deltaX: -36, deltaY: -24 });
  const manualTransform = await position.evaluate(element => (element as HTMLElement).style.transform);
  expect(manualTransform).not.toBe("translate(0px, 0px)");

  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await waitForFoldTransition(page);
  await expect(position).toHaveAttribute("style", `transform: ${manualTransform};`);

  await viewport.focus();
  await page.keyboard.press("0");
  await expect(position).toHaveAttribute("style", /translate\(0px, 0px\)/);
  // Fit iterates because ruler text keeps its screen size while the body scales.
  // Capture its settled value, not the first render after pan resets.
  const zoomButton = page.getByRole("button", { name: /^Zoom:/ });
  await expect.poll(async () => {
    const before = await zoomButton.textContent();
    await page.waitForTimeout(150);
    return (await zoomButton.textContent()) === before;
  }).toBe(true);
  const fitZoom = await zoomButton.textContent();
  await page.keyboard.press("=");
  await expect(page.getByRole("button", { name: /^Zoom:/ })).not.toHaveText(fitZoom!);
  await page.keyboard.press("0");
  await expect(page.getByRole("button", { name: /^Zoom:/ })).toHaveText(fitZoom!);
});

test("animated hinge keeps outer metrics until the inner display is visible", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".metrics-panel")).toHaveAttribute("aria-busy", "true");
  const samples = await page.evaluate(() => new Promise<Array<{ angle: number; metrics: string; diagram: string }>>(resolve => {
    const values: Array<{ angle: number; metrics: string; diagram: string }> = [];
    const start = performance.now();
    const tick = () => {
      values.push({ angle: Number(document.querySelector<HTMLElement>("[data-displayed-angle]")!.dataset.displayedAngle),
        metrics: document.querySelector('.screen-tabs button[aria-pressed="true"]')!.textContent!,
        diagram: document.querySelector('.projected-rulers')!.getAttribute('aria-label')! });
      if (performance.now() - start < 1000) requestAnimationFrame(tick); else resolve(values);
    };
    requestAnimationFrame(tick);
  }));
  expect(samples.some(sample => sample.angle > 60 && sample.angle < 179 && sample.metrics === 'Inner')).toBe(true);
  for (const sample of samples) expect(sample.metrics).toBe(sample.diagram.startsWith('Cover') ? 'Outer' : 'Inner');
  await expect(page.locator(".metrics-panel")).toHaveAttribute("aria-busy", "false", { timeout: 5_000 });
  await expect(page.getByRole("img", { name: /Book fold diagram/ })).toHaveAttribute("data-displayed-angle", "180.00");
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Inner" })).toHaveAttribute("aria-pressed", "true");
});

test("reduced motion reaches the same Fold endpoint", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.getByRole("button", { name: "Pose: Closed" }).click();
  await page.getByRole("button", { name: "Open", exact: true }).click();
  await expect(page.locator(".screen-tabs button").filter({ hasText: "Inner" })).toHaveAttribute("aria-pressed", "true");
});

test("Fold cover dimension labels copy their displayed value", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/galaxy-z-fold8");
  await waitForDiagram(page);
  await page.evaluate(() => navigator.clipboard.writeText(""));
  await page.getByRole("button", { name: "Copy Display width: 475.43 dp", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("475.43");
});

test("cover cutout bounds distinguish OS geometry from unmeasured lenses", async ({ page }) => {
  await page.goto("/galaxy-z-flip8");
  await openMetricsIfCollapsed(page);
  await chooseUnits(page, "px");
  await expect(page.getByRole("button", { name: "Size 520 × 209 px", exact: true })).toBeVisible();
  await expect(page.getByText("individual lens diameters and spacing are not measured.", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: "Cutout measurement limits →" }).click();
  await expect(page).toHaveURL(/methodology#camera-cutouts$/);
  await expect(page.getByRole("heading", { name: "Camera cutouts: what can be measured" })).toBeVisible();
  await expect(page.locator("#camera-cutouts")).toContainText("pending a new, verified capture");
});

test("foldables roll the device and lay out upright content in the new orientation", async ({ page }) => {
  await page.goto("/galaxy-z-fold7");
  await openMetricsIfCollapsed(page);
  await expect(page.getByRole("button", { name: "Logical Size 411.43 × 960 dp" })).toBeVisible();
  await chooseDropdown(page, "Orientation", "Landscape Left");
  await expect(page.getByRole("button", { name: "Logical Size 960 × 411.43 dp" })).toBeVisible();
  // The 3D model turns in WebGL; the canvas itself is never CSS-rotated.
  await expect.poll(() => page.locator("[data-fold-renderer]").getAttribute("data-view-rotation")).toMatch(/^-?90\.00$/);
  const canvasTransform = await page.locator("[data-orientation-turn] > div").evaluate(element => new DOMMatrix(getComputedStyle(element).transform));
  expect(Math.abs(canvasTransform.b)).toBeLessThan(1e-6);
  // Rulers annotate the landscape screen with horizontal labels.
  const width = page.locator(".projected-rulers [data-ruler='Display width'] [data-ruler-label]");
  await expect(width).toContainText("960");
  const box = (await width.boundingBox())!;
  expect(box.width).toBeGreaterThan(box.height);
});
