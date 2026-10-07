// Prepares yesterday's GA4 summary without delivery credentials or Git writes.
// Env: GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_KEY (service account JSON),
// REPORT_OUTPUT_PATH and REPORT_TRANSFER_KEY (required in Actions; optional for a local preview).
// "yesterday" follows the GA4 property's reporting time zone.
import { createSign } from "node:crypto";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { collectGithubStars } from "./github-stars-report.mjs";
import { reportDateForZone } from "./report-delivery.mjs";
import { sealReport } from "./report-transport.mjs";

const { GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_KEY, REPORT_OUTPUT_PATH } = process.env;
if (!GA4_PROPERTY_ID || !GA4_SERVICE_ACCOUNT_KEY) {
  console.error("GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_KEY are required.");
  process.exit(1);
}

if ((process.env.GITHUB_ACTIONS === "true" || process.env.GITHUB_OUTPUT) && !REPORT_OUTPUT_PATH) {
  throw new Error("REPORT_OUTPUT_PATH is required in Actions; reports must not enter outputs or logs.");
}

const PLATFORM_LABELS = { desktop: "데스크톱", mobile: "모바일", tablet: "태블릿" };
const SUPPORT_LABELS = { ko_fi: "Ko-fi", github_sponsors: "GitHub Sponsors" };
const reportStartedAt = new Date();
let dateRanges = [{ startDate: "yesterday", endDate: "yesterday" }];
const QUERY_FAILED = "⚠️ 조회 실패 (워크플로 로그 확인)";

