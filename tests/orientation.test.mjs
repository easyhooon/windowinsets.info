import test from 'node:test';
import assert from 'node:assert/strict';
import { orientScreen, rotateCorners, viewQuarter, orientationName } from '../app/data/orientation.ts';
import { galaxyS25Ultra } from '../app/data/devices/galaxy-s25-ultra/index.ts';

const main = galaxyS25Ultra.screens.find(s => s.id === 'main');

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
  const turned = orientScreen(main, 1);
  assert.equal(turned.orientationMeasured, false);
  assert.deepEqual(turned.logicalSizeDp, { width: main.logicalSizeDp.height, height: main.logicalSizeDp.width });
  assert.equal(turned.captureRotation, ((main.captureRotation ?? 0) + 1) % 4);
  assert.equal(turned.insets.gesture, null);
  assert.equal(turned.insets.threeButton, null);
  assert.equal(orientationName(turned), 'Landscape');
});

test('the recorded orientation is unchanged', () => {
  const same = orientScreen(main, 0);
  assert.equal(same.orientationMeasured, true);
  assert.equal(same.insets, main.insets);
});
