import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { collectGithubStars, snapshotDates } from '../scripts/github-stars-report.mjs';

const repository = 'easyhooon/windowinsets.info';
const now = new Date('2026-10-05T05:00:00Z');
const response = (total) => ({ ok: true, json: async () => ({ stargazers_count: total }) });

async function fixture(t, snapshots) {
  const dir = await mkdtemp(join(tmpdir(), 'github-stars-report-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const statePath = join(dir, 'stars.json');
  if (snapshots) await writeFile(statePath, JSON.stringify({ repository, snapshots }));
  const logs = [];
  const collect = (total, options = {}) => collectGithubStars({
    repository, statePath, now, fetchImpl: async () => response(total), log: message => logs.push(message), ...options,
  });
  return { dir, statePath, collect, logs, state: async () => JSON.parse(await readFile(statePath, 'utf8')) };
}

test('snapshot dates follow KST across UTC midnight and year boundaries', () => {
  assert.deepEqual(snapshotDates(new Date('2026-10-04T15:01:00Z')), { today: '2026-10-05', yesterday: '2026-10-04' });
  assert.deepEqual(snapshotDates(new Date('2026-12-31T15:01:00Z')), { today: '2027-01-01', yesterday: '2026-12-31' });
});

test('first collection shows only a formatted total and saves its dated snapshot', async t => {
  const f = await fixture(t);
  assert.deepEqual(await f.collect(1234), { line: 'GitHub Stars: 총 **1,234개**', snapshotSaved: true });
  assert.deepEqual(await f.state(), { repository, snapshots: { '2026-10-05': 1234 } });
});

for (const [previous, total, delta] of [[116, 123, '+7'], [123, 120, '-3'], [123, 123, '0'], [2, 0, '-2'], [0, 7, '+7']]) {
  test(`previous-day totals ${previous} → ${total} produce net change ${delta}`, async t => {
    const f = await fixture(t, { '2026-10-04': previous });
    assert.equal((await f.collect(total)).line, `GitHub Stars: 총 **${total}개** · 전일 대비 **${delta}**`);
    assert.deepEqual((await f.state()).snapshots, { '2026-10-04': previous, '2026-10-05': total });
  });
}

test('a missed previous day never compares with an older or same-day sample', async t => {
  const f = await fixture(t, { '2026-10-03': 100, '2026-10-05': 120 });
  assert.equal((await f.collect(123)).line, 'GitHub Stars: 총 **123개**');
  assert.deepEqual((await f.state()).snapshots, { '2026-10-05': 123 });
});

test('same-day reruns update today without replacing the previous-day baseline', async t => {
  const f = await fixture(t, { '2026-10-04': 123, '2026-10-05': 130 });
  assert.match((await f.collect(131)).line, /전일 대비 \*\*\+8\*\*/);
  assert.match((await f.collect(132)).line, /전일 대비 \*\*\+9\*\*/);
  assert.deepEqual((await f.state()).snapshots, { '2026-10-04': 123, '2026-10-05': 132 });
});

test('snapshots from another repository cannot supply the daily baseline', async t => {
  const f = await fixture(t);
  await writeFile(f.statePath, JSON.stringify({ repository: 'someone/else', snapshots: { '2026-10-04': 100 } }));
  assert.equal((await f.collect(123)).line, 'GitHub Stars: 총 **123개**');
});

test('request failures and invalid counts do not save zero or change the last snapshot', async t => {
  const f = await fixture(t, { '2026-10-04': 100 });
  const before = await readFile(f.statePath, 'utf8');
  const failures = [
    async () => { throw new Error('request contained test-secret'); },
    async () => ({ ok: false, status: 503 }),
    ...[undefined, null, -1, 1.5, '123'].map(total => async () => response(total)),
  ];
  for (const fetchImpl of failures) {
    const result = await f.collect(undefined, { token: 'test-secret', fetchImpl });
    assert.match(result.line, /조회 실패/);
    assert.equal(result.snapshotSaved, false);
    assert.equal(await readFile(f.statePath, 'utf8'), before);
  }
  assert.ok(f.logs.length);
  assert.ok(f.logs.every(message => !message.includes('test-secret')));
});

test('a corrupt snapshot starts a fresh baseline without an invented daily change', async t => {
  const f = await fixture(t);
  await writeFile(f.statePath, '{invalid');
  assert.equal((await f.collect(123)).line, 'GitHub Stars: 총 **123개**');
  assert.equal((await f.state()).snapshots['2026-10-05'], 123);
});

test('snapshot write failure still returns the real total without marking it saved', async t => {
  const f = await fixture(t);
  const blocked = join(f.dir, 'not-a-directory');
  await writeFile(blocked, 'file');
  assert.deepEqual(await f.collect(123, { statePath: join(blocked, 'stars.json') }), {
    line: 'GitHub Stars: 총 **123개**', snapshotSaved: false,
  });
});

async function runDailyReport(f, { starsFail = false, total = 123, discordFail = false, supportFail = false, prepareOnly = false, artifactOverride, notBefore = '' } = {}) {
  const payloadPath = join(f.dir, 'discord.json');
  const artifactPath = join(f.dir, 'daily-report.json');
  const outputPath = join(f.dir, 'github-output');
  await writeFile(outputPath, '');
  const entry = new URL('../scripts/analytics-daily-report.mjs', import.meta.url).href;
  const sender = new URL('../scripts/send-daily-report.mjs', import.meta.url).href;
  // Stub signing in this child process; no service-account key or network is used.
  const source = `
    import crypto from 'node:crypto';
    import { syncBuiltinESMExports } from 'node:module';
    import { readFile, writeFile } from 'node:fs/promises';
    crypto.createSign = () => ({ update() { return this; }, sign() { return 'test-signature'; } });
    syncBuiltinESMExports();
    const ledgerPath = ${JSON.stringify(join(f.dir, 'deliveries.json'))};
    let ledger = await readFile(ledgerPath, 'utf8').then(JSON.parse).catch(() => ({ branch: false, revision: 0 }));
    let phase = 'prepare';
    globalThis.fetch = async (url, options = {}) => {
      if (url === 'https://oauth2.googleapis.com/token') {
        if (phase !== 'prepare') throw new Error('Sender must not authenticate with GA4');
        return { ok: true, json: async () => ({ access_token: 'test-access-token' }) };
      }
      if (url === 'https://api.github.com/repos/${repository}') {
        if (phase !== 'prepare' || process.env.GITHUB_TOKEN !== 'test-read-secret') throw new Error('Stars must use the read-only preparation token');
        return ${starsFail ? '{ ok: false, status: 503 }' : `{ ok: true, json: async () => ({ stargazers_count: ${total} }) }`};
      }
      if (url.startsWith('https://api.github.com/repos/${repository}/')) {
        if (phase !== 'deliver' || process.env.GITHUB_TOKEN !== 'test-write-secret') throw new Error('Preparation must not access delivery state');
        const reply = (status, data = {}) => ({ ok: status < 400, status, json: async () => data });
        if (url.endsWith('/git/ref/heads/analytics-report-state')) return reply(ledger.branch ? 200 : 404, { object: { sha: 'head' } });
        if (url.endsWith('/git/ref/heads/main')) return reply(200, { object: { sha: 'main' } });
        if (url.endsWith('/git/refs')) { ledger.branch = true; await writeFile(ledgerPath, JSON.stringify(ledger)); return reply(201); }
        if (url.includes('/contents/.analytics/deliveries/')) {
          if (options.method !== 'PUT') return ledger.record ? reply(200, { content: Buffer.from(JSON.stringify(ledger.record)).toString('base64'), sha: ledger.sha }) : reply(404);
          const body = JSON.parse(options.body);
          if (ledger.record && body.sha !== ledger.sha) return reply(409);
          ledger.record = JSON.parse(Buffer.from(body.content, 'base64').toString('utf8'));
          ledger.sha = String(++ledger.revision);
          await writeFile(ledgerPath, JSON.stringify(ledger));
          return reply(201, { content: { sha: ledger.sha } });
        }
        throw new Error('Unexpected GitHub state request');
      }
      if (url.startsWith('https://analyticsdata.googleapis.com/')) {
        if (phase !== 'prepare') throw new Error('Sender must not query GA4');
        const body = JSON.parse(options.body);
        if (${supportFail} && body.dimensions?.some(d => d.name === 'customEvent:support_platform')) return { ok: false, status: 400, text: async () => 'mock unsupported dimension' };
        const dimensions = (body.dimensions ?? []).map(d => ({ value: ({ date: '20261004', deviceCategory: 'desktop', eventName: 'device_select', pageTitle: 'Galaxy Z Fold8 Window Insets', pagePath: '/galaxy-z-fold8', 'customEvent:support_platform': 'ko_fi' })[d.name] }));
        return { ok: true, json: async () => ({ metadata: { timeZone: 'Asia/Seoul' }, rows: [{ dimensionValues: dimensions, metricValues: body.metrics.map(() => ({ value: '10' })) }] }) };
      }
      if (url === 'https://discord.example.invalid/test-hook?wait=true') {
        if (phase !== 'deliver') throw new Error('Preparation must not post to Discord');
        await writeFile(${JSON.stringify(payloadPath)}, options.body);
        return ${discordFail ? "{ ok: false, status: 429 }" : "{ ok: true, json: async () => ({ id: '1234567890' }) }"};
      }
      throw new Error('Unexpected network request');
    };
    await import(${JSON.stringify(entry)});
    ${artifactOverride === undefined ? '' : `await writeFile(${JSON.stringify(artifactPath)}, ${JSON.stringify(JSON.stringify(artifactOverride))});`}
    if (!${prepareOnly}) {
      phase = 'deliver';
      delete process.env.GA4_PROPERTY_ID;
      delete process.env.GA4_SERVICE_ACCOUNT_KEY;
      process.env.GITHUB_TOKEN = 'test-write-secret';
      process.env.DISCORD_WEBHOOK_URL = 'https://discord.example.invalid/test-hook';
      process.env.REPORT_JSON = await readFile(${JSON.stringify(artifactPath)}, 'utf8');
      await import(${JSON.stringify(sender)});
    }
  `;
  const child = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GA4_PROPERTY_ID: 'test-property',
      GA4_SERVICE_ACCOUNT_KEY: JSON.stringify({ client_email: 'test@example.invalid', private_key: 'unused-signing-stub' }),
      DISCORD_WEBHOOK_URL: '',
      GITHUB_REPOSITORY: repository,
      GITHUB_TOKEN: 'test-read-secret',
      GITHUB_STARS_STATE_PATH: f.statePath,
      GITHUB_OUTPUT: outputPath,
      REPORT_OUTPUT_PATH: artifactPath,
      REPORT_INPUT_PATH: artifactPath,
      REPORT_JSON: '',
      DELIVERY_NOT_BEFORE: notBefore,
    },
  });
  const payload = await readFile(payloadPath, 'utf8').then(JSON.parse).catch(() => null);
  const artifact = JSON.parse(await readFile(artifactPath, 'utf8'));
  const outputs = (await readFile(outputPath, 'utf8')).split('\n');
  const preparedOutput = JSON.parse(outputs.find(line => line.startsWith('daily_report=')).slice('daily_report='.length));
  return { child, payload, artifact, preparedOutput, output: outputs.includes('stars_snapshot_saved=true') ? 'stars_snapshot_saved=true\n' : '' };
}

