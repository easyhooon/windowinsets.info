import type { CornerRadii, NavMode, Screen } from "./types";

/** Android display rotation (Surface.ROTATION_0..3): the device turned counter-clockwise by n × 90°. */
export type Quarter = 0 | 1 | 2 | 3;

const quarter = (value: number) => (((Math.round(value) % 4) + 4) % 4) as Quarter;

/**
 * The Orientation control rotates the device clockwise on screen (CSS degrees).
 * Android counts rotation counter-clockwise, so a +90° view turn is ROTATION_270.
 */
export const viewQuarter = (viewRotationDeg: number): Quarter => quarter(-viewRotationDeg / 90);

/** Corners after the device turns counter-clockwise by `turns` quarters. */
export function rotateCorners<T extends CornerRadii | null | undefined>(corners: T, turns: Quarter): T {
  if (!corners || turns === 0) return corners;
  let { topLeft, topRight, bottomRight, bottomLeft } = corners;
  for (let i = 0; i < turns; i++) [topLeft, topRight, bottomRight, bottomLeft] = [topRight, bottomRight, bottomLeft, topLeft];
  return { topLeft, topRight, bottomRight, bottomLeft } as T;
}

const swapSize = <T extends { width: number; height: number } | null | undefined>(size: T, swap: boolean): T =>
  size && swap ? { ...size, width: size.height, height: size.width } as T : size;

const NOT_MEASURED: Record<NavMode, null> = { gesture: null, threeButton: null };

export type OrientedScreen = Screen & {
  /** The recorded orientation, or one with its own capture. False: insets are not measured here. */
  orientationMeasured: boolean;
};

/**
 * The screen as the device shows it after turning by `turns` quarters from its capture.
 * Window size and corner positions follow from the display geometry. Insets depend on
 * how Android lays out system bars and the cutout in that rotation, so they are only
 * shown when that rotation was captured; they are never rotated from another capture.
 */
export function orientScreen(screen: Screen, turns: Quarter): OrientedScreen {
  if (turns === 0) return { ...screen, orientationMeasured: true };
  const rotation = quarter((screen.captureRotation ?? 0) + turns);
  const swap = turns % 2 === 1;
  const flipOrientation = screen.captureOrientation === "portrait" ? "landscape" : screen.captureOrientation === "landscape" ? "portrait" : null;
  return {
    ...screen,
    captureRotation: rotation,
    captureOrientation: swap ? flipOrientation : screen.captureOrientation,
    resolutionPx: swapSize(screen.resolutionPx, swap),
    logicalSizeDp: swapSize(screen.logicalSizeDp, swap),
    logicalSizePx: swapSize(screen.logicalSizePx, swap),
    cornerRadiiDp: rotateCorners(screen.cornerRadiiDp, turns),
    cornerRadiiPx: rotateCorners(screen.cornerRadiiPx, turns),
    insets: NOT_MEASURED,
    orientationMeasured: false,
  };
}

export const orientationName = (screen: Pick<Screen, "logicalSizeDp" | "resolutionPx">) => {
  const size = screen.logicalSizeDp ?? screen.resolutionPx;
  return size.width > size.height ? "Landscape" : "Portrait";
};

/** Preview size from 3x artwork when no capture exists, turned with the display. */
export const skinDp = (skin: { screen: { width: number; height: number } }, rotation?: number | null) =>
  (rotation ?? 0) % 2 === 1
    ? { width: skin.screen.height / 3, height: skin.screen.width / 3 }
    : { width: skin.screen.width / 3, height: skin.screen.height / 3 };
