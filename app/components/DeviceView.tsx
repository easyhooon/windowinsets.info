import { coverRevealAngle, foldCanvasPxPerDp, triFoldAngles } from "./foldMath";
import { flatCanvasPxPerDp, flatDiagramSize } from "./diagramAnnotations";
import { preciseScreen } from "../data/measurementUnits";
import { orientationName, orientScreen, skinDp, viewQuarter } from "../data/orientation";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Device, Insets, InsetsMeasurement, NavMode, Source } from "../data/types";
import { Dropdown } from "./Dropdown";
import type { GestureInsets } from "./FoldRenderer3D";
import { InsetsDiagram } from "./InsetsDiagram";
import { GESTURE_COLOR, TAPPABLE_COLOR } from "./diagramStyle";
import type { AppPreview } from "./appPreview";
import { DiagramViewport, type DiagramViewportHandle } from "./DiagramViewport";
import type { DeviceSkin } from "../data/skins";
import { loadFoldRenderer } from "./foldRendererChunk";
import { ResizeHandle } from "./ResizeHandle";
import { CodeBlock } from "./LazyCodeBlock";
import { DevelopmentDetails } from "./DevelopmentDetails";
import { ShortcutsDialog, useViewShortcuts, type ViewShortcut } from "./KeyboardShortcuts";
import type { DevCapture } from "../data/devTools";
import { Icon } from "./Icon";
import { getRtlAvailability } from "../data/rtlAvailability";
import { formatLength, hasExactPx, safeInsets, safeInsetsPx } from "../data/measurementUnits";
import { deviceExportPath, deviceMarkdownPath, downloadDeviceExport } from "../data/deviceExport";
import { testFixtureSnippet } from "../data/testFixture";
import { KO_FI_URL, REPO_URL } from "../data/site";
import { trackFoldPoseChange, trackJsonExport, trackSupportClick, trackUnitChange } from "../lib/analytics";
import { useTheme } from "../lib/theme";
import { skinImagePaths, useSkinImagesReady } from "../lib/skinImages";
import { parseViewState, serializeViewState, type ViewState } from "../lib/viewState";

// three.js only ships to pages that show a 3D foldable.
const FoldRenderer3D = lazy(() => loadFoldRenderer().then(module => ({ default: module.FoldRenderer3D })));
/** Suspense commits this with the renderer, so a fit that ran over the placeholder can rerun. */
function OnMount({ effect }: { effect: () => void }) {
  useEffect(effect, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}


function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copyable = typeof value === "string" || typeof value === "number";
  const copy = async () => {
    if (!copyable) return;
    try { await navigator.clipboard.writeText(String(value)); setStatus("Copied"); }
    catch { setStatus("Copy unavailable"); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setStatus(""), 1500);
  };
  return <div className="metric-row" role={copyable ? "button" : undefined} tabIndex={copyable ? 0 : undefined}
    title={copyable ? `Copy ${value}` : undefined} onClick={copy}
    onKeyDown={e => { if (copyable && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); void copy(); } }}>
    <dt>{label}</dt><dd><span>{value}</span><span role="status" className="copy-status">{status}</span></dd>
  </div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-subtle first:mt-0">{children}</h3>;
}

const SUPPORT_NOTICE_KEY = "windowinsets.supportNoticeShown";
const PENDING = <span className="text-subtle">pending</span>;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function aspectRatio(width: number, height: number): string | null {
  if (!(width > 0 && height > 0)) return null;

  // Keep the displayed pair in whole numbers, choosing the closest compact ratio.
  const ratio = width / height;
  let bestNumerator = 1;
  let bestDenominator = 1;
  let smallestError = Number.POSITIVE_INFINITY;
  for (let denominator = 1; denominator <= 16; denominator++) {
    const numerator = Math.max(1, Math.round(ratio * denominator));
    const error = Math.abs(numerator / denominator - ratio);
    if (error < smallestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      smallestError = error;
    }
  }

  const divisor = gcd(bestNumerator, bestDenominator);
  return `${bestNumerator / divisor}:${bestDenominator / divisor}`;
}

function insetsRows(i: Insets, iPx: Insets | null | undefined, unit = "dp", fmt = (v: number, px?: number) => String(px ?? v)) {
  return (
    <>
      <Row label="Top" value={`${fmt(i.top, iPx?.top)} ${unit}`} />
      <Row label="Bottom" value={`${fmt(i.bottom, iPx?.bottom)} ${unit}`} />
      <Row label="Left" value={`${fmt(i.left, iPx?.left)} ${unit}`} />
      <Row label="Right" value={`${fmt(i.right, iPx?.right)} ${unit}`} />
    </>
  );
}

const pendingInsetsRows = <>
  <Row label="Top" value={PENDING} />
  <Row label="Bottom" value={PENDING} />
  <Row label="Left" value={PENDING} />
  <Row label="Right" value={PENDING} />
</>;

function SourceList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return <p className="text-sm text-muted">No verified source yet.</p>;
  return (
    <ul className="space-y-1 text-sm">
      {sources.map((s) => (
        <li key={`${s.label}|${s.url ?? ""}|${s.retrievedAt}`}>
          <span className={`source-kind${s.kind === "emulator" ? " is-emulator" : ""} mr-2 rounded bg-canvas px-1.5 py-0.5 text-xs uppercase`}>{s.kind}</span>
          {s.url ? (
            <a href={s.url} className="underline" rel="noopener noreferrer" target="_blank">
              {s.label}
            </a>
          ) : (
            s.label
          )}
          <span className="text-muted"> · checked {s.retrievedAt}</span>
        </li>
      ))}
    </ul>
  );
}


