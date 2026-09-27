/**
 * Capture inbox: InsetsProbe uploads land on one rolling `capture-inbox` branch,
 * one commit per upload, reviewed through a single long-lived PR into main.
 * Nothing here edits or derives measurement values; files are stored as uploaded.
 */

export const INBOX_BRANCH = "capture-inbox";
export const INBOX_DIR = "measurements/_inbox";
export const MAX_BODY_BYTES = 256 * 1024;
export const MAX_FILES = 8;

export type CaptureFile = { name: string; json: Record<string, unknown> };
export type Upload = { files: CaptureFile[]; model: string; note?: string };

const FILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}\.json$/;
const SAFE_SEGMENT = /[^A-Za-z0-9._-]/g;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Accepts `{ files: { "main-gesture.json": {...probe JSON} }, note? }`. Returns an error message or the upload. */
export function parseUpload(body: unknown): Upload | string {
  if (!isObject(body) || !isObject(body.files)) return "Expected { files: { <name>.json: capture } }.";
  const entries = Object.entries(body.files);
  if (entries.length === 0) return "No files.";
  if (entries.length > MAX_FILES) return `At most ${MAX_FILES} files per upload.`;
  const files: CaptureFile[] = [];
  let model: string | null = null;
  for (const [name, json] of entries) {
    if (!FILE_NAME.test(name)) return `Invalid file name: ${name}`;
    if (!isObject(json)) return `${name}: not a JSON object.`;
    const device = json.device, display = json.display, navigation = json.navigation;
    if (typeof json.probeVersion !== "string") return `${name}: missing probeVersion.`;
    if (!isObject(device) || typeof device.model !== "string" || !device.model) return `${name}: missing device.model.`;
    if (!isObject(display) || typeof display.widthPx !== "number" || typeof display.heightPx !== "number") return `${name}: missing display size.`;
    if (!isObject(navigation) || typeof navigation.mode !== "string") return `${name}: missing navigation.mode.`;
    if (!isObject(json.insets)) return `${name}: missing insets.`;
    if (model !== null && model !== device.model) return "All files in one upload must come from the same device model.";
    model = device.model;
    files.push({ name, json });
  }
  const note = typeof body.note === "string" ? body.note.slice(0, 500) : undefined;
  return { files, model: model!, note };
}

/** `measurements/_inbox/<model>/<timestamp>/<name>`; review moves accepted files to the device folder. */
export function inboxPath(model: string, stamp: string, name: string) {
  return `${INBOX_DIR}/${model.replace(SAFE_SEGMENT, "_")}/${stamp.replace(SAFE_SEGMENT, "_")}/${name}`;
}

export const uploadStamp = (date: Date) => date.toISOString().replace(/[:.]/g, "-");

type GitHub = (path: string, init?: { method?: string; body?: unknown }) => Promise<{ status: number; data: any }>;

export function githubClient(token: string, repo: string, fetcher: typeof fetch = fetch): GitHub {
  return async (path, init = {}) => {
    const response = await fetcher(`https://api.github.com/repos/${repo}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
    const text = await response.text();
    return { status: response.status, data: text ? JSON.parse(text) : null };
  };
}

export class GitHubError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

const expect = (result: { status: number; data: any }, ok: number[], what: string) => {
  if (!ok.includes(result.status)) {
    const hint = result.status === 401 ? " (token expired or revoked?)" : "";
    throw new GitHubError(result.status, `${what} failed: ${result.status}${hint} ${result.data?.message ?? ""}`.trim());
  }
  return result.data;
};

/** Commit all files of one upload to the inbox branch in a single commit; ensure the inbox PR exists. */
export async function commitToInbox(gh: GitHub, upload: Upload, now = new Date()) {
  const main = expect(await gh("/git/ref/heads/main"), [200], "Read main");
  let ref = await gh(`/git/ref/heads/${INBOX_BRANCH}`);
  if (ref.status === 404) {
    expect(await gh("/git/refs", { method: "POST", body: { ref: `refs/heads/${INBOX_BRANCH}`, sha: main.object.sha } }), [201], "Create inbox branch");
    ref = await gh(`/git/ref/heads/${INBOX_BRANCH}`);
  }
  const head = expect(ref, [200], "Read inbox branch").object.sha as string;
  const parent = expect(await gh(`/git/commits/${head}`), [200], "Read inbox commit");
  const stamp = uploadStamp(now);
  const tree = expect(await gh("/git/trees", {
    method: "POST",
    body: {
      base_tree: parent.tree.sha,
      tree: upload.files.map(file => ({
        path: inboxPath(upload.model, stamp, file.name),
        mode: "100644",
        type: "blob",
        content: `${JSON.stringify(file.json, null, 2)}\n`,
      })),
    },
  }), [201], "Create tree");
  const message = `chore(inbox): ${upload.model} · ${upload.files.map(f => f.name).join(", ")}${upload.note ? `\n\n${upload.note}` : ""}`;
  const commit = expect(await gh("/git/commits", { method: "POST", body: { message, tree: tree.sha, parents: [head] } }), [201], "Create commit");
  expect(await gh(`/git/refs/heads/${INBOX_BRANCH}`, { method: "PATCH", body: { sha: commit.sha } }), [200], "Update inbox branch");

  const owner = (await gh("")).data?.owner?.login;
  const open = expect(await gh(`/pulls?state=open&base=main&head=${owner}:${INBOX_BRANCH}`), [200], "List inbox PR") as any[];
  let pr = open[0];
  if (!pr) {
    pr = expect(await gh("/pulls", {
      method: "POST",
      body: {
        title: "Capture inbox",
        head: INBOX_BRANCH,
        base: "main",
        body: "Raw InsetsProbe uploads under `measurements/_inbox/<model>/<timestamp>/`.\n\nReview each capture, move accepted files to `measurements/<device-slug>/` with their canonical names, register them, then merge. Do not edit values.",
      },
    }), [201], "Open inbox PR");
  }
  return { commit: commit.sha as string, pr: pr.number as number, paths: upload.files.map(f => inboxPath(upload.model, stamp, f.name)) };
}
