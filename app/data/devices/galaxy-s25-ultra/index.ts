import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S25 Ultra Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/specs/",
  retrievedAt: "2025-01-14",
};

const rtlThreeButton: Source = {
  kind: "measured",
  label: "Samsung Remote Test Lab (RTL), One UI 8.5, Android 16",
  url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s25-ultra/main-threeButton.json",
  retrievedAt: "2026-09-22",
};

const rtlGesture: Source = {
  ...rtlThreeButton,
  url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s25-ultra/main-gesture.json",
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 29.87, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 84, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 34.13, bottom: 0, left: left ? 34.13 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 96, bottom: 0, left: left ? 96 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 797.87, yDp: 182.76, widthDp: 34.13, heightDp: 18.49, rightDp: left ? 797.87 : 0, bottomDp: 182.76,
      xPx: left ? 0 : 2244, yPx: 514, widthPx: 96, heightPx: 52, rightPx: left ? 2244 : 0, bottomPx: 514,
    },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-S938N_KR1, build BP4A.251205.006.S938NKSSCCZH2. Landscape rotation ${rotation}, FHD+ 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S25 Ultra, rotation ${rotation}, ${mode} (SM-S938N)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s25-ultra/recapture-2026-09-28-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-28",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS25Ultra: Device = {
  slug: "galaxy-s25-ultra",
  name: "Galaxy S25 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.9,
      resolutionPx: { width: 1440, height: 3120 },
      logicalSizePx: { width: 1080, height: 2340 },
      captureOrientation: "portrait",
      ppi: 0,
      logicalSizeDp: { width: 384, height: 832 },
      densityDpi: 450,
      cornerRadiiDp: {
        topLeft: 14.93,
        topRight: 14.93,
        bottomRight: 14.93,
        bottomLeft: 14.93,
      },
      cornerRadiiPx: { topLeft: 42, topRight: 42, bottomRight: 42, bottomLeft: 42 },
      insets: {
        gesture: {
          systemBars: { top: 34.13, right: 0, bottom: 14.93, left: 0 },
          systemBarsPx: { top: 96, right: 0, bottom: 42, left: 0 },
          displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13, rightDp: 182.76, bottomDp: 797.87, xPx: 514, yPx: 0, widthPx: 52, heightPx: 96, rightPx: 514, bottomPx: 2244 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [rtlGesture],
        },
        threeButton: {
          systemBars: { top: 34.13, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 96, right: 0, bottom: 135, left: 0 },
          displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
          cutoutShape: { xDp: 182.76, yDp: 0, widthDp: 18.49, heightDp: 34.13, rightDp: 182.76, bottomDp: 797.87, xPx: 514, yPx: 0, widthPx: 52, heightPx: 96, rightPx: 514, bottomPx: 2244 },
          condition: { oneUi: "8.5", android: "16" },
          sources: [rtlThreeButton],
        },
      },
      rotations: { 1: landscape(1), 3: landscape(3) },
      sources: [samsungSpecs, rtlThreeButton, rtlGesture],
    },
  ],
  sources: [samsungSpecs, rtlThreeButton, rtlGesture],
};
