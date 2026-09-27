import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S10+ Wi-Fi specifications",
  url: "https://www.samsung.com/uk/business/tablets/galaxy-tab-s/galaxy-tab-s10-plus-silver-256gb-wi-fi-sm-x820nzsreub/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 12.4-inch Dynamic AMOLED 2X display at 2800×1752 (WQXGA+); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10+ (SM-X820), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab-s10-plus/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-X820, build UP1A.231005.007.X820XXS2AYB3. landscape rotation 1, 2800×1752 px full-screen capture, 320 dpi, font scale 1.";

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 24, right: 0, bottom: mode === "gesture" ? 64 : 48, left: 0 },
  systemBarsPx: { top: 48, right: 0, bottom: mode === "gesture" ? 128 : 96, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: {
    oneUi: "6.1.1",
    android: "14",
    note: mode === "gesture"
      ? `${base} Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 60/60 px; inset-only classification says threeButton. The 128 px (64 dp) bottom navigation, system-bar and tappable inset is larger than 3-button mode's 96 px, consistent with the persistent tablet taskbar; the taskbar state was not recorded.`
      : `${base} 3-button mode agrees with Settings, configuration and InsetsProbe.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyTabS10Plus: Device = {
  slug: "galaxy-tab-s10-plus",
  name: "Galaxy Tab S10+",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 12.4,
    resolutionPx: { width: 2800, height: 1752 },
    logicalSizePx: { width: 2800, height: 1752 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 266,
    logicalSizeDp: { width: 1400, height: 876 },
    densityDpi: 320,
    cornerRadiiDp: { topLeft: 13, topRight: 13, bottomRight: 13, bottomLeft: 13 },
    cornerRadiiPx: { topLeft: 26, topRight: 26, bottomRight: 26, bottomLeft: 26 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
