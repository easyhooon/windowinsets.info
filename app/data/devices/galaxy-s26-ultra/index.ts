import type { Device, InsetsMeasurement, Source } from "../../types";

const specs: Source = {
  kind: "official",
  label: "Samsung Galaxy S26 Ultra Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s26-ultra/specs/",
  retrievedAt: "2026-09-23",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.2.1 on Samsung RTL Galaxy S26 Ultra, ${mode} (SM-S948U)`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s26-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-23",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 37.33, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 105, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 36.98, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 104, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 181.33, yDp: 0, widthDp: 21.33, heightDp: 36.98,
    rightDp: 181.33, bottomDp: 795.02,
    xPx: 510, yPx: 0, widthPx: 60, heightPx: 104, rightPx: 510, bottomPx: 2236,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S948U_KR3, build BP4A.251205.006.S948USQS4AZG3. Portrait rotation 0, default FHD+ screen resolution, 450 dpi and font scale 1. Physical panel is 1440×3120 px; captured app window is 1080×2340 px. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 29.87, right: mode === "threeButton" && rotation === 1 ? 48 : 0, bottom: mode === "gesture" ? 14.93 : 0, left: mode === "threeButton" && rotation === 3 ? 48 : 0 },
  systemBarsPx: { top: 84, right: mode === "threeButton" && rotation === 1 ? 135 : 0, bottom: mode === "gesture" ? 42 : 0, left: mode === "threeButton" && rotation === 3 ? 135 : 0 },
  displayCutout: { top: 0, right: rotation === 3 ? 36.98 : 0, bottom: 0, left: rotation === 1 ? 36.98 : 0 },
  displayCutoutPx: { top: 0, right: rotation === 3 ? 104 : 0, bottom: 0, left: rotation === 1 ? 104 : 0 },
  cutoutShape: {
    xDp: rotation === 1 ? 0 : 795.02, yDp: 181.33, widthDp: 36.98, heightDp: 21.33,
    rightDp: rotation === 1 ? 795.02 : 0, bottomDp: 181.33,
    xPx: rotation === 1 ? 0 : 2236, yPx: 510, widthPx: 104, heightPx: 60,
    rightPx: rotation === 1 ? 2236 : 0, bottomPx: 510,
  },
  condition: {
    oneUi: "8.5", android: "16",
    note: `Samsung RTL Korea/Gumi, SM-S948U_KR3, build BP4A.251205.006.S948USQS4AZG3. Landscape rotation ${rotation}, full-screen 2340×1080 px, 450 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0.`,
  },
  sources: [{ kind: "measured", label: `InsetsProbe 1.5.0 on Samsung RTL Galaxy S26 Ultra, landscape rotation ${rotation} ${mode} (SM-S948U)`, url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s26-ultra/recapture-2026-09-27-rotation/main-landscape-${rotation}-${mode}.json`, retrievedAt: "2026-09-27" }],
});

export const galaxyS26Ultra: Device = {
  slug: "galaxy-s26-ultra",
  name: "Galaxy S26 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.9,
    resolutionPx: { width: 1440, height: 3120 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 0,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 28.09, topRight: 28.09, bottomRight: 28.09, bottomLeft: 28.09 },
    cornerRadiiPx: { topLeft: 79, topRight: 79, bottomRight: 79, bottomLeft: 79 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: {
      1: { logicalSizePx: { width: 2340, height: 1080 }, logicalSizeDp: { width: 832, height: 384 }, insets: { gesture: landscapeInsets(1, "gesture"), threeButton: landscapeInsets(1, "threeButton") } },
      3: { logicalSizePx: { width: 2340, height: 1080 }, logicalSizeDp: { width: 832, height: 384 }, insets: { gesture: landscapeInsets(3, "gesture"), threeButton: landscapeInsets(3, "threeButton") } },
    },
    sources: [specs, gestureSource, buttonSource],
  }],
  sources: [specs, gestureSource, buttonSource],
};
