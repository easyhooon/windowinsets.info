import test from 'node:test';
import assert from 'node:assert/strict';
import { parseViewState, serializeViewState } from '../app/lib/viewState.ts';

const defaults = { navMode: 'threeButton', rotation: 0, hinge: 180, units: 'dp', appPreview: 'off' };
const phone = { rotations: [0, 90, -90], foldable: false };

test('default view writes no query parameters', () => {
  assert.equal(serializeViewState('', defaults, defaults), '');
});

test('view state round-trips through the query string', () => {
  const state = { navMode: 'gesture', rotation: -90, hinge: 75, units: 'px', appPreview: 'applied' };
  const search = serializeViewState('', state, defaults);
  assert.equal(search, '?nav=gesture&rotate=270&hinge=75&unit=px&app=applied');
  assert.deepEqual(parseViewState(search, { rotations: [0, 90, -90], foldable: true }), state);
});

test('unrelated parameters are preserved and defaults removed', () => {
  assert.equal(serializeViewState('?utm_source=x&nav=gesture', defaults, defaults), '?utm_source=x');
});

test('invalid or unsupported values are ignored', () => {
  assert.deepEqual(parseViewState('?nav=foo&rotate=180&hinge=90&unit=mm&app=on', phone), {});
  assert.deepEqual(parseViewState('?rotate=45', phone), {});
  assert.deepEqual(parseViewState('?hinge=200', { ...phone, foldable: true }), {});
  assert.deepEqual(parseViewState('?nav=3-button&rotate=90', phone), { navMode: 'threeButton', rotation: 90 });
});
