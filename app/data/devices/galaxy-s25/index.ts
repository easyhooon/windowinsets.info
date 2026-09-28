import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s25/specs/",
  retrievedAt: "2026-09-24",
  note: "PPI calculated from Samsung's listed 156.4 mm display diagonal and 1080×2340 resolution.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S25 (SM-S931N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s25/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 34.33, right: 0, bottom: mode === "gesture" ? 15 : 48, left: 0 },
  systemBarsPx: { top: 103, right: 0, bottom: mode === "gesture" ? 45 : 144, left: 0 },
  displayCutout: { top: 34.33, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 103, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 170.33, yDp: 0, widthDp: 19.33, heightDp: 34.33,
    rightDp: 170.33, bottomDp: 745.67,
    xPx: 511, yPx: 0, widthPx: 58, heightPx: 103, rightPx: 511, bottomPx: 2237,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S931N_KR1, build BP4A.251205.006.S931NKSSBCZG3. Portrait rotation 0, FHD+ screen resolution, default 480 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 30, right: button && left ? 48 : 0, bottom: button ? 0 : 15, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 90, right: button && left ? 144 : 0, bottom: button ? 0 : 45, left: button && !left ? 144 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 34.33, bottom: 0, left: left ? 34.33 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 103, bottom: 0, left: left ? 103 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 745.67, yDp: 170.33, widthDp: 34.33, heightDp: 19.33, rightDp: left ? 745.67 : 0, bottomDp: 170.33,
      xPx: left ? 0 : 2237, yPx: 511, widthPx: 103, heightPx: 58, rightPx: left ? 2237 : 0, bottomPx: 511,
    },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S931N_KR1, build BP4A.251205.006.S931NKSSBCZG3. Landscape rotation ${rotation}, 2340×1080 px window at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S25, rotation ${rotation}, ${mode} (SM-S931N)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s25/recapture-2026-09-28-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-28",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 780, height: 360 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS25: Device = {
  slug: "galaxy-s25",
  name: "Galaxy S25",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.2,
      resolutionPx: { width: 1080, height: 2340 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 419,
      logicalSizeDp: { width: 360, height: 780 },
      densityDpi: 480,
      cornerRadiiDp: { topLeft: 34, topRight: 34, bottomRight: 34, bottomLeft: 34 },
      cornerRadiiPx: { topLeft: 102, topRight: 102, bottomRight: 102, bottomLeft: 102 },
      insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
      rotations: { 1: landscape(1), 3: landscape(3) },
      sources: [samsungSpecs, gestureSource, buttonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
