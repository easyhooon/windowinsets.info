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

const rotationBase = `${captureBase}/recapture-2026-09-30-rotation`;
const rotationMeasurements = {
  0: {
    sizePx: { width: 1848, height: 2960 }, sizeDp: { width: 1056, height: 1691.43 },
    bottom: 48, bottomPx: 84, gestureBottom: 14.86, gestureBottomPx: 26,
    cutout: { top: 0, right: 16, bottom: 0, left: 0 },
    cutoutPx: { top: 0, right: 28, bottom: 0, left: 0 },
    shape: { xDp: 1040, yDp: 792.57, widthDp: 16, heightDp: 106.29, rightDp: 0, bottomDp: 792.57, xPx: 1820, yPx: 1387, widthPx: 28, heightPx: 186, rightPx: 0, bottomPx: 1387 },
    file: "main",
  },
  2: {
    sizePx: { width: 1848, height: 2960 }, sizeDp: { width: 1056, height: 1691.43 },
    bottom: 48, bottomPx: 84, gestureBottom: 14.86, gestureBottomPx: 26,
    cutout: { top: 0, right: 0, bottom: 0, left: 16 },
    cutoutPx: { top: 0, right: 0, bottom: 0, left: 28 },
    shape: { xDp: 0, yDp: 792.57, widthDp: 16, heightDp: 106.29, rightDp: 1040, bottomDp: 792.57, xPx: 0, yPx: 1387, widthPx: 28, heightPx: 186, rightPx: 1820, bottomPx: 1387 },
    file: "portrait-2",
  },
  // The cutout edge is at the bottom, so the navigation inset grows by the 28 px cutout.
  3: {
    sizePx: { width: 2960, height: 1848 }, sizeDp: { width: 1691.43, height: 1056 },
    bottom: 64, bottomPx: 112, gestureBottom: 30.86, gestureBottomPx: 54,
    cutout: { top: 0, right: 0, bottom: 16, left: 0 },
    cutoutPx: { top: 0, right: 0, bottom: 28, left: 0 },
    shape: { xDp: 792.57, yDp: 1040, widthDp: 106.29, heightDp: 16, rightDp: 792.57, bottomDp: 0, xPx: 1387, yPx: 1820, widthPx: 186, heightPx: 28, rightPx: 1387, bottomPx: 0 },
    file: "landscape-3",
  },
} as const;

const rotationCapture = (rotation: 0 | 2 | 3) => {
  const data = rotationMeasurements[rotation];
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
    const isGesture = mode === "gesture";
    return {
      systemBars: { top: 24, right: 0, bottom: isGesture ? data.gestureBottom : data.bottom, left: 0 },
      systemBarsPx: { top: 42, right: 0, bottom: isGesture ? data.gestureBottomPx : data.bottomPx, left: 0 },
      displayCutout: data.cutout,
      displayCutoutPx: data.cutoutPx,
      cutoutShape: data.shape,
      condition: {
        oneUi: "7.0",
        android: "15",
        note: `Samsung RTL UK/Staines, SM-X916B-UK01, same build AP3A.240905.015.A2.X916BXXS5CYG1. Separate rotation ${rotation} capture at ${data.sizePx.width}×${data.sizePx.height} px, 280 dpi and font scale 1, driven over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same sweep's rotation 1 files reproduce the accepted captures exactly.`,
      },
      sources: [{
        kind: "measured",
        label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab S9 Ultra, rotation ${rotation}, ${isGesture ? "gesture" : "3-button"}`,
        url: `${rotationBase}/${data.file}-${mode}.json`,
        retrievedAt: "2026-09-30",
      }],
    };
  };
  return { logicalSizePx: data.sizePx, logicalSizeDp: data.sizeDp, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
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
    rotations: { 0: rotationCapture(0), 2: rotationCapture(2), 3: rotationCapture(3) },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
