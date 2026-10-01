import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { runnerImport } from 'vite';
import { galaxyS25 } from '../app/data/devices/galaxy-s25/index.ts';
import { galaxyS25Plus } from '../app/data/devices/galaxy-s25-plus/index.ts';
import { galaxyZFlip8 } from '../app/data/devices/galaxy-z-flip8/index.ts';
import { pixel9 } from '../app/data/devices/pixel-9/index.ts';
import {
  createDeviceExport,
  deviceExportFilename,
  DEVICE_EXPORT_SCHEMA,
  DEVICE_EXPORT_SCHEMA_VERSION,
  downloadDeviceExport,
  serializeDeviceExport,
} from '../app/data/deviceExport.ts';

test('device export is versioned and includes every screen and navigation mode', () => {
  const exported = createDeviceExport(galaxyZFlip8);
  const schema = JSON.parse(readFileSync('public/schemas/device-window-insets-v1.schema.json', 'utf8'));
  assert.equal(exported.schema, DEVICE_EXPORT_SCHEMA);
  assert.equal(exported.schema, 'https://windowinsets.info/schemas/device-window-insets-v1.schema.json');
  assert.equal(exported.schemaVersion, DEVICE_EXPORT_SCHEMA_VERSION);
  assert.equal(schema.$id, exported.schema);
  assert.deepEqual(schema.required, ['schema', 'schemaVersion', 'device', 'screens', 'sources']);
  assert.deepEqual(exported.screens.map(screen => screen.id), ['cover', 'main']);
  for (const screen of exported.screens) {
    assert.deepEqual(Object.keys(screen.navigationModes).sort(), ['gesture', 'threeButton']);
  }
  assert.equal(deviceExportFilename(galaxyZFlip8), 'galaxy-z-flip8-window-insets.json');
  assert.deepEqual(JSON.parse(serializeDeviceExport(galaxyZFlip8)), exported);
});

test('every public device export validates against the published schema', async () => {
  const schema = JSON.parse(readFileSync('public/schemas/device-window-insets-v1.schema.json', 'utf8'));
  const validate = new Ajv2020({ allErrors: true, validateFormats: false }).compile(schema);
  const { module: { devices } } = await runnerImport('./app/data/devices.ts', { root: process.cwd() });
  const { module: { rawInsets: rawBarInsets } } = await runnerImport('./app/data/rawInsets.server.ts', { root: process.cwd() });
  for (const device of devices) {
    assert.notEqual(device.releaseYear, null, `${device.slug}: public release year is missing`);
    const exported = createDeviceExport(device, rawBarInsets);
    assert.equal(validate(exported), true, `${device.slug}: ${JSON.stringify(validate.errors)}`);
    if (device.formFactor === 'foldable-book' || device.formFactor === 'foldable-flip' || device.formFactor === 'foldable-trifold') {
      assert.equal(exported.device.foldAnimation, true, `${device.slug}: fold animation must be available`);
    }
  }
});

test('device export keeps measured dp and exact raw px separate from derived values', () => {
  const cover = createDeviceExport(galaxyZFlip8).screens.find(screen => screen.id === 'cover');
  const measurement = cover.navigationModes.gesture.value;
  assert.equal(cover.capture.status, 'measured');
  assert.deepEqual(cover.capture.value.logicalSize, {
    dp: { width: 399.16, height: 441.26 },
    px: { width: 948, height: 1048 },
  });
  assert.deepEqual(measurement.raw.systemBars, {
    dp: { top: 0, right: 0, bottom: 48, left: 0 },
    px: { top: 0, right: 0, bottom: 114, left: 0 },
  });
  assert.deepEqual(measurement.raw.displayCutoutBounds, {
    dp: { left: 180.21, top: 353.26, width: 218.95, height: 88, right: 0, bottom: 0 },
    px: { left: 428, top: 839, width: 520, height: 209, right: 0, bottom: 0 },
  });
  assert.equal(measurement.derived.safeAreaInsets.evidence, 'derived');
  assert.deepEqual(measurement.derived.safeAreaInsets.px, { top: 0, right: 0, bottom: 209, left: 0 });
  assert.deepEqual(measurement.derived.safeAreaSize.px, { width: 948, height: 839 });
  assert.deepEqual(measurement.derived.safeAreaSize.dp, { width: 399.16, height: 353.26 });
  assert.equal(measurement.evidence, 'measured');
  assert.equal(measurement.condition.oneUi, '9.0');
  assert.ok(measurement.sources[0].url?.endsWith('/cover-gesture.json'));
});

test('emulator captures export as emulator evidence with their provenance', () => {
  const exported = createDeviceExport(pixel9);
  const main = exported.screens.find(screen => screen.id === 'main');
  const measurement = main.navigationModes.gesture.value;
  assert.equal(exported.device.brand, 'Google');
  assert.equal(main.capture.value.evidence, 'emulator');
  assert.equal(measurement.evidence, 'emulator');
  assert.equal(measurement.condition.oneUi, null);
  assert.equal(measurement.condition.emulator.deviceProfile, 'pixel_9');
  assert.ok(measurement.condition.emulator.manifestUrl.endsWith('/measurements/pixel/pixel-9/emulator-2026-09-27/manifest.json'));
  assert.ok(measurement.sources.every(source => source.kind === 'emulator'));
  assert.equal(createDeviceExport(galaxyZFlip8).screens[0].navigationModes.gesture.value.condition.emulator, null);
});

