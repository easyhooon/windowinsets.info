import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePayment, normalizeKofi, emptyLedger, addPayment, validateLedger, sumDecimals, aggregate, formatAggregate, importVerifiedPayments, timestamp } from '../api/_lib/donations/payments.mjs';
import { createKofiReceiver, githubLedgerStore, MAX_BODY_BYTES } from '../api/_lib/donations/receiver.mjs';
import { collectDonationSection, appendDonationSection } from '../api/_lib/donations/collect.mjs';
import { POST } from '../api/donations/ko-fi.mjs';
import { spawnSync } from 'node:child_process';

// Synthetic fixtures only. The token, people and payments are not real.
const payload = (overrides = {}) => ({
  verification_token: 'synthetic-token', message_id: 'message-1', kofi_transaction_id: 'transaction-1',
  timestamp: '2026-10-05T15:00:00Z', type: 'Donation', amount: '10.20', currency: 'USD',
  is_subscription_payment: false, is_first_subscription_payment: false,
  from_name: 'SYNTHETIC DONOR', email: 'synthetic@example.invalid', message: 'SYNTHETIC PRIVATE MESSAGE',
  url: 'https://example.invalid/private', shipping: { address: 'SYNTHETIC ADDRESS' }, ...overrides,
});
const request = (data = payload(), init = {}) => new Request('https://windowinsets.info/api/donations/ko-fi', {
  method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ data: JSON.stringify(data) }), ...init,
});
const payment = (overrides = {}) => normalizePayment({
  provider: 'kofi', account: 'easyhooon', transactionId: 'tx-1', receivedAt: '2026-10-05T15:00:00Z',
  grossAmount: '10.20', currency: 'USD', kind: 'donation', evidence: 'verified-payment-export', ...overrides,
});
function memoryStore(initial = emptyLedger()) {
  let ledger = structuredClone(initial), revision = 0;
  return {
    reads: 0, writes: 0,
    async read() { this.reads++; return { ledger: structuredClone(ledger), revision }; },
    async compareAndSwap(expected, value) {
      if (revision !== expected) return false;
      this.writes++; ledger = structuredClone(value); revision++; return true;
    },
    snapshot() { return structuredClone(ledger); },
  };
}
const receiver = store => createKofiReceiver({ verificationToken: 'synthetic-token', store });
const bundle = (overrides = {}) => ({ provider: 'kofi', account: 'easyhooon', from: '2026-10-01', through: '2026-10-06', reconciledAt: '2026-10-07T00:00:00.000Z', sourceHash: 'a'.repeat(64), payments: [], ...overrides });
const rawPayment = (overrides = {}) => ({ provider: 'kofi', account: 'easyhooon', transactionId: 'tx-1', receivedAt: '2026-10-05T15:00:00Z', grossAmount: '10.20', currency: 'USD', kind: 'donation', evidence: 'verified-payment-export', ...overrides });

test('payment storage strips PII, provider URLs, raw IDs and token', () => {
  const normalized = normalizeKofi(payload());
  const encoded = JSON.stringify(normalized);
  for (const forbidden of ['SYNTHETIC', 'example.invalid', 'verification_token', 'synthetic-token', 'transaction-1', 'message-1', 'email', 'shipping']) assert.ok(!encoded.includes(forbidden));
  assert.equal(normalized.grossAmount, '10.20');
  assert.equal(normalized.key.length, 64);
});

test('exact decimal arithmetic supports large values and unlike scales', () => {
  assert.equal(sumDecimals(['0.10', '0.20', '999999999999999999.00000001']), '999999999999999999.30000001');
  assert.equal(sumDecimals(['10', '10.00']), '20');
  assert.equal(sumDecimals(['100.00']), '100');
});

test('negative, float, exponent, zero and malformed amounts are rejected', () => {
  for (const amount of ['-1', 1.2, '1e2', 'NaN', '0.00', '01.00', '1.000000000']) assert.throws(() => payment({ grossAmount: amount }));
});

