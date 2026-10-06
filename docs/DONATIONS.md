# Private Ko-fi receipt intake

The approved reporting scope is the `easyhooon` account's donations and recurring
support in the existing Discord statistics channel. Original-currency gross amounts
and payment counts are separate from support-link clicks, sponsor relationships,
fees, refunds, net income and bank payouts. No donor names, email, messages or
addresses are retained. GitHub Sponsors daily payment data remains unavailable
without verified transaction exports; its lifetime USD aggregate is not substituted.

## Owner setup: the next action

The implementation is disabled until the owner supplies credentials through the
service dashboards. Never paste a token into chat, an issue, a commit or a screenshot.

1. Open [GitHub fine-grained tokens](https://github.com/settings/personal-access-tokens/new).
   Create a writer and a separate reader, each selecting **only** the private repo
   `easyhooon/windowinsets-donation-ledger`. Writer: **Contents Read and write**;
   reader: **Contents Read-only**. Metadata read is implicit. No Workflows, account
   financial, repository administration or website-repo permissions. Set an expiry
   and retain its renewal date. Contents write covers all files in this private repo,
   not only the ledger path. The agent does not generate, receive or configure these
   new sensitive credentials.
2. Open [Vercel project environment settings](https://vercel.com/easyhooons-projects/windowinsets/settings/environment-variables).
   Add the writer as `DONATIONS_LEDGER_WRITE_TOKEN`, for **Production only**, using
   Vercel's sensitive-secret control. At [Ko-fi webhook settings](https://ko-fi.com/manage/webhooks),
   copy the verification token directly into Vercel as `KOFI_VERIFICATION_TOKEN`,
   also **Production only**. Do not reuse the capture-upload key or its broader token.
3. Add the reader as `DONATIONS_LEDGER_READ_TOKEN` in the website repo's
   [Actions secrets](https://github.com/easyhooon/windowinsets.info/settings/secrets/actions).
   This makes later eligible senders collect the reduced private ledger. Leave it
   absent until the source/setup checks below are complete if the section should
   remain hidden. The writer never enters Actions.
4. Before activation, inspect the Ko-fi webhook settings' payload example or one
   existing actual notification. Supply only the non-sensitive field names and
   values for `type`, `is_subscription_payment`, `timestamp`, `currency`, and the
   **shape** of `amount`, `message_id`, `kofi_transaction_id`; replace IDs/amounts
   with consistent fictional values and remove token, people, messages and addresses.
   The adapter supports the documented `Donation` example, with its subscription
   boolean. If actual recurring support uses a different type, add its verified
   mapping before enabling intake. Shop/commission sales are outside this contract.
   Do not send a test payment/charge or point real data at a public webhook viewer.
5. After the reviewed code is on main and its production route is verified, add
   non-secret `DONATIONS_ENABLED=true` in Vercel **Production** and redeploy through
   the project's normal mechanism. Secret changes apply to new deployments; do not
   assume a running deployment has them. Register
   `https://windowinsets.info/api/donations/ko-fi` in Ko-fi only after this step.
   Preserve or deliberately coordinate any existing webhook consumer; its current
   configuration has not been inspected. No extra Discord test/send is required.

The private repo's `main` branch is initialized with
`ledger/payments.json` containing `{ "version": 1, "payments": [], "coverage": [] }`.
This means history is **unknown**, not zero receipts. Creation/initialization evidence
is recorded separately from this code PR; verify private visibility before placing
any real payment data there. No Vercel Git integration or private-repo Actions needed.

For historical coverage, the smallest additional owner action is a redacted
**Payments & Orders CSV** from Ko-fi. Keep original column headers, timestamp/timezone,
payment type/status, amount/currency and refund/fee markers; remove donor fields and
secrets. Its parser is deliberately pending real schema verification. A normalized,
verified export can use `importVerifiedPayments`; raw exports stay with the owner and
never become public artifacts. GitHub's monthly transaction exports need the same
verification before any GitHub daily count or amount can be reported.

## Runtime and privacy

`api/donations/ko-fi.mjs` is a production-only Node endpoint on the existing Vercel
project. A missing enable flag, non-production deployment or missing credentials
returns 503 before reading state. The receiver requires a form-encoded `data` JSON
body, compares the configured verification token in constant time, validates supported
payment fields, and writes the private ledger before returning HTTP 200. Bodies are
stream-limited to 64 KiB. Responses and errors never echo provider data or credentials.

Only provider/account, hashed transaction/delivery IDs, received time, payment kind,
currency, exact amount and evidence are retained. A replayed transaction is counted
once, including a different message ID or overlapping export. Reused identities with
different values are rejected. Concurrent requests use the file SHA with reread/retry;
failure or ambiguous acknowledgement returns 503. A provider retry discovers a saved
receipt and deduplicates. Ko-fi retries are finite, so storage outages still need
export reconciliation. No raw request, donor field, credential or free-text message
is logged or committed. A 512 KiB ledger limit fails closed rather than discarding data;
review retention/sharding before reaching it.

The store pins the private repo and `main`, verifies visibility before reads/writes,
and requires the initialized ledger to exist. Missing access/files and malformed
ledgers are errors, never empty datasets. Keep the repo private: making it public
would expose its history even after deleting current records.

The daily sender optionally reads the ledger using a separate read-only PAT. Its
automatic token still has website-repo Contents write for the existing delivery guard;
the final step now has these two scoped credentials. Trusted actions/code in that job
can use credentials according to their exposure. Preparation has neither the private
read token nor amount data. Aggregates are computed only in sender memory and sent
in the existing message; never put them in `GITHUB_OUTPUT`, job outputs, printed env,
public artifacts, a state file or logs. The current preparation JSON contains only
GA4/Stars metrics. No separate donation notification is created.

The original main-only guard, approved 09:07/09:27 KST schedule, October 6 cutover,
serialization, report-date claim and confirmed Discord receipt remain unchanged.
Without the reader secret the existing message is unchanged. A failed donation read
adds unavailable and marks partial after delivery, leaving GA4/Stars arrival operational.
Recovery sees the existing receipt and skips even if the first partial run failed.
Oversized donation text becomes a size-limit note or is omitted from an already almost
full base message, marking partial; amounts are never truncated or split into another
send. A base message already over Discord's 2,000-character limit is an existing issue.
Expected unreconciled history is labeled incomplete/unavailable in the message without
turning a successful collection into a failed job. Actual source errors and an already
partial GA4 report still retain the failure flag after receipt persistence.

## Amount, dates and coverage

Amounts use exact decimal/BigInt arithmetic, positive decimal strings, original
three-letter currencies and no FX conversion. Unlike currencies are never added.
Timestamps require a timezone and valid calendar fields and normalize to UTC. Donation
days use `Asia/Seoul`, previous completed day at sender collection; that date is
explicit even if the GA4 property uses a different day. No settled-bank-payout claim
is inferred from a Ko-fi payment notification.

Webhook-only receipts are **observed, incomplete**. Empty unreconciled history is
**unavailable**. Only a verified full export for a fully elapsed KST day can establish
zero payments or complete payment counts. Imports are atomic, deduplicate receipts,
reject value conflicts, and reject completeness if an already observed payment is
absent from the export. This requires investigating possible refunds or export
filtering instead of silently deleting a receipt. Covered-period cumulative totals
include a contiguous verified date range, never an all-time claim; a coverage gap
starts a new range. Observed cumulative receipts are explicitly incomplete history.

Gross amounts do not deduct or reconcile fees/refunds. The ledger is a receipt register,
not an accounting balance or tax/net-income calculation. Automatic refund and fee
reconciliation would need separately verified provider/processor sources and scope.

## Validation and sources

```sh
node --test tests/donations.test.mjs tests/report-delivery.test.mjs tests/github-stars-report.test.mjs
```

Tests use synthetic fixtures and mocked requests, including privacy, concurrent writes,
retries after lost acknowledgement, exact currency values, KST day boundaries, missing
versus zero, export coverage and report delivery regression. No real payment, production
webhook or Discord test is performed. Deployment remains gated on owner secret handoff
and actual-source validation.

- [Ko-fi payment notifications and finite retries](https://help.ko-fi.com/hc/en-us/articles/360004162298-Does-Ko-fi-have-an-API-or-webhook)
- [Ko-fi Payments & Orders exports](https://help.ko-fi.com/hc/en-us/articles/10792069957661-How-tax-works-on-Ko-fi)
- [GitHub transaction exports](https://docs.github.com/en/sponsors/receiving-sponsorships-through-github-sponsors/viewing-your-sponsors-and-sponsorships)
- [GitHub Contents scopes and SHA updates](https://docs.github.com/en/rest/repos/contents)
- [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Vercel environment variable deployment scope](https://vercel.com/docs/environment-variables)
- [Discord webhook content limit](https://docs.discord.com/developers/resources/webhook#execute-webhook)

No paid database or plan upgrade is proposed. GitHub Free includes private repos;
the ledger uses no private runner, while the public report retains its standard runner.
The existing Vercel Hobby included usage can pause at limits; unlimited availability
is not promised. Donation-only scope follows the documented donation exception;
shop/commission processing is not included. See [GitHub plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans),
[Hobby limits](https://vercel.com/docs/plans/hobby), and [fair use](https://vercel.com/docs/limits/fair-use-guidelines).
