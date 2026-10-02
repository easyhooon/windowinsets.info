import test from 'node:test';
import assert from 'node:assert/strict';
import { runnerImport } from 'vite';

const load = async path => (await runnerImport(path, { root: process.cwd() })).module;

test('device Markdown covers every measured mode and never prints placeholders as values', async () => {
  const { devices, SITE_URL } = await load('./app/data/devices.ts');
  const { createDeviceMarkdown } = await load('./app/data/deviceMarkdown.server.ts');
  for (const device of devices) {
    const md = createDeviceMarkdown(device, SITE_URL);
    assert.match(md, new RegExp(`^# ${device.name.replace(/[+()]/g, '\\$&')}\\n`), device.slug);
    assert.ok(md.includes(`Device page: ${SITE_URL}/${device.slug}`), device.slug);
    assert.doesNotMatch(md, /\| 0 in \||0 × 0 px|undefined|NaN/, device.slug);
    const measured = device.screens.flatMap(screen => [screen.insets, ...Object.values(screen.rotations ?? {}).map(r => r.insets)])
      .flatMap(insets => Object.values(insets)).filter(Boolean);
    const sourceUrls = new Set(measured.flatMap(m => m.sources.filter(s => s.kind === 'measured' || s.kind === 'emulator').map(s => s.url)));
    for (const url of sourceUrls) assert.ok(md.includes(url), `${device.slug} cites ${url}`);
  }
});

test('a measured S23+ capture reaches the Markdown with its exact pixels', async () => {
  const { devices, SITE_URL } = await load('./app/data/devices.ts');
  const { createDeviceMarkdown } = await load('./app/data/deviceMarkdown.server.ts');
  const md = createDeviceMarkdown(devices.find(d => d.slug === 'galaxy-s23-plus'), SITE_URL);
  assert.ok(md.includes('| System bars | 26.31 dp (74 px) | 0 dp (0 px) | 14.93 dp (42 px) | 0 dp (0 px) |'));
  assert.ok(md.includes('### Rotation 3 (rotated 270°, landscape)'));
});
