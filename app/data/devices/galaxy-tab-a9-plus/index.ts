import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab A9+ 5G specifications",
  url: "https://www.samsung.com/uk/business/tablets/galaxy-tab-a/galaxy-tab-a9-plus-5g-graphite-128gb-sm-x216bzaeeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists an 11.0-inch display and 1920×1200 WUXGA resolution; PPI is calculated from those values.",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-a9-plus";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab A9+ 5G main (SM-X216B), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL Galaxy Tab A9+ 5G (SM-X216B), build UP1A.231005.007.X216BXXS3CXG1. Main display landscape, rotation 1, full-screen 1920×1200 px, 240 dpi and font scale 1.1. InsetsProbe's non-foldable Phone label is classified as the tablet main display from model and skin-matching dimensions. Gesture mode is confirmed by Settings/config_navBarInteractionMode=2 and left/right system gesture insets, although the inset-only heuristic reports threeButton because tappableElement includes the bottom system bar. Both modes report the same 48 dp bottom system-bar inset; keep these observed values without inferring a mode error from inset size. Font scale is non-default and preserved as captured.",
};
const measurement = (source: Source): InsetsMeasurement => ({
  systemBars: { top: 24, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 36, right: 0, bottom: 72, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition,
  sources: [source],
});

export const galaxyTabA9Plus: Device = {
  slug: "galaxy-tab-a9-plus",
  name: "Galaxy Tab A9 Plus",
  brand: "Samsung",
  series: "Galaxy Tab A",
  formFactor: "tablet",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 11,
    resolutionPx: { width: 1920, height: 1200 },
    logicalSizePx: { width: 1920, height: 1200 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 226,
    logicalSizeDp: { width: 1280, height: 800 },
    densityDpi: 240,
    cornerRadiiDp: { topLeft: 13.33, topRight: 13.33, bottomRight: 13.33, bottomLeft: 13.33 },
    cornerRadiiPx: { topLeft: 20, topRight: 20, bottomRight: 20, bottomLeft: 20 },
    insets: {
      gesture: measurement(gestureSource),
      threeButton: measurement(threeButtonSource),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
