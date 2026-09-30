import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab A11 LTE specifications",
  url: "https://www.samsung.com/uk/tablets/galaxy-tab-a/galaxy-tab-a11-grey-64gb-lte-sm-x135fzaaeub/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists an 8.7-inch TFT display at 1340×800 (WXGA+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab A11 (SM-X135F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-a11/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-X135F, build BP2A.250605.031.A3.X135FXXS3BZA3. landscape rotation 1, 1340×800 px full-screen capture, 213 dpi, font scale 1.";

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 30.04695, right: 0, bottom: mode === "gesture" ? 15.02347 : 48.07512, left: 0 },
  systemBarsPx: { top: 40, right: 0, bottom: mode === "gesture" ? 20 : 64, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: {
    oneUi: "8.0",
    android: "16",
    note: mode === "gesture"
      ? `${base} Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 39/39 px; inset-only classification says threeButton because of the nonzero tappable bottom inset. The 20 px (15.02 dp) bottom navigation, system-bar and tappable inset matches the One UI 8 gesture-handle pattern seen on Tab S10 FE and Tab S10 Lite.`
      : `${base} 3-button mode agrees with Settings, configuration and InsetsProbe.`,
  },
  sources: [captureSource(mode)],
});

const rotationBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-a11/recapture-2026-09-30-rotation";
const rotationNote = "Samsung RTL Russia/Moscow, SM-X135F-RU2, same build BP2A.250605.031.A3.X135FXXS3BZA3, 213 dpi and font scale 1. Driven over Remote Debug Bridge (adb): navigation was selected in Settings and each rotation was fixed with `cmd window user-rotation lock`. Rotation 1 from the same session reproduces the accepted captures exactly in both modes.";
// Every rotation keeps the same bars: the taskbar stays at the bottom and there is no cutout.
const rotationCapture = (file: string, width: number, height: number) => {
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
    ...measuredInsets(mode),
    condition: { oneUi: "8.0", android: "16", note: rotationNote },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab A11 (SM-X135F), ${file}, ${mode}, font scale 1`,
      url: `${rotationBase}/${file}-${mode}.json`,
      retrievedAt: "2026-09-30",
    }],
  });
  const dp = (px: number) => Math.round(px / 1.33125 * 100) / 100;
  return { logicalSizePx: { width, height }, logicalSizeDp: { width: dp(width), height: dp(height) }, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
};

export const galaxyTabA11: Device = {
  slug: "galaxy-tab-a11",
  name: "Galaxy Tab A11",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 8.7,
    resolutionPx: { width: 1340, height: 800 },
    logicalSizePx: { width: 1340, height: 800 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 179,
    logicalSizeDp: { width: 1006.57277, height: 600.93897 },
    densityDpi: 213,
    cornerRadiiDp: { topLeft: 12.76995, topRight: 12.76995, bottomRight: 12.76995, bottomLeft: 12.76995 },
    cornerRadiiPx: { topLeft: 17, topRight: 17, bottomRight: 17, bottomLeft: 17 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: {
      0: rotationCapture("main", 800, 1340),
      2: rotationCapture("portrait-2", 800, 1340),
      3: rotationCapture("landscape-3", 1340, 800),
    },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
