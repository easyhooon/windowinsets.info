import type { Device, InsetsMeasurement, NavMode, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Flip3 5G Specifications",
  url: "https://news.samsung.com/ca/the-next-chapter-in-mobile-innovation-unfold-your-world-with-galaxy-z-fold3-5g-and-galaxy-z-flip3-5g",
  retrievedAt: "2026-09-24",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip3";
const measuredSource = (mode: "gesture" | "threeButton", date: string): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Flip3 main, ${mode} (SM-F711B)`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: date,
});
const gestureSource = measuredSource("gesture", "2026-09-24");
const threeButtonSource = measuredSource("threeButton", "2026-09-23");
const condition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL Vietnam/Hanoi, SM-F711B-VN2, physically unfolded in portrait (rotation 0). Active and maximum windows both 1080×2640 px; density 480 dpi matched the default. A horizontal FLAT folding feature crossed y=1320. Navigation modes were captured on separate reservations on 2026-09-23 and 2026-09-24. View rotation does not supply landscape insets.",
};
const cutoutShape = {
  xPx: 505, yPx: 0, widthPx: 71, heightPx: 94, rightPx: 504, bottomPx: 2546,
  xDp: 168.33, yDp: 0, widthDp: 23.67, heightDp: 31.33, rightDp: 168, bottomDp: 848.67,
};

// Separate InsetsProbe 1.6.0 captures of rotations 1 and 3; never derived from rotation 0.
const landscapeInsets = (rotation: 1 | 3, mode: NavMode): InsetsMeasurement => {
  const button = mode === "threeButton";
  const left = rotation === 1;
  return {
    systemBars: { top: 24, right: button && left ? 48 : 0, bottom: button ? 0 : 15, left: button && !left ? 48 : 0 },
    systemBarsPx: { top: 72, right: button && left ? 144 : 0, bottom: button ? 0 : 45, left: button && !left ? 144 : 0 },
    displayCutout: { top: 0, right: left ? 0 : 31.33, bottom: 0, left: left ? 31.33 : 0 },
    displayCutoutPx: { top: 0, right: left ? 0 : 94, bottom: 0, left: left ? 94 : 0 },
    cutoutShape: left
      ? { xPx: 0, yPx: 504, widthPx: 94, heightPx: 71, rightPx: 2546, bottomPx: 505, xDp: 0, yDp: 168, widthDp: 31.33, heightDp: 23.67, rightDp: 848.67, bottomDp: 168.33 }
      : { xPx: 2546, yPx: 505, widthPx: 94, heightPx: 71, rightPx: 0, bottomPx: 504, xDp: 848.67, yDp: 168.33, widthDp: 31.33, heightDp: 23.67, rightDp: 0, bottomDp: 168 },
    condition: {
      oneUi: "6.1",
      android: "14",
      note: `Samsung RTL Vietnam/Hanoi, SM-F711B-VN2, build UP1A.231005.007.F711BXXU7HXDB. Main display unfolded, landscape rotation ${rotation}, 2640×1080 px at 480 dpi and font scale 1, with a vertical FLAT folding feature at x=1320 px. Captured separately with InsetsProbe 1.6.0; the Android navigation setting and configuration agree.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Z Flip3 main, rotation ${rotation}, ${mode} (SM-F711B)`,
      url: `${captureBase}/recapture-2026-09-28-rotation/main-landscape-${rotation}-${mode}.json`,
      retrievedAt: "2026-09-28",
    }],
  };
};

const landscape = (rotation: 1 | 3) => ({
  logicalSizePx: { width: 2640, height: 1080 },
  logicalSizeDp: { width: 880, height: 360 },
  insets: { gesture: landscapeInsets(rotation, "gesture"), threeButton: landscapeInsets(rotation, "threeButton") },
});

export const galaxyZFlip3: Device = {
  slug: "galaxy-z-flip3",
  name: "Galaxy Z Flip3",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: 2021,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2640 },
      logicalSizePx: { width: 1080, height: 2640 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 425,
      logicalSizeDp: { width: 360, height: 880 },
      densityDpi: 480,
      cornerRadiiDp: { topLeft: 36, topRight: 36, bottomRight: 36, bottomLeft: 36 },
      cornerRadiiPx: { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 },
      insets: {
        gesture: {
          systemBars: { top: 31.33, right: 0, bottom: 15, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 45, left: 0 },
          displayCutout: { top: 31.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [gestureSource],
        },
        threeButton: {
          systemBars: { top: 31.33, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 144, left: 0 },
          displayCutout: { top: 31.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [threeButtonSource],
        },
      },
      rotations: { 1: landscape(1), 3: landscape(3) },
      sources: [samsungSpecs, gestureSource, threeButtonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
