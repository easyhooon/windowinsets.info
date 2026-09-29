import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S23 Ultra (SM-S918U) specifications",
  url: "https://www.samsung.com/us/business/mobile/phones/galaxy-s/galaxy-s23-ultra-256gb-unlocked-sm-s918uzaaxaa/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 6.8-inch (173.1 mm) Dynamic AMOLED 2X display at 3088×1440 (Quad HD+); PPI is calculated from those values.",
};

const captureSource = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S23 Ultra (SM-S918U-US01), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s23-ultra/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
});

const gestureSource = captureSource(0, "gesture");
const buttonSource = captureSource(0, "threeButton");

const cutoutShape = (rotation: 0 | 1 | 3) => rotation === 0
  ? { xDp: 182.4, yDp: 0, widthDp: 19.2, heightDp: 33.42, rightDp: 182.4, bottomDp: 790.05, xPx: 513, yPx: 0, widthPx: 54, heightPx: 94, rightPx: 513, bottomPx: 2222 }
  : rotation === 1
    ? { xDp: 0, yDp: 182.4, widthDp: 33.42, heightDp: 19.2, rightDp: 790.05, bottomDp: 182.4, xPx: 0, yPx: 513, widthPx: 94, heightPx: 54, rightPx: 2222, bottomPx: 513 }
    : { xDp: 790.04, yDp: 182.4, widthDp: 33.42, heightDp: 19.2, rightDp: 0, bottomDp: 182.4, xPx: 2222, yPx: 513, widthPx: 94, heightPx: 54, rightPx: 0, bottomPx: 513 };

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 33.42 : 29.87, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 14.93, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 94 : 84, right: !portrait && left && button ? 135 : 0, bottom: button ? (portrait ? 135 : 0) : 42, left: !portrait && !left && button ? 135 : 0 },
    displayCutout: { top: portrait ? 33.42 : 0, right: !portrait && !left ? 33.42 : 0, bottom: 0, left: !portrait && left ? 33.42 : 0 },
    displayCutoutPx: { top: portrait ? 94 : 0, right: !portrait && !left ? 94 : 0, bottom: 0, left: !portrait && left ? 94 : 0 },
    cutoutShape: cutoutShape(rotation),
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL USA/TX, SM-S918U-US01, build BP4A.251205.006.S918USQS8FZG1. Rotation ${rotation}, ${portrait ? "1080×2316" : "2316×1080"} px full-screen window, 450 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [captureSource(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2316, height: 1080 },
  logicalSizeDp: { width: 823.46667, height: 384 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS23Ultra: Device = {
  slug: "galaxy-s23-ultra",
  name: "Galaxy S23 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3088 },
    logicalSizePx: { width: 1080, height: 2316 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 501,
    logicalSizeDp: { width: 384, height: 823.46667 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 3.91111, topRight: 3.91111, bottomRight: 3.91111, bottomLeft: 3.91111 },
    cornerRadiiPx: { topLeft: 11, topRight: 11, bottomRight: 11, bottomLeft: 11 },
    insets: { gesture: measuredInsets(0, "gesture"), threeButton: measuredInsets(0, "threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
