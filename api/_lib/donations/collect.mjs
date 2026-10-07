import { aggregate, formatAggregate, previousKstDate } from './payments.mjs';

/** Sender-memory section only: never write to public outputs, env, artifacts or logs. */
export async function collectDonationSection({ store, now }) {
  const day = previousKstDate(now);
  let report;
  try {
    const { ledger } = await store.read();
    report = aggregate(ledger, day);
  } catch {
    return {
      version: 1, date: day, timeZone: 'Asia/Seoul', partial: true,
      content: `Account-wide donation receipts: easyhooon · ${day} · Asia/Seoul\nPayment source unavailable; daily and cumulative totals unavailable.`,
    };
  }
  // Expected coverage gaps are explicit in the text, not failed collection.
  // Source access/schema failure above still marks the accepted report partial.
  return { version: 1, date: day, timeZone: 'Asia/Seoul', partial: false, content: formatAggregate(report) };
}

/** Preserve the existing report and its delivery date; never split into extra sends. */
export function appendDonationSection(prepared, section) {
  if (prepared?.version !== 1 || typeof prepared.content !== 'string' || typeof prepared.partial !== 'boolean' ||
      section?.version !== 1 || typeof section.content !== 'string' || typeof section.partial !== 'boolean')
    throw new Error('Invalid prepared report.');
  const joined = `${prepared.content}\n\n${section.content}`;
  if (joined.length <= 2000) return { ...prepared, content: joined, partial: prepared.partial || section.partial };
  const unavailable = `${prepared.content}\n\nDonation receipts (${section.date}, KST): unavailable; message size limit.`;
  return { ...prepared, content: unavailable.length <= 2000 ? unavailable : prepared.content, partial: true };
}
