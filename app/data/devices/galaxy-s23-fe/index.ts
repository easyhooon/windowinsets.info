import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S23 FE display specifications",
  url: "https://www.samsung.com/mx/smartphones/galaxy-s/galaxy-s23-fe-cream-128gb-sm-s711bzwlltm/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.4-inch display and 2340×1080 px resolution; PPI is calculated from those values.",
};

const capture = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S23 FE (SM-S711BE-VN3), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s23-fe/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
});

const gestureSource = capture(0, "gesture");
const buttonSource = capture(0, "threeButton");

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 34.49 : 29.87, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 14.93, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 97 : 84, right: !portrait && left && button ? 135 : 0, bottom: button ? (portrait ? 135 : 0) : 42, left: !portrait && !left && button ? 135 : 0 },
    displayCutout: { top: portrait ? 29.16 : 0, right: !portrait && !left ? 29.16 : 0, bottom: 0, left: !portrait && left ? 29.16 : 0 },
    displayCutoutPx: { top: portrait ? 82 : 0, right: !portrait && !left ? 82 : 0, bottom: 0, left: !portrait && left ? 82 : 0 },
    cutoutShape: portrait
      ? { xDp: 181.69, yDp: 8.53, widthDp: 20.62, heightDp: 20.62, rightDp: 181.69, bottomDp: 802.84, xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258 }
      : left
        ? { xDp: 8.53, yDp: 181.69, widthDp: 20.62, heightDp: 20.62, rightDp: 802.84, bottomDp: 181.69, xPx: 24, yPx: 511, widthPx: 58, heightPx: 58, rightPx: 2258, bottomPx: 511 }
        : { xDp: 802.84, yDp: 181.69, widthDp: 20.62, heightDp: 20.62, rightDp: 8.53, bottomDp: 181.69, xPx: 2258, yPx: 511, widthPx: 58, heightPx: 58, rightPx: 24, bottomPx: 511 },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Vietnam/Hanoi, SM-S711BE-VN3, build BP4A.251205.006.S711BXXSIGZH9. Rotation ${rotation}, ${portrait ? "1080×2340" : "2340×1080"} px full-screen window, 450 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [capture(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS23Fe: Device = {
  slug: "galaxy-s23-fe",
  name: "Galaxy S23 FE",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.4,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 403,
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
