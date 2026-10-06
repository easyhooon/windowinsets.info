// The isolated sender accepts data-only JSON and needs no GA4 key or dependencies.
import { readFile } from "node:fs/promises";
import { createDeliveryStore, deliverReport } from "./report-delivery.mjs";

const { REPORT_JSON, REPORT_INPUT_PATH, DISCORD_WEBHOOK_URL } = process.env;
if ((!REPORT_JSON && !REPORT_INPUT_PATH) || !DISCORD_WEBHOOK_URL) {
  throw new Error("A prepared report and DISCORD_WEBHOOK_URL are required for delivery.");
}
let report;
try { report = JSON.parse(REPORT_JSON || await readFile(REPORT_INPUT_PATH, "utf8")); }
catch { throw new Error("The prepared daily report could not be read."); }
const date = new Date(`${report?.reportDate}T00:00:00Z`);
if (report?.version !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(report.reportDate)
  || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== report.reportDate
  || typeof report.content !== "string" || !report.content
  || typeof report.partial !== "boolean") {
  throw new Error("The prepared daily report is invalid; refusing delivery.");
}
await deliverReport({
  reportDate: report.reportDate,
  webhookURL: DISCORD_WEBHOOK_URL,
  runId: process.env.GITHUB_RUN_ID ?? "local",
  store: createDeliveryStore({
    repository: process.env.GITHUB_REPOSITORY || "easyhooon/windowinsets.info",
    token: process.env.GITHUB_TOKEN,
  }),
  payload: {
    username: "WindowInsets Stats",
    avatar_url: "https://windowinsets.info/apple-touch-icon-v2.png",
    content: report.content,
    allowed_mentions: { parse: [] },
  },
});
if (report.partial) process.exitCode = 1;
