import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Flip Specifications",
  url: "https://news.samsung.com/kr/%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90-%EC%83%88%EB%A1%9C%EC%9A%B4-%ED%8F%BC%ED%8C%A9%ED%84%B0-%ED%8F%B4%EB%8D%94%EB%B8%94%ED%8F%B0-%EA%B0%A4%EB%9F%AD%EC%8B%9C-z-%ED%94%8C%EB%A6%BD-%EC%A0%84%EA%B2%A9-%EA%B3%B5%EA%B0%9C",
  retrievedAt: "2026-09-24",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip";
const measuredSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Flip main, ${mode} (SM-F700F-IN5)`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-24",
});
const gestureSource = measuredSource("gesture");
const threeButtonSource = measuredSource("threeButton");
const condition = {
  oneUi: "5.1.1",
  android: "13",
  note: "Samsung RTL India/Noida, SM-F700F-IN5, unfolded in portrait (rotation 0). Active and maximum windows both 1080×2636 px; density 480 dpi matched the default and font scale was 1. A horizontal FLAT folding feature crossed y=1318; the hinge-angle sensor was unavailable. Android Settings and InsetsProbe agreed on each navigation mode. View rotation does not supply landscape insets.",
};
const cutoutShape = {
  xPx: 495, yPx: 0, widthPx: 91, heightPx: 91, rightPx: 494, bottomPx: 2545,
  xDp: 165, yDp: 0, widthDp: 30.33, heightDp: 30.33, rightDp: 164.67, bottomDp: 848.33,
};
const cornerRadiiDp = { topLeft: 36, topRight: 36, bottomRight: 36, bottomLeft: 36 };
const cornerRadiiPx = { topLeft: 108, topRight: 108, bottomRight: 108, bottomLeft: 108 };

export const galaxyZFlip: Device = {
  slug: "galaxy-z-flip",
  name: "Galaxy Z Flip",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: 2020,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2636 },
      logicalSizePx: { width: 1080, height: 2636 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 425,
      logicalSizeDp: { width: 360, height: 878.67 },
      densityDpi: 480,
      cornerRadiiDp,
      cornerRadiiPx,
      insets: {
        gesture: {
          systemBars: { top: 30.67, right: 0, bottom: 15, left: 0 },
          systemBarsPx: { top: 92, right: 0, bottom: 45, left: 0 },
          displayCutout: { top: 30.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 91, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [gestureSource],
        },
        threeButton: {
          systemBars: { top: 30.67, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 92, right: 0, bottom: 144, left: 0 },
          displayCutout: { top: 30.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 91, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [threeButtonSource],
        },
      },
      sources: [samsungSpecs, gestureSource, threeButtonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
