import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S9 Wi-Fi specifications",
  url: "https://www.samsung.com/pt/tablets/galaxy-tab-s/galaxy-tab-s9-wi-fi-graphite-256gb-sm-x710nzaeeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists an 11.0-inch (278.1 mm) display diagonal and 2560×1600 WQXGA resolution; PPI is calculated from those values.",
};

const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s9";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on a physical Galaxy Tab S9 Wi-Fi (SM-X710) main display, ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = {
  oneUi: "8.0",
  android: "16",
  note: "User-owned physical Galaxy Tab S9 Wi-Fi (SM-X710), build BP2A.250605.031.A3.X710XXS5DZA1. Main display portrait, rotation 0, full-screen 1600×2560 px, 340 dpi (default), font scale 1. Samsung Taskbar was enabled and left unchanged for both captures. The gesture capture is confirmed by Settings, config_navBarInteractionMode=2 and side system-gesture insets, although the inset-only heuristic reports threeButton; preserve the observed inset values and mode evidence.",
};

const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const isGesture = mode === "gesture";
  const source = isGesture ? gestureSource : threeButtonSource;
  const bottomPx = isGesture ? 32 : 102;
  const bottomDp = isGesture ? 15.06 : 48;
  return {
    systemBars: { top: 30.12, right: 0, bottom: bottomDp, left: 0 },
    systemBarsPx: { top: 64, right: 0, bottom: bottomPx, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
    condition,
    sources: [source],
  };
};

export const galaxyTabS9: Device = {
  slug: "galaxy-tab-s9",
  name: "Galaxy Tab S9",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 11,
    resolutionPx: { width: 2560, height: 1600 },
    logicalSizePx: { width: 1600, height: 2560 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 274,
    logicalSizeDp: { width: 752.94, height: 1204.71 },
    densityDpi: 340,
    cornerRadiiDp: { topLeft: 9.88, topRight: 9.88, bottomRight: 9.88, bottomLeft: 9.88 },
    cornerRadiiPx: { topLeft: 21, topRight: 21, bottomRight: 21, bottomLeft: 21 },
    insets: {
      gesture: measurement("gesture"),
      threeButton: measurement("threeButton"),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
