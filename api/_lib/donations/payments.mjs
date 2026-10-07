import { createHash } from 'node:crypto';

export const PROVIDERS = ['kofi', 'github-sponsors'];
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fail = () => { throw new Error('Invalid payment data.'); };
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const exactKeys = (value, keys) => object(value) && Object.keys(value).sort().join(',') === [...keys].sort().join(',');
const PAYMENT_KEYS = ['key', 'deliveryKey', 'provider', 'account', 'receivedAt', 'grossAmount', 'currency', 'kind', 'evidence'];
const COVERAGE_KEYS = ['provider', 'account', 'from', 'through', 'reconciledAt', 'sourceHash'];

export function timestamp(value) {
  if (typeof value !== 'string') fail();
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) fail();
  const [, year, month, day, hour, minute, second, zone] = match;
  if (+year < 1970 || +month < 1 || +month > 12 || +day < 1 ||
      +day > new Date(Date.UTC(+year, +month, 0)).getUTCDate() ||
      +hour > 23 || +minute > 59 || +second > 59 ||
      (zone !== 'Z' && (+zone.slice(1, 3) > 23 || +zone.slice(4) > 59))) fail();
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.valueOf())) fail();
  return parsed.toISOString();
}

export function reportDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail();
  timestamp(`${value}T00:00:00Z`);
  return value;
}

export function decimal(value) {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,17})(\.\d{1,8})?$/.test(value)) fail();
  return value;
}

function positive(value) {
  decimal(value);
  if (!/[1-9]/.test(value)) fail();
  return value;
}

function account(provider, name) {
  if (!PROVIDERS.includes(provider) || name !== 'easyhooon') fail();
}

function identifier(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(value)) fail();
  return value;
}

/** Internal import contract; provider export columns are deliberately not guessed. */
export function normalizePayment(input) {
  if (!object(input)) fail();
  account(input.provider, input.account);
  if (!['donation', 'membership'].includes(input.kind) || !/^[A-Z]{3}$/.test(input.currency ?? '')) fail();
  if (!['verified-payment-export', 'provider-payment-notification'].includes(input.evidence) ||
      (input.evidence === 'provider-payment-notification' && input.provider !== 'kofi')) fail();
  const transactionId = identifier(input.transactionId);
  const deliveryId = input.deliveryId == null ? null : identifier(input.deliveryId);
  return {
    key: hash([input.provider, input.account, 'transaction', transactionId]),
    deliveryKey: deliveryId === null ? null : hash([input.provider, input.account, 'delivery', deliveryId]),
    provider: input.provider,
    account: input.account,
    receivedAt: timestamp(input.receivedAt),
    grossAmount: positive(input.grossAmount),
    currency: input.currency,
    kind: input.kind,
    evidence: input.evidence,
  };
}

/** The official Donation sample is mapped. Other provider types require a real sample. */
export function normalizeKofi(payload) {
  if (!object(payload) || payload.type !== 'Donation' || typeof payload.is_subscription_payment !== 'boolean') fail();
  return normalizePayment({
    provider: 'kofi', account: 'easyhooon',
    transactionId: payload.kofi_transaction_id, deliveryId: payload.message_id,
    receivedAt: payload.timestamp, grossAmount: payload.amount, currency: payload.currency,
    kind: payload.is_subscription_payment ? 'membership' : 'donation',
    evidence: 'provider-payment-notification',
  });
}

export function emptyLedger() { return { version: 1, payments: [], coverage: [] }; }

function validPayment(payment) {
  if (!exactKeys(payment, PAYMENT_KEYS) || !/^[a-f0-9]{64}$/.test(payment.key) ||
      !(payment.deliveryKey === null || /^[a-f0-9]{64}$/.test(payment.deliveryKey))) fail();
  account(payment.provider, payment.account);
  if (timestamp(payment.receivedAt) !== payment.receivedAt) fail();
  positive(payment.grossAmount);
  if (!/^[A-Z]{3}$/.test(payment.currency) || !['donation', 'membership'].includes(payment.kind) ||
      !['verified-payment-export', 'provider-payment-notification'].includes(payment.evidence) ||
      (payment.evidence === 'provider-payment-notification' && payment.provider !== 'kofi')) fail();
}

