import type { Ruler } from './diagramAnnotations';

export function rulerValue(ruler: Ruler, format: (value: number) => string) {
  return format(ruler.value) + (ruler.secondaryValue === undefined ? '' : ` × ${format(ruler.secondaryValue)}`);
}

export type Point = { x: number; y: number };
export type PositionedRuler = Ruler & { start: Point; end: Point; bracket?: Point; side: 'top' | 'bottom' | 'left' | 'right' };
export interface RulerMeasurements {
  rulers: PositionedRuler[];
  body: { left: number; top: number; right: number; bottom: number };
  scale: number;
  compact?: boolean;
  format: (value: number) => string;
  units: string;
  screen: string;
}

/** Pack each measurement kind into parallel lanes, keeping short intervals
 * instead of a distant badge with a diagonal leader through another measurement. */
export function layoutMeasurementRulers({ rulers, body, scale, format, compact = false }: RulerMeasurements) {
  const lanes = new Map<string, Array<Array<[number, number]>>>();
  // Read outward from local geometry to the overall display size.
  const priority = { radius: 0, cutout: 1, inset: 2, size: 3 };
  return [...rulers].sort((a, b) => priority[a.kind] - priority[b.kind]).map(ruler => {
    const horizontal = ruler.side === 'top' || ruler.side === 'bottom';
    const text = (ruler.kind === 'radius' ? 'R ' : '') + rulerValue(ruler, format);
    const width = (text.length * 7.2 + 10) * scale;
    const height = 19 * scale;
    const a = horizontal ? ruler.start.x : ruler.start.y;
    const b = horizontal ? ruler.end.x : ruler.end.y;
    const middle = (a + b) / 2;
    const half = (horizontal ? width : height) / 2;
    const interval: [number, number] = [Math.min(a, b, middle - half) - 4 * scale, Math.max(a, b, middle + half) + 4 * scale];
    // For a small span, place the badge beside the arrow, on the same lane.
    const short = Math.abs(b - a) < (horizontal ? width + 8 * scale : height + 8 * scale);
    // A side badge beside its arrow reaches into the next lane outward, so it claims both.
    const span = short && !compact && !horizontal ? 2 : 1;
    const rows = lanes.get(ruler.side) ?? [];
    const free = (index: number) => (rows[index] ?? []).every(([start, end]) => interval[1] < start || interval[0] > end);
    let row = 0;
    while (!Array.from({ length: span }, (_, i) => free(row + i)).every(Boolean)) row++;
    for (let i = 0; i < span; i++) (rows[row + i] ??= []).push(interval);
    lanes.set(ruler.side, rows);
    // A fixed lane width avoids varying-length values shifting adjacent lanes.
    const distance = (horizontal ? (compact ? 16 + row * 20 : 24 + row * 26) : (compact ? 32 + row * 52 : 40 + row * 65)) * scale;
    const lane = ruler.side === 'top' ? body.top - distance : ruler.side === 'bottom' ? body.bottom + distance
      : ruler.side === 'left' ? body.left - distance : body.right + distance;
    const p = horizontal ? { x: a, y: lane } : { x: lane, y: a };
    const q = horizontal ? { x: b, y: lane } : { x: lane, y: b };
    const x = horizontal ? middle : lane + (short && !compact ? (ruler.side === 'left' ? -1 : 1) * (width / 2 + 5 * scale) : 0);
    const y = horizontal ? lane + (ruler.side === 'top' ? -1 : 1) * (height / 2 + 4 * scale) : middle;
    return { ...ruler, text, p, q, x, y, width, height };
  });
}
