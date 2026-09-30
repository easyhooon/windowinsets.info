import test from 'node:test';
import assert from 'node:assert/strict';
import { orientScreen, rotateCorners, viewQuarter, orientationName } from '../app/data/orientation.ts';
import { galaxyS25Ultra } from '../app/data/devices/galaxy-s25-ultra/index.ts';
import { galaxyA32FiveG } from '../app/data/devices/galaxy-a32-5g/index.ts';

const main = galaxyS25Ultra.screens.find(s => s.id === 'main');
// A32 5G has no rotation captures (RTL lists no unit), so it exercises the unmeasured-orientation path.
const unrotated = galaxyA32FiveG.screens.find(s => s.id === 'main');

test('view rotation maps clockwise degrees to Android rotation', () => {
  assert.equal(viewQuarter(0), 0);
  assert.equal(viewQuarter(90), 3);
  assert.equal(viewQuarter(-90), 1);
  assert.equal(viewQuarter(180), 2);
});

test('corners follow a counter-clockwise device turn', () => {
  const c = { topLeft: 1, topRight: 2, bottomRight: 3, bottomLeft: 4 };
  assert.deepEqual(rotateCorners(c, 1), { topLeft: 2, topRight: 3, bottomRight: 4, bottomLeft: 1 });
  assert.deepEqual(rotateCorners(c, 2), { topLeft: 3, topRight: 4, bottomRight: 1, bottomLeft: 2 });
  assert.deepEqual(rotateCorners(c, 0), c);
});

test('an uncaptured orientation swaps size but never carries insets', () => {
  const turned = orientScreen(unrotated, 1);
  assert.equal(turned.orientationMeasured, false);
  assert.deepEqual(turned.logicalSizeDp, { width: unrotated.logicalSizeDp.height, height: unrotated.logicalSizeDp.width });
  assert.equal(turned.captureRotation, ((unrotated.captureRotation ?? 0) + 1) % 4);
  assert.equal(turned.insets.gesture, null);
  assert.equal(turned.insets.threeButton, null);
  assert.equal(orientationName(turned), 'Landscape');
});

test('the recorded orientation is unchanged', () => {
  const same = orientScreen(main, 0);
  assert.equal(same.orientationMeasured, true);
  assert.equal(same.insets, main.insets);
});

import { readFileSync } from 'node:fs';
import { galaxyS23Plus } from '../app/data/devices/galaxy-s23-plus/index.ts';

test('S23+ landscape rotations come from their own raw captures', () => {
  const screen = galaxyS23Plus.screens[0];
  for (const [rotation, mode] of [[1, 'gesture'], [1, 'threeButton'], [3, 'threeButton']]) {
    const raw = JSON.parse(readFileSync(`measurements/galaxy-s/galaxy-s23-plus/landscape-${rotation}-${mode}.json`, 'utf8'));
    assert.equal(raw.display.rotation, rotation);
    assert.equal(raw.navigation.mode, mode);
    const turned = orientScreen(screen, rotation);
    assert.equal(turned.orientationMeasured, true);
    const m = turned.insets[mode];
    assert.deepEqual(m.systemBarsPx, raw.insets.systemBars.px);
    assert.deepEqual(m.displayCutoutPx, raw.insets.displayCutout.px);
    const rect = raw.displayCutout.boundingRects[0].px;
    assert.deepEqual([m.cutoutShape.xPx, m.cutoutShape.yPx, m.cutoutShape.widthPx, m.cutoutShape.heightPx],
      [rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top]);
    assert.deepEqual(turned.logicalSizePx, { width: raw.display.widthPx, height: raw.display.heightPx });
  }
  assert.equal(orientScreen(screen, 3).insets.gesture, null, 'rotation 3 gesture was not captured');
});
