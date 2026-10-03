import type { Device, NavMode } from "./types";

/** Developer-facing facts read from one raw InsetsProbe capture the device page cites. */
export interface DevCapture {
  /** Repository path of the raw capture. */
  path: string;
  screen: "cover" | "main";
  /** Surface.ROTATION_* recorded by the probe. */
  rotation: 0 | 1 | 2 | 3;
  nav: NavMode;
  widthPx: number;
  heightPx: number;
  densityDpi: number;
  /** WindowMetrics maximum window, the size WindowSizeClass is computed from. */
  windowDp: { width: number; height: number };
  /** DisplayCutout reported at least one bounding rect. */
  cutout: boolean;
  /** Sensor.TYPE_HINGE_ANGLE reading, when the device has one. */
  hingeAngle: number | null;
  foldingFeatures: FoldingFeatureCapture[];
  capturedAt: string;
}

export interface FoldingFeatureCapture {
  state: "FLAT" | "HALF_OPENED";
  orientation: "VERTICAL" | "HORIZONTAL";
  isSeparating: boolean;
  occlusionType: string;
  boundsDp: { left: number; top: number; right: number; bottom: number };
}

export type WidthClass = "Compact" | "Medium" | "Expanded";
export type HeightClass = "Compact" | "Medium" | "Expanded";

/** androidx.window WindowSizeClass breakpoints (dp). */
export const WIDTH_BREAKPOINTS = { medium: 600, expanded: 840, large: 1200, extraLarge: 1600 } as const;
export const HEIGHT_BREAKPOINTS = { medium: 480, expanded: 900 } as const;

export function widthClass(widthDp: number): WidthClass {
  return widthDp >= WIDTH_BREAKPOINTS.expanded ? "Expanded" : widthDp >= WIDTH_BREAKPOINTS.medium ? "Medium" : "Compact";
}

/** The Large and Extra-large width classes added in androidx.window 1.5; null below 1200dp. */
export function extendedWidthClass(widthDp: number): "Large" | "Extra-large" | null {
  return widthDp >= WIDTH_BREAKPOINTS.extraLarge ? "Extra-large" : widthDp >= WIDTH_BREAKPOINTS.large ? "Large" : null;
}

export function heightClass(heightDp: number): HeightClass {
  return heightDp >= HEIGHT_BREAKPOINTS.expanded ? "Expanded" : heightDp >= HEIGHT_BREAKPOINTS.medium ? "Medium" : "Compact";
}

/** Surface.ROTATION_* names; the site's orientation labels describe the device, these the display. */
export const ROTATION_NAMES = { 0: "ROTATION_0", 1: "ROTATION_90", 2: "ROTATION_180", 3: "ROTATION_270" } as const;

/**
 * A Compose `@Preview(device = "spec:…")` line matching this capture's display.
 * Size and density are exact; Compose Preview draws its own generic system bars
 * and cutout, not One UI's.
 */
export function previewSpec(capture: DevCapture): string {
  const spec = [
    `width=${capture.widthPx}px`, `height=${capture.heightPx}px`, `dpi=${capture.densityDpi}`,
    `cutout=${capture.cutout ? "punch_hole" : "none"}`,
    `navigation=${capture.nav === "gesture" ? "gesture" : "buttons"}`,
  ].join(",");
  return `@Preview(device = "spec:${spec}")`;
}

export function previewSnippet(device: Device, capture: DevCapture): string {
  const screen = device.screens.length > 1 ? ` · ${capture.screen}` : "";
  const nav = capture.nav === "gesture" ? "gesture" : "3-button";
  return `// ${device.name}${screen} · ${nav} · ${ROTATION_NAMES[capture.rotation]} (captured ${capture.capturedAt})
${previewSpec(capture)}
@Composable
fun ${composableName(device, capture)}() {
    // Your screen here
}`;
}

