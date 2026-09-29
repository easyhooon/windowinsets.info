import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S20 FE display specifications",
  url: "https://www.samsung.com/it/business/smartphones/galaxy-s/galaxy-s20-fe-cloud-navy-128gb-sm-g780gzbdeue/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.5-inch display and 2400×1080 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S20 FE (SM-G780G), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s20-fe/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 29.33, right: 0, bottom: 15, left: 0 },
      systemBarsPx: { top: 88, right: 0, bottom: 45, left: 0 },
      displayCutout: { top: 29.33333, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 88, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.66667, yDp: 0, widthDp: 18.66667, heightDp: 29.33333, rightDp: 170.66667, bottomDp: 770.66667, xPx: 512, yPx: 0, widthPx: 56, heightPx: 88, rightPx: 512, bottomPx: 2312 },
      condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-G780G, build TP1A.220624.014.G780GXXSEEXL1. Portrait rotation 0, 1080×2400 px active window, 480 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 29.33, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 88, right: 0, bottom: 144, left: 0 },
      displayCutout: { top: 29.33333, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 88, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 18.67, heightDp: 29.33, rightDp: 170.67, bottomDp: 770.67, xPx: 512, yPx: 0, widthPx: 56, heightPx: 88, rightPx: 512, bottomPx: 2312 },
      condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-G780G, build TP1A.220624.014.G780GXXSEEXL1. Portrait rotation 0, 1080×2400 px active window, 480 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The raw capturedAt field reports 2024-12-27 despite the user's confirmation that this 3-button capture was measured alongside the gesture capture. The host download was modified on 2026-09-25 14:30:57 KST, 13 seconds after the gesture file; preserve the reported device timestamp unchanged as a clock anomaly." },
      sources: [captureSource("threeButton")],
    };

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24, right: button && left ? 48 : 0, bottom: button ? 0 : 15, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 72, right: button && left ? 144 : 0, bottom: button ? 0 : 45, left: button && !left ? 144 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 29.33, bottom: 0, left: left ? 29.33 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 88, bottom: 0, left: left ? 88 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 770.67, yDp: 170.67, widthDp: 29.33, heightDp: 18.67, rightDp: left ? 770.67 : 0, bottomDp: 170.67,
      xPx: left ? 0 : 2312, yPx: 512, widthPx: 88, heightPx: 56, rightPx: left ? 2312 : 0, bottomPx: 512,
    },
    condition: {
      oneUi: "5.1",
      android: "13",
      note: `Samsung RTL India/Noida, SM-G780G-IN3, build TP1A.220624.014.G780GXXSEEXL1. Landscape rotation ${rotation}, 2400×1080 px window at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree. Uploads timed out, so the files were downloaded from the device's app storage.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S20 FE, rotation ${rotation}, ${mode} (SM-G780G)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s/galaxy-s20-fe/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2400, height: 1080 },
  logicalSizeDp: { width: 800, height: 360 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS20Fe: Device = {
  slug: "galaxy-s20-fe",
  name: "Galaxy S20 FE",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2020,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 405,
    logicalSizeDp: { width: 360.00, height: 800.00 },
    densityDpi: 480,
    cornerRadiiDp: { topLeft: 32.00, topRight: 32.00, bottomRight: 32.00, bottomLeft: 32.00 },
    cornerRadiiPx: { topLeft: 96, topRight: 96, bottomRight: 96, bottomLeft: 96 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
