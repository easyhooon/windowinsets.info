import type {
  CornerRadii,
  Device,
  Insets,
  InsetsMeasurement,
  EmulatorProvenance,
  NavMode,
  Screen,
  Source,
} from "./types";

/** "emulator" marks Android Emulator captures; they are never physical-device evidence. */
type Evidence = "measured" | "emulator";

const evidenceOf = (sources: Source[]): Evidence =>
  sources.some(source => source.kind === "emulator") ? "emulator" : "measured";

export const DEVICE_EXPORT_SCHEMA = "https://windowinsets.info/schemas/device-window-insets-v1.schema.json";
export const DEVICE_EXPORT_SCHEMA_VERSION = 1;

function roundDisplayPrecision(value: number): number {
  return Number(value.toFixed(2));
}

function safeInsets(measurement: InsetsMeasurement): Insets {
  return {
    top: Math.max(measurement.systemBars.top, measurement.displayCutout.top),
    right: Math.max(measurement.systemBars.right, measurement.displayCutout.right),
    bottom: Math.max(measurement.systemBars.bottom, measurement.displayCutout.bottom),
    left: Math.max(measurement.systemBars.left, measurement.displayCutout.left),
  };
}

function safeInsetsPx(measurement: InsetsMeasurement): Insets | null {
  if (!measurement.systemBarsPx || !measurement.displayCutoutPx) return null;
  return {
    top: Math.max(measurement.systemBarsPx.top, measurement.displayCutoutPx.top),
    right: Math.max(measurement.systemBarsPx.right, measurement.displayCutoutPx.right),
    bottom: Math.max(measurement.systemBarsPx.bottom, measurement.displayCutoutPx.bottom),
    left: Math.max(measurement.systemBarsPx.left, measurement.displayCutoutPx.left),
  };
}

export interface PublicSource {
  kind: Source["kind"];
  label: string;
  url: string | null;
  retrievedAt: string;
  note: string | null;
}

interface Size {
  width: number;
  height: number;
}

interface UnitPair<T> {
  dp: T | null;
  px: T | null;
}

interface MeasuredUnitPair<T> {
  dp: T;
  px: T | null;
}

export interface PublicMeasurement {
  evidence: Evidence;
  raw: {
    systemBars: MeasuredUnitPair<Insets>;
    /** From the cited raw capture; null when it cannot be resolved. */
    statusBars: MeasuredUnitPair<Insets> | null;
    navigationBars: MeasuredUnitPair<Insets> | null;
    systemGestures: MeasuredUnitPair<Insets> | null;
    mandatorySystemGestures: MeasuredUnitPair<Insets> | null;
    tappableElement: MeasuredUnitPair<Insets> | null;
    displayCutoutInsets: MeasuredUnitPair<Insets>;
    displayCutoutBounds: MeasuredUnitPair<{
      left: number;
      top: number;
      width: number;
      height: number;
      right: number;
      bottom: number;
    }> | null;
  };
  derived: {
    safeAreaInsets: MeasuredUnitPair<Insets> & {
      evidence: "derived";
      method: "max(systemBars, displayCutoutInsets) per edge";
    };
    safeAreaSize: MeasuredUnitPair<Size> & {
      evidence: "derived";
      method: "logicalSize - safeAreaInsets";
    };
  };
  condition: {
    oneUi: string | null;
    android: string;
    note: string | null;
    emulator: EmulatorProvenance | null;
  };
  sources: PublicSource[];
}

export interface PublicDeviceExport {
  schema: typeof DEVICE_EXPORT_SCHEMA;
  schemaVersion: typeof DEVICE_EXPORT_SCHEMA_VERSION;
  device: {
    slug: string;
    name: string;
    brand: Device["brand"];
    series: string;
    formFactor: Device["formFactor"];
    foldAnimation: boolean;
    releaseYear: number | null;
  };
  screens: Array<{
    id: "cover" | "main";
    label: string;
    specifications: {
      evidence: "registered";
      diagonalInch: number | null;
      resolutionPx: Size | null;
      ppi: number | null;
    };
    capture: {
      status: "measured" | "pending";
      value: {
        evidence: Evidence;
        logicalSize: MeasuredUnitPair<Size>;
        densityDpi: number;
        orientation: "portrait" | "landscape" | null;
        displayRotation: 0 | 1 | 2 | 3 | null;
        cornerRadii: UnitPair<CornerRadii>;
      } | null;
    };
    navigationModes: Record<NavMode, {
      status: "measured" | "pending";
      value: PublicMeasurement | null;
    }>;
    sources: PublicSource[];
  }>;
  sources: PublicSource[];
}

function publicSource(source: Source): PublicSource {
  return {
    kind: source.kind,
    label: source.label,
    url: source.url ?? null,
    retrievedAt: source.retrievedAt,
    note: source.note ?? null,
  };
}