function composableName(device: Device, capture: DevCapture): string {
  const words = `${device.name.replace(/^Galaxy\s+/, "")} ${device.screens.length > 1 ? capture.screen : ""} preview`;
  return words.split(/[^A-Za-z0-9]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join("");
}

/**
 * adb commands that put an emulator into this capture's display size, density,
 * navigation mode and rotation. Window size and density are exact; the cutout is
 * AOSP's generic punch-hole simulation, and status and navigation bars stay the
 * emulator's own, so the measured insets are not reproduced.
 */
export function adbCommands(device: Device, capture: DevCapture): string {
  // wm size takes the natural (rotation 0) dimensions; user_rotation turns the display.
  const [width, height] = capture.rotation % 2 === 0 ? [capture.widthPx, capture.heightPx] : [capture.heightPx, capture.widthPx];
  const screen = device.screens.length > 1 ? ` · ${capture.screen}` : "";
  const nav = capture.nav === "gesture" ? "gestural" : "threebutton";
  return `# ${device.name}${screen} · ${capture.nav === "gesture" ? "gesture" : "3-button"} · ${ROTATION_NAMES[capture.rotation]} (captured ${capture.capturedAt})
adb shell wm size ${width}x${height}
adb shell wm density ${capture.densityDpi}
adb shell cmd overlay enable-exclusive --category com.android.internal.systemui.navbar.${nav}
${capture.cutout ? "adb shell cmd overlay enable-exclusive --category com.android.internal.display.cutout.emulation.hole" : "adb shell cmd overlay disable com.android.internal.display.cutout.emulation.hole"}
adb shell settings put system accelerometer_rotation 0
adb shell settings put system user_rotation ${capture.rotation}

# Restore the emulator's defaults
adb shell wm size reset
adb shell wm density reset
adb shell cmd overlay enable-exclusive --category com.android.internal.systemui.navbar.gestural
adb shell cmd overlay disable com.android.internal.display.cutout.emulation.hole
adb shell settings put system user_rotation 0
adb shell settings put system accelerometer_rotation 1`;
}

/** Densities Android Studio's hardware profile format accepts (com.android.resources.Density). */
export const AVD_DENSITIES = [120, 140, 160, 180, 200, 213, 220, 240, 260, 280, 300, 320, 340, 360, 390, 400, 420, 440, 450, 480, 520, 560, 600, 640];

export type AvdProfile =
  | { ok: true; fileName: string; xml: string }
  | { ok: false; reason: string };

/**
 * An Android Studio hardware profile for one screen. Needs the official
 * diagonal: probe xdpi/ydpi values are not physical sizes (Fold8 cover reads
 * 5.45″ from xdpi), so a screen without a sourced diagonal gets no profile.
 */
export function avdProfile(device: Device, capture: DevCapture): AvdProfile {
  const screen = device.screens.find(s => s.id === capture.screen);
  const diagonal = screen?.diagonalInch ?? 0;
  if (!(diagonal > 0)) return { ok: false, reason: "The official screen diagonal is not sourced yet, so no hardware profile is offered." };
  if (!AVD_DENSITIES.includes(capture.densityDpi)) return { ok: false, reason: `Android Studio hardware profiles cannot express ${capture.densityDpi} dpi.` };
  // Natural (rotation 0) dimensions, as Android Studio describes a screen.
  const natural = capture.rotation % 2 === 0 ? capture : { ...capture, widthPx: capture.heightPx, heightPx: capture.widthPx };
  const x = natural.widthPx;
  const y = natural.heightPx;
  const ppi = Math.hypot(x, y) / diagonal;
  const name = device.screens.length > 1 ? `${device.name} (${capture.screen})` : device.name;
  const id = `${device.slug}${device.screens.length > 1 ? `-${capture.screen}` : ""}`;
  const shortSide = Math.min(capture.windowDp.width, capture.windowDp.height);
  const screenSize = shortSide >= 720 ? "xlarge" : shortSide >= 480 ? "large" : "normal";
  const ratio = Math.max(x, y) / Math.min(x, y) > 1.67 ? "long" : "notlong";
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- ${name}: screen values from windowinsets.info (${capture.path}, official diagonal).
     Hardware, RAM and sensor entries are emulator defaults, not device specifications.
     Import in Android Studio: Device Manager > Create Virtual Device > Import Hardware Profiles. -->
<d:devices xmlns:d="http://schemas.android.com/sdk/devices/7" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <d:device>
    <d:name>${name}</d:name>
    <d:id>${id}</d:id>
    <d:manufacturer>${device.brand}</d:manufacturer>
    <d:hardware>
      <d:screen>
        <d:screen-size>${screenSize}</d:screen-size>
        <d:diagonal-length>${diagonal}</d:diagonal-length>
        <d:pixel-density>${capture.densityDpi}dpi</d:pixel-density>
        <d:screen-ratio>${ratio}</d:screen-ratio>
        <d:dimensions>
          <d:x-dimension>${x}</d:x-dimension>
          <d:y-dimension>${y}</d:y-dimension>
        </d:dimensions>
        <d:xdpi>${ppi.toFixed(2)}</d:xdpi>
        <d:ydpi>${ppi.toFixed(2)}</d:ydpi>
        <d:touch>
          <d:multitouch>jazz-hands</d:multitouch>
          <d:mechanism>finger</d:mechanism>
          <d:screen-type>capacitive</d:screen-type>
        </d:touch>
      </d:screen>
      <d:networking>Bluetooth
Wifi
NFC</d:networking>
      <d:sensors>Accelerometer
Barometer
Compass
GPS
Gyroscope
LightSensor
ProximitySensor</d:sensors>
      <d:mic>true</d:mic>
      <d:camera>
        <d:location>back</d:location>
        <d:autofocus>true</d:autofocus>
        <d:flash>true</d:flash>
      </d:camera>
      <d:camera>
        <d:location>front</d:location>
        <d:autofocus>true</d:autofocus>
        <d:flash>false</d:flash>
      </d:camera>
      <d:keyboard>nokeys</d:keyboard>
      <d:nav>nonav</d:nav>
      <d:ram unit="GiB">4</d:ram>
      <d:buttons>soft</d:buttons>
      <d:internal-storage unit="GiB">8</d:internal-storage>
      <d:removable-storage unit="TiB"></d:removable-storage>
      <d:cpu>Generic CPU</d:cpu>
      <d:gpu>Generic GPU</d:gpu>
      <d:abi>arm64-v8a
x86_64</d:abi>
      <d:dock></d:dock>
      <d:power-type>battery</d:power-type>
    </d:hardware>
    <d:software>
      <d:api-level>-</d:api-level>
      <d:live-wallpaper-support>true</d:live-wallpaper-support>
      <d:bluetooth-profiles></d:bluetooth-profiles>
      <d:gl-version>2.0</d:gl-version>
      <d:gl-extensions></d:gl-extensions>
      <d:status-bar>true</d:status-bar>
    </d:software>
    <d:state default="true" name="Portrait">
      <d:description>The device in portrait orientation</d:description>
      <d:screen-orientation>port</d:screen-orientation>
      <d:keyboard-state>keyssoft</d:keyboard-state>
      <d:nav-state>navhidden</d:nav-state>
    </d:state>
    <d:state name="Landscape">
      <d:description>The device in landscape orientation</d:description>
      <d:screen-orientation>land</d:screen-orientation>
      <d:keyboard-state>keyssoft</d:keyboard-state>
      <d:nav-state>navhidden</d:nav-state>
    </d:state>
  </d:device>
</d:devices>
`;
  return { ok: true, fileName: `${id}.xml`, xml };
}

export interface SizeClassRow {
  screen: "cover" | "main";
  rotation: 0 | 1 | 2 | 3;
  /** null when this rotation has no capture. */
  windowDp: { width: number; height: number } | null;
  foldingFeatures: FoldingFeatureCapture[];
  hingeAngle: number | null;
  capturedAt: string | null;
}

/**
 * One row per captured screen, rotation and folding feature, merging the two
 * navigation modes when they agree. Rotations a screen can take but no capture
 * recorded become pending rows; size classes are never derived by swapping axes.
 */
export function sizeClassRows(device: Device, captures: DevCapture[]): SizeClassRow[] {
  const rotationsFor = (screen: Device["screens"][number]) =>
    screen.fixedOrientation ? [] : device.formFactor === "tablet" ? [0, 1, 2, 3] as const : [0, 1, 3] as const;
  const rows = new Map<string, SizeClassRow>();
  for (const capture of captures) {
    const key = [capture.screen, capture.rotation, capture.windowDp.width, capture.windowDp.height,
      JSON.stringify(capture.foldingFeatures)].join("|");
    if (!rows.has(key)) rows.set(key, { screen: capture.screen, rotation: capture.rotation, windowDp: capture.windowDp,
      foldingFeatures: capture.foldingFeatures, hingeAngle: capture.hingeAngle, capturedAt: capture.capturedAt });
  }
  for (const screen of device.screens) {
    if (!captures.some(c => c.screen === screen.id)) continue;
    for (const rotation of rotationsFor(screen)) {
      if (!captures.some(c => c.screen === screen.id && c.rotation === rotation))
        rows.set(`${screen.id}|${rotation}|pending`, { screen: screen.id, rotation, windowDp: null, foldingFeatures: [], hingeAngle: null, capturedAt: null });
    }
  }
  const order = (screen: string) => screen === "cover" ? 0 : 1;
  return [...rows.values()].sort((a, b) => order(a.screen) - order(b.screen) || a.rotation - b.rotation);
}

export function foldingFeatureLabel(feature: FoldingFeatureCapture): string {
  const at = feature.orientation === "VERTICAL" ? `x=${Number(feature.boundsDp.left.toFixed(2))}dp` : `y=${Number(feature.boundsDp.top.toFixed(2))}dp`;
  return [feature.state, feature.orientation, feature.isSeparating ? "separating" : null, at].filter(Boolean).join(" · ");
}
