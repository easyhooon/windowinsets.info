import { devices } from "./devices";
import { rawInsets } from "./rawInsets.server";
import type { Device, InsetsMeasurement, Screen } from "./types";

export interface InsetRange {
  label: string;
  min: { value: number; device: string };
  max: { value: number; device: string };
  count: number;
}
export interface InsetRangeGroup { label: string; ranges: InsetRange[] }

type Sample = { device: Device; gesture: ReturnType<typeof rawInsets>; threeButton: ReturnType<typeof rawInsets> };

/** Portrait, natural-orientation captures with both navigation modes resolved from raw evidence. */
function samples(pick: (device: Device) => Screen | undefined): Sample[] {
  return devices.filter(device => device.brand === "Samsung").flatMap(device => {
    const screen = pick(device);
    if (!screen || screen.captureOrientation !== "portrait") return [];
    const read = (m: InsetsMeasurement | null) => m ? rawInsets(m) : null;
    const gesture = read(screen.insets.gesture), threeButton = read(screen.insets.threeButton);
    return gesture && threeButton ? [{ device, gesture, threeButton }] : [];
  });
}

function range(label: string, items: Sample[], value: (s: Sample) => number): InsetRange {
  const sorted = [...items].sort((a, b) => value(a) - value(b) || a.device.name.localeCompare(b.device.name));
  const first = sorted[0], last = sorted[sorted.length - 1];
  return {
    label,
    min: { value: value(first), device: first.device.name },
    max: { value: value(last), device: last.device.name },
    count: items.length,
  };
}

function group(label: string, items: Sample[]): InsetRangeGroup {
  return {
    label,
    ranges: [
      range("Status bar height", items, s => s.gesture!.statusBars.dp.top),
      range("Navigation bar, gesture", items, s => s.gesture!.navigationBars.dp.bottom),
      range("Navigation bar, 3-button", items, s => s.threeButton!.navigationBars.dp.bottom),
      range("Back-gesture zone width", items, s => s.gesture!.systemGestures.dp.left),
    ],
  };
}

/** Spread of measured Galaxy insets, computed at prerender from the cited raw captures. */
export function insetRanges(): InsetRangeGroup[] {
  return [
    group("Galaxy phones", samples(device => device.formFactor === "bar" ? device.screens.find(s => s.id === "main") : undefined)),
    // Fold covers are phone-like; Flip and TriFold covers have different system UI, so they are not mixed in.
    group("Galaxy Z Fold cover screens", samples(device => device.formFactor === "foldable-book" ? device.screens.find(s => s.id === "cover") : undefined)),
  ].filter(g => g.ranges[0].count > 0);
}
