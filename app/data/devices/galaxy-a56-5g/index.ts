import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A56 5G display specifications",
  url: "https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a56-5g-awesome-graphite-256gb-sm-a566bzkceub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch, 1080×2340 FHD+ display; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A56 5G (SM-A566B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a56-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => {
  if (mode === "gesture") return {
      systemBars: { top: 32.71, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 92, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 32.71, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.55556, yDp: 0.00000, widthDp: 24.88889, heightDp: 32.71111, rightDp: 179.55556, bottomDp: 799.28889, xPx: 505, yPx: 0, widthPx: 70, heightPx: 92, rightPx: 505, bottomPx: 2248 },
      condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, Galaxy A56 5G (SM-A566B), build AP3A.240905.015.A2.A566BXXS4AYE6. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    };
  if (mode === "threeButton") return {
      systemBars: { top: 32.71, right: 0, bottom: 48.00, left: 0 },
      systemBarsPx: { top: 92, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 32.71, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.55556, yDp: 0.00000, widthDp: 24.88889, heightDp: 32.71111, rightDp: 179.55556, bottomDp: 799.28889, xPx: 505, yPx: 0, widthPx: 70, heightPx: 92, rightPx: 505, bottomPx: 2248 },
      condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, Galaxy A56 5G (SM-A566B), build AP3A.240905.015.A2.A566BXXS4AYE6. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };
  return null;
};

export const galaxyA56: Device = {
  slug: "galaxy-a56-5g",
  name: "Galaxy A56 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2025,
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
    cornerRadiiDp: { topLeft: 41.96, topRight: 41.96, bottomRight: 41.96, bottomLeft: 41.96 },
    cornerRadiiPx: { topLeft: 118, topRight: 118, bottomRight: 118, bottomLeft: 118 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
