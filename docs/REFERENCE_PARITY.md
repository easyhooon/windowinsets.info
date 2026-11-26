# safearea.info parity

**Last updated:** 2026-09-30

WindowInsets is a faithful Android clone of [safearea.info](https://safearea.info/).
This document is the binding clone doctrine, the current mapping from reference
behavior to implementation, and the list of intentional Android differences.
History of individual changes lives in git.

## Binding development direction

“Clone” means the live reference supplies the default answer for visual and
interaction decisions; it does not mean taking selected ideas and redesigning
them into a different dashboard. The product should feel like the same tool
operating on Android measurements and Samsung hardware.

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

## Completion gate

Before changing a reference-facing surface, inspect the current live safearea.info
page at representative desktop and mobile sizes. Implement against that
observation, then compare the reference and local page side by side at the same
viewport. A parity change is complete only when:

- Desktop and mobile preserve the same hierarchy, control grouping, major spacing
  relationships and responsive transitions as the reference.
- Diagram sizing, label styling, pan/zoom/rotation and direct manipulation match the
  reference behavior for equivalent states.
- Fold and Flip views remain visually stable when closed, partially folded and open;
  hinge motion introduces no clipping, mirrored text, detached artwork or layout
  jump.
- A bar phone, Fold and Flip are checked with measured data, pending data and both
  Android navigation modes where available.
- Every visible difference is either fixed or listed under
  **Intentional differences** with its Android/data rationale. A passing typecheck
  or build alone is not visual parity evidence.

## Reference behavior and implementation

| Surface | Reference | Current implementation |
| --- | --- | --- |
| Desktop layout | Device list, Metrics, large canvas; floating pill controls over the canvas | Same three columns with independent scrolling and draggable/keyboard width handles. View controls float as pills over the canvas (top: display options; bottom: zoom, rotation and pose); the settings gear sits alone at the top right |
| Mobile | Model selector, collapsible Metrics, floating bottom pills; picker is a pinned search over one tall list | Same. Pills stack at the bottom so the open Metrics disclosure never covers them, −/+ zoom steps are hidden (pinch and the zoom menu remain), and foldable pose controls wrap onto their own row. The picker scrolls tabs, list and footer links together under a sticky search |
| Device navigation | Searchable grouped list with selected model | Galaxy/Pixel brand control, family tabs (All/Z/S/Tab/Note/A), collapsible series groups, cross-family search, active model on home and detail routes |
| Viewport | Scroll/drag pan, pinch zoom, +/−, 0 fit | Pointer pan, touch pinch, wheel pan, Ctrl-wheel zoom. Zoom is CSS px per dp (10–500%) so every series shares one scale; automatic fit is capped at 100% and keeps the device clear of the legend |
| Orientation | Portrait, left/right landscape, upside down | Phones and foldables offer three orientations because Galaxy devices leave 180° out of auto-rotation; tablets keep all four. Flat devices re-lay out upright in the chosen orientation with a 300 ms turn; 3D foldables roll the model while the display texture draws the upright screen. The canvas itself is never CSS-rotated |
| Fold | Closed/partial/open, arbitrary hinge | Presets and slider, eased three.js hinge, rigid outer panels, closed solid shell, reduced-motion support |
| Layers | Safe area / insets / reserved / corners | Independent legend toggles; the Android cutout bounding region replaces iOS reserved regions |
| Settings | Theme (System/Light/Dark), dimension units, canvas switches | Same groups in the same order with Android dp/px; navigation mode is in the top pill |
| Dark mode | Primer dark palette; the device screen and region fills stay light, size rulers turn white with black text | Same palette and diagram treatment. The choice is stored in `localStorage` and applied before first paint |
| Measurements | Labels and clickable metrics | Whole metric rows and 2D/3D labels copy values; exact captured px is kept separately from rounded dp |
| Display metadata | Logical size, panel resolution, physical density and scale | Adds Captured Window and Android Density so WindowMetrics are not mislabeled as panel resolution or physical PPI |
| Reserved regions | Size and four directional offsets | Android cutout bounds expose Size plus Left/Top/Right/Bottom in the same hierarchy |
| Artwork | Per-device frames | Official Samsung emulator skins for every public Galaxy model, aligned by the original layout coordinates; AOSP emulator skins for Pixel |

## Proportions and units

- A display is mapped using its own logical width/height, preserving the ratio of
  every inset to the screen. Official artwork is aligned by its display
  rectangle, not its larger decorative background. Skin pixels never produce dp
  metrics or insets.
- Captured px and rounded dp are separate evidence. The px view uses raw window,
  system-bar, cutout, rounded-corner and cutout-bound px; it never multiplies
  rounded dp back by density. If a raw px field is absent, px mode stays pending.
- `Resolution` is the sourced physical panel. `Captured Window` is the active
  window InsetsProbe recorded and can differ because of display mode.
  `Physical Density` is sourced panel PPI; `Android Density` and `Scale` report the
  logical density used for dp.
- Fold, Flip and TriFold use a fixed head-on perspective camera whose z=0 plane
  carries the shared scale. Automatic fit holds the scale while the hinge moves,
  then eases to the settled pose's fit; explicit zoom and pan stay user-controlled.

## Typography and annotations

Interface text uses Mona Sans (served locally under `public/fonts/` with its OFL
license); metrics use 14px text. Numeric badges use the system monospace stack at
12px on small rectangular backgrounds (18px high, 3px radius), as on the
reference. All flat displays, folding overlays and the WebGL fallback share one
`MeasurementRulers` component and one layout algorithm. Folding rulers are
screen-space SVG attached through the current hinge transform and camera
projection, so labels stay flat and outside the projected body.

## Intentional differences

- **Gesture Zones and Tappable layers.** Two extra region-legend toggles, off by
  default, overlay `systemGestures` (hatched, with the non-excludable
  `mandatorySystemGestures` part solid) and `tappableElement` (teal dots with a
  solid edge, distinct from the app preview's red dashed clash outline). iOS has
  no equivalent; values come from the raw InsetsProbe capture each measurement
  cites and the toggles only appear when that capture resolves. Metrics lists
  the same types plus status and navigation bars.

- **Lighter dark canvas.** In dark mode the grid canvas is `#2a313c` instead of
  the reference's `#0d1117`, so black Samsung chassis artwork stays visible.
- **Header theme toggle.** A sun/moon button sits left of the settings gear and
  switches between Light and Dark in one click. The reference only offers the
  theme inside its settings menu; that menu entry stays for the System option.
- **Header GitHub link.** Like the reference, a GitHub repository link sits in the
  top-right controls, left of the theme toggle: GitHub mark plus "GitHub" on
  desktop, the mark alone on phones; its tooltip asks for a star. It replaces the
  former sidebar star prompt.
- **Header site links.** Developer guide, Docs and Changelog are borderless
  text links in the header on every page, left of the device page's GitHub,
  theme and settings controls. Docs is paged like the developer guide: the
  README is split by section at build time into `/docs/<topic>` pages, and How
  I measure is the `/docs/methodology` page (`/methodology` redirects there).
  Phones keep three header buttons so the wordmark fits, and reach the links
  from the settings menu and the picker footer. The reference has no docs pages.
- **Sidebar footer.** On desktop the footer holds only feedback, attribution
  and support links in compact rows, so the device list keeps its height.
- **Symmetric values appear once.** Equal lengths in a symmetric group (corner
  radii, opposing insets, opposing cutout offsets) share one badge; unequal
  lengths all remain. Comparison uses unrounded geometry. Interior TOP/BOTTOM
  values that repeat exterior inset labels are omitted. Metrics keeps every value.
- **Family and brand tabs, collapsible groups.** The Android catalogue has far
  more models and form factors than the reference. Entries with captured data
  come first; only exceptions are labeled (partial coverage, emulator insets,
  preview without measurements).
- **Pixel provenance.** Pixel entries use Android Emulator captures, so the
  evidence panel shows the emulator manifest, profile and build and states that
  values were not measured on Pixel hardware. The light Pixel Tablet frame gets
  a subtle outline so its edge stays visible.
- **Markdown, JSON and Export JSON.** The Markdown action matches safearea.info's
  per-device `.md` reference (`/<slug>.md`, also advertised with
  `<link rel="alternate" type="text/markdown">`; every page links `/llms.txt`
  with `rel="describedby"`). Android consumers also need exact dp/px,
  navigation mode, display and provenance outside the visual tool, so JSON stays
  next to it. safearea.info's Markdown actions dropdown is not cloned; the
  actions stay secondary in the Metrics header, and the JSON v1 contract is in
  [JSON_EXPORT.md](JSON_EXPORT.md).
- **Aspect Ratio and sw600dp** are owner-requested Android metrics in the
  Dimensions section. Aspect Ratio derives from panel resolution; sw600dp reports
  whether the shorter logical dimension is at least 600 dp. Missing inputs stay
  pending.
- **Navigation mode and named orientations.** The top pill holds a
  `3-button | Gesture` control. The orientation name sits between the rotate
  buttons as a menu, and rotate buttons skip unavailable orientations.
- **Pose controls.** Foldables add Closed / Partially Folded / Open buttons, a
  hinge slider and a degree readout (`left°/right°` for TriFold). Pose glyphs
  follow each form factor's hinge; Flip closed and partial use side profiles.
- **Uncaptured orientations stay pending.** Landscape insets appear only from a
  capture of that rotation; otherwise the screen reads "not measured yet".
- **Non-rotating Flip covers.** Galaxy Z Flip covers keep their portrait layout
  at every device rotation. When the view turns, the cover draws its rotation 0
  insets turned with the hardware, omits the upright rulers and states that the
  screen does not rotate.
- **No-cutout screens.** When Android reports no display cutout, Metrics says so
  instead of deriving camera distances from the artwork.
- **Foldable hardware rendering.** Two rigid housings and an inset hinge barrel
  carry the official artwork on the display surfaces. Published chassis
  dimensions set panel depth and the closed gap where available; hinge
  curvature and gaps are otherwise illustrative, not CAD geometry. Covers sit on
  the hardware side viewed from the unfolded inner display: Fold on the left
  half's rear, Flip on the upper half's rear. The hinge axis follows the skin's
  rotation into capture coordinates.
- **TriFold.** A `foldable-trifold` model with three housings and two hinges uses
  Samsung's documented order (left first when closing, reverse when opening). One
  sequence slider prevents a right-first order; Closed is 0°/0°, Partially Folded
  90°/180°, Open 180°/180°. The view faces the inner display and turns to the
  middle panel's rear cover late in the sequence. Equal panel division, hinge
  curvature and partial poses are illustrative.
- **App inset preview** (issue #19). The `App insets` control switches the
  display to a mock Material 3 Scaffold. `Ignored` lays content out from the
  display origin and outlines controls that intersect an inset band; `Applied`
  pads content by the recorded safe-area insets, which equal Compose's
  `WindowInsets.safeDrawing` and a View's `getInsets(systemBars() or
  displayCutout())` with the IME hidden. The preview is a simulation, not a
  measurement, and is disabled on pending screens. Metrics adds Compose (dp)
  and View (px) snippets for the selected screen and mode.
- **Use in development** (issue #159). A collapsed Metrics section above
  "Android details & sources" turns the cited raw capture into a Compose
  `@Preview(device = "spec:…")` line (exact px and dpi; Preview's bars and
  cutout are generic, as the section says), the WindowSizeClass of every
  captured screen and rotation from WindowMetrics' maximum window with the
  `FoldingFeature` that capture reported, and an Android Studio hardware
  profile. Uncaptured rotations read "not measured yet". The profile needs the
  official diagonal (probe xdpi gives wrong physical sizes) and a density
  Studio accepts; otherwise it is not offered. Pixel entries point to Studio's
  built-in device profile.
- **Support link.** Low-key Ko-fi and GitHub Sponsors links sit in the sidebar
  footer. After the first successful JSON export in a browser, a
  dismissible one-line note under the Metrics header repeats the Ko-fi link once;
  there is no popup or recurring banner. Clicks emit `support_click`.
- **Branding.** The OG image and favicon are generated Android inset artwork
  documented in `design/brand/README.md`.

## Verification

- `node --test tests/*.test.mjs`: deterministic rendering, geometry, orientation,
  export and capture checks.
- `pnpm test:visual`: the committed Chrome screenshot and interaction regression
  floor for desktop and 390px mobile, Fold/Flip poses, exact px, fit and zoom
  behavior and JSON downloads.
- Real two-finger touch gestures still need device testing; synthetic wheel and
  keyboard checks do not prove hardware touch behavior.
