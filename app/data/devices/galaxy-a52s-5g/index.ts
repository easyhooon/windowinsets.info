import type { Device, InsetsMeasurement, Source } from "../../types";

const specifications: Source = {
  kind: "official",
  label: "Samsung Galaxy A52s 5G specifications",
  url: "https://www.samsung.com/pt/smartphones/galaxy-a/galaxy-a52s-5g-awesome-white-256gb-sm-a528bzwheub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 1080×2400 display and 159.9×75.1×8.4 mm body, matching the Galaxy A52 emulator skin geometry.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A52s 5G (SM-A528B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a52s-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 31.29, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 88, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 31.29, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 88, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 182.04, yDp: 0, widthDp: 19.91, heightDp: 31.29, rightDp: 182.04, bottomDp: 822.04, xPx: 512, yPx: 0, widthPx: 56, heightPx: 88, rightPx: 512, bottomPx: 2312 },
  condition: { oneUi: "6.1", android: "14", note: `Samsung RTL, Galaxy A52s 5G (SM-A528B), build UP1A.231005.007.A528BXXSAGYA2. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1.1. ${mode === "gesture" ? "Gesture" : "3-button"} mode agrees with Android Settings and InsetsProbe.` },
  sources: [captureSource(mode)],
});

export const galaxyA52s: Device = {
  slug: "galaxy-a52s-5g",
  name: "Galaxy A52s 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 405,
    logicalSizeDp: { width: 384, height: 853.33 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
};
