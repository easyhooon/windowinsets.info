// Delivery claims are durable Git files, not evictable Actions cache entries.
export function deliveryWindowOpen({ now = new Date(), notBefore } = {}) {
  if (!notBefore) return true;
  const date = new Date(`${notBefore}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(notBefore) || Number.isNaN(date.getTime())
    || date.toISOString().slice(0, 10) !== notBefore) {
    throw new Error("DELIVERY_NOT_BEFORE must be a valid KST date (YYYY-MM-DD).");
  }
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }) >= notBefore;
}

export function reportDateForZone({ now = new Date(), timeZone, requestedDate } = {}) {
  if (!timeZone) throw new Error("GA4 did not provide its reporting time zone; report date is unknown.");
  const today = now.toLocaleDateString("en-CA", { timeZone });
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  const yesterday = date.toISOString().slice(0, 10);
  if (!requestedDate) return yesterday;
  const requested = new Date(`${requestedDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
    || Number.isNaN(requested.getTime())
    || requested.toISOString().slice(0, 10) !== requestedDate
    || requestedDate >= today) {
    throw new Error("REPORT_DATE must be a valid completed date (YYYY-MM-DD) in the GA4 time zone.");
  }
  return requestedDate;
}

export function createDeliveryStore({ repository, token, fetchImpl = fetch }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? "") || !token) {
    throw new Error("GitHub repository and token are required for durable delivery records.");
  }
  const branch = "analytics-report-state";
  const root = `https://api.github.com/repos/${repository}`;
  async function api(path, method = "GET", body) {
    let response;
    try {
      response = await fetchImpl(`${root}${path}`, {
        method,
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          ...(body ? { "content-type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new Error("GitHub delivery-state request did not complete; no safe send decision is available.");
    }
    // Never include response bodies, authorization headers, or credentials in errors.
    if (!response.ok && response.status !== 404) {
      const error = new Error(`GitHub delivery-state request failed: HTTP ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    return { status: response.status, data: response.status === 404 ? null : await response.json() };
  }
  let initialized;
  function ensureBranch() {
    initialized ??= (async () => {
      if ((await api(`/git/ref/heads/${branch}`)).status !== 404) return;
      const main = await api("/git/ref/heads/main");
      if (!main.data?.object?.sha) throw new Error("Cannot initialize the report state branch from main.");
      try {
        await api("/git/refs", "POST", { ref: `refs/heads/${branch}`, sha: main.data.object.sha });
      } catch (error) {
        // Another sender may have initialized the branch first.
        if (error.status !== 422 || (await api(`/git/ref/heads/${branch}`)).status !== 200) throw error;
      }
    })();
    return initialized;
  }
  const path = date => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Invalid delivery record date.");
    return `/contents/.analytics/deliveries/${date}.json`;
  };
  return {
    async read(date) {
      const result = await api(`${path(date)}?ref=${branch}`);
      if (result.status === 404) return null;
      let record;
      try { record = JSON.parse(Buffer.from(result.data.content, "base64").toString("utf8")); }
      catch { throw new Error("The delivery record is invalid; refusing to repost."); }
      if (record.version !== 1 || record.reportDate !== date
        || !["pending", "rejected", "delivered"].includes(record.status)) {
        throw new Error("The delivery record is invalid; refusing to repost.");
      }
      return { record, sha: result.data.sha };
    },
    async write(date, record, sha) {
      await ensureBranch();
      const result = await api(path(date), "PUT", {
        branch,
        message: `chore(analytics): record ${date} delivery ${record.status}`,
        content: Buffer.from(`${JSON.stringify(record, null, 2)}\n`).toString("base64"),
        ...(sha ? { sha } : {}),
      });
      if (!result.data?.content?.sha) throw new Error("GitHub did not confirm the delivery record write.");
      return { record, sha: result.data.content.sha };
    },
  };
}

export async function deliverReport({ reportDate, payload, webhookURL, runId, store, fetchImpl = fetch, log = console.log }) {
  let url;
  try { url = new URL(webhookURL); } catch { throw new Error("Invalid Discord webhook URL."); }
  if (url.protocol !== "https:") throw new Error("The Discord webhook requires HTTPS.");
  url.searchParams.set("wait", "true");
  const previous = await store.read(reportDate);
  if (previous?.record.status === "delivered") {
    log(`Skipped already delivered daily report: ${reportDate}.`);
    return { status: "already-delivered" };
  }
  if (previous?.record.status === "pending") {
    throw new Error(`Delivery for ${reportDate} is pending or uncertain; inspect its recorded run before retrying.`);
  }
  const claim = { version: 1, reportDate, runId, status: "pending" };
  // Create/update with the observed file SHA. Only one competing claim can win.
  const saved = await store.write(reportDate, claim, previous?.sha);
  let response;
  try {
    response = await fetchImpl(url.href, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error(`Discord delivery for ${reportDate} is uncertain; the pending claim prevents automatic reposting.`);
  }
  if (!response.ok) {
    // A confirmed client rejection (including rate limiting) permits another attempt.
    // Timeouts and server errors can be ambiguous, so leave their claim pending.
    if (response.status >= 400 && response.status < 500 && response.status !== 408) {
      await store.write(reportDate, { ...claim, status: "rejected", httpStatus: response.status }, saved.sha);
      throw new Error(`Discord webhook rejected daily report: HTTP ${response.status}.`);
    }
    throw new Error(`Discord delivery for ${reportDate} is uncertain: HTTP ${response.status}; inspect before retrying.`);
  }
  let message;
  try { message = await response.json(); } catch { /* Keep the durable pending claim. */ }
  if (typeof message?.id !== "string" || !/^\d+$/.test(message.id)) {
    throw new Error(`Discord accepted ${reportDate} without a message receipt; inspect before retrying.`);
  }
  // This safe receipt is useful even when the subsequent durable write fails.
  log(`Discord confirmed daily report ${reportDate}; message ID ${message.id}.`);
  try {
    await store.write(reportDate, { ...claim, status: "delivered", messageId: message.id }, saved.sha);
  } catch {
    throw new Error(`Discord confirmed ${reportDate} (message ID ${message.id}) but its record could not be saved; inspect before retrying.`);
  }
  return { status: "delivered", messageId: message.id };
}
