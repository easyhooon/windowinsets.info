import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runnerImport } from 'vite';

const load = async path => (await runnerImport(path, { root: process.cwd() })).module;

// Writes the same JSON the site publishes into a temporary directory and runs the CLI against it.
async function fixtureSite() {
  const { devices, SITE_URL } = await load('./app/data/devices.ts');
  const { rawInsets } = await load('./app/data/rawInsets.server.ts');
  const { deviceDevelopment } = await load('./app/data/devCaptures.server.ts');
  const { createDeviceBundle, createDeviceIndex, serializeDeviceExport } = await load('./app/data/deviceExport.ts');
  const dir = mkdtempSync(join(tmpdir(), 'windowinsets-cli-'));
  mkdirSync(join(dir, 'data'));
  writeFileSync(join(dir, 'data/index.json'), JSON.stringify(createDeviceIndex(devices, SITE_URL)));
  writeFileSync(join(dir, 'data/all.json'), JSON.stringify(createDeviceBundle(devices, rawInsets, deviceDevelopment)));
  for (const slug of ['galaxy-s23-plus', 'galaxy-fold', 'galaxy-z-fold8']) {
    writeFileSync(join(dir, `data/${slug}.json`), serializeDeviceExport(devices.find(d => d.slug === slug), rawInsets, deviceDevelopment));
  }
  return { dir, devices };
}

const cli = (dir, ...args) => execFileSync(process.execPath, ['cli/bin/windowinsets.js', ...args, '--base-url', dir], { encoding: 'utf8' });

test('CLI reads measured insets and reports unmeasured screens without estimating', async () => {
  const { dir, devices } = await fixtureSite();
  const s23 = devices.find(d => d.slug === 'galaxy-s23-plus').screens[0].insets.gesture;
  const [row] = JSON.parse(cli(dir, 'get', 's23-plus', '--nav', 'gesture', '--unit', 'px', '--json'));
  assert.equal(row.device, 'galaxy-s23-plus');
  assert.deepEqual(row.insets.systemBars, s23.systemBarsPx);
  assert.equal(row.source, 'https://windowinsets.info/galaxy-s23-plus');
  assert.deepEqual(JSON.parse(cli(dir, 'get', 'galaxy-fold', '--json')), []);
  assert.match(cli(dir, 'get', 'galaxy-fold'), /gesture: not measured yet/);
});

test('CLI fixtures cover only measured screen and navigation-mode pairs', async () => {
  const { dir, devices } = await fixtureSite();
  const rows = JSON.parse(cli(dir, 'fixtures', '--series', 'flip'));
  const flips = devices.filter(d => /flip/i.test(`${d.series} ${d.name}`));
  const measured = flips.flatMap(d => d.screens.flatMap(s => ['gesture', 'threeButton'].filter(m => s.insets[m]).map(m => `${d.slug}/${s.id}/${m}`)));
  assert.deepEqual(rows.map(r => `${r.device}/${r.screen}/${r.navigation}`).sort(), measured.sort());
});

test('CLI preview prints a Compose spec for each matching capture', async () => {
  const { dir } = await fixtureSite();
  const captures = JSON.parse(cli(dir, 'preview', 'z-fold8', '--screen', 'cover', '--nav', 'gesture', '--json'));
  assert.ok(captures.length > 0);
  for (const c of captures) {
    assert.equal(c.screen, 'cover');
    assert.equal(c.navigation, 'gesture');
    assert.match(c.composePreview, new RegExp(`^@Preview\\(device = "spec:width=${c.displaySizePx.width}px,height=${c.displaySizePx.height}px,dpi=${c.densityDpi},.*navigation=gesture"\\)$`));
  }
  const text = cli(dir, 'preview', 'z-fold8', '--screen', 'cover', '--nav', 'gesture');
  assert.match(text, /\/\/ Cover · gesture · ROTATION_0 \(captured /);
  assert.match(text, /fun ZFold8CoverGestureRotation0Preview\(\)/);
});

test('CLI sizeclass lists captured rotations and keeps missing ones pending', async () => {
  const { dir } = await fixtureSite();
  const rows = JSON.parse(cli(dir, 'sizeclass', 'z-fold8', '--json'));
  const cover = rows.find(r => r.screen === 'cover' && r.rotation === 0);
  assert.equal(cover.status, 'measured');
  assert.equal(cover.windowSizeClass.width, 'Compact');
  assert.ok(rows.filter(r => r.status === 'pending').every(r => r.windowSizeDp === null && r.windowSizeClass === null));
  assert.match(cli(dir, 'sizeclass', 's23-plus'), /ROTATION_0\s+Compact \/ Medium/);
});
