import type { Device, InsetsMeasurement, Source } from "../../types";

const skinLayout: Source = {
  kind: "official",
  label: "Samsung Galaxy Emulator Skin layout for Galaxy A13 5G",
  url: "https://developer.samsung.com/galaxy-emulator-skin",
  retrievedAt: "2026-09-22",
  note: "The skin supplies the device artwork. The 720×1600 px panel comes from the captured display size; diagonal and PPI stay pending until an official specification page is retrieved.",
};

const captureUrl = (file: string) =>
  `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a13-5g/rtl-2026-09-30/${file}.json`;

const captureSource = (file: string, what: string): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy A13 5G (SM-A136B), ${what}`,
  url: captureUrl(file),
  retrievedAt: "2026-09-30",
});

const condition = (rotation: 0 | 1 | 3) => ({
  oneUi: "6.1",
  android: "14",
  note: `Samsung RTL Vietnam/Hanoi, SM-A136B-VN2, build UP1A.231005.007.A136BXXSBDYD2. ${rotation === 0 ? "Portrait rotation 0, 720×1600" : `Landscape rotation ${rotation}, 1600×720`} px window at 300 dpi and font scale 1, captured over Remote Debug Bridge with the rotation locked. The Android navigation setting and configuration agree. The probe reported no rounded corners.`,
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  return {
    systemBars: { top: 24, right: 0, bottom: button ? 48 : 14.93, left: 0 },
    systemBarsPx: { top: 45, right: 0, bottom: button ? 90 : 28, left: 0 },
    displayCutout: { top: 24, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 45, right: 0, bottom: 0, left: 0 },
    cutoutShape: { xDp: 145.07, yDp: 0, widthDp: 93.87, heightDp: 24, rightDp: 145.07, bottomDp: 829.33, xPx: 272, yPx: 0, widthPx: 176, heightPx: 45, rightPx: 272, bottomPx: 1555 },
    condition: condition(0),
    sources: [captureSource(`main-${mode}`, `main ${button ? "3-button" : "gesture"}`)],
  };
};

// Separate captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24, right: button && left ? 48 : 0, bottom: button ? 0 : 14.93, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 45, right: button && left ? 90 : 0, bottom: button ? 0 : 28, left: button && !left ? 90 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 24, bottom: 0, left: left ? 24 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 45, bottom: 0, left: left ? 45 : 0 },
    cutoutShape: {
      xDp: left ? 0 : 829.33, yDp: 145.07, widthDp: 24, heightDp: 93.87, rightDp: left ? 829.33 : 0, bottomDp: 145.07,
      xPx: left ? 0 : 1555, yPx: 272, widthPx: 45, heightPx: 176, rightPx: left ? 1555 : 0, bottomPx: 272,
    },
    condition: condition(rotation),
    sources: [captureSource(`main-landscape-${rotation}-${mode}`, `rotation ${rotation}, ${mode}`)],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 1600, height: 720 },
  logicalSizeDp: { width: 853.33, height: 384 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

const sources = [skinLayout, captureSource("main-gesture", "main gesture"), captureSource("main-threeButton", "main 3-button")];

export const galaxyA13FiveG: Device = {
  slug: "galaxy-a13-5g",
  name: "Galaxy A13 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 0,
    resolutionPx: { width: 720, height: 1600 },
    logicalSizePx: { width: 720, height: 1600 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 0,
    logicalSizeDp: { width: 384, height: 853.33 },
    densityDpi: 300,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: { 1: landscape(1), 3: landscape(3) },
    sources,
  }],
  sources,
};
