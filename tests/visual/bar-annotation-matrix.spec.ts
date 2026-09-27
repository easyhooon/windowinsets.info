import { expect, test } from '@playwright/test';
for (const slug of ['galaxy-s25-plus', 'galaxy-s25-ultra']) {
 test(`${slug} flat annotation navigation units orientation matrix`, async ({page}) => {
  test.setTimeout(90_000);
  await page.goto('/'+slug);
  await expect(page.locator('.device-link.selected')).toContainText(slug === 'galaxy-s25-plus' ? 'Galaxy S25+' : 'Galaxy S25 Ultra');
  const choose = async (label: string, option: string) => {
   await page.getByRole('button',{name:new RegExp(`^${label}:`)}).click();
   await page.getByRole('button',{name:option,exact:true}).click();
  };
  for(const nav of ['3-button','Gesture']) {
   await choose('Navigation',nav);
   for(const unit of ['dp','px']) {
    await choose('Orientation','Portrait');
    await page.getByRole('button',{name:'View settings'}).click();
    await page.getByRole('radio',{name:unit,exact:true}).click();
    await page.getByRole('button',{name:'View settings'}).click();
    for(const orientation of ['Portrait','Landscape Left','Landscape Right']) {
     await choose('Orientation',orientation);
     if (orientation !== 'Portrait') {
      await expect(page.locator('.canvas-footer .pending-notice')).toContainText('insets are not measured yet.');
      continue;
     }
     await expect(page.locator('[aria-label="Measurement rulers"] [role="button"]').first()).toBeVisible();
     await expect.poll(()=>page.evaluate(()=>{
      const viewport=document.querySelector('#device-canvas')!.getBoundingClientRect();
      const boxes=[...document.querySelectorAll('[aria-label="Measurement rulers"] [role="button"] rect')].map(el=>el.getBoundingClientRect());
      const errors: string[]=[];
      for(let i=0;i<boxes.length;i++) {
       const a=boxes[i];
       if(a.left<viewport.left || a.right>viewport.right || a.top<viewport.top || a.bottom>viewport.bottom) errors.push('clip');
       for(const b of boxes.slice(i+1)) if(a.left<b.right-.5 && a.right>b.left+.5 && a.top<b.bottom-.5 && a.bottom>b.top+.5) errors.push('overlap');
      }
      return errors;
     }),{message:`${slug} ${nav} ${unit} ${orientation}`}).toEqual([]);
    }
   }
  }
 });
}
