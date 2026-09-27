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

## Create the GitHub token

1. GitHub → avatar → **Settings** → **Developer settings** →
   **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
   (direct link: https://github.com/settings/personal-access-tokens/new).
2. Name it e.g. `windowinsets-capture-inbox`; pick an **Expiration** (the longest
   you are comfortable with; see Token expiry below).
3. **Resource owner**: your account. **Repository access**: *Only select
   repositories* → `easyhooon/windowinsets.info`.
4. **Permissions → Repository permissions**:
   - **Contents**: Read and write (commits to `capture-inbox`)
   - **Pull requests**: Read and write (opens/reuses the inbox PR)
   - Metadata: Read-only is added automatically. Leave everything else off.
5. **Generate token** and copy it once (it is not shown again). Paste it straight
   into Vercel, never into chat, issues or the repository.

## Setup (Vercel → Project → Settings → Environment Variables)

Set the variables for **Production**. To test this PR before merging, also set
them for **Preview**, scoped to the `feat/capture-upload` Git branch. Do not expose
the repository write token to every preview branch. Remove the branch-scoped
Preview token after the test if it is no longer needed.

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
