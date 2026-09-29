import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 FE Specifications",
  url: "https://www.samsung.com/sg/smartphones/galaxy-s/galaxy-s25-fe-icyblue-512gb-sm-s731blbhxsp/",
  retrievedAt: "2026-09-24",
  note: "Samsung lists a 171.1 mm display diagonal and 1080×2340 resolution; PPI is calculated from those values.",
};

const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S25 FE (SM-S731N), ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s25-fe/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});

const gestureSource = capture("gesture");
const buttonSource = capture("threeButton");

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 34.49, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 97, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 29.16, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
  cutoutShape: {
    xDp: 181.69, yDp: 8.53, widthDp: 20.62, heightDp: 20.62,
    rightDp: 181.69, bottomDp: 802.84,
    xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258,
  },
  condition: {
    oneUi: "8.5",
    android: "16",
    note: "Samsung RTL Korea/Gumi, SM-S731N_KR1, build BP4A.251205.006.S731NKSS8BZG3. Portrait rotation 0, default FHD+ screen resolution, 450 dpi and font scale 1. InsetsProbe reported a settled full-screen 1080×2340 px window on display 0. Screen timeout was set to 10 minutes. View rotation does not measure landscape insets.",
  },
  sources: [mode === "gesture" ? gestureSource : buttonSource],
});

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 29.87, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 84, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 29.16, bottom: 0, left: left ? 29.16 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 82, bottom: 0, left: left ? 82 : 0 },
    cutoutShape: {
      xDp: left ? 8.53 : 802.84, yDp: 181.69, widthDp: 20.62, heightDp: 20.62, rightDp: left ? 802.84 : 8.53, bottomDp: 181.69,
      xPx: left ? 24 : 2258, yPx: 511, widthPx: 58, heightPx: 58, rightPx: left ? 2258 : 24, bottomPx: 511,
    },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S731N_KR2, build BP4A.251205.006.S731NKSS8BZG3. Landscape rotation ${rotation}, FHD+ 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S25 FE, rotation ${rotation}, ${mode} (SM-S731N)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s25-fe/recapture-2026-09-28-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-28",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS25Fe: Device = {
  slug: "galaxy-s25-fe",
  name: "Galaxy S25 FE",
  brand: "Samsung",
  series: "Galaxy S25",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2340 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 383,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
      cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
      insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
      rotations: { 1: landscape(1), 3: landscape(3) },
      sources: [samsungSpecs, gestureSource, buttonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
