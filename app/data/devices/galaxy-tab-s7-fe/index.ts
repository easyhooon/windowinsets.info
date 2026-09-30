import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S7 FE 5G business datasheet",
  url: "https://image-us.samsung.com/SamsungUS/samsungbusiness/pdfs/datasheet/Galaxy_Tab_S7_FE_Datasheet_LTE_T-Mobile.pdf",
  retrievedAt: "2026-09-27",
  note: "Samsung lists a 12.4-inch TFT display at 2560×1600 (WQXGA); PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S7 FE (SM-T735), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s7-fe/main-${mode}.json`,
  retrievedAt: "2026-09-27",
});

const base = "Samsung RTL, SM-T735, build TP1A.220624.014.T735XXS3CWE6. landscape rotation 1, 2560×1600 px full-screen capture, 340 dpi, font scale 1.";

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 24, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 51, right: 0, bottom: 102, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: {
    oneUi: "5.1",
    android: "13",
    note: mode === "gesture"
      ? `${base} Gesture mode is confirmed by Settings secure navigation mode 2, config_navBarInteractionMode=2, and left/right system-gesture insets 63/63 px; inset-only classification says threeButton. The bottom navigation, system-bar and tappable insets are 102 px (48 dp), the same as 3-button mode, consistent with One UI 5.1's persistent tablet taskbar; the taskbar state was not recorded.`
      : `${base} 3-button mode agrees with Settings, configuration and InsetsProbe.`,
  },
  sources: [captureSource(mode)],
});

const rotationBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab/galaxy-tab-s7-fe/recapture-2026-09-30-rotation";
const rotationNote = "Samsung RTL Vietnam/Hanoi, SM-T735-VN2, same build TP1A.220624.014.T735XXS3CWE6, 340 dpi and font scale 1. Driven over Remote Debug Bridge (adb): navigation was selected in Settings and each rotation was fixed with `cmd window user-rotation lock`. Rotation 1 from the same session reproduces the accepted captures exactly in both modes.";
// Every rotation keeps the same bars: the taskbar stays at the bottom and there is no cutout.
const rotationCapture = (file: string, width: number, height: number) => {
  const insets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
    ...measuredInsets(mode),
    condition: { oneUi: "5.1", android: "13", note: rotationNote },
    sources: [{
      kind: "measured",
      label: `InsetsProbe 1.6.0 on Samsung RTL Galaxy Tab S7 FE (SM-T735), ${file}, ${mode}, font scale 1`,
      url: `${rotationBase}/${file}-${mode}.json`,
      retrievedAt: "2026-09-30",
    }],
  });
  const dp = (px: number) => Math.round(px / 2.125 * 100) / 100;
  return { logicalSizePx: { width, height }, logicalSizeDp: { width: dp(width), height: dp(height) }, insets: { gesture: insets("gesture"), threeButton: insets("threeButton") } };
};

export const galaxyTabS7Fe: Device = {
  slug: "galaxy-tab-s7-fe",
  name: "Galaxy Tab S7 FE",
  brand: "Samsung",
  series: "Galaxy Tab",
  formFactor: "tablet",
  releaseYear: 2021,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 12.4,
    resolutionPx: { width: 2560, height: 1600 },
    logicalSizePx: { width: 2560, height: 1600 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 243,
    logicalSizeDp: { width: 1204.70588, height: 752.94118 },
    densityDpi: 340,
    cornerRadiiDp: { topLeft: 13.17647, topRight: 13.17647, bottomRight: 13.17647, bottomLeft: 13.17647 },
    cornerRadiiPx: { topLeft: 28, topRight: 28, bottomRight: 28, bottomLeft: 28 },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    rotations: {
      0: rotationCapture("main", 1600, 2560),
      2: rotationCapture("portrait-2", 1600, 2560),
      3: rotationCapture("landscape-3", 2560, 1600),
    },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
