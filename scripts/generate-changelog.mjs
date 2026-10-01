// Builds app/data/changelog.json from data commits: feat/fix commits (scope
// none, "data" or "devices") that touch app/data/devices/<slug>/. Entries keep
// the commit subject, so no hand-written changelog is needed.
//
// A full clone regenerates the file; a shallow clone (e.g. a deploy build)
// only adds commits it can see, keeping the committed entries.
// app/data/changelog-overrides.json may hide or reword an entry by hash.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const OUT = "app/data/changelog.json";
const OVERRIDES = "app/data/changelog-overrides.json";
const DEVICE_DIR = "app/data/devices";
const SUBJECT = /^(feat|fix)(?:\((data|devices)\))?: (.+)$/;

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
const readJson = (path, fallback) => existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;

// Folder name -> slug declared in that folder's index.ts.
const slugByFolder = Object.fromEntries(readdirSync(DEVICE_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .flatMap(entry => {
    const file = `${DEVICE_DIR}/${entry.name}/index.ts`;
    const slug = existsSync(file) && readFileSync(file, "utf8").match(/slug: "([^"]+)"/)?.[1];
    return slug ? [[entry.name, slug]] : [];
  }));

let log = "";
try {
  log = git("log", "--no-merges", "--format=@@%H%x09%cs%x09%s", "--name-only", "--", `${DEVICE_DIR}/`);
} catch {
  console.warn("generate-changelog: git history unavailable; keeping the committed changelog.");
}
const shallow = (() => { try { return git("rev-parse", "--is-shallow-repository") === "true"; } catch { return true; } })();

const found = log.split("@@").filter(Boolean).flatMap(block => {
  const [header, ...files] = block.trim().split("\n");
  const [hash, date, subject] = header.split("\t");
  const match = subject.match(SUBJECT);
  if (!match) return [];
  const devices = [...new Set(files
    .map(file => file.match(/^app\/data\/devices\/([^/]+)\//)?.[1])
    .filter(folder => folder && slugByFolder[folder])
    .map(folder => slugByFolder[folder]))].sort();
  if (!devices.length) return [];
  const summary = match[3].charAt(0).toUpperCase() + match[3].slice(1);
  return [{ hash, date, kind: match[1] === "fix" ? "corrected" : "added", summary, devices }];
});

const committed = readJson(OUT, { entries: [] }).entries;
const byHash = new Map((shallow ? committed : []).map(entry => [entry.hash, entry]));
for (const entry of found) byHash.set(entry.hash, entry);

const overrides = readJson(OVERRIDES, { hide: [], summaries: {} });
// Newest first; within a day, git's order, then the committed order for unseen hashes.
const rank = entry => {
  const seen = found.findIndex(e => e.hash === entry.hash);
  return seen >= 0 ? seen : found.length + committed.findIndex(e => e.hash === entry.hash);
};
const entries = [...byHash.values()]
  .filter(entry => !overrides.hide?.includes(entry.hash))
  .map(entry => overrides.summaries?.[entry.hash] ? { ...entry, summary: overrides.summaries[entry.hash] } : entry)
  .sort((a, b) => b.date.localeCompare(a.date) || rank(a) - rank(b));

writeFileSync(OUT, `${JSON.stringify({ entries }, null, 2)}\n`);
console.log(`generate-changelog: ${entries.length} entries${shallow ? " (shallow clone; merged with committed file)" : ""}`);
