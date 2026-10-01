// Three.js-free fold constants and math, so DeviceView can use them without
// pulling the lazily loaded 3D renderer into the initial bundle.

export const FOLD_CAMERA_FOV = 32;
export const FOLD_CAMERA_DISTANCE = 11;
/** Frustum height at the z=0 display plane shared by every fold pose, in world units per 700 px canvas. */
export const FOLD_FRUSTUM_HEIGHT = 2 * Math.tan(FOLD_CAMERA_FOV / 2 * Math.PI / 180) * FOLD_CAMERA_DISTANCE;
/** World size of the inner display's longer padded edge. */
export const FOLD_DISPLAY_TARGET = 5.2;

export const COVER_REVEAL_ANGLE = 60; // Illustrative primary surface, not a measured hinge state.
/** TriFold turns over the same span but faces its rear cover only past the half turn. */
export function coverRevealAngle(triFold: boolean) {
  return triFold ? COVER_REVEAL_ANGLE / 2 : COVER_REVEAL_ANGLE;
}

/** Canvas px per inner-display dp at 100% canvas scale. */
export function foldCanvasPxPerDp(widthDp: number, heightDp: number) {
  const margin = widthDp * .25;
  return FOLD_DISPLAY_TARGET / Math.max(widthDp + margin, heightDp + margin) * 700 / FOLD_FRUSTUM_HEIGHT;
}

/** One coordinated sequence: close the left wing first, then the right wing.
 * The control is a sequence position, not a measured Android hinge angle. */
export function triFoldAngles(sequence: number) {
  return { left: Math.max(0, Math.min(180, sequence * 2 - 180)),
    right: Math.max(0, Math.min(180, sequence * 2)) };
}

/** Face the inner display while both wings fold so each bend stays visible,
 * then turn to the middle panel's rear cover only as the right wing closes. */
export function triFoldViewTurn(sequence: number, revealEnd: number) {
  const reveal = Math.max(0, 1 - sequence / revealEnd);
  return reveal * reveal * (3 - 2 * reveal) * Math.PI;
}
