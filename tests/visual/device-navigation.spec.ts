import { expect, test } from "@playwright/test";

test("family filters and collapsible groups keep large device catalogues navigable", async ({ page }) => {
  await page.goto("/galaxy-z-fold8");
  if ((page.viewportSize()?.width ?? 0) < 768) await page.locator(".mobile-model").click();

  const sidebar = page.getByRole("complementary", { name: "Devices" });
  const families = sidebar.getByRole("group", { name: "Device series" });
  await expect(families.getByRole("button", { name: "Z", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(sidebar.locator('section[aria-label="Galaxy Z Fold"] > h2 > .device-group-toggle')).toHaveAttribute("aria-expanded", "true");
  await expect(sidebar.locator('section[aria-label="Galaxy Z Flip"] > h2 > .device-group-toggle')).toHaveAttribute("aria-expanded", "false");
  await expect(sidebar.getByRole("link", { name: /Galaxy A57 5G/ })).toHaveCount(0);

  await families.getByRole("button", { name: "A", exact: true }).click();
  const aGroup = sidebar.locator('section[aria-label="Galaxy A"]');
  await expect(aGroup.locator("h2 > .device-group-toggle")).toHaveAttribute("aria-expanded", "true");
  await expect(aGroup.getByRole("link", { name: /Galaxy A57 5G/ })).toBeVisible();
  await aGroup.locator("h2 > .device-group-toggle").click();
  await expect(aGroup.getByRole("link", { name: /Galaxy A57 5G/ })).toBeHidden();
  await aGroup.locator("h2 > .device-group-toggle").click();

  await sidebar.getByRole("searchbox", { name: "Search devices" }).fill("Fold8");
  await expect(sidebar.locator('a[href="/galaxy-z-fold8"]')).toBeVisible();
  await expect(aGroup).toHaveCount(0);
  await sidebar.getByRole("searchbox", { name: "Search devices" }).fill("");
  await aGroup.getByRole("link", { name: /Galaxy A57 5G/ }).click();
  await expect(page).toHaveURL(/\/galaxy-a57-5g$/);
  if ((page.viewportSize()?.width ?? 0) < 768) await page.locator(".mobile-model").click();
  await expect(families.getByRole("button", { name: "A", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(aGroup.locator("h2 > .device-group-toggle")).toHaveAttribute("aria-expanded", "true");
});

test("skin previews stay discoverable while measured insets lead each series", async ({ page }) => {
  await page.goto("/galaxy-s25-ultra");
  if ((page.viewportSize()?.width ?? 0) < 768) await page.locator(".mobile-model").click();

  const sidebar = page.getByRole("complementary", { name: "Devices" });
  const sGroup = sidebar.locator('section[aria-label="Galaxy S"]');
  await expect(sGroup.locator('a[href="/galaxy-s25-ultra"]')).not.toContainText("measured");
  await expect(sGroup.locator(".device-preview-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(sGroup.locator('a[href="/galaxy-s20"]')).toBeHidden();

  await sGroup.locator(".device-preview-toggle").click();
  await expect(sGroup.locator('a[href="/galaxy-s20"]')).toContainText("No inset measurements");

  await sidebar.getByRole("searchbox", { name: "Search devices" }).fill("Galaxy S20");
  await expect(sGroup.locator('a[href="/galaxy-s20"]')).toBeVisible();
  await sGroup.locator('a[href="/galaxy-s20"]').click();
  await expect(page).toHaveURL(/\/galaxy-s20$/);
  if ((page.viewportSize()?.width ?? 0) < 768) await page.locator(".mobile-model").click();
  await expect(sGroup.locator(".device-preview-toggle")).toHaveAttribute("aria-expanded", "true");
  await expect(sGroup.locator('a[href="/galaxy-s20"].selected')).toBeVisible();
});

test('prerendered model selection matches the requested device before hydration', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const [slug, name] of [['galaxy-z-fold5', 'Galaxy Z Fold5'], ['galaxy-z-flip8', 'Galaxy Z Flip8'], ['galaxy-s25-ultra', 'Galaxy S25 Ultra'], ['galaxy-s23', 'Galaxy S23']]) {
      await page.goto(`${baseURL}/${slug}`);
      await expect(page.locator('.mobile-model')).toContainText(name);
      await expect(page.locator('.device-link.selected')).toContainText(name);
    }
  } finally {
    await context.close();
  }
});