test('timestamp offsets are canonicalized; impossible calendar dates rejected', () => {
  assert.equal(timestamp('2026-10-06T00:00:00+09:00'), '2026-10-05T15:00:00.000Z');
  for (const date of ['2026-02-30T00:00:00Z', '2026-10-06T24:00:00Z', '2026-10-06T00:00:00', '2026-10-06T00:00:00+99:00']) assert.throws(() => timestamp(date));
});

test('same transaction replays across different message IDs and exports only once', () => {
  let ledger = addPayment(emptyLedger(), normalizeKofi(payload())).ledger;
  const replay = addPayment(ledger, normalizeKofi(payload({ message_id: 'message-2', amount: '10.200' })));
  assert.equal(replay.inserted, false);
  const imported = importVerifiedPayments(ledger, bundle({ payments: [rawPayment({ transactionId: 'transaction-1' })] }));
  assert.equal(imported.payments.length, 1);
});

test('conflicting transaction and reused message identity do not corrupt ledger', () => {
  const ledger = addPayment(emptyLedger(), normalizeKofi(payload())).ledger;
  assert.throws(() => addPayment(ledger, normalizeKofi(payload({ amount: '11.20' }))));
  assert.throws(() => addPayment(ledger, normalizeKofi(payload({ kofi_transaction_id: 'other-transaction' }))));
  assert.equal(ledger.payments.length, 1);
});

test('receiver rejects unauthorized data before touching persistence', async () => {
  const store = memoryStore();
  const result = await receiver(store)(request(payload({ verification_token: 'wrong-token' })));
  assert.equal(result.status, 401); assert.equal(store.reads, 0); assert.equal(store.writes, 0);
});

test('receiver returns 200 only after durable write and accepts retry safely', async () => {
  const store = memoryStore();
  assert.equal((await receiver(store)(request())).status, 200);
  assert.equal(store.writes, 1);
  assert.equal((await receiver(store)(request())).status, 200);
  assert.equal(store.writes, 1);
});

test('persistence failure is not acknowledged and never echoes raw data', async () => {
  const result = await receiver({ async read() { throw new Error(JSON.stringify(payload())); } })(request());
  assert.equal(result.status, 503);
  const body = await result.text();
  for (const marker of ['SYNTHETIC', 'synthetic-token', 'example.invalid']) assert.ok(!body.includes(marker));
});

test('concurrent independent payments survive a CAS conflict', async () => {
  const store = memoryStore();
  const results = await Promise.all([receiver(store)(request()), receiver(store)(request(payload({ message_id: 'm-2', kofi_transaction_id: 't-2' })))]);
  assert.deepEqual(results.map(result => result.status), [200, 200]);
  assert.equal(store.snapshot().payments.length, 2);
});

test('lost write acknowledgement is recovered by provider retry without double count', async () => {
  const store = memoryStore(), original = store.compareAndSwap.bind(store);
  let first = true;
  store.compareAndSwap = async (...args) => { const written = await original(...args); if (first) { first = false; throw new Error('Acknowledgement lost.'); } return written; };
  assert.equal((await receiver(store)(request())).status, 503);
  assert.equal((await receiver(store)(request())).status, 200);
  assert.equal(store.snapshot().payments.length, 1);
});

test('malformed, duplicated, oversized and unsupported payloads do not write', async () => {
  const store = memoryStore();
  assert.equal((await receiver(store)(request(payload({ type: 'Shop Order' })))).status, 400);
  assert.equal((await receiver(store)(request({}, { body: 'data={&data={}' }))).status, 400);
  assert.equal((await receiver(store)(request({}, { body: 'data=' + 'x'.repeat(MAX_BODY_BYTES) }))).status, 413);
  assert.equal((await receiver(store)(request({}, { headers: { 'content-type': 'application/json' }, body: '{}' }))).status, 415);
  assert.equal(store.writes, 0);
});

