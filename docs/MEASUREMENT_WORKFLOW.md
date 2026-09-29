# WindowInsets Measurement Workflow & Status

**Last Updated**: 2026-09-28

## RTL collection scope

Keep official skin previews registered, but target new measurement collection at
RTL-offered models. Track model availability separately from screen/nav-mode
captures. The full RTL catalog remains inaccessible; do not interpret missing
models in the featured list as unsupported. See [RTL_COVERAGE.md](RTL_COVERAGE.md)
and its per-skin comparison for checked sources, unknowns and completion steps.

## Pixel emulator captures (issue #23, 2026-09-27)

`scripts/capture-emulator.py` drives a booted headless AVD through every screen,
navigation mode and rotation, pulls the raw InsetsProbe JSON and writes a
`manifest.json` with the AVD, device profile, skin, system image, build
fingerprint and installed emulator version. The step-by-step procedure and
lessons live in the `pixel-emulator-insets` skill
(`.agents/skills/pixel-emulator-insets/SKILL.md`).

- Build the probe with `-PinsetsProbeUploadKey=` so emulator JSON never reaches
  the real-device capture inbox.
- Folds use `adb emu fold/unfold`; navigation uses the SystemUI navbar overlays.
- Android 16+ ignores app orientation requests on large screens, so the inner
  display is rotated with `cmd window user-rotation lock`. Cover and bar-phone
  displays use the probe's own sweep, which records only allowed rotations.
- Pixel 9 Pro Fold and Pixel 10 Pro Fold each produced 14 captures on Android 17
  (API 37) system images. Pixel 9 Pro Fold values were identical on emulator
  36.4.9 and 37.1.11. Pixel 10 Pro Fold reported the same inner cutout and
  corner radii as Pixel 9 Pro Fold. Physical FTL spot checks on 2026-09-28
  found matching camera paths and corners on both Fold models. Pixel 10 Pro
  Fold's physical top cutout safe inset differed from its API 37 emulator
  capture; see [the FTL validation log](PIXEL_HARDWARE_VALIDATION.md).
- Registration: copy a validated run to
  `measurements/<slug>/emulator-<date>/` (raw JSON plus `manifest.json`, never
  mixed with real-device files), then run
  `python3 scripts/import-emulator-captures.py [slug ...]`. The importer checks
  the emulator model, spec resolution, navigation mode agreement and cover fold
  state; copies the AOSP skin with a `source.json`; and generates
  `app/data/devices/<slug>/index.ts`, `app/data/aospSkins.ts` and
  `app/data/devices/pixel.ts`. Only rotation 0 is shown; other rotations stay
  as raw evidence.
- The site labels these values "Emulator insets" and shows the emulator version,
  device profile and build instead of One UI. Never describe them as measured on
  Pixel hardware.

Physical Firebase Test Lab captures are kept in separate dated `testlab-*/`
folders with the model, Android build and matrix ID. They are spot checks, not
automatic replacements for published emulator values. The 2026-09-28 Spark
run covered Pixel 10 Pro XL, Pixel 10 Pro Fold, Pixel 9 Pro Fold, Pixel 8 Pro
and Pixel Tablet. See [Pixel hardware validation](PIXEL_HARDWARE_VALIDATION.md)
for the raw evidence, comparison conditions and unresolved differences.

## Orientation support by form factor (2026-09-27, #24)

Only tablets turn upside down. Galaxy phones and foldables leave 180° out of
auto-rotation, so ordinary apps never see reverse portrait there.

| Form factor | Portrait | Landscape (rotation 1 and 3) | Reverse portrait (rotation 2) | Evidence |
| --- | --- | --- | --- | --- |
| Bar phone | ✓ | ✓ | ✗ | Android/One UI default auto-rotation excludes 180° on phones |
| Flip (main) | ✓ | ✓ | ✗ | Same as phones; the Flip8 cover screen did not rotate at all in the #30 sweep |
| Fold (cover and inner) | ✓ | ✓ | ✗ | Owner check on a real Galaxy Fold, folded and unfolded |
| TriFold | ✓ | ✓ | ✗ (assumed) | Not checked yet; treated like Fold |
| Tablet | ✓ | ✓ | ✓ | Confirmed on a Galaxy Tab |

Consequences:

- The site offers **Portrait Upside Down** only for tablets (`DeviceView.tsx`,
  documented in `REFERENCE_PARITY.md`).
- In InsetsProbe, select **Tablet: include upside-down portrait** for Galaxy Tab
  sweeps. This adds a reverse-portrait request after the standard three steps.
  Verify four distinct `display.rotation` values in each navigation mode; the
  number for reverse portrait depends on the display's natural orientation.
  Leave this option off on phones and foldables. An app may be able to force
  180° on a phone, but that is not what ordinary auto-rotation offers.
- Where it does apply, reverse portrait is its own capture: the cutout moves to the
  bottom edge (an earlier Flip5 rotation-2 capture had a bottom inset of 139 px
  versus 45 px in portrait).
