import type { Device, InsetsMeasurement, Source } from "../../types";

const specifications: Source = {
  kind: "official",
  label: "Samsung Galaxy A24 display specifications",
  url: "https://www.samsung.com/vn/smartphones/galaxy-a/galaxy-a24-dark-red-128gb-sm-a245fdrdxxv/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.5-inch, 1080×2340 FHD+ main display.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A24 (SM-A245F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a24/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 27.38, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 77, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 27.38, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 77, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 169.6, yDp: 0, widthDp: 44.8, heightDp: 27.38, rightDp: 169.6, bottomDp: 804.62, xPx: 477, yPx: 0, widthPx: 126, heightPx: 77, rightPx: 477, bottomPx: 2263 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A24 (SM-A245F), build TP1A.220624.014.A245FXXU2AWE6. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. ${mode === "gesture" ? "Gesture" : "3-button"} mode agrees with Android Settings and InsetsProbe.` },
  sources: [captureSource(mode)],
});

const cornerRadii = { topLeft: 32, topRight: 32, bottomRight: 32, bottomLeft: 32 };
const cornerRadiiPx = { topLeft: 90, topRight: 90, bottomRight: 90, bottomLeft: 90 };

export const galaxyA24: Device = {
  slug: "galaxy-a24",
  name: "Galaxy A24",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 396,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: cornerRadii,
    cornerRadiiPx,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
};
