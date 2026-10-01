import { useId, useState } from "react";
import { diagramAnnotations, visibleDiagramRulers } from "./diagramAnnotations";
import { MeasurementRulers } from "./MeasurementRulers";
import type { RulerMeasurements } from "./measurementLayout";
import { DIAGRAM_FONT, DIAGRAM_COLORS, GESTURE_COLOR, TAPPABLE_COLOR } from "./diagramStyle";
import type { DeviceSkin } from "../data/skins";
import { skinAssetUrl } from "../data/skinAssetUrl";
import { skinDp } from "../data/orientation";
import type { InsetsMeasurement, Screen } from "../data/types";
import { cutoutPairs, cornerPairs, formatLengthFromPairs, insetPairs, safeInsets, safeInsetsPx } from "../data/measurementUnits";
import { CLASH_COLOR, PREVIEW_INSET_OPACITY, appMockShapes, type AppPreview, type MockShape } from "./appPreview";

const MAX_W = 260;
const BASE_HEIGHT = 700;
const INSET_COLOR = DIAGRAM_COLORS.inset;
const RADIUS_COLOR = DIAGRAM_COLORS.radius;
const SAFE_FILL = DIAGRAM_COLORS.safeFill;
const INSET_FILL = DIAGRAM_COLORS.insetFill;

type Units = "dp" | "px";

function skinTransform(skin: DeviceSkin, width: number, height: number, rotation: 0 | 1 | 2 | 3) {
  const { x, y, width: screenWidth, height: screenHeight } = skin.screen;
  if (rotation === 1) {
    const sx = height / screenWidth, sy = width / screenHeight;
    return `matrix(0 ${-sx} ${sy} 0 ${-y * sy} ${(screenWidth + x) * sx})`;
  }
  if (rotation === 2) {
    const sx = width / screenWidth, sy = height / screenHeight;
    return `matrix(${-sx} 0 0 ${-sy} ${(screenWidth + x) * sx} ${(screenHeight + y) * sy})`;
  }
  if (rotation === 3) {
    const sx = height / screenWidth, sy = width / screenHeight;
    return `matrix(0 ${sx} ${-sy} 0 ${(screenHeight + y) * sy} ${-x * sx})`;
  }
  const sx = width / screenWidth, sy = height / screenHeight;
  return `matrix(${sx} 0 0 ${sy} ${-x * sx} ${-y * sy})`;
}

interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function Badge({ x, y, label, color, scale }: { x: number; y: number; label: string; color: string; scale: number }) {
  const width = (label.length * 7.2 + 8) * scale;
  return <g>
    <rect x={x - width / 2} y={y - 9 * scale} width={width} height={18 * scale} rx={2 * scale} fill={color} />
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12 * scale} fontWeight={500} fill="#fff">{label}</text>
  </g>;
}

function RegionLabel({ x, y, name, value, color, scale, width, height, inline = false }: {
  x: number; y: number; name: string; value: string; color: string; scale: number; width: number; height: number; inline?: boolean;
}) {
  const labelWidth = inline ? name.length + value.length + 4 : Math.max(name.length, value.length) + 2;
  const k = Math.min(scale, height / (inline ? 22 : 42), width / (labelWidth * 8));
  const nameW = (name.length * 7.2 + 8) * k, valueW = value.length * 7.2 * k, gap = 10 * k;
  return <g>
    <Badge x={inline ? x - (valueW + gap) / 2 : x} y={inline ? y : y - 10 * k} label={name} color={color} scale={k} />
    <text x={inline ? x + (nameW + gap) / 2 : x} y={inline ? y : y + 12 * k} textAnchor="middle" dominantBaseline="central" fontSize={12 * k} fill={color}>{value}</text>
  </g>;
}