- Non-Samsung devices (#23) are unverified; check before exposing 180°.

## Latest registered batch (2026-09-25)

The 2026-09-25 batch adds paired main-display captures for Galaxy A07, A55, A53,
A52s, A57, A37, A35, A34, A33, A32 LTE, A32 5G, A27, A24, A23, A17, A16,
A15, A14, A06, A05 and A04; Galaxy A73 gained its 3-button capture on
2026-09-27. Earlier in
the same batch, Galaxy Note20,
Note20 Ultra and Galaxy Tab S9+, Tab S8 Ultra, Tab S8+ and Tab S8 were registered.
A second A27 retail SKU (SM-A276B) independently reproduced both navigation-mode
measurements. Preserve capture conditions: A32 LTE, A33, A34, A52s and A53 were
captured at font scale 1.1. The A23 page uses SM-A235F LTE captures because its
display and body match the registered 5G skin model.

Galaxy A73's earlier 3-button file, dated 2025-05-15, is retained as historical
evidence; the 2026-09-27 recapture set supplies the registered value. Two
exceptions remain explicit: Galaxy A13 LTE captures and Galaxy A25 captures are evidence-only because no
matching official skin is available. A13 LTE's 1080×2408 display does not match
the registered A13 5G skin's 720×1600 display. Raw capture files remain unchanged.
For four tablets, Settings and configuration plus side system-gesture insets
confirm gesture mode even when InsetsProbe's inset-only heuristic reports
threeButton. Galaxy A37's accepted 3-button recapture has a 135 px bottom bar;
its initial 1 px attempt remains rejected evidence. Galaxy Tab S9 FE had the
same 1 px failure; its 2026-09-27 recapture supplies an 84 px (48 dp) 3-button
bar at the same font scale. See
[RTL_COVERAGE.md](RTL_COVERAGE.md) for per-model details and variant evidence.

## Correction from official skins (2026-09-22)

The old claim that RTL always exposes the main display was not justified. Fold8's
historical root-level `main-*.json` files are **1248×1972**, exactly matching
Samsung's official **cover** skin layout. Its inner layout is **2448×1848**. Those
historical files remain unchanged for traceability. The website now uses the dated,
correctly labeled cover and inner recaptures described below. Do not use the
historical Bug 5 rotation workaround: it stretched cover information into a
different screen.

Flip8's 1080×2520 main captures match its main skin. Its 948×1048 cover was later
measured independently through InsetsProbe's FlexWindow AppWidget on display 1;
the accepted files are documented below. A screen radio button labels a capture
and does not prove which physical display was active. Verify the display ID and
resolution against the intended display for every future capture.

Specifically, Flip8 `cover-threeButton.json` reports 1080×2520, hinge angle 180°
and a horizontal FLAT folding feature. Despite its filename and manual label,
this is an inner-display capture, not a 948×1048 cover measurement. Keep this
raw evidence unchanged; the dated FlexWindow recapture supersedes it for published
cover values without rewriting the historical file.

For current rendering architecture and verification, see
[REFERENCE_PARITY.md](REFERENCE_PARITY.md). Legacy notes below document the prior
session and must be read with this correction.

## Probe capture diagnosis and fix (2026-09-22)

Fold8's two retained captures both report **hinge angle 0°**, no folding features,
and current/maximum windows of **1248×1972 px**. Their `screen: main` property is
manually chosen. The original Measure All only changed that label and attempted
navigation-mode writes; it never changed the physical display. Measure/Copy/Share
also saved cached `lastJson` instead of collecting at the button press. These are
confirmed code defects, although the available logs cannot establish which exact
button sequence produced each historical capture or why RTL showed that state.

InsetsProbe 1.1.0 removes the misleading batch operation and navigation toggles,
collects fresh root-window insets/metrics at export, blocks an unsettled or
multi-window capture, and blocks Main when a hinge reading indicates closed.
Schema 2 makes manual screen labeling explicit and adds capture context. A null
hinge angle is still unknown, not verification of Main. The ≤5° closed threshold
is consistent with the [AOSP fold-state provider's convention](https://android.googlesource.com/platform/frameworks/base/+/9d3dff4ab84820404b6b130bd5435cf578dc87cf/services/foldables/devicestateprovider/src/com/android/server/policy/FoldableDeviceStateProvider.java).

The required correction was to change the physical device state, return to Probe
full-screen, and verify that the active window changed from the cover resolution.
The official inner artwork remained a comparison reference, never a value forced
into JSON. The verified recapture below completed that procedure. Never rotate the
old cover measurements to fabricate an inner dataset. See
[Probe instructions](../tools/insets-probe/README.md).

### Verified Fold8 recapture

A later authenticated RTL session supersedes the earlier access and display-switching
assumptions. Computer Use reached the live WebClient, installed InsetsProbe 1.1.2,
and used the WebClient folding control to activate both physical displays:

- folded cover: **1248×1972 px**, portrait;
- unfolded inner display: **2448×1848 px**, landscape, with a vertical FLAT
  WindowManager folding feature at the midpoint.

Both displays were captured in 3-button and gesture navigation modes. The accepted
raw files are preserved under
`measurements/galaxy-z-fold8/recapture-2026-09-22/`. The older root-level
`main-*.json` evidence remains immutable, but the website now uses the correctly
labeled recaptures. The folded capture still reports a 180° hinge sensor value with
no folding features, so the cover classification relies on the actively switched
display and its exact official cover resolution, not that unreliable angle field.

### Verified Fold7 capture

Galaxy Z Fold7 (SM-F966U) was measured on Samsung RTL across two minimum
reservations. The first session produced cover 3-button plus inner 3-button and
gesture captures; the second produced the remaining cover gesture capture. Both
RTL instances reported the same Android 16 / One UI 8.5 build.

- folded cover: **1080×2520 px**, portrait, matching the official cover layout;
- unfolded inner display: **1968×2184 px**, portrait (rotation 0), matching the
  official inner layout, with a vertical FLAT folding feature at x=984;
- cover cutout: **60×102 px** at x=510, y=0;
- system bars: cover 110 px top and 126/39 px bottom; inner 89 px top and
  126/39 px bottom for 3-button/gesture respectively.

The inner display's hinge sensor remained at 0°, but InsetsProbe accepted the
capture because WindowManager supplied a real FLAT folding feature across the
display midpoint. The cover files are under `measurements/galaxy-z-fold7/`.

Upright inner recapture (2026-09-25): the first inner captures (InsetsProbe
1.2.1) were taken with the device turned sideways (rotation 1, 2184×1968 px,
horizontal FLAT feature, 79 px top), so the renderer turned the opened chassis
90° while Fold4/Fold6/Fold8 open as upright books. They remain unchanged at
`measurements/galaxy-z-fold7/main-*.json` as historical evidence. The published
inner values now come from InsetsProbe 1.3.0 captures at rotation 0 in
`measurements/galaxy-z-fold7/recapture-2026-09-25/`, on the same software build.
The gesture capture's Settings and configuration report gestures with 78 px side
gesture regions, while the inset-only classifier reports `threeButton`; this is
disclosed in the published condition.

### Verified Fold6 capture and rejected earlier 3-button attempt

Galaxy Z Fold6 (SM-F956U-KR10) was measured on Samsung RTL on 2026-09-23
with InsetsProbe 1.3.0 across three 30-minute reservations. Both active windows
matched the official skin display rectangles at Android density 420 dpi:

- folded cover: **968×2376 px**, portrait, with a 62×95 px cutout at x=453;
  3-button and gesture system bars were 95 px top and 126/39 px bottom;
- unfolded inner display: **1856×2160 px**, portrait, with a vertical FLAT
  folding feature at x=928; the accepted gesture/3-button captures reported
  94 px top and 39/126 px bottom system bars respectively.

The inner gesture file reports gesture mode from Settings and Android's nav
configuration, with 78 px side gesture regions and a 39 px navigation bar.
Probe's separate inset-only classifier reported `threeButton`, so this
disagreement is disclosed in the device condition rather than hidden.
An earlier inner 3-button attempt had Settings/configuration set to 3-button,
but the navigation bar/system bar bottom was only **1 px** while other gesture
and tappable regions were 126 px. It is preserved in
`measurements/galaxy-z-fold6/rejected-2026-09-23/` and **not published** as an
inset measurement. A third reservation produced a settled inner 3-button
recapture in `measurements/galaxy-z-fold6/main-threeButton.json`: its navigation
mode agrees across Settings, Android configuration and Probe's inset classifier,
and the navigation/system/tappable bottom insets all measure **126 px (48 dp)**.
The earlier 1 px file remains unchanged as rejected historical evidence.
The same final session also produced a 126 px diagnostic capture while the app
was rotated 180° and still labeled `phone`; it is retained under
`rejected-2026-09-23/` and was not used for the published portrait `main` values.
RTL reported a 90° hinge angle in both physical states; classification relies
on the actively switched display dimensions and the inner folding feature.

### Verified Fold5 capture and rotated cover recapture

Galaxy Z Fold5 (SM-F946B, RTL Vietnam/Hanoi) was measured with InsetsProbe
1.3.0 across two reservations on 2026-09-23 at Android 16 / One UI 8.0.

- folded cover: **904×2316 px**, portrait, with a 59×85 px cutout at x=423;
  3-button and gesture system bars measured 85 px top and 126/39 px bottom;
- unfolded inner display: **1812×2176 px**, portrait (rotation 0), with a
  vertical FLAT folding feature at x=906; both modes measured 80 px top and
  126/39 px bottom (2026-09-25 recapture).

The first cover gesture capture was accidentally rotated to landscape. Its
original JSON remains under `measurements/galaxy-z-fold5/rejected-2026-09-23/`;
the second reservation supplied an upright 904×2316 px capture whose gesture
configuration, Settings value and inset classifier all agree.

Upright inner recapture (2026-09-25): the 2026-09-23 inner captures were taken
sideways (rotation 1, 2176×1812 px, horizontal FLAT feature, 79 px top), which
turned the opened chassis 90°. They remain unchanged at
`measurements/galaxy-z-fold5/main-*.json` as historical evidence. Published
inner values come from the rotation-0 InsetsProbe 1.3.0 captures in
`measurements/galaxy-z-fold5/recapture-2026-09-25/` on the same build. The
recapture's hinge sensor reported 180°. The inner gesture capture has gesture Settings/configuration and 78 px side gesture regions, but
Probe's inset-only classifier reports `threeButton`; this disagreement is
disclosed in the published condition. The cover hinge sensor reported 180° with
no folding feature, so display identity relies on the switched window size and
the inner display's FLAT folding feature.

### Verified Fold4 capture and taskbar correction

Galaxy Z Fold4 (SM-F936B; RTL Vietnam, SM-F936BE-VN2) was measured on
2026-09-23 with InsetsProbe 1.3.0, Android 14 / One UI 6.1. All four accepted
files have portrait rotation 0 and agree with the selected navigation mode:

- folded cover: **904×2316 px**, 68×87 px cutout at x=418, 87 px top
  system/cutout safe inset and 126/39 px bottom bar for 3-button/gesture;
- unfolded main: **1812×2176 px**, vertical FLAT folding feature at x=906,
  82 px top system bar and 126/39 px bottom for 3-button/gesture.

The first main 3-button capture was rotated landscape and the first cover
gesture capture was rotated 180°; both remain under `rejected-2026-09-23/`.
The first portrait main gesture capture had Samsung Taskbar enabled, giving a
168 px bottom navigation/system inset and an inset-only 3-button classification
despite gesture Settings/configuration. It is also retained as rejected evidence.
After disabling Taskbar, both accepted main captures were taken in the same
portrait conditions and all mode classifiers agree. The cover camera bounds
come from the raw DisplayCutout rectangle, not the artwork.

### Verified Fold3 capture and larger gesture-mode bottom inset

Galaxy Z Fold3 (SM-F926B, Vietnam/Hanoi RTL) was measured on 2026-09-25 with
InsetsProbe 1.3.0 on Android 14 / One UI 6.1 at 420 dpi. The capture set covers
both modes on both screens. Cover windows are 840×2289 px; the unfolded main
window is 1768×2208 px with a vertical FLAT folding feature at x=884 px.

The main 3-button capture reports a 126 px (48 dp) bottom system inset. The main
gesture capture reports 168 px (64 dp), while Settings/configuration and 78 px
side system-gesture regions verify gesture navigation. InsetsProbe's inset-only
classifier reports 3-button for that gesture capture. User screenshots show the
persistent Taskbar in both Buttons and Swipe gestures settings. Treat this as a
Fold3/taskbar configuration where gesture mode can have a larger bottom system
inset than 3-button; do not reject the capture or infer navigation mode from the
bottom inset alone. Preserve the raw measurements unchanged.

### Verified Flip8 FlexWindow recapture

Galaxy Z Flip8 (SM-F776B) was folded and InsetsProbe 1.2.1 was launched from its
registered cover AppWidget. Both accepted captures report `display.id: 1`,
`screenLabelSource: flexWindowWidget`, and an exact **948×1048 px** portrait
window matching the official cover layout:

- logical size: **399.16×441.26 dp** at Android density **380 dpi**;
- system bars: **0/0/48/0 dp** (top/right/bottom/left) in both modes;
- display cutout safe inset: **88 dp / 209 px** from the bottom;
- cutout bounds: **428,839–948,1048 px**;
- corner radii: **12 px** at the top and **97 px** at the bottom.

The captures independently verify 3-button and gesture navigation. RTL again
reported a 180° hinge angle with no folding feature, so cover identity comes from
the FlexWindow launch source, display ID and exact active-window resolution—not
the hinge sensor. The untouched legacy `cover-threeButton.json` remains an inner
display mislabeled as cover; accepted cover evidence is stored under
`measurements/galaxy-z-flip8/recapture-2026-09-23/`.

### RTL access outcome

The earlier 403 was transient. After the user completed Samsung authentication
manually, the reservation catalog and live WebClient both opened. Galaxy Z Fold8
was available and successfully reserved for 30 minutes / 2 credits. This confirms
that model's reservability on the checked date, but not the complete catalog or
future slot availability.

## Overview

windowinsets.info is a reference site for Android window insets, display cutouts, corner radii and foldable hinge states across Samsung Galaxy devices. Every value is labeled **official** (published by Samsung/Google), **measured** (captured with InsetsProbe on RTL or a real device, raw JSON committed), or **community** (unverified).

**Current Status**: Galaxy Z Fold8, Fold7, Fold6, Fold5, Fold4 and Flip8 cover and inner displays
are measured in both navigation modes from verified live RTL sessions. Flip5 and
Flip6 main screens are measured in both modes; no official cover skins were supplied.
Galaxy S26, S25 and S24 series main screens (including S25 Edge, S25 FE and
S24 FE), Galaxy S23 Ultra, Galaxy S23 FE, Galaxy S23, Galaxy S22 Ultra, Galaxy S22+ and Galaxy S22 have natural, rotation 1 and rotation 3
captures in both navigation modes. Galaxy S23+ still lacks gesture rotation 3.
See "Rotation sweep captured" below for units and capture directories.

## RTL Credits & Cost

Samsung's current policy page says 20 credits per day, but the authenticated UI
granted only 10 credits on 2026-09-23 and limited that action to once per day.
Plan from the confirmed live balance, not the published maximum. One credit buys
15 minutes and the minimum reservation is 30 minutes / 2 credits, so an observed
10-credit grant supports at most five minimum reservations without refunds.

See [RTL_CREDITS.md](RTL_CREDITS.md) for primary sources, the dated 0→10 UI
observation, the prior 20-credit booking history, early-close refunds and the
operational budget rule. The UI exposed no reset countdown or timezone; a fixed
24-hour reset must not be claimed without evidence.

Other notes:
- Closing/losing the RTL WebClient session triggers a full device restart (~1–2 min) before it can be reserved again — avoid closing mid-task.
- The separate WebClient window is controllable through Computer Use when it is
  visible. Its streamed Android canvas often lacks accessibility nodes, so use fresh
  screenshots and coordinates. Authentication and unreliable lock-screen steps
  remain manual handoffs.

## Known Issue: Intermittent 403 Forbidden on developer.samsung.com/remotetestlab/*

Throughout this project, RTL's own pages (`/remotetestlab/devices`, `/remotetestlab/reservations`, even the marketing page at `/remote-test-lab`) have intermittently returned a bare **403 Forbidden** — sometimes on direct URL navigation, sometimes on an in-app link click, sometimes for a logged-in session that was working seconds earlier. Retrying after a short wait (10–30s) usually clears it; sometimes a full re-login is needed.

**This is a known, widely-reported issue on Samsung's own side, not necessarily a problem with the login flow, cookies, or browser used:**

- [403 Forbidden — Samsung Developer Forums](https://forum.developer.samsung.com/t/403-forbidden/34558)
- [Can no longer access RTL — Samsung Developer Program](https://forum.developer.samsung.com/t/can-no-longer-access-rtl/39361)
- [The remote test lab doesn't work — Samsung Community (EU)](https://eu.community.samsung.com/t5/mobile-apps-services/the-remote-test-lab-doesn-t-work/td-p/11105920)
- [Remote Test Lab not working, but still taking my credits](https://forum.developer.samsung.com/t/remote-test-lab-not-working-but-still-taking-my-credits/32396)
- [Remote test lab down?](https://forum.developer.samsung.com/t/remote-test-lab-down/13322)
- [Can't login to Remote Test Lab](https://forum.developer.samsung.com/t/cant-login-to-remote-test-lab/27808)
- [Cannot use the Remote Test Lab](https://forum.developer.samsung.com/t/cannot-use-the-remote-test-lab/23934)
- [Samsung's own troubleshooting doc: "Troubleshooting Common Issues While Using the Remote Test Lab Service"](https://developer.samsung.com/sdp/blog/en/2022/08/23/troubleshooting-common-issues-while-using-the-remote-test-lab-service)

Causes reported across those threads (any combination may apply): stale browser cache/cookies for the domain, 2FA session hiccups, Samsung-side rate limiting/WAF, and occasional real outages. One user reported clearing several weeks of browser data fixed it; Samsung's own guidance for persistent cases is to file a support ticket.

I separately confirmed during this project that the RTL single-page app itself can throw a client-side JS error (`TypeError: Cannot read properties of null (reading 'filter')` in its own minified bundle) that leaves the page blank/unresponsive (including a dead "Sign in" button) — this looks like the SPA choking on a null array somewhere in its own state (likely related to the same underlying session/rate-limit flakiness), not a bug in this project's code.

**What worked in practice**: retry after 10–30s; re-enter through the marketing page (`developer.samsung.com/remote-test-lab`) rather than deep-linking straight to `/remotetestlab/devices`; if the SPA is visibly crashed (blank sidebar, unresponsive buttons), a hard reload or fresh tab is needed rather than continuing to click around the broken state.

## Live RTL constraints

These looked like automation bugs at first but are real Android/Samsung platform behavior, confirmed by re-testing after fixing the actual code bugs:

1. **A label never switches displays, but the WebClient folding control can.**
   The Probe Cover/Main radio buttons remain labels only. On a foldable RTL device,
   use the right-side folding control to choose Folded or Unfolded, wait for the
   active window size to change, then choose the matching Probe label. Fold8 cover
   and inner were captured separately this way. Do not infer a display change from
   the radio button or hinge angle alone.

2. **`Settings.Secure.putInt(navigation_mode, ...)` is silently ignored on real Samsung hardware.** This was suspected from the start (there was already a code comment about it) and got compounded by a real bug (see below), but even after fixing the bug, a fresh timestamped re-test on Fold8 still came back `"navigation.mode": "threeButton"` after requesting gesture mode programmatically. **There is no way to switch navigation mode from InsetsProbe on real Samsung hardware.** Gesture-mode captures require a human to manually switch it via **Settings → Display → Navigation bar → Swipe gestures**, then tap the individual **"Measure"** button (not "Measure All") once.

## Fixed Bugs (for real, unlike #2 above)

### Bug 1: `measureAll()` never actually changed nav mode

The nav-mode RadioGroup's `onCheckedChangeListener` guarded `setNavMode()` behind `!measureAllInProgress` — which is `false` for the *entire* automated run, so the guard silently skipped every `setNavMode()` call during Measure All. Combined with limitation #2 above, this meant every "gesture" capture actually stayed in whatever mode was already active, and since `export()` names files from the *actually captured* mode (not the requested one), both mode-passes for a screen collided on the same filename and silently overwrote each other — which is why early runs produced only 2 files instead of 4.

**Fix**: call `setNavMode()` explicitly in the automation loop instead of relying on the guarded listener.

### Bug 2: Fixed-delay timing instead of a real completion signal

Originally used a guessed fixed delay (300ms, later 600ms) before exporting. Per review feedback ("isn't there a callback for this?") — yes: `ViewCompat.setOnApplyWindowInsetsListener` already fires on every real insets change. Reworked `measureAll()` to arm a `pendingModeCheck` hook invoked from that listener, so it reacts the instant `Probe.modeFromInsets(latestInsets)` matches the requested mode, with a 3-second timeout `Runnable` (properly cancelled via `removeCallbacks` once confirmed) as a safety net for limitation #2.

### Bug 3: FoldPreview's 3D fold animation sometimes rendered flat

The CSS `rotateY`/`rotateX` transform was verified correct via devtools (`getComputedStyle`), but screenshots after a slider interaction sometimes still showed the pre-interaction flat frame — a Chromium compositor-layer-promotion quirk with CSS 3D transforms that update after first paint. **Fix**: added `will-change: transform` to the rotating panels, forcing them onto their own compositor layer so updates are reliably repainted.

### Bug 4: InsetsDiagram SVG letterboxed the phone shape smaller than it should be

The `<svg>` had `className="w-full max-w-lg"` (fills container width) **and** `style={{maxHeight: 420}}` independently — when the resulting box's aspect ratio didn't match the `viewBox`'s real device ratio, the content got centered/shrunk (letterboxed) inside a mismatched box, making the phone look artificially small with lots of surrounding whitespace. **Fix**: size the SVG by height with `width: "auto"`, so the element's own box matches the content's true aspect ratio instead of stretching to fill available width.

*(Note: `FoldPreview`, referenced in Bug 3 above, was later fully replaced by the three.js-based `FoldRenderer3D` — see the Data Flow section below. Bug 3's fix is kept here only as a historical record; it no longer applies to any component in the current codebase.)*

### Bug 5: Fold8's book-fold rendered portrait (tall) instead of landscape (wide) when flat

Android's `screenWidthDp`/`screenHeightDp` reflect whatever rotation the app happened to be running in at capture time — they are **not** a fixed "panel shape". Fold8's main-screen capture came back `orientation: "portrait"` (475×751 dp), and `FoldRenderer3D` was feeding that directly into the plane's width/height, so the fully-open ("Flat") pose rendered as a tall narrow rectangle. Physically wrong: a book-fold's vertical hinge splits the panel into left/right halves, so opening it **doubles the width**, not the height — flat must be landscape. (Cross-checked against the closed-state ratio the user described, ~4:3: half of the captured 751.24 dp height ≈ 375.6, and 475.43:375.6 ≈ 4:3.16 — consistent with the panel actually being landscape once open, captured rotated 90°.)

**Fix**: `FoldRenderer3D` now derives the expected physical silhouette from the fold axis — `vertical` (book) must be landscape, `horizontal` (flip) must be portrait — and if the captured dp values don't already match, rotates the diagram 90° at draw time (rotating the 2D canvas context before calling `drawDiagram`, not a UV/texture rotation) before it becomes the WebGL texture. This keeps every measured number exactly as recorded (insets, cutout position, corner radii are all still laid out in the original captured frame) while presenting the physically correct on-screen orientation. Flip8's capture was already portrait (correct for a flip's flat pose), so it renders unchanged. See the code comments in `FoldRenderer3D.tsx` for the exact rotation math.

**Caveat**: this is a rendering-level correction, not a re-measurement. A cleaner long-term fix is to recapture foldable "main" screens with the probe app run in its natural flat/open rotation so `orientation` in the raw JSON already matches the physical silhouette — see the new capture guidance below.

### Bug 6: `display.name` leaking the RTL device's locale (Korean) into committed JSON

`Display.getName()` returns an OS/locale-dependent string (e.g. `"기본으로 제공되는 화면"` when the rented RTL device's system language was Korean). Two committed sample files had this leak through untouched. **Fix (data)**: both occurrences replaced with `"Built-in Screen"` (the English string Android returns for the same field when the device locale is English — confirmed against the Fold8/Flip8 captures, which already came from an English-locale session). **Fix (process)**: set the RTL device's language to English *before* capturing, so future exports don't need this correction — `display.name` is otherwise not used by the website at all, but keeping the repo's committed JSON in English avoids Korean text leaking into a public English-language repo.

## Complete Measurement Workflow

### Step 1: Reserve Device on Samsung RTL

1. Go to [developer.samsung.com/remote-test-lab](https://developer.samsung.com/remote-test-lab).
2. Stop at Samsung authentication and ask the user to sign in manually. Never enter
   credentials, solve CAPTCHA or approve account verification.
3. After the user confirms login, reopen the target and verify that reservation
   options appear without a sign-in notice.
4. Select **30 min / 2 credits**, re-check the exact model and start the reservation.
5. Keep the WebClient window open. Computer Use can operate its visible controls;
   hand off only an inaccessible popup, permission prompt, power-on or unlock step.

### Step 2: Install InsetsProbe APK

1. Build from `tools/insets-probe` with
   `./gradlew :app:testDebugUnitTest :app:assembleDebug`.
2. In WebClient choose **Applications**, click the install/upload icon, then use
   macOS **Cmd+Shift+G** in the file chooser and enter the absolute path to
   `tools/insets-probe/app/build/outputs/apk/debug/app-debug.apk`.
3. Wait for `InsetsProbe info.windowinsets.probe` to appear, select its row and
   click Start.
4. If the display is black, click the lower physical side button in the rendered
   device frame to wake it. Ask the user to unlock manually when a swipe, PIN,
   biometric or lock-screen transition is not reliable through the remote stream.

### Step 3: Capture Measurements

Do not use Measure All (removed in 1.1.0). Capture each active display and
navigation mode explicitly; InsetsProbe 1.4.0+ captures every rotation of that
display in one step:

1. Confirm the physical RTL state and Probe active-window size. On Fold8, the
   WebClient's middle Folded option produced the 1248×1972 cover; Unfolded produced
   the 2448×1848 inner display.
2. Select the matching Probe radio label and tap **Rotate & measure all
   orientations**. The app turns itself to portrait, landscape and reverse
   landscape, waits for each rotated window to settle and saves one file per
   rotation; do not rotate the RTL device by hand. Check the summary line: saved
   file names and any skipped step (a display that did not rotate, or a rotation
   already recorded). Accept the captures only when the file names match the
   intended screen and actual nav mode. **Measure** still captures the current
   rotation only.
3. Use **Display / navigation settings**, scroll to **Navigation bar**, select
   **Swipe gestures**, then use the left-edge back gesture twice to return to Probe.
4. Run **Rotate & measure all orientations** again and verify the `*-gesture*`
   file names in the summary.
5. For foldables, repeat after physically switching the WebClient display. Verify
   resolution after every switch; the label does not change the display.
6. File names (issues #22, #24): the natural rotation keeps `main-*` /
   `cover-*`; other rotations are saved beside them as
   `landscape-<rotation>-<nav>.json` on phones (rotation 1 = side button up,
   cutout on the left; rotation 3 = the reverse) and with a screen prefix on
   foldables (`cover-landscape-1-gesture.json`, `main-portrait-1-gesture.json`).
   Keep both rotation 1 and 3: never mirror one into the other, and never rotate a
   portrait capture into landscape. Pilot decision (2026-09-27, #24/#30): 3-button
   rotation 1/3 pairs on Galaxy S23+, Z Fold8 cover and Z Flip8 main kept the status
   bar on top while the navigation bar and cutout switched sides (a 180° rotation of
   the 90° capture would be wrong); horizontal mirroring matched those three pairs
   only and stays unverified elsewhere. Portrait and landscape status bars also
   differed on all three (74→84, 110→79, 108→90 px). So each rotation is its own
   sweep capture; a display that does not rotate (e.g. Flip8 cover) stays pending
   for the missing rotations.
   Earlier landscape captures were taken by rotating the RTL device by hand; they
   remain valid evidence.

### Step 4: Export & Commit Data

1. Open WebClient **File Browser** and navigate to
   `Android/data/info.windowinsets.probe/files`.
2. Hover each JSON row to reveal its download icon. RTL downloads them as
   `content`, `content (1)`, etc.; do not trust those browser filenames. A sweep
   adds up to three files per navigation mode. (Direct upload from the probe is
   planned in #28 and would replace this step.)
3. Inspect `screen`, `navigation.mode`, `display.rotation`,
   `display.currentWindowPx`, model and timestamp inside every download before
   assigning an evidence path; the rotation decides the file name.
4. Preserve superseded raw evidence. If canonical filenames already exist, add a
   dated recapture directory instead of overwriting them.
5. Register only accepted values, update coverage/workflow docs, then run
   `pnpm typecheck`, `node --test tests/rendering.test.mjs`, and `pnpm build`.

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
| Galaxy Z Fold7 | SM-F966U | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold7/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold8 Ultra | SM-F976U | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/`) | None |
| Galaxy S23+ | SM-S916U | Main: 3-button rotation 1 and 3; gesture rotation 1 (pilot, captured by hand rotation) | Main gesture rotation 3 |
| Galaxy Z Fold8 | SM-F971N | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold8/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold6 | SM-F956U | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold6/recapture-2026-09-27-rotation/`) | None |
| Galaxy S26 Ultra | SM-S948U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s26-ultra/recapture-2026-09-27-rotation/`) | None |
| Galaxy S24+ | SM-S926N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s24-plus/recapture-2026-09-28-rotation/`) | None |
| Galaxy S24 | SM-S921N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s24/recapture-2026-09-28-rotation/`) | None |
| Galaxy S23 Ultra | SM-S918U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s23-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S23 | SM-S911B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s23/recapture-2026-09-28-rotation/`) | None |
| Galaxy S24 FE | SM-S721N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s24-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy S23 FE | SM-S711B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s23-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy S21 FE | SM-G990B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s21-fe/recapture-2026-09-29-rotation/`) | None |
| Galaxy S21+ | SM-G996B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s21-plus/recapture-2026-09-29-rotation/`) | None |
| Galaxy S21 Ultra | SM-G998B / SM-G998U1 | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s21-ultra/recapture-2026-09-29-rotation/`) | None |
| Galaxy S22 Ultra | SM-S908B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s22-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S22+ | SM-S906B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s22-plus/recapture-2026-09-28-rotation/`; 3-button natural reconstructed from the preserved RTL log) | None |
| Galaxy S22 | SM-S901E | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s22/recapture-2026-09-28-rotation/`; five files reconstructed from the preserved RTL logs) | None |
| Galaxy S25 | SM-S931N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s25/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25 FE | SM-S731N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s25-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25 Edge | SM-S937N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s25-edge/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25+ | SM-S936N (user device) | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s25-plus/recapture-2026-09-28-rotation/`) | None |
| Galaxy S25 Ultra | SM-S938N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s25-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S24 Ultra | SM-S928N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s24-ultra/recapture-2026-09-28-rotation/`) | None |
| Galaxy S26+ | SM-S947N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s26-plus/recapture-2026-09-28-rotation/`) | None |
| Galaxy S26 | SM-S942N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-s26/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Fold5 | SM-F946B | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold4 | SM-F936B | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold4/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold3 | SM-F926B | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold3/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z TriFold | SM-F968N | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-trifold/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Flip8 | SM-F776B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip8/recapture-2026-09-27-rotation/`). Cover: natural in both modes on display 1 at 948×1048 px | Cover rotation 1 and 3 remain pending because this RTL cover did not rotate |
| Galaxy Z Flip7 | SM-F766N | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip7/recapture-2026-09-27-rotation/`). Cover: natural in both modes on display 1 at 948×1048 px (`recapture-2026-09-28-flexwindow/`) | Cover rotation 1 and 3 remain pending because this RTL cover did not rotate |
| Galaxy Z Flip7 FE | SM-F761B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip7-fe/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Flip3 | SM-F711B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip3/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Flip4 | SM-F721B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip4/recapture-2026-09-28-rotation/`) | None |
| Galaxy Z Flip6 | SM-F741U | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip6/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Flip5 | SM-F731B | Main: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-flip5/recapture-2026-09-27-rotation/`) | None |
| Galaxy Z Fold2 | SM-F916N (user device) | Cover and inner: natural, rotation 1 and 3 in both modes (`measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/`) | None |

### Natural rotation only — full sweep needed

Recapture every listed screen in both navigation modes. Use the queue order in
`.agents/skills/samsung-rtl-insets/SKILL.md`: Fold, then Flip, then S, then Tab,
Note and A.

| Series | Devices | Screens |
| --- | --- | --- |
| Galaxy Z Flip | original Z Flip (not listed on RTL as of 2026-09-28) | Main (no cover skin) |
| Galaxy S | S21, S20 Ultra, S20 FE | Main |
| Galaxy Tab | Tab S11 Ultra, S11, S10 Ultra, S10+, S10 FE+, S10 FE, S10 Lite, S9 Ultra, S9+, S9 FE+, S9 FE, S9, S8 Ultra, S8+, S8, S7+, S7 FE, A11, A9+, A7 Lite | Main, all four rotations in both modes (natural rotation is landscape on most tablets) |
| Galaxy Note | Note20 Ultra, Note20 | Main |
| Galaxy A | A73, A57, A56, A55, A53, A52s, A37, A36, A35, A34, A33, A32 5G, A32, A27, A25, A24, A23, A17, A16, A15, A14 5G, A13 LTE, A07, A06, A05, A04 | Main |

Existing gaps in the natural-rotation data remain open alongside the sweep.
The canonical Galaxy Z Flip8 cover has 3-button only. Galaxy S24 Ultra, A73 5G
and Tab S9 FE keep their second mode in dated recapture directories. See
`docs/RTL_COVERAGE.md` for per-device capture details.

**Measurement Conditions**: full screen, default Display/Font size and One UI +
Android version are recorded per capture. Orientation is evidence, not a default:
Fold8 cover is portrait and its verified inner capture is landscape. Probe dp is
`px ÷ (densityDpi ÷ 160)` rounded to 2 decimals, while the website preserves and
displays the original px separately instead of reconstructing it from rounded dp.

Galaxy S25's 2026-09-24 RTL captures are from SM-S931N_KR1 in Korea/Gumi on
Android 16 / One UI 8.5, build `BP4A.251205.006.S931NKSSBCZG3`. Both main
navigation modes report display 0, rotation 0, a settled full-screen 1080×2340 px
window, 480 dpi, font scale 1 and matching Settings/configuration mode evidence.

Galaxy S24 Ultra's 2026-09-24 RTL recaptures are from SM-S928N-KR3 in Korea/Gumi
on Android 16 / One UI 8.5, build `BP4A.251205.006.S928NKSS6DZG1`. Both main
navigation modes report display 0, rotation 0, a settled full-screen 1080×2340 px
window, 450 dpi, font scale 1 and matching Settings/configuration mode evidence.
The original gesture capture remains at the canonical path; the recapture pair is
in `measurements/galaxy-s24-ultra/recapture-2026-09-24/`. Neither raw file
includes a cutout bounding rectangle, so the top display-cutout inset is
registered without a bounding rectangle in that historical dataset. The
2026-09-28 rotation recapture includes a measured cutout rectangle in all six
files and supplies the current device page.

## InsetsProbe App: Architecture

**Location**: `tools/insets-probe/`

- **WindowInsets Reader / DisplayCutout Parser / RoundedCorner Support / FoldingFeature Tracking** — see `Probe.kt`. Also captures `displayCutout.boundingRects` (the cutout's real x/y/width/height, not just how far it intrudes) — used by the website to draw the actual punch-hole position (see below).
- **Navigation Mode Toggle**: UI-only convenience; does **not** reliably change the real system nav mode on Samsung hardware (limitation #2).
- **Measure All**: now uses `Probe.modeFromInsets()` (public) + the real `OnApplyWindowInsetsListener` callback for completion detection, not a fixed delay. See `MainActivity.kt`.

## Data Flow: Device → JSON → TypeScript → Website

1. **InsetsProbe** exports raw JSON (schemaVersion 2) with device/display/navigation/insets/displayCutout/roundedCorners/hinge and explicit capture context.
2. **Raw JSON committed** to `measurements/<device-slug>/<screen>-<navMode>.json` — source of truth, never hand-edited.
3. **TypeScript device file** (`app/data/devices/<slug>/index.ts`) implements `Device` (see `app/data/types.ts`): dp-converted insets per nav mode, `cornerRadiiDp`, optional `cutoutShape` (real punch-hole position, when the raw capture has `boundingRects`), sources with GitHub links.
4. **Website**: React Router, statically prerendered. `app/components/DeviceView.tsx` holds the full device-detail render — a single uniform toolbar row (Navigation / Pose / Hinge / Zoom dropdowns + a settings gear, all one button style, matching safearea.info's own toolbar exactly) plus the diagram, metrics, and sources — shared by both the `/​:slug` route and the home page. Home (`/`) renders `DeviceView` for `devices[0]` (the newest device) directly — safearea.info-style landing straight on its equivalent of iPhone Duo, instead of a separate list-only summary page. `zoom`/`showFrame`/`showRegions`/`showDimensions`/`units` all live as state in `DeviceView` and are passed down as props — both diagram components below are now fully controlled, so there's exactly one toolbar on the page, never a second private one duplicated inside a component. It shows:
   - **Bar phones**: `InsetsDiagram` — flat 2D SVG diagram with dimension lines/arrows, per-edge inset chips, corner-radius chips, the real cutout shape at its measured position, schematic (unmeasured) speaker/button marks, and mouse-wheel zoom. No inner max-height/overflow cap — like safearea.info, zooming in just grows the diagram (and the page scrolls), it doesn't get boxed into a fixed viewport.
   - **Foldables**: `FoldRenderer3D` — a genuine WebGL (three.js) renderer, not a CSS 3D transform. A plane mesh subdivided along the hinge axis bends around a cylindrical arc as the hinge angle changes (0°=closed, 180°=flat), with the *entire* diagram (bezel, colored regions, real cutout, corner chips, dimension arrows) baked into a single 2D canvas texture applied to the mesh — every label bends with the surface for free, no separate 3D-projection math for text. `axis="vertical"` for book-style folds (Z Fold), `axis="horizontal"` for flip-style (Z Flip). Only a narrow "hinge zone" actually curves (real screens are rigid glass on either side of the hinge mechanism, not flexible along their whole length); everything outside it stays flat and rotates as a rigid body tangent to the curve boundary. Also auto-corrects the captured dp values to the physically-correct silhouette orientation per fold axis — see Bug 5 above. This single component now replaces the old two-component split (`InsetsDiagram` + `FoldPreview`) that safearea.info's own single-diagram UX had been the target for; **that merge is done**, `FoldPreview.tsx` and the old per-component toolbars (`Segmented.tsx`) have been deleted.
   - Toolbar zoom range: 25–500% (button steps of 10%, or free via mouse wheel) on both diagram types — no artificial low ceiling; safearea.info itself demonstrates zooming well past 250%, and there was no reason to stop earlier.
   - `Metrics` panel — one value per row (Dimensions / Safe Area Insets / Display Cutout / Corner Radii / Measured On), not cramped multi-value lines.
   - Sidebar (`shell.tsx`) — 3 flat category tabs (**Galaxy S / Galaxy Z Fold / Galaxy Z Flip**), each independently sorted; search overrides tabs and searches everything. `devices.ts` orders newest-first, and within the same release year by Samsung's own tier convention (Ultra > Plus > base).

## SEO / Sharing

`app/lib/seo.ts` provides a shared `pageMeta()` helper used by all 4 routes: full OG + Twitter Card tags (title, description, type, site_name, image + dimensions/alt, canonical), following safearea.info's pattern.

**Favicon + OG image are done**, hand-authored as SVG and rasterized with `rsvg-convert` (no AI image-gen tooling was available this session, but that CLI tool was on the machine):
- `public/favicon.svg` (+ `favicon-32.png`, `apple-touch-icon.png`) — a small device silhouette in the site's own color language, linked via `root.tsx`'s `Route.LinksFunction`, layered above the legacy `favicon.ico`.
- `public/og-default.png` (1200×630) — matches the same Safe Area/Insets/Corner Radius legend used throughout the site. Source kept at `public/og-source.svg` for future edits without needing image tools.

## Build Verification

`vite.config.ts` defines `__BUILD_COMMIT__` from `git rev-parse --short HEAD` at build time. It's exposed only as a `data-build-commit` attribute on the root `<div>` in `shell.tsx` — **not shown in the UI** — inspect via view-source/devtools to confirm you're not looking at a stale cached page after a deploy.

## Best Practices / Data Quality Checklist

- Never estimate a value — leave `null`/pending until actually measured.
- `logicalSizeDp × densityDpi` should be internally consistent with
  `logicalSizePx` (`dp = px ÷ (densityDpi ÷ 160)`). `resolutionPx` is the sourced
  physical panel resolution and may legitimately differ from the captured window.
- Insets need all 4 sides (even if 0); `formFactor` is `"bar" | "foldable-book" | "foldable-flip"` (not `"phone"`).
- `cornerRadiiDp`: all four corners or omit (`null`) entirely.
- Source tier: `official` only for published specs; `measured` for RTL/device captures; `community` for unreproduced submissions.
- Run `pnpm typecheck && pnpm build` before committing device data changes — the build's prerender step will fail loudly on a malformed `Device`.

## Computer Use automation notes

RTL's reservation pages and separate live WebClient window were both operated
successfully through Computer Use. The Android stream itself usually has no useful
accessibility tree, so every device action must be derived from a fresh screenshot.
This includes the right-bezel power button, Probe radio buttons, Settings scrolling,
the folding-state menu and File Browser row actions. Stop and ask the user only for
authentication, an inaccessible permission/popup, or a lock-screen gesture that is
not reliable through the stream.

Browser downloads still use numbered duplicate names such as `content` and
`content (1)`. The JSON fields, not the browser filename, determine the accepted
screen and navigation-mode identity.

### File Paths to Reference

- `tools/insets-probe/app/src/main/java/info/windowinsets/probe/{MainActivity,Probe}.kt` — capture + automation logic
- `app/data/types.ts` — `Device`, `Screen`, `InsetsMeasurement`, `CutoutShape`, `FormFactor`
- `app/data/devices/galaxy-z-fold8/index.ts` — complete foldable example with
  cover/inner captures in both nav modes and a measured cover cutout shape
- `app/components/DeviceView.tsx` — shared full device-detail render (used by home + `/:slug`), owns the single unified toolbar's state
- `app/components/Dropdown.tsx` — the reusable "Label: Value ▾" toolbar button (Navigation/Pose/Hinge/Zoom all use this)
- `app/components/InsetsDiagram.tsx` — bar-phone 2D SVG diagram (controlled: zoom/settings come in as props)
- `app/components/FoldRenderer3D.tsx` — foldable three.js diagram (controlled the same way); see Bug 5 above for the silhouette-rotation logic and the file's own code comments for the hinge-bend math
- `app/lib/seo.ts` — shared OG/Twitter meta helper
- `app/routes/shell.tsx` — sidebar layout, category tabs, search
- `app/data/devices.ts` — device registry, newest-first, Ultra > Plus > base within a year
- Branding source of truth is now [design/brand/README.md](../design/brand/README.md).
  The old `public/og-source.svg` is retired; do not regenerate the current OG image
  from it. The generated illustration and matching corner-mark favicon replace the
  earlier hand-authored device silhouette described above.

### Recommendations

1. Use the repository's `samsung-rtl-insets` skill so reservation, install,
   power/wake, screen switching, nav-mode switching, export and validation follow
   the same verified sequence.
2. Preserve the "measure 3-button, manually flip Settings, measure gesture again"
   pattern per physical display. Do not use Measure All or treat a radio label as a
   display switch.
3. Budget 2 credits (30 min) per reservation. Use the live header balance rather
   than assuming the published 20-credit allowance; the 2026-09-23 account grant
   was 10 credits.
4. When adding a device, always run `pnpm typecheck && pnpm build` — malformed `Device` objects fail the prerender step loudly, which is the fastest signal something's wrong before it reaches production.
5. When capturing a foldable's main screen, run the probe app in its natural flat/open rotation if at all possible, so the raw JSON's `orientation`/`screenWidthDp`/`screenHeightDp` already match the physical silhouette (landscape for book-fold, portrait for flip-fold) — this avoids needing `FoldRenderer3D`'s draw-time rotation correction (Bug 5) for new devices.
6. Set the RTL device's system language to English before capturing, so `display.name` (locale-dependent) doesn't leak non-English text into committed JSON (Bug 6).
7. **Open backlog, highest priority first** (per explicit product direction): Galaxy Tab support > dark mode > Korean/English site i18n. Tab support should come before either of the other two, not after.

## S26 Ultra accepted capture — 2026-09-23

Samsung RTL Korea/Gumi SM-S948U_KR3, Android 16 / One UI 8.5, build
BP4A.251205.006.S948USQS4AZG3, InsetsProbe 1.2.1. The normal portrait screen
was captured at rotation 0 in both navigation modes. The active window is
1080×2340 px, 384×832 dp, 450 dpi at the device's default FHD+ resolution;
Samsung publishes the physical panel as 1440×3120 px, 6.9 inches. The captured
window and physical panel are separate measurements. Both captures report
37.33 dp top system bar, 36.98 dp top cutout safe inset, a 60×104 px centered
cutout rectangle, and 79 px / 28.09 dp corner radii. The 3-button bottom bar is
135 px / 48 dp; gesture is 42 px / 14.93 dp. Android's navigation setting and
Probe's classification agree for each file. Raw accepted evidence is in
`measurements/galaxy-s26-ultra/main-{threeButton,gesture}.json`.

An initial gesture export after using RTL's Rotate control recorded rotation 2
and an upside-down cutout. It was rejected before repository import. Rotating
back to 0 and recapturing produced the accepted upright file. RTL's screen video
lagged during Settings transitions, so each destination screen was allowed to
settle before the next touch. The Samsung WebClient removed the Ultra tab after
early return but displayed a client-side `postMessage` error; verify any credit
refund from the account balance rather than assuming it succeeded.

## Verified original Galaxy Z Flip capture — 2026-09-24

Samsung RTL India/Noida model SM-F700F-IN5, Android 13 / One UI 5.1.1,
InsetsProbe 1.3.0. The original Galaxy Z Flip's official skin contains only the
main display. Its upright portrait captures match the 1080×2636 px main layout;
both active and maximum windows report that size, density is the default 480 dpi,
and font scale is 1. The WindowManager folding feature reports a horizontal FLAT
line at y=1318 px; the hinge-angle sensor is unavailable. The 3-button and
gesture modes agree with Android Settings and Probe. The main display reports a
91 px centered top cutout, 92 px top system bar, 144 px 3-button bottom bar or
45 px gesture bottom bar, and 108 px rounded corners. Raw captures are
`measurements/galaxy-z-flip/main-threeButton.json` and
`measurements/galaxy-z-flip/main-gesture.json`. Cover remains unmeasured because
the imported official skin has no cover layout.

Galaxy S25 Edge's 2026-09-24 RTL captures are from SM-S937N_KR10 in Korea/Gumi
on Android 16 / One UI 8.5, build `BP4A.251205.006.S937NKSS9CZG3`. Both main
navigation modes report display 0, rotation 0, full-screen 1080×2340 px FHD+
window, 450 dpi and font scale 1. The official panel is 1440×3120 px.

Galaxy S25 FE's 2026-09-24 RTL captures are from SM-S731N_KR1 in Korea/Gumi
on Android 16 / One UI 8.5, build `BP4A.251205.006.S731NKSS8BZG3`. Both main
navigation modes report display 0, rotation 0, full-screen 1080×2340 px window,
450 dpi and font scale 1. Screen timeout was set to 10 minutes.

## Galaxy S24+ RTL capture — 2026-09-24

Samsung RTL Korea/Gumi SM-S926N-KR3 (Android 16 / One UI 8.5) produced main
3-button and gesture captures at 1080×2340 px / 450 dpi. Both files report
matching navigation settings and inset classifications, portrait rotation 0,
font scale 1 and the centered cutout bounds. InsetsProbe labels the non-folding
display `phone`; the accepted file uses the site's `main` screen filename and
keeps the raw label unchanged. The gesture file was downloaded as `content (33)`
and validated from its JSON fields before being copied unchanged to
`measurements/galaxy-s24-plus/main-gesture.json`. The earlier stale-export symptom
is tracked in [issue #12](https://github.com/easyhooon/windowinsets.info/issues/12).

## Galaxy S24 RTL capture — 2026-09-24

Samsung RTL Korea/Gumi SM-S921N-KR3 (Android 16 / One UI 8.5) produced main
3-button and gesture captures at 1080×2340 px / 480 dpi. Both downloaded JSON
files report display 0, rotation 0, screen label `main`, and matching navigation
settings/inset classifications. The centered cutout bounds are present in both
files. The accepted evidence is `measurements/galaxy-s24/main-threeButton.json`
and `measurements/galaxy-s24/main-gesture.json`.

## Galaxy Z TriFold — 2026-09-24 and 2026-09-25

Samsung RTL SM-F968N_KR1, Korea/Gumi, Android 16 / One UI 8.5, build
`BP4A.251205.006.F968NKSS6BZG3`. Main 3-button and gesture captures are
2160×1584 px, natural landscape (rotation 0), 320 dpi, Taskbar off. Cover
gesture is 1080×2520 px, portrait, 420 dpi. The 2026-09-24 session did not yield
the cover 3-button file. A second Korea/Gumi reservation on 2026-09-25 captured it
at 2026-09-24T15:17:37Z: 1080×2520 px, display 0, rotation 0, 420 dpi, default
density 320 dpi and fontScale 1. Probe and Settings agree on three-button mode. It is preserved as
`measurements/galaxy-z-trifold/cover-threeButton.json`; all four screen/mode
captures are now registered.

File Browser delivered only main-threeButton.json. The other two accepted
captures were recovered through WebClient Logs filtered to `InsetsProbe`, then
**save logs**. Original downloaded logs are retained in `rtl-logs/`. JSON message
fields were extracted in order, removing only the tab-separated log metadata;
complete objects were parsed independently (the cover log also contains the prior
main gesture capture). No values were filled from another capture.

After physically switching screens, Probe could retain the previous display's
density until restarted. Both gesture captures were taken after restarting Probe.
Cover reports densityDpi 420 while defaultDensityDpi remains 320. RTL's hinge
sensor reports 0° even unfolded; main exposes one vertical FLAT feature at x=1080.
This API report does not describe the two physical hinges. The initial main
fontScale 1.08 capture is retained separately and not published.
