import test from 'node:test';
import assert from 'node:assert/strict';
import { runnerImport } from 'vite';
import { avdProfile, extendedWidthClass, heightClass, previewSpec, sizeClassRows, widthClass } from '../app/data/devTools.ts';

const load = async () => {
  const { module: { devices } } = await runnerImport('./app/data/devices.ts', { root: process.cwd() });
  const { module: { deviceDevCaptures } } = await runnerImport('./app/data/devCaptures.server.ts', { root: process.cwd() });
  return { devices, deviceDevCaptures };
};

test('size classes follow the androidx.window breakpoints', () => {
  assert.deepEqual([599.99, 600, 839.99, 840].map(widthClass), ['Compact', 'Medium', 'Medium', 'Expanded']);
  assert.deepEqual([479.99, 480, 899.99, 900].map(heightClass), ['Compact', 'Medium', 'Medium', 'Expanded']);
  assert.deepEqual([1199, 1200, 1600].map(extendedWidthClass), [null, 'Large', 'Extra-large']);
});

test('Fold8 preview specs and size classes come from the cited captures', async () => {
  const { devices, deviceDevCaptures } = await load();
  const fold8 = devices.find(d => d.slug === 'galaxy-z-fold8');
  const captures = deviceDevCaptures(fold8);
  const cover = captures.find(c => c.screen === 'cover' && c.rotation === 0 && c.nav === 'gesture');
  const main = captures.find(c => c.screen === 'main' && c.rotation === 0 && c.nav === 'gesture');
  assert.equal(previewSpec(cover), '@Preview(device = "spec:width=1248px,height=1972px,dpi=420,cutout=punch_hole,navigation=gesture")');
  assert.equal(previewSpec(main), '@Preview(device = "spec:width=2448px,height=1848px,dpi=420,cutout=none,navigation=gesture")');
  assert.deepEqual([widthClass(cover.windowDp.width), heightClass(cover.windowDp.height)], ['Compact', 'Medium']);
  assert.deepEqual([widthClass(main.windowDp.width), heightClass(main.windowDp.height)], ['Expanded', 'Medium']);
  assert.equal(main.foldingFeatures[0].state, 'FLAT');
  // Fold8's diagonal is not sourced: no hardware profile is invented from xdpi.
  assert.equal(avdProfile(fold8, cover).ok, false);
});

test('size class rows keep uncaptured rotations pending', async () => {
  const { devices, deviceDevCaptures } = await load();
  for (const device of devices) {
    const captures = deviceDevCaptures(device);
    for (const row of sizeClassRows(device, captures)) {
      const captured = captures.some(c => c.screen === row.screen && c.rotation === row.rotation);
      assert.equal(row.windowDp !== null, captured, `${device.slug} ${row.screen} r${row.rotation}`);
    }
  }
});

test('hardware profiles use the official diagonal and portrait dimensions', async () => {
  const { devices, deviceDevCaptures } = await load();
  const s26 = devices.find(d => d.slug === 'galaxy-s26-ultra');
  const landscape = deviceDevCaptures(s26).find(c => c.screen === 'main' && c.rotation === 1);
  const profile = avdProfile(s26, landscape);
  assert.ok(profile.ok, profile.reason);
  const diagonal = s26.screens.find(s => s.id === 'main').diagonalInch;
  assert.match(profile.xml, new RegExp(`<d:diagonal-length>${diagonal}</d:diagonal-length>`));
  assert.ok(Number(profile.xml.match(/<d:x-dimension>(\d+)/)[1]) < Number(profile.xml.match(/<d:y-dimension>(\d+)/)[1]));
});