test('no credential configuration, GET or query-token request performs a read', async () => {
  const store = memoryStore();
  assert.equal((await createKofiReceiver({ store })(request())).status, 503);
  assert.equal((await receiver(store)(new Request('https://example.invalid', { method: 'GET' }))).status, 405);
  assert.equal((await receiver(store)(new Request('https://example.invalid?token=synthetic-token', { method: 'POST' }))).status, 400);
  assert.equal(store.reads, 0);
});

test('missing provider history is unknown, not zero', () => {
  const report = aggregate(emptyLedger(), '2026-10-06');
  for (const provider of ['kofi', 'github-sponsors']) {
    assert.equal(report.providers[provider].daily.count, null);
    assert.equal(report.providers[provider].daily.byCurrency, null);
    assert.equal(report.providers[provider].cumulative.count, null);
  }
  assert.ok(formatAggregate(report).includes('daily unavailable'));
});

test('observed webhook receipts remain incomplete until export reconciliation', () => {
  const ledger = addPayment(emptyLedger(), normalizeKofi(payload())).ledger;
  const report = aggregate(ledger, '2026-10-06');
  assert.equal(report.providers.kofi.daily.status, 'observed-incomplete');
  assert.equal(report.providers.kofi.daily.count, null);
  assert.equal(report.providers.kofi.daily.observedCount, 1);
  assert.ok(formatAggregate(report).includes('incomplete history'));
});

test('reconciled empty full day is a true zero without invented currency', () => {
  const report = aggregate(importVerifiedPayments(emptyLedger(), bundle()), '2026-10-06');
  assert.equal(report.providers.kofi.daily.count, 0);
  assert.deepEqual(report.providers.kofi.daily.byCurrency, {});
  assert.equal(report.providers['github-sponsors'].daily.count, null);
});

test('KST day boundary and original currencies are aggregated separately', () => {
  const ledger = importVerifiedPayments(emptyLedger(), bundle({ payments: [
    rawPayment({ transactionId: 'before', receivedAt: '2026-10-05T14:59:59Z', grossAmount: '1000', currency: 'KRW' }),
    rawPayment({ transactionId: 'usd', receivedAt: '2026-10-05T15:00:00Z', grossAmount: '0.10' }),
    rawPayment({ transactionId: 'usd-2', receivedAt: '2026-10-06T14:59:59Z', grossAmount: '0.20' }),
    rawPayment({ transactionId: 'eur', receivedAt: '2026-10-05T15:00:00Z', grossAmount: '2.50', currency: 'EUR' }),
  ] }));
  const report = aggregate(ledger, '2026-10-06');
  assert.equal(report.providers.kofi.daily.count, 3);
  assert.deepEqual(report.providers.kofi.daily.byCurrency, { EUR: { count: 1, grossAmount: '2.5' }, USD: { count: 2, grossAmount: '0.3' } });
  assert.equal(report.providers.kofi.cumulative.count, 4);
  const text = formatAggregate(report);
  assert.ok(text.includes('2026-10-01–2026-10-06'));
  assert.ok(text.includes('fees/refunds not deducted or reconciled'));
  assert.ok(!text.includes('all-time')); assert.ok(!text.includes('net income'));
});

test('coverage gaps exclude older rows from covered-period cumulative', () => {
  let ledger = importVerifiedPayments(emptyLedger(), bundle({ from: '2026-10-01', through: '2026-10-02', payments: [rawPayment({ receivedAt: '2026-10-01T00:00:00Z' })] }));
  ledger = importVerifiedPayments(ledger, bundle({ from: '2026-10-05', through: '2026-10-06', sourceHash: 'b'.repeat(64) }));
  const cumulative = aggregate(ledger, '2026-10-06').providers.kofi.cumulative;
  assert.equal(cumulative.from, '2026-10-05'); assert.equal(cumulative.count, 0);
});

