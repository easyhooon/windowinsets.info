---
name: samsung-rtl-insets
description: "Continue Samsung Remote Test Lab inset collection: choose the next covered Galaxy Fold, Flip, or S model, automate reservation and visible WebClient controls, hand off authentication or unreliable lock-screen steps, then validate and register InsetsProbe evidence."
---

# Samsung RTL Insets

Run this workflow from the WindowInsets repository. The authoritative project
rules are `AGENTS.md`, `docs/RTL_COVERAGE.md`, `docs/MEASUREMENT_WORKFLOW.md`, and
`tools/insets-probe/README.md`; read their current versions before acting.

## 1. Establish the queue

Inspect `measurements/`, `app/data/devices.ts`, and the skin catalog before opening
RTL. Select one measurement target at a time in this order:

1. Galaxy Z Fold, newest first.
2. Galaxy Z Flip, newest first.
3. Galaxy S, newest first; within a generation use Ultra, Plus, base, then other variants.

Put a known wrong or suspect published measurement ahead of collecting any new
model, then prefer an incomplete measured entry over an older untouched preview.
Include only models covered by the repository's current release policy and
registered official skin. TriFold is supported; apply the same RTL-availability
and capture-evidence rules when collecting its measurements. Missing measurements
remain pending.

Since 2026-09-27 a screen counts as measured only with natural, rotation 1 and
rotation 3 captures in both navigation modes. A device with natural-rotation
captures only is an incomplete measured entry and needs the full sweep again.
Read the rotation status in `docs/MEASUREMENT_WORKFLOW.md` ("Device Status &
Progress") and update it after each device.

Large inner displays (for example Fold7 inner on Android 16) can ignore the
probe's orientation request, so the sweep reports "display did not rotate" and
skips landscape. Rotate with the WebClient Rotate control instead, then press
Measure and Upload at rotations 1 and 3, and return the device to rotation 0.
Uploads keep a separate inbox timestamp directory per capture.

For Galaxy Z Flip cover work, the supported collection scope starts at Flip5.
Treat covers on Flip, Flip3 and Flip4 as unsupported and do not reserve or capture
them. For Flip5 and later, collect cover measurements only when the registered
official skin includes a `cover` screen; if a model is main-only, its cover remains
out of scope until an official cover layout is imported. Prioritize completing
both cover navigation modes on eligible Flip5+ models before lower-priority model
collection.

Measure only one device at a time; this is not a limit on simultaneous
reservations. Samsung's [Web Client guide](https://developer.samsung.com/remotetestlab/doc/get-started-with-web-client)
supports multiple reserved devices in separate tabs. After the current device's
captures are complete and validated, the next requested device may be reserved
while the previous timer still runs. Account for both timers and credit costs;
keep measurement sequential, and finish any incomplete capture before switching.

Completion criterion: name the target, the exact missing screen/navigation-mode
captures, and why no higher-priority eligible target is ahead of it.

## 2. Reserve with Computer Use

Use the available Computer Use controls with the user's existing Chrome session.
If a separate `computer-use` skill is available, follow it; otherwise use the
connected browser controls directly. Re-read the
Chrome accessibility tree after every page transition; never reuse stale element
indexes.

Navigate through Samsung RTL's Device List, open the correct series, and confirm
the exact model name and current availability. A visible catalog is not proof of an
authenticated reservation session: opening the model must reach its reservation
options without a sign-in notice.

For a model with multiple RTL locations or Android versions, check Korean
locations first and prefer a currently available Korean unit. Within the chosen
location, select the newest Android version offered for that model. If no Korean
unit is currently reservable, use an available location that offers the newest
Android version and record the location/version fallback. Verify the final model,
location and OS version in the reservation before starting it.

### Authentication handoff

Authentication is always manual. If Samsung shows Sign in, credentials, QR sign-in,
CAPTCHA, two-factor authentication, or account recovery:

1. Navigate only as far as the Samsung sign-in screen.
2. Tell the user the exact blocker and ask them to complete authentication in Chrome.
3. Do not click Next, choose a saved credential, enter account data, solve CAPTCHA,
   or approve a verification prompt.
4. After the user reports completion, fetch fresh Chrome state and verify reservation
   access by opening the target model again.

Treat `Please sign in if you want to use the Remote Test Lab service.` as an expired
or incomplete RTL session even if the device list remains visible.

For every available target, reserve exactly 30 minutes / 2 credits. This is a
throughput invariant because Samsung charges 1 credit per 15 minutes and 30 minutes
is the minimum reservation. Read `docs/RTL_CREDITS.md` before the first reservation
of a session: Samsung's published 20-credit daily policy conflicts with a live
10-credit once-per-day grant observed on 2026-09-23. Budget from the confirmed
header balance, not the published maximum.
Prepare the APK and capture checklist before reserving. Prioritize complete,
settled captures, downloads and validation. Once all required captures are
uploaded and validated, use the device tab's **close** control in WebClient,
confirm the **Exit** dialog, and check Reservations. If WebClient offers
**Return this device to get back 1 credit(s)**, select it and verify the balance
increased. The visible offer establishes refund eligibility; use the remaining
time as a deadline, not a reason to retry a missing offer. When
no return is offered, **Exit** can end the test while the paid reservation
remains listed until its timer expires. Do not report that reservation as
returned. Record the balance and reservation state before moving to the next
device. Once the remaining time is 15 minutes or less, the unused 15-minute
block is gone: confirm **Exit** and continue with the next target immediately.
Do not wait for the timer to expire or retry the return flow.
Validate captures promptly so an offered refund can still be claimed; keep
collecting while evidence is incomplete. Preserve unresolved captures and their
limitations. Do not extend or renew automatically. Confirm the
reservation dialog still names the intended model and duration before starting.
The user's request to reserve the named queue authorizes this
ordinary reservation; unexpected paid options, terms, permissions, or a target
change require a fresh user decision.

If credits are insufficient, use **Get Free Credits** once and record the exact
notification plus resulting balance. A repeat can report `Available only 1 time a
day`; stop retrying when it does. Treat the header as the current reservation
ceiling. Before booking, inspect **Usage History** for booked credits, but keep them
separate from net consumption because ending early can return unused-time credits.
Stop when fewer than two credits remain.

If RTL returns 403, first retry after a short interval, then re-enter through the RTL
landing page or request a fresh manual login as described in
`docs/MEASUREMENT_WORKFLOW.md`. Preserve the existing tab and reservation whenever
possible because closing the WebClient can restart the device and waste time.
Never close the active WebClient tab as a routine cleanup step while a reservation
is running. Keep it open through download and validation; opening a replacement
tab can restart the remote device and erase unsaved capture files.

Completion criterion: the 30-minute reservation exists for the intended target, or
the user has received the exact access blocker and the single action needed to resume.

## 3. Operate or hand off the live device

Inspect the live WebClient with Computer Use. If its screenshot exposes the device,
continue by coordinates when accessibility elements are absent, taking a fresh
screenshot after every device action. If the popup is invisible, cannot receive
input, or a device control is ambiguous, keep the reservation open and hand that
step to the user.

### Fast path for a regular bar phone

- These screen paths and labels are the standard route for the supported Samsung
  Galaxy devices. Use them as visual landmarks rather than fixed pixel
  coordinates; the remote display and browser viewport can scale differently.
- In Samsung Settings follow **Display > Navigation bar > Swipe gestures**.
  On the Settings home screen, find the **Display** row; on its page, find the
  **Navigation bar** row; on that page, select **Swipe gestures** and confirm its
  radio indicator is selected. The Settings page is rendered inside the remote
  device image, so its controls may not appear in Chrome's accessibility tree.
  Use a fresh WebClient screenshot after each page transition. After a scroll
  drag, let the list settle and take another screenshot before tapping; inertial
  scrolling can move the target row.
- If Probe's **Display / navigation settings** button does not visibly open
  Android Settings, use WebClient **Applications**, select `설정
  com.android.settings`, and close the panel. Do not repeat a tap against an old
  screenshot.
- To return to Probe after Settings was launched from Applications, open
  **Applications** and find the app row named
  `InsetsProbe info.windowinsets.probe`. Select that row, then use the visible
  triangle **▶ Start** control in the panel toolbar. Its accessibility label may
  say `record start`; verify the InsetsProbe screen is visible afterward.
- For a non-folding phone, leave Probe's **Phone** label selected. InsetsProbe
  saves it as `main-<navigation>.json` while preserving `"screen": "phone"` in
  the raw JSON. That pairing is expected; keep the JSON unchanged.
- Export from **File Browser > Android > data > info.windowinsets.probe > files**.
  Follow the visible breadcrumb one folder at a time and confirm the expected
  JSON filename in the `files` directory. Hover or select that row to reveal its
  download arrow at the row's end; confirm a new host file arrived, then validate
  its fresh timestamp, model, dimensions, screen label and both navigation-mode
  fields before copying it to the repo.

### Build and install Probe

1. Build before spending reservation time:
   `cd tools/insets-probe && ./gradlew :app:testDebugUnitTest :app:assembleDebug`.
   Record the APK checksum when traceability matters.
   When using Probe 1.5.0 direct uploads, confirm `insetsProbeUploadKey` is
   configured and that its exact value occurs in the built APK's DEX bytes.
   Report only a Boolean result, never the key. Rebuild and repeat this check
   before reserving if the APK lacks the key; a keyless build saves files on the
   device but cannot send them to the Vercel capture inbox.
2. On a Chrome setup that has returned `Not allowed`, check file selection **before
   reserving**. Use a temporary local page with a plain `input[type=file]` and no
   upload endpoint, in the same Chrome browser session used for RTL. Start
   `waitForEvent('filechooser')` before clicking the input, then call the returned
   chooser's `setFiles` with a small local test file. A successful selection is
   enough; do not submit it anywhere. Do not combine a tab opened through one
   browser session with a chooser obtained through another.
3. If the chooser returns `Not allowed`, treat it as a Chrome/Computer Use file
   selection failure, not a Samsung response or an APK build failure. On
   2026-09-23 the same error occurred on a local page for both the APK and a
   tiny text file, even with tab and chooser in the same session; the user had
   already reported file-URL access enabled. The exact permission or bridge
   failure was not observable. OpenAI's [Chrome extension upload guide](https://learn.chatgpt.com/docs/chrome-extension#upload-files)
   says to enable **Allow access to file URLs** in the extension's Details and
   start the Chrome task again after changing it. Ask the user to verify this in
   the exact active Chrome profile; do not claim the toggle is off when they say
   it is on. If a fresh task still fails one local preflight, stop retries and
   hand off the WebClient **Applications → install** file selection to the user.
   Do not enable Remote Debug Bridge, rebuild the APK, clear Samsung cookies, or
   book another reservation to work around this browser-side failure.
4. Open WebClient **Applications** and click its install/upload icon. Its APK
   `input[type=file]` is hidden, so click the visible install control while a
   `filechooser` listener is armed. On 2026-09-23 the listener timed out after
   clicking both the hidden input and visible control, before `setFiles` ran;
   that result does not establish whether file-URL permission was enabled. If the
   chooser does not appear once, use the native picker or hand installation to
   the user instead of repeating the same browser call. For a native
   macOS file chooser, press **Cmd+Shift+G**, paste the absolute path to
   `tools/insets-probe/app/build/outputs/apk/debug/app-debug.apk`, and choose Open.
   On 2026-09-28 the Chrome `filechooser` listener and `setFiles` succeeded for
   Fold3; use this direct path first, then verify the installed app row appears.
5. Wait for `InsetsProbe info.windowinsets.probe` to appear. Select the application
   row itself, then click the Start/play control.
6. Do not enable Remote Debug Bridge or grant Chrome access to other apps/services
   unless the user explicitly authorizes that permission. The visible WebClient
   workflow does not require RDB.

Known device-specific 0% reports include Fold3, an initial Flip7 FE session,
Galaxy A56, Galaxy A54 and Galaxy A13 (all reported 2026-09-25; exact failing
SKU, OS and RTL location unknown). A later SM-A135F Galaxy A13 LTE session
installed InsetsProbe and produced both navigation captures; this does not
identify or clear the earlier report's failing SKU.
Keep previously validated captures for that model. If 0% recurs, record the exact
SKU, Android / One UI version, RTL location and APK version/checksum; do not treat
one device's stalled install as proof that the APK or model is unsupported.
See the per-model notes in `docs/RTL_COVERAGE.md`.

### Wake, unlock and normalize

- Set language to English and restore default Display size, Font size, and Screen
  resolution before the first capture.
- Set the main **Settings > Display > Screen timeout** to the longest available
  value for the reservation, then restore it only if the workflow requires it.
- If the rendered screen is black, use the physical side-button hitbox drawn on the
  device. Rotation and folded front/rear views move the controls and can reverse
  their apparent order, so identify the short power/fingerprint button from a fresh
  screenshot instead of assuming that it is always above or below the volume rocker.
- Keep browser-viewport coordinates and macOS Computer Use coordinates separate;
  Chrome bars and RTL full-screen transitions change their scale and origin. A
  single deliberate power click may wake or sleep the device, so re-read the same
  coordinate space after every click.
- Lock-screen swipes and authentication are a manual fallback. If one precise
  attempt is unreliable, ask the user to unlock the device and state its exact
  state and remaining reservation time. While the reservation and turn remain
  active, poll the WebClient screen at short, bounded intervals; resume as soon
  as the unlocked screen is visible, without waiting for a reply. Do not guess a
  PIN or repeatedly toggle power. If polling cannot continue in the current
  turn, send a final response so the required user action appears as a
  notification; resume when the user reports completion.
- If the user explicitly says they are unavailable to unlock and at least one
  refundable 15-minute block remains, end the blocked reservation with **Return
  this device to get back 1 credit(s)** selected. Verify the resulting header
  balance, record the blocked attempt, and pause new reservations: another device
  will start at the same lock-screen gate and only consume more credits.
- For a Flip cover session, set **Settings > Cover screen > Cover screen timeout**
  to **30 seconds** before folding. The default 10-second timeout can turn the
  screen off between screenshot and gesture and falsely look like an input failure.
- Automate a cover gesture only from a fresh screenshot in one coordinate space:
  wake with one power-button click, wait for the visible cover, then drag through
  the center of the live display. Use a horizontal right-to-left drag to move from
  the clock/Now Brief page to favorite apps; do not use an upward swipe for that
  page change. Verify the result before another action. If one calibrated attempt
  fails, hand off the unlock/gesture instead of varying coordinates repeatedly.
- When a real cover long press is required, prefer browser CUA with a stationary
  drag path (roughly 45 repeated points followed by a 1 px move) over a macOS drag
  duration. RTL may translate the latter into a short tap and open the app beneath
  the pointer. Re-read the cover immediately and accept only the visible edit state
  or **Open phone to continue** prompt.

### Capture every required state

1. Start with 3-button navigation. Confirm the active window shown by Probe before
   choosing a label.
   Batch captures by navigation mode to avoid revisiting Android Settings: capture
   3-button Main, then each other supported display (for an eligible Flip, launch
   Probe on the folded cover display), switch navigation mode once, then capture
   gesture Main and the other supported display. Keep the screen/mode order
   `3-button main/cover → gesture main/cover` where both displays are supported.
2. For foldables, use the WebClient folding control on the right settings bar.
   Open its menu and choose the explicit Folded, Unfolded or Flex state by tooltip;
   do not infer the state from icon shape alone. Wait for the chassis and active
   window size to settle.
3. For a supported Galaxy Z Flip cover capture (Flip5+ with a registered cover
   skin), complete the **FlexWindow launch** branch before selecting a label:
   - The cover is a separate FlexWindow surface; folding can replace the inner app
     with cover home instead of moving the activity. Starting an app from
     WebClient **Applications** can still target the hidden inner display.
   - Install InsetsProbe 1.2.0 or later. On the unfolded phone open **Settings >
     Cover screen > Widgets**. Scroll to **InsetsProbe**, tap its row to expand it,
     tap the 4x4 preview, then tap the **Add** overlay. The widget is registered
     only when its preview appears in the upper cover layout with a remove icon;
     merely expanding the row does not add it. This uses Samsung's documented
     `sub_screen` AppWidget metadata and launches Probe with
     `ActivityOptions.launchDisplayId = 1`.
   - Fold the device, wake and unlock the cover, swipe horizontally to the
     InsetsProbe widget, and tap **Open cover probe**. The widget preselects Cover.
     Accept a capture only when the status line reports `display 1` and the active
     window matches the official cover dimensions. Flip8 must report 948 x 1048 px.
     Probe blocks export when the widget launch falls back to another display.
   - If the widget is absent on that software build, use the device-side fallback:
     **Good Lock > MultiStar > I ♡ Galaxy Foldable > Cover launcher widget**, add
     InsetsProbe, then launch it from the cover app tray. Installing Good Lock or
     MultiStar is a separate software-install step and requires the applicable user
     approval. The built-in favorite-app picker is a Samsung compatibility list;
     there is no documented manifest flag that enrolls an arbitrary Activity.
   - Starting Probe from WebClient **Applications** while folded is only a negative
     diagnostic: on Flip8 it can start on the hidden inner display and leave the
     cover black. Never treat that as a cover launch. If neither widget nor
     MultiStar can open Probe on display 1, document the compatibility blocker and
     requeue the device; inner-display values are not cover evidence.
4. Select Probe's radio circle matching the physically active display. Cover/Main
   is a manual label and never switches hardware. Validate `display.id`, active
   window dimensions and folding-feature state in every JSON; a Cover label on
   display 0 at inner-display dimensions is not a cover capture.
5. Tap **Measure** and require the toast filename to match the intended combination,
   for example `cover-threeButton.json`. A different filename is a rejected
   attempt, not evidence.
6. For a book fold, capture the folded cover, switch to Unfolded, dismiss any
   one-time multi-window tutorial, choose Main, and capture the inner display.
7. Tap **Display / navigation settings**. In Settings > Display, scroll to
   **Navigation bar**, open it and select **Swipe gestures**. Return to Probe with
   the left-edge back gesture once per screen, verifying the screen after each
   gesture. On a Flip, unfold for the full navigation settings page, apply the
   mode, return to Probe, then fold again and relaunch it from the already-added
   cover widget. Confirm that Probe reports gesture mode on `display 1` before
   measuring.
8. Repeat each physical display in gesture mode and require the matching
   `*-gesture.json` toast.
   On book-fold main displays, inspect Samsung **Settings > Display > Taskbar**
   before capture. A visible Taskbar can enlarge the bottom navigation/system
   inset and make the inset-only navigation heuristic report 3-button even when
   gesture mode is configured. Gesture mode can therefore have a larger bottom
   system inset than 3-button mode on a specific Fold/taskbar configuration.
   Do not reject or relabel a gesture capture by comparing bottom inset sizes
   alone; verify Settings/configuration and side system-gesture insets, and record
   Taskbar state. For comparable baseline captures, switch Taskbar off, record
   that condition, and recapture both main navigation modes with the same
   setting. Preserve earlier Taskbar-on JSON as separate evidence; never rewrite
   its values.
9. Record the visible active-window resolution and hinge/folding-feature state for
   each capture. A hinge angle can be wrong on RTL; screen classification requires
   the actual switched state plus resolution evidence.

### Export through File Browser

1. Open WebClient **File Browser** and navigate:
   `Android > data > info.windowinsets.probe > files`.
2. Confirm the complete filename set. Hover or select each row to reveal its
   download icon, then download files one at a time. Prefer the fresh accessibility
   button index for the intended row over a nearby coordinate: the two compact
   download icons are easy to confuse, and repeated clicks on the first row only
   download the same file again.
3. RTL may name every browser download `content`, `content (1)`, and so on.
   Classify them only from JSON fields: `screen`, `navigation.mode`,
   `display.currentWindowPx`, model and `capturedAt`.
4. Before a multi-file export, check whether Chrome permits multiple automatic
   downloads from the RTL site. On 2026-09-23 the first file arrived but further
   clicks showed Download without creating host files until the user enabled that
   site permission. After every click, verify a new host file exists and matches
   the intended JSON fields; recover missing files while the reservation is live.

### Fallback: export InsetsProbe logs

When a File Browser click produces no host file after checking the download
permission, switch to this path while the reservation is live. Avoid spending the
remaining time repeating the same download or asking the user to repeat it.

1. Open WebClient **Logs → Filter** and enter `InsetsProbe` in **Tag**. Keep the
   log panel open before capturing; earlier messages may no longer be retained.
2. In Probe, confirm the physical screen, settled dimensions/density and navigation
   mode, then tap **Measure** or **Copy JSON**. The export function writes the JSON
   to logcat under `InsetsProbe`, in chunks of 60 lines. This is a fresh capture,
   so recheck its conditions rather than assuming it matches an earlier file.
3. Use **save logs** and verify the downloaded text file on the host. The visible
   log panel may show only the last rows; its current DOM snapshot alone is not
   evidence of a complete JSON document. On 2026-09-24, TriFold File Browser
   downloads stalled after the first file, but saving filtered logs succeeded.
4. Preserve the downloaded log unchanged under the device's `rtl-logs/` directory.
   Extract message fields for one complete capture in their original order,
   removing only RTL's date/time/PID/TID/priority/tag columns. RTL may render the
   tag as either `InsetsProbe` or `InsetsProbe:`. Keep captures separate; never
   fill missing lines from another capture or from expected values.
5. Parse the reconstructed JSON and apply every validation in section 4. Require
   a complete root object, fresh timestamp, correct model, screen, navigation mode,
   dimensions and density. Record the source log and extraction method beside the
   resulting JSON. If parsing fails or lines are missing, recapture with Logs open;
   unresolved screen/mode combinations remain pending.

Completion criterion: the original log is preserved and a complete, validated JSON
capture is traceable to it for each recovered screen/navigation combination.

When automation cannot complete the live-device portion, ask the user to report the
downloaded filenames and active display/resolution. State the exact inaccessible
control and keep the reservation tab open.

Completion criterion: every requested raw JSON file and its observed display state
are available, or the remaining human step is explicit.

## 4. Validate evidence before registration

Raw files under `measurements/` are immutable evidence. Copy downloads under explicit
`<screen>-<threeButton|gesture>.json` names only after checking them; never repair or
normalize the JSON by hand.

For direct uploads, confirm Probe reports `Uploaded ... inbox PR #...`, then read
the capture-inbox branch while the reservation is active. Match every expected
filename to its fresh timestamp, model, screen, actual rotation, navigation
setting, window dimensions and density. `Sweep done` only proves local files
were saved; it does not prove that the API received them. Recover any missing
upload or export its file through File Browser before the reservation expires.

Check every file for:

- target model/build and a fresh capture timestamp;
- schema/capture context, full-screen and settled window state;
- actual `navigation.mode`, not the requested mode;
- window pixel dimensions and density;
- foldable hinge/folding-feature evidence and consistency with the claimed screen;
- locale-dependent values and any mismatch requiring recapture.

Compare dimensions with official skin rectangles only to classify the active screen.
Artwork coordinates are not inset measurements. A null hinge angle does not prove
Main, rotation does not switch displays, and duplicate dimensions from two labels do
not establish two screens. Preserve mismatched captures and document why they are not
registered instead of rewriting them.

Completion criterion: every downloaded file is either accepted with a defensible
screen/nav classification or retained as rejected evidence with a stated reason.

## 5. Register and verify

Add accepted raw evidence under `measurements/<device-slug>/`. If canonical files
already contain historical evidence, preserve them and add a dated recapture
directory rather than overwriting them. Update the existing
device module or create one following a comparable bar/book/flip entry, then register
it through `verifiedEntries` without replacing skin-only screens. Record RTL catalog
availability separately from measurements; mark the catalog complete only after an
unfiltered inventory of every series and region has actually been checked.

Update the measurement and RTL coverage docs with the capture date, model identifier,
screen classification, navigation modes, and any limitations. Run at least:

```bash
pnpm typecheck
node --test tests/rendering.test.mjs
pnpm build
```

Review desktop and mobile output for the changed device. Report accepted captures,
pending screens/modes, validation results, and the next queue item.

For each registered Galaxy Fold or Flip, confirm the device page shows both Pose
and Hinge controls on desktop and mobile, and that moving the Hinge slider updates
the 3D pose. This also applies to artwork-only previews and models with no cover
skin; a missing measurement remains pending while the hinge animation stays
available. Treat a missing control or static pose as incomplete registration.

After the accepted evidence has been committed and its remote upload is verified,
clean up only the exact temporary `Downloads/content*` copies already matched by
hash to committed raw JSON. Move those identified copies to Trash so they can be
recovered. Keep repository `measurements/` files as permanent raw evidence, and
leave unrelated or unclassified downloads alone. Report what was moved.

Completion criterion: raw evidence is traceable, registered values come only from
accepted captures, documentation agrees with code, and all relevant checks pass.
