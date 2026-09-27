# WindowInsets — Codex project guide

## Product goal

Clone https://safearea.info as faithfully as possible for Android. The reference is
the product specification, not visual inspiration: match its information hierarchy,
layout, typography, spacing, responsive transitions, diagram proportions, controls,
and direct-manipulation behavior before proposing independent improvements. Adapt
only the platform-specific substance—Android WindowInsets semantics, navigation
modes, fold states, and official Samsung device artwork. Keep reference-shaped UI
when an Android equivalent exists; document every intentional divergence in
`docs/REFERENCE_PARITY.md`. Improve the existing device set before collecting more
data or adding unrelated features.

Coverage decision (2026-09-22, updated 2026-09-24): all Samsung Galaxy models
with official skins are in scope when released in 2020 or later; Galaxy Fold
and Flip models with official skins are in scope at any release year. Discontinuation
and flagship status do not affect coverage. Follow
the priority order in README: current S/Fold/Flip quality → Tab → Note and A.
Keep other pre-2020 artwork archived but exclude it from public devices/routes. Check
new imports against `docs/DEVICE_COVERAGE.md`. TriFold supports official cover/inner
artwork and a two-hinge 3D animation (approved 2026-09-24). Artwork-only entries stay previews;
missing measurements must not be invented.

RTL collection policy: keep registered skins regardless of RTL availability,
but prioritize new measurements from RTL-offered models. User-supplied physical
devices (such as Fold2) can also contribute verified captures. Track RTL catalog status
separately from per-screen captures. Only a complete, dated reservation inventory
can establish that a model is not listed; 403 responses and featured-only lists
leave other models unverified. Preserve historical captures. See
`docs/RTL_COVERAGE.md` for evidence and comparison status.

## Start here

- `docs/REFERENCE_PARITY.md`: binding clone doctrine, observed reference behavior,
  intentional Android substitutions, implementation status and visual QA.
- `docs/MEASUREMENT_WORKFLOW.md`: capture process, known RTL issues, corrections.
- `docs/RTL_CREDITS.md`: published credit policy, live grant evidence and budget rules.
- `docs/DESIGN_HANDOFF.md`: original Claude visual backlog; see current status first.
- React Router framework mode, React, TypeScript, three.js; pnpm; static prerender.
- `pnpm dev`, `pnpm typecheck`, `pnpm build`, `pnpm test:visual`,
  `node --test tests/rendering.test.mjs`.

## Non-negotiable data boundaries

- Raw files in `measurements/` are immutable evidence. Missing measurements stay
  null/pending. Skin pixel coordinates are artwork metadata, not measured insets.
- Fold8's legacy `main-*.json` captures are 1248×1972, matching the official COVER
  skin. The website classifies them as cover from this evidence; the original
  labels/files remain unchanged. The dated `recapture-2026-09-22/` set contains
  separate verified cover and 2448×1848 landscape inner captures. Never rotate or
  stretch the legacy cover values onto the inner display.
- Skin foregrounds depict physical cameras; DisplayCutout bounds describe an OS
  exclusion rectangle. Do not replace the artwork's camera with the bounds.
- View rotation rotates the recorded diagram; it does not invent landscape
  WindowInsets. Describe this in measurement conditions.

## Rendering and assets

- `app/components/DeviceView.tsx` owns view state and controls.
- `DiagramViewport.tsx` owns fit, pan, pinch, keyboard zoom and view rotation.
- `InsetsDiagram.tsx` uses SVG for flat displays; `FoldRenderer3D.tsx` uses a
  textured display plus a lit, closed chassis. `foldGeometry.ts` owns hinge math.
- `app/data/skins.ts` contains official asset rectangles. `public/skins/` keeps
  original Samsung images and emulator layout files with provenance. Body clips
  are illustrative, display rectangles come directly from the layout.
- For rendering or control changes, check desktop and mobile, Fold/Flip/bar,
  dp/px, closed/partial/open, controls, and no-data screens. Do not rely on a
  successful TypeScript build as visual QA.
- For artwork-only skin registration (ZIP assets, generated skin data, and
  coverage docs without behavior changes), inspect the new layout and asset
  links plus the new desktop/mobile preview. Skip automated test suites,
  typecheck, and build for this case; run them when application or
  importer behavior changes or a concrete failure needs diagnosis.
- Keep motion reduced when requested by the OS; dispose GPU resources on unmount.

## Working conventions

- English only for everything in this repository and on GitHub: code, comments,
  docs, UI copy, commit messages, issues, PRs, review comments and labels. The
  audience is international. This overrides any global skill or instruction that
  requests Korean output, even when the maintainer writes to you in Korean.
- Write commit subjects and bodies in English using Conventional Commits.
  This repository rule overrides any global skill that requests Korean messages.
- Codex attribution is allowed. Include
  `Co-authored-by: Codex <codex@openai.com>` in Codex-assisted commits while
  preserving the configured human author identity.
- Split commits by coherent work. Rewrite published history only when explicitly
  requested, and use an explicit `--force-with-lease` to protect remote changes.
- Check the session service tier once; use Standard, never enable Fast unasked.
- Batch independent reads and representative validation. Avoid speculative guards.
- Korean frontend references in work artifacts use `프론트`.
- Documentation-only changes go directly to the requested branch rather than PR.
- No new device reservations or measurement claims without actual captures.
