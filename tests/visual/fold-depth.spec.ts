import { expect, test } from '@playwright/test';

for (const slug of ['galaxy-fold', 'galaxy-z-fold8', 'galaxy-z-fold5', 'galaxy-z-flip8', 'galaxy-z-fold3']) {
  test(`${slug} uses one perspective surface through every pose`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${slug}`);
    const model = page.locator('[data-displayed-angle]');
    await expect(model).toHaveAttribute('data-displayed-angle', '0.00');
    // A flat backup underneath WebGL produces a second silhouette at an angle.
    await expect(model.locator('canvas')).toHaveCount(1);
    for (const [pose, angle] of [['Closed', 0], ['Partially Folded', 90], ['Open', 180]] as const) {
      if (angle !== 0) {
        await page.getByRole('button', { name: pose, exact: true }).click();
        await expect(model).toHaveAttribute('data-displayed-angle', angle.toFixed(2));
      }
      await expect(model.locator('canvas[data-engine]')).toBeVisible();
      await page.screenshot({ path: info.outputPath(`${slug}-${angle}.png`) });
      if (slug === 'galaxy-fold' && angle === 0) {
        await expect(model).toHaveScreenshot('galaxy-fold-closed.png');
      }
    }
    expect(errors).toEqual([]);
  });
}
