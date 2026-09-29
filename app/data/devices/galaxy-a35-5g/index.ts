import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A35 5G (SM-A356N) display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A356NLBWKOD/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 168.3 mm, 1080×2340 FHD+ main display.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A35 5G (SM-A356N), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a35-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 35.91, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 101, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 31.64, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 89, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 180.27, yDp: 8.18, widthDp: 23.47, heightDp: 23.47, rightDp: 180.27, bottomDp: 800.36, xPx: 507, yPx: 23, widthPx: 66, heightPx: 66, rightPx: 507, bottomPx: 2251 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A35 5G (SM-A356N), build BP4A.251205.006.A356NKSS9DZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 35.91, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 101, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 31.64, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 89, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 180.27, yDp: 8.18, widthDp: 23.47, heightDp: 23.47, rightDp: 180.27, bottomDp: 800.36, xPx: 507, yPx: 23, widthPx: 66, heightPx: 66, rightPx: 507, bottomPx: 2251 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A35 5G (SM-A356N), build BP4A.251205.006.A356NKSS9DZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeValues = {
  "1-gesture": {
    systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
    systemBarsPx: { top: 84, right: 0, bottom: 42, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 31.64 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 89 },
    cutoutShape: { xDp: 8.18, yDp: 180.27, widthDp: 23.47, heightDp: 23.47, rightDp: 800.36, bottomDp: 180.27, xPx: 23, yPx: 507, widthPx: 66, heightPx: 66, rightPx: 2251, bottomPx: 507 },
  },
  "1-threeButton": {
    systemBars: { top: 29.87, right: 48, bottom: 0, left: 0 },
    systemBarsPx: { top: 84, right: 135, bottom: 0, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 31.64 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 89 },
    cutoutShape: { xDp: 8.18, yDp: 180.27, widthDp: 23.47, heightDp: 23.47, rightDp: 800.36, bottomDp: 180.27, xPx: 23, yPx: 507, widthPx: 66, heightPx: 66, rightPx: 2251, bottomPx: 507 },
  },
  "3-gesture": {
    systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
    systemBarsPx: { top: 84, right: 0, bottom: 42, left: 0 },
    displayCutout: { top: 0, right: 31.64, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 89, bottom: 0, left: 0 },
    cutoutShape: { xDp: 800.36, yDp: 180.27, widthDp: 23.47, heightDp: 23.47, rightDp: 8.18, bottomDp: 180.27, xPx: 2251, yPx: 507, widthPx: 66, heightPx: 66, rightPx: 23, bottomPx: 507 },
  },
  "3-threeButton": {
    systemBars: { top: 29.87, right: 0, bottom: 0, left: 48 },
    systemBarsPx: { top: 84, right: 0, bottom: 0, left: 135 },
    displayCutout: { top: 0, right: 31.64, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 89, bottom: 0, left: 0 },
    cutoutShape: { xDp: 800.36, yDp: 180.27, widthDp: 23.47, heightDp: 23.47, rightDp: 8.18, bottomDp: 180.27, xPx: 2251, yPx: 507, widthPx: 66, heightPx: 66, rightPx: 23, bottomPx: 507 },
  },
} as const;

const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  ...landscapeValues[`${rotation}-${mode}`],
  condition: {
    oneUi: "8.5",
    android: "16",
    note: `Samsung RTL Korea/Gumi, SM-A356N_KR4, build BP4A.251205.006.A356NKSS9DZG1. Landscape rotation ${rotation}, 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
  },
  sources: [{
    kind: "measured",
    label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy A35 5G, rotation ${rotation}, ${mode} (SM-A356N)`,
    url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a35-5g/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
    retrievedAt: "2026-09-29",
  }],
});

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyA35: Device = {
  slug: "galaxy-a35-5g",
  name: "Galaxy A35 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 389,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
    cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