function captureEvidence(screen: Screen): Evidence {
  const measurements = [screen.insets.gesture, screen.insets.threeButton].filter(m => m !== null);
  return evidenceOf(measurements.length ? measurements.flatMap(m => m!.sources) : screen.sources);
}

function hasCompletePxBounds(shape: InsetsMeasurement["cutoutShape"]): boolean {
  return !!shape && [shape.xPx, shape.yPx, shape.widthPx, shape.heightPx, shape.rightPx, shape.bottomPx]
    .every(value => value != null);
}

type RawInsetsType = "statusBars" | "navigationBars" | "systemGestures" | "mandatorySystemGestures" | "tappableElement";
/** Resolves per-type insets; the build passes a raw-capture reader, browsers have none. */
export type BarInsetsLookup = (measurement: InsetsMeasurement) => Record<RawInsetsType, MeasuredUnitPair<Insets>> | null;

function exportMeasurement(
  measurement: InsetsMeasurement,
  logicalSizeDp: Size,
  logicalSizePx: Size | null,
  barInsets: BarInsetsLookup,
): PublicMeasurement {
  const bars = barInsets(measurement);
  const safeDp = safeInsets(measurement);
  const safePx = safeInsetsPx(measurement);
  const shape = measurement.cutoutShape;
  const boundsPx = hasCompletePxBounds(shape) ? {
    left: shape!.xPx!,
    top: shape!.yPx!,
    width: shape!.widthPx!,
    height: shape!.heightPx!,
    right: shape!.rightPx!,
    bottom: shape!.bottomPx!,
  } : null;

  return {
    evidence: evidenceOf(measurement.sources),
    raw: {
      systemBars: { dp: measurement.systemBars, px: measurement.systemBarsPx ?? null },
      statusBars: bars?.statusBars ?? null,
      navigationBars: bars?.navigationBars ?? null,
      systemGestures: bars?.systemGestures ?? null,
      mandatorySystemGestures: bars?.mandatorySystemGestures ?? null,
      tappableElement: bars?.tappableElement ?? null,
      displayCutoutInsets: { dp: measurement.displayCutout, px: measurement.displayCutoutPx ?? null },
      displayCutoutBounds: shape ? {
        dp: {
          left: shape.xDp,
          top: shape.yDp,
          width: shape.widthDp,
          height: shape.heightDp,
          right: shape.rightDp,
          bottom: shape.bottomDp,
        },
        px: boundsPx,
      } : null,
    },
    derived: {
      safeAreaInsets: {
        evidence: "derived",
        method: "max(systemBars, displayCutoutInsets) per edge",
        dp: safeDp,
        px: safePx,
      },
      safeAreaSize: {
        evidence: "derived",
        method: "logicalSize - safeAreaInsets",
        dp: {
          width: roundDisplayPrecision(logicalSizeDp.width - safeDp.left - safeDp.right),
          height: roundDisplayPrecision(logicalSizeDp.height - safeDp.top - safeDp.bottom),
        },
        px: logicalSizePx && safePx ? {
          width: logicalSizePx.width - safePx.left - safePx.right,
          height: logicalSizePx.height - safePx.top - safePx.bottom,
        } : null,
      },
    },
    condition: {
      oneUi: measurement.condition.oneUi ?? null,
      android: measurement.condition.android,
      note: measurement.condition.note ?? null,
      emulator: measurement.condition.emulator ?? null,
    },
    sources: measurement.sources.map(publicSource),
  };
}

export function createDeviceExport(device: Device, barInsets: BarInsetsLookup = () => null): PublicDeviceExport {
  return {
    schema: DEVICE_EXPORT_SCHEMA,
    schemaVersion: DEVICE_EXPORT_SCHEMA_VERSION,
    device: {
      slug: device.slug,
      name: device.name,
      brand: device.brand,
      series: device.series,
      formFactor: device.formFactor,
      foldAnimation: device.formFactor === "foldable-book" || device.formFactor === "foldable-flip" || device.formFactor === "foldable-trifold",
      releaseYear: device.releaseYear,
    },
    screens: device.screens.map(screen => {
      const exportMode = (navMode: NavMode) => {
        const measurement = screen.insets[navMode];
        return measurement && screen.logicalSizeDp ? {
          status: "measured" as const,
          value: exportMeasurement(measurement, screen.logicalSizeDp, screen.logicalSizePx ?? null, barInsets),
        } : { status: "pending" as const, value: null };
      };
      const capture = screen.logicalSizeDp !== null && screen.densityDpi !== null ? {
        status: "measured" as const,
        value: {
          evidence: captureEvidence(screen),
          logicalSize: { dp: screen.logicalSizeDp, px: screen.logicalSizePx ?? null },
          densityDpi: screen.densityDpi,
          orientation: screen.captureOrientation ?? null,
          displayRotation: screen.captureRotation ?? null,
          cornerRadii: { dp: screen.cornerRadiiDp, px: screen.cornerRadiiPx ?? null },
        },
      } : { status: "pending" as const, value: null };

      return {
        id: screen.id,
        label: screen.label,
        specifications: {
          evidence: "registered" as const,
          diagonalInch: screen.diagonalInch > 0 ? screen.diagonalInch : null,
          resolutionPx: screen.resolutionPx.width > 0 && screen.resolutionPx.height > 0 ? screen.resolutionPx : null,
          ppi: screen.ppi > 0 ? screen.ppi : null,
        },
        capture,
        navigationModes: {
          gesture: exportMode("gesture"),
          threeButton: exportMode("threeButton"),
        },
        sources: screen.sources.map(publicSource),
      };
    }),
    sources: device.sources.map(publicSource),
  };
}

