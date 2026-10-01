import { existsSync, readFileSync } from "node:fs";
import type { Device, Insets, InsetsMeasurement } from "./types";

type RawPair = { dp: Insets; px?: Insets };
type Pair = { dp: Insets; px: Insets | null };

/** Inset types InsetsProbe records beyond systemBars and displayCutout. */
export const RAW_INSET_TYPES = ["statusBars", "navigationBars", "systemGestures", "mandatorySystemGestures", "tappableElement"] as const;
export type RawInsetType = typeof RAW_INSET_TYPES[number];
export type RawInsets = Record<RawInsetType, Pair>;

const RAW_URL = /\/blob\/main\/(measurements\/.+\.json)$/;
const EDGES = ["top", "right", "bottom", "left"] as const;
const round = (insets: Insets): Insets =>
  Object.fromEntries(EDGES.map(edge => [edge, Number(insets[edge].toFixed(2))])) as unknown as Insets;
const sameInsets = (a: Insets, b: Insets, tolerance: number) => EDGES.every(edge => Math.abs(a[edge] - b[edge]) <= tolerance);

function readRaw(path: string): Record<string, RawPair> | null {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")).insets ?? null; } catch { return null; }
}

/** Repository path of the raw capture backing `measurement`, if one resolves. */
function backingCapture(measurement: InsetsMeasurement): { path: string; insets: Record<string, RawPair> } | null {
  for (const source of measurement.sources) {
    const path = source.url?.match(RAW_URL)?.[1];
    const insets = path ? readRaw(path) : null;
    if (!path || !insets?.systemBars?.dp || !RAW_INSET_TYPES.every(type => insets[type]?.dp)) continue;
    const agrees = measurement.systemBarsPx && insets.systemBars.px
      ? sameInsets(insets.systemBars.px, measurement.systemBarsPx, 0)
      : sameInsets(insets.systemBars.dp, measurement.systemBars, 0.01);
    if (agrees) return { path, insets };
  }
  return null;
}

/**
 * Per-type insets read from the raw InsetsProbe capture a measurement cites.
 * Returned only when the capture's systemBars match the measurement, so a
 * source that does not back these exact values yields null.
 */
export function rawInsets(measurement: InsetsMeasurement): RawInsets | null {
  const capture = backingCapture(measurement);
  if (!capture) return null;
  return Object.fromEntries(RAW_INSET_TYPES.map(type => {
    const pair = capture.insets[type];
    return [type, { dp: round(pair.dp), px: pair.px ?? null }];
  })) as RawInsets;
}

/** Raw insets for every measurement of a device, keyed by the capture path the page can match. */
export function deviceRawInsets(device: Device): Record<string, RawInsets> {
  const entries: Array<[string, RawInsets]> = [];
  for (const screen of device.screens) {
    const sets = [screen.insets, ...Object.values(screen.rotations ?? {}).map(capture => capture!.insets)];
    for (const set of sets) for (const measurement of Object.values(set)) {
      const capture = measurement && backingCapture(measurement);
      const insets = measurement && rawInsets(measurement);
      if (capture && insets) entries.push([capture.path, insets]);
    }
  }
  return Object.fromEntries(entries);
}
