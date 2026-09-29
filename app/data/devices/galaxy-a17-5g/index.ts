import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A17 display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A175NZAAKOD/",
  retrievedAt: "2026-09-25",
  note: "The RTL unit SM-A175N is Galaxy A17 LTE, not the 5G variant. Samsung lists the LTE display as 169.1 mm, 1080×2340 FHD+; the available official emulator artwork is the A17 5G skin with the same screen rectangle.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A17 (SM-A175N), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a17-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => {
  if (mode === "gesture") return {
      systemBars: { top: 35.56, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 100, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 35.56, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 100, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.11111, yDp: 0.00000, widthDp: 49.77778, heightDp: 35.55556, rightDp: 167.11111, bottomDp: 796.44444, xPx: 470, yPx: 0, widthPx: 140, heightPx: 100, rightPx: 470, bottomPx: 2240 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A17 (SM-A175N), build BP4A.251205.006.A175NKSS6CZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The RTL unit SM-A175N is Galaxy A17 LTE, not the 5G variant. Samsung lists the LTE display as 169.1 mm, 1080×2340 FHD+; the available official emulator artwork is the A17 5G skin with the same screen rectangle." },
      sources: [captureSource("gesture")],
    };
  if (mode === "threeButton") return {
      systemBars: { top: 35.56, right: 0, bottom: 48.00, left: 0 },
      systemBarsPx: { top: 100, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 35.56, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 100, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.11111, yDp: 0.00000, widthDp: 49.77778, heightDp: 35.55556, rightDp: 167.11111, bottomDp: 796.44444, xPx: 470, yPx: 0, widthPx: 140, heightPx: 100, rightPx: 470, bottomPx: 2240 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A17 (SM-A175N), build BP4A.251205.006.A175NKSS6CZG1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The RTL unit SM-A175N is Galaxy A17 LTE, not the 5G variant. Samsung lists the LTE display as 169.1 mm, 1080×2340 FHD+; the available official emulator artwork is the A17 5G skin with the same screen rectangle." },
      sources: [captureSource("threeButton")],
    };
  return null;
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeValues = {
  "1-gesture": {
    systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
    systemBarsPx: { top: 84, right: 0, bottom: 42, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 35.56 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 100 },
    cutoutShape: { xDp: 0, yDp: 167.11, widthDp: 35.56, heightDp: 49.78, rightDp: 796.44, bottomDp: 167.11, xPx: 0, yPx: 470, widthPx: 100, heightPx: 140, rightPx: 2240, bottomPx: 470 },
  },
  "1-threeButton": {
    systemBars: { top: 29.87, right: 48, bottom: 0, left: 0 },
    systemBarsPx: { top: 84, right: 135, bottom: 0, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 35.56 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 100 },
    cutoutShape: { xDp: 0, yDp: 167.11, widthDp: 35.56, heightDp: 49.78, rightDp: 796.44, bottomDp: 167.11, xPx: 0, yPx: 470, widthPx: 100, heightPx: 140, rightPx: 2240, bottomPx: 470 },
  },
  "3-gesture": {
    systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
    systemBarsPx: { top: 84, right: 0, bottom: 42, left: 0 },
    displayCutout: { top: 0, right: 35.56, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 100, bottom: 0, left: 0 },
    cutoutShape: { xDp: 796.44, yDp: 167.11, widthDp: 35.56, heightDp: 49.78, rightDp: 0, bottomDp: 167.11, xPx: 2240, yPx: 470, widthPx: 100, heightPx: 140, rightPx: 0, bottomPx: 470 },
  },
  "3-threeButton": {
    systemBars: { top: 29.87, right: 0, bottom: 0, left: 48 },
    systemBarsPx: { top: 84, right: 0, bottom: 0, left: 135 },
    displayCutout: { top: 0, right: 35.56, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 100, bottom: 0, left: 0 },
    cutoutShape: { xDp: 796.44, yDp: 167.11, widthDp: 35.56, heightDp: 49.78, rightDp: 0, bottomDp: 167.11, xPx: 2240, yPx: 470, widthPx: 100, heightPx: 140, rightPx: 0, bottomPx: 470 },
  },
} as const;

const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  ...landscapeValues[`${rotation}-${mode}`],
  condition: {
    oneUi: "8.5",
    android: "16",
    note: `Samsung RTL Korea/Gumi, SM-A175N_KR3, build BP4A.251205.006.A175NKSS6CZG1. Landscape rotation ${rotation}, 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
  },
  sources: [{
    kind: "measured",
    label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy A17 LTE, rotation ${rotation}, ${mode} (SM-A175N)`,
    url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a17-5g/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
    retrievedAt: "2026-09-29",
  }],
});

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyA17: Device = {
  slug: "galaxy-a17-5g",
  name: "Galaxy A17",
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
    cornerRadiiDp: { topLeft: 39.11, topRight: 39.11, bottomRight: 39.11, bottomLeft: 39.11 },
    cornerRadiiPx: { topLeft: 110, topRight: 110, bottomRight: 110, bottomLeft: 110 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
