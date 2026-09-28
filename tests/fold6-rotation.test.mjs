import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { galaxyZFold6 } from '../app/data/devices/galaxy-z-fold6/index.ts';

test('Fold6 rotation captures retain their own screen, mode, and measured insets', () => {
  for (const screen of galaxyZFold6.screens) {
    for (const mode of ['gesture', 'threeButton']) {
      for (const rotation of [0, 1, 3]) {
        const name = `${screen.id}-${rotation ? `landscape-${rotation}-` : ''}${mode}.json`;
        const raw = JSON.parse(readFileSync(`measurements/galaxy-z-fold6/recapture-2026-09-27-rotation/${name}`, 'utf8'));
        const capture = rotation ? screen.rotations[rotation] : screen;
        const published = capture.insets[mode];
        assert.equal(raw.device.model, 'SM-F956U');
        assert.equal(raw.screen, screen.id);
        assert.equal(raw.navigation.mode, mode);
        assert.equal(raw.navigation.settingAgreesWithInsets, true);
        assert.equal(raw.display.id, 0);
        assert.equal(raw.display.rotation, rotation);
        assert.deepEqual(raw.display.currentWindowPx, raw.display.maximumWindowPx);
        assert.deepEqual(capture.logicalSizePx, raw.display.currentWindowPx);
        assert.deepEqual(published.systemBars, raw.insets.systemBars.dp);
        assert.deepEqual(published.systemBarsPx, raw.insets.systemBars.px);
        assert.deepEqual(published.displayCutout, raw.insets.displayCutout.dp);
        assert.deepEqual(published.displayCutoutPx, raw.insets.displayCutout.px);
        assert.equal(raw.hinge.foldingFeatures.length, screen.id === 'main' ? 1 : 0);
        if (screen.id === 'cover') {
          const bounds = raw.displayCutout.boundingRects[0].px;
          assert.deepEqual([published.cutoutShape.xPx, published.cutoutShape.yPx, published.cutoutShape.widthPx, published.cutoutShape.heightPx],
            [bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top]);
        }
      }
    }
  }
});
