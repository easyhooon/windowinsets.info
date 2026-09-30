import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A06 display specifications",
  url: "https://www.samsung.com/levant/smartphones/galaxy-a/galaxy-a06-black-64gb-sm-a065fzkdmea/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists the 6.7-inch, 720×1600 HD+ display. PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A06 (SM-A065F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a06/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 22.93, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 43, right: 0, bottom: 28, left: 0 },
      displayCutout: { top: 22.93, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 43, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 42.67, heightDp: 22.93, rightDp: 170.67, bottomDp: 830.4, xPx: 320, yPx: 0, widthPx: 80, heightPx: 43, rightPx: 320, bottomPx: 1557 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A06 (SM-A065F), build UP1A.231005.007.A065FXXS3AYB1. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 22.93, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 43, right: 0, bottom: 90, left: 0 },
      displayCutout: { top: 22.93, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 43, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 42.67, heightDp: 22.93, rightDp: 170.67, bottomDp: 830.4, xPx: 320, yPx: 0, widthPx: 80, heightPx: 43, rightPx: 320, bottomPx: 1557 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A06 (SM-A065F), build UP1A.231005.007.A065FXXS3AYB1. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA06: Device = {
  slug: "galaxy-a06",
  name: "Galaxy A06",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 720, height: 1600 },
    logicalSizePx: { width: 720, height: 1600 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 260,
    logicalSizeDp: { width: 384, height: 853 },
    densityDpi: 300,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 1600, height: 720 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 45, right: 0, bottom: 28, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 22.93 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 43 },
            cutoutShape: { xDp: 0, yDp: 170.67, widthDp: 22.93, heightDp: 42.67, rightDp: 830.4, bottomDp: 170.67, xPx: 0, yPx: 320, widthPx: 43, heightPx: 80, rightPx: 1557, bottomPx: 320 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A065F-RU1, same build UP1A.231005.007.A065FXXS3AYB1, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A06 (SM-A065F), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a06/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 45, right: 90, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 22.93 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 43 },
            cutoutShape: { xDp: 0, yDp: 170.67, widthDp: 22.93, heightDp: 42.67, rightDp: 830.4, bottomDp: 170.67, xPx: 0, yPx: 320, widthPx: 43, heightPx: 80, rightPx: 1557, bottomPx: 320 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A065F-RU1, same build UP1A.231005.007.A065FXXS3AYB1, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A06 (SM-A065F), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a06/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 1600, height: 720 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 45, right: 0, bottom: 28, left: 0 },
            displayCutout: { top: 0, right: 22.93, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 43, bottom: 0, left: 0 },
            cutoutShape: { xDp: 830.4, yDp: 170.67, widthDp: 22.93, heightDp: 42.67, rightDp: 0, bottomDp: 170.67, xPx: 1557, yPx: 320, widthPx: 43, heightPx: 80, rightPx: 0, bottomPx: 320 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A065F-RU1, same build UP1A.231005.007.A065FXXS3AYB1, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A06 (SM-A065F), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a06/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 45, right: 0, bottom: 0, left: 90 },
            displayCutout: { top: 0, right: 22.93, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 43, bottom: 0, left: 0 },
            cutoutShape: { xDp: 830.4, yDp: 170.67, widthDp: 22.93, heightDp: 42.67, rightDp: 0, bottomDp: 170.67, xPx: 1557, yPx: 320, widthPx: 43, heightPx: 80, rightPx: 0, bottomPx: 320 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A065F-RU1, same build UP1A.231005.007.A065FXXS3AYB1, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A06 (SM-A065F), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a06/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
