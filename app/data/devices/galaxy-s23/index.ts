import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung US support: Comparison of the Galaxy S23 models",
  url: "https://www.samsung.com/us/support/answer/ANS10003682/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 6.1-inch screen for Galaxy S23. The 2340×1080 resolution is the full-screen capture size; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S23 (SM-S911U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s23/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-S911U, build TP1A.220624.014.S911USQS2AWIF. Portrait rotation 0, 1080×2340 px full-screen capture, 480 dpi, font scale 1.";

const cutoutShape = { xDp: 170.66667, yDp: 0, widthDp: 18.66667, heightDp: 27, rightDp: 170.66667, bottomDp: 753, xPx: 512, yPx: 0, widthPx: 56, heightPx: 81, rightPx: 512, bottomPx: 2259 };

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 27, right: 0, bottom: mode === "gesture" ? 15 : 48, left: 0 },
  systemBarsPx: { top: 81, right: 0, bottom: mode === "gesture" ? 45 : 144, left: 0 },
  displayCutout: { top: 27, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 81, right: 0, bottom: 0, left: 0 },
  cutoutShape,
  condition: {
    oneUi: "5.1",
    android: "13",
    note: `${base} Android setting, configuration and InsetsProbe navigation classification agree on ${mode === "gesture" ? "gesture" : "3-button"} mode.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyS23: Device = {
  slug: "galaxy-s23",
  name: "Galaxy S23",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.1,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 422,
    logicalSizeDp: { width: 360, height: 780 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 34, topRight: 34, bottomRight: 34, bottomLeft: 34 },
    cornerRadiiPx: { topLeft: 102, topRight: 102, bottomRight: 102, bottomLeft: 102 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
