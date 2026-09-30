# Measurement workflow

**Last updated:** 2026-09-30

This is the working reference for collecting and publishing inset measurements
and the single queue of what remains. The step-by-step agent procedure lives in
the [`samsung-rtl-insets` skill](../.agents/skills/samsung-rtl-insets/SKILL.md)
and the [measurement harness](MEASUREMENT_HARNESS.md); Pixel emulator captures
follow the [`pixel-emulator-insets` skill](../.agents/skills/pixel-emulator-insets/SKILL.md).

## Scope and evidence policy

- Official Samsung skins stay registered under the coverage policy in
  [DEVICE_COVERAGE.md](DEVICE_COVERAGE.md). New measurements prioritize models
  that Samsung Remote Test Lab (RTL) offers; verified captures from the owner's
  physical devices (for example Fold2 and S25+) are accepted too.
- Only actual InsetsProbe captures populate insets. A skin, a spec sheet or an
  RTL listing never supplies measured values, and missing values stay pending.
- RTL catalog status is tracked separately from captures in
  `app/data/rtlAvailability.ts`. The catalog is only partially visible, so a
  model missing from it is not proof that RTL lacks it.
- Every published value links to its raw JSON through the device's `Source`
  entries; the site shows the capture date, unit, build and probe version. No
  separate per-device evidence log is kept.

## Raw evidence

- Raw captures live in `measurements/<series>/<device-slug>/`, where
  `<series>` is `galaxy-a`, `galaxy-s`, `galaxy-note`, `galaxy-tab`,
  `galaxy-fold` (including TriFold), `galaxy-flip` or `pixel`.
  `measurements/_inbox/` holds unreviewed uploads from the probe.
- Files are immutable. A newer capture goes into a dated directory
  (`recapture-<date>/`, `recapture-<date>-rotation/`); a capture that fails
  validation goes into `rejected-<date>/`. Neither replaces or edits older files.
- Pixel emulator runs use `emulator-<date>/` with a `manifest.json`; physical
  Firebase Test Lab spot checks use `testlab-<date>/` and are described in
  [PIXEL_HARDWARE_VALIDATION.md](PIXEL_HARDWARE_VALIDATION.md).

## Capture rules

- **Default display settings.** Full screen, the model's default resolution
  (FHD+ on Samsung flagships), default display size, font scale 1 and English
  system language. Check the probe's active window before measuring.
- **One capture per display.** The probe's Cover/Main radio button only labels a
  capture. Switch the physical display with the RTL folding control (or by
  folding a physical device) and confirm the active window size and display ID
  before choosing the matching label.
- **Navigation mode.** The probe cannot change Samsung's navigation mode.
  Switch it in Settings → Display → Navigation bar, or over adb with the
  SystemUI navbar overlays, then capture again. Accept a file only when its
  name, the Android setting and the navigation configuration agree.
- **Rotations.** **Rotate & measure all orientations** records every rotation
  of the current display. Each rotation is its own capture: never mirror
  rotation 1 into 3 or turn a portrait capture into landscape. File names keep
  `main-*` / `cover-*` for the natural rotation and add
  `landscape-<rotation>-<nav>` (phones) or a screen prefix (foldables) for the
  others.
- **Validate before publishing.** Model, build, display ID, window size,
  density, font scale, rotation and navigation mode must match expectations,
  and rotation 0 must reproduce the accepted captures. The harness lists the
  full gate.

## Orientation support by form factor

Only tablets turn upside down. Galaxy phones and foldables leave 180° out of
auto-rotation, so ordinary apps never see reverse portrait there.

| Form factor | Portrait | Landscape (rotation 1 and 3) | Reverse portrait (rotation 2) | Evidence |
| --- | --- | --- | --- | --- |
| Bar phone | ✓ | ✓ | ✗ | Android/One UI default auto-rotation excludes 180° on phones |
| Flip (main) | ✓ | ✓ | ✗ | Same as phones |
| Flip (cover) | ✓ | ✗ | ✗ | The cover never rotates (Flip7 probe sweep, Flip8 RTL Rotate control) |
| Fold (cover and inner) | ✓ | ✓ | ✗ | Owner check on a real Galaxy Fold, folded and unfolded |
| TriFold | ✓ | ✓ | ✗ (assumed) | Not checked yet; treated like Fold |
| Tablet | ✓ | ✓ | ✓ | Confirmed on a Galaxy Tab |

