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
| `support_click` | User activates a Ko-fi link | `support_platform=ko_fi`, `link_location=sidebar_footer` or `export_notice` (the one-time note after the first JSON export); counts an outbound click, not a completed donation |

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
  `link_location`. This counts link activations on the site; Ko-fi handles donation completion separately. The
  README link is outside site analytics.

## Daily Discord report

`.github/workflows/analytics-daily-report.yml` runs
`scripts/analytics-daily-report.mjs` every day at 00:00 UTC (09:00 KST) and on
manual dispatch. It reads yesterday's data (in the property's time zone) through
the GA4 Data API and posts one plain-text Discord message (in Korean, at the
maintainer's request, for a private channel): active/new users,
sessions, page views, total events, device selections and JSON exports, then
activity by platform (device category), the top events, the most viewed devices
and the most viewed pages.

1. In Google Cloud, enable the **Google Analytics Data API**, create a service
   account and download a JSON key.
2. In GA4 Admin → Property access management, add the service account email
   with the **Viewer** role. Copy the numeric **Property ID** from Property details.
3. In Discord, open Channel settings → Integrations → Webhooks and copy a
   webhook URL.
4. Add repository secrets `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_KEY` (the
   whole JSON key) and `DISCORD_WEBHOOK_URL`, then run the workflow manually
   once from the Actions tab.

Without `DISCORD_WEBHOOK_URL` the script prints the payload instead, which is
useful for a local dry run. Each section queries separately; a failing section
(for example an unregistered custom dimension) is marked in the message and
fails the run after posting. Data for the previous day can still be processing
at run time, so late events may appear in GA4 but not in the report.

## Collection scope

No account IDs, custom user identifiers, search input, session recordings or
crash reports are sent by this integration. Custom page locations exclude query
strings and fragments; the initial referrer comes from the browser. GA4 still
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
