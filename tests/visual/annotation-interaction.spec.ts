import { expect, test } from '@playwright/test';
for(const slug of ['galaxy-z-fold7','galaxy-z-flip8']) {
 test(`${slug} pinch preserves manual zoom and keyboard copies projected values`,async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/'+slug);
  const width=page.locator('.projected-rulers [data-ruler="Display width"] [role="button"]');
  await expect(width).toBeVisible();
  const value=await width.locator('text').textContent();
  await page.evaluate(()=>navigator.clipboard.writeText(''));
  await width.focus(); await page.keyboard.press('Enter');
  await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toBe(value);
  const scale=()=>page.locator('.diagram-position > [data-orientation-turn] > div').evaluate(el=>{
   const m=new DOMMatrix(getComputedStyle(el).transform); return Math.hypot(m.a,m.b);
  });
  await page.waitForTimeout(500);
  const before=await scale();
  const box=(await page.locator('#device-canvas').boundingBox())!;
  // Pinch vertically in the side margin: projected labels take touches on the device.
  const badges=await page.locator('.projected-rulers [data-badge]').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().toJSON()));
  const clear=([x,y]:number[])=>[y-60,y-30,y+30,y+60].every(py=>badges.every(b=>x<b.left-8||x>b.right+8||py<b.top-8||py>b.bottom+8));
  const [cx,cy]=[.5,.4,.6,.3,.7].flatMap(f=>[8,box.width-8].map(dx=>[box.x+dx,box.y+box.height*f])).find(clear)!;
  const session=await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy-30,id:1},{x:cx,y:cy+30,id:2}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx,y:cy-60,id:1},{x:cx,y:cy+60,id:2}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(scale).toBeCloseTo(before*2,2);
  const manual=await scale();
  await page.getByRole('button',{name:/^Pose:/}).click();
  await page.getByRole('button',{name:'Partially Folded',exact:true}).click();
  await expect(page.locator('[data-displayed-angle]')).toHaveAttribute('data-displayed-angle','90.00');
  expect(await scale()).toBeCloseTo(manual,3);
  await page.locator('#device-canvas').focus(); await page.keyboard.press('0');
  await expect.poll(scale).toBeLessThan(manual);
 });
}
