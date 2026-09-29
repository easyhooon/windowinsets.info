import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A05 display specifications",
  url: "https://www.samsung.com/ph/smartphones/galaxy-a/galaxy-a05-black-128gb-sm-a055fzkgphl/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists the 6.7-inch, 720×1600 HD+ display. PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A05 (SM-A055F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a05/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 31.47, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 59, right: 0, bottom: 28, left: 0 },
      displayCutout: { top: 31.47, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 59, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 42.67, heightDp: 31.47, rightDp: 170.67, bottomDp: 821.87, xPx: 320, yPx: 0, widthPx: 80, heightPx: 59, rightPx: 320, bottomPx: 1541 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A05 (SM-A055F), build UP1A.231005.007.A055FXXS8CYC3. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 31.47, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 59, right: 0, bottom: 90, left: 0 },
      displayCutout: { top: 31.47, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 59, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 42.67, heightDp: 31.47, rightDp: 170.67, bottomDp: 821.87, xPx: 320, yPx: 0, widthPx: 80, heightPx: 59, rightPx: 320, bottomPx: 1541 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A05 (SM-A055F), build UP1A.231005.007.A055FXXS8CYC3. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA05: Device = {
  slug: "galaxy-a05",
  name: "Galaxy A05",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 720, height: 1600 },
    logicalSizePx: { width: 720, height: 1600 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 260,
    logicalSizeDp: { width: 384, height: 853 },
    densityDpi: 300,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
