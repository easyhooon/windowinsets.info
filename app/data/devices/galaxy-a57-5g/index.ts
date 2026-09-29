import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A57 5G display specifications",
  url: "https://www.samsung.com/br/smartphones/galaxy-a/galaxy-a57-5g-awesome-icyblue-256gb-sm-a576blbfzto/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch, 1080×2340 FHD+ display; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A57 5G (SM-A576S), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a57-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => {
  if (mode === "gesture") return {
      systemBars: { top: 34.49, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 97, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 29.16, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 181.68889, yDp: 8.53333, widthDp: 20.62222, heightDp: 20.62222, rightDp: 181.68889, bottomDp: 802.84444, xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A57 5G (SM-A576S), build BP4A.251205.006.A576SKSU1AZG7. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    };
  if (mode === "threeButton") return {
      systemBars: { top: 34.49, right: 0, bottom: 48.00, left: 0 },
      systemBarsPx: { top: 97, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 29.16, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 181.68889, yDp: 8.53333, widthDp: 20.62222, heightDp: 20.62222, rightDp: 181.68889, bottomDp: 802.84444, xPx: 511, yPx: 24, widthPx: 58, heightPx: 58, rightPx: 511, bottomPx: 2258 },
      condition: { oneUi: "8.5", android: "16", note: "Samsung RTL, Galaxy A57 5G (SM-A576S), build BP4A.251205.006.A576SKSU1AZG7. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };
  return null;
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 29.87, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 84, right: button && left ? 135 : 0, bottom: button ? 0 : 42, left: button && !left ? 135 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 29.16, bottom: 0, left: left ? 29.16 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 82, bottom: 0, left: left ? 82 : 0 },
    cutoutShape: {
      xDp: left ? 8.53 : 802.84, yDp: 181.69, widthDp: 20.62, heightDp: 20.62, rightDp: left ? 802.84 : 8.53, bottomDp: 181.69,
      xPx: left ? 24 : 2258, yPx: 511, widthPx: 58, heightPx: 58, rightPx: left ? 2258 : 24, bottomPx: 511,
    },
    condition: {
      oneUi: "8.5",
      android: "16",
      note: `Samsung RTL Korea/Gumi, SM-A576S_KR1, build BP4A.251205.006.A576SKSU1AZG7. Landscape rotation ${rotation}, 2340×1080 px window at 450 dpi and font scale 1. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy A57 5G, rotation ${rotation}, ${mode} (SM-A576S)`,
      url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a57-5g/recapture-2026-09-29-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-29",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2340, height: 1080 },
  logicalSizeDp: { width: 832, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyA57: Device = {
  slug: "galaxy-a57-5g",
  name: "Galaxy A57 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 385,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 40.18, topRight: 40.18, bottomRight: 40.18, bottomLeft: 40.18 },
    cornerRadiiPx: { topLeft: 113, topRight: 113, bottomRight: 113, bottomLeft: 113 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
