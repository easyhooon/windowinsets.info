import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureName, testFixtureSnippet } from '../app/data/testFixture.ts';

test('fixture names are Kotlin identifiers', () => {
  assert.equal(fixtureName('Galaxy S25 Ultra', 'Gesture', 'Portrait'), 'galaxyS25UltraGesturePortrait');
  assert.equal(fixtureName('Galaxy S26+ · Inner', '3-button', 'Landscape Left'), 'galaxyS26PlusInner3ButtonLandscapeLeft');
});

test('snippet uses exact px per type in Insets.of(left, top, right, bottom) order', () => {
  const zero = { top: 0, right: 0, bottom: 0, left: 0 };
  const snippet = testFixtureSnippet({
    statusBars: { ...zero, top: 96 }, navigationBars: { ...zero, bottom: 42 }, displayCutout: { ...zero, top: 96 },
    systemGestures: { top: 130, right: 84, bottom: 90, left: 84 }, mandatorySystemGestures: { ...zero, top: 130, bottom: 90 },
    tappableElement: { ...zero, top: 96 },
  }, { device: 'Galaxy S25 Ultra', mode: 'Gesture', orientation: 'Portrait' });
  assert.match(snippet, /val galaxyS25UltraGesturePortrait = WindowInsetsCompat\.Builder\(\)/);
  assert.match(snippet, /Type\.navigationBars\(\), Insets\.of\(0, 0, 0, 42\)/);
  assert.match(snippet, /Type\.systemGestures\(\), Insets\.of\(84, 130, 84, 90\)/);
  assert.doesNotMatch(snippet, /systemBars/);
});
