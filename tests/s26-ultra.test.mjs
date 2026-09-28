import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { galaxyS26Ultra } from '../app/data/devices/galaxy-s26-ultra/index.ts';

test('S26 Ultra publishes mode-matched RTL evidence in all captured rotations', () => {
  const screen = galaxyS26Ultra.screens[0];
  assert.equal(screen.id, 'main');
  assert.deepEqual(screen.logicalSizePx, { width: 1080, height: 2340 });
  assert.deepEqual(screen.logicalSizeDp, { width: 384, height: 832 });

  for (const mode of ['threeButton', 'gesture']) {
    const raw = JSON.parse(readFileSync(`measurements/galaxy-s26-ultra/main-${mode}.json`, 'utf8'));
    const measured = screen.insets[mode];
    assert.equal(raw.device.model, 'SM-S948U');
    assert.equal(raw.screen, 'phone');
    assert.equal(raw.display.rotation, 0);
    assert.equal(raw.navigation.mode, mode);
    assert.equal(raw.navigation.settingAgreesWithInsets, true);
    assert.deepEqual(measured.systemBars, raw.insets.systemBars.dp);
    assert.deepEqual(measured.systemBarsPx, raw.insets.systemBars.px);
    assert.deepEqual(measured.displayCutout, raw.insets.displayCutout.dp);
    assert.deepEqual(measured.displayCutoutPx, raw.insets.displayCutout.px);
    assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(screen.cornerRadiiPx,
      Object.fromEntries(Object.entries(raw.roundedCorners.display).map(([corner, value]) => [corner, value.radiusPx])));
    assert.equal(measured.cutoutShape.xPx, raw.displayCutout.boundingRects[0].px.left);
    assert.equal(measured.cutoutShape.yPx, raw.displayCutout.boundingRects[0].px.top);
    assert.equal(measured.cutoutShape.widthPx,
      raw.displayCutout.boundingRects[0].px.right - raw.displayCutout.boundingRects[0].px.left);
    assert.equal(measured.cutoutShape.heightPx,
      raw.displayCutout.boundingRects[0].px.bottom - raw.displayCutout.boundingRects[0].px.top);

    for (const rotation of [1, 3]) {
      const turned = JSON.parse(readFileSync(`measurements/galaxy-s26-ultra/recapture-2026-09-27-rotation/main-landscape-${rotation}-${mode}.json`, 'utf8'));
      const published = screen.rotations[rotation];
      const insets = published.insets[mode];
      const bounds = turned.displayCutout.boundingRects[0].px;
      assert.equal(turned.device.model, 'SM-S948U');
      assert.equal(turned.screen, 'main');
      assert.equal(turned.navigation.mode, mode);
      assert.equal(turned.navigation.settingAgreesWithInsets, true);
      assert.equal(turned.display.rotation, rotation);
      assert.equal(turned.display.orientation, 'landscape');
      assert.deepEqual(turned.display.currentWindowPx, turned.display.maximumWindowPx);
      assert.deepEqual(published.logicalSizePx, turned.display.currentWindowPx);
      assert.deepEqual(insets.systemBars, turned.insets.systemBars.dp);
      assert.deepEqual(insets.systemBarsPx, turned.insets.systemBars.px);
      assert.deepEqual(insets.displayCutout, turned.insets.displayCutout.dp);
      assert.deepEqual(insets.displayCutoutPx, turned.insets.displayCutout.px);
      assert.deepEqual([insets.cutoutShape.xPx, insets.cutoutShape.yPx, insets.cutoutShape.widthPx, insets.cutoutShape.heightPx],
        [bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top]);
    }
  }
});
