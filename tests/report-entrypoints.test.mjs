import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const privateText = 'synthetic-private-report';

async function runEntry(t, script, overrides = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'report-entrypoint-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const outputPath = join(dir, 'github-output');
  const requestsPath = join(dir, 'requests');
  await writeFile(outputPath, '');
  const entry = new URL(`../scripts/${script}`, import.meta.url).href;
  const source = `
    import crypto from 'node:crypto';
    import { syncBuiltinESMExports } from 'node:module';
    import { appendFile } from 'node:fs/promises';
    crypto.createSign = () => ({ update() { return this; }, sign() { return 'test-signature'; } });
    syncBuiltinESMExports();
    globalThis.fetch = async (url, options = {}) => {
      await appendFile(${JSON.stringify(requestsPath)}, 'request\\n');
      if (url === 'https://oauth2.googleapis.com/token') return { ok: true, json: async () => ({ access_token: 'test-access-token' }) };
      if (url === 'https://api.github.com/repos/easyhooon/windowinsets.info') return { ok: true, json: async () => ({ stargazers_count: 10 }) };
      if (url.startsWith('https://analyticsdata.googleapis.com/')) {
        const body = JSON.parse(options.body);
        return { ok: true, json: async () => ({ metadata: { timeZone: 'Asia/Seoul' }, rows: [{ dimensionValues: (body.dimensions ?? []).map(() => ({ value: ${JSON.stringify(privateText)} })), metricValues: body.metrics.map(() => ({ value: '10' })) }] }) };
      }
      throw new Error('Unexpected synthetic network request');
    };
    await import(${JSON.stringify(entry)});
  `;
  const child = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GITHUB_ACTIONS: 'true',
      GITHUB_OUTPUT: outputPath,
      GITHUB_REPOSITORY: 'easyhooon/windowinsets.info',
      GITHUB_TOKEN: 'test-token',
      GA4_PROPERTY_ID: 'test-property',
      GA4_SERVICE_ACCOUNT_KEY: JSON.stringify({ client_email: 'test@example.invalid', private_key: 'unused-signing-stub' }),
      REPORT_OUTPUT_PATH: '',
      REPORT_INPUT_PATH: '',
      REPORT_JSON: JSON.stringify({ version: 1, reportDate: '2026-10-06', content: privateText, partial: false }),
      REPORT_TRANSFER_KEY: Buffer.alloc(32, 7).toString('base64'),
      DISCORD_WEBHOOK_URL: 'https://discord.example.invalid/test-hook',
      GITHUB_STARS_STATE_PATH: join(dir, 'stars.json'),
      REPORT_DATE: '',
      DELIVERY_NOT_BEFORE: '',
      ...overrides,
    },
  });
  return { child, output: await readFile(outputPath, 'utf8'), requestsPath };
}

for (const [context, overrides] of [
  ['Actions', {}],
  ['Actions without GITHUB_OUTPUT', { GITHUB_OUTPUT: '' }],
  ['output-managed execution without GITHUB_ACTIONS', { GITHUB_ACTIONS: '' }],
]) {
  test(`${context} rejects a missing report output path before collection or preview logging`, async t => {
    const { child, output, requestsPath } = await runEntry(t, 'analytics-daily-report.mjs', overrides);
    assert.equal(child.status, 1, child.stderr);
    assert.match(child.stderr, /REPORT_OUTPUT_PATH is required in Actions/);
    assert.equal(child.stdout, '');
    assert.ok(!child.stderr.includes(privateText));
    assert.equal(output, '');
    await assert.rejects(readFile(requestsPath), { code: 'ENOENT' });
  });
}

test('the sender rejects a missing input path without falling back to REPORT_JSON or calling any API', async t => {
  const { child, output, requestsPath } = await runEntry(t, 'send-daily-report.mjs');
  assert.equal(child.status, 1, child.stderr);
  assert.match(child.stderr, /An encrypted report.*required for delivery/);
  assert.equal(child.stdout, '');
  assert.ok(!child.stderr.includes(privateText));
  assert.equal(output, '');
  await assert.rejects(readFile(requestsPath), { code: 'ENOENT' });
});

test('local preparation without Actions outputs retains its explicit preview behavior', async t => {
  const { child, output } = await runEntry(t, 'analytics-daily-report.mjs', { GITHUB_ACTIONS: '', GITHUB_OUTPUT: '' });
  assert.equal(child.status, 0, child.stderr);
  assert.ok(child.stdout.includes(privateText));
  assert.equal(output, '');
});
