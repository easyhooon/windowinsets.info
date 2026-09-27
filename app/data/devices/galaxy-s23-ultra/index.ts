import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S23 Ultra (SM-S918U) specifications",
  url: "https://www.samsung.com/us/business/mobile/phones/galaxy-s/galaxy-s23-ultra-256gb-unlocked-sm-s918uzaaxaa/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 6.8-inch (173.1 mm) Dynamic AMOLED 2X display at 3088×1440 (Quad HD+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S23 Ultra (SM-S918U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s23-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-S918U, build BP4A.251205.006.S918USQS8FZG1. Portrait rotation 0, default FHD+ 1080×2316 px full-screen capture scaled from the 1440×3088 physical panel, 450 dpi, font scale 1. The centered 54×94 px DisplayCutout bounding rectangle is in the same FHD+ coordinate space.";

const cutoutShape = { xDp: 182.4, yDp: 0, widthDp: 19.2, heightDp: 33.42222, rightDp: 182.4, bottomDp: 790.04444, xPx: 513, yPx: 0, widthPx: 54, heightPx: 94, rightPx: 513, bottomPx: 2222 };

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 33.42222, right: 0, bottom: mode === "gesture" ? 14.93333 : 48, left: 0 },
  systemBarsPx: { top: 94, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 33.42222, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
  cutoutShape,
  condition: {
    oneUi: "8.5",
    android: "16",
    note: `${base} Android setting, configuration and InsetsProbe navigation classification agree on ${mode === "gesture" ? "gesture" : "3-button"} mode.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyS23Ultra: Device = {
  slug: "galaxy-s23-ultra",
  name: "Galaxy S23 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3088 },
    logicalSizePx: { width: 1080, height: 2316 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 501,
    logicalSizeDp: { width: 384, height: 823.46667 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 3.91111, topRight: 3.91111, bottomRight: 3.91111, bottomLeft: 3.91111 },
    cornerRadiiPx: { topLeft: 11, topRight: 11, bottomRight: 11, bottomLeft: 11 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
