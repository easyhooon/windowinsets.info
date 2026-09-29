import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S10 FE+ specifications",
  url: "https://www.samsung.com/sec/support/model/SM-X620NZAEKOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists 13.1-inch (332.8 mm), 2880×1800 WQXGA+; PPI is calculated from that diagonal and resolution.",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-fe-plus";
const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10 FE+ main (SM-X620), ${mode}`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const recaptureSource: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10 FE+ main (SM-X620), 2026-09-27 recapture of both modes",
  url: "https://github.com/easyhooon/windowinsets.info/tree/main/measurements/galaxy-tab/galaxy-tab-s10-fe-plus/recapture-2026-09-27",
  retrievedAt: "2026-09-27",
};
const gestureSource = captureSource("gesture");
const threeButtonSource = captureSource("threeButton");
const condition = { oneUi: "8.5", android: "16", note: "Samsung RTL Galaxy Tab S10 FE+ Wi-Fi (SM-X620), build BP4A.251205.006.X620XXS9CZG3. Main display landscape, rotation 1, full-screen 2880×1800 px, 320 dpi, font scale 1. InsetsProbe's non-foldable Phone label is classified as the tablet main display from model and skin-matching dimensions. Gesture mode is confirmed by Settings/config_navBarInteractionMode=2 and left/right system gesture insets although the inset-only heuristic reports threeButton due the nonzero tappable bottom inset. A 2026-09-27 recapture on the same build reproduced every value in both modes." };
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => {
  const values = mode === "gesture"
    ? { systemBars: {"top": 30.0, "right": 0.0, "bottom": 15.0, "left": 0.0}, systemBarsPx: {"top": 60, "right": 0, "bottom": 30, "left": 0}, displayCutout: {"top": 0.0, "right": 0.0, "bottom": 0.0, "left": 0.0}, displayCutoutPx: {"top": 0, "right": 0, "bottom": 0, "left": 0}, source: gestureSource }
    : { systemBars: {"top": 30.0, "right": 0.0, "bottom": 48.0, "left": 0.0}, systemBarsPx: {"top": 60, "right": 0, "bottom": 96, "left": 0}, displayCutout: {"top": 0.0, "right": 0.0, "bottom": 0.0, "left": 0.0}, displayCutoutPx: {"top": 0, "right": 0, "bottom": 0, "left": 0}, source: threeButtonSource };
  return { systemBars: values.systemBars, systemBarsPx: values.systemBarsPx, displayCutout: values.displayCutout, displayCutoutPx: values.displayCutoutPx, condition, sources: [values.source, recaptureSource] };
};

const rotationBase = `${captureBase}/recapture-2026-09-29-rotation`;
const rotationNote = "Samsung RTL Korea/Gumi, SM-X620_KR3, same build BP4A.251205.006.X620XXS9CZG3, 320 dpi and font scale 1. Driven over Remote Debug Bridge (adb): navigation was selected in Settings and each rotation was fixed with `cmd window user-rotation lock`, because Android 16 ignores the probe's orientation requests on this large screen. Rotation 1 from the same session reproduces the accepted capture exactly in both modes.";
// Every rotation keeps the same bars: the taskbar stays at the bottom and there is no cutout.
const rotationCapture = (file: string, width: number, height: number) => {
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
    ...measurement(mode),
    condition: { oneUi: "8.5", android: "16", note: rotationNote },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.1 on Samsung RTL Galaxy Tab S10 FE+ main (SM-X620), ${file}, ${mode}`,
      url: `${rotationBase}/${file}-${mode}.json`,
      retrievedAt: "2026-09-30",
    }],
  });
  return { logicalSizePx: { width, height }, logicalSizeDp: { width: width / 2, height: height / 2 }, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
};

export const GalaxyTabS10FePlus: Device = {
  slug: "galaxy-tab-s10-fe-plus",
  name: "Galaxy Tab S10 FE+",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 13.1,
    resolutionPx: { width: 2880, height: 1800 },
    logicalSizePx: { width: 2880, height: 1800 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 259,
    logicalSizeDp: { width: 1440.00, height: 900.00 },
    densityDpi: 320,
    cornerRadiiDp: { topLeft: 13.0, topRight: 13.0, bottomRight: 13.0, bottomLeft: 13.0 },
    cornerRadiiPx: { topLeft: 26, topRight: 26, bottomRight: 26, bottomLeft: 26 },
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") },
    rotations: {
      0: rotationCapture("main", 1800, 2880),
      2: rotationCapture("portrait-2", 1800, 2880),
      3: rotationCapture("landscape-3", 2880, 1800),
    },
    sources: [samsungSpecs, gestureSource, threeButtonSource, recaptureSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource, recaptureSource],
};
