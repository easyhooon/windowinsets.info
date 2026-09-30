import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab A7 Lite LTE specifications",
  url: "https://www.samsung.com/au/business/tablets/galaxy-tab-a/galaxy-tab-a7-lite-sm-t225nzaaxsa/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists an 8.7-inch (220.5 mm), 1340×800 WXGA+ display; PPI is calculated from those values.",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-a7-lite";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab A7 Lite main (SM-T225), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL Galaxy Tab A7 Lite LTE (SM-T225), build UP1A.231005.007.T225XXSBEYE4. Main display landscape, rotation 1, full-screen 1340×800 px, 213 dpi and font scale 1. InsetsProbe's non-foldable Phone label is classified as the tablet main display from model and matching 1340×800 official display resolution. Gesture mode is confirmed by Settings/config_navBarInteractionMode=2 and left/right system gesture insets, although the inset-only heuristic reports threeButton. Both modes report the same 48.08 dp bottom system-bar inset; keep these observed values without inferring a mode error from inset size.",
};
const measurement = (source: Source): InsetsMeasurement => ({
  systemBars: { top: 24.04, right: 0, bottom: 48.08, left: 0 },
  systemBarsPx: { top: 32, right: 0, bottom: 64, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition,
  sources: [source],
});

const rotationBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-a7-lite/recapture-2026-09-30-rotation";
const rotationNote = "Samsung RTL Russia/Moscow, SM-T225-RU2, same build UP1A.231005.007.T225XXSBEYE4, 213 dpi and font scale 1. Driven over Remote Debug Bridge (adb): navigation was selected in Settings and each rotation was fixed with `cmd window user-rotation lock`. Rotation 1 from the same session reproduces the accepted captures exactly in both modes; both modes keep the 64 px bottom bar in every rotation.";
// Every rotation keeps the same bars: the taskbar stays at the bottom and there is no cutout.
const rotationCapture = (file: string, width: number, height: number) => {
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
    ...measurement(mode === "gesture" ? gestureSource : threeButtonSource),
    condition: { oneUi: "6.1", android: "14", note: rotationNote },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab A7 Lite LTE (SM-T225), ${file}, ${mode}, font scale 1`,
      url: `${rotationBase}/${file}-${mode}.json`,
      retrievedAt: "2026-09-30",
    }],
  });
  const dp = (px: number) => Math.round(px / 1.33125 * 100) / 100;
  return { logicalSizePx: { width, height }, logicalSizeDp: { width: dp(width), height: dp(height) }, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
};

export const galaxyTabA7Lite: Device = {
  slug: "galaxy-tab-a7-lite",
  name: "Galaxy Tab A7 Lite",
  brand: "Samsung",
  series: "Galaxy Tab A",
  formFactor: "tablet",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 8.7,
    resolutionPx: { width: 1340, height: 800 },
    logicalSizePx: { width: 1340, height: 800 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 179,
    logicalSizeDp: { width: 1007.52, height: 601.5 },
    densityDpi: 213,
    cornerRadiiDp: { topLeft: 12.77, topRight: 12.77, bottomRight: 12.77, bottomLeft: 12.77 },
    cornerRadiiPx: { topLeft: 17, topRight: 17, bottomRight: 17, bottomLeft: 17 },
    insets: {
      gesture: measurement(gestureSource),
      threeButton: measurement(threeButtonSource),
    },
    rotations: {
      0: rotationCapture("main", 800, 1340),
      2: rotationCapture("portrait-2", 800, 1340),
      3: rotationCapture("landscape-3", 1340, 800),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
