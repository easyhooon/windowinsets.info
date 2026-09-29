import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 Specifications",
  url: "https://www.samsung.com/sec/smartphones/galaxy-s24/specs/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 156.4 mm display diagonal; PPI is calculated from this diagonal and the published 2340×1080 resolution.",
};

const samsungResolution: Source = {
  kind: "official",
  label: "Samsung Galaxy S24 Product Specifications",
  url: "https://www.samsung.com/sec/support/model/SM-S921NZOFKOO/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists the 2340×1080 px FHD+ main display resolution.",
};

const capture = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S24 (SM-S921N-KR3), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s24/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
});

const gestureSource = capture(0, "gesture");
const buttonSource = capture(0, "threeButton");

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 34.33 : 30, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 15, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 103 : 90, right: !portrait && left && button ? 144 : 0, bottom: button ? (portrait ? 144 : 0) : 45, left: !portrait && !left && button ? 144 : 0 },
    displayCutout: { top: portrait ? 34.33 : 0, right: !portrait && !left ? 34.33 : 0, bottom: 0, left: !portrait && left ? 34.33 : 0 },
    displayCutoutPx: { top: portrait ? 103 : 0, right: !portrait && !left ? 103 : 0, bottom: 0, left: !portrait && left ? 103 : 0 },
    cutoutShape: portrait
      ? { xDp: 170.33, yDp: 0, widthDp: 19.33, heightDp: 34.33, rightDp: 170.33, bottomDp: 745.67, xPx: 511, yPx: 0, widthPx: 58, heightPx: 103, rightPx: 511, bottomPx: 2237 }
      : left
        ? { xDp: 0, yDp: 170.33, widthDp: 34.33, heightDp: 19.33, rightDp: 745.67, bottomDp: 170.33, xPx: 0, yPx: 511, widthPx: 103, heightPx: 58, rightPx: 2237, bottomPx: 511 }
        : { xDp: 745.67, yDp: 170.33, widthDp: 34.33, heightDp: 19.33, rightDp: 0, bottomDp: 170.33, xPx: 2237, yPx: 511, widthPx: 103, heightPx: 58, rightPx: 0, bottomPx: 511 },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S921N-KR3, build BP4A.251205.006.S921NKSSGDZG1. Rotation ${rotation}, ${portrait ? "1080×2340" : "2340×1080"} px full-screen window, 480 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [capture(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 780, height: 360 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS24: Device = {
  slug: "galaxy-s24",
  name: "Galaxy S24",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
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
    cornerRadiiDp: { topLeft: 36, topRight: 36, bottomRight: 36, bottomLeft: 36 },
    cornerRadiiPx: { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 },
    insets: { gesture: measuredInsets(0, "gesture"), threeButton: measuredInsets(0, "threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, samsungResolution, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, samsungResolution, gestureSource, buttonSource],
};
