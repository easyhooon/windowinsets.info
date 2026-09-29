import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S20 Ultra display specifications",
  url: "https://www.samsung.com/my/smartphones/galaxy-s20/specs/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.9-inch display and 3200×1440 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S20 Ultra (SM-G988B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s20-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => mode === "gesture"
  ? {
  systemBars: { top: 28.19, right: 0, bottom: 14.86, left: 0 },
  systemBarsPx: { top: 74, right: 0, bottom: 39, left: 0 },
  displayCutout: { top: 28.19048, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 74, right: 0, bottom: 0, left: 0 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-G988B, build TP1A.220624.014.G988BXXSNHYB1. Portrait rotation 0, 1080×2400 px active window, 420 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The 1080×2400 px active window is FHD+ on the 1440×3200 physical panel. The raw cutout bounds are centered near x=720 despite a 1080 px active window, so only the safe inset is rendered; no cutout shape is inferred." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 28.19, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 74, right: 0, bottom: 126, left: 0 },
  displayCutout: { top: 28.19048, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 74, right: 0, bottom: 0, left: 0 },
  condition: { oneUi: "5.1", android: "13", note: "Samsung RTL, SM-G988B, build TP1A.220624.014.G988BXXSNHYB1. Portrait rotation 0, 1080×2400 px active window, 420 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The 1080×2400 px active window is FHD+ on the 1440×3200 physical panel. The raw cutout bounds are centered near x=720 despite a 1080 px active window, so only the safe inset is rendered; no cutout shape is inferred." },
  sources: [captureSource("threeButton")],
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
// The raw cutout rectangles keep the same off-center placement as rotation 0, so no shape is registered.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24, right: button && left ? 48 : 0, bottom: button ? 0 : 14.86, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 63, right: button && left ? 126 : 0, bottom: button ? 0 : 39, left: button && !left ? 126 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 28.19, bottom: 0, left: left ? 28.19 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 74, bottom: 0, left: left ? 74 : 0 },
    condition: {
      oneUi: "5.1",
      android: "13",
      note: `Samsung RTL Russia/Moscow, SM-G988B-RU1, build TP1A.220624.014.G988BXXSNHYB1. Landscape rotation ${rotation}, FHD+ 2400×1080 px window at 420 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S20 Ultra, rotation ${rotation}, ${mode} (SM-G988B)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s20-ultra/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2400, height: 1080 },
  logicalSizeDp: { width: 914.29, height: 411.43 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS20Ultra: Device = {
  slug: "galaxy-s20-ultra",
  name: "Galaxy S20 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2020,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.9,
    resolutionPx: { width: 1440, height: 3200 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 509,
    logicalSizeDp: { width: 411.43, height: 914.29 },
    densityDpi: 420,
    cornerRadiiDp: { topLeft: 24.00, topRight: 24.00, bottomRight: 24.00, bottomLeft: 24.00 },
    cornerRadiiPx: { topLeft: 63, topRight: 63, bottomRight: 63, bottomLeft: 63 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
