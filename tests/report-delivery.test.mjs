import test from "node:test";
import assert from "node:assert/strict";
import { createDeliveryStore, deliverReport, deliveryWindowOpen, reportDateForZone } from "../scripts/report-delivery.mjs";

test("the legacy-send cutover opens at KST midnight and leaves unconfigured callers unchanged", () => {
  assert.equal(deliveryWindowOpen({ now: new Date("2026-10-06T14:59:59Z"), notBefore: "2026-10-07" }), false);
  assert.equal(deliveryWindowOpen({ now: new Date("2026-10-06T15:00:00Z"), notBefore: "2026-10-07" }), true);
  assert.equal(deliveryWindowOpen({ now: new Date("2026-10-07T00:07:00Z"), notBefore: "2026-10-07" }), true);
  assert.equal(deliveryWindowOpen({ now: new Date("2026-10-06T00:00:00Z") }), true);
});

test("an invalid delivery cutover fails closed", () => {
  for (const notBefore of ["2026-02-30", "not-a-date"]) {
    assert.throws(() => deliveryWindowOpen({ notBefore }), /valid KST date/);
  }
});

const reportDate = "2026-10-05";
const json = (status, data = {}) => new Response(JSON.stringify(data), { status });

// Model the Contents API's optimistic concurrency, shared across independent senders.
function server({ webhookStatus = 200, failStatusSave, initialRecord, failRead = false } = {}) {
  let revision = 0, branch = false, posts = 0, current;
  const logs = [], requests = [];
  if (initialRecord) { branch = true; current = { record: initialRecord, sha: "initial" }; }
  const fetchImpl = async (url, options = {}) => {
    requests.push({ url, method: options.method ?? "GET" });
    const parsed = new URL(url);
    if (parsed.hostname === "discord.example.invalid") {
      posts++;
      assert.equal(parsed.searchParams.get("wait"), "true");
      assert.equal(parsed.searchParams.get("thread_id"), "123");
      return json(webhookStatus, { id: "1234567890", content: "private report" });
    }
    const path = parsed.pathname;
    if (path.endsWith("/git/ref/heads/analytics-report-state")) return json(branch ? 200 : 404, { object: { sha: "head" } });
    if (path.endsWith("/git/ref/heads/main")) return json(200, { object: { sha: "main" } });
    if (path.endsWith("/git/refs")) {
      if (branch) return json(422);
      branch = true; return json(201, { object: { sha: "main" } });
    }
    assert.ok(path.endsWith(`/.analytics/deliveries/${reportDate}.json`), path);
    if (options.method !== "PUT") {
      if (failRead) return json(typeof failRead === "number" ? failRead : 503);
      return current ? json(200, { content: Buffer.from(JSON.stringify(current.record)).toString("base64"), sha: current.sha }) : json(404);
    }
    const body = JSON.parse(options.body);
    assert.equal(body.branch, "analytics-report-state");
    const record = JSON.parse(Buffer.from(body.content, "base64").toString("utf8"));
    if (record.status === failStatusSave) return json(503);
    if (current ? body.sha !== current.sha : body.sha !== undefined) return json(409);
    current = { record, sha: `revision-${++revision}` };
    return json(201, { content: { sha: current.sha } });
  };
  const send = (runId = "1", overrides = {}) => deliverReport({
    reportDate,
    payload: { content: "private report", allowed_mentions: { parse: [] } },
    webhookURL: "https://discord.example.invalid/private-hook?wait=false&thread_id=123",
    runId,
    store: createDeliveryStore({ repository: "owner/repo", token: "test-token", fetchImpl }),
    fetchImpl, log: message => logs.push(message), ...overrides,
  });
  return { send, fetchImpl, logs, requests, posts: () => posts, record: () => current?.record };
}

test("same-date repeats post once and preserve the confirmed message receipt", async () => {
  const s = server();
  assert.deepEqual(await s.send(), { status: "delivered", messageId: "1234567890" });
  assert.deepEqual(await s.send("2"), { status: "already-delivered" });
  assert.equal(s.posts(), 1);
  assert.deepEqual(s.record(), { version: 1, reportDate, runId: "1", status: "delivered", messageId: "1234567890" });
  assert.ok(!JSON.stringify(s.record()).includes("private"));
});

test("independent concurrent senders cannot both acquire the date claim", async () => {
  const s = server();
  const result = await Promise.allSettled([s.send("1"), s.send("2")]);
  assert.equal(result.filter(r => r.status === "fulfilled").length, 1);
  assert.equal(s.posts(), 1);
  assert.equal(s.record().status, "delivered");
});