test('preparation produces a data-only report without a webhook, delivery-state access or write token', async t => {
  const f = await fixture(t);
  const { child, payload, artifact, preparedOutput } = await runDailyReport(f, { prepareOnly: true });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(payload, null);
  assert.equal(artifact.version, 1);
  assert.equal(artifact.partial, false);
  assert.deepEqual(preparedOutput, artifact);
  assert.match(artifact.reportDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(artifact.content, /GitHub Stars: 총 \*\*123개\*\*/);
  await assert.rejects(readFile(join(f.dir, 'deliveries.json')), { code: 'ENOENT' });
  assert.ok(!JSON.stringify(artifact).includes('secret') && !JSON.stringify(artifact).includes('test-hook'));
});

test('a transition-day sender skips before any delivery-state or webhook request', async t => {
  const f = await fixture(t);
  const { child, payload } = await runDailyReport(f, { notBefore: '9999-01-01' });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(payload, null);
  assert.match(child.stdout, /Skipped daily delivery before the configured KST cutover day/);
  await assert.rejects(readFile(join(f.dir, 'deliveries.json')), { code: 'ENOENT' });
});

test('the isolated sender rejects malformed report artifacts before creating state or posting', async t => {
  const f = await fixture(t);
  for (const artifactOverride of [
    null,
    { version: 1, reportDate: '2026-02-30', content: 'test', partial: false },
    { version: 1, reportDate: '2026-10-05', content: 'test' },
  ]) {
    const { child, payload } = await runDailyReport(f, { artifactOverride });
    assert.notEqual(child.status, 0);
    assert.match(child.stderr, /prepared daily report is invalid/);
    assert.equal(payload, null);
    await assert.rejects(readFile(join(f.dir, 'deliveries.json')), { code: 'ENOENT' });
  }
});

for (const starsFail of [false, true]) {
  test(`the real daily-report entry point posts other statistics when stars ${starsFail ? 'fail' : 'succeed'}`, async t => {
    const f = await fixture(t);
    const { child, payload, output } = await runDailyReport(f, { starsFail });
    assert.equal(child.status, 0, child.stderr);
    assert.match(payload.content, /활성 사용자 \*\*10명\*\*/);
    assert.match(payload.content, /플랫폼별 활동/);
    assert.match(payload.content, starsFail ? /GitHub Stars: ⚠️ 조회 실패/ : /GitHub Stars: 총 \*\*123개\*\*/);
    assert.equal(payload.username, 'WindowInsets Stats');
    assert.deepEqual(payload.allowed_mentions, { parse: [] });
    assert.equal(output, starsFail ? '' : 'stars_snapshot_saved=true\n');
    assert.ok(!child.stdout.includes('secret') && !child.stderr.includes('secret'));
  });
}

test('failed Discord delivery and its retry retain the cached previous-day baseline', async t => {
  const { today, yesterday } = snapshotDates(new Date());
  const f = await fixture(t, { [yesterday]: 116 });
  const failed = await runDailyReport(f, { total: 123, discordFail: true });
  assert.notEqual(failed.child.status, 0);
  assert.match(failed.child.stderr, /Discord webhook rejected daily report: HTTP 429/);
  assert.match(failed.payload.content, /전일 대비 \*\*\+7\*\*/);
  assert.equal(failed.output, 'stars_snapshot_saved=true\n');
  assert.deepEqual((await f.state()).snapshots, { [yesterday]: 116, [today]: 123 });

  const retried = await runDailyReport(f, { total: 124 });
  assert.equal(retried.child.status, 0, retried.child.stderr);
  assert.match(retried.payload.content, /전일 대비 \*\*\+8\*\*/);
  assert.match(retried.payload.content, /활성 사용자 \*\*10명\*\*/);
  assert.equal(retried.output, 'stars_snapshot_saved=true\n');
  assert.deepEqual((await f.state()).snapshots, { [yesterday]: 116, [today]: 124 });
});

test('a real entry-point rerun skips a delivered date even when the first run failed after posting partial statistics', async t => {
  const f = await fixture(t);
  const first = await runDailyReport(f, { supportFail: true });
  assert.notEqual(first.child.status, 0);
  assert.match(first.child.stdout, /Discord confirmed daily report/);
  assert.match(first.payload.content, /조회 실패/);
  const second = await runDailyReport(f);
  assert.equal(second.child.status, 0, second.child.stderr);
  assert.match(second.child.stdout, /Skipped already delivered daily report/);
  assert.ok(!second.child.stdout.includes('Discord confirmed'));
});
