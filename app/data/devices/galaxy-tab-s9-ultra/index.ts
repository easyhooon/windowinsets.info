import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S9 Ultra specifications",
  url: "https://www.samsung.com/pt/tablets/galaxy-tab-s/galaxy-tab-s9-ultra-5g-graphite-256gb-sm-x916bzaaeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 14.6-inch (369.9 mm) display diagonal and 2960×1848 WQXGA+ resolution; PPI is calculated from those values.",
};

const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s9-ultra";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S9 Ultra main (SM-X916B), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = {
  oneUi: "7.0",
  android: "15",
  note: "Samsung RTL Galaxy Tab S9 Ultra 5G (SM-X916B), build AP3A.240905.015.A2.X916BXXS5CYG1. Main display landscape, rotation 1, full-screen 2960×1848 px, 280 dpi and font scale 1. InsetsProbe labels the non-foldable display phone; matching model and official display dimensions classify it as the tablet main screen. The gesture capture is confirmed by Settings, config_navBarInteractionMode=2 and side system gesture insets; Settings and inset classification agree for 3-button mode.",
};
const cutoutShape = {
  xDp: 792.57, yDp: 0, widthDp: 106.29, heightDp: 16, rightDp: 792.57, bottomDp: 1040,
  xPx: 1387, yPx: 0, widthPx: 186, heightPx: 28, rightPx: 1387, bottomPx: 1820,
};

const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const isGesture = mode === "gesture";
  const source = isGesture ? gestureSource : threeButtonSource;
  const bottomPx = isGesture ? 26 : 84;
  const bottomDp = isGesture ? 14.86 : 48;
  return {
    systemBars: { top: 24, right: 0, bottom: bottomDp, left: 0 },
    systemBarsPx: { top: 42, right: 0, bottom: bottomPx, left: 0 },
    displayCutout: { top: 16, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 28, right: 0, bottom: 0, left: 0 },
    cutoutShape,
    condition,
    sources: [source],
  };
};

export const galaxyTabS9Ultra: Device = {
  slug: "galaxy-tab-s9-ultra",
  name: "Galaxy Tab S9 Ultra",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 14.6,
    resolutionPx: { width: 2960, height: 1848 },
    logicalSizePx: { width: 2960, height: 1848 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 239,
    logicalSizeDp: { width: 1691.43, height: 1056 },
    densityDpi: 280,
    cornerRadiiDp: { topLeft: 13.14, topRight: 13.14, bottomRight: 13.14, bottomLeft: 13.14 },
    cornerRadiiPx: { topLeft: 23, topRight: 23, bottomRight: 23, bottomLeft: 23 },
    insets: {
      gesture: measurement("gesture"),
      threeButton: measurement("threeButton"),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
