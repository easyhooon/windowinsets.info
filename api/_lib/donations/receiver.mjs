import { createHash, timingSafeEqual } from 'node:crypto';
import { normalizeKofi, addPayment, validateLedger } from './payments.mjs';

export const MAX_BODY_BYTES = 64 * 1024;
const MAX_LEDGER_BYTES = 512 * 1024;
const response = (status, text) => new Response(text, { status, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } });
const digest = value => createHash('sha256').update(value).digest();

async function boundedBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = []; let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > MAX_BODY_BYTES) { await reader.cancel(); throw new Error('Oversized body.'); }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

/** Injectable handler: this file neither reads credentials nor starts a server. */
export function createKofiReceiver({ verificationToken, store }) {
  return async request => {
    if (request.method !== 'POST') return response(405, 'POST required.');
    if (typeof verificationToken !== 'string' || !verificationToken || !store) return response(503, 'Not configured.');
    if (new URL(request.url).search) return response(400, 'Query parameters are not accepted.');
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/x-www-form-urlencoded') return response(415, 'Form data required.');
    let raw;
    try { raw = await boundedBody(request); } catch { return response(413, 'Body too large.'); }
    let payload;
    try {
      const form = new URLSearchParams(raw);
      if (form.getAll('data').length !== 1 || [...form.keys()].some(key => key !== 'data')) throw new Error();
      payload = JSON.parse(form.get('data'));
    } catch { return response(400, 'Invalid data.'); }
    if (typeof payload?.verification_token !== 'string' || !timingSafeEqual(digest(payload.verification_token), digest(verificationToken))) return response(401, 'Unauthorized.');
    let payment;
    try { payment = normalizeKofi(payload); } catch { return response(400, 'Unsupported or invalid payment.'); }
    // Raw donor fields and tokens are never passed to storage or logged.
    try { await persistPayment(store, payment); } catch { return response(503, 'Persistence unavailable.'); }
    return response(200, 'OK');
  };
}

/** Store contract: read => {ledger, revision}; CAS => false on conflict. */
export async function persistPayment(store, payment) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { ledger, revision } = await store.read();
    const updated = addPayment(ledger, payment);
    if (!updated.inserted) return { inserted: false };
    if (await store.compareAndSwap(revision, updated.ledger)) return { inserted: true };
  }
  throw new Error('Ledger contention.');
}

/** Private GitHub Contents adapter. Only mocks were used to test this adapter. */
export function githubLedgerStore({ token, repository = 'easyhooon/windowinsets-donation-ledger', fetcher = fetch, writable = false }) {
  if (!token || repository !== 'easyhooon/windowinsets-donation-ledger') throw new Error('Invalid storage configuration.');
  const base = `https://api.github.com/repos/${repository}`;
  const path = '/contents/ledger/payments.json';
  const api = async (suffix, init = {}) => {
    const result = await fetcher(base + suffix, { ...init, redirect: 'error', signal: AbortSignal.timeout(8000), headers: {
      Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2026-03-10', 'Content-Type': 'application/json',
    } });
    return result;
  };
  const requirePrivate = async () => {
    const metadata = await api('');
    if (metadata.status !== 200) throw new Error('Private storage unavailable.');
    const repo = await metadata.json();
    if (repo.private !== true || repo.full_name !== repository || repo.default_branch !== 'main') throw new Error('Private storage required.');
  };
  return {
    async read() {
      await requirePrivate();
      const result = await api(`${path}?ref=main`);
      // Missing/inaccessible storage is never converted to an empty ledger.
      if (result.status !== 200) throw new Error('Ledger unavailable.');
      const file = await result.json();
      if (file.type !== 'file' || file.encoding !== 'base64' || file.size > MAX_LEDGER_BYTES ||
          typeof file.content !== 'string' || typeof file.sha !== 'string') throw new Error('Invalid ledger.');
      const content = Buffer.from(file.content, 'base64');
      if (content.length > MAX_LEDGER_BYTES) throw new Error('Ledger capacity reached.');
      return { ledger: validateLedger(JSON.parse(content.toString('utf8'))), revision: file.sha };
    },
    async compareAndSwap(revision, ledger) {
      if (!writable) throw new Error('Read-only storage.');
      await requirePrivate(); validateLedger(ledger);
      const content = Buffer.from(JSON.stringify(ledger));
      if (content.length > MAX_LEDGER_BYTES) throw new Error('Ledger capacity reached.');
      const result = await api(path, { method: 'PUT', body: JSON.stringify({
        branch: 'main', sha: revision, content: content.toString('base64'), message: 'chore: record payment receipt',
      }) });
      if (result.status === 409) return false;
      if (result.status !== 200) throw new Error('Ledger write unavailable.');
      return true;
    },
  };
}
