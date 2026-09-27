import { GitHubError, MAX_BODY_BYTES, commitToInbox, githubClient, parseUpload } from "./_lib/captureInbox.js";

/**
 * POST /api/captures — InsetsProbe upload endpoint (issue #28).
 * Env: CAPTURE_UPLOAD_KEY (shared with the probe build), GITHUB_TOKEN (contents +
 * pull requests write on this repository), optional GITHUB_REPOSITORY.
 */

const WINDOW_MS = 60_000, LIMIT = 10;
const recent = new Map<string, number[]>();

function limited(ip: string, now = Date.now()) {
  const hits = (recent.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > LIMIT;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const key = process.env.CAPTURE_UPLOAD_KEY, token = process.env.GITHUB_TOKEN;
  if (!key || !token) return json(503, { error: "Uploads are not configured." });
  if (request.headers.get("x-upload-key") !== key) return json(401, { error: "Invalid upload key." });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json(429, { error: "Too many uploads. Wait a minute." });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "Upload too large." });
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return json(400, { error: "Body is not JSON." }); }
  const upload = parseUpload(body);
  if (typeof upload === "string") return json(400, { error: upload });

  try {
    const gh = githubClient(token, process.env.GITHUB_REPOSITORY ?? "easyhooon/windowinsets.info");
    const result = await commitToInbox(gh, upload);
    return json(201, { ok: true, pr: result.pr, commit: result.commit.slice(0, 7), files: result.paths });
  } catch (error) {
    const status = error instanceof GitHubError && error.status === 401 ? 502 : 500;
    console.error(error);
    return json(status, { error: error instanceof Error ? error.message : "Upload failed." });
  }
}

export function GET() {
  return json(405, { error: "POST InsetsProbe captures here." });
}