export function validateLedger(ledger) {
  if (!exactKeys(ledger, ['version', 'payments', 'coverage']) || ledger.version !== 1 ||
      !Array.isArray(ledger.payments) || !Array.isArray(ledger.coverage)) fail();
  const keys = new Set(), deliveries = new Set();
  for (const payment of ledger.payments) {
    validPayment(payment);
    if (keys.has(payment.key) || (payment.deliveryKey && deliveries.has(payment.deliveryKey))) fail();
    keys.add(payment.key); if (payment.deliveryKey) deliveries.add(payment.deliveryKey);
  }
  for (const coverage of ledger.coverage) {
    if (!exactKeys(coverage, COVERAGE_KEYS)) fail();
    account(coverage.provider, coverage.account);
    reportDate(coverage.from); reportDate(coverage.through); timestamp(coverage.reconciledAt);
    if (coverage.from > coverage.through || !/^[a-f0-9]{64}$/.test(coverage.sourceHash)) fail();
  }
  return ledger;
}

function equalValue(a, b) {
  // An import may enrich provenance; transaction value/time/type must agree.
  return ['provider', 'account', 'receivedAt', 'currency', 'kind'].every(key => a[key] === b[key]) &&
    sumDecimals([a.grossAmount]) === sumDecimals([b.grossAmount]);
}

export function addPayment(ledger, payment) {
  validateLedger(ledger); validPayment(payment);
  const prior = ledger.payments.find(item => item.key === payment.key);
  const delivery = payment.deliveryKey && ledger.payments.find(item => item.deliveryKey === payment.deliveryKey);
  if ((prior && !equalValue(prior, payment)) || (delivery && delivery.key !== payment.key))
    throw new Error('Conflicting payment identity.');
  if (prior) return { ledger, inserted: false };
  const updated = { ...ledger, payments: [...ledger.payments, payment] };
  validateLedger(updated);
  return { ledger: updated, inserted: true };
}

/** Called only after an owner export's status, IDs, timezone and coverage are verified. */
export function importVerifiedPayments(ledger, bundle) {
  validateLedger(ledger);
  if (!exactKeys(bundle, [...COVERAGE_KEYS, 'payments']) || !Array.isArray(bundle.payments)) fail();
  const { payments, ...coverage } = bundle;
  // A partially elapsed day cannot establish a zero-payment full calendar day.
  if (coverage.through >= dateInZone(coverage.reconciledAt)) fail();
  validateLedger({ version: 1, payments: [], coverage: [coverage] });
  let result = structuredClone(ledger);
  const importedKeys = new Set();
  for (const input of payments) {
    if (input.provider !== coverage.provider || input.account !== coverage.account || input.evidence !== 'verified-payment-export') fail();
    const payment = normalizePayment(input), day = dateInZone(payment.receivedAt);
    if (day < coverage.from || day > coverage.through) fail();
    importedKeys.add(payment.key);
    result = addPayment(result, payment).ledger;
  }
  // An export missing an already observed receipt needs investigation, not a
  // completeness assertion or silent removal (for example after a refund).
  for (const payment of result.payments) {
    const day = dateInZone(payment.receivedAt);
    if (payment.provider === coverage.provider && day >= coverage.from && day <= coverage.through && !importedKeys.has(payment.key))
      throw new Error('Export reconciliation mismatch.');
  }
  if (!result.coverage.some(item => JSON.stringify(item) === JSON.stringify(coverage))) result.coverage.push(coverage);
  return validateLedger(result);
}

/** Exact decimal arithmetic; no floats, FX conversion, fee or refund inference. */
export function sumDecimals(values) {
  if (!values.length) return '0';
  values.forEach(decimal);
  const scale = Math.max(...values.map(value => value.split('.')[1]?.length ?? 0));
  const total = values.reduce((sum, value) => {
    const [whole, fraction = ''] = value.split('.');
    return sum + BigInt(whole + fraction.padEnd(scale, '0'));
  }, 0n);
  if (!scale) return String(total);
  const digits = String(total).padStart(scale + 1, '0');
  return `${digits.slice(0, -scale)}.${digits.slice(-scale)}`.replace(/\.?0+$/, '');
}

