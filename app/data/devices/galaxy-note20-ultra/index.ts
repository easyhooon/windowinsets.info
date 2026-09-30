import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Note20 Ultra 5G display specifications",
  url: "https://news.samsung.com/global/samsung-unveils-five-new-power-devices-in-the-galaxy-ecosystem-to-empower-their-work-and-play",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.9-inch display with 3088×1440 resolution and 496 ppi.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Note20 Ultra 5G (SM-N985F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-note/galaxy-note20-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 25.52, right: 0, bottom: 14.86, left: 0 },
      systemBarsPx: { top: 67, right: 0, bottom: 39, left: 0 },
      displayCutout: { top: 25.52, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 67, right: 0, bottom: 0, left: 0 },
      condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-N985F, build TP1A.220624.014.N985FXXSIHYH3. Portrait rotation 0, 1080×2316 px full-screen active window, 420 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The active window is FHD+ on the 1440×3088 physical panel. Raw cutout bounds are centered near x=720 despite the 1080 px active window, so only the safe inset is rendered; no cutout shape is inferred." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 25.52, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 67, right: 0, bottom: 126, left: 0 },
      displayCutout: { top: 25.52, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 67, right: 0, bottom: 0, left: 0 },
      condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-N985F, build TP1A.220624.014.N985FXXSIHYH3. Portrait rotation 0, 1080×2316 px full-screen active window, 420 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The active window is FHD+ on the 1440×3088 physical panel. Raw cutout bounds are centered near x=720 despite the 1080 px active window, so only the safe inset is rendered; no cutout shape is inferred." },
      sources: [captureSource("threeButton")],
    };

const landscapeThreeButton = (rotation: 1 | 3): InsetsMeasurement => ({
  systemBars: { top: 24, right: rotation === 1 ? 48 : 0, bottom: 0, left: rotation === 3 ? 48 : 0 },
  systemBarsPx: { top: 63, right: rotation === 1 ? 126 : 0, bottom: 0, left: rotation === 3 ? 126 : 0 },
  displayCutout: { top: 0, right: rotation === 3 ? 25.52 : 0, bottom: 0, left: rotation === 1 ? 25.52 : 0 },
  displayCutoutPx: { top: 0, right: rotation === 3 ? 67 : 0, bottom: 0, left: rotation === 1 ? 67 : 0 },
  condition: {
    oneUi: "5.1",
    android: "13",
    note: `Samsung RTL Russia/Moscow, SM-N985F-RU1, build TP1A.220624.014.N985FXXSIHYH3. Separate landscape rotation ${rotation} capture at 2316×1080 px, 420 dpi and font scale 1. Android navigation setting and InsetsProbe agree on 3-button mode. The cutout rectangle is off-centre, so only its safe inset is registered.`,
  },
  sources: [{
    kind: "measured",
    label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Note20 Ultra, rotation ${rotation}, 3-button (SM-N985F)`,
    url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-note/galaxy-note20-ultra/recapture-2026-09-29-rotation/main-landscape-${rotation}-threeButton.json`,
    retrievedAt: "2026-09-29",
  }],
});

// Gesture rotations come from the 2026-09-30 sweep, whose navigation setting and configuration agree.
const landscapeGesture = (rotation: 1 | 3): InsetsMeasurement => ({
  systemBars: { top: 24, right: 0, bottom: 14.86, left: 0 },
  systemBarsPx: { top: 63, right: 0, bottom: 39, left: 0 },
  displayCutout: { top: 0, right: rotation === 3 ? 25.52 : 0, bottom: 0, left: rotation === 1 ? 25.52 : 0 },
  displayCutoutPx: { top: 0, right: rotation === 3 ? 67 : 0, bottom: 0, left: rotation === 1 ? 67 : 0 },
  condition: {
    oneUi: "5.1",
    android: "13",
    note: `Samsung RTL Russia/Moscow, SM-N985F-RU1, build TP1A.220624.014.N985FXXSIHYH3. Separate landscape rotation ${rotation} capture at 2316×1080 px, 420 dpi and font scale 1, driven over Remote Debug Bridge with gesture navigation selected in Settings and the rotation locked. Secure navigation mode 2 and config_navBarInteractionMode=2 agree, and the same session's rotation 0 file reproduces the accepted gesture capture. The cutout rectangle is off-centre, so only its safe inset is registered.`,
  },
  sources: [{
    kind: "measured",
    label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Note20 Ultra, rotation ${rotation}, gesture (SM-N985F)`,
    url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-note/galaxy-note20-ultra/recapture-2026-09-30-gesture-rotation/main-landscape-${rotation}-gesture.json`,
    retrievedAt: "2026-09-30",
  }],
});

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2316, height: 1080 },
  logicalSizeDp: { width: 882.29, height: 411.43 },
  insets: { gesture: landscapeGesture(rotation), threeButton: landscapeThreeButton(rotation) },
});

export const galaxyNote20Ultra: Device = {
  slug: "galaxy-note20-ultra",
  name: "Galaxy Note20 Ultra",
  brand: "Samsung",
  series: "Galaxy Note",
  formFactor: "bar",
  releaseYear: 2020,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.9,
    resolutionPx: { width: 1440, height: 3088 },
    logicalSizePx: { width: 1080, height: 2316 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 496,
    logicalSizeDp: { width: 411.43, height: 882.29 },
    densityDpi: 420,
    cornerRadiiDp: { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 },
    cornerRadiiPx: { topLeft: 63, topRight: 63, bottomRight: 63, bottomLeft: 63 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
