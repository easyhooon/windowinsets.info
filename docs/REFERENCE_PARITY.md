# safearea.info parity — 2026-09-22

## Ko-fi support link — 2026-09-28

The owner requested a low-key funding link on the site and GitHub. The site
places it next to the existing GitHub star prompt in the sidebar footer, away
from the measurement diagram and controls. This is an intentional project-specific
addition to the reference UI, with no popup or persistent banner. The README
has a short support callout. Site link activations emit `support_click` in GA4;
donations are not measured by the site.

## TriFold support — 2026-09-24

The owner approved official artwork plus a two-hinge 3D animation, with the same
visual role as the reference's iPhone Duo. The live reference was checked at
1512×716 and 390×844: retain its Outer/Inner selector and Pose/Hinge control group.
TriFold reuses the existing canvas, controls, zoom, pan and rotation.

Android-specific substitutions and evidence boundaries:

- A distinct `foldable-trifold` model uses three closed rigid housings and two
  inward cylindrical hinge strips. The fixed middle panel carries the rear-facing
  cover artwork. The [Samsung folding guide](https://www.samsung.com/us/support/answer/ANS10010261/)
  specifies left first, then right when closing; opening reverses that order.
  The [Korean service guide](https://www.samsungsvc.co.kr/solution/4498019)
  confirms that closing the camera-bearing side first triggers a warning and vibration.
  Left/right here are viewed from the unfolded inner display.
- The TriFold view faces the inner display while the left wing and most of the
  right wing fold, so both bends stay readable, like the Fold/Flip reveal. Only in
  the last third of the sequence (right wing below 120°) does the chassis ease a
  half turn to the middle panel's rear cover. Cover measurements replace inner ones
  once that turn passes 90°. This replaces a linear turn tied to the right wing,
  which showed the right wing's fold edge-on. Camera position stays fixed.
- The Hinge dropdown shows **left / right** angles and one coordinated fold
  sequence slider. This prevents a right-first closing order. Closed is 0°/0°,
  Partially Folded is 90°/180°, and Open is 180°/180°. The slider's 0–180 range
  denotes sequence position, not a sensor reading or Android posture.
- Fold, Flip and TriFold use a fixed head-on perspective camera, matching the
  reference iPhone Duo: at intermediate hinge angles, panel edges swinging toward
  the viewer grow, so the silhouette narrows into the hinge (#18). The z=0 plane
  keeps the shared frustum scale; open displays lie on it and the closed cover is
  seated on it, so zoom stays CSS px per dp in flat poses. Auto-fit holds the current
  scale while the hinge moves, then eases to the new pose's fit once it settles.
  Fold opens across its width; Flip opens across its height.
  Perspective, lighting and moving hinges show depth; explicit zoom/pan remain user-controlled.
  Metrics explains that dp measures layout space, so outer/inner dp heights can
  differ even when the physical device height stays the same.
- The ZIP supplies flat artwork, not CAD. Equal panel division, hinge curvature,
  housing depth, gaps and partial poses are illustrative. They do not assert
  hardware-supported intermediate window states or measurement accuracy.
- RTL captures verify main and cover insets in both navigation modes; exact px
  values come from the accepted captures.
  The physical camera stays in the official foreground mask.
- Reduced motion applies the endpoint immediately. Missing/lost WebGL uses the
  correct official cover or main SVG preview. JSON export preserves both screens
  with pending/null data only for missing captures and reports the new form factor
  and animation capability.

Validation: all six imported image/mask/layout files match the supplied ZIP bytes.
Typecheck and the static prerender build pass, including `/galaxy-z-trifold` and
its sitemap entry. The 32 Node rendering/export checks pass. Desktop and mobile
browser checks cover both hinge stages, endpoints, rotation, frame toggling,
manual zoom, reduced motion and unavailable WebGL. Existing Fold/Flip geometry,
fit, pan, hinge controls and S25 Ultra exact-px checks also pass. No raw capture
files were created for the initial artwork change. The subsequent RTL capture
set and log provenance are documented in `measurements/galaxy-z-trifold/README.md`.


## Binding development direction

WindowInsets is a faithful Android clone of safearea.info. “Clone” means the live
reference supplies the default answer for visual and interaction decisions; it does
not mean taking selected ideas and redesigning them into a different dashboard.
The product should feel like the same tool operating on Android measurements and
Samsung hardware.

Use this decision order for every frontend change:

1. Reproduce the reference information architecture, component placement, visual
   proportions, typography, spacing, responsive behavior and interaction model.
2. Substitute Android concepts only where the underlying platform meaning differs.
   Keep the reference hierarchy and presentation around that substitution.
3. Preserve measurement truth. A missing Android value remains pending, and a view
   rotation never turns one capture into another orientation's insets.
4. Add an Android-only control only when the dataset cannot be represented without
   it, such as navigation mode, outer/inner display or hinge state. Place it in the
   closest reference control group without reorganizing the primary experience.
5. Treat independent enhancements as a separate proposal after parity is reached.
   They require an explicit product decision and must not silently replace the clone
   baseline.

Reference parity takes priority over subjective polish. A new summary card, metric
visualization, section order, label, breakpoint or interaction is acceptable only
when it has a reference analogue or is a documented Android substitution. In
particular, enlarging values or rearranging Top/Right/Bottom/Left into a custom
directional dashboard is not parity when safearea.info presents those values as
metric rows.

Semantic parity is as important as appearance. A section titled **Safe Area Insets**
must show the effective safe-area values, not raw `systemBars`. Android-only raw
values such as System Bars and Display Cutout belong in a reference-shaped detail or
reserved-region presentation, with their relationship to the safe area made clear.

## Parity workflow and completion gate

Before changing a reference-facing surface, inspect the current live safearea.info
page at representative desktop and mobile sizes and record any behavior not already
captured below. Implement against that observation, then compare the reference and
local page side by side at the same viewport.

A parity change is complete only when all of the following are true:

- Desktop and mobile preserve the same hierarchy, control grouping, major spacing
  relationships and responsive transitions as the reference.
- Diagram sizing, label styling, pan/zoom/rotation and direct manipulation match the
  reference behavior for equivalent states.
- Fold and Flip views remain visually stable when closed, partially folded and open;
  hinge motion introduces no clipping, mirrored text, detached artwork or layout
  jump.
- A bar phone, Fold and Flip are checked with measured data, pending data and both
  Android navigation modes where available.
- Every visible difference is either fixed or listed under **Remaining differences**
  with its Android/data rationale. A passing typecheck or build alone is not visual
  parity evidence.

## Target and evidence

The product is a faithful Android clone of [safearea.info](https://safearea.info/),
not a differently designed metrics dashboard. Inspected the live page at 1440×1000
and its mobile presentation. Tested the closed and partially folded views, view
settings and four orientation choices. Samsung artwork was supplied by the owner
from https://developer.samsung.com/galaxy-emulator-skin.

## Observed behavior and implementation

| Surface | Reference | Current implementation |
| --- | --- | --- |
| Desktop layout | Device list, Metrics, large canvas; controls in header | Same three columns, independent scrolling and draggable/keyboard width handles |
| Mobile | Model selector, collapsible Metrics, bottom controls | Implemented, checked at 390×844 |
| Device navigation | Searchable grouped list with selected model | Android family tabs (All/Z/S/Tab/Note/A), collapsible series groups, cross-family search, active model on home and detail routes |
| Viewport | Scroll/drag pan, pinch zoom, +/−, 0 fit | Pointer pan/touch pinch, native wheel pan/Ctrl-wheel zoom, zoom shown as CSS px per dp (10–500%, auto-fit capped at 100%) so every series shares one scale, ResizeObserver fit |
| Orientation | Portrait, left/right landscape, upside down | Phones and foldables (bar, Flip, Fold, TriFold) offer three: Galaxy devices leave 180° out of auto-rotation there, so apps do not turn upside down (Fold confirmed on a real unit, folded and unfolded, 2026-09-27; TriFold assumed to match until checked). Tablets rotate 180° (confirmed) and keep all four. Flat devices re-lay out upright in the chosen orientation (swapped size, turned corners and artwork) with a 300 ms decelerating turn; screen content and measurement numbers counter-rotate to stay upright, while external measurement rulers briefly disappear during the turn, as on the reference. Insets appear only for captured rotations, otherwise "not measured yet". 3D foldables still rotate the recorded view |
| Fold | Closed/partial/open, arbitrary hinge | Presets and slider, eased three.js hinge, rigid outer panels, closed solid shell, reduced-motion support |
| Layers | Safe area/insets/reserved/corners | Independent legend toggles; Android cutout bounding region replaces iOS reserved regions |
| Settings | Frame, regions, dimensions, units | All switches plus Android dp/px and navigation mode |
| Measurements | Labels and clickable metrics | Whole metric rows and 2D/3D labels copy values; exact captured px is kept separately from rounded dp |
| Display metadata | Logical size, panel resolution, physical density and scale | Android adds Captured Window and Android Density so active WindowMetrics are not mislabeled as native panel resolution or physical PPI; Aspect Ratio is derived from panel resolution and rounded to a compact whole-number ratio; `sw600dp` reports whether the selected display's smallest logical dimension is at least 600 dp |
| Reserved regions | Size and four directional offsets | Android cutout bounds expose Size plus Left/Top/Right/Bottom distances in the same hierarchy |
| Data export | No observed per-device JSON download | Intentional Android-service divergence: a compact Export JSON action in the Metrics header downloads the complete versioned evidence payload |
| Artwork | Per-device frames | Official Fold8 main/cover, Flip8 main/cover and 28 S20–S26 variants aligned by original layout coordinates |

## Proportions and measurement correction

A display is mapped using its own logical width/height, preserving the ratio of
every inset to the screen. Official artwork is aligned using its display rectangle,
not its larger decorative background rectangle. The 3D plane includes annotation
margins in its aspect calculation; the solid chassis excludes those margins.

The legacy Fold8 main capture has `widthPx: 1248`, `heightPx: 1972`. Both navigation
captures match the COVER layout exactly. The official main layout is 2448×1848.
The previous renderer rotated 1248×1972 and treated it as the unfolded display;
that was a data classification error, not an orientation correction. The dated
recapture now supplies separate 1248×1972 cover and 2448×1848 landscape inner
measurements in both navigation modes. No legacy raw JSON was changed. Skin
dimensions never produce dp metrics/insets.

## Exact units and Android substitutions — 2026-09-23

Captured px and rounded dp are separate evidence. The px view uses raw
`currentWindowPx`, system-bar px, display-cutout px, rounded-corner px and cutout
bounds; it never multiplies rounded dp back by Android density. If any required raw
px field is absent, px mode is unavailable and the missing value stays pending.

`Resolution` means sourced physical panel resolution. `Captured Window` means the
active app/window extent recorded by InsetsProbe and can differ because of display
mode or a user/device override. `Physical Density` is reserved for sourced panel
PPI; `Android Density` and `Scale` report the logical density used for dp. These
extra rows are Android-specific substitutions needed to avoid presenting unlike
measurements as if they were the same safearea.info metric.

The displayed zoom is CSS pixels per dp for every series, so Z, S, A, Note and
Tab percentages are comparable; the internal canvas scale converts through a
per-device factor, and automatic fit never exceeds 100%. Fold, Flip and TriFold
use a fixed head-on perspective camera whose z=0 plane carries that scale; flat
poses keep the facing display on it. Automatic fit targets the visible pose: the
scale stays constant while the hinge moves, then eases (instantly under reduced
motion) to the settled pose's fit through the same path as the Fit control. The
fold fit scales the projected body with label room measured from a layout at a
fixed-room base scale, shrinking only if lanes laid out at the result need more
room, and keeps the device clear of the overlaid legend. Flat bar and tablet
fits reserve the same legend room (2026-09-26); before this they centered in the
full canvas and the legend could cover the body's lower edge. Explicit zoom and pan
remain unchanged through poses. `fit-transition.spec.ts` checks constant scale
during motion, the per-pose endpoint fit, manual zoom/pan, and reduced motion on
desktop and mobile.

## Verification

- `node --test tests/rendering.test.mjs`: 17 deterministic checks covering every
  animation degree, endpoints, exact raw px/dp/cutout evidence, safe-area px math,
  physical offset, closed chassis and official asset rectangles.
- Browser-driven Playwright/AX checks: desktop and 390px mobile layouts, device
  navigation, Metrics disclosure, dp/px settings, orientation, pose, keyboard +/0,
  official artwork loading and console errors. Metric rows report “Copied”; the
  WebGL cover-label test also reads back the exact displayed clipboard value.
- `pnpm test:visual` is the committed Chrome screenshot and interaction regression
  floor: 40 tests and 64 approved images cover desktop and 390px mobile, per-device
  JSON downloads, S25 Ultra
  navigation/unit/orientation combinations, Fold/Flip poses, exact px, real hinge
  interpolation, reduced motion, fit/manual zoom/pan behavior, keyboard Fit recovery
  and cover-label copy.
  Real two-finger touch gestures still need device testing; desktop synthetic wheel
  and keyboard checks do not prove hardware touch behavior.
- 2026-09-23 parity pass: Chrome checks at 1512×716 and 390×844 covered Fold8
  0°/90°/180°, Flip8 cover/90°/open, measured Fold7 0°/90°/180°, S25 Ultra exact px,
  gesture/3-button switching, 2×2 mobile legend, readable controls, full metric-row
  keyboard copy, automatic target-screen fit and stable manual zoom across Fold8's
  animated endpoint.
- S-series batch: 26 imported image/mask pairs match their downloaded ZIP bytes.
  All 28 S-series routes are prerendered. Chrome visual checks cover S20, S23 Ultra,
  S26 Ultra and S26 FE at 390×844; mobile zoom was exercised from 63% to 50%, and
  S25 Ultra retained its measured 384×832 dp display and 34.13/48 dp system bars.
  S20's lower-resolution foreground mask now fills the layout rectangle exactly,
  removing letterboxed gaps; its curved outer chassis has a separate crop.
  Mobile controls use two grid rows so Zoom cannot shrink to an icon-width strip.
- Remaining-skin registration: catalogue uniqueness, all main/cover asset links
  and TriFold registration are covered by the Node rendering tests. Chrome checks covered
  Tab S11 Ultra, mask-free Tab S4, Fold5 main/cover switching, and the natively
  landscape Tab Active4 Pro at 390×844. Registration uses static artwork; it does
  not assert animation completeness or measured device geometry for these models.

## Remaining differences

- **Device family tabs and collapsible groups** are an intentional navigation
  divergence. The Android catalogue has substantially more form factors and
  models than the reference. The dedicated A tab avoids a long scroll to its
  entries; groups begin with the active model's series open, can be toggled
  independently, and search shows matches across all families.
- **Brand tabs and emulator provenance** (2026-09-27, issue #23) are an Android
  addition. A Galaxy/Pixel segmented control sits above the family tabs. Pixel
  entries use AOSP emulator skins and Android Emulator captures, so the evidence
  panel replaces the Samsung RTL block with the emulator manifest, profile and
  build, and the canvas notes that values were not measured on Pixel hardware.
- The light Porcelain Pixel Tablet AOSP frame gets a subtle SVG outline around
  its body clip so its edge remains visible on the light canvas. The original
  artwork and measured display geometry are unchanged; other device skins keep
  their existing rendering.
- **Export JSON** is an intentional product divergence from the observed
  safearea.info UI. Android consumers need exact probe dp/px, navigation-mode,
  display and provenance data outside the visual tool. The action stays secondary
  in the Metrics header on desktop and mobile so it does not reorganize the
  reference-shaped canvas controls. Its v1 contract and derivation boundaries are
  documented in `JSON_EXPORT.md`.
- **Aspect Ratio** is an owner-requested Android metric with no safearea.info
  counterpart. It appears as a row in the existing Dimensions section for every
  selected display, derived from its panel resolution and rounded to the nearest
  compact whole-number width:height ratio. Missing panel resolution remains
  pending; view rotation does not change the reported ratio.
- **sw600dp** is an owner-requested Android metric with no safearea.info counterpart.
  It appears beside the selected display's dimensions and reports whether the
  shorter logical dimension is at least 600 dp. Its inline help expands the
  Android smallest-width qualifier and the threshold rule. Missing logical size
  remains pending.
- Cover placement follows the hardware, viewed from the unfolded inner display:
  Galaxy Z Fold carries its cover on the left half's rear (rear cameras on the right
  half), so the closed view shows the hinge on the cover's left; Flip carries it on
  the upper half's rear. Fold previously mounted the cover on the right half.
- Fold8/Flip8 cover and inner displays share one WebGL scene through folding.
  The cover uses the rigid rear-panel transform; applying the inner cylindrical
  bend to its annotation margins previously pulled it inside the opaque chassis.
  This caused Fold8's half-hidden cover and Flip8's stray band at 90°. Both were
  checked after the fix in Chrome. Samsung's 2D emulator skin and layout provide
  front artwork, a screen rectangle and button positions, but no side mesh. The
  unfolded panel depth-to-width ratio now uses published Fold8, Fold7 and Flip8
  physical dimensions (see README). Hinge curvature and the folded gap are still
  illustrative; the rendering is not a CAD-accurate side profile. See
  [Samsung's emulator skin guide](https://developer.samsung.com/galaxy-emulator-skin/guide.html).
- The S-series import adds 26 skins and 25 artwork-only catalogue entries. Existing
  S25-series specification/measurement entries take priority over skin previews.
  Unknown specifications and insets remain pending; skin pixels are not dp data.
- Downloaded S/Tab/Z/Note/A skins are registered: 126 archived models,
  119 public models after the 2020 release-year cutoff and Fold/Flip exception (see `DEVICE_COVERAGE.md`),
  with separate static main/cover previews where supplied. Fold/Flip models
  with a main skin have hinge animation; TriFold has a separately approved
  sequential two-hinge animation (2026-09-24). No measurements are borrowed across models.
- Native Android landscape insets require new captures. Current rotation is visual.
- OG/favicon have been replaced with generated Android inset artwork and a matching
  corner mark. Production assets and the exact generation prompt are documented in
  `design/brand/README.md`; sharing metadata uses versioned URLs. This describes local
  implementation, not deployment or third-party cache invalidation.

## Annotation typography (2026-09-22)

Observed on https://safearea.info/: interface text uses Mona Sans VF; SVG numeric
badges use 12px system monospace and a small rectangular background (18px high,
3px corner radius). Region labels use the same monospace stack with a colored
name badge and a separate value. The local implementation now uses that stack,
small rectangular badges, shared colors, and size compensation when zooming in
both SVG and WebGL. UI Mona Sans is served locally with its OFL license under
`public/fonts/`. Metrics use 14px text.

The cover/partial-fold geometry was visually verified before the typography pass.
Final typography screenshots were blocked by Browser Use `ERR_BLOCKED_BY_CLIENT`
on localhost; type/build validation is not a substitute for that remaining visual
check. No full pixel-parity claim is made.

## Per-device source directories

The eight explicit measured/specification entries live at
`app/data/devices/<slug>/index.ts`. Shared types, coverage rules and skin previews
remain in `app/data/`; the public routes and data values are unchanged by the move.

## Fold2 animation verification (2026-09-22)

Enabled the shared book-fold renderer for the measured Galaxy Z Fold2 entry.
Pose presets and the 0–180° hinge slider now accompany Outer/Inner selection.
Display textures render only their front faces, and the inner annotation plane
is hidden when fully closed, preventing reversed cover labels at partial angles
and inner measurement margins leaking around the closed cover.

Verified in local Chrome through browser Playwright controls and screenshots:
Fold2 closed, 90°, open, hinge slider to 0°, plus closed/90° at 390×844.
Flip8 90° remains visually intact with the shared material change.
Typecheck, all 9 rendering tests, and static build pass. The browser logged an
existing hydration warning for an injected `cz-shortcut-listen` body attribute.
These pose angles are illustrative controls, not newly captured hinge measurements.

## Independent readability re-check (2026-09-23)

The earlier typography changes did **not** establish annotation readability:
Fold8's WebGL rulers still intersected the official frame, and radius chips had
no dimension construction. The follow-up moved folded rulers to projected SVG
and added exterior lanes and radius brackets. Flat SVG and folded overlays
share measured interval geometry; SVG fit includes numeric badges rather than
only the original box. The current frame-synchronized WebGL fold transition is
preserved.

### Issue 1 follow-up: folding annotations

External WebGL texture rulers have been replaced by screen-space SVG rulers whose
attachment points use the device's current hinge transform and camera projection.
The labels and arrows remain flat and outside the projected body. Folding models
hold their scale during hinge motion and refit the settled pose, including
annotation space. Short measurements use adjacent badges rather
than diagonal leaders through the hinge. Browser coverage includes navigation
mode, unit, pose and rotation combinations plus an integer-angle hinge sweep.

The closed mobile view now uses more of the viewport for the official device skin.
Top corner-radius badges take the lane nearest the body; the display-width and
cutout lanes sit farther out and can pass behind the collapsed Metrics header,
as on the reference mobile view. Dragging the canvas reveals these measurements;
the metrics panel retains their numeric values. This is a visibility tradeoff of
the narrow viewport, not a missing measurement.


## Shared UI and symmetry rules — 2026-09-24

The user clarified that the requested improvement is the entire UI system, not
individual device corrections. The binding presentation rule is: **equal lengths
in a symmetric measurement group appear once; unequal lengths all remain**.
This applies to corner radii, opposing insets and opposing cutout offsets.
Comparison uses unrounded measurement geometry, with only floating-point noise
tolerance, not formatted display strings. Unrelated measurements are not merged
just because their numeric values happen to match. A representative badge's title
lists the positions it represents; Metrics retains every directional value.

The earlier proposal to remove all cutout-position rulers has been superseded.
Both unequal sides remain on the diagram. Equal sides share a representative.
Cutout width/height use a size badge when both need a distinct readout; an enabled
inset ruler can represent the same vertical interval. Interior TOP/BOTTOM values
are omitted to avoid repeating the exterior inset labels. The safe-area size label
remains. These consolidations are user-requested departures from the reference,
which repeats some symmetric and interior/exterior values.

All flat displays, folding overlays and the WebGL fallback now use one
`MeasurementRulers` component and one `measurementLayout` algorithm: consistent
badge typography, interval arrows, local-to-overall lane order, copy behavior and
collision spacing. The old flat-only label displacement algorithm is removed.
No device names or viewport-specific measurement omissions select the policy.

The desktop three-column hierarchy and mobile selector/Metrics/controls hierarchy
remain reference-shaped. On phones, the settings icon sits at the right of the
top header row as on the reference, leaving no separate settings row in the
bottom controls. The shared workspace allocates real grid/flex space
to the diagram and bottom controls without guessed pixel reserves in Fit. The
bottom toolbar grows with its content;
long values wrap rather than truncate. The legend and gesture help overlay the
canvas as on the reference, so panned device artwork can remain visible behind
them until it reaches the actual canvas edge. The legend stays interactive.

Metrics and its secondary Export JSON action share one heading row. Mobile Metrics
opens as a scrollable disclosure over the canvas without shrinking or refitting the
device. Preview-only screens use one footer status and no inactive measurement
legend or repeated text stamped on the artwork. Individual unavailable layers are
disabled when other measured layers exist.

The device selector groups official skin previews in a collapsed section within
each series, with search and the selected preview opening that section. Entries
with any captured inset data appear first. Their labels describe measured inset
coverage (complete or partial) rather than RTL reservation status; the preview
label explicitly says inset measurements are unavailable. This is an intentional
Android data-availability distinction in the reference-shaped device list.

Validation covers the layout contract at 320×640, 390×844, 768×1024, 1024×768 and
1440×900 using varied screen ratios and missing-data states. Shared annotation
geometry is checked against every registered skin at multiple zoom levels.
Measurements, source pixels, skin artwork and exported JSON are unchanged.

## Fold depth and capture-relative hinges — 2026-09-24

Rechecked the live reference at 1440×900 and 390×844. Its closed view keeps a
compact silhouette and the same measurement/control hierarchy. Android folding
now uses two closed rigid housings and a separate inset hinge barrel, with the
existing official artwork confined to the display surfaces. A mild oblique camera
at the folded end reveals actual depth; the fully open endpoint remains head-on.
This is an intentional Android hardware rendering substitution, not a new control.

The old screen-width-based bend radius made the closed gap too large. Published
Fold7/Fold8/Flip8 chassis dimensions now determine both panel depth and closed
depth: the residual gap after subtracting two panels sets the display bend radius.
Models without published chassis dimensions retain an illustrative thickness/gap.
The barrel contour and its inset remain illustrative rather than CAD geometry.

Galaxy Fold's artwork-only preview now uses [Samsung's published chassis dimensions](https://www.samsungmobilepress.com/media-assets/galaxy_fold/?tab=specs)
(117.9 mm unfolded width, 6.9 mm open depth, and up to 17.1 mm closed depth)
for the same 3D depth calculation. Its cover screen is much smaller than the
front housing: the full official front artwork is clipped to the visible body,
and the cover texture has enough vertical space for that housing. These are
product dimensions and artwork coordinates, not Android inset measurements;
all Fold 1 metrics remain pending.

When Android reports no display cutout for a screen, Metrics says so instead of
deriving camera distances from the artwork. Current Fold7, Fold8, Fold8 Ultra and
TriFold inner captures report zero cutouts; Fold3–Fold6 inner artwork shows an
under-display camera or none.

The hinge axis follows the official skin's rotation into capture coordinates.
For landscape Fold captures this is a horizontal hinge, correcting the oversized
housing around narrow portrait covers. Cover UVs and external ruler anchors share
one mapping; closing rotates the cover upright without changing capture values.
Texture canvases stay off-DOM: the former axis-aligned backup beneath WebGL could
leak a flat duplicate around perspective edges. WebGL creation/context failures
still use the explicit flat SVG fallback.

Visual checks cover Fold8, Fold5 and Flip8 at 0°, 90° and 180°, plus the Fold3
artwork-only state on desktop/mobile. Geometry tests verify closed depth and rigid
cover distances. Existing source artwork, captures, measurement values and flat
bar-device rendering are unchanged. Release screenshot baselines were refreshed
against the stable build and inspected before commit.

The release pass also corrects prerendered shell selection: route parameters select
the same model in initial HTML and hydrated navigation, avoiding a Fold8 header on
other device routes. JavaScript-disabled navigation checks cover this boundary.

## App inset preview — 2026-09-26

safearea.info has no app-content preview; this is an intentional Android
addition tracked in issue #19. The `App insets` toolbar control switches the
display between the region diagram and a mock Material 3 Scaffold (top app bar,
list, FAB):

- `Ignored` lays content out from the display origin, as an edge-to-edge
  app that ignores insets would. Controls intersecting an inset band get a dashed red
  outline.
- `Applied` pads content by the recorded safe-area insets, which equal
  Compose's `WindowInsets.safeDrawing` and a View's
  `getInsets(systemBars() or displayCutout())` with the IME hidden. The app bar
  container and the list still draw behind the bars, matching Scaffold with
  `contentWindowInsets = WindowInsets.safeDrawing` and list `contentPadding`.

The control is optional, so it sits last in the toolbar after the
reference-shaped view controls, and its Metrics section follows the measured
data and sources. The options name what happens to the insets rather than `Before`/`After`, which did not say before or after what. It is named for the app rather than a toolkit because both Compose and
Views resolve to the same values. The preview is a simulation derived from each
capture, not a rendered app frame and not a new measurement. It is available
only where the selected screen and navigation mode have a capture; pending
screens keep the control disabled.
Inset bands and the cutout bounds draw over the mock at reduced opacity so the
overlap stays visible, and the legend toggles still apply. Flat displays render
it in the SVG diagram; foldables draw it into the same canvas texture, so it
bends with the hinge. Metrics adds a Compose snippet with the per-edge dp values
and a View snippet with the px values for the selected screen and mode.
