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
  const { createDeviceBundle, createDeviceIndex, serializeDeviceExport } = await load('./app/data/deviceExport.ts');
  const dir = mkdtempSync(join(tmpdir(), 'windowinsets-cli-'));
  mkdirSync(join(dir, 'data'));
  writeFileSync(join(dir, 'data/index.json'), JSON.stringify(createDeviceIndex(devices, SITE_URL)));
  writeFileSync(join(dir, 'data/all.json'), JSON.stringify(createDeviceBundle(devices, rawInsets)));
  for (const slug of ['galaxy-s23-plus', 'galaxy-fold']) {
    writeFileSync(join(dir, `data/${slug}.json`), serializeDeviceExport(devices.find(d => d.slug === slug), rawInsets));
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
