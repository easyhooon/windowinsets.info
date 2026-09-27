# FlexWindow: launch and measure on a Galaxy Z Flip cover display

InsetsProbe measures Android `WindowInsets` on the display that actually hosts
`MainActivity`. A `Cover` selection is only a label: it cannot move an activity
from the inner display to the cover. The widget below is an entry point to the
cover **activity**, not the measurement surface itself. InsetsProbe exports JSON;
it does not measure coordinates from a cover image or Samsung skin.

This is a reusable implementation note for other apps that need an activity on
the FlexWindow. The measured values and validation rules in the last section are
specific to InsetsProbe.

## Why a separate entry point was needed

On Flip8 in Samsung Remote Test Lab (RTL), launching an installed APK through
RTL **Applications** could open it on the hidden inner display while the phone
was folded. An early file named `cover-threeButton.json` therefore contained a
1080 × 2520 inner window. The file is preserved as raw evidence, but its name
does not make it a cover measurement. The later verified cover captures were
launched through the packaged widget and measured 948 × 1048 px on display 1.
See [the dated captures](../../measurements/galaxy-z-flip8/recapture-2026-09-23/)
and [measurement workflow](../../docs/MEASUREMENT_WORKFLOW.md).

Samsung's built-in **Favorite apps** picker filters apps by a compatibility
policy. Its omission of a sideloaded app does not mean installation failed, and
Samsung does not document a manifest flag that adds an arbitrary activity to
that picker. Samsung *does* document an app-owned FlexWindow `AppWidgetProvider`.
We use that documented widget route; Good Lock / MultiStar is a device-side
fallback when a particular firmware does not expose or launch the widget.

## Reusable app implementation

1. Declare a normal `AppWidgetProvider` receiver with both Android's
   `android.appwidget.provider` metadata and Samsung's
   `com.samsung.android.appwidget.provider` metadata. See
   [AndroidManifest.xml](app/src/main/AndroidManifest.xml).
2. Supply [standard widget metadata](app/src/main/res/xml/flex_window_widget_info.xml)
   with `widgetCategory="keyguard"`, `minWidth="352dp"`,
   `minHeight="339dp"`, and `resizeMode="horizontal|vertical"`. These are
   Samsung's widget sizing hints, **not** a device's screen resolution. Supply
   [Samsung metadata](app/src/main/res/xml/samsung_flex_window_widget_info.xml)
   containing `<samsung-appwidget-provider display="sub_screen" />`.
3. Provide a small `RemoteViews` layout with a launch button, as in
   [flex_window_widget.xml](app/src/main/res/layout/flex_window_widget.xml).
   In [FlexWindowWidgetProvider.kt](app/src/main/java/info/windowinsets/probe/FlexWindowWidgetProvider.kt),
   attach a `PendingIntent.getActivity` whose `ActivityOptions` sets
   `launchDisplayId = 1`, the cover ID in Samsung's example. The widget itself
   cannot supply full activity insets.
4. In the launched activity, read its **actual** `displayId` and
   `currentWindowMetrics.bounds`. Do not assume the requested display ID was
   honored. Android may reject or ignore a secondary-display launch on an
   unsupported display. Build the UI for the available window instead of
   assuming the Flip8 size applies to every Flip model.

InsetsProbe also passes `cover`, `expectedDisplayId = 1`, and
`screenLabelSource = flexWindowWidget` in the launch intent. These are our
capture-provenance fields, not Samsung API requirements. The relevant code is
[FlexWindowContract.kt](app/src/main/java/info/windowinsets/probe/FlexWindowContract.kt),
[MainActivity.kt](app/src/main/java/info/windowinsets/probe/MainActivity.kt), and
[CapturePolicy.kt](app/src/main/java/info/windowinsets/probe/CapturePolicy.kt).

Samsung's [Flex Window developer guide](https://developer.samsung.com/galaxy-z/flex_window.html)
and [widget codelab](https://developer.samsung.com/codelab/galaxy-z/widget-flex-window.html)
show the widget metadata and cover launch pattern. Android's
[ActivityOptions reference](https://developer.android.com/reference/android/app/ActivityOptions#setLaunchDisplayId(int))
defines the launch-display behavior. The Samsung developer example was written
for Flip5; verify behavior on each target model and firmware.

## Capture procedure in RTL or on a physical Flip

1. Install the APK. In **Settings → Cover screen → Widgets**, enable
   **InsetsProbe**. Fold and unlock the device, swipe to the widget, then tap
   **Open cover probe**. Do not use RTL's Applications launch for a cover capture.
2. Check the probe status before export: `display 1`, `Cover` selected, and
   **Active window** equal to **Full display**. Compare both pixel dimensions
   with the *target model's* official cover layout. For Flip8, both must be
   948 × 1048 px. `display 1` alone is insufficient if the activity is letterboxed
   or in compatibility mode.
3. Set the desired navigation mode in Android **Settings → Display → Navigation
   bar** and measure once. Repeat after manually changing to the other mode;
   InsetsProbe cannot switch Samsung navigation mode reliably. Preserve the
   original JSON. Use the captured `display.id`, `display.widthPx` / `heightPx`,
   `screenLabelSource`, and window bounds to verify the result before publishing.

Widget-origin exports are blocked if the actual display ID differs from the
expected ID, the root layout is unsettled, the app is in multi-window, or the
active window does not fill the display's maximum window bounds. The operator
must still compare against the model's official resolution; these guards do not
identify every cover panel automatically. Hinge angle alone is not proof of
which screen is active: the verified Flip8 cover captures reported 180° with no
folding feature.

If the widget is missing or cannot open the activity on the cover, try the
device's **Good Lock → MultiStar → Launcher Widget**. Its UI and availability
vary by firmware. Samsung's [cover-screen app guide](https://www.samsung.com/jp/support/mobile-devices/coverdisplay-goodlock/)
describes the alternate launcher. Record the exact failure rather than relabeling
an inner capture as cover.
