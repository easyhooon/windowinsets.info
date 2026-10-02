import test from 'node:test';
import assert from 'node:assert/strict';
import { runnerImport } from 'vite';

const load = async path => (await runnerImport(path, { root: process.cwd() })).module;

test('llms.txt lists every public device with its page and JSON export', async () => {
  const { devices, SITE_URL } = await load('./app/data/devices.ts');
  const { createLlmsTxt } = await load('./app/data/llmsTxt.ts');
  const text = createLlmsTxt(devices, SITE_URL);
  assert.match(text, /^# windowinsets\.info\n\n> /);
  for (const device of devices) {
    assert.ok(text.includes(`](${SITE_URL}/${device.slug}):`), `${device.slug} page link`);
    assert.ok(text.includes(`JSON: ${SITE_URL}/data/${device.slug}.json`), `${device.slug} export link`);
  }
  assert.equal(text.match(/\. JSON: /g).length, devices.length);
});
