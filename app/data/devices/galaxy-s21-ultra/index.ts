import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy S21 Ultra display specifications",
  url: "https://www.samsung.com/cz/support/mobile-devices/srovnani-modelu-smartphonu-galaxy-s21-ultra-5g-s21-5g-a-note10/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.8-inch display and 3200×1440 px resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy S21 Ultra (SM-G998B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s21-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => mode === "gesture"
  ? {
  systemBars: { top: 26.67, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 181.68889, yDp: 0.00000, widthDp: 20.62222, heightDp: 26.66667, rightDp: 181.68889, bottomDp: 826.66667, xPx: 511, yPx: 0, widthPx: 58, heightPx: 75, rightPx: 511, bottomPx: 2325 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G998B, build UP1A.231005.007.G998BXXUCGXGC. Portrait rotation 0, 1080×2400 px active window, 450 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The 1080×2400 px active window is FHD+ on the 1440×3200 physical panel." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 26.67, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: 135, left: 0 },
  displayCutout: { top: 26.66667, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 181.68889, yDp: 0.00000, widthDp: 20.62222, heightDp: 26.66667, rightDp: 181.68889, bottomDp: 826.66667, xPx: 511, yPx: 0, widthPx: 58, heightPx: 75, rightPx: 511, bottomPx: 2325 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-G998B, build UP1A.231005.007.G998BXXUCGXGC. Portrait rotation 0, 1080×2400 px active window, 450 dpi, font scale 1. Android navigation setting and InsetsProbe classification agree. The 1080×2400 px active window is FHD+ on the 1440×3200 physical panel." },
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
    cutoutShape: {
      xDp: left ? 0 : 826.67, yDp: 181.69, widthDp: 26.67, heightDp: 20.62, rightDp: left ? 826.67 : 0, bottomDp: 181.69,
      xPx: left ? 0 : 2325, yPx: 511, widthPx: 75, heightPx: 58, rightPx: left ? 2325 : 0, bottomPx: 511,
    },
    condition: {
      oneUi: "6.1",
      android: "14",
      note: `Samsung RTL India/Noida, SM-G998U1-IN2, build UP1A.231005.007.G998U1UESEGYA5. The unit was set to WQHD+ and was switched to the default FHD+ before measuring. Landscape rotation ${rotation}, 2400×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; rotation 0 reproduces the accepted SM-G998B values exactly.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy S21 Ultra, rotation ${rotation}, ${mode} (SM-G998U1)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-s21-ultra/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2400, height: 1080 },
  logicalSizeDp: { width: 853.33, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyS21Ultra: Device = {
  slug: "galaxy-s21-ultra",
  name: "Galaxy S21 Ultra",
  brand: "Samsung",
  series: "Galaxy S",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.8,
    resolutionPx: { width: 1440, height: 3200 },
    logicalSizePx: { width: 1080, height: 2400 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 516,
    logicalSizeDp: { width: 384.00, height: 853.33 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