For Galaxy Tab sweeps, select **Tablet: include upside-down portrait** in the
probe and verify four distinct `display.rotation` values per navigation mode.
Leave it off on phones and foldables. Where reverse portrait applies, it is its
own capture: the cutout moves to the bottom edge.

## Pixel emulator captures

`scripts/capture-emulator.py` drives a booted headless AVD through every screen,
navigation mode and rotation and writes a `manifest.json` with the AVD, device
profile, skin, system image, build fingerprint and emulator version.

- Build the probe with `-PinsetsProbeUploadKey=` so emulator JSON never reaches
  the real-device capture inbox.
- Folds use `adb emu fold/unfold`; navigation uses the SystemUI navbar overlays.
  Android 16+ ignores app orientation requests on large screens, so the inner
  display is rotated with `cmd window user-rotation lock`.
- Copy a validated run to `measurements/pixel/<slug>/emulator-<date>/`, then run
  `python3 scripts/import-emulator-captures.py [slug ...]`. The importer checks
  model, resolution, navigation mode and fold state, copies the AOSP skin with a
  `source.json` and generates the device data. Only rotation 0 is shown.
- The site labels these values "Emulator insets" and never describes them as
  measured on Pixel hardware.

## RTL sessions

- Credits and refunds: see [RTL_CREDITS.md](RTL_CREDITS.md).
- Closing or losing the WebClient restarts the device and removes the probe, so
  keep it open until the captures are validated.
