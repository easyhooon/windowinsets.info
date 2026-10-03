import { existsSync, readFileSync } from "node:fs";
import type { DevCapture, FoldingFeatureCapture } from "./devTools";
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
        state: f.state, orientation: f.orientation, isSeparating: f.isSeparating, occlusionType: f.occlusionType, boundsDp: f.bounds.dp,
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
