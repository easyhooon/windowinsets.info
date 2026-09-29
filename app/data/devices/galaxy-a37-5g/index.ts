import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A37 5G display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A376NLVAKOD/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch, 1080×2340 FHD+ display; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A37 5G (SM-A376N), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a37-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => {
  if (mode === "gesture") return {
      systemBars: { top: 35.91, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 101, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 32.71, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.91111, yDp: 8.53333, widthDp: 24.17778, heightDp: 24.17778, rightDp: 179.91111, bottomDp: 799.28889, xPx: 506, yPx: 24, widthPx: 68, heightPx: 68, rightPx: 506, bottomPx: 2248 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A37 5G (SM-A376N), build BP4A.251205.006.A376NKSS2AZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    };
  if (mode === "threeButton") return {
      systemBars: { top: 35.91, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 101, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 32.71, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.91, yDp: 8.53, widthDp: 24.18, heightDp: 24.18, rightDp: 179.91, bottomDp: 799.29, xPx: 506, yPx: 24, widthPx: 68, heightPx: 68, rightPx: 506, bottomPx: 2248 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A37 5G (SM-A376N), build BP4A.251205.006.A376NKSS2AZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe; recapture supersedes the earlier 1 px navigation inset." },
      sources: [captureSource("threeButton")],
    };
  return null;
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeValues = {
  "1-gesture": {
    systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
    systemBarsPx: { top: 84, right: 0, bottom: 42, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 32.71 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 92 },
    cutoutShape: { xDp: 8.53, yDp: 179.91, widthDp: 24.18, heightDp: 24.18, rightDp: 799.29, bottomDp: 179.91, xPx: 24, yPx: 506, widthPx: 68, heightPx: 68, rightPx: 2248, bottomPx: 506 },
  },
  "1-threeButton": {
    systemBars: { top: 29.87, right: 48, bottom: 0, left: 0 },
    systemBarsPx: { top: 84, right: 135, bottom: 0, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 32.71 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 92 },
    cutoutShape: { xDp: 8.53, yDp: 179.91, widthDp: 24.18, heightDp: 24.18, rightDp: 799.29, bottomDp: 179.91, xPx: 24, yPx: 506, widthPx: 68, heightPx: 68, rightPx: 2248, bottomPx: 506 },
  },
  "3-gesture": {
    systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
    systemBarsPx: { top: 84, right: 0, bottom: 42, left: 0 },
    displayCutout: { top: 0, right: 32.71, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 92, bottom: 0, left: 0 },
    cutoutShape: { xDp: 799.29, yDp: 179.91, widthDp: 24.18, heightDp: 24.18, rightDp: 8.53, bottomDp: 179.91, xPx: 2248, yPx: 506, widthPx: 68, heightPx: 68, rightPx: 24, bottomPx: 506 },
  },
  "3-threeButton": {
    systemBars: { top: 29.87, right: 0, bottom: 0, left: 48 },
    systemBarsPx: { top: 84, right: 0, bottom: 0, left: 135 },
    displayCutout: { top: 0, right: 32.71, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 92, bottom: 0, left: 0 },
    cutoutShape: { xDp: 799.29, yDp: 179.91, widthDp: 24.18, heightDp: 24.18, rightDp: 8.53, bottomDp: 179.91, xPx: 2248, yPx: 506, widthPx: 68, heightPx: 68, rightPx: 24, bottomPx: 506 },
  },
} as const;

const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  ...landscapeValues[`${rotation}-${mode}`],
  condition: {
    oneUi: "8.5",
    android: "16",
    note: `Samsung RTL Korea/Gumi, SM-A376N_KR2, build BP4A.251205.006.A376NKSS2AZG1. Landscape rotation ${rotation}, 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
  },
  sources: [{
    kind: "measured",
    label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy A37 5G, rotation ${rotation}, ${mode} (SM-A376N)`,
    url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a37-5g/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
    retrievedAt: "2026-09-29",
  }],
});

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyA37: Device = {
  slug: "galaxy-a37-5g",
  name: "Galaxy A37 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 386,
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
