import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S8 Ultra display specifications",
  url: "https://www.samsung.com/pt/tablets/galaxy-tab-s/galaxy-tab-s8-ultra-5g-graphite-128gb-sm-x906bzaaeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 14.6-inch display and 2960×1848 WQXGA+ resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S8 Ultra (SM-X906B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s8-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 30, right: 0, bottom: 15, left: 0 },
  systemBarsPx: { top: 60, right: 0, bottom: 30, left: 0 },
  displayCutout: { top: 14.00000, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 28, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 696.50000, yDp: 0.00000, widthDp: 87.00000, heightDp: 14.00000, rightDp: 696.50000, bottomDp: 910.00000, xPx: 1393, yPx: 0, widthPx: 174, heightPx: 28, rightPx: 1393, bottomPx: 1820 },
  condition: { oneUi: "8.0", android: "16", note: "Samsung RTL, SM-X906B, build BP2A.250605.031.A3.X906BXXSAEZB2. landscape rotation 1, 2960×1848 px full-screen capture, 320 dpi, font scale 1. Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 60/60 px; inset-only classification says threeButton, so preserve the mode recorded by Settings/configuration." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 30, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 60, right: 0, bottom: 96, left: 0 },
  displayCutout: { top: 14.00000, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 28, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 696.50000, yDp: 0.00000, widthDp: 87.00000, heightDp: 14.00000, rightDp: 696.50000, bottomDp: 910.00000, xPx: 1393, yPx: 0, widthPx: 174, heightPx: 28, rightPx: 1393, bottomPx: 1820 },
  condition: { oneUi: "8.0", android: "16", note: "Samsung RTL, SM-X906B, build BP2A.250605.031.A3.X906BXXSAEZB2. landscape rotation 1, 2960×1848 px full-screen capture, 320 dpi, font scale 1. Probe used its generic Phone label, but model and full-screen dimensions match this tablet main display; the raw JSON is unchanged." },
  sources: [captureSource("threeButton")],
};

const rotationBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s8-ultra/recapture-2026-09-30-rotation";
const rotationMeasurements = {
  0: {
    sizePx: { width: 1848, height: 2960 }, sizeDp: { width: 924, height: 1480 },
    bottom: 48, bottomPx: 96, gestureBottom: 15, gestureBottomPx: 30,
    cutout: { top: 0, right: 14, bottom: 0, left: 0 },
    cutoutPx: { top: 0, right: 28, bottom: 0, left: 0 },
    shape: { xDp: 910, yDp: 696.5, widthDp: 14, heightDp: 87, rightDp: 0, bottomDp: 696.5, xPx: 1820, yPx: 1393, widthPx: 28, heightPx: 174, rightPx: 0, bottomPx: 1393 },
    file: "main",
  },
  2: {
    sizePx: { width: 1848, height: 2960 }, sizeDp: { width: 924, height: 1480 },
    bottom: 48, bottomPx: 96, gestureBottom: 15, gestureBottomPx: 30,
    cutout: { top: 0, right: 0, bottom: 0, left: 14 },
    cutoutPx: { top: 0, right: 0, bottom: 0, left: 28 },
    shape: { xDp: 0, yDp: 696.5, widthDp: 14, heightDp: 87, rightDp: 910, bottomDp: 696.5, xPx: 0, yPx: 1393, widthPx: 28, heightPx: 174, rightPx: 1820, bottomPx: 1393 },
    file: "portrait-2",
  },
  // The cutout edge is at the bottom, so the navigation inset grows by the 28 px cutout.
  3: {
    sizePx: { width: 2960, height: 1848 }, sizeDp: { width: 1480, height: 924 },
    bottom: 62, bottomPx: 124, gestureBottom: 29, gestureBottomPx: 58,
    cutout: { top: 0, right: 0, bottom: 14, left: 0 },
    cutoutPx: { top: 0, right: 0, bottom: 28, left: 0 },
    shape: { xDp: 696.5, yDp: 910, widthDp: 87, heightDp: 14, rightDp: 696.5, bottomDp: 0, xPx: 1393, yPx: 1820, widthPx: 174, heightPx: 28, rightPx: 1393, bottomPx: 0 },
    file: "landscape-3",
  },
} as const;

const rotationCapture = (rotation: 0 | 2 | 3) => {
  const data = rotationMeasurements[rotation];
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
    const isGesture = mode === "gesture";
    return {
      systemBars: { top: 30, right: 0, bottom: isGesture ? data.gestureBottom : data.bottom, left: 0 },
      systemBarsPx: { top: 60, right: 0, bottom: isGesture ? data.gestureBottomPx : data.bottomPx, left: 0 },
      displayCutout: data.cutout,
      displayCutoutPx: data.cutoutPx,
      cutoutShape: data.shape,
      condition: {
        oneUi: "8.0",
        android: "16",
        note: `Samsung RTL Vietnam/Hanoi, SM-X906B-VN1, same build BP2A.250605.031.A3.X906BXXSAEZB2. Separate rotation ${rotation} capture at ${data.sizePx.width}×${data.sizePx.height} px, 320 dpi and font scale 1, driven over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same sweep's rotation 1 files reproduce the accepted captures exactly.`,
      },
      sources: [{
        kind: "measured",
        label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab S8 Ultra, rotation ${rotation}, ${isGesture ? "gesture" : "3-button"}`,
        url: `${rotationBase}/${data.file}-${mode}.json`,
        retrievedAt: "2026-09-30",
      }],
    };
  };
  return { logicalSizePx: data.sizePx, logicalSizeDp: data.sizeDp, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
};

export const galaxyTabS8Ultra: Device = {
  slug: "galaxy-tab-s8-ultra",
  name: "Galaxy Tab S8 Ultra",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 14.6,
    resolutionPx: { width: 2960, height: 1848 },
    logicalSizePx: { width: 2960, height: 1848 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 239,
    logicalSizeDp: { width: 1480.00000, height: 924.00000 },
    densityDpi: 320,
    cornerRadiiDp: { topLeft: 13.00000, topRight: 13.00000, bottomRight: 13.00000, bottomLeft: 13.00000 },
    cornerRadiiPx: { topLeft: 26, topRight: 26, bottomRight: 26, bottomLeft: 26 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 0: rotationCapture(0), 2: rotationCapture(2), 3: rotationCapture(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
