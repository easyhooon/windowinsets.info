# Web operations: search, analytics and support setup

A record of the one-time setup that makes windowinsets.info discoverable,
measurable and fundable, written as a checklist to reuse for the next static
site. Code-level details live in the linked files; this page covers the
console steps that are not visible in the repository.

## Launch checklist

| Step | Where | Status here |
| --- | --- | --- |
| Per-page title, description, canonical, Open Graph and Twitter tags | `app/lib/seo.ts` | Done |
| Social preview image (1200×630 PNG, versioned file name) | `public/og-android-v2.png` | Done |
| Prerendered HTML for every route | `react-router.config.ts` | Done |
| `sitemap.xml` listing every public route | `app/routes/sitemap.ts` | Done |
| `robots.txt` advertising the sitemap | `public/robots.txt` | Done |
| Google Search Console domain property + sitemap | Search Console | Done 2026-10-03 |
| Bing Webmaster Tools | Bing (imported from Search Console) | Done 2026-10-03 |
| GA4 property, custom dimensions, internal-traffic filter | Google Analytics | Filter still in Testing |
| Daily analytics summary | GitHub Actions → Discord | Done |
| Funding links | `.github/FUNDING.yml`, sidebar footer, README | Done |
| AI-readable entry point | `/llms.txt` | Done |

## How search indexing works

Search engines find pages by crawling links and reading sitemaps, then decide
separately whether to index them. A new site's home page is often indexed
within days while deeper pages wait weeks.

- **Sitemap:** required in practice for a new site. Submit it once; crawlers
  re-read it on their own, so new routes do not need a new submission.
- **robots.txt:** tells crawlers what they may fetch and where the sitemap is.
  It does not by itself get anything indexed.
- **Canonical URL:** each page names its preferred URL so variants (trailing
  slashes, query strings) do not split ranking.
- **Prerendering:** crawlers and link-preview bots receive complete HTML
  without running JavaScript.
- **Indexing requests:** URL Inspection → *Request indexing* is a hint with a
  small daily quota (about 10 URLs). Use it for the most important pages only,
  not for every route.
- "Discovered – currently not indexed" on a new site usually means *not yet*,
  not an error. Check that the page returns 200, has the right canonical, has no
  `noindex` and is linked from another page, then wait.

## Google Search Console

1. Add a **Domain** property (covers `https`, `http` and all subdomains).
2. Verify with the DNS TXT record Google provides. Here DNS is hosted on
   Vercel: Project → Domains → the domain → DNS Records → type **TXT**, name
   `@`, value `google-site-verification=…`. Select TXT *before* pasting the
   value; if the form keeps validating as an A record (an "ipv4" error),
   reload the page. Keep the record afterwards — removing it unverifies the
   property.
3. Sitemaps → submit `https://<domain>/sitemap.xml`. Status should become
   *Success* with the expected URL count.
4. Request indexing for the home page and a handful of key pages.
5. Revisit Pages and Performance after about a week.

## Bing Webmaster Tools

Sign in and choose **Import from Google Search Console**. It copies the
verified site and sitemap, which also covers DuckDuckGo and other Bing-backed
engines.

## Google Analytics 4

Setup, event contract and reading the results are in
[Analytics](ANALYTICS.md). The console-side steps:

- **Measurement ID:** `VITE_GA_MEASUREMENT_ID` in Vercel → Settings →
  Environment Variables (Production), then redeploy. Vite embeds it at build
  time.
- **Enhanced measurement off** in the web stream, because the app sends its
  own page views.
- **Custom dimensions:** event-scoped parameters are invisible in reports until
  registered in Admin → Custom definitions. They can also be created with the
  Admin API (`properties/<id>/customDimensions`) using a service account that
  temporarily has the Editor role; drop it back to Viewer afterwards.
- **Internal traffic filter:** Admin → Data streams → the stream → Configure
  tag settings → Define internal traffic. Use match type *IP address equals*
  (or CIDR with `/32`); a plain IP under the CIDR match type is rejected. Then
  Admin → Data filters → the "Internal Traffic" filter. Leave it in
  **Testing**, confirm visits appear under the *Test data filter name*
  dimension, and only then switch it to **Active**: an active filter drops
  data permanently. A home IP can change, so recheck if it stops matching.
- **Service accounts:** keep the reporting account at Viewer. Grant access at
  the property, not the account, so it can be removed there. Delete local JSON
  key files once they are stored as CI secrets.

## Daily report to Discord

`.github/workflows/analytics-daily-report.yml` calls the GA4 Data API with a
service account and posts to a Discord webhook. Secrets: `GA4_PROPERTY_ID`,
`GA4_SERVICE_ACCOUNT_KEY`, `DISCORD_WEBHOOK_URL`. Never commit the key or the
webhook URL. Details in [Analytics](ANALYTICS.md#daily-discord-report).

## Funding

- **Ko-fi:** create a page, then link it from the site and README.
- **GitHub Sponsors:** apply at github.com/sponsors. The application needs a
  Stripe Connect payout account (bank details, tax form) and a manual review. Once the profile is public, add `github: <user>` to
  `.github/FUNDING.yml`; the repository then shows a **Sponsor** button that
  lists every platform in that file.
- Keep on-site prompts low-key: one footer row, plus at most a one-time,
  dismissible note after a useful action. Track clicks per platform
  (`support_click` with `support_platform`).

## Discoverability outside search

- GitHub repository description, website URL and topics.
- Newsletters and communities: see the promotion notes kept by the maintainer.
  Resubmit with a write-up when there is real news rather than reposting the
  same link.
