import type { Device, InsetsMeasurement, Source } from "../../types";

const specs: Source = {
  kind: "official",
  label: "Samsung Galaxy S26+ Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s26/specs/",
  retrievedAt: "2026-09-23",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.2.1 on Samsung RTL Galaxy S26+ (SM-S947N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s26-plus/main-${mode}.json`,
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
    note: "Samsung RTL Korea/Gumi, SM-S947N_KR1, build BP4A.251205.006.S947NKSS4AZG5. Portrait rotation 0, FHD+ screen resolution, 450 dpi and font scale 1. Physical panel is 1440×3120 px; captured app window is 1080×2340 px. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 29.87, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 84, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 36.98, bottom: 0, left: left ? 36.98 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 104, bottom: 0, left: left ? 104 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 795.02, yDp: 181.33, widthDp: 36.98, heightDp: 21.33, rightDp: left ? 795.02 : 0, bottomDp: 181.33,
      xPx: left ? 0 : 2236, yPx: 510, widthPx: 104, heightPx: 60, rightPx: left ? 2236 : 0, bottomPx: 510,
    },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S947N_KR2, build BP4A.251205.006.S947NKSS4AZG5. Landscape rotation ${rotation}, FHD+ 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S26+, rotation ${rotation}, ${mode} (SM-S947N)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s26-plus/recapture-2026-09-28-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-28",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS26Plus: Device = {
  slug: "galaxy-s26-plus",
  name: "Galaxy S26+",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1440, height: 3120 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 0,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 29.16, topRight: 29.16, bottomRight: 29.16, bottomLeft: 29.16 },
    cornerRadiiPx: { topLeft: 82, topRight: 82, bottomRight: 82, bottomLeft: 82 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [specs, gestureSource, buttonSource],
  }],
  sources: [specs, gestureSource, buttonSource],
};
