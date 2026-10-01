import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { runnerImport } from 'vite';
import { createDeviceIndex, deviceExportPath, DEVICE_INDEX_SCHEMA } from '../app/data/deviceExport.ts';

const load = async () => (await runnerImport('./app/data/devices.ts', { root: process.cwd() })).module;

test('device index lists every public device and validates against its schema', async () => {
  const { devices, SITE_URL } = await load();
  const index = createDeviceIndex(devices, SITE_URL);
  const schema = JSON.parse(readFileSync('public/schemas/device-index-v1.schema.json', 'utf8'));
  const validate = new Ajv2020({ strict: false }).compile(schema);
  assert.equal(validate(index), true, JSON.stringify(validate.errors));
  assert.equal(index.schema, DEVICE_INDEX_SCHEMA);
  assert.equal(schema.$id, DEVICE_INDEX_SCHEMA);
  assert.equal(index.deviceCount, devices.length);
  assert.deepEqual(index.devices.map(d => d.slug), devices.map(d => d.slug));
  for (const entry of index.devices) {
    assert.equal(entry.export, `${SITE_URL}${deviceExportPath(entry)}`);
    assert.equal(entry.page, `${SITE_URL}/${entry.slug}`);
  }
});

test('measurement status and rotations come only from captures', async () => {
  const { devices, SITE_URL } = await load();
  const index = createDeviceIndex(devices, SITE_URL);
  const bySlug = slug => index.devices.find(d => d.slug === slug);
  const s25Ultra = bySlug('galaxy-s25-ultra');
  assert.equal(s25Ultra.measurementStatus, 'complete');
  assert.equal(s25Ultra.evidence, 'measured');
  assert.deepEqual(s25Ultra.screens[0].measuredModes, ['gesture', 'threeButton']);
  assert.ok(s25Ultra.screens[0].measuredRotations.length > 0);
  // A32 5G has no rotation captures.
  assert.deepEqual(bySlug('galaxy-a32-5g').screens[0].measuredRotations, []);
  for (const entry of index.devices) {
    const device = devices.find(d => d.slug === entry.slug);
    const measured = device.screens.flatMap(s => [s.insets.gesture, s.insets.threeButton]).filter(Boolean).length;
    assert.equal(entry.measurementStatus, measured === 0 ? 'pending' : measured === device.screens.length * 2 ? 'complete' : 'partial', entry.slug);
    assert.equal(entry.evidence === null, measured === 0, entry.slug);
    if (device.brand === 'Google' && measured) assert.equal(entry.evidence, 'emulator', entry.slug);
  }
});