function AppMock({ shapes, s, strokeScale, layer }: { shapes: MockShape[]; s: number; strokeScale: number; layer: "content" | "clash" }) {
  if (layer === "clash") return <g fill="none" stroke={CLASH_COLOR} strokeWidth={1.4 * strokeScale} strokeDasharray={`${3 * strokeScale} ${2 * strokeScale}`}>
    {shapes.map((shape, i) => shape.kind === "rect" && shape.clash
      ? <rect key={i} x={(shape.x - 3) * s} y={(shape.y - 3) * s} width={(shape.width + 6) * s} height={(shape.height + 6) * s} rx={(shape.radius + 3) * s} />
      : shape.kind === "text" && shape.clash
        ? <rect key={i} x={(shape.x - 3) * s} y={(shape.y - shape.size / 2 - 3) * s} width={(shape.width + 6) * s} height={(shape.size + 6) * s} rx={3 * s} />
        : null)}
  </g>;
  return <g aria-hidden="true">
    {shapes.map((shape, i) => {
      if (shape.kind === "rect") return <rect key={i} x={shape.x * s} y={shape.y * s} width={shape.width * s} height={shape.height * s} rx={shape.radius * s} fill={shape.fill} />;
      if (shape.kind === "circle") return <circle key={i} cx={shape.cx * s} cy={shape.cy * s} r={shape.r * s} fill={shape.fill} />;
      if (shape.kind === "text") return <text key={i} x={shape.x * s} y={shape.y * s} dominantBaseline="central" fontSize={shape.size * s} fontFamily="Roboto, system-ui, sans-serif" fill={shape.fill}>{shape.text}</text>;
      const h = shape.size / 2 * s;
      return <path key={i} d={`M ${shape.cx * s - h} ${shape.cy * s} H ${shape.cx * s + h} M ${shape.cx * s} ${shape.cy * s - h} V ${shape.cy * s + h}`} stroke={shape.stroke} strokeWidth={2.4 * s} strokeLinecap="round" />;
    })}
  </g>;
}

/** Detailed insets diagram with outside dimension lines, inside chips and a
 * color legend — modeled after safearea.info's measurement view. */
