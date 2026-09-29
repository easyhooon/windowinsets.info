import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 FE Specifications",
  url: "https://www.samsung.com/sec/support/model/SM-S721NZKWKOD/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 170.1 mm (6.7-inch) display diagonal and 1080×2340 resolution; PPI is calculated from those values.",
};

const capture = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S24 FE (SM-S721N-KR4), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s24-fe/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
});

const gestureSource = capture(0, "gesture");
const buttonSource = capture(0, "threeButton");

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 32.71 : 29.87, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 14.93, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 92 : 84, right: !portrait && left && button ? 135 : 0, bottom: button ? (portrait ? 135 : 0) : 42, left: !portrait && !left && button ? 135 : 0 },
    displayCutout: { top: portrait ? 32.71 : 0, right: !portrait && !left ? 32.71 : 0, bottom: 0, left: !portrait && left ? 32.71 : 0 },
    displayCutoutPx: { top: portrait ? 92 : 0, right: !portrait && !left ? 92 : 0, bottom: 0, left: !portrait && left ? 92 : 0 },
    cutoutShape: portrait
      ? { xDp: 179.91, yDp: 8.53, widthDp: 24.18, heightDp: 24.18, rightDp: 179.91, bottomDp: 799.29, xPx: 506, yPx: 24, widthPx: 68, heightPx: 68, rightPx: 506, bottomPx: 2248 }
      : left
        ? { xDp: 8.53, yDp: 179.91, widthDp: 24.18, heightDp: 24.18, rightDp: 799.29, bottomDp: 179.91, xPx: 24, yPx: 506, widthPx: 68, heightPx: 68, rightPx: 2248, bottomPx: 506 }
        : { xDp: 799.29, yDp: 179.91, widthDp: 24.18, heightDp: 24.18, rightDp: 8.53, bottomDp: 179.91, xPx: 2248, yPx: 506, widthPx: 68, heightPx: 68, rightPx: 24, bottomPx: 506 },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S721N_KR4, build BP4A.251205.006.S721NKSSDDZG3. Rotation ${rotation}, ${portrait ? "1080×2340" : "2340×1080"} px full-screen window, 450 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [capture(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS24Fe: Device = {
  slug: "galaxy-s24-fe",
  name: "Galaxy S24 FE",
  brand: "Samsung",
  series: "Galaxy S24",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 385,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
    cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
    insets: { gesture: measuredInsets(0, "gesture"), threeButton: measuredInsets(0, "threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
