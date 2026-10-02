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
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-plus/main-${mode}.json`,
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

const rotationBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-plus/recapture-2026-09-29-rotation";
const gestureRotationBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s10-plus/recapture-2026-10-02-rotation";

const rotationFiles = { 0: "main", 2: "portrait-2", 3: "landscape-3" } as const;

// 3-button comes from the 2026-09-29 RU1 sweep. The unit ran build X820XXU1AXI9, but its rotation 1 file
// reproduces the accepted AYB3 capture exactly. Gesture comes from the 2026-10-02 IN1 sweep on AYB3, whose
// 3-button files reproduce RU1 and whose rotation 1 files reproduce both accepted captures exactly.
const rotationCapture = (rotation: 0 | 2 | 3) => {
  const portrait = rotation !== 3;
  const sizePx = portrait ? { width: 1752, height: 2800 } : { width: 2800, height: 1752 };
  const sizeDp = portrait ? { width: 876, height: 1400 } : { width: 1400, height: 876 };
  const threeButton: InsetsMeasurement = {
    systemBars: { top: 24, right: 0, bottom: 48, left: 0 },
    systemBarsPx: { top: 48, right: 0, bottom: 96, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
    condition: {
      oneUi: "6.1.1",
      android: "14",
      note: `Samsung RTL Russia/Moscow, SM-X820-RU1, build UP1A.231005.007.X820XXU1AXI9 (accepted capture: X820XXS2AYB3). Separate rotation ${rotation} capture at ${sizePx.width}×${sizePx.height} px, 320 dpi and font scale 1. 3-button mode agrees with Settings, configuration and InsetsProbe. The same sweep's rotation 1 file reproduces the accepted capture exactly.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.1 on Samsung RTL Galaxy Tab S10+, rotation ${rotation}, 3-button`,
      url: `${rotationBase}/${rotationFiles[rotation]}-threeButton.json`,
      retrievedAt: "2026-09-29",
    }],
  };
  const gesture: InsetsMeasurement = {
    systemBars: { top: 24, right: 0, bottom: 64, left: 0 },
    systemBarsPx: { top: 48, right: 0, bottom: 128, left: 0 },
    displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
    displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
    condition: {
      oneUi: "6.1.1",
      android: "14",
      note: `Samsung RTL India/Noida, SM-X820-IN1, build UP1A.231005.007.X820XXS2AYB3, captured over Remote Debug Bridge. Separate rotation ${rotation} capture at ${sizePx.width}×${sizePx.height} px, 320 dpi and font scale 1. Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2 and left/right system-gesture insets 60/60 px. The 128 px bottom inset matches the accepted gesture capture's persistent tablet taskbar.`,
    },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.7.0 on Samsung RTL Galaxy Tab S10+, rotation ${rotation}, gesture`,
      url: `${gestureRotationBase}/${rotationFiles[rotation]}-gesture.json`,
      retrievedAt: "2026-10-02",
    }],
  };
  return { logicalSizePx: sizePx, logicalSizeDp: sizeDp, insets: { gesture, threeButton } };
};

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
    rotations: { 0: rotationCapture(0), 2: rotationCapture(2), 3: rotationCapture(3) },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