export function deviceExportFilename(device: Pick<Device, "slug">): string {
  return `${device.slug}-window-insets.json`;
}

export function deviceExportPath(device: Pick<Device, "slug">): string {
  return `/data/${device.slug}.json`;
}

export function serializeDeviceExport(device: Device, barInsets?: BarInsetsLookup): string {
  return `${JSON.stringify(createDeviceExport(device, barInsets), null, 2)}\n`;
}

/** Saves `json` (the published export, so it carries build-only fields) as a file. */
export function downloadDeviceExport(device: Device, json: string = serializeDeviceExport(device)): void {
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  let anchor: HTMLAnchorElement | null = null;
  try {
    anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = deviceExportFilename(device);
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor?.remove();
    // Safari and Firefox can still be consuming the object URL when click()
    // returns. Revoke it in the next task instead of invalidating the download.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export const DEVICE_INDEX_SCHEMA = "https://windowinsets.info/schemas/device-index-v1.schema.json";
export const DEVICE_INDEX_PATH = "/data/index.json";

export interface PublicDeviceIndex {
  schema: typeof DEVICE_INDEX_SCHEMA;
  schemaVersion: 1;
  deviceCount: number;
  devices: Array<{
    slug: string;
    name: string;
    brand: Device["brand"];
    series: string;
    formFactor: Device["formFactor"];
    releaseYear: number | null;
    /** Kind of evidence behind the captures; null while nothing is captured. */
    evidence: Evidence | null;
    /** Natural orientation, both navigation modes, every screen. */
    measurementStatus: "complete" | "partial" | "pending";
    screens: Array<{
      id: Screen["id"];
      measuredModes: NavMode[];
      /** Surface.ROTATION_* values with a separate capture in at least one navigation mode. */
      measuredRotations: Array<0 | 1 | 2 | 3>;
    }>;
    export: string;
    page: string;
  }>;
}

const NAV_MODES: NavMode[] = ["gesture", "threeButton"];

/** Lists every public device with its capture coverage and export URL. */
export function createDeviceIndex(devices: Device[], siteUrl: string): PublicDeviceIndex {
  return {
    schema: DEVICE_INDEX_SCHEMA,
    schemaVersion: 1,
    deviceCount: devices.length,
    devices: devices.map(device => {
      const screens = device.screens.map(screen => ({
        id: screen.id,
        measuredModes: NAV_MODES.filter(mode => screen.insets[mode] !== null),
        measuredRotations: Object.entries(screen.rotations ?? {})
          .filter(([, capture]) => capture && NAV_MODES.some(mode => capture.insets[mode] !== null))
          .map(([rotation]) => Number(rotation) as 0 | 1 | 2 | 3)
          .sort(),
      }));
      const measured = screens.reduce((count, screen) => count + screen.measuredModes.length, 0);
      const sources = device.screens.flatMap(screen => NAV_MODES.flatMap(mode => screen.insets[mode]?.sources ?? []));
      return {
        slug: device.slug,
        name: device.name,
        brand: device.brand,
        series: device.series,
        formFactor: device.formFactor,
        releaseYear: device.releaseYear,
        evidence: sources.length ? evidenceOf(sources) : null,
        measurementStatus: measured === 0 ? "pending" : measured === screens.length * NAV_MODES.length ? "complete" : "partial",
        screens,
        export: `${siteUrl}${deviceExportPath(device)}`,
        page: `${siteUrl}/${device.slug}`,
      };
    }),
  };
}

export const DEVICE_BUNDLE_SCHEMA = "https://windowinsets.info/schemas/device-bundle-v1.schema.json";
export const DEVICE_BUNDLE_PATH = "/data/all.json";

export interface PublicDeviceBundle {
  schema: typeof DEVICE_BUNDLE_SCHEMA;
  schemaVersion: 1;
  deviceCount: number;
  devices: PublicDeviceExport[];
}

/** Every device export in one file, for bulk use (tests, CLI) without one request per device. */
export function createDeviceBundle(devices: Device[], barInsets?: BarInsetsLookup): PublicDeviceBundle {
  return {
    schema: DEVICE_BUNDLE_SCHEMA,
    schemaVersion: 1,
    deviceCount: devices.length,
    devices: devices.map(device => createDeviceExport(device, barInsets)),
  };
}