test('invalid or partially elapsed imports fail atomically', () => {
  const ledger = emptyLedger();
  assert.throws(() => importVerifiedPayments(ledger, bundle({ through: '2026-10-07' })));
  assert.throws(() => importVerifiedPayments(ledger, bundle({ payments: [rawPayment(), rawPayment({ transactionId: 'invalid', grossAmount: '-10' })] })));
  assert.throws(() => importVerifiedPayments(ledger, bundle({ payments: [rawPayment({ provider: 'github-sponsors' })] })));
  assert.deepEqual(ledger, emptyLedger());
});

test('an export missing an observed payment cannot establish complete coverage', () => {
  const ledger = addPayment(emptyLedger(), normalizeKofi(payload())).ledger;
  assert.throws(() => importVerifiedPayments(ledger, bundle()), /reconciliation mismatch/);
  assert.equal(ledger.coverage.length, 0);
});

test('collector uses previous KST day and returns only safe aggregate text', async () => {
  const store = memoryStore(addPayment(emptyLedger(), normalizeKofi(payload())).ledger);
  const section = await collectDonationSection({ store, now: '2026-10-06T15:01:00Z' });
  assert.equal(section.date, '2026-10-06'); assert.equal(section.partial, false);
  for (const field of ['SYNTHETIC', 'transaction-1', 'message-1', 'synthetic-token', 'payments"']) assert.ok(!JSON.stringify(section).includes(field));
  assert.ok(section.content.includes('gross') || section.content.includes('Gross'));
});

test('collector source outage yields unavailable without fabricated zero or blocking the other report sections', async () => {
  const section = await collectDonationSection({ store: { async read() { throw new Error('private data'); } }, now: '2026-10-07T00:07:00Z' });
  assert.equal(section.partial, true); assert.ok(section.content.includes('unavailable'));
  assert.ok(!section.content.includes('0 payments')); assert.ok(!section.content.includes('private data'));
});

test('undeployed route fails closed without configuration and no live request', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('A live call must not be made.'); };
  try { assert.equal((await POST(request())).status, 503); } finally { globalThis.fetch = original; }
});

test('composition preserves GA4 delivery date, previous failures and separate donation KST date', async () => {
  const section = await collectDonationSection({ store: memoryStore(), now: '2026-10-06T15:01:00Z' });
  const prepared = { version: 1, reportDate: '2026-10-05', content: 'GA4 and Stars', partial: true };
  const merged = appendDonationSection(prepared, section);
  assert.equal(merged.reportDate, '2026-10-05'); assert.equal(merged.partial, true);
  assert.ok(merged.content.includes('2026-10-06')); assert.ok(merged.content.startsWith('GA4 and Stars'));
});

test('oversized donation section does not prevent the existing single daily message', () => {
  const section = { version: 1, date: '2026-10-06', content: 'x'.repeat(2200), partial: false };
  const merged = appendDonationSection({ version: 1, reportDate: '2026-10-06', content: 'GA4 and Stars', partial: false }, section);
  assert.ok(merged.content.length <= 2000); assert.ok(merged.content.includes('message size limit'));
  assert.equal(merged.partial, true);
  const almostFull = 'x'.repeat(1990);
  assert.equal(appendDonationSection({ version: 1, reportDate: '2026-10-06', content: almostFull, partial: false }, section).content, almostFull);
});

test('ledger rejects raw PII and unrecognized schema instead of publishing it', () => {
  assert.throws(() => validateLedger({ ...emptyLedger(), email: 'synthetic@example.invalid' }));
  const ledger = addPayment(emptyLedger(), payment()).ledger;
  ledger.payments[0].message = 'SYNTHETIC PRIVATE MESSAGE';
  assert.throws(() => aggregate(ledger, '2026-10-06'));
});

