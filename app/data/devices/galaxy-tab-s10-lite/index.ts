import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S10 Lite 5G specifications",
  url: "https://www.samsung.com/uk/tablets/galaxy-tab-s/galaxy-tab-s10-lite-grey-128gb-5g-sm-x406bzareub/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 10.9-inch (277.0 mm) TFT display at 2112×1320 (WUXGA+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10 Lite (SM-X406B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-lite/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-X406B, build BP2A.250605.031.A3.X406BXXS2BYJ5. landscape rotation 1, 2112×1320 px full-screen capture, 240 dpi, font scale 1.15; the same-OS-family Tab S10 FE showed identical insets at font scales 1.08 and 1.";

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 30, right: 0, bottom: mode === "gesture" ? 15.33 : 48, left: 0 },
  systemBarsPx: { top: 45, right: 0, bottom: mode === "gesture" ? 23 : 72, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: {
    oneUi: "8.0",
    android: "16",
    note: mode === "gesture"
      ? `${base} Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 45/45 px; inset-only classification says threeButton because of the nonzero tappable bottom inset. The 23 px (15.33 dp) bottom navigation, system-bar and tappable inset matches the One UI 8 gesture-handle pattern seen on Tab S10 FE.`
      : `${base} 3-button mode agrees with Settings, configuration and InsetsProbe. Probe used its generic Phone label; model and skin-matching dimensions establish the tablet Main display.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyTabS10Lite: Device = {
  slug: "galaxy-tab-s10-lite",
  name: "Galaxy Tab S10 Lite",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 10.9,
    resolutionPx: { width: 2112, height: 1320 },
    logicalSizePx: { width: 2112, height: 1320 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 228,
    logicalSizeDp: { width: 1408, height: 880 },
    densityDpi: 240,
    cornerRadiiDp: { topLeft: 13.33, topRight: 13.33, bottomRight: 13.33, bottomLeft: 13.33 },
    cornerRadiiPx: { topLeft: 20, topRight: 20, bottomRight: 20, bottomLeft: 20 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
