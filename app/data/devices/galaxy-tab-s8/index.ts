import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S8 display specifications",
  url: "https://www.samsung.com/co/multistore/co_epp_secret/feature.SM-X706BZAWCOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 11-inch display and 2560×1600 resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S8 (SM-X706N), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s8/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 30.12, right: 0, bottom: 15.06, left: 0 },
      systemBarsPx: { top: 64, right: 0, bottom: 32, left: 0 },
      displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
      condition: { oneUi: "8.0", android: "16", note: "Samsung RTL, SM-X706N, build BP2A.250605.031.A3.X706NKOSBJZE1. landscape rotation 1, 2560×1600 px full-screen capture, 340 dpi, font scale 1. Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 63/63 px; inset-only classification says threeButton, so preserve the mode recorded by Settings/configuration." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 30.12, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 64, right: 0, bottom: 102, left: 0 },
      displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
      condition: { oneUi: "8.0", android: "16", note: "Samsung RTL, SM-X706N, build BP2A.250605.031.A3.X706NKOSBJZE1. landscape rotation 1, 2560×1600 px full-screen capture, 340 dpi, font scale 1." },
      sources: [captureSource("threeButton")],
    };

export const galaxyTabS8: Device = {
  slug: "galaxy-tab-s8",
  name: "Galaxy Tab S8",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 11,
    resolutionPx: { width: 2560, height: 1600 },
    logicalSizePx: { width: 2560, height: 1600 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 274,
    logicalSizeDp: { width: 1204.70588, height: 752.94118 },
    densityDpi: 340,
    cornerRadiiDp: { topLeft: 13.17647, topRight: 13.17647, bottomRight: 13.17647, bottomLeft: 13.17647 },
    cornerRadiiPx: { topLeft: 28, topRight: 28, bottomRight: 28, bottomLeft: 28 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
