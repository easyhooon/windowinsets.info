import type { Device, InsetsMeasurement, Source } from "../../types";

const skinLayout: Source = {
  kind: "official",
  label: "Samsung Galaxy Emulator Skin layout for Galaxy A26 5G",
  url: "https://developer.samsung.com/galaxy-emulator-skin",
  retrievedAt: "2026-09-22",
  note: "The skin's display rectangle gives the 1080×2340 px panel; diagonal and PPI stay pending until an official specification page is retrieved.",
};

const captureUrl = (file: string) =>
  `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a26-5g/rtl-2026-09-30/${file}.json`;

const captureSource = (file: string, what: string): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy A26 5G (SM-A266B), ${what}`,
  url: captureUrl(file),
  retrievedAt: "2026-09-30",
});

const condition = (rotation: 0 | 1 | 3) => ({
  oneUi: "8.0",
  android: "16",
  note: `Samsung RTL Poland/Warsaw, SM-A266B-PL02, build BP2A.250605.031.A3.A266BXXS9BZE5. ${rotation === 0 ? "Portrait rotation 0, 1080×2340" : `Landscape rotation ${rotation}, 2340×1080`} px window at 450 dpi and font scale 1, captured over Remote Debug Bridge with the rotation locked. The Android navigation setting and configuration agree.`,
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  return {
    systemBars: { top: 34.13, right: 0, bottom: button ? 48 : 14.93, left: 0 },
    systemBarsPx: { top: 96, right: 0, bottom: button ? 135 : 42, left: 0 },
    displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 96, right: 0, bottom: 0, left: 0 },
    cutoutShape: { xDp: 167.82, yDp: 0, widthDp: 48.36, heightDp: 34.13, rightDp: 167.82, bottomDp: 797.87, xPx: 472, yPx: 0, widthPx: 136, heightPx: 96, rightPx: 472, bottomPx: 2244 },
    condition: condition(0),
    sources: [captureSource(`main-${mode}`, `main ${button ? "3-button" : "gesture"}`)],
  };
};

// Separate captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 29.87, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 84, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 34.13, bottom: 0, left: left ? 34.13 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 96, bottom: 0, left: left ? 96 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 797.87, yDp: 167.82, widthDp: 34.13, heightDp: 48.36, rightDp: left ? 797.87 : 0, bottomDp: 167.82,
      xPx: left ? 0 : 2244, yPx: 472, widthPx: 96, heightPx: 136, rightPx: left ? 2244 : 0, bottomPx: 472,
    },
    condition: condition(rotation),
    sources: [captureSource(`main-landscape-${rotation}-${mode}`, `rotation ${rotation}, ${mode}`)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

const sources = [skinLayout, captureSource("main-gesture", "main gesture"), captureSource("main-threeButton", "main 3-button")];

export const galaxyA26: Device = {
  slug: "galaxy-a26-5g",
  name: "Galaxy A26 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 0,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 0,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
    cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources,
  }],
  sources,
};
