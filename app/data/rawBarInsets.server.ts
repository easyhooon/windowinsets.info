import { existsSync, readFileSync } from "node:fs";
import type { Insets, InsetsMeasurement } from "./types";

type RawPair = { dp: Insets; px: Insets };
export interface BarInsets {
  statusBars: { dp: Insets; px: Insets | null };
  navigationBars: { dp: Insets; px: Insets | null };
}

const RAW_URL = /\/blob\/main\/(measurements\/.+\.json)$/;
const EDGES = ["top", "right", "bottom", "left"] as const;
const round = (insets: Insets): Insets =>
  Object.fromEntries(EDGES.map(edge => [edge, Number(insets[edge].toFixed(2))])) as unknown as Insets;
const sameInsets = (a: Insets, b: Insets, tolerance: number) => EDGES.every(edge => Math.abs(a[edge] - b[edge]) <= tolerance);

function readRaw(path: string): Record<string, RawPair> | null {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")).insets ?? null; } catch { return null; }
}

/**
 * Status and navigation bar insets read from the raw InsetsProbe capture a
 * measurement cites. Returned only when the capture's systemBars match the
 * measurement, so a source that does not back these exact values yields null.
 */
export function rawBarInsets(measurement: InsetsMeasurement): BarInsets | null {
  const matches = measurement.sources.flatMap(source => {
    const path = source.url?.match(RAW_URL)?.[1];
    const insets = path ? readRaw(path) : null;
    if (!insets?.statusBars?.dp || !insets.navigationBars?.dp || !insets.systemBars?.dp) return [];
    const agrees = measurement.systemBarsPx && insets.systemBars.px
      ? sameInsets(insets.systemBars.px, measurement.systemBarsPx, 0)
      : sameInsets(insets.systemBars.dp, measurement.systemBars, 0.01);
    return agrees ? [insets] : [];
  });
  if (!matches.length) return null;
  const [insets] = matches;
  return {
    statusBars: { dp: round(insets.statusBars.dp), px: insets.statusBars.px ?? null },
    navigationBars: { dp: round(insets.navigationBars.dp), px: insets.navigationBars.px ?? null },
  };
}
