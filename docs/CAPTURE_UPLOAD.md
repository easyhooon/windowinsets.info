# Capture upload (issue #28)

InsetsProbe can upload captures straight from an RTL or physical device instead of
the RTL File Browser download round trip.

```
InsetsProbe ──POST /api/captures──▶ Vercel function ──GitHub API──▶ capture-inbox branch ──one PR──▶ main
```

- `api/captures.ts` (Vercel Function): checks the upload key, size (256 KB),
  a per-IP limit (10/min) and the capture shape (`probeVersion`, `device.model`,
  display size, `navigation.mode`, `insets`).
- `api/_lib/captureInbox.ts`: one upload = one commit on `capture-inbox` under
  `measurements/_inbox/<model>/<timestamp>/<file>.json`; creates the branch and the
  single **Capture inbox** PR when missing, otherwise reuses them. No PR per upload.
- Values are never edited. Review moves accepted files to
  `measurements/<device-slug>/` with canonical names, registers them, and merges.

## Setup (Vercel → Project → Settings → Environment Variables, Production)

| Name | Value |
| --- | --- |
| `GITHUB_TOKEN` | Fine-grained PAT, repository access **only** `easyhooon/windowinsets.info`, permissions **Contents: Read and write**, **Pull requests: Read and write** |
| `CAPTURE_UPLOAD_KEY` | Random secret, e.g. `openssl rand -hex 24` |
| `GITHUB_REPOSITORY` | Optional, defaults to `easyhooon/windowinsets.info` |

Redeploy after changing variables. Build the probe with the same key:
`./gradlew :app:assembleDebug -PinsetsProbeUploadKey=<key>`.

## Token expiry

Fine-grained PATs expire. When it does, uploads fail with
`Read main failed: 401 (token expired or revoked?)` (HTTP 502) and the probe shows
that message; downloading from the File Browser still works. Create a new token
with the same scope, replace `GITHUB_TOKEN`, and redeploy. The upload key does not
need to change.

## Limits

The key ships inside the APK, so treat it as a speed bump, not a secret: the
inbox review is the real gate. Rotate `CAPTURE_UPLOAD_KEY` (and rebuild the probe)
if uploads are abused.
