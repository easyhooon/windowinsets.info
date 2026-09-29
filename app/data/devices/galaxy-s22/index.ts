import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S22 display specifications",
  url: "https://www.samsung.com/fr/business/smartphones/galaxy-s/galaxy-s22-sm-s901bzkdeuh/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.1-inch display and 2340×1080 px resolution; PPI is calculated from those values.",
};

const capture = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S22 (SM-S901E-IN1), rotation ${rotation}, ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s22/recapture-2026-09-28-rotation/${rotation === 0 ? "main" : `landscape-${rotation}`}-${mode}.json`,
  retrievedAt: "2026-09-28",
  ...(rotation === 1 && mode === "gesture"
    ? {}
    : { note: "Reconstructed from the preserved RTL InsetsProbe logs because the File Browser download did not complete; the downloaded rotation 1 gesture capture matches its log copy exactly." }),
});

const gestureSource = capture(0, "gesture");
const buttonSource = capture(0, "threeButton");

const measuredInsets = (rotation: 0 | 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const portrait = rotation === 0;
  const left = rotation === 1;
  const button = mode === "threeButton";
  return {
    systemBars: { top: portrait ? 27 : 24, right: !portrait && left && button ? 48 : 0, bottom: button ? (portrait ? 48 : 0) : 15, left: !portrait && !left && button ? 48 : 0 },
    systemBarsPx: { top: portrait ? 81 : 72, right: !portrait && left && button ? 144 : 0, bottom: button ? (portrait ? 144 : 0) : 45, left: !portrait && !left && button ? 144 : 0 },
    displayCutout: { top: portrait ? 27 : 0, right: !portrait && !left ? 27 : 0, bottom: 0, left: !portrait && left ? 27 : 0 },
    displayCutoutPx: { top: portrait ? 81 : 0, right: !portrait && !left ? 81 : 0, bottom: 0, left: !portrait && left ? 81 : 0 },
    cutoutShape: portrait
      ? { xDp: 170.67, yDp: 0, widthDp: 18.67, heightDp: 27, rightDp: 170.67, bottomDp: 753, xPx: 512, yPx: 0, widthPx: 56, heightPx: 81, rightPx: 512, bottomPx: 2259 }
      : left
        ? { xDp: 0, yDp: 170.67, widthDp: 27, heightDp: 18.67, rightDp: 753, bottomDp: 170.67, xPx: 0, yPx: 512, widthPx: 81, heightPx: 56, rightPx: 2259, bottomPx: 512 }
        : { xDp: 753, yDp: 170.67, widthDp: 27, heightDp: 18.67, rightDp: 0, bottomDp: 170.67, xPx: 2259, yPx: 512, widthPx: 81, heightPx: 56, rightPx: 0, bottomPx: 512 },
    condition: {
      oneUi: "6.1.1",
      android: "14",
      note: `Samsung RTL India/Noida, SM-S901E-IN1, build UP1A.231005.007.S901EXXSCEYC1 (newest Android offered for Galaxy S22 after the Android 15 RU7 unit failed to install the probe). Rotation ${rotation}, ${portrait ? "1080×2340" : "2340×1080"} px full-screen window, 480 dpi and font scale 1. Android navigation setting and InsetsProbe classification agree.`,
    },
    sources: [capture(rotation, mode)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 780, height: 360 },
  insets: { gesture: measuredInsets(rotation, "gesture"), threeButton: measuredInsets(rotation, "threeButton") },
});

export const galaxyS22: Device = {
  slug: "galaxy-s22",
  name: "Galaxy S22",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.1,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 422,
    logicalSizeDp: { width: 360, height: 780 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 34, topRight: 34, bottomRight: 34, bottomLeft: 34 },
    cornerRadiiPx: { topLeft: 102, topRight: 102, bottomRight: 102, bottomLeft: 102 },
    insets: { gesture: measuredInsets(0, "gesture"), threeButton: measuredInsets(0, "threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, gestureSource, buttonSource],
  }],
  sources: [samsungSpecs, gestureSource, buttonSource],
};
