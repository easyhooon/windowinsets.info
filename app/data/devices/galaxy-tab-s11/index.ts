import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S11 specifications",
  url: "https://www.samsung.com/sec/support/model/SM-X730NZAEKOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists 11.0-inch (278.1 mm), 2560×1600 WQXGA; PPI is calculated from that diagonal and resolution.",
};

const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s11/recapture-2026-09-29-rotation";
const captureSource = (file: string, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab S11 main (SM-X730), ${file}, ${mode}`,
  url: `${captureBase}/${file}-${mode}.json`,
  retrievedAt: "2026-09-29",
});

const condition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL Korea/Gumi, SM-X730_KR1, build BP4A.251205.006.X730XXS7BZG3. Four separate display rotations in both navigation modes, 340 dpi and font scale 1. Probe labels this non-foldable display 'phone'; model and dimensions identify the tablet main screen. Gesture mode is confirmed by Settings and configNavBarInteractionMode=2; its inset-only heuristic reports threeButton because the taskbar retains a tappable bottom inset.",
};

const measurement = (file: string, mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 30.12, right: 0, bottom: mode === "gesture" ? 15.06 : 48, left: 0 },
  systemBarsPx: { top: 64, right: 0, bottom: mode === "gesture" ? 32 : 102, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition,
  sources: [captureSource(file, mode)],
});

const rotationCapture = (file: string, width: number, height: number, widthDp: number, heightDp: number) => ({
  logicalSizePx: { width, height },
  logicalSizeDp: { width: widthDp, height: heightDp },
  insets: {
    gesture: measurement(file, "gesture"),
    threeButton: measurement(file, "threeButton"),
  },
});

const gestureSource = captureSource("landscape-1", "gesture");
const threeButtonSource = captureSource("landscape-1", "threeButton");

export const GalaxyTabS11: Device = {
  slug: "galaxy-tab-s11",
  name: "Galaxy Tab S11",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 11.0,
    resolutionPx: { width: 2560, height: 1600 },
    logicalSizePx: { width: 2560, height: 1600 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 274,
    logicalSizeDp: { width: 1204.71, height: 752.94 },
    densityDpi: 340,
    cornerRadiiDp: { topLeft: 13.18, topRight: 13.18, bottomRight: 13.18, bottomLeft: 13.18 },
    cornerRadiiPx: { topLeft: 28, topRight: 28, bottomRight: 28, bottomLeft: 28 },
    insets: {
      gesture: measurement("landscape-1", "gesture"),
      threeButton: measurement("landscape-1", "threeButton"),
    },
    rotations: {
      0: rotationCapture("main", 1600, 2560, 752.94, 1204.71),
      2: rotationCapture("portrait-2", 1600, 2560, 752.94, 1204.71),
      3: rotationCapture("landscape-3", 2560, 1600, 1204.71, 752.94),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
