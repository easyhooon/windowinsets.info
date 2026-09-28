import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S22 Ultra display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-s/galaxy-s22-ultra-for-business-sm-s908-sm-s908blbdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.8-inch display and 3088×1440 px resolution; PPI is calculated from those values.",
};

const capture = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S22 Ultra (SM-S908B-RU1), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s22-ultra/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
});

const gestureSource = capture(0, "gesture");
const buttonSource = capture(0, "threeButton");

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 26.67 : 24.18, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 14.93, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 75 : 68, right: !portrait && left && button ? 135 : 0, bottom: button ? (portrait ? 135 : 0) : 42, left: !portrait && !left && button ? 135 : 0 },
    displayCutout: { top: portrait ? 26.67 : 0, right: !portrait && !left ? 26.67 : 0, bottom: 0, left: !portrait && left ? 26.67 : 0 },
    displayCutoutPx: { top: portrait ? 75 : 0, right: !portrait && !left ? 75 : 0, bottom: 0, left: !portrait && left ? 75 : 0 },
    cutoutShape: portrait
      ? { xDp: 182.04, yDp: 0, widthDp: 19.91, heightDp: 26.67, rightDp: 182.04, bottomDp: 796.8, xPx: 512, yPx: 0, widthPx: 56, heightPx: 75, rightPx: 512, bottomPx: 2241 }
      : left
        ? { xDp: 0, yDp: 182.04, widthDp: 26.67, heightDp: 19.91, rightDp: 796.8, bottomDp: 182.04, xPx: 0, yPx: 512, widthPx: 75, heightPx: 56, rightPx: 2241, bottomPx: 512 }
        : { xDp: 796.8, yDp: 182.04, widthDp: 26.67, heightDp: 19.91, rightDp: 0, bottomDp: 182.04, xPx: 2241, yPx: 512, widthPx: 75, heightPx: 56, rightPx: 0, bottomPx: 512 },
    condition: {
      oneUi: "7.0",
      android: "15",
      note: `Samsung RTL Russia/Moscow, SM-S908B-RU1, build AP3A.240905.015.A2.S908BXXSIFYI3. Rotation ${rotation}, ${portrait ? "1080×2316" : "2316×1080"} px full-screen window (FHD+ scaled from the 1440×3088 panel), 450 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [capture(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2316, height: 1080 },
  logicalSizeDp: { width: 823.47, height: 384 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS22Ultra: Device = {
  slug: "galaxy-s22-ultra",
  name: "Galaxy S22 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3088 },
    logicalSizePx: { width: 1080, height: 2316 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 501,
    logicalSizeDp: { width: 384, height: 823.47 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 35.91, topRight: 35.91, bottomRight: 35.91, bottomLeft: 35.91 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: measuredInsets(0, "gesture"), threeButton: measuredInsets(0, "threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
