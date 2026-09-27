# Pixel hardware validation with Firebase Test Lab

The published Pixel values come from local Android Emulator profiles. They are
labelled `emulator` evidence, not Pixel hardware measurements. Issue #23 treats
Firebase Test Lab (FTL) physical devices as a later spot check. A successful
emulator capture does not establish that a physical device reports the same
cutout, rounded corners or insets.

## First physical-phone pilot

1. Use the dedicated `windowinsets-testlab-2026` Firebase project. It was
   created on 2026-09-28 under the maintainer's Google account with Google
   Analytics disabled. It is on the Spark plan, with no billing account linked.
   Spark currently allows five physical-device test runs per project per day at
   no cost. Check the current quota before running tests. Do not add an upload
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
     --robo-script tools/insets-probe/testlab/phone-portrait.robo.json \
     --device model=MODEL_ID,version=OS_VERSION_ID,locale=en,orientation=portrait \
     --directories-to-pull /sdcard/Android/data/info.windowinsets.probe/files \
     --client-details matrixLabel=Pixel-hardware-insets-pilot
   ```

   The script clears earlier exports, launches InsetsProbe with `screen=phone`
   and `export=true`, waits for a settled capture, then stops the crawl. Verify
   the resulting JSON after downloading it. Test Lab pulls files from this
   app-specific directory successfully on the tested Pixel 10 Pro XL.

5. Keep the downloaded JSON unchanged in a dated physical-device evidence
   folder separate from `emulator-*/`. Check `device.model`, Android/build ID,
   `screen`, rotation, full-window size, density, font scale, navigation mode,
   `settingAgreesWithInsets`, cutout bounds/path and rounded corners before
   comparing with the matching emulator capture. Do not relabel or overwrite
   either source. A mismatch is a finding, not a value to silently replace.

The first pilot covers one portrait screen in the device's existing navigation
mode. A separate test plan is needed for the other navigation mode, rotations,
and Fold cover/inner states. Do not claim a complete hardware validation from
one successful test. Prioritize the Pixel 10 Pro Fold inner cutout and corners:
its emulator profile reported the same geometry as Pixel 9 Pro Fold. If the
exact Fold models are unavailable in FTL, report that catalog limitation and
use factory-image overlays as a geometry cross-check without calling them
runtime hardware measurements.

The catalog checked on 2026-09-28 offers physical Pixel 10 Pro XL (`mustang`)
and Pixel 10 Pro Fold (`rango`) on API 36, Pixel Tablet (`tangorpro`) on API 33
and 36, and Pixel Watch (`r11`) on API 30. The FTL catalog includes physical
models for 20 of the 22 public Pixel entries; Pixel
6 Pro and Pixel 4a are absent from this snapshot. Requesting those models or
using a supplied physical device is needed for their hardware measurements.
The published local Pixel emulator captures use API 37, so an FTL difference
can also reflect the OS version. The
catalog reports 1080×2404 for `mustang`, while its local emulator profile uses
1344×2992; compare dp and geometry relative to the active display dimensions,
and record the physical device's actual reported resolution. The current FTL
catalog contains no Galaxy Watch model. Test Lab measurements do not supply
device artwork. Issue #35 concerns the Pixel Tablet frame's contrast on the
website and requires a rendering change, not a Test Lab measurement.

## First run: Pixel 10 Pro XL

The first Spark test matrix, `matrix-2lt0sk1fhxcls`, ran on physical `mustang`
with API 36 and passed. [FTL result](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/7029552250955893712).
The keyless APK produced a portrait gesture capture at 1080×2404, 390 dpi,
Android 16, build `BD1A.250702.001`. Both navigation detectors agreed. The
Google-hosted result bucket successfully collected JSON from the app-specific
directory. The first script's `ls` command had an `expectedOutputRegex` that
Robo marked as a script action failure even though the command action reported
success. Robo then explored the app and generated four additional captures.
The script now skips the inline `ls` check and leaves file validation to the
download step; verify the corrected termination behavior on the next run.
The portrait file retained by the Robo exploration has `screen=main` even
though this is a bar phone: the probe's screen label is manual and does not
switch the display. Its display and cutout geometry are useful for this spot
check, but it is not a valid phone-labelled capture for direct publication.
Re-run this model with the corrected script before using an FTL value as a
published measured source.

The portrait cutout **path** spans about 31.6×31.6 dp on the physical phone,
versus about 31.3×31.3 dp on the API 37 emulator. Display corner radius is
50.46 dp versus 51 dp. The OS exclusion rectangle is different: physical
cutout/top inset 66.05 dp, emulator 53 dp. These captures also differ in
Android version and active resolution, so this run validates the near-matching
physical camera path and corner shape but does not explain the exclusion-area
difference. Keep the physical capture as separate evidence and do not replace
published emulator values from this one comparison.

## Second run: Pixel 10 Pro Fold inner display

The second Spark test matrix, `matrix-27vyvgp301kyl`, ran on physical `rango`
with API 36 and passed. [FTL result](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/5415288884619478105).
The revised script captured one `main-gesture.json` and ended the Robo crawl.
The capture reports Pixel 10 Pro Fold, Android 16 build `BD3A.251005.003`,
2076×2152, 390 dpi, rotation 0, gesture navigation, and agreement between
navigation detectors. These display dimensions match the API 37 emulator.
The cutout path and all four display corner radii match the emulator capture
at the recorded precision. Its OS cutout exclusion rectangle reaches 160 px
from the top, versus 136 px on the emulator. The Android versions differ, so
this comparison does not establish the cause of that safe-inset difference.
The physical capture is preserved separately in
`measurements/pixel-10-pro-fold/testlab-2026-09-28/`.

## Third run: Pixel 9 Pro Fold inner display

The third Spark test matrix, `matrix-e370qxayj12ua`, ran on physical `comet`
with API 36 and passed. [FTL result](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/8502694126242610502).
The script exported one `main-gesture.json` from Android 16 build
`CP1A.260305.018`, 2076×2152, 390 dpi, rotation 0, gesture mode with agreeing
navigation detectors. The cutout exclusion rectangle, sampled camera path and
four corner radii match the Pixel 9 Pro Fold API 37 emulator exactly at recorded
precision. This supports the emulator geometry for the 9 Pro Fold, while the
10 Pro Fold physical safe inset still differs from its emulator capture. Its
raw result is preserved in `measurements/pixel-9-pro-fold/testlab-2026-09-28/`.

## Fourth matrix: Pixel 8 Pro and Pixel Tablet

The fourth Spark matrix, `matrix-3ehvin61s5bsg`, passed on physical Pixel 8
Pro (`husky`, API 35) and Pixel Tablet (`tangorpro`, API 36), consuming two
physical-device runs. [FTL results](https://console.firebase.google.com/project/windowinsets-testlab-2026/testlab/histories/bh.72510f2109b9f626/matrices/8103305516082310900).
Both scripts exported one portrait gesture JSON and ended normally; their
navigation detectors agreed. Raw files and action logs are preserved in the
respective `measurements/<slug>/testlab-2026-09-28/` directories.

Pixel 8 Pro: the physical Android 15 build `BP1A.250505.005.B1` uses an active
1008×2244 resolution at 360 dpi, while the API 37 emulator uses 1344×2992 at
480 dpi. The sampled camera path has identical dp bounds in both captures.
Physical top cutout/status inset is 50.22 dp versus 50.33 dp on the emulator;
corner radii are 30.22 dp versus 30.33 dp. The active resolution and OS differ,
so retain both provenance records.

Pixel Tablet: the physical Android 16 build `CP1A.260305.018` was captured in
portrait at 1600×2560, with display corner radii of 14 dp at the top and
13.5 dp at the bottom. The API 37 emulator's rotation-0 capture is landscape
2560×1600 and reports null corners. The physical top status inset is 36 dp,
versus 24 dp on that emulator capture. Different orientation and Android
version make these findings **unresolved**, not proof that the emulator's
tablet profile is wrong. Re-run one source in the other's orientation before
deciding whether to change published values. Both report no display cutout.

Five physical test runs were used on the Spark plan on 2026-09-28 (Pixel 10
Pro XL, Pixel 10 Pro Fold, Pixel 9 Pro Fold, Pixel 8 Pro, Pixel Tablet). The
project has no billing account (`billingEnabled=False`). More physical tests
must wait for the free daily quota to renew. The maintainer chose to remain on
Spark and use up to five physical-device runs on each of the next two quota
days. Fifteen catalog-listed Pixel models remain after the first five runs, so
the two additional days cover up to ten of them; a further quota day would be
needed for the final five. Re-run Pixel 10 Pro XL and compare Pixel Tablet in
the matching orientation within that budget if they take priority over new
models. Check the live quota before each batch; do not infer a reset time from
the local calendar day.

Blaze is not needed for this schedule. As of 2026-09-28, it includes 30
physical-device test minutes per project per day, then charges $5 per device
hour, rounded up to a minute. Enabling it requires a linked billing account;
budget alerts notify but do not cap charges. Issue #35 is a website artwork
contrast problem and cannot be resolved by either FTL plan. Do not infer
verification for the remaining Pixel models or for the unmeasured navigation,
rotation or Fold states from these spot checks.

References: [FTL device catalog](https://firebase.google.com/docs/test-lab/android/available-testing-devices),
[Robo script commands](https://firebase.google.com/docs/test-lab/android/robo-scripts-reference),
[results-directory collection](https://cloud.google.com/sdk/gcloud/reference/firebase/test/android/run),
[Test Lab quotas and pricing](https://firebase.google.com/docs/test-lab/usage-quotas-pricing).