const dp = (v: number) => `${Number(v.toFixed(2))}.dp`;
const px = (v: number) => `${Math.round(v)}px`;
function composeSnippet(safe: Insets, device: string, mode: string) {
  return `// Compose
// ${device}
// ${mode}, keyboard hidden
Scaffold(
  contentWindowInsets =
    WindowInsets.safeDrawing,
) { innerPadding ->
  // start ${dp(safe.left)}, top ${dp(safe.top)}
  // end ${dp(safe.right)}, bottom ${dp(safe.bottom)}
  Content(
    Modifier.padding(innerPadding)
  )
}`;
}
function viewSnippet(safe: Insets, device: string, mode: string) {
  return `// Views
// ${device}
// ${mode}, keyboard hidden
ViewCompat
  .setOnApplyWindowInsetsListener(
    root,
  ) { view, insets ->
    val safe = insets.getInsets(
      Type.systemBars() or
        Type.displayCutout(),
    )
    // left ${px(safe.left)}, top ${px(safe.top)}
    // right ${px(safe.right)}, bottom ${px(safe.bottom)}
    view.updatePadding(
      safe.left, safe.top,
      safe.right, safe.bottom,
    )
    insets
  }`;
}

const orientations = [
  { value: "0", label: "Portrait" }, { value: "90", label: "Landscape Left" },
  { value: "-90", label: "Landscape Right" }, { value: "180", label: "Portrait Upside Down" },
];
// Landscape-native screens (inner Fold displays) are Landscape Left at rotation 0.
const landscapeOrientations = [
  { value: "0", label: "Landscape Left" }, { value: "90", label: "Portrait" },
  { value: "-90", label: "Portrait Upside Down" }, { value: "180", label: "Landscape Right" },
];

type RawInsetType = "statusBars" | "navigationBars" | "systemGestures" | "mandatorySystemGestures" | "tappableElement";
type RawInsetsMap = Record<string, Record<RawInsetType, { dp: Insets; px: Insets | null }>>;
const RAW_PATH = /\/blob\/main\/(measurements\/.+\.json)$/;
const RAW_SECTIONS: Array<[RawInsetType, string]> = [
  ["statusBars", "Status Bars"], ["navigationBars", "Navigation Bars"], ["systemGestures", "System Gestures"],
  ["mandatorySystemGestures", "Mandatory System Gestures"], ["tappableElement", "Tappable Element"],
];

