/** All lengths are dp unless the field name says otherwise. */

export type NavMode = "gesture" | "threeButton";

/**
 * official  – published by the manufacturer / Google
 * measured  – measured on a real device or Samsung Remote Test Lab, with a log in /measurements
 * emulator  – reported by the Android Emulator for a device profile, with a log in /measurements;
 *             never evidence about the physical device
 * community – submitted by a contributor, not yet independently verified
 */
export type SourceKind = "official" | "measured" | "emulator" | "community";

export interface Source {
  kind: SourceKind;
  label: string;
  url?: string;
  /** ISO date (YYYY-MM-DD) the source was last checked */
  retrievedAt: string;
  note?: string;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** The Android Emulator run that produced a capture. */
export interface EmulatorProvenance {
  /** Android Studio device profile, e.g. "pixel_9". */
  deviceProfile: string;
  /** Emulator skin directory the AVD used. */
  skin: string;
  /** SDK system image path. */
  systemImage: string;
  buildFingerprint: string;
  emulatorVersion: string;
  /** Capture manifest listing every file of the run. */
  manifestUrl: string;
}

/** Software conditions an inset measurement is only valid for. */
export interface MeasurementCondition {
  /** Samsung One UI version; absent for other brands. */
  oneUi?: string;
  android: string;
  /** e.g. "Settings > Display > Navigation bar" defaults */
  note?: string;
  /** Present only for emulator captures. */
  emulator?: EmulatorProvenance;
}

/** The cutout's own bounding rectangle in dp, as reported by
 * DisplayCutout.boundingRects — its real position and size, not just how far
 * it intrudes from each edge. Used to draw the punch-hole/notch at its true
 * spot instead of a full-width placeholder band. */
export interface CutoutShape {
  xDp: number;
  yDp: number;
  widthDp: number;
  heightDp: number;
  /** Distance from the cutout's far edge to the display's right/bottom edge. */
  rightDp: number;
  bottomDp: number;
  /** Exact capture pixels. Omitted only for legacy/non-probe data. */
  xPx?: number;
  yPx?: number;
  widthPx?: number;
  heightPx?: number;
  rightPx?: number;
  bottomPx?: number;
}

export interface InsetsMeasurement {
  /** WindowInsets.Type.systemBars() */
  systemBars: Insets;
  /** Exact pixels from the capture; dp must never be multiplied back into px when present. */
  systemBarsPx?: Insets;
  /** WindowInsets.Type.displayCutout() */
  displayCutout: Insets;
  /** Exact pixels from the capture. */
  displayCutoutPx?: Insets;
  /** Present only when the raw capture included boundingRects. */
  cutoutShape?: CutoutShape;
  condition: MeasurementCondition;
  sources: Source[];
}

export interface CornerRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

export interface Screen {
  id: "cover" | "main";
  label: string;
  diagonalInch: number;
  resolutionPx: { width: number; height: number };
  /** Captured app/window extent, distinct from the physical panel resolution. */
  logicalSizePx?: { width: number; height: number } | null;
  /** Orientation recorded by the probe for logicalSizeDp/logicalSizePx. */
  captureOrientation?: "portrait" | "landscape" | null;
  /** Android Display rotation (Surface.ROTATION_*), used to align portrait artwork with a rotated capture. */
  captureRotation?: 0 | 1 | 2 | 3 | null;
  ppi: number;
  /** null = not verified yet. Never estimate. */
  logicalSizeDp: { width: number; height: number } | null;
  densityDpi: number | null;
  cornerRadiiDp: CornerRadii | null;
  /** Exact pixels from the capture. */
  cornerRadiiPx?: CornerRadii | null;
  /** Insets in captureOrientation per navigation mode; null = not measured yet. */
  insets: Record<NavMode, InsetsMeasurement | null>;
  sources: Source[];
}

export type FormFactor = "bar" | "tablet" | "foldable-book" | "foldable-flip" | "foldable-trifold";

export type Brand = "Samsung" | "Google";

export interface Device {
  slug: string;
  name: string;
  brand: Brand;
  series: string;
  formFactor: FormFactor;
  /** Manufacturer dimensions; 3D side silhouette still uses illustrative geometry. */
  chassisMm?: { unfoldedWidth: number; unfoldedDepth: number; foldedDepth: number; source: Source };
  /** null for artwork-only entries whose product specifications are not sourced. */
  releaseYear: number | null;
  /** Cover screen (if any) first, then the main screen. */
  screens: Screen[];
  sources: Source[];
}
