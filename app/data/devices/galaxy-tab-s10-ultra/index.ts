import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S10 Ultra Wi-Fi specifications",
  url: "https://www.samsung.com/uk/business/tablets/galaxy-tab-s/galaxy-tab-s10-ultra-silver-512gb-wi-fi-sm-x920nzspeub/",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 14.6-inch Dynamic AMOLED 2X display at 2960×1848; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S10 Ultra (SM-X920), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-ultra/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-X920, build UP1A.231005.007.X920XXS2AYB5. landscape rotation 1, 2960×1848 px full-screen capture, 280 dpi, font scale 1.";

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 24, right: 0, bottom: mode === "gesture" ? 64 : 48, left: 0 },
  systemBarsPx: { top: 42, right: 0, bottom: mode === "gesture" ? 112 : 84, left: 0 },
  displayCutout: { top: 16, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 28, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 792.57, yDp: 0, widthDp: 106.29, heightDp: 16, rightDp: 792.57, bottomDp: 1040, xPx: 1387, yPx: 0, widthPx: 186, heightPx: 28, rightPx: 1387, bottomPx: 1820 },
  condition: {
    oneUi: "6.1.1",
    android: "14",
    note: mode === "gesture"
      ? `${base} Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 52/52 px; inset-only classification says threeButton. The 112 px (64 dp) bottom navigation, system-bar and tappable insets exceed 3-button mode, consistent with the persistent tablet taskbar; the taskbar state was not recorded.`
      : `${base} 3-button mode agrees with Settings, configuration and InsetsProbe. Probe used its generic Phone label, but model and full-screen dimensions match this tablet main display; the raw JSON is unchanged.`,
  },
  sources: [captureSource(mode)],
});

export const galaxyTabS10Ultra: Device = {
  slug: "galaxy-tab-s10-ultra",
  name: "Galaxy Tab S10 Ultra",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 14.6,
    resolutionPx: { width: 2960, height: 1848 },
    logicalSizePx: { width: 2960, height: 1848 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 239,
    logicalSizeDp: { width: 1691.42857, height: 1056 },
    densityDpi: 280,
    cornerRadiiDp: { topLeft: 13.14286, topRight: 13.14286, bottomRight: 13.14286, bottomLeft: 13.14286 },
    cornerRadiiPx: { topLeft: 23, topRight: 23, bottomRight: 23, bottomLeft: 23 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
