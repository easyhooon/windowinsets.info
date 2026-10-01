import { galaxyS25 } from "./devices/galaxy-s25/index";
import { rawInsets } from "./rawInsets.server";
import { skins } from "./skins";

export interface InsetsAnatomy {
  device: string;
  skin: { image: string; foreground: string | null; width: number; height: number; screen: { x: number; y: number; width: number; height: number } };
  /** Screen pixels of the gesture-mode capture; the skin's screen is the same 1080 × 2340 px. */
  px: { statusTop: number; navBottom: number; gestureLeft: number; gestureRight: number; cornerRadius: number; cutout: { x: number; y: number; width: number; height: number } };
}

/** Measured Galaxy S25 gesture-mode capture drawn on its official skin for the guide. */
export function insetsAnatomy(): InsetsAnatomy | null {
  const screen = galaxyS25.screens.find(s => s.id === "main");
  const measurement = screen?.insets.gesture;
  const raw = measurement && rawInsets(measurement);
  const skin = skins["galaxy-s25/main"];
  const cutout = measurement?.cutoutShape;
  const radius = screen?.cornerRadiiPx?.topRight;
  if (!raw?.statusBars.px || !raw.navigationBars.px || !raw.systemGestures.px || !skin || !radius || !cutout) return null;
  if (skin.screen.width !== screen!.logicalSizePx?.width) return null;
  return {
    device: galaxyS25.name,
    skin: { image: skin.image, foreground: skin.foreground, width: skin.width, height: skin.height, screen: skin.screen },
    px: {
      statusTop: raw.statusBars.px.top,
      navBottom: raw.navigationBars.px.bottom,
      gestureLeft: raw.systemGestures.px.left,
      gestureRight: raw.systemGestures.px.right,
      cornerRadius: radius,
      cutout: { x: cutout.xPx!, y: cutout.yPx!, width: cutout.widthPx!, height: cutout.heightPx! },
    },
  };
}
