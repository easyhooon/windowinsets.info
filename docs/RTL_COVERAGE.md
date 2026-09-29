# Samsung skin and RTL coverage

Checked 2026-09-25. **The full comparison is not yet verified.**

Keep registered skins browsable under the 2020+ coverage policy with the Fold/Flip exception.
New measurement collection prioritizes models offered by Samsung Remote Test Lab.
The owner also explicitly authorized physical Fold2 measurements on 2026-09-22;
verified physical-device captures are accepted without implying RTL availability.
Only actual InsetsProbe captures populate insets; a skin or RTL listing never
supplies measured values. Preserve historical captures even if Samsung later
removes a model from its catalog.

## Evidence collected

- [Official RTL introduction](https://developer.samsung.com/remote-test-lab)
  features Galaxy Z Fold8, Galaxy Z Flip8, Galaxy S26 Ultra and Galaxy Tab S11.
  These are featured models, not a complete inventory or verified free slots.
- [Reservation catalog](https://developer.samsung.com/remotetestlab/devices)
  became accessible after the user completed Samsung authentication manually.
  The Galaxy Z list was inspected and Galaxy Z Fold8 (SM-F971N, Korea/Gumi) was
  successfully reserved on 2026-09-22. Galaxy Z Fold7 (SM-F966U, Korea/Gumi) was
  reserved twice on 2026-09-23 to complete a split 30-minute capture workflow.
  Galaxy Z Flip8 (SM-F776B) was also operated on 2026-09-23 and its FlexWindow
  cover was measured through the registered InsetsProbe AppWidget on display 1.
  Galaxy Z Fold8 Ultra (SM-F976U, Korea/Gumi) was reservable on 2026-09-23. An
  earlier session was returned before capture because the lock screen required
  manual handoff; later captures in the repository measured both displays.
  On 2026-09-27, SM-F976U_KR1 on Android 17 / One UI 9.0 supplied cover and
  inner captures at rotations 0, 1 and 3 in both navigation modes. The inner
  display used the RTL Rotate control for rotations 1 and 3 because the Probe's
  orientation request did not rotate that display. The 12 accepted raw files are
  in `measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/`. All four
  rotation-0 inset objects match the already published 2026-09-23 captures, so
  the site keeps those published values and source labels.
  Galaxy Z Fold6 (SM-F956U-KR10, Korea/Gumi) was reserved three times on
  2026-09-23. Its cover and inner display were measured in both navigation
  modes. An earlier inner 3-button attempt was retained but not published
  because the navigation bar was transiently reported as 1 px; a later
  recapture reported a settled 126 px navigation bar.
  A 2026-09-27 InsetsProbe 1.5.0 sweep supplied all 12 cover/inner × rotation
  0/1/3 × navigation captures on the same build at 420 dpi and font scale 1.
  The rotation-0 inset values match the existing published captures. The eight
  separately measured landscape values are registered; Fold's 3D view still
  rotates its recorded diagram until issue #24 connects display orientation
  to the fold renderer. One repeated main-gesture upload was byte-identical
  and is kept in the inbox only.
  Galaxy Z Fold5 (SM-F946BE-VN1, Vietnam/Hanoi) was reserved twice on
  2026-09-23. Both screens were measured in both navigation modes; the first
  cover gesture capture was rotated and retained as rejected evidence, then
  recaptured upright in the second reservation.
  Galaxy Z Fold4 (SM-F936BE-VN2, Vietnam/Hanoi) was reserved on 2026-09-23.
  Both screens were measured upright in both navigation modes. Rotated first
  attempts and a main gesture attempt with Taskbar enabled are retained as
  rejected evidence; the accepted main captures have Taskbar off.
  An initial Galaxy Z Flip7 FE (SM-F761B-VN4, Vietnam/Hanoi) reservation on
  2026-09-23 failed to install InsetsProbe at 0%, even after reconnecting
  following a device restart. That reservation was returned with one credit
  refunded and produced no accepted measurement. A later capture is documented
  below. Galaxy Z Flip6 (SM-F741U-KR10,
  Korea/Gumi) was subsequently reserved. Its official main-screen skin was
  matched to fresh, upright 1080×2640 px captures in both navigation modes;
  the skin archive has no cover layout, so cover values remain pending.
  Galaxy Z Fold3 (SM-F926B-VN1) was reserved but its Probe installation stayed
  at 0%; it was returned without a capture. Galaxy Z Flip7 (SM-F766N_KR1) was
  then reserved and produced an upright 1080×2520 main 3-button capture with
  Probe 1.3.0. The model already had complete physical-device measurements for
  both screens and modes, so this RTL file is preserved separately under
  `measurements/galaxy-z-flip7/rtl-recapture-2026-09-23/` and does not replace
  the canonical measurements. Its inset values agree with the physical main
  3-button capture; the newer probe also records a cutout path.
  Galaxy Z Flip5 (SM-F731BE-VN3, Vietnam/Hanoi) was then reserved. Its
  official main skin matches upright 1080×2640 captures in both navigation
  modes. The first gesture export was rotated 180° and is retained as rejected
  evidence in `measurements/galaxy-z-flip5/rejected-2026-09-23/`; the accepted
  recapture is rotation 0. The imported
  archive has no cover layout, so cover remains unavailable.
  Galaxy Z Flip3 (SM-F711B-VN2, Vietnam/Hanoi) was reserved on 2026-09-23.
  Its upright main 3-button capture was downloaded and verified at 1080×2640.
  Probe also saved a main gesture capture on the device, but WebClient stopped
  delivering subsequent downloads despite Chrome automatic downloads being
  allowed. Samsung's Device to Host clipboard notification was selected, but
  the host clipboard remained empty. At that time the gesture mode was not
  accepted or registered; neither file deletion nor a new reservation was
  evidence of that missing capture.
  On 2026-09-24 the same Flip3 unit was reserved again. InsetsProbe 1.3.0
  produced a fresh upright main gesture capture (1080×2640 px, display 0,
  density 480 dpi, Android 14 / One UI 6.1). Its WebClient download reached
  the host and was validated against the earlier main 3-button capture.
  Both main modes are now registered; no official cover skin is available.
  The original Galaxy Z Flip (SM-F700F-IN5, India/Noida) was reserved on
  2026-09-24. InsetsProbe 1.3.0 captured its main display in both navigation
  modes on Android 13 / One UI 5.1.1; the official skin archive contains only
  the main layout, so no cover measurement is registered. This reservation
  verifies this exact model variant was offered on that date only.
  A second Fold3 unit (SM-F926U-VN2, Android 15, Vietnam/Hanoi) was reserved
  on 2026-09-24. The same built APK again stalled at 0% in WebClient
  Applications, while installation succeeded on Flip3 in the same session.
  No Fold3 insets were captured. The device-specific installation failure is
  tracked in [issue #11](https://github.com/easyhooon/windowinsets.info/issues/11).
  On 2026-09-25 the user reported InsetsProbe installation stalled at 0% on
  Galaxy A54 and Galaxy A13. For the original reports, exact SKU, Android / One
  UI version, RTL location and APK version remain unknown. No A54 capture status
  was provided. Later on 2026-09-25, SM-A135F Galaxy A13 LTE installed
  InsetsProbe and produced valid captures; this shows the failure was not
  universal but cannot identify the original failed unit. These reports belong
  in [issue #11](https://github.com/easyhooon/windowinsets.info/issues/11).
  The full cross-series, cross-region inventory was not completed.
- The local skin archive contains 126 registered models; 119 are public under
  the release-year policy. All four featured mobile models have registered skins.
  The other archived models remain unverified, not unsupported. Galaxy Z Flip5
  was visible in the 2026-09-23 reservation catalog; its official main skin
  and two verified main captures are now registered.
- Galaxy S25 (SM-S931N_KR1, Korea/Gumi) was reserved on 2026-09-24 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured its main display in both
  navigation modes at 1080×2340 px; the files match the official main skin.
  This verifies that exact model's availability on that date, but not the
  complete cross-series catalog. Existing S25+ captures are from a physical
  device; S25 Ultra captures document a separate past RTL reservation.
- Galaxy S25 Edge (SM-S937N_KR10, Korea/Gumi) was reserved on 2026-09-24
  with Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured both navigation
  modes at 1080×2340 px in FHD+ mode; the physical panel is 1440×3120 px.
  Its live reservation confirms availability on that date only.
- Galaxy S25 FE (SM-S731N_KR1, Korea/Gumi) was reserved on 2026-09-24 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured both navigation modes
  at 1080×2340 px; this confirms availability on that date only.
- Galaxy S24 Ultra (SM-S928N-KR3, Korea/Gumi) was reserved for 30 minutes on
  2026-09-24 with Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured the main
  display in both navigation modes at 1080×2340 px / 450 dpi. Settings and inset
  evidence agree; raw captures omit the cutout bounding rectangle, so only the
  top cutout inset is registered. This confirms availability on that date only.
- Galaxy S24+ (SM-S926N-KR3, Korea/Gumi) was reserved twice for 30 minutes on
  2026-09-24 with Android 16 / One UI 8.5. Its initial reservation produced an
  upright main 3-button capture; a second reservation produced the gesture
  capture. Both were downloaded and validated at 1080×2340 px / 450 dpi, and
  InsetsProbe and Android's navigation setting agree in both files. The gesture
  capture was generated at 2026-09-24T14:26:26Z and saved unchanged as
  `main-gesture.json`. The earlier stale-export symptom is tracked in issue #12.
  These reservations confirm this exact model was offered in Korea on this date
  only.
- Galaxy S24 (SM-S921N-KR3, Korea/Gumi) was reserved on 2026-09-24 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured the main display in both
  navigation modes at 1080×2340 px / 480 dpi; the downloaded files report
  matching Settings and inset classifications. A 2026-09-28 reservation of the
  same unit supplied an InsetsProbe 1.6.0 sweep at rotations 0, 1 and 3 in both
  navigation modes. All six files report build
  BP4A.251205.006.S921NKSSGDZG1, 480 dpi, font scale 1, full-screen windows and
  matching navigation evidence. Portrait bars are 103/45 px in gesture mode
  and 103/144 px in 3-button mode. Landscape status bars are 90 px; the 103 px
  cutout moves left at rotation 1 and right at rotation 3. Gesture retains a
  45 px bottom bar, while 3-button uses a 144 px bar on the opposite side.
  Files are in `measurements/galaxy-s24/recapture-2026-09-28-rotation/`; the
  original portrait captures remain preserved. Availability is confirmed for
  this exact model on the respective dates only.
- Galaxy S24 FE (SM-S721N_KR4, Korea/Gumi) was reserved on 2026-09-25 with
  Android 16 / One UI 8.5. InsetsProbe 1.3.0 captured its Phone-labeled built-in
  display in both navigation modes at 1080×2340 px / 450 dpi with font scale 1.
  Both downloaded files report matching Settings and inset classifications.
  These historical captures have no cutout bounding rectangles. A 2026-09-28
  reservation of the same SM-S721N_KR4 unit supplied a new InsetsProbe 1.6.0
  sweep at rotations 0, 1 and 3 in both navigation modes. All six files report
  Android 16 / One UI 8.5, build BP4A.251205.006.S721NKSSDDZG3, 450 dpi,
  font scale 1, full-screen windows, and navigation settings matching Probe
  classification. Portrait bars are 92/42 px in gesture mode and 92/135 px in
  3-button mode. Landscape status bars are 84 px; the 92 px cutout moves left at
  rotation 1 and right at rotation 3. Gesture retains a 42 px bottom bar,
  while 3-button uses a 135 px bar on the opposite side. The recapture also
  provides a 68×68 px cutout bound and 113 px corner radii. Files are in
  `measurements/galaxy-s24-fe/recapture-2026-09-28-rotation/`; the original
  portrait captures remain preserved. Availability is confirmed for this exact
  model on the respective dates only.
- Galaxy S23 Ultra, Galaxy S23+ and Galaxy S23 were offered only as
  Vietnam/Hanoi units when checked on 2026-09-25 and 2026-09-26 (S23 Ultra
  SM-S918B-VN4, S23+ SM-S916B-VN2). Every reservation opened a WebClient that
  immediately showed `All ongoing tests have ended`, so no measurements exist.
  Other models reserved on the same days worked, which points at these units
  rather than the account or browser. Do not rebook them until the catalog
  offers another site or unit; keep the models as artwork-only previews. On
  2026-09-27 Galaxy S23 Ultra SM-S918U, Galaxy S23+ SM-S916U and Galaxy S23
  SM-S911U units worked and were captured (see below). On 2026-09-28 the
  Vietnam/Hanoi S23 Ultra unit failed the same way again; rotation sweeps came
  from USA/TX SM-S918U-US01 (S23 Ultra) and India/Noida SM-S911B-IN1 (S23).
- Galaxy S23 FE (SM-S711B), Galaxy S22 Ultra (SM-S908U), Galaxy S22+ (SM-S906B)
  and Galaxy S22 (SM-S901B) were reserved and captured on 2026-09-25. Each has
  full-screen main captures in both navigation modes with Android setting and
  InsetsProbe classifications in agreement, font scale 1, and exact raw JSON
  preserved under its `measurements/` directory. S23 FE is Android 16 / One UI
  8.5 at 1080×2340 px / 450 dpi; S22 Ultra is Android 13 / One UI 5.1 at
  1080×2316 px / 450 dpi on its 1440×3088 physical panel; S22+ is Android 15 /
  One UI 7.0 at 1080×2340 px / 450 dpi; S22 is Android 15 / One UI 7.0 at
  1080×2340 px / 480 dpi. S22 Ultra's raw cutout bounds are centered around
  x=720 despite the active window being 1080 px wide, so only its measured safe
  inset is registered and the inconsistent cutout shape is omitted from the
  diagram. This verifies these exact model variants were offered on the capture
  date; it does not complete the cross-region catalog inventory.
- Galaxy S23 FE (SM-S711BE-VN3, Vietnam/Hanoi) supplied an InsetsProbe 1.6.0
  sweep on 2026-09-28 at rotations 0, 1 and 3 in both navigation modes, across
  two reservations of the same unit (gesture in the first, 3-button in the
  second). All six files report Android 16 / One UI 8.5, build
  BP4A.251205.006.S711BXXSIGZH9, 450 dpi, font scale 1, full-screen windows and
  navigation settings matching Probe classification. Portrait bars are 97/42 px
  in gesture mode and 97/135 px in 3-button mode. Landscape status bars are
  84 px; the 82 px cutout moves left at rotation 1 and right at rotation 3.
  Gesture retains a 42 px bottom bar, while 3-button uses a 135 px bar on the
  opposite side. The recapture provides a 58×58 px cutout bound and 113 px
  corner radii. Files are in
  `measurements/galaxy-s23-fe/recapture-2026-09-28-rotation/`; the original
  portrait captures remain preserved.
- Galaxy S22 Ultra (SM-S908B-RU1, Russia/Moscow) supplied an InsetsProbe 1.6.0
  sweep on 2026-09-28 at rotations 0, 1 and 3 in both navigation modes. No
  Korean unit was listed; RU1 offered the newest Android version (15 / One UI
  7.0, build AP3A.240905.015.A2.S908BXXSIFYI3). All six files report 450 dpi,
  font scale 1, 1080×2316 px full-screen windows scaled from the 1440×3088
  panel, and navigation settings matching Probe classification. Portrait bars
  are 75/42 px in gesture mode and 75/135 px in 3-button mode. Landscape status
  bars are 68 px; the 75 px cutout moves left at rotation 1 and right at
  rotation 3. Unlike the 2026-09-25 Android 13 capture, the cutout bound is
  consistent with the window (56×75 px centered at x=540) and the corners
  report 101 px instead of 8 px, so both are now registered. Files are in
  `measurements/galaxy-s22-ultra/recapture-2026-09-28-rotation/`; the original
  portrait captures remain preserved.
- Galaxy S22+ (SM-S906B-RU1, Russia/Moscow) supplied an InsetsProbe 1.6.0
  sweep on 2026-09-28 at rotations 0, 1 and 3 in both navigation modes. No
  Korean unit was listed; RU1 offered the newest Android version (15 / One UI
  7.0, build AP3A.240905.015.A2.S906BXXUDFYD9, the same build as the original
  Vietnam capture). All six captures report 450 dpi, font scale 1, 1080×2340 px
  full-screen windows and navigation settings matching Probe classification.
  Portrait bars are 74/42 px in gesture mode and 74/135 px in 3-button mode,
  matching the original captures. Landscape status bars are 68 px; the 74 px
  cutout moves left at rotation 1 and right at rotation 3. The 52×74 px cutout
  bound and 101 px corner radii are unchanged. The File Browser did not download
  `main-threeButton.json`, so it was reconstructed from the saved InsetsProbe
  logcat export in `rtl-logs/`; the same log's other five captures parse
  identically to their downloaded files. Files are in
  `measurements/galaxy-s22-plus/recapture-2026-09-28-rotation/`; the original
  portrait captures remain preserved.
- Galaxy S22 (SM-S901E-IN1, India/Noida) supplied an InsetsProbe 1.6.0 sweep
  on 2026-09-28 at rotations 0, 1 and 3 in both navigation modes. No Korean
  unit was listed. The Android 15 SM-S901B-RU7 unit (Russia/Moscow) was tried
  first but did not install the probe APK, so it was returned; IN1 offered the
  next-newest Android version (14 / One UI 6.1.1, build
  UP1A.231005.007.S901EXXSCEYC1). All six captures report 480 dpi, font scale
  1, 1080×2340 px full-screen windows and navigation settings matching Probe
  classification. Portrait bars are 81/45 px in gesture mode and 81/144 px in
  3-button mode, matching the original Android 15 captures. Landscape status
  bars are 72 px; the 81 px cutout moves left at rotation 1 and right at
  rotation 3. The 56×81 px cutout bound is unchanged, while this unit reports
  102 px corner radii instead of the Android 15 unit's 108 px; the published
  screen now follows the single-unit IN1 set. Only `landscape-1-gesture.json`
  downloaded through the File Browser; the other five files were reconstructed
  from two saved InsetsProbe logcat exports in `rtl-logs/` (the first export
  stopped at 2,000 lines, the second was time-filtered), and the downloaded file
  parses identically to its log copy. Files are in
  `measurements/galaxy-s22/recapture-2026-09-28-rotation/`; the original
  portrait captures remain preserved.
- Galaxy S21 Ultra (SM-G998B), Galaxy S21+ (SM-G996B), Galaxy S21 (SM-G991B),
  Galaxy S20 Ultra (SM-G988B) and Galaxy S20 FE (SM-G780G) were reserved and
  captured on 2026-09-25. The first four have accepted main captures in both
  navigation modes, all with matching Android setting and InsetsProbe mode,
  font scale 1 and rotation 0. S21 Ultra: Android 14 / One UI 6.1,
  1080×2400 px / 450 dpi on a 1440×3200 panel; rounded-corner values are null
  in both raw captures and remain unavailable.
  On 2026-09-29 an SM-G998U1-IN2 unit (India/Noida, Android 14 / One UI 6.1)
  set to WQHD+ was switched to the default FHD+, then swept rotations 0, 1 and 3
  in both modes with InsetsProbe 1.6.0 (`recapture-2026-09-29-rotation/`).
  Rotation 0 matches the accepted SM-G998B values exactly.
  The same day SM-G996B-RU8 (Russia/Moscow, the accepted S21+ build) swept
  rotations 0, 1 and 3 in both modes (`galaxy-s21-plus/recapture-2026-09-29-rotation/`);
  rotation 0 matches the accepted S21+ captures.
  SM-G990B-RU1 (Russia/Moscow, the accepted S21 FE build) followed with the same
  sweep (`galaxy-s21-fe/recapture-2026-09-29-rotation/`); the gesture upload
  stalled once and was resent with Upload. Rotation 0 matches the accepted captures.
  SM-G991B-RU2 (Russia/Moscow, the accepted S21 build) completed the same sweep
  (`galaxy-s21/recapture-2026-09-29-rotation/`); rotation 0 matches the accepted
  captures. Russian units' uploads can time out and succeed on a manual Upload.
  SM-G988B-RU1 (Russia/Moscow, the accepted S20 Ultra build) completed the same
  sweep at FHD+ (`galaxy-s20-ultra/recapture-2026-09-29-rotation/`); rotation 0
  matches the accepted captures, and the landscape cutout rectangles keep the
  same off-center placement, so the shape stays unregistered.
  SM-G780G-IN3 (India/Noida, the accepted S20 FE build) completed the same sweep
  (`galaxy-s20-fe/recapture-2026-09-29-rotation/`), but every upload timed out,
  including manual resends. The six JSON files were downloaded unchanged from
  `Android/data/info.windowinsets.probe/files/` with the File Browser. Rotation 0
  matches the accepted captures. S21+: Android 15 / One UI 7.0,
  1080×2400 px / 450 dpi. S21: Android 14 / One UI 6.1, 1080×2400 px / 480
  dpi. S20 Ultra: Android 13 / One UI 5.1, 1080×2400 px / 420 dpi on a
  1440×3200 panel. Its raw cutout rectangle is centered around x=720 despite
  the active window being 1080 px wide; the safe inset is registered and the
  unscaled cutout shape is omitted. S20 FE has both modes (Android 13 / One UI
  5.1, 1080×2400 px / 480 dpi). Its gesture file says 2026-09-25T05:30:35Z;
  the 3-button file's embedded `capturedAt` says 2024-12-27T11:54:02Z, while
  its host download modification time is 2026-09-25 14:30:57 KST, 13 seconds
  after the gesture file. The user confirmed the 3-button capture was just
  measured alongside the gesture capture. Probe writes `capturedAt` using the
  Android device clock (`Instant.now()`), so the raw discrepancy is retained
  and documented as a likely device-clock anomaly; neither JSON was edited.
  These reservations verify exact model variants on the capture date only, not
  the full cross-region catalog.
- Galaxy Tab S11 Ultra Wi-Fi (SM-X930) was captured in both navigation modes
  on 2026-09-25. Its landscape 2960×1848 px window matches the official main
  display resolution. The gesture capture's inset-only classifier says
  threeButton, but Android Settings, config and side gesture insets confirm
  gesture mode; preserve and register the measured gesture values.
- Galaxy Tab S11 Wi-Fi (SM-X730), Galaxy Tab S10 FE+ Wi-Fi (SM-X620), Galaxy
  Tab S10 FE Wi-Fi (SM-X520) and Galaxy Tab S9 FE+ 5G (SM-X616N) each have
  landscape main captures in both navigation modes from 2026-09-25. The captures
  match their registered official skin dimensions: 2560×1600, 2880×1800,
  2304×1440 and 2560×1600 px respectively, all at rotation 1. Gesture mode is
  confirmed by Android Settings/configuration and side system gesture insets,
  even though InsetsProbe's inset-only classification says threeButton. The
  S10 FE's 2026-09-25 captures report font scale 1.08. A 2026-09-27 Tab S10 FE+
  recapture on the same build reproduced every value in both modes; it is kept
  under `measurements/galaxy-tab-s10-fe-plus/recapture-2026-09-27/`. The same-day
  Tab S10 FE recapture first reproduced the 1.08 files exactly, then a font scale
  1 recapture under `measurements/galaxy-tab-s10-fe/recapture-2026-09-27-fontscale-1/`
  matched them in every inset and display field except `fontScale`. The font
  scale 1 pair is registered as the baseline; font scale does not change inset
  or display metrics.
- Galaxy Tab A9+ 5G (SM-X216B) has both landscape main modes from Samsung RTL,
  Android 14 / One UI 6.1, build `UP1A.231005.007.X216BXXS3CXG1`. Captures match
  the official 1920×1200 skin at rotation 1, 240 dpi, and font scale 1.1. Both
  modes report 48 dp / 72 px bottom system bars. The gesture mode is confirmed
  by Settings/configuration and side system-gesture insets even though the
  inset-only heuristic reports threeButton; the shared bottom inset is preserved
  rather than treated as a mode mismatch.
- Galaxy Tab A7 Lite LTE (SM-T225) has both landscape main captures from Samsung
  RTL, Android 14 / One UI 6.1, build `UP1A.231005.007.T225XXSBEYE4`. The
  1340×800 px active window matches Samsung's published display resolution at
  rotation 1, 213 dpi and font scale 1. Gesture mode is confirmed by
  Settings/configuration and side system-gesture insets although the inset-only
  heuristic reports threeButton. Both modes report 48.08 dp / 64 px bottom
  system bars; preserve the measured values.
- Fold8 cover and inner were both
  recaptured from a live reservation in 3-button and gesture modes. On
  2026-09-27, SM-F971N_KR11 on Android 17 / One UI 9.0 supplied rotations 0, 1
  and 3 for both screens and navigation modes
  (`measurements/galaxy-z-fold8/recapture-2026-09-27-rotation/`). The inner
  display's natural rotation is landscape; its rotations 1 and 3 were set with
  the RTL Rotate control because the Probe's orientation request was ignored.
  The main Taskbar was off for both modes. Continue apps on cover screen was
  set to Always before the cover gesture sweep so Probe stayed on the active
  display when folded. All four natural-rotation inset
  objects match the earlier published recaptures; the new Probe also recorded
  the cover cutout path without changing its safe insets or bounds. This RTL
  unit reported `HALF_OPENED`/`isSeparating=true` for the inner folding feature
  at every rotation despite a 180° hinge sensor and the visibly unfolded
  chassis. The earlier published recapture reported `FLAT`; retain that
  published fold state and treat the new state fields as inconsistent RTL
  evidence.

  Fold7 cover and inner are also measured in both modes from the same SM-F966U
  software build. On 2026-09-27 InsetsProbe 1.5.0 captured cover and
  inner at rotations 0, 1 and 3 in both modes (`recapture-2026-09-27-rotation/`);
  the rotation 0 values match the published captures exactly. Inner rotations 1
  and 3 were set with the RTL Rotate control because the app's rotation request
  was ignored on the large display; the navigation bar stays at the bottom and the
  top bar is 79 px instead of 89 px. Flip8 cover and inner are now measured in both modes; its accepted cover
  captures report display 1 and 948×1048 px, while the older mislabeled
  `cover-threeButton.json` remains preserved as historical inner-display evidence.
  Fold6 now has accepted cover and inner captures in both navigation modes;
  the rejected inner 3-button attempt remains historical evidence. Fold5 also
  has accepted captures for both screens and modes, with its rotated first
  cover gesture attempt preserved separately. Fold4 has accepted upright cover
  and inner captures in both modes after the Taskbar correction. Flip5 and Flip6
  main have accepted captures in both modes; their covers remain skin-unavailable. Flip3
  main is also registered in both modes from dated captures on the same RTL unit.
  Galaxy Z Fold3 is now measured on both displays in both navigation modes from
  two Vietnam/Hanoi RTL units running Android 14 / One UI 6.1.

On 2026-09-27, separate rotation 1 and 3 captures were also registered for both
displays of Fold3, Fold4, Fold5 and TriFold, and the main displays of Flip5,
Flip6, Flip7 and Flip8. Each rotation has its own raw file in the device's
`recapture-2026-09-27-rotation/` directory. Flip8's cover stayed at rotation 0
in the capture session. Existing natural rotation values remain tied to their
earlier accepted captures.

Fold7, Fold8 and Fold8 Ultra had their 2026-09-27 cover and inner rotation
files committed without device-data entries, so the site showed their landscape
insets as unmeasured. On 2026-09-28 all 24 rotation 1 and 3 records were
generated directly from those raw files and registered.

On 2026-09-28, Galaxy Z Flip7 SM-F766N_KR2 (Korea/Gumi, build
BP4A.251205.006.F766NKSSBBZG3) ran InsetsProbe 1.6.0 from its FlexWindow cover
widget. The cover sweep saved rotation 0 in both navigation modes (display 1,
948×1048 px, 420 dpi, settings mode 0/2). Landscape and reverse landscape were
skipped because the cover display did not rotate, the same result as on Flip8.
Both files are in `measurements/galaxy-z-flip7/recapture-2026-09-28-flexwindow/`.
Their insets, cutout and corner radii match the canonical physical cover
captures, so they are listed as additional sources without changing values.
Cover rotations 1 and 3 remain pending.

On 2026-09-28, Galaxy Z Flip3 SM-F711B-VN2 (Android 14, One UI 6.1, the same
build as the accepted captures) ran InsetsProbe 1.6.0. The in-app sweep captured
the main display at rotations 0, 1 and 3 in both navigation modes. All six files
report display 0, 480 dpi, font scale 1 and settings mode 0/2, and they were
uploaded to the capture inbox. Rotation 0 matches the accepted captures.
Landscape windows are 2640×1080 px with a 72 px top bar and a vertical FLAT
feature at x=1320. Three-button places its 144 px bar on the right (rotation 1)
or left (rotation 3), and gesture keeps a 45 px bottom inset. The 94×71 px cutout
follows the rotation. Files are in
`measurements/galaxy-z-flip3/recapture-2026-09-28-rotation/`.

Also on 2026-09-28, Galaxy Z Flip4 SM-F721BE-VN1 (Android 14, One UI 6.1.1,
the same build as the accepted captures) produced the same six-file main sweep
with InsetsProbe 1.6.0 through the capture inbox. Rotation 0 matches the
accepted captures. The landscape geometry equals Flip3's: 72 px top, 144 px
three-button side bar, 45 px gesture bottom and a 94×71 px rotated cutout. Files
are in `measurements/galaxy-z-flip4/recapture-2026-09-28-rotation/`. The
reservation page's Return action did nothing while the WebClient ran in a tab.
Exit in the WebClient with **Return this device** checked returned the credit.
The original Galaxy Z Flip was not listed among RTL Galaxy Z models that day.

### Galaxy Z Fold3 — 2026-09-25

InsetsProbe 1.3.0 captured all four display/navigation combinations on Samsung
RTL. Cover and main 3-button captures came from SM-F926B-VN1; main gesture was
recaptured on SM-F926B-VN2. The captures share model/build, Android 14, One UI
6.1, and 420 dpi. The active windows match the official cover/main skin classes:
840×2289 px cover and 1768×2208 px main, both portrait. Main captures include a
vertical FLAT folding feature at x=884 px.

- cover: 82 px top and 126/39 px bottom for 3-button/gesture;
- main: 88 px top and 126/168 px bottom for 3-button/gesture;
- main gesture mode is verified from Settings/configuration and side system
  gesture insets although InsetsProbe's inset-only classifier reports 3-button.
  User screenshots show the persistent Taskbar with both navigation choices;
  the gesture-mode bottom inset is 64 dp versus 48 dp in 3-button mode. Preserve
  these measured values as the observed Fold3 configuration, not a mode error.

Two rejected attempts are preserved under
`measurements/galaxy-z-fold3/rejected-2026-09-25/`: `content (40)` was labeled
main gesture but had cover dimensions (840×2289 px), while `content (43)` had
the correct inner dimensions but retained the Phone label. Neither is registered.
Fold3 RTL availability is confirmed by live reservations in Vietnam/Hanoi on
2026-09-25; the reservation catalog was not exhaustively inventoried by region.

The comparison for every registered skin is in [RTL_SKIN_COMPARISON.csv](RTL_SKIN_COMPARISON.csv).
It includes pre-2020 models for inventory completeness. Galaxy Fold is public
under the Fold/Flip exception; other pre-2020 entries remain archived. TriFold artwork and two-hinge animation were separately approved on 2026-09-24.
Its RTL availability is unverified; neither screen has an accepted capture.

## Data and presentation

The `rtlCatalog` snapshot in `app/data/rtlAvailability.ts` stores the source,
check date, inventory scope, featured model slugs and separately verified
reservable slugs. `rtlAvailability.ts` derives three inventory states:

| Evidence | Display | Measurement handling |
| --- | --- | --- |
| Model appears in checked source | Featured/Listed on RTL | Capture each screen and navigation mode before adding numbers |
| Model absent from a complete reservation catalog | Not listed on RTL | Keep skin preview; explain missing RTL access |
| Catalog incomplete or inaccessible | RTL status unverified | Keep preview; do not claim non-support |

Measurement status is separate and specific to the selected screen and navigation
mode. Current slot occupancy is also separate: a fully booked model is still
offered by RTL. Existing measurements are never hidden by availability metadata.

## Completing the comparison

When the reservation catalog opens, clear search and category filters, inspect all
pages and regions, and retain a dated list with source and scope. Include busy
devices, not just immediately free slots. Match exact model variants, including
Plus, Ultra, FE, Wi-Fi and 5G where applicable; unresolved aliases require review.

Replace the featured-only snapshot with that verified inventory, set
`scope: "reservation-catalog"`, and set `complete: true` only after all models
and regions have been checked. A 403, an empty shell or a filtered page must
never produce a complete empty inventory. Refresh the CSV from the same snapshot.
Galaxy Z Fold8, Fold7, Fold6, Fold5, Fold4 and Flip8 reservations were made during this comparison.
They establish those models' availability on their checked dates only; they do not
make the partial inventory complete.

## Galaxy S26 rotation sweep on 2026-09-28

Galaxy S26 SM-S942N_KR1 (Korea/Gumi, build BP4A.251205.006.S942NKSS4AZHA, same
as the accepted captures) ran InsetsProbe 1.6.0 with the Main label. The in-app
sweep captured rotations 0, 1 and 3 in both navigation modes. All six files
report display 0, 480 dpi, font scale 1 and settings mode 0/2, and they were
uploaded to the capture inbox. Rotation 0 matches the accepted captures.
Landscape windows are 2340×1080 px with a 90 px top bar. Three-button places its
144 px bar on the right (rotation 1) or left (rotation 3), and gesture keeps a
45 px bottom inset. The 111×64 px cutout follows the rotation. Files are in
`measurements/galaxy-s26/recapture-2026-09-28-rotation/`.

Galaxy S26+ SM-S947N_KR2 (same build as the accepted captures, 450 dpi) followed
with the same six-file sweep. Rotation 0 matches the accepted captures. Landscape
windows are 2340×1080 px with an 84 px top bar, a 135 px three-button side bar,
a 42 px gesture bottom inset and a rotated 104×60 px cutout. Files are in
`measurements/galaxy-s26-plus/recapture-2026-09-28-rotation/`.

Galaxy S25 Ultra SM-S938N_KR1 (same build as the accepted captures) produced the
same six-file sweep. Rotation 0 matches the accepted captures; landscape windows
are 2340×1080 px with an 84 px top bar, a 135 px three-button side bar, a 42 px
gesture bottom inset and a rotated 96×52 px cutout. Closing the WebClient tab
mid-reservation restarted and reset the unit (Probe removed, navigation back to
three-button), so the gesture half was captured after reinstalling. Files are in
`measurements/galaxy-s25-ultra/recapture-2026-09-28-rotation/`.

The owner's USB-connected Galaxy S25+ (SM-S936N, same build as its accepted
captures) was measured over ADB with `--ez sweep true`, once in three-button
and once after enabling the standard gestural navbar overlay and Samsung's
`navigation_bar_gesture_while_hidden`. Both sets uploaded to the capture inbox
and report settings mode 0/2. The device was returned to three-button
navigation. Rotation 0 matches the accepted captures. Files are in
`measurements/galaxy-s25-plus/recapture-2026-09-28-rotation/`.

Galaxy S25 Edge SM-S937N_KR10 (same build as the accepted captures) produced the
same six-file RTL sweep. Rotation 0 matches the accepted captures; landscape
windows are 2340×1080 px with an 84 px top bar, a 135 px three-button side bar,
a 42 px gesture bottom inset and a rotated 93×63 px cutout. Files are in
`measurements/galaxy-s25-edge/recapture-2026-09-28-rotation/`.

Galaxy S25 FE SM-S731N_KR2 (same build as the accepted captures) produced the
same six-file RTL sweep. Rotation 0 matches the accepted captures; landscape
windows are 2340×1080 px with an 84 px top bar, a 135 px three-button side bar,
a 42 px gesture bottom inset and an 82 px side cutout inset around a 58×58 px
hole. Files are in `measurements/galaxy-s25-fe/recapture-2026-09-28-rotation/`.

Galaxy S25 SM-S931N_KR1 (same build as the accepted captures, 480 dpi) produced
the same six-file RTL sweep; the owner installed the keyed APK by hand while the
agent's permission checks were unavailable. Rotation 0 matches the accepted
captures; landscape windows are 2340×1080 px with a 90 px top bar, a 144 px
three-button side bar, a 45 px gesture bottom inset and a rotated 103×58 px
cutout. Files are in `measurements/galaxy-s25/recapture-2026-09-28-rotation/`.

Galaxy S24 Ultra had no free Android 16 unit at the time, so Galaxy S24+
SM-S926N-KR3 (same build as the accepted captures) was measured next. Its
six-file sweep matches rotation 0 and has the S25+ landscape geometry: 84 px
top, 135 px three-button side bar, 42 px gesture bottom and a rotated 94×51 px
cutout. An older S24+ upload from the upload pilot remains in the inbox and was
not imported. Files are in
`measurements/galaxy-s24-plus/recapture-2026-09-28-rotation/`.

Later on 2026-09-28, Galaxy S24 Ultra SM-S928N-KR3 became available in
Korea/Gumi on Android 16 / One UI 8.5. InsetsProbe 1.6.0 uploaded six main-screen
captures to inbox PR #55: rotations 0, 1 and 3 in both navigation modes. All
report display 0, build `BP4A.251205.006.S928NKSS6DZG1`, 450 dpi, font scale 1
and matching navigation settings. Portrait is 1080×2340 px; both landscape
windows are 2340×1080 px with an 84 px top bar. Three-button places its
135 px bar on the right at rotation 1 and left at rotation 3; gesture has a
42 px bottom inset. The 96×51 px cutout follows the rotation. Raw files are in
`measurements/galaxy-s24-ultra/recapture-2026-09-28-rotation/`.

## Galaxy S26 Ultra measured on 2026-09-23

Samsung RTL Korea/Gumi SM-S948U_KR3 was reserved and its main display captured
with InsetsProbe 1.2.1 in both 3-button and gesture navigation. Both accepted
files report an upright 1080×2340 px app window. The physical panel is
1440×3120 px according to Samsung specifications. This reservation verifies
that model was offered on the checked date; it does not complete the
cross-region RTL catalog inventory.

On 2026-09-27 the same model/build supplied a full main-display sweep with
InsetsProbe 1.5.0. Separate rotation 1 and 3 captures in both navigation modes
report a settled 2340×1080 px window at 450 dpi and font scale 1. The cutout is
on the left at rotation 1 and right at rotation 3; the 3-button navigation bar
is on the opposite side. These four raw files are preserved under
`measurements/galaxy-s26-ultra/recapture-2026-09-27-rotation/` and registered
as measured landscape insets.

## Galaxy S25 measured on 2026-09-24

Samsung RTL Korea/Gumi SM-S931N_KR1 (Android 16, One UI 8.5, build
BP4A.251205.006.S931NKSSBCZG3) was reserved for 30 minutes. InsetsProbe 1.3.0
captured main 3-button and gesture navigation at an upright 1080×2340 px full
window, matching the official Galaxy S25 main skin. Both captures report
480 dpi, font scale 1, display 0, and matching navigation settings/configuration.
The hinge angle is null and there are no folding features, as expected for this
bar phone. The reservation proves this model was offered in Korea on this date;
the overall RTL inventory remains incomplete.

## Galaxy S25 Edge measured on 2026-09-24

Samsung RTL Korea/Gumi SM-S937N_KR10 (Android 16, One UI 8.5, build
BP4A.251205.006.S937NKSS9CZG3) was reserved for 30 minutes. InsetsProbe 1.3.0
captured main 3-button and gesture navigation in FHD+ mode at an upright, full-screen
1080×2340 px window. Samsung specifies the panel as 1440×3120 px. Both captures
report 450 dpi, font scale 1, display 0, rotation 0, and matching navigation
settings/configuration. The reservation confirms Korea availability on this date;
the overall RTL inventory remains incomplete.

## Galaxy S25 FE measured on 2026-09-24

Samsung RTL Korea/Gumi SM-S731N_KR1 (Android 16, One UI 8.5, build
BP4A.251205.006.S731NKSS8BZG3) was reserved for 30 minutes. InsetsProbe 1.3.0
captured main 3-button and gesture navigation at an upright, full-screen
1080×2340 px window. Both captures report 450 dpi, font scale 1, display 0,
rotation 0, and matching navigation settings/configuration. The reservation
confirms Korea availability on this date; the overall RTL inventory remains
incomplete.

## Galaxy Z TriFold — 2026-09-24 and 2026-09-25

Samsung RTL SM-F968N_KR1, Korea/Gumi, Android 16 / One UI 8.5, build
`BP4A.251205.006.F968NKSS6BZG3`. Main 3-button and gesture captures are
2160×1584 px, natural landscape (rotation 0), 320 dpi, Taskbar off. Cover
gesture is 1080×2520 px, portrait, 420 dpi. On 2026-09-25 a second Korea/Gumi
reservation produced the missing cover 3-button capture at 2026-09-24T15:17:37Z:
1080×2520 px, 420 dpi, display 0, rotation 0 and fontScale 1. InsetsProbe and
Android Settings both reported three-button navigation. All four screen/mode
captures are now verified.

Raw captures and unchanged RTL log exports are preserved in
`measurements/galaxy-z-trifold/`. See its README for extraction provenance,
display-density refresh behavior and the RTL hinge-report limitation.

## Galaxy Z Flip4 measured on 2026-09-25

Samsung RTL Vietnam/Hanoi SM-F721BE-VN1 (SM-F721B, Android 14 / One UI 6.1.1)
produced valid unfolded main captures in 3-button and gesture navigation. Both
report display 0, 1080×2640 px, 480 dpi, rotation 0, and a horizontal FLAT
folding feature at y=1320. InsetsProbe, Settings and Android navigation
configuration agree: bottom system bars are 144 px in 3-button mode and 45 px
in gesture mode. The reservation confirms availability in Vietnam on this date;
the Korean catalog and full RTL inventory remain incomplete.

The session's Cover-labelled exports are preserved as rejected evidence because
they also report display 0, the unfolded 1080×2640 px window, and the FLAT inner
display. Probe's Cover/Main radio changes only the stored label; it does not
switch displays. The Flip cover collection policy now starts at Flip5: Flip, Flip3
and Flip4 covers are unsupported and are not measurement targets because their
registered official skins have no cover layout. The physical Flip4 cover exists,
but its RTL captures are intentionally excluded from product support. See the raw
captures, rejected files and unchanged log export under
`measurements/galaxy-z-flip4/`.

For Flip5 and later, cover measurement is eligible only after a registered
official cover skin exists. As of 2026-09-25, only Flip7 and Flip8 have cover
layouts in the catalog; Flip5 and Flip6 remain main-only until cover artwork is
imported. Complete both cover navigation modes on eligible models before moving
to lower-priority collection targets.

## Galaxy Z Flip7 FE measured on 2026-09-25

InsetsProbe 1.3.0 captures for SM-F761B, Android 16 / One UI 8.0, build
`BP2A.250605.031.A3.F761BXXU4AYI1`, were downloaded and validated on 2026-09-25.
Both are upright main-display captures at 1080×2640 px, display 0, 480 dpi and
font scale 1, with the device fully unfolded (180°) and a horizontal FLAT
folding feature at y=1320 px. The captures agree with Android navigation
configuration: gesture has 116/45 px top/bottom system bars; 3-button has
116/144 px. Both include a 66×116 px centered cutout bound. The registered
skin includes only the main display, so no cover capture is in scope.

Raw files: `measurements/galaxy-z-flip7-fe/main-gesture.json` and
`main-threeButton.json`.

On 2026-09-28, SM-F761B-VN4 (Vietnam/Hanoi, same build) ran InsetsProbe 1.6.0.
The unit had an older Probe with a different signature, and RTL rejected the new
APK with an empty "installation failed" message. After that app was uninstalled
in the Applications panel, the new APK installed. The in-app sweep captured the
main display at rotations 0, 1 and 3 in both navigation modes. Each capture
reports display 0, 480 dpi, font scale 1 and settings mode 0/2, and all six
were uploaded to the capture inbox. Rotation 0 matches the 2026-09-25 captures.
Landscape windows are 2640×1080 px with a 90 px top bar and a vertical FLAT
feature at x=1320. Three-button places its 144 px bar on the right (rotation 1)
or left (rotation 3), while gesture keeps a 45 px bottom inset. The
116×66 px cutout follows the rotation. Files are in
`measurements/galaxy-z-flip7-fe/recapture-2026-09-28-rotation/`.

## Galaxy Tab S11 Ultra measured on 2026-09-25

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S11 Ultra Wi-Fi (SM-X930),
Android 16 / One UI 8.5, build `BP4A.251205.006.X930XXS7BZG3`, in landscape at
rotation 1. Both captures report a full-screen 2960×1848 px main display at
280 dpi with font scale 1, matching Samsung's official WQXGA+ resolution. The
main skin is portrait artwork; the registered capture rotation presents the
landscape evidence in its physical orientation. Samsung's listed 14.6-inch
diagonal and 2960×1848 resolution give approximately 240 ppi.

- 3-button: system bars are 60 px top and 84 px bottom (34.29 / 48 dp).
- gesture: system bars are 60 px top and 26 px bottom (34.29 / 14.86 dp).
  Settings, `config_navBarInteractionMode=2`, and side system gestures confirm
  gesture mode, although the inset-only heuristic reports threeButton because
  the tappable bottom inset is nonzero.
- Both captures report a 100×28 px centered cutout bound and 44 px rounded
  corners. InsetsProbe labels non-foldable displays `phone`; these matching
  SM-X930 captures are registered as the tablet's main screen.

Raw files: `measurements/galaxy-tab-s11-ultra/main-gesture.json` and
`main-threeButton.json`.

On 2026-09-29, Samsung RTL Korea/Gumi unit SM-X930_KR1 on the same build yielded
all four distinct rotations in both navigation modes at 280 dpi and font scale
1. Rotation 1 exactly matches the existing inset, cutout and corner data. The
new portrait rotations 0 and 2 are 1848×2960 px; landscape rotations 1 and 3
are 2960×1848 px. Android Settings and configuration agree on each navigation
mode. Gesture captures retain the tablet taskbar's tappable bottom inset, so
the inset-only heuristic reports threeButton even though Settings and
`config_navBarInteractionMode=2` confirm gestures. The cutout bounds remain
centered on the physical short edge in every rotation. Raw files:
`measurements/galaxy-tab-s11-ultra/recapture-2026-09-29-rotation/`.

## Galaxy Tab S9 Ultra measured on 2026-09-25

Samsung RTL SM-X916B (Android 15 / One UI 7.0, build
`AP3A.240905.015.A2.X916BXXS5CYG1`) produced full-screen main captures in
landscape at rotation 1: 2960×1848 px, 280 dpi, font scale 1. Both match
Samsung's official 14.6-inch WQXGA+ display. The captures report `screen: main`
and display 0; InsetsProbe's generic Phone label is classified as the tablet's
main screen from the model and dimensions.

- 3-button: system bars are 42 px top and 84 px bottom (24 / 48 dp).
- gesture: system bars are 42 px top and 26 px bottom (24 / 14.86 dp). Settings,
  `config_navBarInteractionMode=2` and side system gesture insets confirm gesture
  mode; Settings and inset classification agree.
- Both captures include a 186×28 px centered cutout bound (106.29×16 dp) and
  23 px rounded corners (13.14 dp).

Raw files: `measurements/galaxy-tab-s9-ultra/main-gesture.json` and
`main-threeButton.json`. The reservation confirms this exact model was offered
in RTL on this date; it does not complete the cross-region catalog inventory.

## Physical Galaxy Tab S9 measured on 2026-09-25

InsetsProbe 1.3.0 was installed through Android CLI on the user's physical
Galaxy Tab S9 Wi-Fi (SM-X710), Android 16 / One UI 8.0, build
`BP2A.250605.031.A3.X710XXS5DZA1`. Both full-screen Main captures are portrait,
rotation 0, 1600×2560 px, 340 dpi (default) and font scale 1, matching the
official 2560×1600 panel in portrait orientation. The Samsung Taskbar was enabled
for both captures and was left unchanged.

- 3-button: system bars are 64 px top and 102 px bottom (30.12 / 48 dp).
- gesture: system bars are 64 px top and 32 px bottom (30.12 / 15.06 dp).
  Settings and `config_navBarInteractionMode=2` confirm gesture mode; left/right
  system-gesture insets are 63 px. The inset-only heuristic reports
  threeButton, so retain the settings and gesture-region evidence rather than
  inferring a mode error from that heuristic.
- Both captures have no display cutout and report 21 px rounded corners
  (9.88 dp).

These are direct physical-device captures, not RTL data; the RTL catalog status
for Galaxy Tab S9 remains unknown. Raw files:
`measurements/galaxy-tab-s9/main-gesture.json` and
`main-threeButton.json`.


### Galaxy Tab S9 FE — 2026-09-25

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S9 FE 5G (SM-X516N),
Android 16 / One UI 8.5, build `BP4A.251205.006.X516NKOSEEZG3`, landscape at
rotation 1. Both captures match the main skin at 2304×1440 px, 280 dpi, with
font scale 1.08. The gesture capture is registered: Settings/configuration and
side system-gesture insets confirm gesture mode, while the inset-only heuristic
reports threeButton.

The 3-button capture is preserved as rejected evidence because both
`navigationBars` and `systemBars` report a 1 px bottom inset, including when
ignoring visibility, despite `tappableElement` and mandatory-gesture bottom
insets of 84 px. It does not provide a settled 3-button system-bar measurement.
The 2026-09-27 recapture on the same build and font scale is registered: 53/84 px
system bars (48 dp bottom), with Settings, configuration and InsetsProbe all
reporting 3-button mode. Font scale 1.08 is non-default and is
recorded as captured. On the same One UI 8.5 build family, Tab S10 FE captures
at 1.08 and 1 produced identical insets, so no normalization recapture is required.

Accepted raw file: `measurements/galaxy-tab-s9-fe/main-gesture.json`.
Accepted 3-button recapture: `measurements/galaxy-tab-s9-fe/recapture-2026-09-27/main-threeButton.json`.
Rejected raw file: `measurements/galaxy-tab-s9-fe/rejected-2026-09-25/main-threeButton.json`.


### Galaxy Tab S7 FE — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S7 FE (SM-T735), Android 13 /
One UI 5.1, build `TP1A.220624.014.T735XXS3CWE6`, landscape at rotation 1,
2560×1600 px, 340 dpi, font scale 1. Both modes record 51/102 px system bars
(24/48 dp). The gesture capture is confirmed by secure navigation mode 2,
`config_navBarInteractionMode=2` and 63 px side system-gesture insets; the
inset-only heuristic reports threeButton. Its 102 px bottom navigation, system-bar
and tappable insets match 3-button mode, consistent with the persistent One UI
5.1 tablet taskbar; the taskbar state was not recorded. The Tab S9+ and S8+
gesture captures (136 px) are larger than their 3-button bars, so this equal
pair is preserved as captured, not normalized.

Raw files: `measurements/galaxy-tab-s7-fe/main-{gesture,threeButton}.json`.


### Galaxy Tab S10 Ultra — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S10 Ultra (SM-X920), Android
14 / One UI 6.1.1, build `UP1A.231005.007.X920XXS2AYB5`, landscape at rotation 1,
2960×1848 px, 280 dpi, font scale 1. Gesture bars are 42/112 px (24/64 dp) and
3-button bars are 42/84 px (24/48 dp). Both modes include a centered 186×28 px
top cutout (16 dp safe inset) and 23 px corner radii. The gesture capture is
confirmed by secure navigation mode 2, `config_navBarInteractionMode=2` and
52 px side system-gesture insets; the inset-only heuristic reports threeButton.
The larger gesture bottom inset matches the Tab S9+/S8+ taskbar pattern. The
3-button raw screen label is `phone`; model and resolution establish the tablet
Main display.

Raw files: `measurements/galaxy-tab-s10-ultra/main-{gesture,threeButton}.json`.


### Galaxy Tab S10+ — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S10+ (SM-X820), Android 14 /
One UI 6.1.1, build `UP1A.231005.007.X820XXS2AYB3`, landscape at rotation 1,
2800×1752 px, 320 dpi, font scale 1. Gesture bars are 48/128 px (24/64 dp) and
3-button bars are 48/96 px (24/48 dp). Neither capture reports a display cutout;
corner radii are 26 px (13 dp). The gesture capture is confirmed by secure
navigation mode 2, `config_navBarInteractionMode=2` and 60 px side
system-gesture insets; the inset-only heuristic reports threeButton. The larger
gesture bottom inset matches the Tab S10 Ultra and Tab S9+/S8+ taskbar pattern.

### Galaxy Tab S10 Lite — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S10 Lite (SM-X406B), Android
16 / One UI 8.0, build `BP2A.250605.031.A3.X406BXXS2BYJ5`, landscape at rotation
1, 2112×1320 px, 240 dpi, font scale 1.15. Gesture bars are 45/23 px
(30/15.33 dp) and 3-button bars are 45/72 px (30/48 dp). Neither capture reports
a display cutout; corner radii are 20 px (13.33 dp). The gesture capture is
confirmed by secure navigation mode 2, `config_navBarInteractionMode=2` and 45 px
side system-gesture insets; the inset-only heuristic reports threeButton. The
small gesture bottom inset matches the One UI 8 Tab S10 FE pattern rather than
the One UI 6 taskbar pattern. Font scale was not recaptured at 1 because the
Tab S10 FE comparison showed no inset change. The 3-button raw screen label is
`phone`; model and resolution establish the tablet Main display.

### Galaxy Tab S7+ — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab S7+ (SM-T970, Vietnam),
Android 13 / One UI 5.0, build `TP1A.220624.014.T970XXU2DVL1`, landscape at
rotation 1, 2800×1752 px, 340 dpi, font scale 1. Both modes report 51/102 px
(24/48 dp) system bars, no display cutout and 28 px (13.18 dp) corner radii. The
gesture capture is confirmed by secure navigation mode 2,
`config_navBarInteractionMode=2` and 63 px side system-gesture insets; the
inset-only heuristic reports threeButton. The equal gesture and 3-button bottom
inset matches the One UI 5.1 Tab S7 FE pattern.

### Galaxy Tab A11 — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy Tab A11 (SM-X135F, Russia),
Android 16 / One UI 8.0, build `BP2A.250605.031.A3.X135FXXS3BZA3`, landscape at
rotation 1, 1340×800 px, 213 dpi, font scale 1. Gesture bars are 40/20 px
(30.05/15.02 dp) and 3-button bars are 40/64 px (30.05/48.08 dp). Neither capture
reports a display cutout; corner radii are 17 px (12.77 dp). The gesture capture
is confirmed by secure navigation mode 2, `config_navBarInteractionMode=2` and
39 px side system-gesture insets; the inset-only heuristic reports threeButton.
The small gesture bottom inset matches the One UI 8 Tab S10 FE and Tab S10 Lite
pattern.

### Galaxy S23 Ultra — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy S23 Ultra (SM-S918U), Android 16 /
One UI 8.5, build `BP4A.251205.006.S918USQS8FZG1`, portrait at rotation 0, default
FHD+ 1080×2316 px (scaled from the 1440×3088 panel), 450 dpi, font scale 1.
Gesture bars are 94/42 px (33.42/14.93 dp) and 3-button bars are 94/135 px
(33.42/48 dp). Both modes report a centered 54×94 px top cutout in the FHD+
coordinate space, so the cutout shape is registered, and 11 px (3.91 dp) corner
radii. Settings, configuration and inset classifications agree in both modes.

On 2026-09-28, the USA/TX SM-S918U-US01 unit supplied an InsetsProbe 1.6.0
sweep at rotations 0, 1 and 3 in both navigation modes. All six files report the
same Android 16 / One UI 8.5 build, 450 dpi, font scale 1 and full-screen
windows. Portrait bars remain 94/42 px in gesture mode and 94/135 px in
3-button mode. Landscape status bars are 84 px; the 94 px cutout moves left at
rotation 1 and right at rotation 3. Gesture retains a 42 px bottom bar, while
3-button uses a 135 px bar on the opposite side. Files are in
`measurements/galaxy-s23-ultra/recapture-2026-09-28-rotation/`; the original
portrait captures remain preserved.

### Galaxy S23+ — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy S23+ (SM-S916U), Android 16 /
One UI 8.0, build `BP2A.250605.031.A3.S916USQS6EYK3`, portrait at rotation 0,
1080×2340 px, 450 dpi, font scale 1. Gesture bars are 74/42 px (26.31/14.93 dp)
and 3-button bars are 74/135 px (26.31/48 dp). Both modes report a centered
52×74 px top cutout and 101 px (35.91 dp) corner radii. Settings, configuration
and inset classifications agree in both modes.

Landscape pilot for issue #22: the same unit was captured at rotation 1
(2340×1080 px) in both modes (`landscape-1-*.json`). The status bar grows from
74 to 84 px (29.87 dp), the cutout moves to the left (74 px), the left
system-gesture zone widens to 158 px (84 + 74), and in 3-button mode the
navigation bar moves to the right edge (right 135 px, bottom 0). Gesture mode
keeps the 42 px bottom handle. These values are stored as evidence only; the
site does not render landscape measurements yet. Rotation 3 is not collected
by convention (side button up = rotation 1). A one-off 3-button check at
rotation 3 (`landscape-3-threeButton.json`; the two supplied RTL downloads were
byte-identical, so one is stored) is the exact mirror of rotation 1 on this
unit: status bar 84 px, cutout right 74 px (rect x 2266–2340), navigation bar on
the left edge (left 135 px). Gesture mode was not captured at rotation 3.

### Galaxy S23 — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy S23 (SM-S911U), Android 13 /
One UI 5.1, build `TP1A.220624.014.S911USQS2AWIF` (security patch 2023-10-01;
the unit was not updated like the S23 Ultra/S23+ units), portrait at rotation
0, 1080×2340 px, 480 dpi, font scale 1. Gesture bars are 81/45 px (27/15 dp)
and 3-button bars are 81/144 px (27/48 dp). Both modes report a centered
56×81 px top cutout and 102 px (34 dp) corner radii. Settings, configuration
and inset classifications agree in both modes.

On 2026-09-28, India/Noida SM-S911B-IN1 supplied an InsetsProbe 1.6.0 sweep at
rotations 0, 1 and 3 in both navigation modes. All six files report Android 15 /
One UI 7.0 build `AP3A.240905.015.A2.S911BXXU8DYD9`, 480 dpi, font scale 1
and full-screen windows. Portrait remains 1080×2340 px with 81 px status and
cutout insets; landscape is 2340×1080 px with a 72 px status bar. The 81×56 px
cutout moves left at rotation 1 and right at rotation 3. Gesture keeps a 45 px
bottom bar, while 3-button uses a 144 px bar on the opposite side. Files are in
`measurements/galaxy-s23/recapture-2026-09-28-rotation/`; the original
portrait captures remain preserved.

### Galaxy S21 FE — 2026-09-27

InsetsProbe 1.3.0 captured Samsung RTL Galaxy S21 FE (SM-G990B), Android 14 /
One UI 6.1, build `UP1A.231005.007.G990BXXSCGYC9`, portrait at rotation 0,
1080×2340 px, 480 dpi, font scale 1. Gesture bars are 99/45 px (33/15 dp) and
3-button bars are 99/144 px (33/48 dp). Both modes report a centered 70×99 px
top cutout and 121 px (40.33 dp) corner radii. Settings, configuration and
inset classifications agree in both modes.

### Galaxy A54 5G — 2026-09-27

InsetsProbe 1.5.0 captured Samsung RTL Galaxy A54 5G (SM-A546B-VN1, Vietnam /
Hanoi), Android 16 / One UI 8.0, build `BP2A.250605.031.A3.A546BXXSJEZE5`,
1080×2340 px, 450 dpi, font scale 1.15, with the in-app rotation sweep in both
navigation modes. Portrait (rotation 0) gesture bars are 80/42 px (28.44/14.93
dp) and 3-button bars are 80/135 px (28.44/48 dp); both report a centered
58×80 px top cutout and 113 px (40.18 dp) corner radii. At rotations 1 and 3
the status bar is 84 px, the 80 px cutout moves to the left (rotation 1) or
right (rotation 3) edge, and the 3-button bar is a 135 px side bar opposite the
cutout; gesture keeps a 42 px bottom bar. Settings, configuration and inset
classifications agree in all six files.

Uploading the APK through WebClient Applications again stalled at 0% on this
unit (compare the 2026-09-25 A54 report above). The maintainer's manual
install in the same session succeeded, so the stall is not a model-wide
incompatibility. The in-app Upload did not reach the capture inbox because the
installed APK had been built with a blank upload key (the emulator build
setting); the six files were exported through File Browser instead.

## Galaxy Note20 and Galaxy Tab S9+/S8 series measured on 2026-09-25

Samsung RTL produced paired full-screen Main captures for Galaxy Note20 5G
(SM-N981U), Galaxy Tab S9+ (SM-X816B), Tab S8 Ultra (SM-X906B), Tab S8+
(SM-X806B), and Tab S8 (SM-X706N). The raw JSONs are retained unchanged under
`measurements/<device-slug>/main-{gesture,threeButton}.json`; each pair has the
same model/build, display 0, default font scale 1, and matching full-screen and
maximum-window dimensions.

- Note20: Android 13 / One UI 5.1, portrait 1080×2400 px at 450 dpi. Gesture
  system bars are 92/42 px top/bottom and 3-button bars are 92/135 px. Both
  modes agree with the recorded navigation setting. The centered cutout bound is
  74×92 px.
  On 2026-09-29 SM-N981U-US03 (USA/Texas, the same build) swept rotations 0, 1
  and 3 in both modes with InsetsProbe 1.6.0
  (`galaxy-note20/recapture-2026-09-29-rotation/`); rotation 0 matches the
  accepted captures.
- Tab S9+: SM-X816B, Android 14 / One UI 6.1, landscape 2800×1752 px at
  rotation 1 and 340 dpi. Gesture/button bars are 51/136 px and 51/102 px.
- Tab S8 Ultra: SM-X906B, Android 16 / One UI 8.0, landscape 2960×1848 px at
  rotation 1 and 320 dpi. Gesture/button bars are 60/30 px and 60/96 px; both
  include a centered 174×28 px cutout. Its 3-button raw screen label is `phone`,
  preserved unchanged; model and resolution establish the tablet Main display.
- Tab S8+: SM-X806B, Android 14 / One UI 6.1, landscape 2800×1752 px at
  rotation 1 and 340 dpi. Gesture/button bars are 51/136 px and 51/102 px.
- Tab S8: SM-X706N, Android 16 / One UI 8.0, landscape 2560×1600 px at
  rotation 1 and 340 dpi. Gesture/button bars are 64/32 px and 64/102 px.

For all four tablets, the gesture captures record secure navigation mode 2 and
`config_navBarInteractionMode=2`, with 60–63 px left/right system-gesture
regions. InsetsProbe's inset-only heuristic reports threeButton because the
landscape system-bar pattern is ambiguous. Settings/configuration and side gesture
insets support the recorded gesture mode; the mode is not inferred from bottom
inset size. The captures contain no hinge features and the Tab S8 Ultra's generic
`phone` label is only a Probe label; raw evidence has not been rewritten.


## Galaxy Note20 Ultra 5G measured on 2026-09-25

Samsung RTL captures for SM-N985F (Android 13 / One UI 5.1, build
`TP1A.220624.014.N985FXXSIHYH3`) form a matched main-display pair. Both are
portrait, display 0, rotation 0, full-screen 1080×2316 px at 420 dpi and font
scale 1; the active FHD+ window is on the 1440×3088 physical panel. The 3-button
capture (content 81) and gesture capture (content 92) each agree with Android
Settings and InsetsProbe. System bars are 67/126 px top/bottom in 3-button mode
and 67/39 px in gesture mode. The safe cutout inset is 67 px at the top. Raw
cutout bounds are centered near x=720 on a 1440 px display coordinate space, so
the module renders the safe inset only and does not scale the cutout shape onto
the 1080 px active window. Samsung lists the 6.9-inch, 3088×1440, 496 ppi panel
in its [Note20 series specifications](https://news.samsung.com/global/samsung-unveils-five-new-power-devices-in-the-galaxy-ecosystem-to-empower-their-work-and-play).

Raw files: `measurements/galaxy-note20-ultra/main-threeButton.json` and
`main-gesture.json`.

On 2026-09-29, Russia/Moscow SM-N985F-RU1 supplied an InsetsProbe 1.6.0 sweep
at rotations 0, 1 and 3 in 3-button mode. All three files report the same
Android 13 / One UI 5.1 build, 420 dpi, font scale 1, full-screen windows and
agreement between navigation settings and insets. Portrait remains 1080×2316 px;
landscape is 2316×1080 px with a 63 px top status inset and a 126 px navigation
inset on the right at rotation 1 or left at rotation 3. The cutout safe inset is
67 px on the opposite side. As in portrait, the raw cutout rectangles are
off-centre, so no cutout shape is registered. The accepted raw files are in
`measurements/galaxy-note20-ultra/recapture-2026-09-29-rotation/`.

The same session produced a gesture-labelled sweep, but all three files report
`configNavBarInteractionMode: 2` while `settingsSecureNavigationMode` remains 0.
The portrait system-bar bottom inset is still the 3-button value, 126 px. The
three raw files are preserved under
`measurements/galaxy-note20-ultra/rejected-2026-09-29-navigation-mismatch/` and
are not published as landscape gesture values. Gesture rotations 1 and 3 need
fresh captures with matching configuration, setting and insets.


## Galaxy A27 5G measured on 2026-09-25

Samsung RTL model SM-A276K (Korean carrier name Galaxy Jump5), Android 16 /
One UI 8.5, build `BP4A.251205.006.A276KKSU2AZH3`, was captured in both main
navigation modes. The portrait display is 1080×2340 px, display 0, rotation 0,
450 dpi and font scale 1. Gesture (content 93) and 3-button (content 94) each
agree with Settings and InsetsProbe. System bars are 102/42 px top/bottom in
gesture mode and 102/135 px in 3-button mode. Both files report a 94 px top safe
inset and the same centered 70×70 px cutout bound at x=505, y=24. The official
skin's main display rectangle matches the measured active window. Samsung
identifies the SM-A276K Korean device as Galaxy Jump5 with a 169.1 mm,
1080×2340 FHD+ display; Samsung's global product naming is Galaxy A27 5G.
[Samsung Korea specs](https://www.samsung.com/sec/support/model/SM-A276KZKAKTC/) ·
[Samsung Galaxy A27 5G announcement](https://news.samsung.com/uk/samsung-galaxy-a27-5g-brings-an-immersive-display-and-awesome-intelligence-to-more-users).

Raw files: `measurements/galaxy-a27-5g/main-gesture.json` and
`main-threeButton.json`.

The two captures supplied as Galaxy A26 identify the device as
SM-A276B / `a27xq`, which Samsung identifies as Galaxy A27 5G. They are not
Galaxy A26 captures (that model uses SM-A266B). The SM-A276B gesture and
3-button captures were preserved byte-for-byte under
`measurements/galaxy-a27-5g/SM-A276B/`. Both independently match the existing
SM-A276K A27 captures: 1080×2340 px, 450 dpi, font scale 1, Android 16 / One UI
8.5, status bar 102 px, cutout safe inset 94 px with the same 70×70 px bound,
and navigation bar 42 px (gesture) / 135 px (3-button). The active A27 values
therefore remain unchanged; these files corroborate them across regional SKUs.
[Samsung identifies SM-A276B as Galaxy A27 5G](https://www.samsung.com/ie/smartphones/galaxy-a/galaxy-a27-5g-blue-256gb-sm-a276bzbceub/).


## Galaxy A-series measured on 2026-09-25

- Galaxy A32 LTE (SM-A325F), Android 13 / One UI 5.1, build
  `TP1A.220624.014.A325FXXSCDYA2`: both Main captures are 1080×2400 px at
  420 dpi and font scale 1.1. Gesture bars are 80/39 px; 3-button bars are
  80/126 px. Both agree with Settings and InsetsProbe; the centered cutout is
  144×80 px with an 80 px safe inset. Registered against the matching Galaxy
  A32 skin.
- Galaxy A32 5G (SM-A326B), Android 13 / One UI 5.1, build
  `TP1A.220624.014.A326BXXSECYB5`: both Main captures are 720×1600 px at
  300 dpi, font scale 1. Gesture bars are 53/28 px; 3-button bars are
  53/90 px. Both agree with Settings and InsetsProbe; the centered cutout is
  96×53 px with a 53 px safe inset. Registered against the separate A32 5G
  skin; this lower-resolution display is not interchangeable with A32 LTE.
- Galaxy A53 5G (SM-A536B), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A536BXXSDEYB9`: both Main captures are 1080×2400 px at
  450 dpi, font scale 1.1. Gesture bars are 88/42 px; 3-button bars are
  88/135 px. Both agree with Settings and InsetsProbe; the centered cutout is
  56×88 px with an 88 px safe inset.
- Galaxy A52s 5G (SM-A528B), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A528BXXSAGYA2`: both Main captures are 1080×2400 px at
  450 dpi. Gesture bars are 88/42 px top/bottom; 3-button bars are 88/135 px.
  The 56×88 px centered cutout and 88 px safe top inset agree across both
  captures, and Settings agrees with the reported navigation mode. The device
  was captured at font scale 1.1, so retain this condition when comparing its
  values. Samsung lists the same 1080×2400 display and 159.9×75.1×8.4 mm body
  as the A52 family; the page reuses the official A52 skin for that shared
  geometry. [Samsung A52s 5G specifications](https://www.samsung.com/pt/smartphones/galaxy-a/galaxy-a52s-5g-awesome-white-256gb-sm-a528bzwheub/).
- Galaxy A24 (SM-A245F), Android 13 / One UI 5.1, build
  `TP1A.220624.014.A245FXXU2AWE6`: both Main captures are 1080×2340 px at
  450 dpi, font scale 1. Gesture bars are 77/42 px top/bottom; 3-button bars
  are 77/135 px. Both report a 77 px safe cutout inset, the same centered
  126×77 px cutout bounds and 90 px rounded corners; Settings agrees with both
  navigation modes. Samsung's official A24 skin matches the captured display.
- Galaxy A23 5G skin comparison uses captures from Galaxy A23 LTE (SM-A235F),
  Android 14 / One UI 6.1, build `UP1A.231005.007.A235FXXSDEYL2`. Both Main
  captures are 1080×2408 px at 450 dpi, font scale 1. Gesture bars are 66/42 px;
  3-button bars are 66/135 px. Both agree with Settings and InsetsProbe; the
  144×66 px centered cutout and 66 px safe inset match. Samsung lists the LTE
  unit with the same 1080×2408 display and 165.4×76.9×8.4 mm body as the 5G
  skin model, so the measurements are shared by screen/body geometry while the
  raw JSON retains SM-A235F. [Samsung A23 LTE specifications](https://www.samsung.com/sa_en/business/smartphones/galaxy-a/galaxy-a23-sm-a235fzovmea/) ·
  [A23 5G dimensions](https://www.samsung.com/es/smartphones/galaxy-a/galaxy-a23-5g-awesome-blue-64gb-sm-a236blbueub/).
- Galaxy A34 5G (SM-A346E), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A346EXXS9CYD1`: both Main captures are 1080×2340 px at
  450 dpi, font scale 1.1. Gesture bars are 75/42 px; 3-button bars are
  75/135 px. Both agree with Settings and InsetsProbe; the centered cutout
  bounds are 144×75 px and the safe top inset is 75 px.
- Galaxy A33 5G (SM-A336E), Android 13 / One UI 5.1, build
  `TP1A.220624.014.A336EDXS7CWJ1`: both Main captures are 1080×2400 px at
  450 dpi, font scale 1.1. Gesture bars are 80/42 px; 3-button bars are
  80/135 px. Both agree with Settings and InsetsProbe; the centered cutout
  bounds are 144×80 px and the safe top inset is 80 px.
- Galaxy A73 5G (SM-A736B), Android 15 / One UI 7.0, build
  `AP3A.240905.015.A2.A736BXXUAFYE6`: the fresh Main gesture capture is
  1080×2400 px at 450 dpi, font scale 1, with 98/42 px system bars and a 98 px
  cutout safe inset. The supplied 3-button JSON has a 2025-05-15 timestamp; it
  is preserved under `measurements/galaxy-a73-5g/recapture-2025-05-15/` and is
  not registered. The 2026-09-27 recapture on the same build supplies 98/135 px
  3-button bars and reproduces every gesture value; both files are kept under
  `measurements/galaxy-a73-5g/recapture-2026-09-27/`.
- Galaxy A13 LTE (SM-A135F), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A135FXXSEEZE3`: both captures agree with Settings and
  InsetsProbe at 1080×2408 px, 450 dpi and font scale 1. Gesture system bars
  are 70/42 px and 3-button bars 70/135 px; the cutout safe inset is 65 px
  with 172×65 px bounds. These raw captures are preserved under
  `measurements/galaxy-a13-lte/` but are not attached to the A13 5G skin:
  Samsung's A13 5G skin is 720×1600 px, so its display geometry does not match.
  The earlier generic A13 0% installation report therefore remains unresolved
  for its unidentified SKU; SM-A135F did install and produce captures in RTL.
- Galaxy A55 5G / Galaxy Quantum5 (SM-A556S), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A556SKSS9DZG1`: both Main modes are portrait 1080×2340 px
  at 450 dpi, font scale 1. Gesture system bars are 89/42 px top/bottom;
  3-button bars are 89/135 px. Both report an 89 px cutout safe inset and the
  same centered 66×66 px camera bound. Samsung identifies the measured Korean
  SKU as Galaxy Quantum5 and lists the same 1080×2340 display as Galaxy A55 5G.
  [Samsung Korea specs](https://www.samsung.com/sec/support/model/SM-A556SZKBSKC/) ·
  [Galaxy A55 5G specs](https://www.samsung.com/mx/smartphones/galaxy-a/galaxy-a55-5g-awesome-navy-256gb-sm-a556ezkqltm/).
- Galaxy A35 5G (SM-A356N), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A356NKSS9DZG1`: both Main modes are portrait 1080×2340 px
  at 450 dpi, font scale 1. Gesture system bars are 101/42 px top/bottom;
  3-button bars are 101/135 px. Both report an 89 px safe cutout inset and a
  centered 66×66 px camera bound. [Samsung Korea specs](https://www.samsung.com/sec/support/model/SM-A356NLBWKOD/).
- Galaxy A25 5G (SM-A256N), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A256NKSSAEZG1`: both Main modes are portrait 1080×2340 px
  at 450 dpi, font scale 1. Gesture system bars are 77/42 px; 3-button bars
  are 77/135 px. Both report a 77 px safe cutout inset and the same centered
  126×77 px bound. The raw captures are preserved under
  `measurements/galaxy-a25-5g/`, but the repository has no official A25 skin,
  so they are not attached to a public device route. No skin artwork was
  inferred from another A-series model. [Samsung identifies SM-A256N as Galaxy A25 5G](https://www.samsung.com/sec/support/model/SM-A256NLBAKOD/).
- Galaxy A14 LTE (SM-A145F), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A145FXXS9CYB1`: both Main modes are portrait 1080×2408 px
  at 450 dpi, font scale 1. Gesture system bars are 65/42 px top/bottom;
  3-button bars are 65/135 px. Both report a 64 px safe cutout inset and the
  same centered 144×64 px camera bound. Samsung's official A14 skin is the 5G
  variant with the same 1080×2408 screen resolution; insets are from the LTE
  unit and its exact software build. [Samsung A14 display information](https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2023_4Q_Interim_Report.pdf) ·
  [A14 5G specs](https://www.samsung.com/es/smartphones/galaxy-a/galaxy-a14-5g-black-128gb-sm-a146pzkgeub/).
- Galaxy A04 (SM-A045F), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A045FXXSFEZE2`: both Main modes are portrait 720×1600 px
  at 300 dpi, font scale 1. Gesture system bars are 48/28 px top/bottom;
  3-button bars are 48/90 px. Both report a 45 px safe cutout inset and the
  same centered 176×45 px camera bound. The status inset is 3 px taller than
  the cutout safe inset. [Samsung A04 specs](https://www.samsung.com/id/smartphones/galaxy-a/galaxy-a04-black-32gb-sm-a045fzkdxid/).
- Galaxy A16 LTE (SM-A165N), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A165NKSS8DZG1`: both Main modes are portrait 1080×2340 px
  at 450 dpi, font scale 1. Gesture system bars are 100/42 px top/bottom;
  3-button bars are 100/135 px. Both report a 100 px top cutout safe inset and
  the same centered 140×100 px U-shaped camera bound. Samsung lists the same
  169.1 mm, 1080×2340 display geometry for A16 LTE and A16 5G; the available
  official artwork is the A16 5G skin. Insets are from the LTE unit and its
  exact software build. [A16 LTE specs](https://www.samsung.com/sec/support/model/SM-A165NLGEKOO/) ·
  [A16 5G specs](https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a16-5g-blue-black-128gb-sm-a166bzkdeub/).
- Galaxy A15 LTE (SM-A155F), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A155FXXS6BYE1`: both Main modes are portrait 1080×2340 px
  at 450 dpi, font scale 1. Gesture system bars are 80/42 px top/bottom;
  3-button bars are 80/135 px. Both report an 80 px top cutout safe inset and
  the same centered 136×80 px camera bound. Samsung lists 163.9 mm,
  1080×2340 displays for both A15 LTE and A15 5G; the available official
  artwork is the A15 5G skin. Insets are from the LTE unit and its exact
  software build. [A15 LTE specs](https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a15-blue-128gb-sm-a155fzbdeub/) ·
  [A15 5G specs](https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a15-5g-blue-black-128gb-sm-a156bzkdeub/).
- Galaxy A06 (SM-A065F), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A065FXXS3AYB1`: both Main modes are portrait 720×1600 px
  at 300 dpi, font scale 1. Gesture system bars are 43/28 px top/bottom;
  3-button bars are 43/90 px. Both report a 43 px top cutout safe inset and
  an 80×43 px centered camera bound. [Samsung A06 specs](https://www.samsung.com/levant/smartphones/galaxy-a/galaxy-a06-black-64gb-sm-a065fzkdmea/).
- Galaxy A05 (SM-A055F), Android 14 / One UI 6.1, build
  `UP1A.231005.007.A055FXXS8CYC3`: both Main modes are portrait 720×1600 px
  at 300 dpi, font scale 1. Gesture system bars are 59/28 px top/bottom;
  3-button bars are 59/90 px. Both report a 59 px top cutout safe inset and
  an 80×59 px centered camera bound. Samsung's raw rounded-corner fields are
  unavailable, so no corner radius is published. [Samsung A05 specs](https://www.samsung.com/ph/smartphones/galaxy-a/galaxy-a05-black-128gb-sm-a055fzkgphl/).
- Galaxy A57 5G (SM-A576S), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A576SKSU1AZG7`: both Main modes are full-screen portrait
  1080×2340 px at 450 dpi, font scale 1. The captures agree on navigation mode.
  System bars are 97/42 px top/bottom in gesture mode and 97/135 px in
  3-button mode; the cutout safe inset is 82 px, with a centered 58×58 px bound.
  On 2026-09-29 SM-A576S_KR1 (Korea/Gumi, the same build) swept rotations 0,
  1 and 3 in both modes with InsetsProbe 1.6.0
  (`galaxy-a57-5g/recapture-2026-09-29-rotation/`); rotation 0 matches the
  accepted captures.
- Galaxy A07 5G (SM-A076M), Android 16 / One UI 8.0, build
  `BP2A.250605.031.A3.A076MXXS4AZD2`: both Main modes are full-screen portrait
  720×1600 px at 300 dpi, font scale 1. Gesture system bars are 64/28 px and
  3-button bars are 64/90 px. Both report a 64 px safe cutout inset and agree
  with Android Settings and InsetsProbe. The official Galaxy A07 skin's 720×1600
  display rectangle matches the capture; Samsung lists a 6.7-inch HD+ display
  and a January 2026 launch for A07 5G. The skin's shell art is retained as
  supplied and is not used as measured device thickness.
  [Samsung A07 5G specifications](https://www.samsung.com/br/smartphones/galaxy-a/galaxy-a07-5g-black-128gb-sm-a076mzkbzto/) ·
  [Samsung launch announcement](https://news.samsung.com/global/samsung-launches-galaxy-a07-5g-bringing-intelligence-and-reliable-performance-to-more-galaxy-a-series-devices).
- Galaxy A37 5G (SM-A376N), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A376NKSS2AZG1`: both Main modes are full-screen portrait
  1080×2340 px at 450 dpi, font scale 1. Gesture system bars are 101/42 px;
  3-button bars are 101/135 px. Both report a 92 px safe cutout inset and
  agree with Android Settings and InsetsProbe. The initial 3-button attempt
  reported a 1 px bottom system inset and remains preserved as rejected evidence;
  the later valid recapture is registered as `main-threeButton.json`.
- Galaxy A17 LTE (SM-A175N), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A175NKSS6CZG1`: both modes are full-screen portrait
  1080×2340 px at 450 dpi, font scale 1. System bars are 100/42 px in gesture
  mode and 100/135 px in 3-button mode; both captures report a centered
  140×100 px camera bound. The measured Korean SKU is Galaxy A17 LTE (SM-A175N).
  Samsung lists the same 164.4×77.9×7.5 mm body, 169.1 mm / 6.7-inch display,
  and 1080×2340 resolution for the LTE and 5G variants, so the LTE capture is
  used for their shared A17 screen geometry. The raw SKU and Android / One UI
  build remain explicit; navigation insets are evidence from that measured
  software configuration. [A17 LTE specs](https://www.samsung.com/sec/support/model/SM-A175NZAAKOD/) ·
  [A17 5G specs](https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a17-5g-grey-128gb-sm-a176bzaaeub/).
- Galaxy A56 5G (SM-A566B), Android 15 / One UI 7.0, build
  `AP3A.240905.015.A2.A566BXXS4AYE6`: both modes are full-screen portrait
  1080×2340 px at 450 dpi, font scale 1. System bars are 92/42 px in gesture
  mode and 92/135 px in 3-button mode, with a 92 px safe top cutout inset.
  Installation note (2026-09-25): the user reported an A56 Remote Test Lab
  session where the Probe APK install remained at 0%. The failing unit's exact
  SKU, Android version and RTL location were not provided. This does not
  invalidate the earlier accepted SM-A566B captures above.
- Galaxy A36 5G (SM-A366N), Android 16 / One UI 8.5, build
  `BP4A.251205.006.A366NKSS8CZG1`: both modes are full-screen portrait
  1080×2340 px at 450 dpi, font scale 1. System bars are 101/42 px in gesture
  mode and 101/135 px in 3-button mode; both include a centered 68×68 px bound
  and 92 px cutout safe inset.
  On 2026-09-29 SM-A366N_KR3 (Korea/Gumi, the same build) swept rotations 0,
  1 and 3 in both modes with InsetsProbe 1.6.0
  (`galaxy-a36-5g/recapture-2026-09-29-rotation/`); rotation 0 matches the
  accepted captures.

All valid navigation settings and Probe modes agree. Raw captures are preserved
under each model's `measurements/<slug>/` directory; the invalid A37 button-mode
file is retained as rejected evidence and is not published. Samsung's official
model specifications confirm the matching 6.7-inch 1080×2340 displays for
[A57](https://www.samsung.com/br/smartphones/galaxy-a/galaxy-a57-5g-awesome-icyblue-256gb-sm-a576blbfzto/),
[A37](https://www.samsung.com/sec/support/model/SM-A376NLVAKOD/),
[A17 LTE](https://www.samsung.com/sec/support/model/SM-A175NZAAKOD/),
[A56](https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a56-5g-awesome-graphite-256gb-sm-a566bzkceub/) and
[A36](https://www.samsung.com/sec/support/model/SM-A366NZKAKOD/).

The earlier Galaxy Z TriFold 3-button cover attempt from `content (34)` is also
preserved under `measurements/galaxy-z-trifold/rejected-2026-09-25/`: it has
font scale 1.08 and no WindowManager folding feature; the later 2026-09-24T15:17Z
recapture remains the accepted cover 3-button evidence.
