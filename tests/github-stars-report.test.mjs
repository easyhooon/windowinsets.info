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

for (const starsFail of [false, true]) {
  test(`the real daily-report entry point posts other statistics when stars ${starsFail ? 'fail' : 'succeed'}`, async t => {
    const f = await fixture(t);
    const payloadPath = join(f.dir, 'discord.json');
    const outputPath = join(f.dir, 'github-output');
    await writeFile(outputPath, '');
    const entry = new URL('../scripts/analytics-daily-report.mjs', import.meta.url).href;
    // Stub signing in this child process; no service-account key or network is used.
    const source = `
      import crypto from 'node:crypto';
      import { syncBuiltinESMExports } from 'node:module';
      import { writeFile } from 'node:fs/promises';
      crypto.createSign = () => ({ update() { return this; }, sign() { return 'test-signature'; } });
      syncBuiltinESMExports();
      globalThis.fetch = async (url, options) => {
        if (url === 'https://oauth2.googleapis.com/token') return { ok: true, json: async () => ({ access_token: 'test-access-token' }) };
        if (url === 'https://api.github.com/repos/${repository}') return ${starsFail ? '{ ok: false, status: 503 }' : '{ ok: true, json: async () => ({ stargazers_count: 123 }) }'};
        if (url.startsWith('https://analyticsdata.googleapis.com/')) {
          const body = JSON.parse(options.body);
          const dimensions = (body.dimensions ?? []).map(d => ({ value: ({ date: '20261004', deviceCategory: 'desktop', eventName: 'device_select', pageTitle: 'Galaxy Z Fold8 Window Insets', pagePath: '/galaxy-z-fold8', 'customEvent:support_platform': 'ko_fi' })[d.name] }));
          return { ok: true, json: async () => ({ rows: [{ dimensionValues: dimensions, metricValues: body.metrics.map(() => ({ value: '10' })) }] }) };
        }
        if (url === 'https://discord.example.invalid/test-hook') {
          await writeFile(${JSON.stringify(payloadPath)}, options.body);
          return { ok: true };
        }
        throw new Error('Unexpected network request');
      };
      await import(${JSON.stringify(entry)});
    `;
    const child = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
      encoding: 'utf8',
      env: {
        ...process.env,
        GA4_PROPERTY_ID: 'test-property',
        GA4_SERVICE_ACCOUNT_KEY: JSON.stringify({ client_email: 'test@example.invalid', private_key: 'unused-signing-stub' }),
        DISCORD_WEBHOOK_URL: 'https://discord.example.invalid/test-hook',
        GITHUB_REPOSITORY: repository,
        GITHUB_TOKEN: 'test-secret',
        GITHUB_STARS_STATE_PATH: f.statePath,
        GITHUB_OUTPUT: outputPath,
      },
    });
    assert.equal(child.status, 0, child.stderr);
    const payload = JSON.parse(await readFile(payloadPath, 'utf8'));
    assert.match(payload.content, /활성 사용자 \*\*10명\*\*/);
    assert.match(payload.content, /플랫폼별 활동/);
    assert.match(payload.content, starsFail ? /GitHub Stars: ⚠️ 조회 실패/ : /GitHub Stars: 총 \*\*123개\*\*/);
    assert.equal(payload.username, 'WindowInsets Stats');
    assert.deepEqual(payload.allowed_mentions, { parse: [] });
    assert.equal(await readFile(outputPath, 'utf8'), starsFail ? '' : 'stars_snapshot_saved=true\n');
    assert.ok(!child.stdout.includes('test-secret') && !child.stderr.includes('test-secret'));
  });
}
