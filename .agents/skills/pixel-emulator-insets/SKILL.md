---
name: pixel-emulator-insets
description: "Collect Google Pixel WindowInsets evidence from headless Android Emulator AVDs (issue #23): pick the next Pixel target, boot it, run scripts/capture-emulator.py across screens, navigation modes and rotations, validate the JSON, stage it with provenance, and record lessons back into this skill."
---

# Pixel Emulator Insets

Run this workflow from the WindowInsets repository. The authoritative rules are
`AGENTS.md`, `docs/MEASUREMENT_WORKFLOW.md`, `docs/DEVICE_COVERAGE.md` and
`tools/insets-probe/README.md`; read their current versions before acting. Issue
#23 ("Expand device coverage beyond Samsung") is the strategy of record.

Emulator captures are a distinct evidence class. They show what the Android
framework reports for an AVD device profile (display size, density, cutout
spec, rounded corners, fold states). They are not real-hardware captures and
must never be labelled or merged as such.

## 1. Choose the target

Work one AVD at a time. Order:

1. Pixel foldables, newest first (`pixel_10_pro_fold`, `pixel_9_pro_fold`,
   `pixel_fold`).
2. Pixel phones, newest first; within a generation Pro XL, Pro, base, `a`.
3. Pixel Tablet.

List the device profiles the installed SDK knows:

```bash
~/Library/Android/sdk/cmdline-tools/latest/bin/avdmanager list device -c | grep -i pixel
ls ~/Library/Android/sdk/skins
```

A target needs both a device profile and an emulator skin. A profile without a
skin is a data-only capture; record the missing artwork instead of drawing one.

Completion criterion: name the AVD, the screens (`main,cover` for foldables,
`phone` otherwise) and why no higher-priority target is ahead.

## 2. Prepare the host

- Free disk space before booting; an AVD needs several GB. Unused
  `system-images/` can be removed with the user's standing permission.
- Use only the SDK `adb` (`~/Library/Android/sdk/platform-tools/adb`). A second
  adb on `PATH` (Homebrew 33.x) fights over the daemon on port 5037 and makes
  commands fail intermittently.
- Build the probe **without** an upload key so emulator JSON never reaches the
  real-device capture inbox:

  ```bash
  (cd tools/insets-probe && ./gradlew :app:assembleDebug -PinsetsProbeUploadKey=)
  ```

  Copy the APK out of the build directory right away and pass that copy with
  `--apk`; physical-device work rebuilds the same path with the key from
  `~/.gradle/gradle.properties`. The script refuses an APK containing that key.
  A keyed build uploads a sweep automatically; on 2026-09-27 one emulator
  landscape capture reached the capture-inbox PR this way, and a later batch
  was stopped when a keyed rebuild replaced the APK mid-run.
- Create the AVD with the newest installed system image and attach its skin:

  ```bash
  echo no | ~/Library/Android/sdk/cmdline-tools/latest/bin/avdmanager create avd \
    -n wi_<profile> -d <profile> -k "system-images;android-37.0;google_apis_playstore;arm64-v8a"
  ```

  If `config.ini` lacks `skin.name`/`skin.path`, append them pointing at
  `~/Library/Android/sdk/skins/<profile>`.

## 3. Boot headless and capture

```bash
~/Library/Android/sdk/emulator/emulator -avd wi_<profile> -no-window -no-audio -no-snapshot -no-boot-anim   # background
python3 scripts/capture-emulator.py --apk <keyless.apk> --out <scratchpad>/pixel-captures                                    # add --screens phone for bar phones
```

The script waits for boot, installs the keyless APK, clears the export folder
and loops navigation mode → screen → rotation. It writes raw probe JSON and a
`manifest.json` with AVD, device profile, skin, system image, build fingerprint
and the installed emulator version. Stop the emulator with `adb emu kill`
before booting the next AVD, and restart it after an SDK update so the running
binary matches the recorded version.

Behaviour the script relies on (keep it in sync when this changes):

- `adb emu fold` / `adb emu unfold` switch the physical display; wait for the
  committed device state (`CLOSED` / `OPENED`) from `cmd device_state state`.
