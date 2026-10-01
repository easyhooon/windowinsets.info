import type { AppPreview } from "../components/appPreview";
import type { NavMode } from "../data/types";

/** Device view settings worth sharing in a link. Values equal to the page
 * defaults stay out of the query string so canonical URLs remain clean. */
export interface ViewState {
  navMode: NavMode;
  /** Clockwise view rotation in degrees, as DeviceView stores it (0, 90, 180, -90). */
  rotation: number;
  /** Hinge angle in degrees; only meaningful for foldables. */
  hinge: number;
  units: "dp" | "px";
  appPreview: AppPreview;
}

const KEYS = ["nav", "rotate", "hinge", "unit", "app"] as const;

export function parseViewState(search: string, options: { rotations: number[]; foldable: boolean }): Partial<ViewState> {
  const params = new URLSearchParams(search);
  const state: Partial<ViewState> = {};
  const nav = params.get("nav");
  if (nav === "gesture") state.navMode = "gesture";
  else if (nav === "3-button") state.navMode = "threeButton";
  const rotate = Number(params.get("rotate"));
  if (params.has("rotate") && Number.isInteger(rotate)) {
    const rotation = rotate % 360 > 180 ? rotate % 360 - 360 : rotate % 360;
    if (options.rotations.includes(rotation)) state.rotation = rotation;
  }
  const hinge = Number(params.get("hinge"));
  if (options.foldable && params.has("hinge") && Number.isInteger(hinge) && hinge >= 0 && hinge <= 180) state.hinge = hinge;
  const unit = params.get("unit");
  if (unit === "dp" || unit === "px") state.units = unit;
  const app = params.get("app");
  if (app === "ignored" || app === "applied") state.appPreview = app;
  return state;
}

/** Returns `search` with the view keys rewritten; unrelated parameters are kept. */
export function serializeViewState(search: string, state: ViewState, defaults: ViewState): string {
  const params = new URLSearchParams(search);
  for (const key of KEYS) params.delete(key);
  if (state.navMode !== defaults.navMode) params.set("nav", state.navMode === "gesture" ? "gesture" : "3-button");
  if (state.rotation !== defaults.rotation) params.set("rotate", String((state.rotation + 360) % 360));
  if (state.hinge !== defaults.hinge) params.set("hinge", String(state.hinge));
  if (state.units !== defaults.units) params.set("unit", state.units);
  if (state.appPreview !== defaults.appPreview) params.set("app", state.appPreview);
  const query = params.toString();
  return query ? `?${query}` : "";
}
