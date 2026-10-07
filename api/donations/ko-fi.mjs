import { createKofiReceiver, githubLedgerStore } from '../_lib/donations/receiver.mjs';

/** Ko-fi payment receiver. Production-only; private persistence precedes acknowledgement. */
export async function POST(request) {
  const env = process.env;
  if (env.DONATIONS_ENABLED !== 'true' || env.VERCEL_ENV !== 'production' ||
      !env.KOFI_VERIFICATION_TOKEN || !env.DONATIONS_LEDGER_WRITE_TOKEN) {
    return new Response('Not configured.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  const store = githubLedgerStore({ token: env.DONATIONS_LEDGER_WRITE_TOKEN, writable: true });
  return createKofiReceiver({ verificationToken: env.KOFI_VERIFICATION_TOKEN, store })(request);
}
