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

export async function collectGithubStars({
  repository,
  statePath,
  token,
  now = new Date(),
  fetchImpl = fetch,
  log = console.error,
}) {
  let total;
  try {
    const response = await fetchImpl(`https://api.github.com/repos/${repository}`, {
      headers: {
        accept: "application/vnd.github+json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("GitHub request failed");
    total = (await response.json()).stargazers_count;
    if (!validCount(total)) throw new Error("Invalid star count");
  } catch {
    // Do not log response bodies, request headers or tokens, or save a fake zero.
    log("GitHub stars lookup failed; the rest of the daily report will continue.");
    return { line: "GitHub Stars: ⚠️ 조회 실패 (워크플로 로그 확인)", snapshotSaved: false };
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
