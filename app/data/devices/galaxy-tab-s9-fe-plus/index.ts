import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S9 FE+ specifications",
  url: "https://www.samsung.com/sec/support/model/SM-X616NZAAKOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists 12.4-inch (315.0 mm), 2560×1600 WQXGA; PPI is calculated from that diagonal and resolution.",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s9-fe-plus";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S9 FE+ main (SM-X616N), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = { oneUi: "8.5", android: "16", note: "Samsung RTL Galaxy Tab S9 FE+ 5G (SM-X616N), build BP4A.251205.006.X616NKOSEEZG3. Main display landscape, rotation 1, full-screen 2560×1600 px, 340 dpi, font scale 1. InsetsProbe's non-foldable Phone label is classified as the tablet main display from model and skin-matching dimensions. Gesture mode is confirmed by Settings/config_navBarInteractionMode=2 and left/right system gesture insets although the inset-only heuristic reports threeButton due the nonzero tappable bottom inset." };
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const values = mode === "gesture"
    ? { systemBars: {"top": 30.05, "right": 0.0, "bottom": 15.02, "left": 0.0}, systemBarsPx: {"top": 64, "right": 0, "bottom": 32, "left": 0}, displayCutout: {"top": 0.0, "right": 0.0, "bottom": 0.0, "left": 0.0}, displayCutoutPx: {"top": 0, "right": 0, "bottom": 0, "left": 0}, source: gestureSource }
    : { systemBars: {"top": 30.05, "right": 0.0, "bottom": 47.89, "left": 0.0}, systemBarsPx: {"top": 64, "right": 0, "bottom": 102, "left": 0}, displayCutout: {"top": 0.0, "right": 0.0, "bottom": 0.0, "left": 0.0}, displayCutoutPx: {"top": 0, "right": 0, "bottom": 0, "left": 0}, source: threeButtonSource };
  return { systemBars: values.systemBars, systemBarsPx: values.systemBarsPx, displayCutout: values.displayCutout, displayCutoutPx: values.displayCutoutPx, condition, sources: [values.source] };
};

export const GalaxyTabS9FePlus: Device = {
  slug: "galaxy-tab-s9-fe-plus",
  name: "Galaxy Tab S9 FE+",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 12.4,
    resolutionPx: { width: 2560, height: 1600 },
    logicalSizePx: { width: 2560, height: 1600 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 243,
    logicalSizeDp: { width: 1201.88, height: 751.17 },
    densityDpi: 340,
    cornerRadiiDp: { topLeft: 9.86, topRight: 9.86, bottomRight: 9.86, bottomLeft: 9.86 },
    cornerRadiiPx: { topLeft: 21, topRight: 21, bottomRight: 21, bottomLeft: 21 },
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
