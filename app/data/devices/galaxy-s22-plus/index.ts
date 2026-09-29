import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S22 Plus display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-s/galaxy-s22-plus-for-business-sm-s901-sm-s906bzwgeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.6-inch display and 2340×1080 px resolution; PPI is calculated from those values.",
};

const capture = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S22 Plus (SM-S906B-RU1), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s22-plus/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
  ...(rotation === 0 && mode === "threeButton"
    ? { note: "Reconstructed from the preserved RTL InsetsProbe log because the File Browser download did not complete; the log's other five captures match their downloaded files exactly." }
    : {}),
});

const gestureSource = capture(0, "gesture");
const buttonSource = capture(0, "threeButton");

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 26.31 : 24.18, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 14.93, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 74 : 68, right: !portrait && left && button ? 135 : 0, bottom: button ? (portrait ? 135 : 0) : 42, left: !portrait && !left && button ? 135 : 0 },
    displayCutout: { top: portrait ? 26.31 : 0, right: !portrait && !left ? 26.31 : 0, bottom: 0, left: !portrait && left ? 26.31 : 0 },
    displayCutoutPx: { top: portrait ? 74 : 0, right: !portrait && !left ? 74 : 0, bottom: 0, left: !portrait && left ? 74 : 0 },
    cutoutShape: portrait
      ? { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 26.31, rightDp: 182.76, bottomDp: 805.69, xPx: 514, yPx: 0, widthPx: 52, heightPx: 74, rightPx: 514, bottomPx: 2266 }
      : left
        ? { xDp: 0, yDp: 182.76, widthDp: 26.31, heightDp: 18.49, rightDp: 805.69, bottomDp: 182.76, xPx: 0, yPx: 514, widthPx: 74, heightPx: 52, rightPx: 2266, bottomPx: 514 }
        : { xDp: 805.69, yDp: 182.76, widthDp: 26.31, heightDp: 18.49, rightDp: 0, bottomDp: 182.76, xPx: 2266, yPx: 514, widthPx: 74, heightPx: 52, rightPx: 0, bottomPx: 514 },
    condition: {
      oneUi: "7.0",
      android: "15",
      note: `Samsung RTL Russia/Moscow, SM-S906B-RU1, build AP3A.240905.015.A2.S906BXXUDFYD9. Rotation ${rotation}, ${portrait ? "1080×2340" : "2340×1080"} px full-screen window, 450 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [capture(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS22Plus: Device = {
  slug: "galaxy-s22-plus",
  name: "Galaxy S22 Plus",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 390,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 35.91, topRight: 35.91, bottomRight: 35.91, bottomLeft: 35.91 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: measuredInsets(0, "gesture"), threeButton: measuredInsets(0, "threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
