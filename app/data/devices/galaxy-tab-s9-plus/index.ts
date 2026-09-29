import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S9+ display specifications",
  url: "https://www.samsung.com/ie/business/tablets/galaxy-tab-s/galaxy-tab-s9-plus-5g-beige-256gb-sm-x816bzeaeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 12.4-inch display and 2800×1752 WQXGA+ resolution; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S9+ (SM-X816B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s9-plus/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
  systemBars: { top: 24, right: 0, bottom: 64, left: 0 },
  systemBarsPx: { top: 51, right: 0, bottom: 136, left: 0 },
  displayCutout: { top: 0.00000, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-X816B, build UP1A.231005.007.X816BXXS2BXD2. landscape rotation 1, 2800×1752 px full-screen capture, 340 dpi, font scale 1. Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 63/63 px; inset-only classification says threeButton, so preserve the mode recorded by Settings/configuration." },
  sources: [captureSource("gesture")],
}
  : {
  systemBars: { top: 24, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 51, right: 0, bottom: 102, left: 0 },
  displayCutout: { top: 0.00000, right: 0.00000, bottom: 0.00000, left: 0.00000 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, SM-X816B, build UP1A.231005.007.X816BXXS2BXD2. landscape rotation 1, 2800×1752 px full-screen capture, 340 dpi, font scale 1." },
  sources: [captureSource("threeButton")],
};

export const galaxyTabS9Plus: Device = {
  slug: "galaxy-tab-s9-plus",
  name: "Galaxy Tab S9+",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 12.4,
    resolutionPx: { width: 2800, height: 1752 },
    logicalSizePx: { width: 2800, height: 1752 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 266,
    logicalSizeDp: { width: 1317.64706, height: 824.47059 },
    densityDpi: 340,
    cornerRadiiDp: { topLeft: 13.17647, topRight: 13.17647, bottomRight: 13.17647, bottomLeft: 13.17647 },
    cornerRadiiPx: { topLeft: 28, topRight: 28, bottomRight: 28, bottomLeft: 28 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
