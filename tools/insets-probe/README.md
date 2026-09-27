# InsetsProbe

Dumps everything [windowinsets.info](https://windowinsets.info) needs for one screen and one navigation mode, as JSON.

## What it records

- Device: manufacturer, model, Android version, One UI version (`SEM_PLATFORM_INT`), build id
- Display: pixel size, `densityDpi` vs the device's default density, font scale, window size in dp
- Navigation mode (gesture / 3-button / 2-button)
- `WindowInsets`: status bars, navigation bars, system bars, display cutout, caption bar, system gestures, mandatory system gestures, tappable element — in px and dp, with and without visibility
- `DisplayCutout`: safe insets, bounding rects, waterfall insets, optional OS cutout path (1.3.0+)
- `RoundedCorner` for all four corners (from window insets and from `Display`)
- Foldables: `FoldingFeature` (state, orientation, occlusion, bounds) and the hinge angle sensor

## How to measure

1. Build and install: `./gradlew :app:installDebug` (needs `sdk.dir` in `local.properties`), or install the APK on Samsung Remote Test Lab.
2. Set the device to its **default** Display size, Font size and, on Samsung, **Screen resolution** (HD+/FHD+/WQHD+). Screen resolution changes the pixel size and Display size changes `densityDpi`, so both change the dp values. The JSON records `widthPx`/`heightPx`, `densityDpi` and `defaultDensityDpi` so a non-default setting is visible.
3. Choose the navigation mode you are recording (Settings → Display → Navigation bar).
4. App in full screen (not split-screen / pop-up). Tap **Rotate & measure all orientations** to capture every orientation, or hold the device in **portrait** and tap **Measure** for one.
5. Foldables: physically open/close the device (or use a verified RTL device-state control), then pick **Cover** or **Main** to label the active screen. These buttons do not switch displays. Check the visible active-window pixel size and hinge reading before saving. A portrait/landscape rotation is not a cover/main switch.
6. Tap **Copy JSON**. The file is also saved to the app's external files dir and logged under the `InsetsProbe` tag:

   ```bash
   adb logcat -s InsetsProbe
   adb pull /sdcard/Android/data/info.windowinsets.probe/files/
   ```

7. Save it as `measurements/<device-slug>/<screen>-<navMode>.json` at the repo root.

Repeat for every screen × navigation mode. Do not edit the JSON by hand.

## Galaxy Z Flip5 and later: launch on FlexWindow

For the implementation contract, validation rules, and Flip8 failure history,
see the dedicated [FlexWindow README](FLEXWINDOW_README.md).

Samsung does not document an application manifest flag that enrolls an arbitrary
activity in the built-in FlexWindow favorite-app list. That list and the optional
Good Lock / MultiStar launcher are controlled by the device. InsetsProbe instead
includes Samsung's documented FlexWindow AppWidget entry point:

1. Install InsetsProbe, then open **Settings → Cover screen → Widgets**.
2. Enable the **InsetsProbe** widget.
3. Close and unlock the phone, swipe left to the widget, then tap
   **Open cover probe**.
4. Confirm that the status line says `display 1`, that Active window equals Full
   display, and that both are the physical cover size before measuring. On Flip8
   this must be exactly `948 × 1048 px`. The widget preselects **Cover**.

If Samsung does not list the widget on a specific software build, use Good Lock's
MultiStar launcher as the device-side fallback. Launching InsetsProbe from the
inner Applications list is not a cover launch. A widget launch that falls back to
another display or does not fill that display's maximum bounds is rejected during
export so it cannot create mislabeled evidence. Widget-origin JSON records
`screenLabelSource: flexWindowWidget`; ordinary launches remain `manual`.

Implementation references: [Samsung Flex Window](https://developer.samsung.com/galaxy-z/flex_window.html)
and [Samsung's Flex Window widget codelab](https://developer.samsung.com/codelab/galaxy-z/widget-flex-window.html).

## Automation

```bash
adb shell am start -n info.windowinsets.probe/.MainActivity --es screen main --ez export true
adb pull /sdcard/Android/data/info.windowinsets.probe/files/
```

`--es screen` accepts `cover` or `main` (default `phone`); `--ez export true` saves the JSON one second after launch. See [sample-output](sample-output) for a real capture.

## Version 1.4.0: orientation sweep

- **Rotate & measure all orientations** requests portrait, landscape and reverse
  landscape from inside the app (`setRequestedOrientation`), so nobody has to rotate
  the RTL device. Each step waits until the window really has the requested shape and
  no insets/configuration callback has arrived for 700 ms, then captures fresh
  root-window insets exactly like **Measure**. The app returns to unspecified
  orientation when done.
- Values are always what Android reports in that rotation. A display that does not
  rotate within 6 s (for example a locked cover screen), or that stays at a rotation
  already recorded, is skipped and listed; nothing is derived or relabeled.
- File names include the display rotation: natural rotation keeps the legacy name
  (`main-gesture.json`); others get a suffix (`main-gesture-rot90.json`,
  `main-gesture-rot270.json`). This also applies to a single **Measure**.
- Larger buttons (the sweep button is full width) because RTL shows a scaled-down screen.
- Automation: `adb shell am start -n info.windowinsets.probe/.MainActivity --es screen main --ez sweep true`.

Run one sweep per screen × navigation mode.

## Version 1.1.1: verified on Galaxy Z Fold2

Android 13 resource display metrics reported 1768×1976 while the full window was
1768×2208 (88 px status bar + 144 px navigation bar). `widthPx`/`heightPx` now use
`currentWindowMetrics`; original resource dimensions remain in `appMetricsPx`.
`screenWidthDp`/`screenHeightDp` still reflect Android configuration and can exclude
system bars. Use full-window bounds divided by density for the website diagram.
See [WindowMetrics bounds](https://developer.android.com/reference/android/view/WindowMetrics#getBounds()).

One UI version now comes from the device's `ro.build.version.oneui` property.
Fold2 reports 50101 (5.1.1); subtracting 90000 from SEM_PLATFORM_INT 140500 incorrectly
produced 5.5. The raw platform integer remains recorded; unknown versions stay unknown.

## Version 1.1.0: capture corrections

- Removed **Measure All**: it iterated labels without changing the physical display,
  producing duplicate captures under different names. Navigation-mode writes were
  also unreliable on the tested Samsung hardware. Use Android Settings manually.
- Measure, Copy and Share now collect fresh root-window insets and metrics at the
  moment of export. They no longer save a cached JSON snapshot from an earlier callback.
- Export waits for a settled full-screen window and rejects Main when the hinge
  reports closed (≤5°). Missing hinge data remains unknown; it does not prove Main.
- Schema 2 records screen-label provenance, probe version, display rotation,
  multi-window status and root-view dimensions. Old schema-1 raw captures are retained.

Validation: `./gradlew :app:testDebugUnitTest :app:assembleDebug`.
APK: `app/build/outputs/apk/debug/app-debug.apk`. Unit tests and APK build passed
locally; actual Fold8 display-transition capture still needs a connected device
or a working RTL session. No new measured values were generated by this change.

## Version 1.1.2: gesture navigation with a taskbar

Fold2 on One UI 5.1.1 exposes 48 dp of navigation/tappable bottom insets even
with swipe gestures enabled, because the persistent taskbar remains visible.
The old bottom-inset heuristic mislabeled this as three-button navigation.
The active gestural resource configuration plus nonzero left/right system-gesture
regions now establishes gesture mode. A secure-setting write alone still cannot
claim that navigation changed. Raw heuristic/setting fields remain in the output,
and `modeSource` identifies the combined evidence. Insets are never modified.
See [Android inset definitions](https://developer.android.com/develop/ui/compose/system/insets).

## Version 1.2.1: stale RTL hinge sensor handling

- A full-screen Main capture is accepted when WindowManager reports a real
  `FoldingFeature`, even if RTL's hinge-angle sensor remains at 0° after the
  physical display switches to the unfolded panel.
- A Main label with a closed hinge and no folding feature remains blocked. The
  active/full window dimensions and raw hinge value are still recorded.

## Version 1.2.0: FlexWindow widget launcher

- Adds Samsung's documented `sub_screen` AppWidget metadata so InsetsProbe can be
  enabled under Cover screen widgets.
- Launches the measurement activity on Samsung's documented cover display ID 1
  and preselects the Cover label.
- Shows the actual display ID and full-display bounds, and rejects export if the
  system opens a widget launch on a different display or a non-full-display window.
- Records `screenLabelSource: flexWindowWidget` for captures launched by the
  widget instead of incorrectly describing that label as manual.

## Version 1.3.0: optional cutout contour capture

`displayCutout.path` records `getCutoutPath()` when returned by Android (API 31+).
It contains `coordinateSpace: display`, `units: px`, the Android `fillType`,
`approximationTolerancePx: 0.25`, and `approximation` entries with `fraction`, `x`,
and `y`. These are `Path.approximate` samples, not exact Bézier commands. Preserve
fractions: consecutive equal fractions can mark moves between disconnected contours.
Do not join all points into one polygon or confuse display-space path coordinates
with window-relative rectangle coordinates in a non-full-screen capture.

A null path means the API returned none; an absent field in a pre-1.3.0 capture
means it was not collected. The existing captures are unchanged. No claim of
real-device contour availability is made until a new capture is collected.
Bounding rectangles may group several cameras on one edge. An OS path may help
measure a finer contour, but does not identify cameras or guarantee individual
lens diameters/spacing. Artwork pixels remain illustrative.

References: [DisplayCutout](https://developer.android.com/reference/android/view/DisplayCutout#getCutoutPath())
and [Path.approximate](https://developer.android.com/reference/android/graphics/Path#approximate(float)).