test('TriFold artwork export preserves pending values on both screens', async () => {
  const { module: { skinPreviews } } = await runnerImport('./app/data/skinPreviews.ts', { root: process.cwd() });
  const exported = createDeviceExport(skinPreviews.find(device => device.slug === 'galaxy-z-trifold'));
  assert.equal(exported.device.formFactor, 'foldable-trifold');
  assert.equal(exported.device.foldAnimation, true);
  assert.deepEqual(exported.screens.map(screen => screen.id), ['cover', 'main']);
  for (const screen of exported.screens) {
    assert.equal(screen.specifications.resolutionPx, null);
    assert.equal(screen.capture.status, 'pending');
    assert.equal(screen.capture.value, null);
    assert.deepEqual(screen.navigationModes, {
      gesture: { status: 'pending', value: null },
      threeButton: { status: 'pending', value: null },
    });
    assert.equal(screen.specifications.evidence, 'registered');
  }
});

test('derived dp sizes use display precision while exact px remains unchanged', () => {
  const main = createDeviceExport(galaxyS25Plus).screens.find(screen => screen.id === 'main');
  const gesture = main.navigationModes.gesture.value;
  assert.deepEqual(gesture.derived.safeAreaSize.dp, { width: 384, height: 783.29 });
  assert.deepEqual(gesture.derived.safeAreaSize.px, { width: 1080, height: 2203 });
});

test('download cleanup removes the anchor and defers object URL revocation even on click failure', async () => {
  const originalDocument = globalThis.document;
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  const events = [];
  const anchor = {
    href: '', download: '', hidden: false,
    click() { events.push('click'); throw new Error('synthetic click failure'); },
    remove() { events.push('remove'); },
  };
  globalThis.document = {
    createElement() { events.push('create'); return anchor; },
    body: { appendChild() { events.push('append'); } },
  };
  URL.createObjectURL = () => { events.push('object-url'); return 'blob:test'; };
  URL.revokeObjectURL = () => { events.push('revoke'); };
  try {
    assert.throws(() => downloadDeviceExport(galaxyS25), /synthetic click failure/);
    assert.deepEqual(events, ['object-url', 'create', 'append', 'click', 'remove']);
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(events, ['object-url', 'create', 'append', 'click', 'remove', 'revoke']);
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test('status and navigation bars come from the cited raw capture and add up to systemBars', async () => {
  const { module: { rawInsets: rawBarInsets } } = await runnerImport('./app/data/rawInsets.server.ts', { root: process.cwd() });
  const { galaxyS25Ultra } = await import('../app/data/devices/galaxy-s25-ultra/index.ts');
  const raw = createDeviceExport(galaxyS25Ultra, rawBarInsets).screens[0].navigationModes.gesture.value.raw;
  assert.deepEqual(raw.statusBars, { dp: { top: 34.13, right: 0, bottom: 0, left: 0 }, px: { top: 96, right: 0, bottom: 0, left: 0 } });
  assert.deepEqual(raw.navigationBars, { dp: { top: 0, right: 0, bottom: 14.93, left: 0 }, px: { top: 0, right: 0, bottom: 42, left: 0 } });
  for (const edge of ['top', 'right', 'bottom', 'left']) {
    assert.equal(Math.max(raw.statusBars.px[edge], raw.navigationBars.px[edge]), raw.systemBars.px[edge]);
  }
  // Without the build-time reader (browsers), the fields stay explicitly unresolved.
  assert.equal(createDeviceExport(galaxyS25Ultra).screens[0].navigationModes.gesture.value.raw.statusBars, null);
});

test('a source that does not back the measurement yields no bar insets', async () => {
  const { module: { rawInsets: rawBarInsets } } = await runnerImport('./app/data/rawInsets.server.ts', { root: process.cwd() });
  const { galaxyS25Ultra } = await import('../app/data/devices/galaxy-s25-ultra/index.ts');
  const measurement = galaxyS25Ultra.screens[0].insets.gesture;
  assert.ok(rawBarInsets(measurement));
  assert.equal(rawBarInsets({ ...measurement, systemBarsPx: { ...measurement.systemBarsPx, bottom: 1 } }), null);
  assert.equal(rawBarInsets({ ...measurement, sources: [] }), null);
});

test('gesture and tappable insets are exported and keyed by capture for the page', async () => {
  const { module: { rawInsets, deviceRawInsets } } = await runnerImport('./app/data/rawInsets.server.ts', { root: process.cwd() });
  const { galaxyS25Ultra } = await import('../app/data/devices/galaxy-s25-ultra/index.ts');
  const modes = createDeviceExport(galaxyS25Ultra, rawInsets).screens[0].navigationModes;
  assert.deepEqual(modes.gesture.value.raw.systemGestures.px, { top: 130, right: 84, bottom: 90, left: 84 });
  assert.deepEqual(modes.gesture.value.raw.mandatorySystemGestures.px, { top: 130, right: 0, bottom: 90, left: 0 });
  assert.deepEqual(modes.gesture.value.raw.tappableElement.px, { top: 96, right: 0, bottom: 0, left: 0 });
  assert.deepEqual(modes.threeButton.value.raw.tappableElement.px, { top: 96, right: 0, bottom: 135, left: 0 });
  const byCapture = deviceRawInsets(galaxyS25Ultra);
  assert.deepEqual(byCapture['measurements/galaxy-s/galaxy-s25-ultra/main-gesture.json'].systemGestures.px, { top: 130, right: 84, bottom: 90, left: 84 });
  // Rotation captures are keyed too, so a turned device shows its own capture.
  assert.ok(Object.keys(byCapture).some(path => path.includes('landscape-1-gesture')));
});
