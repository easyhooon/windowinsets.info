import { galaxyZTriFold } from '../app/data/devices/galaxy-z-trifold/index.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { bendPoint, createChassis, createFoldHousings, hingeHalfWidth, rigidPanelPoint, triFoldAngles, triFoldViewTurn, triFoldPoint, triFoldHinges, createTriFoldHousings, createTriFoldDisplay } from '../app/components/foldGeometry.ts';
import { skins } from '../app/data/skins.ts';
import { isInCoverage } from '../app/data/coverage.ts';
import { getRtlAvailability, rtlCatalog } from '../app/data/rtlAvailability.ts';
import { galaxyZFold2 } from '../app/data/devices/galaxy-z-fold2/index.ts';
import { galaxyZFold6 } from '../app/data/devices/galaxy-z-fold6/index.ts';
import { galaxyZFold5 } from '../app/data/devices/galaxy-z-fold5/index.ts';
import { galaxyZFold4 } from '../app/data/devices/galaxy-z-fold4/index.ts';
import { galaxyZFold3 } from '../app/data/devices/galaxy-z-fold3/index.ts';
import { galaxyZFold7 } from '../app/data/devices/galaxy-z-fold7/index.ts';
import { galaxyZFold8 } from '../app/data/devices/galaxy-z-fold8/index.ts';
import { galaxyZFlip8 } from '../app/data/devices/galaxy-z-flip8/index.ts';
import { galaxyZFlip7 } from '../app/data/devices/galaxy-z-flip7/index.ts';
import { galaxyZFlip6 } from '../app/data/devices/galaxy-z-flip6/index.ts';
import { galaxyZFlip5 } from '../app/data/devices/galaxy-z-flip5/index.ts';
import { galaxyS25Plus } from '../app/data/devices/galaxy-s25-plus/index.ts';
import { galaxyS25Ultra } from '../app/data/devices/galaxy-s25-ultra/index.ts';
import { galaxyS24Fe } from '../app/data/devices/galaxy-s24-fe/index.ts';
import { galaxyS24Ultra } from '../app/data/devices/galaxy-s24-ultra/index.ts';
import { galaxyS23Ultra } from '../app/data/devices/galaxy-s23-ultra/index.ts';
import { galaxyS24 } from '../app/data/devices/galaxy-s24/index.ts';
import { galaxyS23 } from '../app/data/devices/galaxy-s23/index.ts';
import { formatLength, hasExactPx, safeInsetsPx } from '../app/data/measurementUnits.ts';

