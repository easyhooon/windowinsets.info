import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Note20 display specifications",
  url: "https://www.samsung.com/us/business/support/owners/product/galaxy-note20-5g-verizon/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch display, 2400×1080 FHD+ resolution and 393 ppi.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Note20 (SM-N981U), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-note/galaxy-note20/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 32.71, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 92, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 32.71111, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.84444, yDp: 0.00000, widthDp: 26.31111, heightDp: 32.71111, rightDp: 178.84444, bottomDp: 820.62222, xPx: 503, yPx: 0, widthPx: 74, heightPx: 92, rightPx: 503, bottomPx: 2308 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-N981U, build TP1A.220624.014.N981USQS6HXC1. portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 32.71, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 92, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 32.71111, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.84444, yDp: 0.00000, widthDp: 26.31111, heightDp: 32.71111, rightDp: 178.84444, bottomDp: 820.62222, xPx: 503, yPx: 0, widthPx: 74, heightPx: 92, rightPx: 503, bottomPx: 2308 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-N981U, build TP1A.220624.014.N981USQS6HXC1. portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1." },
  sources: [captureSource("threeButton")],
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24.18, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 68, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 32.71, bottom: 0, left: left ? 32.71 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 92, bottom: 0, left: left ? 92 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 820.62, yDp: 178.84, widthDp: 32.71, heightDp: 26.31, rightDp: left ? 820.62 : 0, bottomDp: 178.84,
      xPx: left ? 0 : 2308, yPx: 503, widthPx: 92, heightPx: 74, rightPx: left ? 2308 : 0, bottomPx: 503,
    },
    condition: {
      oneUi: "5.1",
      android: "13",
      note: `Samsung RTL USA/Texas, SM-N981U-US03, build TP1A.220624.014.N981USQS6HXC1. Landscape rotation ${rotation}, 2400×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Note20, rotation ${rotation}, ${mode} (SM-N981U)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-note/galaxy-note20/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2400, height: 1080 },
  logicalSizeDp: { width: 853.33, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyNote20: Device = {
  slug: "galaxy-note20",
  name: "Galaxy Note20",
  brand: "Samsung",
  series: "Galaxy Note",
  formFactor: "bar",
  releaseYear: 2020,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2400 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 393,
    logicalSizeDp: { width: 384.00000, height: 853.33333 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 8.88889, topRight: 8.88889, bottomRight: 8.88889, bottomLeft: 8.88889 },
    cornerRadiiPx: { topLeft: 25, topRight: 25, bottomRight: 25, bottomLeft: 25 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
