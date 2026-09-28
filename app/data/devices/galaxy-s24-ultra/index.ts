import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 Ultra Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s24-ultra/specs/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 172.5 mm display diagonal and 1440×3120 resolution; PPI is calculated from those values.",
};

const capture = (mode: "gesture" | "threeButton", rotation = 0): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S24 Ultra (SM-S928N-KR3), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s24-ultra/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 34.49, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 97, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 183.11, yDp: 0, widthDp: 18.13, heightDp: 34.13, rightDp: 182.76, bottomDp: 797.87, xPx: 515, yPx: 0, widthPx: 51, heightPx: 96, rightPx: 514, bottomPx: 2244 },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S928N-KR3, build BP4A.251205.006.S928NKSS6DZG1. Portrait rotation 0, FHD+ 1080×2340 px window on display 0, 450 dpi and font scale 1. The Android navigation setting and configuration agree.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 29.87, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 84, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 34.13, bottom: 0, left: left ? 34.13 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 96, bottom: 0, left: left ? 96 : 0 },
    cutoutShape: left
      ? { xDp: 0, yDp: 182.76, widthDp: 34.13, heightDp: 18.13, rightDp: 797.87, bottomDp: 183.11, xPx: 0, yPx: 514, widthPx: 96, heightPx: 51, rightPx: 2244, bottomPx: 515 }
      : { xDp: 797.87, yDp: 183.11, widthDp: 34.13, heightDp: 18.13, rightDp: 0, bottomDp: 182.76, xPx: 2244, yPx: 515, widthPx: 96, heightPx: 51, rightPx: 0, bottomPx: 514 },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S928N-KR3, build BP4A.251205.006.S928NKSS6DZG1. Landscape rotation ${rotation}, FHD+ 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [capture(mode, rotation)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS24Ultra: Device = {
  slug: "galaxy-s24-ultra",
  name: "Galaxy S24 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3120 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 506,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 2.13, topRight: 2.13, bottomRight: 2.13, bottomLeft: 2.13 },
    cornerRadiiPx: { topLeft: 6, topRight: 6, bottomRight: 6, bottomLeft: 6 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
