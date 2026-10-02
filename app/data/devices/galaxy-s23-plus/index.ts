import type { Device, Insets, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S23+ (SM-S916U) specifications",
  url: "https://www.samsung.com/us/business/mobile/phones/galaxy-s/galaxy-s23-plus-256gb-unlocked-sm-s916uzeaxaa/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 6.6-inch Dynamic AMOLED 2X display at 2340×1080 (FHD+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S23+ (SM-S916U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s23-plus/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-S916U, build BP2A.250605.031.A3.S916USQS6EYK3. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1.";

const cutoutShape = { xDp: 182.75556, yDp: 0, widthDp: 18.48889, heightDp: 26.31111, rightDp: 182.75556, bottomDp: 805.68889, xPx: 514, yPx: 0, widthPx: 52, heightPx: 74, rightPx: 514, bottomPx: 2266 };

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 26.31111, right: 0, bottom: mode === "gesture" ? 14.93333 : 48, left: 0 },
  systemBarsPx: { top: 74, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 26.31111, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 74, right: 0, bottom: 0, left: 0 },
  cutoutShape,
  condition: {
    oneUi: "8.0",
    android: "16",
    note: `${base} Android setting, configuration and InsetsProbe navigation classification agree on ${mode === "gesture" ? "gesture" : "3-button"} mode.`,
  },
  sources: [captureSource(mode)],
});

// Landscape captures (issue #22): separate RTL captures of the same unit, not rotated portrait values.
const DENSITY = 450 / 160;
const dp = (px: Insets): Insets => ({ top: px.top / DENSITY, right: px.right / DENSITY, bottom: px.bottom / DENSITY, left: px.left / DENSITY });
const landscapeSource = (rotation: 1 | 3, mode: "gesture" | "threeButton"): Source => {
  // Rotation 3 gesture comes from the 2026-10-02 RDB sweep; the rest are the 2026-09-27 captures.
  const recapture = rotation === 3 && mode === "gesture";
  return {
    kind: "measured",
    label: `InsetsProbe ${recapture ? "1.7.0" : "1.3.0"} on Samsung RTL Galaxy S23+ (SM-S916U), landscape rotation ${rotation} ${mode === "gesture" ? "gesture" : "3-button"}`,
    url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s23-plus/${recapture ? "recapture-2026-10-02-rotation/" : ""}landscape-${rotation}-${mode}.json`,
    retrievedAt: recapture ? "2026-10-02" : "2026-09-27",
  };
};
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton", systemBarsPx: Insets): InsetsMeasurement => {
  // Rotation 1: cutout on the left edge; rotation 3: on the right edge.
  const displayCutoutPx = rotation === 1 ? { top: 0, right: 0, bottom: 0, left: 74 } : { top: 0, right: 74, bottom: 0, left: 0 };
  const xPx = rotation === 1 ? 0 : 2266;
  return {
    systemBars: dp(systemBarsPx),
    systemBarsPx,
    displayCutout: dp(displayCutoutPx),
    displayCutoutPx,
    cutoutShape: {
      xDp: xPx / DENSITY, yDp: 514 / DENSITY, widthDp: 74 / DENSITY, heightDp: 52 / DENSITY,
      rightDp: (2340 - xPx - 74) / DENSITY, bottomDp: (1080 - 566) / DENSITY,
      xPx, yPx: 514, widthPx: 74, heightPx: 52, rightPx: 2340 - xPx - 74, bottomPx: 1080 - 566,
    },
    condition: {
      oneUi: "8.0",
      android: "16",
      note: `Samsung RTL, SM-S916U${rotation === 3 && mode === "gesture" ? " (USA/TX unit US01, captured over Remote Debug Bridge; the same sweep's other five files reproduce the accepted captures exactly)" : ""}, build BP2A.250605.031.A3.S916USQS6EYK3. Landscape rotation ${rotation}, 2340×1080 px full-screen capture, 450 dpi, font scale 1. The status bar is 84 px here versus 74 px in portrait.`,
    },
    sources: [landscapeSource(rotation, mode)],
  };
};
const landscapeSize = { logicalSizePx: { width: 2340, height: 1080 }, logicalSizeDp: { width: 832, height: 384 } };

export const galaxyS23Plus: Device = {
  slug: "galaxy-s23-plus",
  name: "Galaxy S23+",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 390,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 35.91111, topRight: 35.91111, bottomRight: 35.91111, bottomLeft: 35.91111 },
    cornerRadiiPx: { topLeft: 101, topRight: 101, bottomRight: 101, bottomLeft: 101 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: {
      1: { ...landscapeSize, insets: {
        gesture: landscapeInsets(1, "gesture", { top: 84, right: 0, bottom: 42, left: 0 }),
        threeButton: landscapeInsets(1, "threeButton", { top: 84, right: 135, bottom: 0, left: 0 }),
      } },
      3: { ...landscapeSize, insets: {
        gesture: landscapeInsets(3, "gesture", { top: 84, right: 0, bottom: 42, left: 0 }),
        threeButton: landscapeInsets(3, "threeButton", { top: 84, right: 0, bottom: 0, left: 135 }),
      } },
    },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
