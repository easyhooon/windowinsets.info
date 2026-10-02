import type { Device, Insets, InsetsMeasurement, NavMode, Screen } from "./types";
import { rawInsets } from "./rawInsets.server";

const EDGES = ["top", "right", "bottom", "left"] as const;
const NAV_MODES: Array<[NavMode, string]> = [["gesture", "Gesture navigation"], ["threeButton", "3-button navigation"]];
const ROTATION_NAMES = { 0: "natural orientation", 1: "rotated 90°", 2: "upside down", 3: "rotated 270°" } as const;

const num = (value: number) => String(Number(value.toFixed(2)));
const size = (s: { width: number; height: number }, unit: string) => `${num(s.width)} × ${num(s.height)} ${unit}`;
const maxEdges = (a: Insets, b: Insets): Insets => ({ top: Math.max(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom), left: Math.max(a.left, b.left) });

function insetRow(name: string, dp: Insets | null | undefined, px: Insets | null | undefined) {
  const cells = EDGES.map(edge => (dp ? `${num(dp[edge])} dp${px ? ` (${px[edge]} px)` : ""}` : "Unavailable"));
  return `| ${name} | ${cells.join(" | ")} |`;
}

function measurementSection(label: string, m: InsetsMeasurement | null): string[] {
  if (!m) return [`#### ${label}`, "", "Not measured yet.", ""];
  const raw = rawInsets(m);
  const evidence = m.sources.filter(source => (source.kind === "measured" || source.kind === "emulator") && source.url).map(source => source.url);
  const where = m.condition.emulator ? " on the Android Emulator" : "";
  const version = `Android ${m.condition.android}${m.condition.oneUi ? `, One UI ${m.condition.oneUi}` : ""}`;
  const safePx = m.systemBarsPx && m.displayCutoutPx ? maxEdges(m.systemBarsPx, m.displayCutoutPx) : null;
  const lines = [
    `#### ${label}`,
    "",
    `Measured${where} on ${version}.${evidence.length ? ` ${evidence.length > 1 ? "Sources" : "Source"}: ${evidence.join(", ")}` : ""}`,
    "",
    "| Inset | Top | Right | Bottom | Left |",
    "| --- | --- | --- | --- | --- |",
    insetRow("Safe area (max of system bars and cutout)", maxEdges(m.systemBars, m.displayCutout), safePx),
    insetRow("System bars", m.systemBars, m.systemBarsPx),
    insetRow("Status bars", raw?.statusBars.dp, raw?.statusBars.px),
    insetRow("Navigation bars", raw?.navigationBars.dp, raw?.navigationBars.px),
    insetRow("Display cutout", m.displayCutout, m.displayCutoutPx),
    insetRow("System gestures", raw?.systemGestures.dp, raw?.systemGestures.px),
    insetRow("Mandatory system gestures", raw?.mandatorySystemGestures.dp, raw?.mandatorySystemGestures.px),
    insetRow("Tappable element", raw?.tappableElement.dp, raw?.tappableElement.px),
    "",
  ];
  const cutout = m.cutoutShape;
  if (cutout) {
    const px = cutout.widthPx !== undefined && cutout.heightPx !== undefined ? `, ${cutout.widthPx} × ${cutout.heightPx} px at (${cutout.xPx}, ${cutout.yPx})` : "";
    lines.push(`Display cutout bounds: ${num(cutout.widthDp)} × ${num(cutout.heightDp)} dp at (${num(cutout.xDp)}, ${num(cutout.yDp)})${px}. This is the OS exclusion rectangle, not a measured camera lens.`, "");
  }
  return lines;
}

function screenSection(screen: Screen): string[] {
  const lines = [`## ${screen.label} screen`, ""];
  // Artwork-only previews register zero placeholders; never print them as specifications.
  const properties: Array<[string, string]> = [
    ["Diagonal", screen.diagonalInch ? `${screen.diagonalInch} in` : "Not available"],
    ["Panel resolution", screen.resolutionPx.width ? size(screen.resolutionPx, "px") : "Not available"],
  ];
  if (screen.densityDpi) properties.push(["Android density", `${screen.densityDpi} dpi (${num(screen.densityDpi / 160)}×)`]);
  if (screen.cornerRadiiDp) {
    const order = ["topLeft", "topRight", "bottomRight", "bottomLeft"] as const;
    const px = screen.cornerRadiiPx ? ` (${order.map(corner => screen.cornerRadiiPx![corner]).join(", ")} px)` : "";
    properties.push(["Corner radii (top left, top right, bottom right, bottom left)", `${order.map(corner => num(screen.cornerRadiiDp![corner])).join(", ")} dp${px}`]);
  }
  lines.push("| Property | Value |", "| --- | --- |", ...properties.map(([name, value]) => `| ${name} | ${value} |`), "");

  if (!screen.logicalSizeDp) return [...lines, "Window insets: not measured yet.", ""];
  const captures: Array<[number, { width: number; height: number }, { width: number; height: number } | null | undefined, Record<NavMode, InsetsMeasurement | null>]> = [
    [screen.captureRotation ?? 0, screen.logicalSizeDp, screen.logicalSizePx, screen.insets],
    ...Object.entries(screen.rotations ?? {})
      .filter(([rotation]) => Number(rotation) !== (screen.captureRotation ?? 0))
      .map(([rotation, capture]) => [Number(rotation), capture!.logicalSizeDp, capture!.logicalSizePx, capture!.insets] as [number, { width: number; height: number }, { width: number; height: number }, Record<NavMode, InsetsMeasurement | null>]),
  ];
  captures.sort((a, b) => a[0] - b[0]);
  for (const [rotation, dp, px, insets] of captures) {
    const orientation = dp.width > dp.height ? "landscape" : "portrait";
    lines.push(`### Rotation ${rotation} (${ROTATION_NAMES[rotation as 0 | 1 | 2 | 3]}, ${orientation})`, "",
      `Window: ${size(dp, "dp")}${px ? ` (${size(px, "px")})` : ""}.`, "");
    for (const [mode, label] of NAV_MODES) lines.push(...measurementSection(label, insets[mode]));
  }
  if (screen.fixedOrientation) lines.push("This screen keeps its natural layout when the device turns.", "");
  else lines.push("Rotations not listed have no capture of their own; insets are never derived from another rotation.", "");
  return lines;
}

/** A Markdown reference for one device, in the spirit of safearea.info's per-device .md pages. */
export function createDeviceMarkdown(device: Device, siteUrl: string): string {
  const lines = [
    `# ${device.name}`,
    "",
    `> Android window insets, display cutouts, corner radii and screen dimensions for ${device.name}${device.releaseYear ? ` (${device.releaseYear})` : ""}.`,
    "",
    `Device page: ${siteUrl}/${device.slug}`,
    `JSON export: ${siteUrl}/data/${device.slug}.json`,
    "",
    "Values are Android `WindowInsets` in dp, with capture pixels in parentheses. \"Not measured yet\" means no capture exists; nothing is estimated. When citing a value, link to the device page.",
    "",
  ];
  for (const screen of device.screens) lines.push(...screenSection(screen));
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}