const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
function mockGitHub({ privateRepo = true, missing = false } = {}) {
  let ledger = emptyLedger(), revision = 'sha-1'; const calls = [];
  return {
    calls,
    async fetcher(url, init) {
      calls.push({ url, method: init.method ?? 'GET', body: init.body });
      if (!url.includes('/contents/')) return json({ private: privateRepo, full_name: 'easyhooon/windowinsets-donation-ledger', default_branch: 'main' });
      if (init.method === 'PUT') {
        const body = JSON.parse(init.body);
        if (body.sha !== revision) return json({}, 409);
        ledger = JSON.parse(Buffer.from(body.content, 'base64').toString()); revision = 'sha-2'; return json({});
      }
      if (missing) return json({}, 404);
      const content = Buffer.from(JSON.stringify(ledger));
      return json({ type: 'file', encoding: 'base64', size: content.length, content: content.toString('base64'), sha: revision });
    },
  };
}

test('GitHub adapter refuses public storage and missing ledgers', async () => {
  for (const settings of [{ privateRepo: false }, { missing: true }]) {
    const mock = mockGitHub(settings);
    await assert.rejects(githubLedgerStore({ token: 'synthetic-github-token', fetcher: mock.fetcher }).read());
    assert.ok(mock.calls.every(call => call.method === 'GET'));
  }
});

test('GitHub read adapter cannot write and writer uses file SHA without PII', async () => {
  const mock = mockGitHub();
  const read = githubLedgerStore({ token: 'synthetic-read-token', fetcher: mock.fetcher });
  const snapshot = await read.read();
  await assert.rejects(read.compareAndSwap(snapshot.revision, snapshot.ledger));
  const writer = githubLedgerStore({ token: 'synthetic-write-token', fetcher: mock.fetcher, writable: true });
  const result = await receiver(writer)(request());
  assert.equal(result.status, 200);
  const put = mock.calls.find(call => call.method === 'PUT');
  assert.equal(JSON.parse(put.body).sha, 'sha-1');
  const stored = Buffer.from(JSON.parse(put.body).content, 'base64').toString();
  assert.ok(!stored.includes('SYNTHETIC')); assert.ok(!stored.includes('synthetic-token'));
  assert.equal((await writer.read()).ledger.payments.length, 1);
});

test('storage configuration is pinned to the proposed private repository', () => {
  assert.throws(() => githubLedgerStore({ token: 'synthetic-token', repository: 'easyhooon/windowinsets.info' }));
});

