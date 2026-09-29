import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S21 display specifications",
  url: "https://www.samsung.com/cz/support/mobile-devices/srovnani-modelu-smartphonu-galaxy-s21-ultra-5g-s21-5g-a-note10/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.2-inch display and 2400×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S21 (SM-G991B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s21/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => mode === "gesture"
  ? {
  systemBars: { top: 26.67, right: 0, bottom: 15, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: 45, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 170.00000, yDp: 0.00000, widthDp: 20.00000, heightDp: 26.66667, rightDp: 170.00000, bottomDp: 773.33333, xPx: 510, yPx: 0, widthPx: 60, heightPx: 80, rightPx: 510, bottomPx: 2320 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G991B, build UP1A.231005.007.G991BXXSEGYA2. Portrait rotation 0, 1080×2400 px active window, 480 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.67, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: 144, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 170.00000, yDp: 0.00000, widthDp: 20.00000, heightDp: 26.66667, rightDp: 170.00000, bottomDp: 773.33333, xPx: 510, yPx: 0, widthPx: 60, heightPx: 80, rightPx: 510, bottomPx: 2320 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G991B, build UP1A.231005.007.G991BXXSEGYA2. Portrait rotation 0, 1080×2400 px active window, 480 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
  sources: [captureSource("threeButton")],
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24, right: button && left ? 48 : 0, bottom: button ? 0 : 15, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 72, right: button && left ? 144 : 0, bottom: button ? 0 : 45, left: button && !left ? 144 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 26.67, bottom: 0, left: left ? 26.67 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 80, bottom: 0, left: left ? 80 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 773.33, yDp: 170, widthDp: 26.67, heightDp: 20, rightDp: left ? 773.33 : 0, bottomDp: 170,
      xPx: left ? 0 : 2320, yPx: 510, widthPx: 80, heightPx: 60, rightPx: left ? 2320 : 0, bottomPx: 510,
    },
    condition: {
      oneUi: "6.1",
      android: "14",
      note: `Samsung RTL Russia/Moscow, SM-G991B-RU2, build UP1A.231005.007.G991BXXSEGYA2. Landscape rotation ${rotation}, 2400×1080 px window at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S21, rotation ${rotation}, ${mode} (SM-G991B)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s21/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2400, height: 1080 },
  logicalSizeDp: { width: 800, height: 360 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS21: Device = {
  slug: "galaxy-s21",
  name: "Galaxy S21",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.2,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 424,
    logicalSizeDp: { width: 360.00, height: 800.00 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 30.00, topRight: 30.00, bottomRight: 30.00, bottomLeft: 30.00 },
    cornerRadiiPx: { topLeft: 90, topRight: 90, bottomRight: 90, bottomLeft: 90 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
