import type { Device, InsetsMeasurement, Source } from "../../types";

const specifications: Source = {
  kind: "official",
  label: "Samsung Galaxy A23 display and chassis specifications",
  url: "https://www.samsung.com/sa_en/business/smartphones/galaxy-a/galaxy-a23-sm-a235fzovmea/",
  retrievedAt: "2026-09-25",
  note: "The measured LTE model (SM-A235F) has a 1080×2408 display and 165.4×76.9×8.4 mm body, matching the registered Galaxy A23 5G skin geometry.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A23 LTE (SM-A235F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a23-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 23.47, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 66, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 23.47, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 66, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 23.47, rightDp: 166.4, bottomDp: 832.71, xPx: 468, yPx: 0, widthPx: 144, heightPx: 66, rightPx: 468, bottomPx: 2342 },
  condition: { oneUi: "6.1", android: "14", note: `Samsung RTL, Galaxy A23 LTE (SM-A235F), build UP1A.231005.007.A235FXXSDEYL2. Portrait rotation 0, 1080×2408 px full-screen capture, 450 dpi, font scale 1. ${mode === "gesture" ? "Gesture" : "3-button"} mode agrees with Android Settings and InsetsProbe. Published under the A23 5G skin because Samsung's LTE and 5G specifications match in display resolution and chassis dimensions.` },
  sources: [captureSource(mode)],
});

export const galaxyA23: Device = {
  slug: "galaxy-a23-5g",
  name: "Galaxy A23 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2408 },
    logicalSizePx: { width: 1080, height: 2408 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 400,
    logicalSizeDp: { width: 384, height: 856.18 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
};