test('production route persists only sanitized fields; preview stays disabled', async () => {
  const names = ['DONATIONS_ENABLED', 'VERCEL_ENV', 'KOFI_VERIFICATION_TOKEN', 'DONATIONS_LEDGER_WRITE_TOKEN'];
  const original = Object.fromEntries(names.map(name => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  const mock = mockGitHub();
  try {
    Object.assign(process.env, { DONATIONS_ENABLED: 'true', VERCEL_ENV: 'preview', KOFI_VERIFICATION_TOKEN: 'synthetic-token', DONATIONS_LEDGER_WRITE_TOKEN: 'synthetic-write-token' });
    globalThis.fetch = mock.fetcher;
    assert.equal((await POST(request())).status, 503); assert.equal(mock.calls.length, 0);
    process.env.VERCEL_ENV = 'production';
    assert.equal((await POST(request())).status, 200);
    const put = mock.calls.find(call => call.method === 'PUT');
    assert.ok(put);
    assert.ok(!Buffer.from(JSON.parse(put.body).content, 'base64').toString().includes('SYNTHETIC'));
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of names) original[name] === undefined ? delete process.env[name] : process.env[name] = original[name];
  }
});

test('real sender adds private aggregate once and leaks no amount, token or PII to logs', () => {
  const sender = new URL('../scripts/send-daily-report.mjs', import.meta.url).href;
  const source = `
    import assert from 'node:assert/strict';
    const FixedDate = Date;
    globalThis.Date = class extends FixedDate { constructor(...args) { super(...(args.length ? args : ['2026-10-07T00:07:00Z'])); } static now() { return new FixedDate('2026-10-07T00:07:00Z').valueOf(); } };
    let record, posts = 0, branch = false;
    const json = (body, status=200) => new Response(JSON.stringify(body), {status});
    const ledger = { version:1, coverage:[], payments:[{key:'a'.repeat(64),deliveryKey:null,provider:'kofi',account:'easyhooon',receivedAt:'2026-10-05T15:00:00.000Z',grossAmount:'4321.98765432',currency:'USD',kind:'donation',evidence:'provider-payment-notification'}] };
    globalThis.fetch = async (url, init={}) => {
      const parsed = new URL(url);
      if (url.includes('windowinsets-donation-ledger')) {
        assert.equal(init.headers.Authorization, 'Bearer synthetic-private-reader');
        if (!parsed.pathname.includes('/contents/')) return json({private:true, full_name:'easyhooon/windowinsets-donation-ledger',default_branch:'main'});
        const content = Buffer.from(JSON.stringify(ledger));
        return json({type:'file',encoding:'base64',size:content.length,content:content.toString('base64'),sha:'ledger-sha'});
      }
      if (parsed.hostname === 'discord.example.invalid') {
        posts++;
        const payload = JSON.parse(init.body);
        assert.ok(payload.content.includes('4321.98765432'));
        assert.ok(payload.content.includes('incomplete'));
        assert.ok(payload.content.includes('github-sponsors: daily unavailable'));
        assert.deepEqual(payload.allowed_mentions, {parse:[]});
        assert.ok(!payload.content.includes('synthetic-private-reader'));
        return json({id:'9876543210'});
      }
      if (parsed.pathname.endsWith('/git/ref/heads/analytics-report-state')) return json({object:{sha:'main'}},branch?200:404);
      if (parsed.pathname.endsWith('/git/ref/heads/main')) return json({object:{sha:'main'}});
      if (parsed.pathname.endsWith('/git/refs')) { branch=true;return json({},201); }
      if (init.method==='PUT') {
        const body=JSON.parse(init.body);
        record=JSON.parse(Buffer.from(body.content,'base64').toString());
        assert.ok(!JSON.stringify(record).includes('4321.98765432'));
        return json({content:{sha:'state-sha'}},201);
      }
      return record ? json({content:Buffer.from(JSON.stringify(record)).toString('base64'),sha:'state-sha'}) : json({},404);
    };
    await import(${JSON.stringify(sender)});
    assert.equal(posts,1);
    await import(${JSON.stringify(sender)}+'?recovery');
    assert.equal(posts,1);
  `;
  const child = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
    encoding: 'utf8', env: {
      ...process.env, DELIVERY_NOT_BEFORE: '2026-10-07', REPORT_INPUT_PATH: '',
      REPORT_JSON: JSON.stringify({ version: 1, reportDate: '2026-10-06', content: 'GA4 and Stars', partial: true }),
      DISCORD_WEBHOOK_URL: 'https://discord.example.invalid/synthetic-hook', GITHUB_TOKEN: 'synthetic-public-writer',
      GITHUB_REPOSITORY: 'easyhooon/windowinsets.info', DONATIONS_LEDGER_READ_TOKEN: 'synthetic-private-reader',
    },
  });
  // A pre-existing GA4 failure remains partial after successful donation collection.
  assert.equal(child.status, 1, child.stderr);
  assert.ok(child.stdout.includes('Discord confirmed daily report'));
  assert.ok(child.stdout.includes('Skipped already delivered daily report'));
  for (const marker of ['4321.98765432', 'synthetic-private-reader', 'synthetic-public-writer', 'synthetic-hook', 'SYNTHETIC']) {
    assert.ok(!child.stdout.includes(marker)); assert.ok(!child.stderr.includes(marker));
  }
});
