import { galaxyS25 } from "./devices/galaxy-s25/index";
import { rawInsets } from "./rawInsets.server";
import { skins } from "./skins";
import type { NavMode } from "./types";

export interface AnatomyMode { statusTop: number; navBottom: number; gestureLeft: number; gestureRight: number }
export interface InsetsAnatomy {
  device: string;
  skin: { image: string; foreground: string | null; width: number; height: number; screen: { x: number; y: number; width: number; height: number } };
  /** Screen pixels; the skin's screen rectangle is the captured 1080 × 2340 px window. */
  cornerRadius: number;
  cutout: { x: number; y: number; width: number; height: number };
  modes: Record<NavMode, AnatomyMode>;
}

/** Measured Galaxy S25 captures (both navigation modes) drawn on its official skin for the guide. */
export function insetsAnatomy(): InsetsAnatomy | null {
  const screen = galaxyS25.screens.find(s => s.id === "main");
  const skin = skins["galaxy-s25/main"];
  const cutout = screen?.insets.gesture?.cutoutShape;
  const radius = screen?.cornerRadiiPx?.topRight;
  if (!screen || !skin || !cutout || cutout.xPx == null || !radius || skin.screen.width !== screen.logicalSizePx?.width) return null;
  const mode = (nav: NavMode): AnatomyMode | null => {
    const measurement = screen.insets[nav];
    const raw = measurement && rawInsets(measurement);
    if (!raw?.statusBars.px || !raw.navigationBars.px || !raw.systemGestures.px) return null;
    return { statusTop: raw.statusBars.px.top, navBottom: raw.navigationBars.px.bottom, gestureLeft: raw.systemGestures.px.left, gestureRight: raw.systemGestures.px.right };
  };
  const gesture = mode("gesture"), threeButton = mode("threeButton");
  if (!gesture || !threeButton) return null;
  return {
    device: galaxyS25.name,
    skin: { image: skin.image, foreground: skin.foreground, width: skin.width, height: skin.height, screen: skin.screen },
    cornerRadius: radius,
    cutout: { x: cutout.xPx, y: cutout.yPx!, width: cutout.widthPx!, height: cutout.heightPx! },
    modes: { gesture, threeButton },
  };
}
