import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S23+ (SM-S916U) specifications",
  url: "https://www.samsung.com/us/business/mobile/phones/galaxy-s/galaxy-s23-plus-256gb-unlocked-sm-s916uzeaxaa/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 6.6-inch Dynamic AMOLED 2X display at 2340×1080 (FHD+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S23+ (SM-S916U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s23-plus/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-S916U, build BP2A.250605.031.A3.S916USQS6EYK3. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1.";

const cutoutShape = { xDp: 182.75556, yDp: 0, widthDp: 18.48889, heightDp: 26.31111, rightDp: 182.75556, bottomDp: 805.68889, xPx: 514, yPx: 0, widthPx: 52, heightPx: 74, rightPx: 514, bottomPx: 2266 };

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 26.31111, right: 0, bottom: mode === "gesture" ? 14.93333 : 48, left: 0 },
  systemBarsPx: { top: 74, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 26.31111, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 74, right: 0, bottom: 0, left: 0 },
  cutoutShape,
  condition: {
    oneUi: "8.0",
    android: "16",
    note: `${base} Android setting, configuration and InsetsProbe navigation classification agree on ${mode === "gesture" ? "gesture" : "3-button"} mode.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyS23Plus: Device = {
  slug: "galaxy-s23-plus",
  name: "Galaxy S23+",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
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
    cornerRadiiDp: { topLeft: 35.91111, topRight: 35.91111, bottomRight: 35.91111, bottomLeft: 35.91111 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
