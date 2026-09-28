import { expect, test } from '@playwright/test';

test('the canvas extends behind the floating controls at every breakpoint', async ({ page }) => {
  test.setTimeout(120_000);
  // Different aspect ratios and data availability exercise the same layout contract.
  for (const slug of ['galaxy-s25-ultra', 'galaxy-z-fold8', 'galaxy-z-flip8', 'galaxy-tab-s11-ultra', 'galaxy-s23']) {
    for (const [width, height] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      await page.goto('/' + slug);
      await expect.poll(() => page.evaluate(() => {
        const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
        const canvas = box('#device-canvas'), panel = box('.canvas-panel'), footer = box('.canvas-footer'), controls = box('.canvas-controls');
        const errors: string[] = [];
        if (canvas.height < 140 || canvas.width < 150) errors.push('canvas squeezed');
        if (Math.abs(canvas.bottom - panel.bottom) > 1) errors.push('canvas stops above panel bottom');
        if (footer.top >= canvas.bottom || footer.bottom > canvas.bottom + 1) errors.push('legend outside canvas');
        const toggles = box('.canvas-toggles');
        if (controls.bottom > canvas.bottom + 1 || controls.bottom > window.innerHeight + 1) errors.push('controls clipped');
        if (toggles.top < canvas.top || toggles.bottom > footer.top) errors.push('toggles overlap footer');
        if (document.documentElement.scrollWidth > window.innerWidth) errors.push('horizontal page overflow');
        for (const node of document.querySelectorAll('.control-pill button')) {
          if (node.scrollWidth > node.clientWidth + 1) errors.push('control text clipped');
        }
        if (window.innerWidth >= 768) {
          for (const handle of document.querySelectorAll('.resize-handle')) {
            if (handle.getBoundingClientRect().width < 6) errors.push('resize handle has no pointer target');
          }
        }
        return errors;
      }), { message: `${slug} ${width}×${height}` }).toEqual([]);
      if (width < 768) {
        const before = await page.locator('#device-canvas').boundingBox();
        await page.getByRole('button', { name: 'Metrics', exact: true }).click();
        const after = await page.locator('#device-canvas').boundingBox();
        expect(after!.height).toBeCloseTo(before!.height, 0);
        await expect(page.locator('.metrics-content')).toBeVisible();
      }
    }
  }
});

test('panning can carry the device behind the legend without a footer clipping edge', async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1024, height: 768 });
  await page.goto('/galaxy-s25-ultra');
  const canvas = page.locator('#device-canvas');
  await expect.poll(() => canvas.locator('.diagram-position').evaluate(node => (node as HTMLElement).style.transform)).not.toBe('translate(0px, 0px)');
  await canvas.dispatchEvent('wheel', { deltaX: 0, deltaY: -100 });
  await expect.poll(() => page.evaluate(() => {
    const body = document.querySelector('[data-fit-body]')!.getBoundingClientRect();
    const legend = document.querySelector('.region-legend')!.getBoundingClientRect();
    const viewport = document.querySelector('#device-canvas')!.getBoundingClientRect();
    return body.top < legend.top && body.bottom > legend.bottom && viewport.bottom > legend.bottom;
  })).toBe(true);
});