- RTL pages sometimes return a bare 403 or a blank page
  ([Samsung forum thread](https://forum.developer.samsung.com/t/403-forbidden/34558)).
  Retry after 10–30 s, re-enter from `developer.samsung.com/remote-test-lab`, or
  open a fresh tab.

## Publishing a capture

1. Copy the accepted raw JSON unchanged into the device's evidence directory.
2. Register the values in `app/data/devices/<slug>/index.ts` with a `Source`
   per capture. Rotation records are generated from the raw JSON.
3. Update the queue below in the same commit.
4. Run `pnpm typecheck`, `node --test tests/*.test.mjs` and, for rendering
   changes, `pnpm build`.

Data quality checklist:

- Never estimate a value; leave it pending until measured.
- `logicalSizeDp` must equal `logicalSizePx ÷ (densityDpi ÷ 160)`.
  `resolutionPx` is the sourced physical panel and may differ from the window.
- Insets carry all four sides, and corner radii are all four corners or none.
- Keep captured px separately; never reconstruct px from rounded dp.
- Source tier: `official` for published specs, `measured` for device captures,
  `community` for unreproduced submissions.

## Device Status & Progress

Rotation requirement (2026-09-27, issues #22/#24): a phone or foldable screen
needs natural, rotation 1 and rotation 3 captures in both navigation modes,
usually six files per screen. A Galaxy Tab needs four distinct rotations per
mode, including reverse portrait, usually eight files per screen. Use the
probe's tablet option and check each capture's actual `display.rotation` and
window orientation. Natural-rotation captures stay published and valid. Devices
that only have those captures need the full sweep again on the same screens.
Missing rotations stay pending; never mirror or rotate existing captures to
fill them.

### Rotation sweep captured

| Device | Model | Rotation captures on file | Remaining |
| --- | --- | --- | --- |
| Galaxy A54 5G | SM-A546B | Main: natural, rotation 1 and 3 in both modes | None |
| Galaxy Z Fold7 | SM-F966U | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold7/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold8 Ultra | SM-F976U | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/`) | None |
| Galaxy S23+ | SM-S916U | Main: 3-button rotation 1 and 3; gesture rotation 1 (pilot, captured by hand rotation) | Main gesture rotation 3 |
| Galaxy Z Fold8 | SM-F971N | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold8/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold6 | SM-F956U | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold6/recapture-2026-09-27-rotation/`) | None |
| Galaxy S26 Ultra | SM-S948U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s26-ultra/recapture-2026-09-27-rotation/`) | None |
| Galaxy S24+ | SM-S926N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s24-plus/recapture-2026-09-28-rotation/`) | None |
| Galaxy S24 | SM-S921N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s24/recapture-2026-09-28-rotation/`) | None |
| Galaxy S23 Ultra | SM-S918U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s23-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S23 | SM-S911B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s23/recapture-2026-09-28-rotation/`) | None |
| Galaxy S24 FE | SM-S721N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s24-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy S23 FE | SM-S711B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s23-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy S21 | SM-G991B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s21/recapture-2026-09-29-rotation/`) | None |
| Galaxy S21 FE | SM-G990B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s21-fe/recapture-2026-09-29-rotation/`) | None |
| Galaxy S20 Ultra | SM-G988B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s20-ultra/recapture-2026-09-29-rotation/`) | Cutout shape stays unregistered; raw bounds are off-center in every rotation |
| Galaxy S20+ | SM-G985F | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s20-plus/rtl-2026-09-30/`) | Cutout shape stays unregistered; raw bounds are off-center in every rotation |
| Galaxy S20 FE | SM-G780G | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s20-fe/recapture-2026-09-29-rotation/`) | None |
| Galaxy Note20 Ultra | SM-N985F | Main: natural in both modes; rotation 1 and 3 in 3-button mode (`measurements/galaxy-note/galaxy-note20-ultra/recapture-2026-09-29-rotation/`) | Main gesture rotations 1 and 3; the 2026-09-29 gesture sweep is rejected because its navigation setting disagrees with the configuration and portrait inset |
| Galaxy Note20 | SM-N981U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-note/galaxy-note20/recapture-2026-09-29-rotation/`) | None |
| Galaxy A57 5G | SM-A576S | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a57-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A36 5G | SM-A366N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a36-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A35 5G | SM-A356N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a35-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A37 5G | SM-A376N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a37-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A25 5G | SM-A256N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a25-5g/recapture-2026-09-29-rotation/`), evidence only | No public route until an official A25 skin exists |
| Galaxy A17 | SM-A175N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a17-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A16 | SM-A165N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a16-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A27 5G | SM-A276K | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a27-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy A26 5G | SM-A266B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a26-5g/rtl-2026-09-30/`) | None |
| Galaxy A13 5G | SM-A136B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a13-5g/rtl-2026-09-30/`) | None |
| Galaxy A73 5G | SM-A736B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a73-5g/recapture-2026-09-30-rotation/`) | None |
| Galaxy A52s 5G | SM-A528B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a52s-5g/recapture-2026-09-30-rotation/`) | None |
| Galaxy A34 5G | SM-A346E | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a34-5g/recapture-2026-09-30-rotation/`) | None |
| Galaxy A33 5G | SM-A336E | Main: natural in both modes; rotation 1 and 3 in 3-button mode (`measurements/galaxy-a/galaxy-a33-5g/recapture-2026-09-30-rotation/`) | Main gesture rotations 1 and 3; the 2026-09-30 gesture captures report no bottom navigation inset and 67 px side gesture insets against the accepted 42 px and 84 px, so they are kept as rejected evidence (`measurements/galaxy-a/galaxy-a33-5g/rejected-2026-09-30/`) |
| Galaxy A32 | SM-A325F | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a32/recapture-2026-09-30-rotation/`) | None |
| Galaxy A24 | SM-A245F | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a24/recapture-2026-09-30-rotation/`) | None |
| Galaxy A55 5G | SM-A556S | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-a/galaxy-a55-5g/recapture-2026-09-29-rotation/`) | None |
| Galaxy Tab S11 Ultra | SM-X930 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s11-ultra/recapture-2026-09-29-rotation/`) | None |
| Galaxy Tab S10 Ultra | SM-X920 | Main: rotation 1 in both modes (accepted). All four rotations in 3-button (`measurements/galaxy-tab/galaxy-tab-s10-ultra/recapture-2026-09-29-rotation/`, rotation 2 in `recapture-2026-09-29-rotation-in2/`) and in gesture (`recapture-2026-09-29-rotation-vn1/`) | None |
| Galaxy Tab S10+ | SM-X820 | Main: rotation 1 in both modes (accepted). All four rotations in 3-button (`measurements/galaxy-tab/galaxy-tab-s10-plus/recapture-2026-09-29-rotation/`) | Rotations 0, 2 and 3 in gesture |
| Galaxy Tab S10 FE+ | SM-X620 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s10-fe-plus/recapture-2026-09-29-rotation/`) | None |
| Galaxy Tab S10 FE | SM-X520 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s10-fe/recapture-2026-09-29-rotation/`) | None |
| Galaxy Tab S10 Lite | SM-X406B | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s10-lite/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S9 Ultra | SM-X916B | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s9-ultra/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S9+ | SM-X816B | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s9-plus/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S9 FE | SM-X516N | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s9-fe/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S8 Ultra | SM-X906B | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s8-ultra/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S8+ | SM-X806B | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s8-plus/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S8 | SM-X706N | Main: natural rotation 1 in both modes; rotations 0, 2 and 3 in 3-button mode (`measurements/galaxy-tab/galaxy-tab-s8/recapture-2026-09-30-rotation/`) | Main gesture rotations 0, 2 and 3; the 2026-09-30 gesture sweep on the same build is rejected because it reports a 102 px bottom navigation inset in every rotation (also with `task_bar` 0) against the accepted 32 px (`rejected-2026-09-30-gesture/`) |
| Galaxy Tab S7+ | SM-T970 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s7-plus/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S7 FE | SM-T735 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s7-fe/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab A11 | SM-X135F | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-a11/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab A9+ | SM-X216B | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-a9-plus/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab A7 Lite | SM-T225 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-a7-lite/recapture-2026-09-30-rotation/`) | None |
| Galaxy Tab S9 FE+ | SM-X616N | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s9-fe-plus/recapture-2026-09-29-rotation/`) | None |
| Galaxy Tab S11 | SM-X730 | Main: rotations 0, 1, 2 and 3 in both modes (`measurements/galaxy-tab/galaxy-tab-s11/recapture-2026-09-29-rotation/`) | None |
| Galaxy S21+ | SM-G996B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s21-plus/recapture-2026-09-29-rotation/`) | None |
| Galaxy S21 Ultra | SM-G998B / SM-G998U1 | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s21-ultra/recapture-2026-09-29-rotation/`) | None |
| Galaxy S22 Ultra | SM-S908B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s22-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S22+ | SM-S906B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s22-plus/recapture-2026-09-28-rotation/`; 3-button natural reconstructed from the preserved RTL log) | None |
| Galaxy S22 | SM-S901E | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s22/recapture-2026-09-28-rotation/`; five files reconstructed from the preserved RTL logs) | None |
| Galaxy S25 | SM-S931N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s25/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25 FE | SM-S731N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s25-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25 Edge | SM-S937N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s25-edge/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25+ | SM-S936N (user device) | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s25-plus/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25 Ultra | SM-S938N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s25-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S24 Ultra | SM-S928N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s24-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S26+ | SM-S947N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s26-plus/recapture-2026-09-28-rotation/`) | None |
| Galaxy S26 | SM-S942N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s/galaxy-s26/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Fold5 | SM-F946B | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold5/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold4 | SM-F936B | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold3 | SM-F926B | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z TriFold | SM-F968N | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-trifold/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Flip8 | SM-F776B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip8/recapture-2026-09-27-rotation/`). Cover: natural in both modes on display 1 at 948×1048 px | None. The cover does not rotate, so rotation 0 is its only layout |
| Galaxy Z Flip7 | SM-F766N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-27-rotation/`). Cover: natural in both modes on display 1 at 948×1048 px (`recapture-2026-09-28-flexwindow/`) | None. The cover does not rotate, so rotation 0 is its only layout |
| Galaxy Z Flip7 FE | SM-F761B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip7-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Flip3 | SM-F711B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip3/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Flip4 | SM-F721B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip4/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Flip6 | SM-F741U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip6/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Flip5 | SM-F731B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-flip/galaxy-z-flip5/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold2 | SM-F916N (user device) | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-fold/galaxy-z-fold2/recapture-2026-09-28-rotation/`) | None |

### Natural rotation only — full sweep needed

Recapture every listed screen in both navigation modes. Use the queue order in
`.agents/skills/samsung-rtl-insets/SKILL.md`: Fold, then Flip, then S, then Tab,
Note and A.

| Series | Devices | Screens |
| --- | --- | --- |
| Galaxy Z Flip | original Z Flip (not listed on RTL as of 2026-09-28) | Main (no cover skin) |
| Galaxy Tab | S9 (no Android 16 unit matching the accepted build is listed on RTL as of 2026-09-30) | Main, all four rotations in both modes (natural rotation is landscape on most tablets) |
| Galaxy A | A56, A53, A32 5G, A23, A15, A14 5G, A13 LTE, A07, A06, A05, A04 | Main |