export function InsetsDiagram({
  screen,
  measurement,
  zoom,
  showFrame,
  showRegions,
  showDimensions,
  units,
  layers,
  skin,
  appPreview = "off",
  pendingOrientation,
  gestureInsets,
}: {
  screen: Screen;
  measurement: InsetsMeasurement | null;
  /** The parent viewport handles pan, fit and zoom. */
  zoom: number;
  showFrame: boolean;
  showRegions: boolean;
  showDimensions: boolean;
  units: Units;
  layers: { safe: boolean; insets: boolean; cutout: boolean; corners: boolean; gestures?: boolean; tappable?: boolean };
  skin?: DeviceSkin;
  appPreview?: AppPreview;
  /** Set when this orientation has no capture: e.g. "Landscape". Insets stay empty. */
  pendingOrientation?: string;
  /** dp insets from the raw capture backing `measurement`; null when it did not resolve. */
  gestureInsets?: { systemGestures: Insets; mandatorySystemGestures: Insets; tappableElement: Insets } | null;
}) {
  const id = useId().replace(/:/g, "");
  const [copyStatus, setCopyStatus] = useState("");
  const measured = !!screen.logicalSizeDp;
  showDimensions = showDimensions && measured;
  const dp = screen.logicalSizeDp ?? (skin ? skinDp(skin, screen.captureRotation) : null);
  if (!dp) {
    return (
      <div className="flex h-80 w-full max-w-lg items-center justify-center rounded-xl border border-dashed border-line p-4 text-center text-sm text-muted">
        Logical size (dp) for this screen is not verified yet.
      </div>
    );
  }

  const s = MAX_W / dp.width;
  const W = dp.width * s;
  const H = dp.height * s;
  const skinRotation = screen.captureRotation ?? 0;
  const lightTabletFrame = skin?.image === "/skins/pixel-tablet/main/back.webp";
  const r = screen.cornerRadiiDp;
  const rPx = r ? r.topLeft * s : 0;
  const cornerPath = r ? `M ${r.topLeft * s},0 H ${W - r.topRight * s} A ${r.topRight * s},${r.topRight * s} 0 0 1 ${W},${r.topRight * s} V ${H - r.bottomRight * s} A ${r.bottomRight * s},${r.bottomRight * s} 0 0 1 ${W - r.bottomRight * s},${H} H ${r.bottomLeft * s} A ${r.bottomLeft * s},${r.bottomLeft * s} 0 0 1 0,${H - r.bottomLeft * s} V ${r.topLeft * s} A ${r.topLeft * s},${r.topLeft * s} 0 0 1 ${r.topLeft * s},0 Z` : undefined;

  const safe: Insets | null = measurement ? safeInsets(measurement) : null;
  const safePx = measurement ? safeInsetsPx(measurement) : null;
  const fmt = formatLengthFromPairs(units, [
    [dp.width, screen.logicalSizePx?.width],
    [dp.height, screen.logicalSizePx?.height],
    ...(safe && safePx && screen.logicalSizePx ? [
      [dp.width - safe.left - safe.right, screen.logicalSizePx.width - safePx.left - safePx.right],
      [dp.height - safe.top - safe.bottom, screen.logicalSizePx.height - safePx.top - safePx.bottom],
    ] as const : []),
    ...insetPairs(safe, safePx),
    ...cornerPairs(r, screen.cornerRadiiPx),
    ...cutoutPairs(measurement?.cutoutShape),
  ]);

  const { rulers, bounds, body } = diagramAnnotations(dp.width, dp.height, s, showFrame ? skin : undefined, safe, r, measurement?.cutoutShape, skinRotation);
  const labelScale = (bounds.bottom - bounds.top) / BASE_HEIGHT * 100 / zoom;
  const viewBox = `${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}`;
  const annotations: RulerMeasurements = {
    body, scale: labelScale, format: fmt, units, screen: screen.label,
    rulers: visibleDiagramRulers(rulers, layers).map(ruler => ({ ...ruler,
      start: { x: ruler.guides[0][0], y: ruler.guides[0][1] },
      end: { x: ruler.guides[1][0], y: ruler.guides[1][1] },
      bracket: ruler.kind === 'radius' ? { x: ruler.guides[1][0], y: ruler.guides[1][1] > H / 2 ? H : 0 } : undefined,
      side: ruler.y1 === ruler.y2 ? (ruler.y1 < 0 ? 'top' : 'bottom') : (ruler.x1 < 0 ? 'left' : 'right'),
    })),
  };
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setCopyStatus(`Copied ${value}`); }
    catch { setCopyStatus("Copy unavailable"); }
  }

  return (
    <div className="space-y-3">
      <div>
      <svg
        viewBox={viewBox}
        overflow="visible"
        // Sized by its own real aspect ratio (device width:height), not stretched to
        // fill the container's width — that mismatch was letterboxing the phone shape
        // into a fraction of its box instead of showing it at its true proportions.
        // The parent owns zoom; compensate annotation size so rulers remain readable.
        style={{
          height: `${BASE_HEIGHT}px`,
          fontFamily: DIAGRAM_FONT,
          width: "auto",
          maxWidth: "none",
          display: "block",
          marginInline: "auto",
        }}
        role="group"
        aria-label={`${screen.label} screen insets diagram`}
      >
        <rect data-fit-body="true" x={body.left} y={body.top} width={body.right - body.left} height={body.bottom - body.top} fill="none" pointerEvents="none" />
        <defs>
          <clipPath id={`${id}-display`}>{cornerPath ? <path d={cornerPath} /> : <rect width={W} height={H} rx={skin ? skin.body.radius * W / skin.screen.width * .6 : 0} />}</clipPath>
        </defs>

        {skin && showFrame && <g transform={skinTransform(skin, W, H, skinRotation)}>
          <defs><clipPath id={`${id}-body`}><rect x={skin.body.x} y={skin.body.y} width={skin.body.width} height={skin.body.height} rx={skin.body.radius} /></clipPath></defs>
          {lightTabletFrame && <rect x={skin.body.x} y={skin.body.y} width={skin.body.width} height={skin.body.height} rx={skin.body.radius} fill="none" stroke="#64748b" strokeOpacity={0.6} strokeWidth={24} />}
          <image href={skinAssetUrl(skin.image)} width={skin.width} height={skin.height} clipPath={`url(#${id}-body)`} />
          <rect x={skin.screen.x} y={skin.screen.y} width={skin.screen.width} height={skin.screen.height} rx={rPx * skin.screen.width / W} fill="white" />
        </g>}
        {/* Device bezel */}
        {showFrame && !skin && (
          <rect x={0} y={0} width={W} height={H} rx={rPx} fill="#ffffff" stroke={DIAGRAM_COLORS.bezel} strokeWidth={3} />
        )}

        {showRegions && (
          <g clipPath={`url(#${id}-display)`}>
          {/* Screen content turns separately from the frame during orientation changes. */}
          <g data-screen-content="true" data-turn-scale={Math.min(W / H, H / W)} style={{ transformBox: "view-box", transformOrigin: `${W / 2}px ${H / 2}px` }}>
            {pendingOrientation && <RegionLabel x={W / 2} y={H / 2} name={pendingOrientation.toUpperCase()} value="Insets not measured yet" color="#59636e" scale={labelScale} width={W * .8} height={H * .3} />}
            {/* Decorative case chrome — schematic only, not measured data: a speaker
             * grille and volume/power buttons, purely for visual recognizability. */}
            {!skin && <rect x={W / 2 - 18} y={5} width={36} height={3} rx={1.5} fill="#1e293b" opacity={0.35} />}
            {!skin && <rect x={W - 1.5} y={H * 0.16} width={3} height={H * 0.06} rx={1.5} fill="#1e293b" opacity={0.55} />}
            {!skin && <rect x={W - 1.5} y={H * 0.24} width={3} height={H * 0.09} rx={1.5} fill="#1e293b" opacity={0.55} />}

            {/* Safe area + inset bands */}
            {safe && appPreview !== "off" && (() => {
              const shapes = appMockShapes(dp.width, dp.height, safe, appPreview);
              return <>
                <AppMock shapes={shapes} s={s} strokeScale={labelScale} layer="content" />
                <g fill={INSET_FILL} fillOpacity={layers.insets ? PREVIEW_INSET_OPACITY : 0}>
                  {safe.top > 0 && <rect x={0} y={0} width={W} height={safe.top * s} />}
                  {safe.bottom > 0 && <rect x={0} y={H - safe.bottom * s} width={W} height={safe.bottom * s} />}
                  {safe.left > 0 && <rect x={0} y={0} width={safe.left * s} height={H} />}
                  {safe.right > 0 && <rect x={W - safe.right * s} y={0} width={safe.right * s} height={H} />}
                </g>
                {layers.cutout && measurement?.cutoutShape && <rect x={measurement.cutoutShape.xDp * s} y={measurement.cutoutShape.yDp * s} width={measurement.cutoutShape.widthDp * s} height={measurement.cutoutShape.heightDp * s} stroke="#8950e8" strokeWidth={.7 * labelScale} fill="#c4a0f1" />}
                <AppMock shapes={shapes} s={s} strokeScale={labelScale} layer="clash" />
              </>;
            })()}
            {safe && appPreview === "off" && (
              <>
                <rect
                  x={safe.left * s} y={safe.top * s}
                  width={W - (safe.left + safe.right) * s}
                  height={H - (safe.top + safe.bottom) * s}
                  fill={SAFE_FILL} fillOpacity={layers.safe ? 1 : 0}
                />
                {safe.top > 0 && <rect x={0} y={0} width={W} height={safe.top * s} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}
                {safe.bottom > 0 && <rect x={0} y={H - safe.bottom * s} width={W} height={safe.bottom * s} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}
                {safe.left > 0 && <rect x={0} y={0} width={safe.left * s} height={H} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}
                {safe.right > 0 && <rect x={W - safe.right * s} y={0} width={safe.right * s} height={H} fill={INSET_FILL} fillOpacity={layers.insets ? 1 : 0} />}

                {/* OS exclusion bounds; the foreground artwork retains the physical camera. */}
                {layers.cutout && measurement?.cutoutShape && (
                  <rect
                    x={measurement.cutoutShape.xDp * s}
                    y={measurement.cutoutShape.yDp * s}
                    width={measurement.cutoutShape.widthDp * s}
                    height={measurement.cutoutShape.heightDp * s}
                    stroke="#8950e8" strokeWidth={.7 * labelScale}
                    fill="#c4a0f1"
                  />
                )}

                {/* Safe area's own size, centered inside the green region — the
                 * "SAFE AREA / W × H" label safearea.info prints on top of its
                 * own safe-area fill (this is the safe rect's own dp size, not
                 * the overall device size shown by the outside dimension lines). */}
                {showDimensions && layers.safe && (() => {
                  const safeWDp = dp.width - safe.left - safe.right;
                  const safeHDp = dp.height - safe.top - safe.bottom;
                  const cx = safe.left * s + (W - (safe.left + safe.right) * s) / 2;
                  const cy = safe.top * s + (H - (safe.top + safe.bottom) * s) / 2;
                  return <RegionLabel x={cx} y={cy} name="SAFE AREA" value={`${fmt(safeWDp)} × ${fmt(safeHDp)}`} color={DIAGRAM_COLORS.safe} scale={labelScale} width={safeWDp * s} height={safeHDp * s} />;

                })()}
              </>
            )}
            {gestureInsets && !pendingOrientation && (layers.gestures || layers.tappable) && (() => {
              const bands = (insets: Insets) => [
                insets.top > 0 && { x: 0, y: 0, width: W, height: insets.top * s },
                insets.bottom > 0 && { x: 0, y: H - insets.bottom * s, width: W, height: insets.bottom * s },
                insets.left > 0 && { x: 0, y: 0, width: insets.left * s, height: H },
                insets.right > 0 && { x: W - insets.right * s, y: 0, width: insets.right * s, height: H },
              ].filter(Boolean) as Array<{ x: number; y: number; width: number; height: number }>;
              return <g data-layer="gesture-insets">
                <defs>
                  <pattern id={`${id}-gesture`} width={6 * labelScale} height={6 * labelScale} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width={6 * labelScale} height={6 * labelScale} fill={GESTURE_COLOR} fillOpacity={.18} />
                    <line x1={0} y1={0} x2={0} y2={6 * labelScale} stroke={GESTURE_COLOR} strokeWidth={2 * labelScale} strokeOpacity={.55} />
                  </pattern>
                  <pattern id={`${id}-tappable`} width={5 * labelScale} height={5 * labelScale} patternUnits="userSpaceOnUse">
                    <rect width={5 * labelScale} height={5 * labelScale} fill={TAPPABLE_COLOR} fillOpacity={.12} />
                    <circle cx={2.5 * labelScale} cy={2.5 * labelScale} r={.9 * labelScale} fill={TAPPABLE_COLOR} fillOpacity={.7} />
                  </pattern>
                </defs>
                {layers.gestures && bands(gestureInsets.systemGestures).map((b, i) => <rect key={`g${i}`} {...b} fill={`url(#${id}-gesture)`} />)}
                {layers.gestures && bands(gestureInsets.mandatorySystemGestures).map((b, i) => <rect key={`m${i}`} {...b} fill={GESTURE_COLOR} fillOpacity={.22} />)}
                {layers.tappable && bands(gestureInsets.tappableElement).map((b, i) => <rect key={`t${i}`} {...b} fill={`url(#${id}-tappable)`} stroke={TAPPABLE_COLOR} strokeWidth={1.2 * labelScale} />)}
              </g>;
            })()}
          </g>
          </g>
        )}

        {skin?.foreground && showFrame && <g transform={skinTransform(skin, W, H, skinRotation)}>
          <image href={skinAssetUrl(skin.foreground)} x={skin.screen.x} y={skin.screen.y} width={skin.screen.width} height={skin.screen.height} preserveAspectRatio="none" />
        </g>}
        {showDimensions && <MeasurementRulers measurements={annotations} onCopy={copy} />}
      </svg>
      <span role="status" className="sr-only">{copyStatus}</span>
      </div>

    </div>
  );
}
