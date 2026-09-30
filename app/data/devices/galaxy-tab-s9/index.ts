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

const rotationBase = `${captureBase}/rtl-2026-09-30-android-15-rotation`;
const rotationNote = "Samsung RTL Russia/Moscow, SM-X716B-RU3, build AP3A.240905.015.A2.X716BXXU5CYD9 (Android 15 / One UI 7.0), 340 dpi and font scale 1. RTL lists no unit on the Android 16 build of the natural capture, so these rotations come from the closest available release. Driven over Remote Debug Bridge (adb): navigation was selected in Settings and each rotation was fixed with `cmd window user-rotation lock`. This release reports a 51 px status bar in every rotation, including its own rotation 0 file, against 64 px on the Android 16 natural capture; the bottom insets match.";
// Rotations 1, 2 and 3 are Android 15 captures; never mixed into the Android 16 natural values.
const rotationCapture = (file: string, width: number, height: number) => {
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
    ...measurement(mode),
    systemBars: { top: 24, right: 0, bottom: mode === "gesture" ? 15.06 : 48, left: 0 },
    systemBarsPx: { top: 51, right: 0, bottom: mode === "gesture" ? 32 : 102, left: 0 },
    condition: { oneUi: "7.0", android: "15", note: rotationNote },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab S9 5G (SM-X716B), ${file}, ${mode}, font scale 1`,
      url: `${rotationBase}/${file}-${mode}.json`,
      retrievedAt: "2026-09-30",
    }],
  });
  const dp = (px: number) => Math.round(px / 2.125 * 100) / 100;
  return { logicalSizePx: { width, height }, logicalSizeDp: { width: dp(width), height: dp(height) }, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
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
    rotations: {
      1: rotationCapture("landscape-1", 2560, 1600),
      2: rotationCapture("portrait-2", 1600, 2560),
      3: rotationCapture("landscape-3", 2560, 1600),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
