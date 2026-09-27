import { expect, test, type Page } from '@playwright/test';
async function choose(page: Page, label: string, option: string) {
  await page.getByRole('button', { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole('button', { name: option, exact: true }).click();
}
async function assertBadges(page: Page, context: string) {
  // Each settled hinge step refits the pose on the next frames.
  await expect.poll(() => badgeErrors(page), { message: context }).toEqual([]);
}
async function badgeErrors(page: Page) {
  return page.locator('.projected-rulers').evaluateAll(elements => {
    const viewport = document.querySelector('#device-canvas')!.getBoundingClientRect();
    const badges = elements.flatMap(el => [...el.querySelectorAll('[data-badge]')].map(node => ({ name: node.closest('[data-ruler]')!.getAttribute('data-ruler'), box: node.getBoundingClientRect() })));
    const errors: string[] = [];
    const visible = badges;
    for (let i = 0; i < visible.length; i++) {
      const {box:a,name} = visible[i];
      // Near the cover reveal, constant-size badges can overhang by a few pixels.
      if(a.left < viewport.left - 3 || a.right > viewport.right + 3 || a.top < viewport.top - 3 || a.bottom > viewport.bottom + 3) errors.push(`clipped ${name}`);
      for(const {box:b,name:other} of visible.slice(i+1)) if(a.left < b.right-.5 && a.right > b.left+.5 && a.top < b.bottom-.5 && a.bottom > b.top+.5) errors.push(`${name} overlaps ${other}`);
    }
    if (visible.length === 0) errors.push('no visible badges');
    return errors;
  });
}
for(const slug of ['galaxy-z-fold2','galaxy-z-fold7','galaxy-z-fold8','galaxy-z-flip8']) {
 test(`${slug} full navigation units rotation pose annotation matrix`, async ({page}) => {
  test.setTimeout(180_000);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/'+slug);
  await expect(page.locator('.device-link.selected')).toContainText(slug.replace('galaxy-z-', 'Galaxy Z ').replace('fold', 'Fold').replace('flip', 'Flip'));
  await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle','0.00', {timeout:15_000});
  for(const navigation of ['3-button','Gesture']) {
   await choose(page,'Navigation',navigation);
   for(const units of ['dp','px']) {
    await page.getByRole('button',{name:'View settings'}).click();
    await page.getByRole('radio',{name:units,exact:true}).click();
    await page.getByRole('button',{name:'View settings'}).click();
    for(const pose of ['Closed','Partially Folded','Open']) {
     await choose(page,'Pose',pose);
     await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle',pose==='Closed'?'0.00':pose==='Open'?'180.00':'90.00');
     for(const orientation of ['Portrait','Landscape Left','Landscape Right']) {
      await choose(page,'Orientation',orientation);
      await page.waitForTimeout(250);
      await assertBadges(page,`${slug} ${navigation} ${units} ${pose} ${orientation}`);
     }
    }
   }
  }
 });
}

for (const slug of ['galaxy-z-fold2', 'galaxy-z-fold7', 'galaxy-z-fold8', 'galaxy-z-flip8']) {
 test(`${slug} every integer hinge angle keeps projected badges readable`, async ({page}) => {
  test.setTimeout(180_000);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/'+slug);
  await expect(page.locator('.device-link.selected')).toContainText(slug.replace('galaxy-z-', 'Galaxy Z ').replace('fold', 'Fold').replace('flip', 'Flip'));
  await expect(page.locator('.projected-rulers')).toBeVisible();
  await page.getByRole('button',{name:/^Hinge:/}).click();
  const hinge=page.getByRole('slider',{name:'Hinge angle in degrees'});
  await hinge.focus();
  await hinge.press('Home');
  for(let angle=0;angle<=180;angle++) {
   if(angle) await hinge.press('ArrowRight');
   await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle',angle.toFixed(2));
   await expect(page.locator('.projected-rulers [data-badge]').first()).toBeVisible();
   await expect(page.locator('.screen-tabs button[aria-pressed="true"]')).toHaveText(angle < 60 ? 'Outer' : 'Inner');
   await assertBadges(page,`${slug} hinge ${angle}`);
  }
  await page.getByRole('button',{name:/^Hinge:/}).click();
  // Return to the measured cover before testing available layer controls.
  await choose(page,'Pose','Closed');
  await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle','0.00');
  for(const layer of ['Display Cutout','Corner Radius','Insets']) {
   const toggle = page.getByRole('button',{name:layer,exact:true});
   if (await toggle.isDisabled()) {
    const selector = layer === 'Corner Radius' ? '[data-ruler$="radius"]' : layer === 'Display Cutout' ? '[data-ruler^="Cutout"]' : '[data-ruler$="inset"]';
    await expect(page.locator(selector)).toHaveCount(0);
    continue;
   }
   await toggle.click();
   await assertBadges(page,`${slug} ${layer} hidden`);
   await page.getByRole('button',{name:layer,exact:true}).click();
  }
  await page.getByRole('button',{name:'View settings'}).click();
  for(const setting of ['Show Frame','Show Regions']) {
   await page.getByRole('checkbox',{name:setting,exact:true}).uncheck();
   await assertBadges(page,`${slug} ${setting} hidden`);
   await page.getByRole('checkbox',{name:setting,exact:true}).check();
  }
  await page.getByRole('checkbox',{name:'Show Dimensions',exact:true}).uncheck();
  await expect(page.locator('.projected-rulers')).toHaveCount(0);
  await page.getByRole('checkbox',{name:'Show Dimensions',exact:true}).check();
  await expect(page.locator('.projected-rulers')).toBeVisible();
 });
}
