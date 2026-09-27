import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung UK Business: Galaxy A54 5G specifications",
  url: "https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a54-5g-green-256gb-sm-a546blgdeub/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 163.1 mm (6.4-inch), 1080×2340 FHD+ main display; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.5.0 on Samsung RTL Galaxy A54 5G (SM-A546B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a54-5g/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL Vietnam (Hanoi), SM-A546B, build BP2A.250605.031.A3.A546BXXSJEZE5. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1.15. Rotation 1 and 3 captures are kept beside the portrait files as evidence.";

const cutoutShape = { xDp: 181.69, yDp: 0, widthDp: 20.62, heightDp: 28.44, rightDp: 181.69, bottomDp: 803.56, xPx: 511, yPx: 0, widthPx: 58, heightPx: 80, rightPx: 511, bottomPx: 2260 };

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 28.44, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape,
  condition: {
    oneUi: "8.0",
    android: "16",
    note: `${base} Android setting, configuration and InsetsProbe navigation classification agree on ${mode === "gesture" ? "gesture" : "3-button"} mode.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyA54: Device = {
  slug: "galaxy-a54-5g",
  name: "Galaxy A54 5G",
  brand: "Samsung",
  series: "Galaxy A",
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
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
