import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S21 Plus display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-s/galaxy-s21-plus-128gb-sm-g996bzkdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch display and 2400×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S21 Plus (SM-G996B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s21-plus/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => mode === "gesture"
  ? {
  systemBars: { top: 26.67, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 182.04444, yDp: 0.00000, widthDp: 20.26667, heightDp: 26.66667, rightDp: 181.68889, bottomDp: 826.66667, xPx: 512, yPx: 0, widthPx: 57, heightPx: 75, rightPx: 511, bottomPx: 2325 },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, SM-G996B, build AP3A.240905.015.A2.G996BXXUEHYD5. Portrait rotation 0, 1080×2400 px active window, 450 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.67, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 182.04444, yDp: 0.00000, widthDp: 20.26667, heightDp: 26.66667, rightDp: 181.68889, bottomDp: 826.66667, xPx: 512, yPx: 0, widthPx: 57, heightPx: 75, rightPx: 511, bottomPx: 2325 },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, SM-G996B, build AP3A.240905.015.A2.G996BXXUEHYD5. Portrait rotation 0, 1080×2400 px active window, 450 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
  sources: [captureSource("threeButton")],
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24.18, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 68, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 26.67, bottom: 0, left: left ? 26.67 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 75, bottom: 0, left: left ? 75 : 0 },
    cutoutShape: left
      ? { xDp: 0, yDp: 181.69, widthDp: 26.67, heightDp: 20.27, rightDp: 826.67, bottomDp: 182.04, xPx: 0, yPx: 511, widthPx: 75, heightPx: 57, rightPx: 2325, bottomPx: 512 }
      : { xDp: 826.67, yDp: 182.04, widthDp: 26.67, heightDp: 20.27, rightDp: 0, bottomDp: 181.69, xPx: 2325, yPx: 512, widthPx: 75, heightPx: 57, rightPx: 0, bottomPx: 511 },
    condition: {
      oneUi: "7.0",
      android: "15",
      note: `Samsung RTL Russia/Moscow, SM-G996B-RU8, build AP3A.240905.015.A2.G996BXXUEHYD5. Landscape rotation ${rotation}, FHD+ 2400×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S21+, rotation ${rotation}, ${mode} (SM-G996B)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s21-plus/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2400, height: 1080 },
  logicalSizeDp: { width: 853.33, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS21Plus: Device = {
  slug: "galaxy-s21-plus",
  name: "Galaxy S21 Plus",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 393,
    logicalSizeDp: { width: 384.00, height: 853.33 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 35.91, topRight: 35.91, bottomRight: 35.91, bottomLeft: 35.91 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
