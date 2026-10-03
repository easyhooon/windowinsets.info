import { existsSync, readFileSync } from "node:fs";
import type { PublicDevelopment, PublicWindowSizeClass } from "./deviceExport";
import {
  extendedWidthClass, heightClass, previewSpec, sizeClassRows, widthClass,
  type DevCapture, type FoldingFeatureCapture,
} from "./devTools";
import { REPO_URL } from "./site";
import type { Device, InsetsMeasurement, NavMode } from "./types";

const RAW_URL = /\/blob\/main\/(measurements\/.+\.json)$/;

interface RawCapture {
  display?: {
    rotation?: number; widthPx?: number; heightPx?: number; densityDpi?: number;
    maximumWindowDp?: { width: number; height: number };
  };
  displayCutout?: { boundingRects?: unknown[] } | null;
  hinge?: {
    angleDegrees?: number | null;
    foldingFeatures?: Array<{ state: FoldingFeatureCapture["state"]; orientation: FoldingFeatureCapture["orientation"];
      isSeparating: boolean; occlusionType: string; bounds: { dp: FoldingFeatureCapture["boundsDp"] } }>;
  };
}

function read(path: string): RawCapture | null {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
}

function fromMeasurement(screen: "cover" | "main", nav: NavMode, measurement: InsetsMeasurement): DevCapture | null {
  for (const source of measurement.sources) {
    const path = source.url?.match(RAW_URL)?.[1];
    const raw = path ? read(path) : null;
    const display = raw?.display;
    if (!path || !raw || !display?.widthPx || !display.heightPx || !display.densityDpi || !display.maximumWindowDp) continue;
    return {
      path, screen, nav,
      rotation: (display.rotation ?? 0) as DevCapture["rotation"],
      widthPx: display.widthPx, heightPx: display.heightPx, densityDpi: display.densityDpi,
      windowDp: { width: Number(display.maximumWindowDp.width.toFixed(2)), height: Number(display.maximumWindowDp.height.toFixed(2)) },
      cutout: (raw.displayCutout?.boundingRects?.length ?? 0) > 0,
      hingeAngle: raw.hinge?.angleDegrees ?? null,
      foldingFeatures: (raw.hinge?.foldingFeatures ?? []).map(f => ({
        state: f.state, orientation: f.orientation, isSeparating: f.isSeparating, occlusionType: f.occlusionType,
        boundsDp: { left: f.bounds.dp.left, top: f.bounds.dp.top, right: f.bounds.dp.right, bottom: f.bounds.dp.bottom },
      })),
      capturedAt: source.retrievedAt,
    };
  }
  return null;
}

/** Display, window and fold facts from every raw capture the device page cites (resolved at build). */
export function deviceDevCaptures(device: Device): DevCapture[] {
  const captures: DevCapture[] = [];
  for (const screen of device.screens) {
    const sets = [screen.insets, ...Object.values(screen.rotations ?? {}).map(capture => capture!.insets)];
    for (const set of sets) for (const [nav, measurement] of Object.entries(set) as Array<[NavMode, InsetsMeasurement | null]>) {
      const capture = measurement && fromMeasurement(screen.id, nav, measurement);
      if (capture && !captures.some(c => c.path === capture.path)) captures.push(capture);
    }
  }
  return captures;
}

function windowSizeClass(window: DevCapture["windowDp"]): PublicWindowSizeClass {
  return { width: widthClass(window.width), widthExtended: extendedWidthClass(window.width), height: heightClass(window.height) };
}

/** The published export's development section: per-capture Preview specs and size classes. */
export function deviceDevelopment(device: Device): PublicDevelopment {
  const captures = deviceDevCaptures(device);
  return {
    captures: captures.map(capture => ({
      screen: capture.screen,
      rotation: capture.rotation,
      navigation: capture.nav,
      displaySizePx: { width: capture.widthPx, height: capture.heightPx },
      densityDpi: capture.densityDpi,
      windowSizeDp: capture.windowDp,
      windowSizeClass: windowSizeClass(capture.windowDp),
      displayCutout: capture.cutout,
      hingeAngleDegrees: capture.hingeAngle,
      foldingFeatures: capture.foldingFeatures,
      composePreview: previewSpec(capture),
      capturedAt: capture.capturedAt,
      rawCapture: `${REPO_URL}/blob/main/${capture.path}`,
    })),
    windowSizeClasses: sizeClassRows(device, captures).map(row => ({
      screen: row.screen,
      rotation: row.rotation,
      status: row.windowDp ? "measured" as const : "pending" as const,
      windowSizeDp: row.windowDp,
      windowSizeClass: row.windowDp ? windowSizeClass(row.windowDp) : null,
      hingeAngleDegrees: row.hingeAngle,
      foldingFeatures: row.foldingFeatures,
      capturedAt: row.capturedAt,
    })),
  };
}
