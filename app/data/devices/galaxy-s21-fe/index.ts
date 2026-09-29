import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S21 FE 5G (SM-G990B) specifications",
  url: "https://www.samsung.com/es/smartphones/galaxy-s/galaxy-s21-fe-5g-olive-128gb-sm-g990blgfeub/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 6.4-inch (162.9 mm, full rectangle) display at 2340×1080 (FHD+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S21 FE (SM-G990B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s21-fe/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-G990B, build UP1A.231005.007.G990BXXSCGYC9. Portrait rotation 0, 1080×2340 px full-screen capture, 480 dpi, font scale 1.";

const cutoutShape = { xDp: 168.33333, yDp: 0, widthDp: 23.33333, heightDp: 33, rightDp: 168.33333, bottomDp: 747, xPx: 505, yPx: 0, widthPx: 70, heightPx: 99, rightPx: 505, bottomPx: 2241 };

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 33, right: 0, bottom: mode === "gesture" ? 15 : 48, left: 0 },
  systemBarsPx: { top: 99, right: 0, bottom: mode === "gesture" ? 45 : 144, left: 0 },
  displayCutout: { top: 33, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 99, right: 0, bottom: 0, left: 0 },
  cutoutShape,
  condition: {
    oneUi: "6.1",
    android: "14",
    note: `${base} Android setting, configuration and InsetsProbe navigation classification agree on ${mode === "gesture" ? "gesture" : "3-button"} mode.`,
  },
  sources: [captureSource(mode)],
});

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24, right: button && left ? 48 : 0, bottom: button ? 0 : 15, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 72, right: button && left ? 144 : 0, bottom: button ? 0 : 45, left: button && !left ? 144 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 33, bottom: 0, left: left ? 33 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 99, bottom: 0, left: left ? 99 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 747, yDp: 168.33, widthDp: 33, heightDp: 23.33, rightDp: left ? 747 : 0, bottomDp: 168.33,
      xPx: left ? 0 : 2241, yPx: 505, widthPx: 99, heightPx: 70, rightPx: left ? 2241 : 0, bottomPx: 505,
    },
    condition: {
      oneUi: "6.1",
      android: "14",
      note: `Samsung RTL Russia/Moscow, SM-G990B-RU1, build UP1A.231005.007.G990BXXSCGYC9. Landscape rotation ${rotation}, 2340×1080 px window at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S21 FE, rotation ${rotation}, ${mode} (SM-G990B)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s21-fe/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 780, height: 360 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS21Fe: Device = {
  slug: "galaxy-s21-fe",
  name: "Galaxy S21 FE",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.4,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 403,
    logicalSizeDp: { width: 360, height: 780 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 40.33333, topRight: 40.33333, bottomRight: 40.33333, bottomLeft: 40.33333 },
    cornerRadiiPx: { topLeft: 121, topRight: 121, bottomRight: 121, bottomLeft: 121 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
