// Builds app/data/changelog.json, a work log in the style of release notes,
// from git history so no changelog is written by hand:
//
// - Data: feat/fix commits (scope none, "data" or "devices") that touch
//   app/data/devices/<slug>/, one entry per commit with the affected devices.
// - Site: the first-parent history of the current branch (run it on main):
//   each merged pull request, titled by the PR title GitHub writes into the
//   merge commit body, and each direct feat commit (small direct fixes are
//   left out). A pull request whose
//   commits are all data entries is skipped, since those are already listed.
//   docs(guide) counts too, because the guide is a page of the site. Entries
//   must touch app/ or public/, so InsetsProbe and script work stays out.
//
// A full clone regenerates the file; a shallow clone (e.g. a deploy build)
// only adds commits it can see, keeping the committed entries.
// app/data/changelog-overrides.json may hide or reword an entry by hash.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const OUT = "app/data/changelog.json";
const OVERRIDES = "app/data/changelog-overrides.json";
const DEVICE_DIR = "app/data/devices";
const DATA_SUBJECT = /^(feat|fix)(?:\((data|devices)\))?: (.+)$/;
const SITE_SUBJECT = /^(feat|fix|docs(?=\(guide\)))(?:\(([^)]+)\))?!?: (.+)$/;
// Measurement tooling (InsetsProbe, capture scripts) is not part of the site.
const TOOLING_SCOPES = new Set(["probe", "scripts", "rdb", "rtl-scripts", "harness", "ci", "test"]);

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
const tryGit = (...args) => { try { return git(...args); } catch { return null; } };
const readJson = (path, fallback) => existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;
const sentence = text => text.charAt(0).toUpperCase() + text.slice(1);

// Folder name -> slug declared in that folder's index.ts.
const slugByFolder = Object.fromEntries(readdirSync(DEVICE_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .flatMap(entry => {
    const file = `${DEVICE_DIR}/${entry.name}/index.ts`;
    const slug = existsSync(file) && readFileSync(file, "utf8").match(/slug: "([^"]+)"/)?.[1];
    return slug ? [[entry.name, slug]] : [];
  }));

const shallow = tryGit("rev-parse", "--is-shallow-repository") !== "false";
const dataLog = tryGit("log", "--no-merges", "--format=@@%H%x09%ct%x09%cs%x09%s", "--name-only", "--", `${DEVICE_DIR}/`);
if (dataLog === null) console.warn("generate-changelog: git history unavailable; keeping the committed changelog.");

const data = (dataLog ?? "").split("@@").filter(Boolean).flatMap(block => {
  const [header, ...files] = block.trim().split("\n");
  const [hash, time, date, subject] = header.split("\t");
  const match = subject.match(DATA_SUBJECT);
  if (!match) return [];
  const devices = [...new Set(files
    .map(file => file.match(/^app\/data\/devices\/([^/]+)\//)?.[1])
    .filter(folder => folder && slugByFolder[folder])
    .map(folder => slugByFolder[folder]))].sort();
  if (!devices.length) return [];
  return [{ hash, time: Number(time), date, area: "data", kind: match[1] === "fix" ? "corrected" : "added", summary: sentence(match[3]), devices }];
});
const dataHashes = new Set(data.map(entry => entry.hash));

const siteLog = dataLog === null ? null : tryGit("log", "--first-parent", "--format=@@%H%x09%ct%x09%cs%x09%P%x09%s%n%b");
const site = (siteLog ?? "").split("@@").filter(Boolean).flatMap(block => {
  const [header, ...body] = block.trim().split("\n");
  const [hash, time, date, parents, subject] = header.split("\t");
  const [base, merged] = parents.split(" ");
  let title = subject, pr = null;
  if (merged) {
    pr = Number(subject.match(/^Merge pull request #(\d+)/)?.[1]) || null;
    title = body.find(line => line.trim())?.trim() ?? "";
    // Skip pull requests made only of data commits; they are listed one by one.
    const commits = tryGit("rev-list", "--no-merges", `${base}..${merged}`);
    if (commits === null) return [];
    const list = commits.split("\n").filter(Boolean);
    if (list.length && list.every(commit => dataHashes.has(commit))) return [];
  } else if (dataHashes.has(hash)) {
    return [];
  }
  const match = title.match(SITE_SUBJECT);
  if (!match || TOOLING_SCOPES.has(match[2])) return [];
  // Pull requests are the unit of work; outside them only features are notable, not small fixes.
  if (!merged && match[1] !== "feat") return [];
  // Only changes to the site itself: probe, scripts and docs-only work stay out.
  const files = merged ? tryGit("diff", "--name-only", `${base}...${merged}`) : tryGit("show", "--name-only", "--format=", hash);
  if (!files?.split("\n").some(file => /^(app|public)\//.test(file))) return [];
  return [{ hash, time: Number(time), date, area: "site", kind: match[1] === "fix" ? "corrected" : "added", summary: sentence(match[3]), devices: [], ...(pr ? { pr } : {}) }];
});

const found = [...data, ...site].sort((a, b) => b.time - a.time);
const committed = readJson(OUT, { entries: [] }).entries;
const byHash = new Map((shallow ? committed : []).map(entry => [entry.hash, entry]));
for (const { time, ...entry } of found) byHash.set(entry.hash, entry);

const overrides = readJson(OVERRIDES, { hide: [], summaries: {} });
// Newest first; within a day, commit time, then the committed order for unseen hashes.
const rank = entry => {
  const seen = found.findIndex(e => e.hash === entry.hash);
  return seen >= 0 ? seen : found.length + committed.findIndex(e => e.hash === entry.hash);
};
const entries = [...byHash.values()]
  .filter(entry => !overrides.hide?.includes(entry.hash))
  .map(entry => overrides.summaries?.[entry.hash] ? { ...entry, summary: overrides.summaries[entry.hash] } : entry)
  .sort((a, b) => b.date.localeCompare(a.date) || rank(a) - rank(b));

writeFileSync(OUT, `${JSON.stringify({ entries }, null, 2)}\n`);
const count = area => entries.filter(entry => (entry.area ?? "data") === area).length;
console.log(`generate-changelog: ${count("data")} data and ${count("site")} site entries${shallow ? " (shallow clone; merged with committed file)" : ""}`);
