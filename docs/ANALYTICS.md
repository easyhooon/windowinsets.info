# Usage analytics (GA4)

GA4 measures visits, acquisition and explicit model interest without Firebase,
Tag Manager, a backend, session replay or an error-monitoring SDK.
The Google tag loads asynchronously only in a production build on
`windowinsets.info` or `www.windowinsets.info`, with a valid measurement ID.
Without that ID the site works normally and analytics remains disabled.

## Enable collection

1. In [Google Analytics](https://analytics.google.com/), create a GA4 property
   and a **Web** data stream for `https://windowinsets.info`. Copy its `G-…`
   measurement ID (not the numeric property or stream ID).
2. In that stream, **turn Enhanced measurement off**. The app owns page views
   and device events. In particular, automatic browser-history page views must
   be disabled; `send_page_view: false` alone does not disable them.
   Do not install a second Google tag through the hosting provider or GTM.
3. Set `VITE_GA_MEASUREMENT_ID` to the web stream's `G-…` ID in Vercel
   project Settings → Environment Variables, targeting **Production**, then
   rebuild/redeploy. For local production builds use `.env.production.local`,
   which Git ignores. Only the empty `.env.example` template belongs in Git.
   Vite embeds this public ID at build time; changes require a rebuild.
4. In Admin → Custom definitions, create **event-scoped** custom dimensions
   for `device_slug`, `device_name`, `device_series`, `form_factor`,
   `view_source`, `selection_source`, `dimension_unit`, `fold_pose`, and
   `control_source`, `support_platform`, and `link_location`. Register these
   before collecting production data; reports can take 24–48 hours to populate.
5. Open the production site and select a model. Check Realtime for `page_view`,
   `device_view`, `device_select`, `json_export`, `unit_change`, and
   `fold_pose_change`, and `support_click`. In browser Network, filter `collect`
   and inspect `en` and `ep.*`. Ad blockers can prevent collection.

## Event contract

| Event | Trigger | Parameters / interpretation |
| --- | --- | --- |
| `page_view` | Initial page and each changed pathname, including back/forward | Page location, title, previous page; ignores query/hash-only changes |
| `device_view` | A page view displaying a registered device | `device_slug`, `device_name`, `device_series`, `form_factor`, `view_source` |
| `device_select` | Device-list link click, Enter, modifier-click or middle-click | Device parameters plus `selection_source=device_list`; repeated clicks count |
| `json_export` | Export JSON click after the browser download action returns without error | Device parameters; does not confirm the file was saved to disk |
| `unit_change` | User changes the Metrics dimension unit | Device parameters plus `dimension_unit=dp` or `px`; automatic fallback to dp is excluded |
| `fold_pose_change` | User changes a foldable's display tab or pose menu, or finishes a hinge-slider adjustment | Device parameters plus `fold_pose=closed`, `partially_open`, or `open`, and `control_source=display_tab`, `pose_menu`, or `hinge_slider`; unchanged selections are excluded |
| `support_click` | User activates a Ko-fi or GitHub Sponsors link | `support_platform=ko_fi` or `github_sponsors`, `link_location=sidebar_footer` or `export_notice` (the one-time note after the first JSON export); counts an outbound click, not a completed donation |

`form_factor` is the **viewed model's** category: `bar`, `foldable-book`,
`foldable-flip`, `foldable-trifold`, or `tablet`. It is not the visitor's hardware.
`view_source=home_default` marks the model automatically shown on the homepage;
`device_page` covers direct model links and internal navigation.
Direct visits and back/forward navigation do not fabricate selection events.
Right-click → Open in new tab is counted as a view in the destination, not a
selection in the source. All registered models, including previews, are covered.
Slider drags produce one `fold_pose_change` on release rather than an event for
every intermediate angle. No precise hinge angle is sent.

## Read the results

- **Traffic:** Reports → Acquisition → Traffic acquisition for sessions and
  sources; use Users for visitors and Views for page loads/navigation.
- **Model interest:** Explore → Free form, rows `device_name`, values Event
  count and Total users, filter Event name exactly `device_select`.
- **Form-factor interest:** Same exploration with rows `form_factor`.
- **Reach including direct links:** Filter `device_view`, split by
  `view_source`. Keep homepage exposure separate from deliberate selection.
- **Interpretation:** One visitor can click repeatedly, so compare Total users
  with Event count. GA4 users are browser/device-based estimates, not a count
  of identified people. Click share is not a conversion rate or exposure-adjusted
  preference: list ordering and model availability affect it.
- **Feature use:** Filter Event name by `json_export`, `unit_change`, or
  `fold_pose_change`. Break down unit changes by `dimension_unit` and pose
  changes by `fold_pose` or `control_source`; these are actions, not unique users.
- **Support interest:** Filter Event name to `support_click`, split by
  `support_platform` and `link_location`. This counts link activations on the site; Ko-fi and GitHub Sponsors handle donation completion separately. The
  README link is outside site analytics.

## Daily Discord report

`.github/workflows/analytics-daily-report.yml` runs
`scripts/analytics-daily-report.mjs` every day at 00:07 and 00:27 UTC (09:07 primary
and 09:27 recovery in `Asia/Seoul`) and on manual dispatch. It reads yesterday's data (in the property's time zone) through
the GA4 Data API and posts one plain-text Discord message (in Korean, at the
maintainer's request, for a private channel): active/new users,
sessions, page views, total events, device selections, JSON exports and
support-link clicks split by `support_platform` (Ko-fi / GitHub Sponsors), then
activity by platform (device category), the top events, the most viewed devices
and the most viewed pages.

It also reports the current GitHub star total and the net change from the previous
KST collection day's saved total. Unstars are included because the comparison uses
repository totals, not a count of star notifications. Stars are sampled when the
report runs, separately from GA4's previous-day activity. The existing real-time
GitHub-to-Discord webhook is independent and remains unchanged.

The workflow uses the automatic `GITHUB_TOKEN` to read the repository total.
Successful samples are saved in an Actions cache; Stars collection needs no new
secret. The delivery ledger described below separately needs Contents write. Same-day manual
reruns update that day's total while preserving the previous-day baseline. The first
run, a missed previous day, or a missing/evicted cache shows the total only. An older
snapshot is never labelled as a previous-day comparison. A star lookup failure is
marked in the message without recording zero, overwriting the snapshot, or stopping
the other statistics. Cache failures also leave the other statistics running.

After this workflow change reaches `main`, its next scheduled or manually dispatched
run starts collecting star snapshots. The first successful collection establishes
the baseline; a following KST day with a saved preceding-day sample can show the net
change. A website build or hosting redeploy is not required. Both scheduled attempts
use GitHub's scheduler and can be delayed or dropped; they are not an exact delivery-time
guarantee. See [GitHub's schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

1. In Google Cloud, enable the **Google Analytics Data API**, create a service
   account and download a JSON key.
2. In GA4 Admin → Property access management, add the service account email
   with the **Viewer** role. Copy the numeric **Property ID** from Property details.
3. In Discord, open Channel settings → Integrations → Webhooks and copy a
   webhook URL.
4. Add repository secrets `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_KEY` (the
   whole JSON key) and `DISCORD_WEBHOOK_URL`, then run the workflow manually
   once from the Actions tab.

Running the preparation script without `GITHUB_OUTPUT` or `REPORT_OUTPUT_PATH`
prints a local preview and never posts to Discord. Each section queries separately;
a failing section
(for example an unregistered custom dimension) is marked in the message and
fails the run after posting. Data for the previous day can still be processing
at run time, so late events may appear in GA4 but not in the report.

### Delivery records and retries

The preparation job reads the reporting zone from GA4 response metadata and freezes
one explicit completed date for all section queries and the heading. The optional
manual `report_date` input supports a missed date without changing the current day
or Stars' separate KST collection date. Missing zone metadata stops delivery rather
than guessing the property date. A delayed trigger that first starts after the
property's midnight defaults to its new yesterday; use an explicit backfill date
to recover the older report.

All report runs on `main` share one concurrency group, retain queued runs up to
GitHub's queue limit, and do not cancel an active sender. A separate Git branch,
`analytics-report-state`, holds `.analytics/deliveries/YYYY-MM-DD.json`. Each file
has a version, report date, run ID, status, and, after confirmation, Discord message
ID. No GA4 statistics, message body, webhook URL or credentials are committed.
The branch is initialized from `main` on the first claim; Vercel deployments for
the state branch and the implementation branch are disabled in `vercel.json`.
The state files are retained in Git history rather than relying on cache retention.
Do not delete the branch or its records: an absent record authorizes a new attempt.

The workflow defaults to `contents: read`. Its `prepare` job has that read-only
token for GA4/Stars collection, cache operations and report preparation. It has
the GA4 service-account key but no Discord webhook. It passes the prepared date,
message content and partial-query flag as JSON through a job output. The sender
receives it through an environment variable, parses/validates it as data, and never
interpolates the content into shell commands. Missing or invalid output stops
before a claim or send. There are no package installation steps in either job.

Only the isolated `deliver` job overrides the token to `contents: write`. It checks
out the sender scripts and donation helpers at the workflow's exact commit, sets up Node, and performs
the claim, Discord request and receipt write. Its checkout does not persist credentials;
it has no GA4 key or Stars/cache collection. All steps/actions in this job can still
access its write token. This job isolation reduces the code given write authority,
but GitHub does not restrict Contents write to a branch or path: the token can modify
repository contents/refs and releases where repository rules permit. The code writes
only the state branch. Main was unprotected at the October 6 review. This is a remaining
repository-wide permission limit, not a state-only token.

An optional `DONATIONS_LEDGER_READ_TOKEN` gives the final sender step Contents read
on the separate private donation ledger, while its automatic token retains the
website-repo Contents write described above. The private token is not available to
preparation. When configured, the sender fetches only the reduced private ledger,
computes account-wide KST receipts in memory, and adds that section to the existing
message. It does not put financial amounts in job outputs, environment values,
artifacts, public state records or logs. Missing configuration preserves the existing
message; a failed private read displays unavailable, never zero, and marks the report
partial after delivery. Its GA4 reporting date and duplicate guard remain unchanged.
See [donation intake and owner setup](DONATIONS.md).

This permission increase uses no new PAT, database or paid service. Merging the
workflow itself changes the automatic token permission for later eligible sender jobs;
there is no separate credential activation. Review the job permission and applicable
branch rules before merging. A missing permission or failed state request stops
before sending.
Non-main dispatches are skipped. The change does not seed receipts for reports
already sent by the previous implementation. The authorized October 6 manual run
`37406226305` received webhook acceptance without saving a message ID or its exact
GA4 reporting date. `DELIVERY_NOT_BEFORE: 2026-10-07` therefore makes the new sender
skip before any state/webhook request until October 7 in `Asia/Seoul`. It permits
normal later delivery and does not invent a receipt for that legacy send. Do not
manually rerun a legacy reporting date against an empty ledger; reconcile its
existing message first. An old-code run already queued before merge cannot observe
this guard or the new ledger; check/cancel a pending legacy sender before activation
and inspect the run list afterward rather than claiming the migration is atomic.

The sender creates a durable `pending` claim using the Contents API's file SHA
before contacting Discord. Competing claims cannot both succeed. A `delivered`
record skips repeated sends, even if the earlier job failed after posting a partial
GA4 report. Discord requests enforce `wait=true` and require a returned message ID;
the safe ID is logged before the final record update.

Confirmed client rejections, including HTTP 429, are recorded as `rejected` and
permit another attempt. Honor Discord's retry interval before retrying rate limits;
configuration/authorization errors need fixing first. Timeouts, server errors,
missing message receipts, a crash with a pending claim, or failed record saving
after acceptance remain pending and block automatic reposting. Discord delivery
and a Git commit are separate operations, so this is **not exactly-once delivery**.
The conservative choice can delay a report that never arrived. Inspect the recorded
run and Discord channel: mark the record delivered with the confirmed message ID,
or rejected only after confirming there was no delivery, before retrying. The log's
message ID allows reconciliation when Discord succeeded but the Git write failed.

Validate without real credentials or network:

```sh
node --test tests/report-delivery.test.mjs tests/github-stars-report.test.mjs
```

### Free scheduled recovery and its limits

The approved primary/recovery pair is `7 0 * * *` and `27 0 * * *`: 09:07 and 09:27
in `Asia/Seoul` year-round. These UTC schedules need no timezone secret or paid
service. Each performs the normal daily preparation and checks the same dated
delivery record. The later attempt can recover an individual missing trigger,
pre-claim failure or confirmed rejection; it skips a confirmed delivered date.
It cannot automatically recover an uncertain pending claim. Do not treat job
failure alone as permission to resend.

Both triggers share GitHub's scheduler and can all be delayed/dropped during an
Actions scheduling incident. Moving away from the start of the hour reduces exposure
to the documented busy period; it does not give either trigger an arrival SLA.
Standard GitHub-hosted runners for this public repository are free under
[GitHub's Actions billing rules](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

### Independent watchdog (not implemented)

Live read-only metadata on October 6, 2026 showed the existing Vercel `windowinsets`
project on active Hobby, with no cron definitions. A Vercel daily watchdog would
provide an independent trigger: check the date's record and request a dated
`repository_dispatch` reconciliation if missing. The documented capture-inbox PAT
has Contents write, which [repository dispatch requires](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event);
direct workflow dispatch would need Actions write. Its live presence, expiry and
scope were not inspected. This option also requires a reviewed workflow event,
a protected endpoint and a dedicated `CRON_SECRET`; none is added here.

[Hobby cron](https://vercel.com/docs/cron-jobs/usage-and-pricing) is included but
each job is individually daily and may run anywhere within its scheduled hour.
Thus a 09:20 watchdog may run at 10:19. Normal function usage limits apply.
[Vercel does not automatically retry failed cron requests](https://vercel.com/docs/cron-jobs/manage-cron-jobs),
and missed/duplicate invocations are possible. Separate individually daily rescue
jobs and dated reconciliation improve coverage but cannot promise arrival by 09:30.
This option still depends on GitHub's API and runners for actual report execution.
A same-platform extra cron cannot independently detect a platform-wide missing run;
an external watchdog needs its own authenticated invocation and overdue-state check.
No independent watchdog, alert channel, new secret or hosting-plan change is
implemented. Daily confirmed arrival is the intended reliability
measure; tighter clock precision alone does not establish it.
Any later independent overdue check should dispatch only absent or confirmed-rejected
dates, skip delivered dates and surface pending dates for inspection. Its protected
endpoint, cron authentication and dispatch-token verification need separate review.

## Collection scope

No account IDs, custom user identifiers, search input, session recordings or
crash reports are sent by this integration. Custom page locations exclude query
strings and fragments, except `utm_*` campaign tags on the landing page so
shared links can be attributed; the initial referrer comes from the browser. GA4 still
uses its standard analytics cookies and browser/network metadata. Google Signals
and advertising personalization signals are disabled. This implementation does
not include a consent UI; configure the site's privacy notice and consent handling
for its deployment requirements before enabling collection where consent is needed.

Local dev and preview hostnames never load the tag, even when an ID is present.
Use a browser test with the production origin and intercepted Google requests
to validate events without sending test data. A successful local test proves
event emission, not receipt by a real GA4 property.

## References

- [Manual page views and disabling history-based automatic views](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Custom dimensions](https://support.google.com/analytics/answer/14240153)
- [Google tag configuration](https://developers.google.com/tag-platform/gtagjs/configure)
