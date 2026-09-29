import type { Device, InsetsMeasurement, Source } from "../../types";

const lteSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A15 LTE display specifications",
  url: "https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a15-blue-128gb-sm-a155fzbdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 163.9 mm (6.5-inch), 1080×2340 FHD+ display for Galaxy A15 LTE (SM-A155F).",
};

const fiveGSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A15 5G display specifications",
  url: "https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a15-5g-blue-black-128gb-sm-a156bzkdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists the same 163.9 mm (6.5-inch), 1080×2340 FHD+ display geometry for A15 5G, matching the LTE model and available skin.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A15 LTE (SM-A155F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a15-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 28.44, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 80, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.82, yDp: 0, widthDp: 48.36, heightDp: 28.44, rightDp: 167.82, bottomDp: 803.56, xPx: 472, yPx: 0, widthPx: 136, heightPx: 80, rightPx: 472, bottomPx: 2260 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A15 LTE (SM-A155F), build UP1A.231005.007.A155FXXS6BYE1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The available official skin is A15 5G; Samsung lists both LTE and 5G displays as 163.9 mm, 1080×2340 FHD+." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 28.44, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 80, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.82, yDp: 0, widthDp: 48.36, heightDp: 28.44, rightDp: 167.82, bottomDp: 803.56, xPx: 472, yPx: 0, widthPx: 136, heightPx: 80, rightPx: 472, bottomPx: 2260 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A15 LTE (SM-A155F), build UP1A.231005.007.A155FXXS6BYE1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The available official skin is A15 5G; Samsung lists both LTE and 5G displays as 163.9 mm, 1080×2340 FHD+." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA15: Device = {
  slug: "galaxy-a15-5g",
  name: "Galaxy A15",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 399,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [lteSpecs, fiveGSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [lteSpecs, fiveGSpecs, captureSource("gesture"), captureSource("threeButton")],
};