test("confirmed webhook rejection records a safe retry instead of a delivery", async () => {
  const s = server({ webhookStatus: 429 });
  await assert.rejects(s.send(), /rejected.*429/);
  assert.equal(s.record().status, "rejected");
  await assert.rejects(s.send("2"), /rejected.*429/);
  assert.equal(s.posts(), 2);
  assert.equal(s.record().runId, "2");
});

test("accepted webhook with failed state save leaves a durable pending claim and blocks reposting", async () => {
  const s = server({ failStatusSave: "delivered" });
  await assert.rejects(s.send(), /confirmed.*1234567890.*could not be saved/);
  assert.equal(s.record().status, "pending");
  assert.match(s.logs[0], /message ID 1234567890/);
  await assert.rejects(s.send("2"), /pending or uncertain/);
  assert.equal(s.posts(), 1);
});

test("a failed claim write never attempts a webhook request", async () => {
  const s = server({ failStatusSave: "pending" });
  await assert.rejects(s.send(), /delivery-state.*503/);
  assert.equal(s.posts(), 0);
});

test("state read failure fails closed before any send", async () => {
  const s = server({ failRead: true });
  await assert.rejects(s.send(), /delivery-state.*503/);
  assert.equal(s.posts(), 0);
});

test("missing state permissions fail closed without printing authorization values", async () => {
  const s = server({ failRead: 403 });
  await assert.rejects(s.send(), error => {
    assert.match(error.message, /delivery-state.*403/);
    assert.ok(!error.message.includes("test-token"));
    return true;
  });
  assert.equal(s.posts(), 0);
});

test("malformed webhook configuration fails before acquiring a pending claim", async () => {
  const s = server();
  await assert.rejects(s.send("1", { webhookURL: "private-hook" }), /Invalid Discord webhook URL/);
  assert.equal(s.record(), undefined);
  assert.equal(s.posts(), 0);
});

for (const status of [408, 500, 503]) {
  test(`ambiguous webhook HTTP ${status} blocks automatic retry`, async () => {
    const s = server({ webhookStatus: status });
    await assert.rejects(s.send(), /uncertain/);
    await assert.rejects(s.send("2"), /pending or uncertain/);
    assert.equal(s.posts(), 1);
  });
}

test("a lost response does not expose a webhook URL or token and blocks retry", async () => {
  const s = server();
  await assert.rejects(s.send("1", { fetchImpl: async () => { throw new Error("private-hook test-token"); } }), error => {
    assert.match(error.message, /uncertain/);
    assert.ok(!error.message.includes("private-hook") && !error.message.includes("test-token"));
    return true;
  });
  await assert.rejects(s.send("2"), /pending or uncertain/);
});

test("success without a valid Discord message receipt remains uncertain", async () => {
  const s = server();
  await assert.rejects(s.send("1", { fetchImpl: async () => json(200, {}) }), /without a message receipt/);
  assert.equal(s.record().status, "pending");
  await assert.rejects(s.send("2"), /pending or uncertain/);
});

test("invalid or wrong-date durable records cannot authorize a repost", async () => {
  for (const initialRecord of [{ version: 1, reportDate: "2026-10-04", status: "delivered" }, { version: 1, reportDate, status: "bogus" }]) {
    const s = server({ initialRecord });
    await assert.rejects(s.send(), /record is invalid/);
    assert.equal(s.posts(), 0);
  }
});

test("report date uses the GA4 zone across KST midnight, year end and DST", () => {
  const cases = [
    ["2026-10-05T14:59:59Z", "Asia/Seoul", "2026-10-04"],
    ["2026-10-05T15:00:00Z", "Asia/Seoul", "2026-10-05"],
    ["2026-10-05T15:00:00Z", "America/Los_Angeles", "2026-10-04"],
    ["2026-12-31T15:00:00Z", "Asia/Seoul", "2026-12-31"],
    ["2026-03-09T04:15:00Z", "America/New_York", "2026-03-08"],
  ];
  for (const [now, timeZone, expected] of cases) assert.equal(reportDateForZone({ now: new Date(now), timeZone }), expected);
});

test("explicit backfill date stays fixed and rejects incomplete or invalid dates", () => {
  const options = { now: new Date("2026-10-05T15:00:00Z"), timeZone: "Asia/Seoul" };
  assert.equal(reportDateForZone({ ...options, requestedDate: reportDate }), reportDate);
  for (const requestedDate of ["2026-10-06", "2026-10-07", "2026-02-30", "../bad", "2026-99-99"]) {
    assert.throws(() => reportDateForZone({ ...options, requestedDate }));
  }
  assert.throws(() => reportDateForZone({ now: options.now }), /time zone/);
});