- Navigation mode: `cmd overlay enable-exclusive --category
  com.android.internal.systemui.navbar.{gestural,threebutton}`; verify
  `settings get secure navigation_mode` (2 gesture, 0 three-button).
- Android 16+ ignores app orientation requests on large screens, so the inner
  display is rotated with `cmd window user-rotation lock N`. Wait for
  `mRotation=N` before launching the probe; it refuses to export while the
  display is changing and exports only once per launch, so relaunch on a block.
- Phone-sized displays (cover, bar phones) honor app requests, and the
  launcher's portrait lock reverts a user rotation set while it is on top. Use
  the probe's own sweep there (`--ez sweep true`) and wait for the
  `InsetsProbe: Sweep saved` log line. The sweep records only rotations the
  system allows (typically 0, 1, 3).
- Force-stop the probe before every fold or navigation change. A running probe
  recreates on the change and exports again under the stale label.
- `adb exec-out screencap` needs `-d <physicalDisplayId>` on foldables; list ids
  with `dumpsys SurfaceFlinger --display-id`.

Completion criterion: `manifest.json` lists every screen × navigation mode ×
rotation, or the failing combination is reported with the probe's
`Capture blocked` reason.

## 4. Validate

For every file check: `device.model` is `sdk_gphone64_*`, fresh `capturedAt`,
`screen` label, `display.rotation`, `widthPx × heightPx` against the device
profile, `navigation.mode` from insets agreeing with the setting, hinge state
(`FLAT` 180° on main, no folding feature on cover), `displayCutout` and
`roundedCorners`.

Rerun the same AVD on a different emulator build when one is available; values
should be identical. Compare cutout and corner geometry against the factory
image's framework overlay (`config_mainBuiltInDisplayCutout`,
`rounded_corner_radius`) or verified real-device captures before publishing.
The emulator profile may reuse geometry across models: on 2026-09-27 Pixel 10
Pro Fold reported the same inner cutout and corner radii as Pixel 9 Pro Fold.

Completion criterion: every file is accepted with a stated reason or kept as
rejected evidence.

## 5. Stage and document

Keep emulator captures out of the capture inbox. To register, copy a
validated run to `measurements/<slug>/emulator-<date>/` (raw JSON beside
`manifest.json`, never mixed with real-device files) and run
`python3 scripts/import-emulator-captures.py <slug>`. It validates the files,
copies the AOSP skin with `source.json` (Apache 2.0) and regenerates the device
module, `app/data/aospSkins.ts` and `app/data/devices/pixel.ts`. New models need
an entry in `scripts/pixel-devices.json` with a Google spec source first. Then
update the registered/pending lists in the Pixel section of
`docs/DEVICE_COVERAGE.md`.

## 6. Improve this skill

After each run, append new failure modes, timings and device quirks to the
lessons below or fold them into the steps above, and fix
`scripts/capture-emulator.py` rather than documenting a manual workaround.
Remove lessons that no longer hold.

### Lessons

- 2026-09-27: Pixel 9 Pro Fold and Pixel 10 Pro Fold each produced 14 captures
  (main rotations 0–3 and cover sweep 0/1/3, in both navigation modes). The
  Pixel 9 Pro Fold values were identical on emulator 36.4.9 and 37.1.11.
- 2026-09-27: On the inner display the cutout follows the profile's side
  overrides: top at rotations 0/1, bottom at 2/3. The status bar is 136 px when
  the cutout is on top and 88 px otherwise.
- 2026-09-27: A bar-phone AVD took about 1.3 minutes to capture. Check for all
  six files before registering: the first Pixel 10 Pro XL sweep saved only five,
  so it was rerun. Pixel 4a's first install failed with `device offline` just
  after boot; `capture-emulator.py` now retries that specific transient failure.
- 2026-09-27: A zero navigation-bar inset can make the probe's independent
  `modeFromInsets` heuristic return `unknown`, particularly in landscape. The
  resolved mode still agrees with the secure setting in the registered runs;
  validate `navigation.mode` and `settingAgreesWithInsets` as the importer does.
