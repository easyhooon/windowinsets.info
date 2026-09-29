import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S10 FE specifications",
  url: "https://www.samsung.com/uk/tablets/galaxy-tab-s/galaxy-tab-s10-fe-grey-256gb-wi-fi-sm-x520nzapeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists 10.9-inch (277.0 mm), 2304×1440 WUXGA+; PPI is calculated from that diagonal and resolution.",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-fe";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10 FE main (SM-X520), ${mode}, font scale 1`,
  url: `${captureBase}/recapture-2026-09-27-fontscale-1/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});
const fontScaleSource: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10 FE main (SM-X520), both modes at font scale 1.08 (2026-09-25 and 2026-09-27)",
  url: "https://github.com/easyhooon/windowinsets.info/tree/main/measurements/galaxy-tab/galaxy-tab-s10-fe",
  retrievedAt: "2026-09-27",
};
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = { oneUi: "8.5", android: "16", note: "Samsung RTL Galaxy Tab S10 FE Wi-Fi (SM-X520), build BP4A.251205.006.X520XXS9CZG3, captured 2026-09-27. Main display landscape, rotation 1, full-screen 2304×1440 px, 280 dpi, font scale 1. InsetsProbe's non-foldable Phone label is classified as the tablet main display from model and skin-matching dimensions. Gesture mode is confirmed by Settings/config_navBarInteractionMode=2 and left/right system gesture insets although the inset-only heuristic reports threeButton due the nonzero tappable bottom inset. Earlier captures at font scale 1.08 on the same build report identical insets in both modes; font scale does not change these values." };
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const values = mode === "gesture"
    ? { systemBars: {"top": 30.29, "right": 0.0, "bottom": 14.86, "left": 0.0}, systemBarsPx: {"top": 53, "right": 0, "bottom": 26, "left": 0}, displayCutout: {"top": 0.0, "right": 0.0, "bottom": 0.0, "left": 0.0}, displayCutoutPx: {"top": 0, "right": 0, "bottom": 0, "left": 0}, source: gestureSource }
    : { systemBars: {"top": 30.29, "right": 0.0, "bottom": 48.0, "left": 0.0}, systemBarsPx: {"top": 53, "right": 0, "bottom": 84, "left": 0}, displayCutout: {"top": 0.0, "right": 0.0, "bottom": 0.0, "left": 0.0}, displayCutoutPx: {"top": 0, "right": 0, "bottom": 0, "left": 0}, source: threeButtonSource };
  return { systemBars: values.systemBars, systemBarsPx: values.systemBarsPx, displayCutout: values.displayCutout, displayCutoutPx: values.displayCutoutPx, condition, sources: [values.source, fontScaleSource] };
};

export const GalaxyTabS10Fe: Device = {
  slug: "galaxy-tab-s10-fe",
  name: "Galaxy Tab S10 FE",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 10.9,
    resolutionPx: { width: 2304, height: 1440 },
    logicalSizePx: { width: 2304, height: 1440 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 249,
    logicalSizeDp: { width: 1316.57, height: 822.86 },
    densityDpi: 280,
    cornerRadiiDp: { topLeft: 13.14, topRight: 13.14, bottomRight: 13.14, bottomLeft: 13.14 },
    cornerRadiiPx: { topLeft: 23, topRight: 23, bottomRight: 23, bottomLeft: 23 },
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") },
    sources: [samsungSpecs, gestureSource, threeButtonSource, fontScaleSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource, fontScaleSource],
};