export function DeviceView({ device, skins, rawInsets = {}, devCaptures = [] }: { device: Device; skins: Record<string, DeviceSkin>; rawInsets?: RawInsetsMap; devCaptures?: DevCapture[] }) {
  const initialHasCover = device.screens.some(screen => screen.id === "cover");
  const [metricsWidth, setMetricsWidth] = useState(292);
  const [navMode, setNavMode] = useState<NavMode>("threeButton");
  const [angle, setAngle] = useState(initialHasCover ? 0 : 180);
  const lastCommittedAngle = useRef(initialHasCover ? 0 : 180);
  const [screenId, setScreenId] = useState(initialHasCover ? "cover" : "main");
  const [transitionTarget, setTransitionTarget] = useState<"cover" | "main" | null>(null);
  const viewport = useRef<DiagramViewportHandle>(null);
  const [zoom, setZoom] = useState(100);
  const [autoFit, setAutoFit] = useState(true);
  const [rotation, setRotation] = useState(0);
  const useFoldRef = useRef(false);
  const pendingTurn = useRef<{ delta: number; before: DOMRect | null } | null>(null);
  const [fitKey, setFitKey] = useState(0);
  const [showFrame, setShowFrame] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [layers, setLayers] = useState({ safe: true, insets: true, cutout: true, corners: true, gestures: false, tappable: false });
  const [units, setUnits] = useState<"dp" | "px">("dp");
  const [appPreview, setAppPreview] = useState<AppPreview>("off");
  const [fixtureOpen, setFixtureOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const [supportNotice, setSupportNotice] = useState(false);
  const settings = useRef<HTMLDivElement>(null);
  const exportTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(exportTimer.current), []);
  // Flat devices animate the orientation change onto the new layout.
  useLayoutEffect(() => {
    const turn = pendingTurn.current;
    pendingTurn.current = null;
    if (turn && !useFoldRef.current) viewport.current?.turn(turn.delta, turn.before);
  }, [rotation]);
  useEffect(() => {
    if (!settingsOpen) return;
    const close = (e: PointerEvent) => { if (!settings.current?.contains(e.target as Node)) setSettingsOpen(false); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setSettingsOpen(false); };
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [settingsOpen]);
  const triFold = device.formFactor === "foldable-trifold";
  const hinges = triFoldAngles(angle);
  const foldable = triFold || device.formFactor === "foldable-book" || device.formFactor === "foldable-flip";
  const main = preciseScreen(device.screens.find(s => s.id === "main")!);
  const baseScreen = preciseScreen(device.screens.find(s => s.id === screenId) ?? main);
  // Every device is re-laid out in the chosen orientation (upright content, swapped
  // size); 3D foldables roll the recorded model and draw that upright screen on it.
  const turns = viewQuarter(rotation);
  const screen = orientScreen(baseScreen, turns);
  const measurement = screen.insets[navMode];
  // A turned device without a capture for this rotation and nav mode.
  const rotationPending = turns !== 0 && !measurement;
  const rtl = getRtlAvailability(device.slug);
  // Pixel entries come from the Android Emulator, never from Samsung RTL.
  const emulatorOnly = device.brand === "Google";
  const pendingNotice = emulatorOnly ? "Emulator artwork preview · No capture for this screen and navigation mode" : rtl.previewNotice;
  const skin = skins[screen.id];
  const safe = measurement ? safeInsets(measurement) : null;
  // Per-type insets come from the raw capture a measurement cites (resolved at build).
  const rawFor = (m: InsetsMeasurement | null | undefined) => m?.sources.map(source => rawInsets[source.url?.match(RAW_PATH)?.[1] ?? ""]).find(Boolean) ?? null;
  const gesturesFor = (m: InsetsMeasurement | null | undefined): GestureInsets | null => {
    const r = rawFor(m);
    return r ? { systemGestures: r.systemGestures.dp, mandatorySystemGestures: r.mandatorySystemGestures.dp, tappableElement: r.tappableElement.dp } : null;
  };
  const raw = rawFor(measurement);
  const gestureInsets = gesturesFor(measurement);
  const safePx = measurement ? safeInsetsPx(measurement) : null;
  const snippetDevice = foldable ? `${device.name} · ${screen.id === "cover" ? "Outer" : "Inner"}` : device.name;
  const snippetContext = [snippetDevice,
    navMode === "gesture" ? "Gesture" : "3-button"] as const;
  const fmt = (v: number, px?: number | null) => formatLength({ dp: v, px, units });
  const mainSkin = skins.main;
  const outerSkin = skins.cover;
  const outerSource = device.screens.find(s => s.id === "cover");
  const outerScreen = outerSource ? preciseScreen(outerSource) : undefined;
  const orientedOuter = outerScreen ? orientScreen(outerScreen, turns) : undefined;
  const densityRows = device.screens.flatMap(s => {
    const px = s.logicalSizePx ?? s.resolutionPx;
    if (!s.densityDpi || !s.logicalSizeDp || !px.width) return [];
    return [{
      label: s.id === "cover" ? "Outer" : "Inner",
      px: `${px.width} × ${px.height} px`,
      scale: `${Number((s.densityDpi / 160).toFixed(3))} (${s.densityDpi} dpi)`,
      dp: `${Number(s.logicalSizeDp.width.toFixed(2))} × ${Number(s.logicalSizeDp.height.toFixed(2))} dp`,
    }];
  });
  const densityScales = [...new Set(device.screens.flatMap(s => s.densityDpi ? [s.densityDpi] : []))];
  const orientedMain = orientScreen(main, turns);
  const mainMeasurement = orientedMain.insets[navMode];
  const mainSafe = mainMeasurement ? safeInsets(mainMeasurement) : null;
  const mainSafePx = mainMeasurement ? safeInsetsPx(mainMeasurement) : null;
  const useFold = foldable && !!mainSkin;
  // Hold the canvas until the visible artwork decodes, so the skin never pops in after the content.
  const skinsReady = useSkinImagesReady(!showFrame ? [] : useFold ? [...skinImagePaths(mainSkin), ...skinImagePaths(outerSkin)] : skinImagePaths(skin));
  useFoldRef.current = useFold;
  const exactPxAvailable = hasExactPx(screen, measurement);
  useEffect(() => { if (units === "px" && !exactPxAvailable) setUnits("dp"); }, [exactPxAvailable, units]);
  const pose = (value: string) => {
    const nextAngle = Number(value);
    const target = nextAngle < coverRevealAngle(triFold) && device.screens.some(s => s.id === "cover") ? "cover" : "main";
    setAngle(nextAngle);
    if (useFold) {
      setTransitionTarget(target);
    }
    else {
      setScreenId(target);
      if (autoFit) setFitKey(key => key + 1);
    }
  };
  const recordPose = (value: string, source: "display_tab" | "pose_menu" | "hinge_slider") => {
    const nextAngle = Number(value);
    if (nextAngle === lastCommittedAngle.current) return;
    lastCommittedAngle.current = nextAngle;
    trackFoldPoseChange(device, nextAngle, source);
  };
  const selectPose = (value: string, source: "display_tab" | "pose_menu") => {
    pose(value);
    recordPose(value, source);
  };
  const orientationsFor = (target: typeof baseScreen) => {
    const targetSkin = skins[target.id];
    const recorded = target.logicalSizeDp ?? (targetSkin ? { width: targetSkin.screen.width, height: targetSkin.screen.height } : null);
    return recorded && recorded.width > recorded.height ? landscapeOrientations : orientations;
  };
  const size = screen.logicalSizeDp ?? (skin ? skinDp(skin, screen.captureRotation) : null);
  // Galaxy phones and foldables leave 180° out of auto-rotation (a Fold owner confirmed
  // neither the folded nor unfolded display turns upside down); tablets do (REFERENCE_PARITY.md).
  const allowsUpsideDown = device.formFactor === "tablet";
  const allOrientationOptions = orientationsFor(baseScreen);
  const fixture = raw && measurement?.displayCutoutPx && RAW_SECTIONS.every(([type]) => raw[type].px)
    ? testFixtureSnippet({
      statusBars: raw.statusBars.px!, navigationBars: raw.navigationBars.px!, displayCutout: measurement.displayCutoutPx,
      systemGestures: raw.systemGestures.px!, mandatorySystemGestures: raw.mandatorySystemGestures.px!, tappableElement: raw.tappableElement.px!,
    }, { device: snippetDevice, mode: navMode === "gesture" ? "Gesture" : "3-button", orientation: allOrientationOptions.find(o => Number(o.value) === rotation)?.label ?? orientationName(screen) })
    : null;
  // A hinge drag can switch between cover and landscape-native inner screens,
  // renaming the current rotation. Reserve each name so the centred pills keep
  // their positions and the slider stays under the pointer.
  const orientationLabels = [...new Set(device.screens.map(s => orientationsFor(preciseScreen(s)).find(o => o.value === String(rotation))!.label))];
  const orientationOptions = allowsUpsideDown ? allOrientationOptions : allOrientationOptions.filter(o => o.label !== "Portrait Upside Down");

  const diagramWidth = useFold
    ? 700
    : size ? flatDiagramSize(size.width, size.height, showFrame ? skin : undefined).width : 440;
  const diagramHeight = 700;
  const mainWidthDp = main.logicalSizeDp?.width ?? (mainSkin ? mainSkin.screen.width / 3 : 0);
  const mainHeightDp = main.logicalSizeDp?.height ?? (mainSkin ? mainSkin.screen.height / 3 : 0);
  // Previews without a capture use the same 3x artwork assumption as InsetsDiagram.
  const flatDp = screen.logicalSizeDp ?? (skin ? skinDp(skin, screen.captureRotation) : null);
  const dpScale = useFold ? foldCanvasPxPerDp(mainWidthDp, mainHeightDp)
    : flatDp ? flatCanvasPxPerDp(flatDp.width, flatDp.height, showFrame ? skin : undefined,
      safe, screen.cornerRadiiDp, measurement?.cutoutShape, screen.captureRotation ?? 0) : 1;
  const displayZoom = (canvasZoom: number) => Math.round(canvasZoom * dpScale);
  const zoomTo = (v: string) => {
    if (v === "fit") { setAutoFit(true); setFitKey(k => k + 1); return; }
    const current = displayZoom(viewport.current?.effectiveZoom() ?? zoom);
    setAutoFit(false);
    setZoom((v === "in" ? Math.min(500, current + 10) : v === "out" ? Math.max(10, current - 10) : Number(v)) / dpScale);
  };
  const rotateTo = (next: number) => {
    const delta = ((next - rotation) % 360 + 540) % 360 - 180;
    pendingTurn.current = next === rotation ? null : {
      delta: delta === -180 ? 180 : delta,
      before: document.querySelector("#device-canvas [data-fit-body]")?.getBoundingClientRect() ?? null,
    };
    setRotation(next); setAutoFit(true); setFitKey(key => key + 1);
  };
  // The view turns clockwise for a positive step; skip orientations the device lacks.
  const rotateBy = (step: 90 | -90) => {
    let next = rotation;
    do { const turned = ((next + step) % 360 + 360) % 360; next = turned > 180 ? turned - 360 : turned; }
    while (!orientationOptions.some(o => Number(o.value) === next));
    rotateTo(next);
  };
  // Shareable view state: restore it from the query string after hydration (the
  // page is prerendered without it), then mirror changes back without adding history.
  const defaultView: ViewState = { navMode: "threeButton", rotation: 0, hinge: initialHasCover ? 0 : 180, units: "dp", appPreview: "off" };
  const viewRestored = useRef(false);
  useEffect(() => {
    const restored = parseViewState(window.location.search, { rotations: orientationOptions.map(o => Number(o.value)), foldable });
    if (restored.navMode) setNavMode(restored.navMode);
    if (restored.units) setUnits(restored.units);
    if (restored.appPreview) setAppPreview(restored.appPreview);
    if (restored.rotation !== undefined) setRotation(restored.rotation);
    if (restored.hinge !== undefined) {
      setAngle(restored.hinge);
      lastCommittedAngle.current = restored.hinge;
      setScreenId(restored.hinge < coverRevealAngle(triFold) && initialHasCover ? "cover" : "main");
    }
    if (restored.rotation !== undefined || restored.hinge !== undefined) setFitKey(key => key + 1);
    viewRestored.current = true;
    // Reveal the canvas once the restored view has painted; a restored hinge waits
    // for the fold to settle instead of showing it opening.
    const reveal = () => { delete document.documentElement.dataset.viewRestore; };
    const timer = setTimeout(reveal, restored.hinge !== undefined && useFoldRef.current ? 500 : 50);
    return () => { clearTimeout(timer); reveal(); };
  }, []);
  useEffect(() => {
    if (!viewRestored.current) return;
    // Debounced: hinge drags change state every frame and browsers rate-limit replaceState.
    const pathname = window.location.pathname;
    const timer = setTimeout(() => {
      // A link may have navigated away before the timer fired; never rewrite another page's URL.
      if (window.location.pathname !== pathname) return;
      const search = serializeViewState(window.location.search, { navMode, rotation, hinge: angle, units, appPreview }, defaultView);
      if (search === window.location.search) return;
      // Keep React Router's history entry state so back/forward still work.
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}${window.location.hash}`);
    }, 250);
    return () => clearTimeout(timer);
  }, [navMode, rotation, angle, units, appPreview]);
  const shortcuts: ViewShortcut[] = [
    { key: "n", label: "Switch navigation mode", run: () => setNavMode(mode => mode === "gesture" ? "threeButton" : "gesture") },
    { key: "r", label: "Rotate clockwise", run: () => rotateBy(90), available: orientationOptions.length > 1 },
    { key: "R", label: "Rotate counterclockwise", run: () => rotateBy(-90), available: orientationOptions.length > 1 },
    { key: "s", label: "Switch outer / inner display", run: () => selectPose(screen.id === "cover" ? "180" : "0", "display_tab"), available: foldable && device.screens.length > 1 },
    { key: "u", label: "Switch dp / px", run: () => { const next = units === "dp" ? "px" : "dp"; setUnits(next); trackUnitChange(device, next); }, available: exactPxAvailable },
    { key: "f", label: "Show frame", run: () => setShowFrame(v => !v) },
    { key: "g", label: "Show regions", run: () => setShowRegions(v => !v) },
    { key: "d", label: "Show dimensions", run: () => setShowDimensions(v => !v) },
  ];
  const shortcutState = useViewShortcuts(shortcuts);
  const poseGlyph = triFold ? "trifold" : device.formFactor === "foldable-flip" ? "flip" : "book";
  // Phones show these in the bottom stack, where the open Metrics disclosure cannot cover them.
  const displayOptions = <fieldset className="control-pill" aria-label="Display options">
    <div className="segmented" role="group" aria-label="Navigation">
      {([["threeButton", "3-button"], ["gesture", "Gesture"]] as const).map(([value, label]) =>
        <button key={value} type="button" className="pill-button" aria-pressed={navMode === value} onClick={() => setNavMode(value)}>{label}</button>)}
    </div>
    <span className="pill-divider" />
    <Dropdown label="App insets" value={safe ? appPreview : "off"} valueWidthCh={7} options={[{ value: "off", label: "Off" }, { value: "ignored", label: "Ignored", disabled: !safe }, { value: "applied", label: "Applied", disabled: !safe }]} onChange={v => setAppPreview(v as AppPreview)} />
  </fieldset>;
  const exportJson = async () => {
    try {
      // The published file carries values only the build can read from raw captures.
      const response = await fetch(deviceExportPath(device));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      downloadDeviceExport(device, await response.text());
      trackJsonExport(device);
      setExportStatus("JSON downloaded");
      // One thank-you per browser, right after the export actually helped.
      try {
        if (!localStorage.getItem(SUPPORT_NOTICE_KEY)) {
          localStorage.setItem(SUPPORT_NOTICE_KEY, "1");
          setSupportNotice(true);
        }
      } catch { /* Storage can be blocked; skip the notice then. */ }
    } catch {
      setExportStatus("Download unavailable");
    }
    clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(() => setExportStatus(""), 1800);
  };
  return <article style={{ "--metrics-width": `${metricsWidth}px` } as React.CSSProperties} className="device-workspace" aria-label={device.name}>
    <h1 className="sr-only">{device.name} Window Insets</h1>
    <div className={`metrics-panel ${metricsOpen ? "is-open" : ""}`} aria-busy={transitionTarget !== null}>
      <div className="metrics-bar">
        <h2 className="metrics-heading">Metrics</h2>
        <button className="metrics-toggle" aria-expanded={metricsOpen} onClick={() => setMetricsOpen(!metricsOpen)}>Metrics<Icon name="chevron" /></button>
        <div className="metrics-actions">
          <a className="export-json-button" href={deviceMarkdownPath(device)} target="_blank" rel="noreferrer">Markdown</a>
          <a className="export-json-button" href={deviceExportPath(device)}>JSON</a>
          <button type="button" className="export-json-button" onClick={exportJson}>Export JSON</button>
        </div>
        <span className="sr-only" role="status">{exportStatus}</span>
      </div>
      {supportNotice && <p className="support-notice">
        <span>JSON saved. If this saved you time, <a href={KO_FI_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackSupportClick("ko_fi", "export_notice")} onAuxClick={e => { if (e.button === 1) trackSupportClick("ko_fi", "export_notice"); }} aria-label="Support windowinsets.info on Ko-fi (opens in a new tab)">☕ support it on Ko-fi ↗</a></span>
        <button type="button" className="support-notice-close" aria-label="Dismiss support note" onClick={() => setSupportNotice(false)}>×</button>
      </p>}
      <div className="metrics-content">
        {foldable && <div className="screen-tabs" aria-label="Display">{device.screens.map(s => <button key={s.id} aria-pressed={screen.id === s.id} onClick={() => selectPose(s.id === "cover" ? "0" : "180", "display_tab")}>{s.label === "Main" ? "Inner" : "Outer"}</button>)}</div>}
            <SectionLabel>Dimensions</SectionLabel>
            <dl>
              <Row
                label="Logical Size"
                value={screen.logicalSizeDp ? `${fmt(screen.logicalSizeDp.width, screen.logicalSizePx?.width)} × ${fmt(screen.logicalSizeDp.height, screen.logicalSizePx?.height)} ${units}` : PENDING}
              />
              <Row
                label="Resolution"
                value={screen.resolutionPx.width > 0 && screen.resolutionPx.height > 0 ? `${screen.resolutionPx.width} × ${screen.resolutionPx.height} px` : PENDING}
              />
              <Row
                label="Aspect Ratio"
                value={aspectRatio(screen.resolutionPx.width, screen.resolutionPx.height) ?? PENDING}
              />
              <Row
                label="sw600dp"
                value={screen.logicalSizeDp
                  ? Math.min(screen.logicalSizeDp.width, screen.logicalSizeDp.height) >= 600 ? "Yes" : "No"
                  : PENDING}
              />
              {screen.logicalSizePx && (screen.logicalSizePx.width !== screen.resolutionPx.width || screen.logicalSizePx.height !== screen.resolutionPx.height) &&
                <Row label="Captured Window" value={`${screen.logicalSizePx.width} × ${screen.logicalSizePx.height} px`} />}
              <Row label="Physical Density" value={screen.ppi > 0 ? `${screen.ppi} ppi` : PENDING} />
              <Row label="Android Density" value={screen.densityDpi ? `${screen.densityDpi} dpi` : PENDING} />
              <Row label="Scale" value={screen.densityDpi ? `${Number((screen.densityDpi / 160).toFixed(2))}×` : PENDING} />
            </dl>

            <details className="mt-2 text-xs text-subtle">
              <summary className="cursor-pointer">What does sw600dp mean?</summary>
              <p className="mt-2">“sw” means smallest width. Android's <code>sw600dp</code> resource qualifier applies when the app's smallest available width is at least 600 dp. The Yes/No value here compares the selected display's shorter measured logical dimension with 600 dp; exactly 600 dp counts as Yes.</p>
            </details>

            {foldable && <details className="mt-2 text-xs text-subtle" open={densityScales.length > 1}>
              <summary className="cursor-pointer">Why do outer and inner sizes differ?</summary>
              <p className="mt-2">The diagram is drawn in Android layout units, not millimeters. Each display has its own pixel resolution and Android density, so a smaller px or dp value does not mean a physically shorter display.</p>
              {densityRows.length > 0 && <ul className="mt-2 space-y-1 font-mono">
                {densityRows.map(row => <li key={row.label}>{row.label}: {row.px} ÷ {row.scale} = {row.dp}</li>)}
              </ul>}
            </details>}

            <SectionLabel>Safe Area Insets</SectionLabel>
            <dl>
              {safe ? insetsRows(safe, safePx, units, fmt) : pendingInsetsRows}
            </dl>
            {safe && <p className="mt-2 text-xs leading-relaxed text-muted">
              With the keyboard hidden, Compose's <code>WindowInsets.safeDrawing</code> and a View's
              {" "}<code>systemBars() or displayCutout()</code> insets resolve to these values.
              <Link to="/developer-guide/code" className="mt-2 block whitespace-nowrap text-accent underline">Compose · Views guide →</Link>
            </p>}

            {measurement?.cutoutShape && <>
              <SectionLabel>Display Cutout Bounds</SectionLabel>
              <dl>
                <Row label="Size" value={`${fmt(measurement.cutoutShape.widthDp, measurement.cutoutShape.widthPx)} × ${fmt(measurement.cutoutShape.heightDp, measurement.cutoutShape.heightPx)} ${units}`} />
                <Row label="Left" value={`${fmt(measurement.cutoutShape.xDp, measurement.cutoutShape.xPx)} ${units}`} />
                <Row label="Top" value={`${fmt(measurement.cutoutShape.yDp, measurement.cutoutShape.yPx)} ${units}`} />
                <Row label="Right" value={`${fmt(measurement.cutoutShape.rightDp, measurement.cutoutShape.rightPx)} ${units}`} />
                <Row label="Bottom" value={`${fmt(measurement.cutoutShape.bottomDp, measurement.cutoutShape.bottomPx)} ${units}`} />
              </dl>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Android-reported exclusion rectangle. Camera lenses may share one region;
                individual lens diameters and spacing are not measured.
                <Link to="/docs/methodology#camera-cutouts" className="mt-2 block whitespace-nowrap text-accent underline">Cutout measurement limits →</Link>
              </p>
            </>}
            {measurement && !measurement.cutoutShape && skin && Object.values(measurement.displayCutout).every(v => !v) && <>
              <SectionLabel>Display Cutout Bounds</SectionLabel>
              <p className="text-xs leading-relaxed text-muted">
                Android reported no display cutout here. Any camera shown in the official
                artwork is not a measured exclusion, so its edge distances are not shown.
                <Link to="/docs/methodology#camera-cutouts" className="mt-2 block whitespace-nowrap text-accent underline">Cutout measurement limits →</Link>
              </p>
            </>}

            {screen.cornerRadiiDp && (
              <>
                <SectionLabel>Corner Radii · {screen.captureOrientation ? screen.captureOrientation[0].toUpperCase() + screen.captureOrientation.slice(1) : "Capture"}</SectionLabel>
                <dl>
                  <Row label="Top Left" value={`${fmt(screen.cornerRadiiDp.topLeft, screen.cornerRadiiPx?.topLeft)} ${units}`} />
                  <Row label="Top Right" value={`${fmt(screen.cornerRadiiDp.topRight, screen.cornerRadiiPx?.topRight)} ${units}`} />
                  <Row label="Bottom Right" value={`${fmt(screen.cornerRadiiDp.bottomRight, screen.cornerRadiiPx?.bottomRight)} ${units}`} />
                  <Row label="Bottom Left" value={`${fmt(screen.cornerRadiiDp.bottomLeft, screen.cornerRadiiPx?.bottomLeft)} ${units}`} />
                </dl>
              </>
            )}

        <DevelopmentDetails device={device} captures={devCaptures} measurement={measurement} />
        <details className="sources-details"><summary>Android details & sources <span className="details-hint">All insets, test fixture, captures</span></summary>
          {emulatorOnly ? <section className="rtl-status emulator-status" aria-label="Capture provenance">
            {measurement?.condition.emulator ? <a href={measurement.condition.emulator.manifestUrl} target="_blank" rel="noreferrer">Android Emulator capture ↗</a> : <strong>Android Emulator capture</strong>}
            <p>Values reported by the Android framework for the emulator's {device.name} device profile. They are not measured on Pixel hardware and may differ from a physical device.</p>
            <small>{measurement ? "Emulator selection" : "No capture for this selection"}</small>
          </section> : <section className="rtl-status" aria-label="Remote Test Lab availability">
            <a href={rtl.sourceUrl} target="_blank" rel="noreferrer">{rtl.label} ↗</a>
            <p>{rtl.description}</p>
            <small>Checked {rtl.checkedAt} · {measurement ? "Measured selection" : "No capture for this selection"}</small>
          </section>}
          <SectionLabel>System Bars · {navMode === "gesture" ? "Gesture" : "3-button"}</SectionLabel>
          <dl>{measurement ? insetsRows(measurement.systemBars, measurement.systemBarsPx, units, fmt) : pendingInsetsRows}</dl>
          <SectionLabel>Display Cutout Insets</SectionLabel>
          <dl>{measurement ? insetsRows(measurement.displayCutout, measurement.displayCutoutPx, units, fmt) : pendingInsetsRows}</dl>
          {raw && RAW_SECTIONS.map(([type, label]) => <div key={type}>
            <SectionLabel>{label}</SectionLabel>
            <dl>{insetsRows(raw[type].dp, raw[type].px, units, fmt)}</dl>
          </div>)}
          {fixture && <details className="fixture-details" onToggle={event => setFixtureOpen(event.currentTarget.open)}>
            <summary>Test fixture · WindowInsetsCompat</summary>
            <p className="mb-2 text-xs leading-relaxed text-muted">
              Exact px of this capture for JVM UI tests (Robolectric, Paparazzi, Roborazzi).
            </p>
            {fixtureOpen && <CodeBlock title="Tests · WindowInsetsCompat">{fixture}</CodeBlock>}
          </details>}
          {emulatorOnly ? <>
            <SectionLabel>Captured On</SectionLabel>
            <dl>
              <Row label="Emulator" value={measurement?.condition.emulator ? `Android Emulator ${measurement.condition.emulator.emulatorVersion}` : PENDING} />
              <Row label="Device Profile" value={measurement?.condition.emulator?.deviceProfile ?? PENDING} />
              <Row label="Android" value={measurement ? measurement.condition.android : PENDING} />
              <Row label="Build" value={measurement?.condition.emulator?.buildFingerprint.split("/")[3] ?? PENDING} />
            </dl>
          </> : <>
            <SectionLabel>Measured On</SectionLabel>
            <dl>
              <Row label="One UI" value={measurement ? measurement.condition.oneUi ?? PENDING : PENDING} />
              <Row label="Android" value={measurement ? measurement.condition.android : PENDING} />
            </dl>
          </>}
          <p className="mb-3 text-xs text-muted">{device.name} · {screen.label} · {rotationPending
            ? `${orientationName(screen)} insets are not measured yet${screen.orientationMeasured ? " for this navigation mode" : ""}. Size and corners follow the display; insets are never rotated from another orientation.`
            : measurement ? `Captured ${screen.captureOrientation ?? "orientation unknown"}.${useFold ? " Rotation changes the view, not the recorded Android insets." : ""}`
              : emulatorOnly ? "AOSP emulator artwork preview. No emulator capture exists for this navigation mode." : "Official artwork preview. Android insets have not been measured for this navigation mode."}</p>
          {triFold && <p className="mb-3 text-xs text-muted">Two-hinge animation is illustrative. Partial poses do not represent measured Android window states.</p>}
          {measurement?.condition.note && <p className="mb-3 text-xs text-muted">{measurement.condition.note}</p>}
          {/* A measured selection lists its own captures; the screen's other captures (the other
           * navigation mode, other rotations) share labels and would read as duplicates. */}
          <SourceList sources={Array.from(new Map((measurement?.sources ?? [])
            .concat(screen.sources.filter(s => !measurement || (s.kind !== "measured" && s.kind !== "emulator")))
            .map(s => [`${s.label}|${s.url ?? ""}`, s])).values())} />
          <Link to="/docs/methodology" className="mt-3 block text-accent underline">How these values are measured →</Link>
          {safe && appPreview !== "off" && <>
            <SectionLabel>App Preview · Insets {appPreview}</SectionLabel>
            <p className="text-xs leading-relaxed text-muted">
              {appPreview === "applied"
                ? "Content is padded by the safe-area insets. Backgrounds still draw edge to edge; the list scrolls behind the navigation bar."
                : "Content ignores the insets. Red outlines mark controls under a system bar or the cutout."}
              {" "}Simulated from the recorded insets, not a rendered app frame.
            </p>
            <CodeBlock title="Compose · safeDrawing">{composeSnippet(safe, ...snippetContext)}</CodeBlock>
            {safePx && <CodeBlock title="Views · getInsets">{viewSnippet(safePx, ...snippetContext)}</CodeBlock>}
          </>}
        </details>
      </div>
    </div>
    <ResizeHandle label="Metrics width" value={metricsWidth} onChange={setMetricsWidth} min={250} max={400} />
    <section className="canvas-panel" aria-label="Device visualization">
      <div className={`canvas-stage ${skinsReady ? "" : "skins-loading"}`}>
      <DiagramViewport viewportRef={viewport} autoFit={autoFit}
        zoom={zoom} setZoom={setZoom} rotation={0} fitKey={fitKey}
        onUserTransform={() => { setZoom(viewport.current?.effectiveZoom() ?? zoom); setAutoFit(false); }} onFit={() => setAutoFit(true)}
        baseWidth={diagramWidth}
        baseHeight={700} dpScale={dpScale} fitWidth={useFold ? triFold ? 780 : 1000 : diagramWidth} fitHeight={useFold && !triFold ? 1000 : diagramHeight}>
        {useFold ? <Suspense fallback={<div style={{ width: 700, height: 700 }} />}><FoldRenderer3D triFold={triFold} angle={angle} axis={device.formFactor === "foldable-flip" ? "horizontal" : "vertical"}
          widthDp={mainWidthDp} heightDp={mainHeightDp}
          safe={mainSafe} safePx={mainSafePx} logicalSizePx={orientedMain.logicalSizePx} cornerRadiiDp={orientedMain.cornerRadiiDp} cornerRadiiPx={orientedMain.cornerRadiiPx} cutoutShape={mainMeasurement?.cutoutShape}
          zoom={zoom} showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} appPreview={appPreview} gestureInsets={gesturesFor(mainMeasurement)} skin={mainSkin} skinRotation={main.captureRotation ?? 0} viewRotation={rotation} measured={!!main.logicalSizeDp} cover={outerScreen && orientedOuter && outerSkin ? { screen: outerScreen, oriented: orientedOuter, measurement: orientedOuter.insets[navMode], skin: outerSkin, gestureInsets: gesturesFor(orientedOuter.insets[navMode]) } : undefined}
          fallbackMain={{ screen: orientedMain, measurement: mainMeasurement }}
          chassisMm={device.chassisMm}
          onMeasurementBounds={(bounds, body) => viewport.current?.fitFoldBounds(bounds, body)}
          onDisplayedAngle={value => {
            viewport.current?.setFoldAngle(value);
            const visible = value < coverRevealAngle(triFold) && outerScreen ? "cover" : "main";
            setScreenId(current => current === visible ? current : visible);
            return viewport.current?.effectiveZoom();
          }}
          onTransitionEnd={() => { viewport.current?.refitFold(); if (transitionTarget) { setScreenId(transitionTarget); setTransitionTarget(null); } }} />
          <OnMount effect={() => { if (autoFit) setFitKey(key => key + 1); }} /></Suspense>
          : <InsetsDiagram screen={screen} measurement={measurement} pendingOrientation={rotationPending ? orientationName(screen) : undefined} zoom={zoom} showFrame={showFrame} showRegions={showRegions} showDimensions={showDimensions} units={units} layers={layers} appPreview={appPreview} skin={skin} gestureInsets={gestureInsets} />}
      </DiagramViewport>
      </div>
      <footer className="canvas-footer">
      {useFold ? <div className="fold-measurement-notice">{turns !== 0 && screen.fixedOrientation ? <p className="pending-notice">This screen does not rotate. It keeps its portrait layout and turns with the device.</p>
        : rotationPending ? <p className="pending-notice">{orientationName(screen)} insets are not measured yet.</p>
        : !measurement ? <p className="pending-notice">{pendingNotice}</p> : emulatorOnly && <p className="pending-notice">Android Emulator capture · Not measured on Pixel hardware</p>}</div>
        : rotationPending ? <p className="pending-notice">{orientationName(screen)} insets are not measured yet.</p>
          : !measurement ? <p className="pending-notice">{pendingNotice}</p> : emulatorOnly && <p className="pending-notice">Android Emulator capture · Not measured on Pixel hardware</p>}
      {(measurement || screen.cornerRadiiDp || useFold) && <div className="region-legend" aria-label="Region legend">
        {([{ key: "safe", label: "Safe Area", color: "#ade7bc" }, { key: "insets", label: "Insets", color: "#ffdab0" }, { key: "cutout", label: "Display Cutout", color: "#c4a0f1" }, { key: "corners", label: "Corner Radius", color: "#e4a6cc" }, { key: "gestures", label: "Gesture Zones", color: `repeating-linear-gradient(45deg, ${GESTURE_COLOR} 0 2px, ${GESTURE_COLOR}33 2px 4px)` }, { key: "tappable", label: "Tappable", color: `radial-gradient(${TAPPABLE_COLOR} 30%, ${TAPPABLE_COLOR}22 35%) 0 0 / 4px 4px` }] as const).filter(item => !(item.key === "gestures" || item.key === "tappable") || gestureInsets).map(item => <button key={item.key} disabled={item.key === "corners" ? !screen.cornerRadiiDp : item.key === "cutout" ? !measurement?.cutoutShape : !measurement} aria-pressed={layers[item.key]} onClick={() => setLayers(v => ({ ...v, [item.key]: !v[item.key] }))}><i style={{ background: item.color }} />{item.label}</button>)}
      </div>}
      <div className="canvas-toggles-inline">{displayOptions}</div>
      <div className="canvas-controls" aria-label="Canvas controls">
        <fieldset className="control-pill" aria-label="Canvas zoom">
          <button type="button" className="pill-button icon zoom-step" aria-label="Zoom out" title="Zoom out" onClick={() => zoomTo("out")}><Icon name="zoom-out" /></button>
          <button type="button" className="pill-button icon zoom-step" aria-label="Zoom in" title="Zoom in" onClick={() => zoomTo("in")}><Icon name="zoom-in" /></button>
          <span className="pill-divider zoom-step" />
          <Dropdown label="Zoom" hideLabel opensUp icon="zoom-fit" value={`${displayZoom(zoom)}%`} valueWidthCh={4} options={[{ value: "fit", label: "Fit to canvas" }, { value: "out", label: "− Zoom out" }, { value: "in", label: "+ Zoom in" }, ...[25,50,100,200,300].map(z => ({ value: String(z), label: `${z}%` }))]} onChange={zoomTo} />
        </fieldset>
        <fieldset className="control-pill" aria-label="Device rotation">
          <button type="button" className="pill-button icon" aria-label="Rotate counterclockwise" title="Rotate counterclockwise" onClick={() => rotateBy(-90)}><Icon name="rotate-ccw" /></button>
          <Dropdown label="Orientation" hideLabel opensUp value={String(rotation)} options={orientationOptions} reserveLabels={orientationLabels} onChange={v => rotateTo(Number(v))} />
          <button type="button" className="pill-button icon" aria-label="Rotate clockwise" title="Rotate clockwise" onClick={() => rotateBy(90)}><Icon name="rotate-cw" /></button>
        </fieldset>
        {useFold && <fieldset className="control-pill hinge-control" aria-label="Device pose and hinge">
          {([["0", "Closed", "closed"], [triFold ? "135" : "90", "Partially Folded", "partial"], ["180", "Open", "open"]] as const).map(([value, label, glyph]) =>
            <button key={value} type="button" className="pill-button icon" aria-label={label} title={label} aria-pressed={angle === Number(value)} onClick={() => selectPose(value, "pose_menu")}><Icon name={`${poseGlyph}-${glyph}`} /></button>)}
          <span className="pill-divider" />
          <input aria-label={triFold ? "Fold sequence" : "Hinge angle in degrees"} title={triFold ? "Close left first, then right." : undefined} type="range" min={0} max={180} value={angle} onChange={e => pose(e.target.value)} onPointerUp={e => recordPose(e.currentTarget.value, "hinge_slider")} onKeyUp={e => recordPose(e.currentTarget.value, "hinge_slider")} />
          <output className="hinge-readout" aria-label="Hinge angle"><span>{triFold ? `${hinges.left}°/${hinges.right}°` : `${angle}°`}</span><span className="dropdown-value-reserve" aria-hidden="true">{triFold ? "180°/180°" : "180°"}</span></output>
        </fieldset>}
      </div>
      <p className="canvas-help">Scroll or drag to pan · Pinch to zoom · + / − to zoom · 0 to fit · ? for shortcuts</p>
      </footer>
      <div className="canvas-toggles">{displayOptions}</div>
    </section>
    <div className="dropdown settings canvas-settings" ref={settings}>
      <a className="toolbar-button github-star" href={REPO_URL} title="Star on GitHub ★" target="_blank" rel="noreferrer" aria-label="windowinsets.info on GitHub (opens in a new tab)"><Icon name="github" /><span>GitHub</span></a>
      <button className="toolbar-button theme-toggle" aria-label="Toggle dark mode" onClick={() => {
        const dark = theme === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : theme === "dark";
        setTheme(dark ? "light" : "dark");
      }}><span className="theme-icon-light"><Icon name="moon" /></span><span className="theme-icon-dark"><Icon name="sun" /></span></button>
      <button className="toolbar-button" aria-label="View settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(!settingsOpen)}><Icon name="settings" /></button>
      {settingsOpen && <div className="dropdown-panel settings-panel">
        <fieldset><legend>Theme</legend>{(["system", "light", "dark"] as const).map(t => <label key={t}><input type="radio" name="theme" checked={theme === t} onChange={() => setTheme(t)} />{t[0].toUpperCase() + t.slice(1)}</label>)}</fieldset>
        <fieldset><legend>Dimension units</legend>{(["dp","px"] as const).map(u => <label key={u}><input type="radio" name="units" checked={units === u} disabled={u === "px" && !exactPxAvailable} onChange={() => { if (u !== units) { setUnits(u); trackUnitChange(device, u); } }} />{u}</label>)}</fieldset>
        <fieldset><legend>Canvas</legend>
          <label><input type="checkbox" checked={showFrame} onChange={e => setShowFrame(e.target.checked)} />Show Frame</label>
          <label><input type="checkbox" checked={showRegions} onChange={e => setShowRegions(e.target.checked)} />Show Regions</label>
          <label><input type="checkbox" checked={showDimensions} onChange={e => setShowDimensions(e.target.checked)} />Show Dimensions</label>
        </fieldset>
        <nav className="settings-links" aria-label="Site"><Link to="/developer-guide">Developer guide</Link><Link to="/docs">Docs</Link><Link to="/changelog">Changelog</Link></nav>
        <button type="button" className="settings-shortcuts" aria-keyshortcuts="?" onClick={() => { setSettingsOpen(false); shortcutState.setHelpOpen(true); }}>Keyboard shortcuts<kbd>?</kbd></button>
      </div>}
    </div>
    <ShortcutsDialog open={shortcutState.helpOpen} onClose={() => shortcutState.setHelpOpen(false)} shortcuts={shortcuts}
      enabled={shortcutState.enabled} onEnabledChange={shortcutState.setEnabled} />
  </article>;
}