const base64url = (value) => Buffer.from(value).toString("base64url");
// Event names and paths contain underscores that Discord would read as italics.
const escape = (text) => text.replace(/([_*~`|\\])/g, "\\$1");
const number = (value) => Number(value ?? 0).toLocaleString("ko-KR");

async function accessToken() {
  const key = JSON.parse(GA4_SERVICE_ACCOUNT_KEY);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(JSON.stringify({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }))}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!response.ok) throw new Error(`Token request failed: ${response.status} ${await response.text()}`);
  return (await response.json()).access_token;
}

async function runReport(token, body) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ ...body, dateRanges }),
    },
  );
  if (!response.ok) throw new Error(`runReport failed: ${response.status} ${await response.text()}`);
  return response.json();
}

const rows = (report) =>
  (report.rows ?? []).map((row) => ({
    dimensions: (row.dimensionValues ?? []).map((v) => v.value),
    metrics: row.metricValues.map((v) => v.value),
  }));

const bullets = (items) => (items.length === 0 ? "• 데이터 없음" : items.join("\n"));

const token = await accessToken();
// Bootstrap the property's reporting zone, then freeze one explicit date for every query.
// Metadata contains the zone even when the property has no activity that day.
const calendar = await runReport(token, { dimensions: [{ name: "date" }], metrics: [{ name: "eventCount" }], limit: 1 });
const reportDate = reportDateForZone({
  now: reportStartedAt,
  timeZone: calendar.metadata?.timeZone,
  requestedDate: process.env.REPORT_DATE,
});
dateRanges = [{ startDate: reportDate, endDate: reportDate }];
const queries = {
  totals: {
    metrics: [
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "eventCount" },
    ],
  },
  platforms: {
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
  },
  events: {
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  },
  // Page titles name the device without needing registered custom dimensions;
  // the homepage's default device is excluded so this reflects visited model pages.
  devices: {
    dimensions: [{ name: "pageTitle" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          { filter: { fieldName: "eventName", stringFilter: { value: "device_view" } } },
          { notExpression: { filter: { fieldName: "pagePath", stringFilter: { value: "/" } } } },
        ],
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 5,
  },
  // Needs the registered support_platform custom dimension.
  support: {
    dimensions: [{ name: "customEvent:support_platform" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "support_click" } } },
  },
  pages: {
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 5,
  },
};

// Each query fails independently so one bad dimension does not hide the rest.
const names = Object.keys(queries);
const [settled, stars] = await Promise.all([
  Promise.allSettled(names.map((name) => runReport(token, queries[name]))),
  collectGithubStars({
    repository: process.env.GITHUB_REPOSITORY || "easyhooon/windowinsets.info",
    token: process.env.GITHUB_TOKEN,
    statePath: process.env.GITHUB_STARS_STATE_PATH || ".analytics/github-stars.json",
  }),
]);
if (stars.snapshotSaved && process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, "stars_snapshot_saved=true\n")
    .catch(() => console.error("Could not mark the GitHub stars snapshot for caching."));
}
const reports = {};
settled.forEach((result, i) => {
  if (result.status === "fulfilled") reports[names[i]] = rows(result.value);
  else console.error(`${names[i]}: ${result.reason.message}`);
});

function headerDate() {
  return new Date(`${reportDate}T00:00:00Z`)
    .toLocaleDateString("ko-KR", { month: "long", day: "numeric", timeZone: "UTC" });
}

function overview() {
  if (!reports.totals) return QUERY_FAILED;
  const [users, newUsers, sessions, views, events] = reports.totals[0]?.metrics ?? [];
  const eventCount = (name) => reports.events?.find((row) => row.dimensions[0] === name)?.metrics[0];
  return [
    `활성 사용자 **${number(users)}명** · 신규 사용자 **${number(newUsers)}명** · 세션 **${number(sessions)}회**`,
    `페이지 조회 **${number(views)}회** · 전체 이벤트 **${number(events)}건**`,
    `기기 선택 **${number(eventCount("device_select"))}회** · JSON 내보내기 **${number(eventCount("json_export"))}회**`,
    supportClicks(),
  ].join("\n");
}

// Always lists both platforms so a zero day is explicit.
function supportClicks() {
  if (!reports.support) return `후원 링크 클릭 ${QUERY_FAILED}`;
  const count = (platform) => reports.support.find((row) => row.dimensions[0] === platform)?.metrics[0];
  const parts = Object.entries(SUPPORT_LABELS).map(([platform, label]) => `${label} **${number(count(platform))}회**`);
  return `후원 링크 클릭 — ${parts.join(" · ")}`;
}

function section(title, report, format) {
  return `**${title}**\n${report ? bullets(report.map(format)) : QUERY_FAILED}`;
}

const content = [
  `📊 **WindowInsets 일일 활동 — ${headerDate()}**`,
  overview(),
  stars.line,
  "",
  section("플랫폼별 활동", reports.platforms, ({ dimensions: [category], metrics: [users, views] }) =>
    `• ${PLATFORM_LABELS[category] ?? escape(category)}: 활성 ${number(users)}명 · 페이지 조회 ${number(views)}회`),
  "",
  section("주요 이벤트", reports.events?.slice(0, 6), ({ dimensions: [name], metrics: [count] }) =>
    `• ${escape(name)}: ${number(count)}건`),
  "",
  section("많이 본 기기", reports.devices, ({ dimensions: [name], metrics: [count] }) =>
    `• ${escape(name.replace(/ Window Insets.*$/, ""))}: ${number(count)}회`),
  "",
  section("많이 본 페이지", reports.pages, ({ dimensions: [path], metrics: [count] }) =>
    `• ${escape(path)}: ${number(count)}회`),
  "_Google Analytics 전날 집계이며 추후 보정될 수 있습니다. Stars는 조회 시점의 총개수입니다._",
].join("\n");

const partial = settled.some((result) => result.status === "rejected");
const prepared = JSON.stringify({ version: 1, reportDate, content, partial });
if (REPORT_OUTPUT_PATH) {
  await mkdir(dirname(REPORT_OUTPUT_PATH), { recursive: true });
  await writeFile(REPORT_OUTPUT_PATH, `${sealReport(prepared, process.env.REPORT_TRANSFER_KEY)}\n`, { mode: 0o600 });
}
if (!REPORT_OUTPUT_PATH) {
  console.log(content);
  if (partial) process.exitCode = 1;
} else {
  // A partial report still proceeds to delivery; the isolated sender marks its job failed afterward.
  console.log(`Prepared daily report for ${reportDate}${partial ? " with failed sections" : ""}.`);
}
