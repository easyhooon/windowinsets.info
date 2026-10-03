# Pixel hardware validation with Firebase Test Lab

## What the Robo test shows

Firebase Test Lab's Robo test installs the APK on a selected device and explores
its UI. A Robo script can run specified actions before that exploration. For
these inset checks, the script starts the keyless InsetsProbe with an explicit
screen label, exports a JSON capture, waits briefly, and terminates the crawl.
The JSON is the measurement evidence; a passing Robo result alone only means
the app and script ran. The console's crawl graph shows visited screens as nodes
and actions as arrows. See [Firebase's Robo test guide](https://firebase.google.com/docs/test-lab/android/robo-ux-test).

The first Pixel 10 Pro XL pilot continued into automatic UI exploration after
one script assertion failed. Its console view and **complete exported crawl
graph** are preserved below. The graph includes launcher and Settings screens
that Robo reached during this extra exploration; those screens are not inset
measurements. Later scripts terminate after the intended export.

![Full Firebase Test Lab Robo results view for the first Pixel 10 Pro XL pilot](images/ftl-robo-pixel-10-pro-xl-console.png)

![Complete Robo crawl graph exported by Firebase Test Lab for the first Pixel 10 Pro XL pilot](images/ftl-robo-pixel-10-pro-xl-graph.png)

The published Pixel values come from local Android Emulator profiles. They are
labelled `emulator` evidence, not Pixel hardware measurements. Issue #23 treats
Firebase Test Lab (FTL) physical devices as a later spot check. A successful
emulator capture does not establish that a physical device reports the same
cutout, rounded corners or insets.

## Physical-device capture procedure

1. Use the dedicated `windowinsets-testlab-2026` Firebase project. It was
   created on 2026-09-28 under the maintainer's Google account with Google
   Analytics disabled. The first five physical runs used Spark. On 2026-09-28,
   the maintainer created a separate billing account and linked it to this
   project, switching it to Blaze. Blaze includes 30 physical-device test
   minutes per project per day, then charges $5 per device-hour in one-minute
   increments. Check the current quota and billing state before running more
   tests; budget alerts are not spending caps. Do not add an upload
   key to the probe APK: a keyed
   build automatically sends a sweep to the real-device capture inbox.
2. List the **current physical** models and supported Android versions with
   `gcloud firebase test android models list --filter=physical --project PROJECT_ID`.
   Verify the selected model with `models describe MODEL_ID`; the FTL catalog
   changes and the model name alone does not identify an OS build.
3. Build the keyless probe and make an immutable copy outside Gradle's shared
   build path:

   ```bash
   (cd tools/insets-probe && ./gradlew :app:assembleDebug -PinsetsProbeUploadKey=)
   cp tools/insets-probe/app/build/outputs/apk/debug/app-debug.apk /tmp/insets-probe-ftl-keyless.apk
   ```

4. Run one short Robo test on a **physical Pixel phone**. Replace the project,
   model and version placeholders with values from the current catalog:

   ```bash
   gcloud firebase test android run \
     --project PROJECT_ID \
     --type robo \
     --app /tmp/insets-probe-ftl-keyless.apk \
     --robo-script tools/insets-probe/testlab/phone-portrait-launch-only.robo.json \
     --device model=MODEL_ID,version=OS_VERSION_ID,locale=en,orientation=portrait \
     --directories-to-pull /sdcard/Android/data/info.windowinsets.probe/files \
     --timeout=2m \
     --client-details matrixLabel=Pixel-hardware-insets-pilot
   ```

   On Test Lab (`firebase.test.lab` system setting `true`), InsetsProbe exports
   once on a plain launch with its default `phone` label; the launch-only
   script only waits, then stops the crawl. Robo ADB shell steps stopped
   running reliably on 2026-10-01 (see [Robo shell steps](#robo-shell-steps)),
   so `phone-portrait.robo.json` and the scripts that pass extras (Fold inner,
   tablet labels) need a retry before a batch. The timeout bounds each device
   execution. Verify the resulting JSON after downloading it.

5. Keep the downloaded JSON unchanged in a dated physical-device evidence
   folder separate from `emulator-*/`. Check `device.model`, Android/build ID,
   `screen`, rotation, full-window size, density, font scale, navigation mode,
   `settingAgreesWithInsets`, cutout bounds/path and rounded corners before
   comparing with the matching emulator capture. Do not relabel or overwrite
   either source. A mismatch is a finding, not a value to silently replace.

Each spot check covers one screen in the device's existing navigation mode.
Other navigation modes, rotations and Fold cover/inner states need a separate
test plan; do not claim a complete hardware validation from these runs. If an
exact model is unavailable in FTL, report that catalog limitation and use
factory-image overlays only as a geometry cross-check, never as runtime
hardware measurements.

The published Pixel emulator captures use API 37, while the FTL physical
devices ran API 30–36, so a difference can also reflect the OS version. Active
resolution can differ too (for example 1080×2404 on physical `mustang` versus
1344×2992 in its AVD): compare dp and geometry relative to the active display
dimensions and record the physical device's reported resolution. The FTL
catalog contains no Galaxy Watch model, and Test Lab measurements do not supply
device artwork.

## Status

**21 of 23 public Pixel models** are spot-checked on physical FTL devices in
gesture mode. Every capture identifies the expected Google Pixel model and API,
reports gesture navigation with both detectors agreeing, and is a full-window
capture. Pixel 6 Pro and Pixel 4a were absent from the FTL physical catalog
checked on 2026-10-01; [issue #46](https://github.com/easyhooon/windowinsets.info/issues/46)
tracks them. All published site values keep their API 37 emulator provenance;
the differences below are findings, not corrections to raw captures or
published values.

## Runs

Raw files, action logs, result URLs and SHA-256 checksums are in each
`measurements/pixel/<slug>/testlab-<date>/` manifest. Recaptures use separate
subdirectories, so no earlier raw file was changed.

| Date | Matrix | Devices | Notes |
| --- | --- | --- | --- |
| 2026-09-28 (Spark) | [`matrix-2lt0sk1fhxcls`](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/7029552250955893712) | Pixel 10 Pro XL (`mustang`, API 36) | First pilot. An `ls` `expectedOutputRegex` was marked a script failure, so Robo explored and produced extra captures; the retained portrait file is labelled `main` and is superseded by the Blaze recapture |
| 2026-09-28 (Spark) | [`matrix-27vyvgp301kyl`](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/5415288884619478105) | Pixel 10 Pro Fold inner (`rango`, API 36) | One `main-gesture.json`, crawl ended normally |
| 2026-09-28 (Spark) | [`matrix-e370qxayj12ua`](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/8502694126242610502) | Pixel 9 Pro Fold inner (`comet`, API 36) | One `main-gesture.json` |
| 2026-09-28 (Spark) | [`matrix-3ehvin61s5bsg`](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/8103305516082310900) | Pixel 8 Pro (`husky`, API 35), Pixel Tablet portrait (`tangorpro`, API 36) | Two runs |
| 2026-09-28 (Blaze) | [`matrix-3qe6bitme0p6b`](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/5423514632819986165) and per-manifest URLs | 14 previously unchecked models, Pixel 10 Pro XL recapture, Pixel Tablet landscape, Pixel Fold landscape inner | 17 executions, all passed with an exported JSON |
| 2026-10-01 | see manifest | Pixel 5 (`redfin`, API 30) | Launch-only script; see below |
| 2026-10-01 | `matrix-2adqpl4s5g8rg`, `matrix-23sw6o4bhn4ez` | Pixel 10a (`stallion`, API 36) | First run stopped at a shell step; launch-only rerun passed |

## Findings

**Camera path and corner radii.** Match the AVD at recorded precision for
Pixel 10 Pro Fold, Pixel 9 Pro Fold, Pixel 9, Pixel 8, Pixel 8a, Pixel 7,
Pixel 7a, Pixel 6 and Pixel 6a. Pixel 10 Pro XL, Pixel 9 Pro XL, Pixel 9 Pro,
Pixel 8 Pro and Pixel 7 Pro are close (roughly 0.1–0.5 dp in path size or
corner radius); for example Pixel 10 Pro XL's path spans about 31.6×31.6 dp
versus 31.3×31.3 dp, with a 50.46 dp versus 51 dp corner. The physical Pixel
10 Pro path is about 1.2 dp smaller and its corner radius about 2 dp smaller;
Pixel 10's corner radius is about 2.3 dp larger. Pixel 9a's physical corner
radius is 43.81 dp versus 50.29 dp, despite a near-matching camera path.

**Cutout exclusion rectangle (safe top inset).** It can differ even when the
camera path matches: Pixel 10 Pro XL 66.05 dp versus 53 dp in the AVD, Pixel 9
65.90 versus 54.10 dp, Pixel 6a 44.95 versus 50.29 dp, and the Pixel 10 Pro
Fold inner display 160 px versus 136 px from the top at matching 2076×2152.
The Pixel 9 Pro Fold inner exclusion rectangle matches exactly. Pixel 8, 8a,
7, 7a and 6 match the AVD top cutout inset; Pixel 8 Pro (50.22 versus
50.33 dp, at 1008×2244 / 360 dpi versus 1344×2992 / 480 dpi) and 7 Pro are
within about 0.2 dp.

**Null AVD corners.** The matched-size, rotation-0 Pixel Fold inner recapture
reports 2208×1840 and physical corner radii of 19.81 dp (top) and 18.29 dp
(bottom); the AVD reports `null` corners at the same size and rotation. Its
status-bar top inset is 41.90 dp versus 28.19 dp. The initial Fold batch
capture (portrait, rotation 1, manually labelled `phone`) is retained but not
used for this comparison. Pixel Tablet reports 14 dp (top) and 13.5 dp
(bottom) corners in both its portrait 1600×2560 capture and its rotation-1
landscape 2560×1600 recapture; the rotation-0 landscape AVD capture reports
`null` corners. Its status-bar top inset is 36 dp versus 24 dp. The OS build
and rotation index still differ, so this stays **unresolved**, not proof that
the tablet profile is wrong. Neither Fold inner nor Tablet reports a cutout.

### Pixel 5 on API 30

FTL offers Pixel 5 (`redfin`) only on API 30. InsetsProbe 1.7.0 lowers
`minSdk` to 30: on API 30 it records `displayCutout.path` and `roundedCorners`
as `null` and lists them in `apiLimits`, because `getCutoutPath()` and
`RoundedCorner` arrived in API 31. Robo ADB shell steps did not run on this
device (the first attempt stopped at `am force-stop`), so it used the
launch-only script. The passing run is preserved in
`measurements/pixel/pixel-5/testlab-2026-10-01/` with its manifest and hashes.

The physical capture (Android 11, build `RQ3A.211001.001`) matches the API 37
AVD on window size (1080×2340 px), density (440 dpi) and the top-left cutout
(inset 136 px, bounds 0,0–136,136 px). System bars differ with the OS version:
status bar 145 px versus 136 px in the AVD, and the gesture navigation bar
44 px versus 66 px. Cutout path and corner radii could not be compared on
API 30.

### Robo shell steps

Pixel 10a's first run with `phone-portrait.robo.json` (`matrix-2adqpl4s5g8rg`)
also stopped at the first ADB shell step, although the same script passed on
API 32–36 devices on 2026-09-28, so shell steps no longer run reliably
independent of API level. The `phone-portrait-launch-only.robo.json` rerun
(`matrix-23sw6o4bhn4ez`) passed; the capture is in
`measurements/pixel/pixel-10a/testlab-2026-10-01/`. It matches the API 37 AVD
on window size (1080×2424 px), density (420 dpi) and the gesture navigation
bar (63 px). The top cutout inset and status bar are 152 px versus 142 px, the
cutout bounds 484–596 × 0–152 px versus 485–595 × 0–142 px, and the corner
radius 115 px (43.81 dp) versus 132 px (50.29 dp), the same corner difference
recorded for Pixel 9a.

## Billing

Blaze billing is active for the dedicated FTL project. The 30-minute daily
allowance and $5/device-hour overage are service pricing, not a confirmed
invoice; inspect Cloud Billing for actual charges. The 2-minute per-device
limit bounded these runs, and all completed well below that limit.

References: [FTL device catalog](https://firebase.google.com/docs/test-lab/android/available-testing-devices),
[Robo script commands](https://firebase.google.com/docs/test-lab/android/robo-scripts-reference),
[results-directory collection](https://cloud.google.com/sdk/gcloud/reference/firebase/test/android/run),
[Test Lab quotas and pricing](https://firebase.google.com/docs/test-lab/usage-quotas-pricing).
