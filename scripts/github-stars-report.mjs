import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const validCount = (value) => Number.isSafeInteger(value) && value >= 0;
const number = (value) => value.toLocaleString("ko-KR");

// Stars are sampled on the collection day in KST, separately from GA4's yesterday.
export function snapshotDates(now) {
  const today = now.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const previous = new Date(`${today}T00:00:00Z`);
  previous.setUTCDate(previous.getUTCDate() - 1);
  return { today, yesterday: previous.toISOString().slice(0, 10) };
}

// Short waits for transient GitHub failures; the job timeout is 5 minutes.
const RETRY_DELAYS_MS = [1_000, 3_000];
const DIAGNOSTIC_HEADERS = ["x-ratelimit-remaining", "x-ratelimit-resource", "retry-after", "x-github-request-id"];

class LookupError extends Error {
  constructor(detail, retryable) {
    super(detail);
    this.retryable = retryable;
  }
}

// Status and selected headers only: never response bodies, request headers or tokens.
function describeResponse(response) {
  const headers = DIAGNOSTIC_HEADERS
    .map((name) => [name, response.headers?.get?.(name)])
    .filter(([, value]) => value != null)
    .map(([name, value]) => `${name}=${value}`);
  return [`HTTP ${response.status}`, ...headers].join(" ");
}

// Network errors and timeouts: name and cause code only, since messages can echo request data.
function describeError(error) {
  const code = error?.cause?.code ? ` (${error.cause.code})` : "";
  return `${error?.name ?? "Error"}${code}`;
}

function isRetryableStatus(response) {
  if (response.status >= 500 || response.status === 429) return true;
  return response.status === 403 && (
    response.headers?.get?.("x-ratelimit-remaining") === "0" || response.headers?.get?.("retry-after") != null
  );
}

async function fetchStarCount({ repository, token, fetchImpl }) {
  let response;
  try {
    response = await fetchImpl(`https://api.github.com/repos/${repository}`, {
      headers: {
        accept: "application/vnd.github+json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new LookupError(describeError(error), true);
  }
  if (!response.ok) throw new LookupError(describeResponse(response), isRetryableStatus(response));
  let body;
  try {
    body = await response.json();
  } catch (error) {
    // The request timeout also covers the body, so a stalled body is not a parse error.
    throw new LookupError(error instanceof SyntaxError ? "invalid JSON response" : `${describeError(error)} while reading body`, true);
  }
  if (!validCount(body?.stargazers_count)) throw new LookupError("invalid star count", false);
  return body.stargazers_count;
}

export async function collectGithubStars({
  repository,
  statePath,
  token,
  now = new Date(),
  fetchImpl = fetch,
  log = console.error,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  retryDelaysMs = RETRY_DELAYS_MS,
}) {
  let total;
  for (let attempt = 0; total === undefined; attempt += 1) {
    try {
      total = await fetchStarCount({ repository, token, fetchImpl });
    } catch (error) {
      const detail = error instanceof LookupError ? error.message : (error?.name ?? "Error");
      const retryable = error instanceof LookupError && error.retryable;
      if (retryable && attempt < retryDelaysMs.length) {
        log(`GitHub stars lookup attempt ${attempt + 1} failed: ${detail}; retrying.`);
        await sleep(retryDelaysMs[attempt]);
        continue;
      }
      // Do not save a fake zero; the rest of the report still goes out.
      log(`GitHub stars lookup failed after ${attempt + 1} attempt(s): ${detail}; the rest of the daily report will continue.`);
      return { line: "GitHub Stars: ⚠️ 조회 실패 (워크플로 로그 확인)", snapshotSaved: false };
    }
  }

  const { today, yesterday } = snapshotDates(now);
  let previous;
  try {
    const state = JSON.parse(await readFile(statePath, "utf8"));
    if (state.repository === repository && validCount(state.snapshots?.[yesterday])) {
      previous = state.snapshots[yesterday];
    }
  } catch (error) {
    if (error.code !== "ENOENT") log("GitHub stars snapshot could not be read; no daily change will be shown.");
  }

  const delta = previous === undefined ? undefined : total - previous;
  const line = `GitHub Stars: 총 **${number(total)}개**${delta === undefined
    ? ""
    : ` · 전일 대비 **${delta > 0 ? "+" : ""}${number(delta)}**`}`;
  // Retain yesterday so a manual rerun on the same day keeps the daily baseline.
  const snapshots = { ...(previous === undefined ? {} : { [yesterday]: previous }), [today]: total };
  try {
    await mkdir(dirname(statePath), { recursive: true });
    await writeFile(statePath, `${JSON.stringify({ repository, snapshots }, null, 2)}\n`);
    return { line, snapshotSaved: true };
  } catch {
    log("GitHub stars snapshot could not be saved; the rest of the daily report will continue.");
    return { line, snapshotSaved: false };
  }
}