function readCapture(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

for (const [name, device, model] of [
  ['S24 Ultra', galaxyS24Ultra, 'SM-S928N'],
  ['S24', galaxyS24, 'SM-S921N'],
  ['S23 Ultra', galaxyS23Ultra, 'SM-S918U'],
  ['S23', galaxyS23, 'SM-S911B'],
  ['S24 FE', galaxyS24Fe, 'SM-S721N'],
]) test(`${name} published rotations match all six raw captures`, () => {
  const screen = device.screens[0];
  for (const rotation of [0, 1, 3]) for (const mode of ['gesture', 'threeButton']) {
    const published = rotation === 0 ? screen.insets[mode] : screen.rotations[rotation].insets[mode];
    const path = new URL(published.sources[0].url).pathname.split('/blob/main/')[1];
    const raw = readCapture(path);
    const rect = raw.displayCutout.boundingRects[0].px;
    assert.equal(raw.device.model, model);
    assert.equal(raw.display.rotation, rotation);
    assert.equal(raw.navigation.mode, mode);
    assert.equal(raw.navigation.settingAgreesWithInsets, true);
    assert.deepEqual(rotation === 0 ? screen.logicalSizePx : screen.rotations[rotation].logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(published.systemBars, raw.insets.systemBars.dp);
    assert.deepEqual(published.systemBarsPx, raw.insets.systemBars.px);
    assert.deepEqual(published.displayCutout, raw.insets.displayCutout.dp);
    assert.deepEqual(published.displayCutoutPx, raw.insets.displayCutout.px);
    assert.deepEqual(
      { xPx: published.cutoutShape.xPx, yPx: published.cutoutShape.yPx, widthPx: published.cutoutShape.widthPx, heightPx: published.cutoutShape.heightPx },
      { xPx: rect.left, yPx: rect.top, widthPx: rect.right - rect.left, heightPx: rect.bottom - rect.top },
    );
  }
});

test('existing Z-series rotation captures match every published inset', () => {
  const devices = [galaxyZFold5, galaxyZFold4, galaxyZFold3, galaxyZTriFold,
    galaxyZFlip8, galaxyZFlip7, galaxyZFlip6, galaxyZFlip5];
  let checked = 0;
  for (const device of devices) {
    for (const screen of device.screens) {
      for (const rotation of [1, 3]) {
        const capture = screen.rotations?.[rotation];
        if (!capture) continue;
        for (const mode of ['gesture', 'threeButton']) {
          const inset = capture.insets[mode];
          if (!inset) continue;
          const path = new URL(inset.sources[0].url).pathname.split('/blob/main/')[1];
          const raw = readCapture(path);
          assert.equal(raw.screen, screen.id);
          assert.equal(raw.display.rotation, rotation);
          assert.equal(raw.navigation.mode, mode);
          assert.deepEqual(capture.logicalSizePx, raw.display.currentWindowPx);
          assert.deepEqual(capture.logicalSizeDp, raw.display.maximumWindowDp);
          assert.deepEqual(inset.systemBars, raw.insets.systemBars.dp);
          assert.deepEqual(inset.systemBarsPx, raw.insets.systemBars.px);
          assert.deepEqual(inset.displayCutout, raw.insets.displayCutout.dp);
          assert.deepEqual(inset.displayCutoutPx, raw.insets.displayCutout.px);
          checked++;
        }
      }
    }
  }
  assert.equal(checked, 48);
});

test('TriFold folds left before right with three rigid, separated housings', () => {
  assert.deepEqual(triFoldAngles(180), { left: 180, right: 180 });
  assert.deepEqual(triFoldAngles(135), { left: 90, right: 180 });
  assert.deepEqual(triFoldAngles(90), { left: 0, right: 180 });
  assert.deepEqual(triFoldAngles(45), { left: 0, right: 90 });
  assert.deepEqual(triFoldAngles(0), { left: 0, right: 0 });
  const width = 4.2, thickness = .065;
  const h = triFoldHinges(thickness);
  for (let sequence = 0; sequence <= 180; sequence++) {
    assert.deepEqual(triFoldPoint(0, 1, -.02, sequence, width, thickness), [0, 1, -.02]);
    for (const sign of [-1, 1]) {
      const a = triFoldPoint(sign * 1.2, .2, -.01, sequence, width, thickness);
      const b = triFoldPoint(sign * 1.8, .2, -.01, sequence, width, thickness);
      assert.ok(Math.abs(Math.hypot(...a.map((v, i) => v - b[i])) - .6) < 1e-9);
      const half = sign < 0 ? h.left : h.right;
      for (const edge of [width / 6 - half, width / 6 + half]) {
        const before = triFoldPoint(sign * (edge - 1e-7), 0, 0, sequence, width, thickness);
        const after = triFoldPoint(sign * (edge + 1e-7), 0, 0, sequence, width, thickness);
        assert.ok(Math.hypot(...before.map((v, i) => v - after[i])) < 3e-7);
      }
    }
  }
  const leftFront = triFoldPoint(-1.4, 0, 0, 0, width, thickness)[2];
  const leftBack = triFoldPoint(-1.4, 0, -thickness, 0, width, thickness)[2];
  const rightFront = triFoldPoint(1.4, 0, 0, 0, width, thickness)[2];
  assert.ok(leftFront > 0 && leftBack < rightFront, 'closed panels must nest without intersecting');
  const housing = createTriFoldHousings(width, 3, .05, thickness);
  const display = createTriFoldDisplay(5.2, 4, width, thickness);
  for (const geometry of [housing, display]) {
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const p = geometry.attributes.position;
      const original = [p.getX(i), p.getY(i), p.getZ(i)];
      assert.deepEqual(triFoldPoint(...original, 180, width, thickness), original);
      for (const sequence of [0, 45, 90, 135]) {
        assert.ok(triFoldPoint(...original, sequence, width, thickness).every(Number.isFinite));
      }
    }
    geometry.dispose();
  }
});

test('TriFold faces the inner display while wings fold, then turns to the rear cover', () => {
  let previous = 0;
  for (let sequence = 180; sequence >= 0; sequence--) {
    const turn = triFoldViewTurn(sequence, 60);
    if (sequence >= 60) assert.equal(turn, 0, 'both hinges must stay visible from the front');
    assert.ok(turn >= previous, 'the cover reveal must not reverse');
    previous = turn;
  }
  assert.ok(Math.abs(triFoldViewTurn(0, 60) - Math.PI) < 1e-12, 'closed pose shows the middle panel rear');
});

function rawCornerRadii(raw) {
  const corners = raw.roundedCorners?.windowInsets;
  if (!corners || Object.values(corners).some(corner => corner === null)) return null;
  return {
    topLeft: corners.topLeft.radiusPx,
    topRight: corners.topRight.radiusPx,
    bottomRight: corners.bottomRight.radiusPx,
    bottomLeft: corners.bottomLeft.radiusPx,
  };
}

function rawCutoutShape(raw) {
  const rect = raw.displayCutout?.boundingRects?.[0]?.px;
  if (!rect) return null;
  return {
    xPx: rect.left,
    yPx: rect.top,
    widthPx: rect.right - rect.left,
    heightPx: rect.bottom - rect.top,
  };
}

function assertExactPixelEvidence({ device, screenId, navMode, capturePath }) {
  const raw = readCapture(capturePath);
  const screen = device.screens.find(candidate => candidate.id === screenId);
  const measurement = screen?.insets[navMode];
  assert.ok(screen, `${device.slug} must expose its ${screenId} screen`);
  assert.ok(measurement, `${device.slug} ${screenId} ${navMode} must be measured`);

  assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
  assert.equal(screen.captureOrientation, raw.display.orientation);
  assert.deepEqual(screen.cornerRadiiPx, rawCornerRadii(raw));
  assert.deepEqual(measurement.systemBarsPx, raw.insets.systemBars.px);
  assert.deepEqual(measurement.displayCutoutPx, raw.insets.displayCutout.px);

  const cutout = rawCutoutShape(raw);
  if (cutout) {
    assert.deepEqual({
      xPx: measurement.cutoutShape?.xPx,
      yPx: measurement.cutoutShape?.yPx,
      widthPx: measurement.cutoutShape?.widthPx,
      heightPx: measurement.cutoutShape?.heightPx,
    }, cutout);
  } else {
    assert.equal(measurement.cutoutShape, undefined);
  }
}

test('folds remain finite and symmetric at closed, intermediate, and flat poses on both axes', () => {
  for (const vertical of [true, false]) for (const angle of [0, 1, 45, 90, 135, 179, 180]) {
    const p = bendPoint(vertical ? 1 : 0, vertical ? 0 : 1, 0, angle, vertical, .14);
    const q = bendPoint(vertical ? -1 : 0, vertical ? 0 : -1, 0, angle, vertical, .14);
    assert.ok([...p, ...q].every(Number.isFinite));
    assert.ok(Math.abs(p[vertical ? 0 : 1] + q[vertical ? 0 : 1]) < 1e-10);
    assert.equal(p[2], q[2]);
    const behind = bendPoint(vertical ? 1 : 0, vertical ? 0 : 1, -.065, angle, vertical, .14);
    assert.ok(Math.abs(Math.hypot(...p.map((v,i) => v - behind[i])) - .065) < 1e-10);
  }
  assert.deepEqual(bendPoint(1, 2, -.065, 180, true, .14), [1, 2, -.065]);
});

test('hinge endpoint geometry is exact for both Fold and Flip axes', () => {
  const hinge = .14;
  const extent = 1.2;
  const closedAlong = 2 * hinge / Math.PI;
  const closedDepth = closedAlong + extent - hinge;
  const epsilon = 1e-12;

  for (const vertical of [true, false]) {
    const positive = vertical ? [extent, .6, 0] : [.6, extent, 0];
    const negative = vertical ? [-extent, .6, 0] : [.6, -extent, 0];

    assert.deepEqual(bendPoint(...positive, 180, vertical, hinge), positive);
    assert.deepEqual(bendPoint(...negative, 180, vertical, hinge), negative);

    const closedPositive = bendPoint(...positive, 0, vertical, hinge);
    const closedNegative = bendPoint(...negative, 0, vertical, hinge);
    const axis = vertical ? 0 : 1;
    assert.ok(Math.abs(closedPositive[axis] - closedAlong) < epsilon);
    assert.ok(Math.abs(closedNegative[axis] + closedAlong) < epsilon);
    assert.ok(Math.abs(closedPositive[2] - closedDepth) < epsilon);
    assert.ok(Math.abs(closedNegative[2] - closedDepth) < epsilon);
  }
});

test('hinge geometry stays continuous through every animation degree', () => {
  for (const vertical of [true, false]) {
    let previous = null;
    for (let angle = 0; angle <= 180; angle++) {
      const point = bendPoint(vertical ? 1 : 0, vertical ? 0 : 1, 0, angle, vertical, .14);
      assert.ok(point.every(Number.isFinite));
      if (previous) {
        const step = Math.hypot(...point.map((value, index) => value - previous[index]));
        assert.ok(step < .01, `${vertical ? 'Fold' : 'Flip'} jumps ${step} between ${angle - 1}° and ${angle}°`);
      }
      previous = point;
    }
  }
});

test('chassis is a closed solid with two triangles per shared edge', () => {
  const geometry = createChassis(4.2, 3.1, .15, .065);
  const indices = geometry.index.array;
  const edges = new Map();
  for (let i = 0; i < indices.length; i += 3) for (let j = 0; j < 3; j++) {
    const a = indices[i+j], b = indices[i+(j+1)%3];
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    edges.set(key, (edges.get(key) ?? 0) + 1);
  }
  assert.ok([...edges.values()].every(count => count === 2));
  geometry.dispose();
});

test('cover artwork and annotation margins stay on the rigid rear plane throughout folding', () => {
  const hinge = .147, rearZ = -.069;
  for (const vertical of [true, false]) for (const angle of [0, 45, 90, 180]) {
    const phi = (180 - angle) * Math.PI / 360;
    for (const side of [1, -1]) for (const u of [-.1, .025, hinge, 1, 2]) {
      const surface = bendPoint(vertical ? side * hinge : 0, vertical ? 0 : side * hinge, 0, angle, vertical, hinge);
      const point = rigidPanelPoint(vertical ? side * u : 0, vertical ? 0 : side * u, rearZ, angle, vertical, hinge, side);
      const normalDistance = -side * (point[vertical ? 0 : 1] - surface[vertical ? 0 : 1]) * Math.sin(phi)
        + (point[2] - surface[2]) * Math.cos(phi);
      assert.ok(Math.abs(normalDistance - rearZ) < 1e-9,
        `Cover vertex ${u} at ${angle}° must remain outside the chassis rear plane (${normalDistance})`);
    }
  }
});

test('official skin rectangles match original layout files and preserve the cover/main distinction', () => {
  for (const [key, skin] of Object.entries(skins)) {
    assert.ok(existsSync(`public${skin.image}`));
    if (skin.foreground) assert.ok(existsSync(`public${skin.foreground}`));
    const png = readFileSync(`public${skin.image}`);
    assert.deepEqual([skin.width, skin.height], [png.readUInt32BE(16), png.readUInt32BE(20)]);
    assert.ok(skin.screen.x >= 0 && skin.screen.y >= 0);
    assert.ok(skin.screen.x + skin.screen.width <= skin.width);
    assert.ok(skin.screen.y + skin.screen.height <= skin.height);
    const layout = readFileSync(`public/skins/${key}/layout`, 'utf8');
    const size = layout.match(/display\s*{\s*width\s+(\d+)\s*height\s+(\d+)/);
    const offset = layout.match(/part2\s*{\s*name\s+device\s*x\s+(\d+)\s*y\s+(\d+)/);
    assert.deepEqual([skin.screen.width, skin.screen.height], size.slice(1).map(Number));
    assert.deepEqual([skin.screen.x, skin.screen.y], offset.slice(1).map(Number));
  }
  const raw = JSON.parse(readFileSync('measurements/galaxy-z-fold8/main-threeButton.json','utf8'));
  assert.deepEqual([raw.display.widthPx, raw.display.heightPx], [skins['galaxy-z-fold8/cover'].screen.width, skins['galaxy-z-fold8/cover'].screen.height]);
  assert.notEqual(skins['galaxy-z-fold8/main'].screen.width, raw.display.widthPx);
});

test('preview catalogue has unique models and valid screen assets, including TriFold', () => {
  const catalog = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  assert.equal(new Set(catalog.map(device => device.slug)).size, catalog.length);
  assert.ok(catalog.some(device => device.formFactor === 'tablet'));
  for (const device of catalog) {
    assert.match(device.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(['bar', 'tablet', 'foldable-book', 'foldable-flip', 'foldable-trifold'].includes(device.formFactor));
    assert.ok(device.screens.includes('main'));
    assert.equal(new Set(device.screens).size, device.screens.length);
    for (const screen of device.screens) {
      assert.ok(['main', 'cover'].includes(screen));
      assert.ok(skins[`${device.slug}/${screen}`]);
    }
  }
});

test('Note and A imports retain original layouts and source provenance', () => {
  const catalog = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  const imported = catalog.filter(device => ['Galaxy Note', 'Galaxy A'].includes(device.series));
  assert.equal(imported.length, 48);
  for (const device of imported) {
    const base = `public/skins/${device.slug}/main`;
    const provenance = JSON.parse(readFileSync(`${base}/source.json`, 'utf8'));
    assert.match(provenance.archive, /^Galaxy_(?:Note|A).*\.zip$/);
    assert.equal(provenance.providedAt, device.providedAt);
    assert.ok(existsSync(`${base}/layout`));
    assert.ok(existsSync(`${base}/device.png`));
  }
  const a22 = JSON.parse(readFileSync('public/skins/galaxy-a22-5g/main/source.json', 'utf8'));
  const layout = readFileSync('public/skins/galaxy-a22-5g/main/layout', 'utf8');
  assert.equal(a22.background, 'device_Port-Gray.png');
  assert.match(layout, /device_Port-Black\.png/);
});

test('Fold and Flip coverage overrides the 2020 cutoff while older bar and tablet skins stay archived', () => {
  const catalog = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  const supported = catalog.filter(device => isInCoverage({ ...device, releaseYear: null }));
  assert.equal(supported.length, 119);
  assert.ok(supported.some(device => device.slug === 'galaxy-fold'));
  for (const slug of ['galaxy-tab-s4-10-5', 'galaxy-tab-s6',
    'galaxy-note-fe', 'galaxy-note8', 'galaxy-note9', 'galaxy-note10', 'galaxy-note10-plus']) {
    assert.ok(catalog.some(device => device.slug === slug));
    assert.ok(!supported.some(device => device.slug === slug));
  }
  for (const slug of ['galaxy-s10-lite', 'galaxy-tab-s6-lite', 'galaxy-tab-s8-ultra', 'galaxy-z-flip', 'galaxy-s20', 'galaxy-z-fold2', 'galaxy-z-fold3',
    'galaxy-note10-lite', 'galaxy-note20', 'galaxy-note20-ultra', 'galaxy-a01-core', 'galaxy-a71']) {
    assert.ok(supported.some(device => device.slug === slug));
  }
  assert.equal(isInCoverage({ slug: 'measured-older-device', formFactor: 'bar', releaseYear: 2019 }), false);
  assert.equal(isInCoverage({ slug: 'measured-boundary-device', formFactor: 'bar', releaseYear: 2020 }), true);
  assert.equal(isInCoverage({ slug: 'older-fold', formFactor: 'foldable-book', releaseYear: 2019 }), true);
  assert.equal(isInCoverage({ slug: 'older-flip', formFactor: 'foldable-flip', releaseYear: 2019 }), true);
  assert.equal(isInCoverage({ slug: 'galaxy-z-trifold', formFactor: 'foldable-trifold', releaseYear: 2025 }), true);
});

test('Galaxy Fold cover artwork includes the full front chassis around its small display', () => {
  const cover = skins['galaxy-fold/cover'];
  assert.ok(cover.body.x <= 170);
  assert.ok(cover.body.y <= 170);
  assert.ok(cover.body.x + cover.body.width >= 1090);
  assert.ok(cover.body.y + cover.body.height >= 2600);
});

test('Flip6 main captures match both navigation modes without inventing cover measurements', () => {
  const screen = galaxyZFlip6.screens.find(candidate => candidate.id === 'main');
  assert.equal(galaxyZFlip6.screens.length, 1);
  for (const mode of ['gesture', 'threeButton']) {
    const raw = readCapture(`measurements/galaxy-z-flip6/main-${mode}.json`);
    assert.equal(raw.device.model, 'SM-F741U');
    assert.equal(raw.screen, 'main');
    assert.equal(raw.navigation.mode, mode);
    assert.equal(raw.display.rotation, 0);
    assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(screen.insets[mode].systemBarsPx, raw.insets.systemBars.px);
    assert.deepEqual(screen.insets[mode].displayCutoutPx, raw.insets.displayCutout.px);
    assert.equal(raw.hinge.foldingFeatures[0].state, 'FLAT');
  }
});

test('Flip5 main captures match both upright navigation modes', () => {
  assert.equal(galaxyZFlip5.screens.length, 1);
  for (const mode of ['gesture', 'threeButton']) {
    const raw = readCapture(`measurements/galaxy-z-flip5/main-${mode}.json`);
    assert.equal(raw.device.model, 'SM-F731B');
    assert.equal(raw.screen, 'main');
    assert.equal(raw.navigation.mode, mode);
    assert.equal(raw.navigation.settingAgreesWithInsets, true);
    assert.equal(raw.display.rotation, 0);
    assert.deepEqual(raw.display.currentWindowPx, raw.display.maximumWindowPx);
    assert.equal(raw.hinge.foldingFeatures[0].state, 'FLAT');
    assertExactPixelEvidence({
      device: galaxyZFlip5,
      screenId: 'main',
      navMode: mode,
      capturePath: `measurements/galaxy-z-flip5/main-${mode}.json`,
    });
  }
});

test('RTL comparisons never turn an incomplete inventory into non-support claims', () => {
  const skins = JSON.parse(readFileSync('app/data/skinCatalog.json', 'utf8'));
  const snapshot = rtlCatalog;
  assert.equal(new Set(snapshot.listedSlugs).size, snapshot.listedSlugs.length);
  for (const slug of snapshot.listedSlugs) {
    assert.ok(skins.some(device => device.slug === slug));
    assert.equal(getRtlAvailability(slug).status, 'listed');
  }
  const comparison = skins.map(device => getRtlAvailability(device.slug));
  assert.equal(comparison.filter(result => result.status === 'listed').length,
    new Set([...snapshot.listedSlugs, ...snapshot.reservableSlugs]).size);
  assert.ok(comparison.every(result => result.status !== 'not-listed'));
  // Existing captures do not imply that a model can still be reserved today.
  assert.equal(getRtlAvailability('galaxy-s25-plus').status, 'unknown');
  const complete = { ...snapshot, scope: 'reservation-catalog', complete: true };
  assert.equal(getRtlAvailability('galaxy-s20', complete).status, 'not-listed');
  assert.match(getRtlAvailability('galaxy-s20', complete).previewNotice, /Not listed/);
  assert.equal(getRtlAvailability('galaxy-z-fold8', complete).label, 'Reservable on RTL');
  assert.equal(getRtlAvailability('galaxy-z-fold7').label, 'Reservable on RTL');
  assert.equal(getRtlAvailability('galaxy-z-fold6').label, 'Reservable on RTL');
});

test('Fold7 captures keep exact cover and upright inner evidence distinct', () => {
  const captures = [
    ['cover', 'gesture'],
    ['cover', 'threeButton'],
    ['main', 'gesture'],
    ['main', 'threeButton'],
  ];
  for (const [screenId, navMode] of captures) {
    const folder = screenId === 'main' ? 'galaxy-z-fold7/recapture-2026-09-25' : 'galaxy-z-fold7';
    const raw = readCapture(`measurements/${folder}/${screenId}-${navMode}.json`);
    const screen = galaxyZFold7.screens.find(candidate => candidate.id === screenId);
    assert.equal(raw.device.model, 'SM-F966U');
    assert.equal(raw.screen, screenId);
    assert.equal(raw.navigation.mode, navMode);
    assert.equal(screen.captureRotation, raw.display.rotation);
    assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
    assert.deepEqual(screen.insets[navMode].systemBars, raw.insets.systemBars.dp);
    assert.deepEqual(screen.insets[navMode].displayCutout, raw.insets.displayCutout.dp);
  }
  const cover = galaxyZFold7.screens.find(screen => screen.id === 'cover');
  const main = galaxyZFold7.screens.find(screen => screen.id === 'main');
  assert.deepEqual(cover.resolutionPx, { width: 1080, height: 2520 });
  assert.deepEqual(main.resolutionPx, { width: 1968, height: 2184 });
  assert.deepEqual(main.logicalSizePx, { width: 1968, height: 2184 });
  assert.equal(main.captureOrientation, 'portrait');
  assert.equal(main.captureRotation, 0);
  for (const navMode of ['gesture', 'threeButton']) {
    const raw = readCapture(`measurements/galaxy-z-fold7/recapture-2026-09-25/main-${navMode}.json`);
    assert.equal(raw.hinge.angleDegrees, 0);
    assert.equal(raw.hinge.foldingFeatures[0].state, 'FLAT');
    assert.equal(raw.hinge.foldingFeatures[0].orientation, 'VERTICAL');
    assert.deepEqual(raw.hinge.foldingFeatures[0].bounds.px,
      { left: 984, top: 0, right: 984, bottom: 2184 });
  }
});

test('Fold6 publishes settled cover and inner evidence in both navigation modes', () => {
  for (const [screenId, navMode] of [
    ['cover', 'gesture'], ['cover', 'threeButton'], ['main', 'gesture'], ['main', 'threeButton'],
  ]) {
    const raw = readCapture(`measurements/galaxy-z-fold6/${screenId}-${navMode}.json`);
    const screen = galaxyZFold6.screens.find(candidate => candidate.id === screenId);
    assert.equal(raw.device.model, 'SM-F956U');
    assert.equal(raw.screen, screenId);
    assert.equal(raw.navigation.mode, navMode);
    assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
    assert.deepEqual(screen.insets[navMode].systemBars, raw.insets.systemBars.dp);
  }
  const main = galaxyZFold6.screens.find(screen => screen.id === 'main');
  assert.equal(main.insets.threeButton.systemBarsPx.bottom, 126);
  assert.equal(main.insets.gesture.systemBarsPx.bottom, 39);
  assert.equal(readCapture('measurements/galaxy-z-fold6/rejected-2026-09-23/main-threeButton.json')
    .insets.systemBars.px.bottom, 1);
});

test('Fold5 publishes upright cover and inner evidence in both modes', () => {
  for (const [screenId, navMode] of [
    ['cover', 'gesture'], ['cover', 'threeButton'], ['main', 'gesture'], ['main', 'threeButton'],
  ]) {
    const folder = screenId === 'main' ? 'galaxy-z-fold5/recapture-2026-09-25' : 'galaxy-z-fold5';
    const raw = readCapture(`measurements/${folder}/${screenId}-${navMode}.json`);
    const screen = galaxyZFold5.screens.find(candidate => candidate.id === screenId);
    assert.equal(raw.device.model, 'SM-F946B');
    assert.equal(raw.screen, screenId);
    assert.equal(raw.navigation.mode, navMode);
    assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
    assert.equal(screen.captureRotation, raw.display.rotation);
    assert.deepEqual(screen.insets[navMode].systemBars, raw.insets.systemBars.dp);
  }
  const cover = galaxyZFold5.screens.find(screen => screen.id === 'cover');
  const main = galaxyZFold5.screens.find(screen => screen.id === 'main');
  assert.deepEqual(cover.logicalSizePx, { width: 904, height: 2316 });
  assert.deepEqual(main.logicalSizePx, { width: 1812, height: 2176 });
  assert.equal(main.captureOrientation, 'portrait');
  for (const navMode of ['gesture', 'threeButton']) {
    const feature = readCapture(`measurements/galaxy-z-fold5/recapture-2026-09-25/main-${navMode}.json`)
      .hinge.foldingFeatures[0];
    assert.equal(feature.state, 'FLAT');
    assert.equal(feature.orientation, 'VERTICAL');
    assert.deepEqual(feature.bounds.px, { left: 906, top: 0, right: 906, bottom: 2176 });
  }
  assert.equal(readCapture('measurements/galaxy-z-fold5/main-gesture.json').display.rotation, 1);
  assert.equal(readCapture('measurements/galaxy-z-fold5/rejected-2026-09-23/cover-gesture-landscape.json')
    .display.rotation, 1);
});

test('Fold4 publishes upright captures with main Taskbar disabled', () => {
  for (const [screenId, navMode] of [
    ['cover', 'gesture'], ['cover', 'threeButton'], ['main', 'gesture'], ['main', 'threeButton'],
  ]) {
    const raw = readCapture(`measurements/galaxy-z-fold4/${screenId}-${navMode}.json`);
    const screen = galaxyZFold4.screens.find(candidate => candidate.id === screenId);
    assert.equal(raw.device.model, 'SM-F936B');
    assert.equal(raw.screen, screenId);
    assert.equal(raw.display.rotation, 0);
    assert.equal(raw.navigation.mode, navMode);
    assert.equal(raw.navigation.settingAgreesWithInsets, true);
    assert.deepEqual(screen.logicalSizePx, raw.display.currentWindowPx);
    assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
    assert.deepEqual(screen.insets[navMode].systemBarsPx, raw.insets.systemBars.px);
  }
  const main = galaxyZFold4.screens.find(screen => screen.id === 'main');
  assert.equal(main.insets.gesture.systemBarsPx.bottom, 39);
  assert.equal(main.insets.threeButton.systemBarsPx.bottom, 126);
  assert.equal(readCapture('measurements/galaxy-z-fold4/main-gesture.json')
    .hinge.foldingFeatures[0].bounds.px.left, 906);
  assert.equal(readCapture('measurements/galaxy-z-fold4/rejected-2026-09-23/main-gesture-taskbar.json')
    .insets.systemBars.px.bottom, 168);
});

test('Fold8 recapture keeps cover and inner evidence distinct in both navigation modes', () => {
  const captures = [
    ['cover', 'gesture'],
    ['cover', 'threeButton'],
    ['main', 'gesture'],
    ['main', 'threeButton'],
  ];
  for (const [screenId, navMode] of captures) {
    const raw = JSON.parse(readFileSync(`measurements/galaxy-z-fold8/recapture-2026-09-22/${screenId}-${navMode}.json`, 'utf8'));
    const screen = galaxyZFold8.screens.find(candidate => candidate.id === screenId);
    assert.equal(raw.screen, screenId);
    assert.equal(raw.navigation.mode, navMode);
    assert.deepEqual(screen.resolutionPx, raw.display.currentWindowPx);
    assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
    assert.deepEqual(screen.insets[navMode].systemBars, raw.insets.systemBars.dp);
    assert.deepEqual(screen.insets[navMode].displayCutout, raw.insets.displayCutout.dp);
  }
  const cover = galaxyZFold8.screens.find(screen => screen.id === 'cover');
  const main = galaxyZFold8.screens.find(screen => screen.id === 'main');
  assert.deepEqual(cover.resolutionPx, { width: 1248, height: 1972 });
  assert.deepEqual(main.resolutionPx, { width: 2448, height: 1848 });
  assert.equal(main.insets.gesture.systemBars.bottom, 14.86);
  assert.equal(main.insets.threeButton.systemBars.bottom, 48);
});

test('published px values and capture orientation remain exact raw evidence', () => {
  const cases = [
    ...[['main', 'threeButton'], ['main', 'gesture'], ['cover', 'gesture']].map(([screenId, navMode]) => ({ device: galaxyZTriFold, screenId, navMode, capturePath: `measurements/galaxy-z-trifold/${screenId}-${navMode}.json` })),
    ...['gesture', 'threeButton'].flatMap(navMode => [
      { device: galaxyZFold4, screenId: 'cover', navMode, capturePath: `measurements/galaxy-z-fold4/cover-${navMode}.json` },
      { device: galaxyZFold4, screenId: 'main', navMode, capturePath: `measurements/galaxy-z-fold4/main-${navMode}.json` },
    ]),
    ...['gesture', 'threeButton'].flatMap(navMode => [
      { device: galaxyZFold5, screenId: 'cover', navMode, capturePath: `measurements/galaxy-z-fold5/cover-${navMode}.json` },
      { device: galaxyZFold5, screenId: 'main', navMode, capturePath: `measurements/galaxy-z-fold5/recapture-2026-09-25/main-${navMode}.json` },
    ]),
    { device: galaxyZFold6, screenId: 'cover', navMode: 'gesture', capturePath: 'measurements/galaxy-z-fold6/cover-gesture.json' },
    { device: galaxyZFold6, screenId: 'cover', navMode: 'threeButton', capturePath: 'measurements/galaxy-z-fold6/cover-threeButton.json' },
    { device: galaxyZFold6, screenId: 'main', navMode: 'gesture', capturePath: 'measurements/galaxy-z-fold6/main-gesture.json' },
    { device: galaxyZFold6, screenId: 'main', navMode: 'threeButton', capturePath: 'measurements/galaxy-z-fold6/main-threeButton.json' },
    ...['gesture', 'threeButton'].flatMap(navMode => [
      {
        device: galaxyZFold2,
        screenId: 'cover',
        navMode,
        capturePath: `measurements/galaxy-z-fold2/cover-${navMode}.json`,
      },
      {
        device: galaxyZFold2,
        screenId: 'main',
        navMode,
        capturePath: `measurements/galaxy-z-fold2/main-${navMode}.json`,
      },
      {
        device: galaxyZFold7,
        screenId: 'cover',
        navMode,
        capturePath: `measurements/galaxy-z-fold7/cover-${navMode}.json`,
      },
      {
        device: galaxyZFold7,
        screenId: 'main',
        navMode,
        capturePath: `measurements/galaxy-z-fold7/recapture-2026-09-25/main-${navMode}.json`,
      },
      {
        device: galaxyZFold8,
        screenId: 'cover',
        navMode,
        capturePath: `measurements/galaxy-z-fold8/recapture-2026-09-22/cover-${navMode}.json`,
      },
      {
        device: galaxyZFold8,
        screenId: 'main',
        navMode,
        capturePath: `measurements/galaxy-z-fold8/recapture-2026-09-22/main-${navMode}.json`,
      },
      {
        device: galaxyZFlip8,
        screenId: 'cover',
        navMode,
        capturePath: `measurements/galaxy-z-flip8/recapture-2026-09-23/cover-${navMode}.json`,
      },
      {
        device: galaxyZFlip8,
        screenId: 'main',
        navMode,
        capturePath: `measurements/galaxy-z-flip8/main-${navMode}.json`,
      },
      {
        device: galaxyS25Plus,
        screenId: 'main',
        navMode,
        capturePath: `measurements/galaxy-s25-plus/main-${navMode}.json`,
      },
      {
        device: galaxyS25Ultra,
        screenId: 'main',
        navMode,
        capturePath: `measurements/galaxy-s25-ultra/main-${navMode}.json`,
      },
    ]),
  ];

  for (const evidence of cases) assertExactPixelEvidence(evidence);

  const fold8Main = galaxyZFold8.screens.find(screen => screen.id === 'main');
  const s25Main = galaxyS25Ultra.screens.find(screen => screen.id === 'main');
  assert.equal(fold8Main.captureOrientation, 'landscape');
  assert.deepEqual(fold8Main.logicalSizePx, { width: 2448, height: 1848 });
  assert.equal(s25Main.insets.threeButton.systemBarsPx.top, 96,
    '96 raw px must not be reconstructed as 95.99 px from rounded dp');
});

test('px presentation prefers exact capture values over rounded dp reconstruction', () => {
  const screen = galaxyS25Ultra.screens.find(candidate => candidate.id === 'main');
  const measurement = screen.insets.threeButton;
  assert.equal(formatLength({
    dp: measurement.systemBars.top,
    px: measurement.systemBarsPx.top,
    units: 'px',
  }), '96');
  assert.equal(formatLength({
    dp: measurement.systemBars.top,
    px: measurement.systemBarsPx.top,
    units: 'dp',
  }), '34.13');
  assert.deepEqual(safeInsetsPx(measurement), { top: 96, right: 0, bottom: 135, left: 0 });
  assert.deepEqual(screen.logicalSizePx, { width: 1080, height: 2340 });
  assert.equal(hasExactPx(screen, measurement), true);
  assert.equal(formatLength({
    dp: measurement.systemBars.top,
    px: null,
    units: 'px',
  }), 'pending', 'missing raw px must never be reconstructed from rounded dp');
  const flipCover = galaxyZFlip8.screens.find(candidate => candidate.id === 'cover');
  assert.equal(hasExactPx(flipCover, flipCover.insets.threeButton), true);
});

test('published cutout positions preserve raw bounds in both dp and px', () => {
  const cases = [
    [galaxyZFold5, 'cover', 'measurements/galaxy-z-fold5/cover-threeButton.json'],
    [galaxyZFold6, 'cover', 'measurements/galaxy-z-fold6/cover-threeButton.json'],
    [galaxyZFold2, 'cover', 'measurements/galaxy-z-fold2/cover-threeButton.json'],
    [galaxyZFold2, 'main', 'measurements/galaxy-z-fold2/main-threeButton.json'],
    [galaxyZFold7, 'cover', 'measurements/galaxy-z-fold7/cover-threeButton.json'],
    [galaxyZFold8, 'cover', 'measurements/galaxy-z-fold8/recapture-2026-09-22/cover-threeButton.json'],
    [galaxyZFlip8, 'cover', 'measurements/galaxy-z-flip8/recapture-2026-09-23/cover-threeButton.json'],
    [galaxyZFlip8, 'main', 'measurements/galaxy-z-flip8/main-threeButton.json'],
    [galaxyS25Plus, 'main', 'measurements/galaxy-s25-plus/main-threeButton.json'],
    [galaxyS25Ultra, 'main', 'measurements/galaxy-s25-ultra/main-threeButton.json'],
  ];

  for (const [device, screenId, capturePath] of cases) {
    const raw = readCapture(capturePath);
    const rawPx = raw.displayCutout.boundingRects[0].px;
    const rawDp = raw.displayCutout.boundingRects[0].dp;
    const shape = device.screens.find(screen => screen.id === screenId).insets.threeButton.cutoutShape;
    assert.deepEqual(shape, {
      xDp: rawDp.left,
      yDp: rawDp.top,
      widthDp: rawDp.width,
      heightDp: rawDp.height,
      rightDp: Number((raw.display.maximumWindowDp.width - rawDp.right).toFixed(2)),
      bottomDp: Number((raw.display.maximumWindowDp.height - rawDp.bottom).toFixed(2)),
      xPx: rawPx.left,
      yPx: rawPx.top,
      widthPx: rawPx.right - rawPx.left,
      heightPx: rawPx.bottom - rawPx.top,
      rightPx: raw.display.currentWindowPx.width - rawPx.right,
      bottomPx: raw.display.currentWindowPx.height - rawPx.bottom,
    });
  }
});

test('Fold2 uses captured full-window dimensions rather than Android 13 app metrics', () => {
  const raw = JSON.parse(readFileSync('measurements/galaxy-z-fold2/main-threeButton.json', 'utf8'));
  const screen = galaxyZFold2.screens.find(screen => screen.id === 'main');
  assert.deepEqual(screen.resolutionPx, raw.display.currentWindowPx);
  assert.deepEqual(screen.logicalSizeDp, raw.display.maximumWindowDp);
  assert.notEqual(screen.resolutionPx.height, raw.display.appMetricsPx.height);
  assert.equal(raw.display.appMetricsPx.height + raw.insets.systemBars.px.top + raw.insets.systemBars.px.bottom, screen.resolutionPx.height);
  assert.equal(screen.insets.threeButton.condition.oneUi, '5.1.1');
  assert.deepEqual(screen.insets.threeButton.systemBars, raw.insets.systemBars.dp);
  const gestureRaw = JSON.parse(readFileSync('measurements/galaxy-z-fold2/main-gesture.json', 'utf8'));
  assert.equal(gestureRaw.navigation.mode, 'gesture');
  assert.equal(gestureRaw.navigation.modeSource, 'configAndSideGestures');
  assert.deepEqual(screen.insets.gesture.systemBars, gestureRaw.insets.systemBars.dp);
  assert.equal(screen.insets.gesture.systemBars.bottom, 48);
  assert.match(screen.insets.gesture.condition.note, /taskbar/);
  const coverRaw = JSON.parse(readFileSync('measurements/galaxy-z-fold2/cover-threeButton.json', 'utf8'));
  const cover = galaxyZFold2.screens.find(screen => screen.id === 'cover');
  assert.deepEqual(cover.resolutionPx, { width: 816, height: 2260 });
  assert.deepEqual(cover.logicalSizePx, coverRaw.display.currentWindowPx);
  assert.deepEqual(cover.logicalSizeDp, coverRaw.display.maximumWindowDp);
  assert.deepEqual(cover.insets.threeButton.systemBars, coverRaw.insets.systemBars.dp);
  assert.equal(cover.cornerRadiiDp, null);
  const coverGesture = JSON.parse(readFileSync('measurements/galaxy-z-fold2/cover-gesture.json', 'utf8'));
  assert.equal(coverGesture.navigation.mode, 'gesture');
  assert.deepEqual(cover.insets.gesture.systemBars, coverGesture.insets.systemBars.dp);
  assert.deepEqual(cover.logicalSizePx, coverGesture.display.currentWindowPx);
  assert.equal(cover.insets.gesture.systemBars.bottom, 15);
  assert.deepEqual(coverRaw.hinge.foldingFeatures, []);
  assert.equal(cover.resolutionPx.width, skins['galaxy-z-fold2/cover'].screen.width);
  assert.match(cover.insets.threeButton.condition.note, /816×2260/);
});

test('Flip8 legacy cover label does not make its flat inner capture a cover measurement', () => {
  const raw = JSON.parse(readFileSync('measurements/galaxy-z-flip8/cover-threeButton.json', 'utf8'));
  assert.equal(raw.screen, 'cover');
  assert.equal(raw.hinge.angleDegrees, 180);
  assert.equal(raw.hinge.foldingFeatures[0].state, 'FLAT');
  assert.deepEqual([raw.display.widthPx, raw.display.heightPx], [skins['galaxy-z-flip8/main'].screen.width, skins['galaxy-z-flip8/main'].screen.height]);
  assert.notEqual(raw.display.widthPx, skins['galaxy-z-flip8/cover'].screen.width);
});

test('Flip8 FlexWindow recapture verifies the real cover in both navigation modes', () => {
  const cover = galaxyZFlip8.screens.find(screen => screen.id === 'cover');
  assert.deepEqual(cover.resolutionPx, { width: 948, height: 1048 });
  assert.deepEqual(cover.logicalSizePx, { width: 948, height: 1048 });
  assert.deepEqual(cover.logicalSizeDp, { width: 399.16, height: 441.26 });
  assert.equal(cover.captureOrientation, 'portrait');
  assert.equal(cover.captureRotation, 0);
  assert.equal(cover.densityDpi, 380);
  assert.deepEqual(cover.cornerRadiiPx, { topLeft: 12, topRight: 12, bottomRight: 97, bottomLeft: 97 });

  for (const navMode of ['gesture', 'threeButton']) {
    const raw = readCapture(`measurements/galaxy-z-flip8/recapture-2026-09-23/cover-${navMode}.json`);
    assert.equal(raw.device.model, 'SM-F776B');
    assert.equal(raw.screen, 'cover');
    assert.equal(raw.screenLabelSource, 'flexWindowWidget');
    assert.equal(raw.navigation.mode, navMode);
    assert.equal(raw.display.id, 1);
    assert.deepEqual(raw.display.currentWindowPx, { width: 948, height: 1048 });
    assert.equal(raw.display.isInMultiWindowMode, false);
    assert.equal(raw.probeVersion, '1.2.1');
    assert.deepEqual(cover.insets[navMode].systemBars, raw.insets.systemBars.dp);
    assert.deepEqual(cover.insets[navMode].displayCutout, raw.insets.displayCutout.dp);
  }
});


test('closed housing depth matches the published depth on both hinge axes', () => {
  for (const vertical of [true, false]) {
    for (const [thickness, closedDepth] of [[.045, .097], [.042, .089], [.061, .131]]) {
      const hinge = hingeHalfWidth(thickness, closedDepth);
      const geometry = createFoldHousings(4, 3, .12, thickness, hinge, vertical);
      const positions = geometry.attributes.position;
      const along = [];
      for (let i = 0; i < positions.count; i++) {
        const point = bendPoint(positions.getX(i), positions.getY(i), positions.getZ(i), 0, vertical, hinge);
        along.push(point[vertical ? 0 : 1]);
      }
      assert.ok(Math.abs(Math.max(...along) - Math.min(...along) - closedDepth) < 1e-7);
      // Each half keeps its distances at intermediate poses (no rubber housing).
      for (const angle of [0, 45, 90, 135, 180]) {
        const a = vertical ? [1, .5, -thickness] : [.5, 1, -thickness];
        const b = vertical ? [.3, -.5, -.008] : [-.5, .3, -.008];
        const pa = bendPoint(...a, angle, vertical, hinge);
        const pb = bendPoint(...b, angle, vertical, hinge);
        assert.ok(Math.abs(Math.hypot(...pa.map((v, i) => v - pb[i])) - Math.hypot(...a.map((v, i) => v - b[i]))) < 1e-9);
      }
      geometry.dispose();
    }
  }
});

test('Fold covers sit on the left rear half and Flip covers on the upper rear half', async () => {
  const { coverPoint } = await import('../app/components/foldGeometry.ts');
  assert.ok(coverPoint(.5, .5, 1, 2, 4, 3, .01, true, false)[0] < 0);
  assert.ok(coverPoint(.5, .5, 1, 2, 4, 3, .01, false, false)[1] > 0);
});

test('landscape book captures rotate the hinge and preserve cover UV distances', async () => {
  const { verticalHinge, coverPoint, coverSide } = await import('../app/components/foldGeometry.ts');
  assert.equal(verticalHinge('vertical', 0), true);
  assert.equal(verticalHinge('vertical', 1), false);
  assert.equal(verticalHinge('vertical', 3), false);
  assert.equal(verticalHinge('horizontal', 0), false);
  for (const rotatedBook of [false, true]) {
    const vertical = !rotatedBook;
    const a = coverPoint(0, 0, 1, 2, 4, 3, .01, vertical, rotatedBook);
    const b = coverPoint(1, 0, 1, 2, 4, 3, .01, vertical, rotatedBook);
    const c = coverPoint(0, 1, 1, 2, 4, 3, .01, vertical, rotatedBook);
    for (const angle of [0, 30, 60, 90, 180]) {
      const pa = rigidPanelPoint(...a, -.069, angle, vertical, .01, coverSide(vertical, rotatedBook));
      const pb = rigidPanelPoint(...b, -.069, angle, vertical, .01, coverSide(vertical, rotatedBook));
      const pc = rigidPanelPoint(...c, -.069, angle, vertical, .01, coverSide(vertical, rotatedBook));
      assert.ok(Math.abs(Math.hypot(...pa.map((v, i) => v - pb[i])) - 1) < 1e-9);
      assert.ok(Math.abs(Math.hypot(...pa.map((v, i) => v - pc[i])) - 2) < 1e-9);
    }
  }
});

test('TriFold log recovery preserves complete captures and registers both cover modes', () => {
  const cover = galaxyZTriFold.screens.find(s => s.id === 'cover');
  const coverThreeButton = readCapture('measurements/galaxy-z-trifold/cover-threeButton.json');
  assert.deepEqual(cover.insets.threeButton.systemBarsPx, coverThreeButton.insets.systemBars.px);
  assert.deepEqual(cover.insets.threeButton.displayCutoutPx, coverThreeButton.insets.displayCutout.px);
  assert.equal(coverThreeButton.screen, 'cover');
  assert.equal(coverThreeButton.display.fontScale, 1);
  assert.equal(coverThreeButton.navigation.mode, 'threeButton');
  for (const screen of ['main', 'cover']) {
    const log = readFileSync(`measurements/galaxy-z-trifold/rtl-logs/${screen}-gesture.txt`, 'utf8');
    const messages = log.split('\n').filter(line => /InsetsProbe:?[\t]+/.test(line))
      .map(line => line.split(/InsetsProbe:?[\t]+/)[1]).join('\n');
    const raw = readCapture(`measurements/galaxy-z-trifold/${screen}-gesture.json`);
    const start = messages.lastIndexOf('"schemaVersion"');
    const recovered = JSON.parse(messages.slice(messages.lastIndexOf('{', start), messages.length));
    assert.deepEqual(recovered, raw);
    assert.equal(raw.display.fontScale, 1);
    assert.deepEqual(raw.display.rootViewPx, raw.display.maximumWindowPx);
    assert.equal(raw.navigation.settingAgreesWithInsets, true);
  }
});

test('measured Z screens publish the official skin resolution in its upright orientation', () => {
  const devices = [galaxyZFold2, galaxyZFold4, galaxyZFold5, galaxyZFold6, galaxyZFold7, galaxyZFold8,
    galaxyZFlip5, galaxyZFlip6, galaxyZFlip8];
  for (const device of devices) {
    for (const screen of device.screens) {
      const skin = skins[`${device.slug}/${screen.id}`];
      if (!skin) continue;
      assert.deepEqual(screen.resolutionPx, { width: skin.screen.width, height: skin.screen.height },
        `${device.slug}/${screen.id}`);
    }
  }
});