export function dateInZone(instant, timeZone = 'Asia/Seoul') {
  const date = new Date(timestamp(instant));
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function previousKstDate(instant) {
  const date = new Date(`${dateInZone(instant)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function totals(payments) {
  return Object.fromEntries([...new Set(payments.map(payment => payment.currency))].sort().map(currency => {
    const rows = payments.filter(payment => payment.currency === currency);
    return [currency, { count: rows.length, grossAmount: sumDecimals(rows.map(payment => payment.grossAmount)) }];
  }));
}

function contiguousCoverage(coverage, through) {
  const ranges = coverage.filter(item => item.from <= through).sort((a, b) => a.from.localeCompare(b.from));
  const merged = [];
  for (const item of ranges) {
    const last = merged.at(-1);
    const next = last && new Date(`${last.through}T00:00:00Z`);
    if (next) next.setUTCDate(next.getUTCDate() + 1);
    if (last && item.from <= next.toISOString().slice(0, 10)) {
      if (item.through > last.through) last.through = item.through;
    } else merged.push({ from: item.from, through: item.through });
  }
  return merged;
}

export function aggregate(ledger, day) {
  validateLedger(ledger); reportDate(day);
  const output = { account: 'easyhooon', scope: 'account-wide', date: day, timeZone: 'Asia/Seoul', amountBasis: 'gross; fees/refunds not deducted or reconciled', providers: {} };
  for (const provider of PROVIDERS) {
    const rows = ledger.payments.filter(payment => payment.provider === provider && dateInZone(payment.receivedAt) <= day);
    const observed = rows.filter(payment => dateInZone(payment.receivedAt) === day);
    const coverage = ledger.coverage.filter(item => item.provider === provider);
    const complete = coverage.some(item => item.from <= day && item.through >= day);
    const ranges = contiguousCoverage(coverage, day);
    const range = ranges.find(item => item.from <= day && item.through >= day);
    const coveredRows = range ? rows.filter(payment => dateInZone(payment.receivedAt) >= range.from) : [];
    output.providers[provider] = {
      daily: { status: complete ? 'reconciled' : observed.length ? 'observed-incomplete' : 'unknown', count: complete ? observed.length : null, byCurrency: complete ? totals(observed) : null, observedCount: observed.length, observedByCurrency: totals(observed) },
      cumulative: range ? { status: 'covered-period', from: range.from, through: day, allTime: false, count: coveredRows.length, byCurrency: totals(coveredRows) } : { status: 'unknown', from: null, through: day, allTime: false, count: null, byCurrency: null },
      observedSince: rows.length ? dateInZone(rows.reduce((a, b) => a.receivedAt < b.receivedAt ? a : b).receivedAt) : null,
      observedCount: rows.length,
      observedByCurrency: totals(rows),
      reconciledAt: coverage.length ? coverage.map(item => item.reconciledAt).sort().at(-1) : null,
    };
  }
  return output;
}

const money = values => Object.entries(values).map(([currency, item]) => `${currency} ${item.grossAmount} (${item.count} payments)`).join(', ') || '0 payments';
export function formatAggregate(report) {
  const lines = [`Account-wide donation receipts: easyhooon · ${report.date} · Asia/Seoul`, 'Gross amounts by original currency; fees/refunds not deducted or reconciled.'];
  for (const provider of PROVIDERS) {
    const item = report.providers[provider];
    const daily = item.daily.status === 'reconciled' ? money(item.daily.byCurrency) : item.daily.observedCount ? `incomplete, observed ${money(item.daily.observedByCurrency)}` : 'unavailable';
    const cumulative = item.cumulative.status === 'covered-period' ? `${item.cumulative.from}–${item.cumulative.through}: ${money(item.cumulative.byCurrency)}` : 'unavailable';
    const captured = item.cumulative.status === 'unknown' && item.observedCount ? ` Recorded receipts since ${item.observedSince}: ${money(item.observedByCurrency)} (incomplete history).` : '';
    lines.push(`${provider}: daily ${daily}; covered-period cumulative ${cumulative}; last reconciliation ${item.reconciledAt ?? 'unavailable'}.${captured}`);
  }
  return lines.join('\n');
}
