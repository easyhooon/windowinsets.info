import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A14 display specifications",
  url: "https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2023_4Q_Interim_Report.pdf",
  retrievedAt: "2026-09-25",
  note: "Samsung lists Galaxy A14 with a 6.6-inch 1080×2408 FHD+ display. The measured RTL SKU SM-A145F is LTE; the available official A14 5G skin uses the same screen resolution.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A14 LTE (SM-A145F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a14-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 23.11, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 65, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 22.76, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 64, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 22.76, rightDp: 166.4, bottomDp: 833.42, xPx: 468, yPx: 0, widthPx: 144, heightPx: 64, rightPx: 468, bottomPx: 2344 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A14 LTE (SM-A145F), build UP1A.231005.007.A145FXXS9CYB1. Portrait rotation 0, 1080×2408 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The available official skin is A14 5G; Samsung lists Galaxy A14 with the same 1080×2408 FHD+ display geometry." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 23.11, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 65, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 22.76, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 64, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 22.76, rightDp: 166.4, bottomDp: 833.42, xPx: 468, yPx: 0, widthPx: 144, heightPx: 64, rightPx: 468, bottomPx: 2344 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A14 LTE (SM-A145F), build UP1A.231005.007.A145FXXS9CYB1. Portrait rotation 0, 1080×2408 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The available official skin is A14 5G; Samsung lists Galaxy A14 with the same 1080×2408 FHD+ display geometry." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA14: Device = {
  slug: "galaxy-a14-5g",
  name: "Galaxy A14",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.6,
    resolutionPx: { width: 1080, height: 2408 },
    logicalSizePx: { width: 1080, height: 2408 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 401,
    logicalSizeDp: { width: 384, height: 856 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2408, height: 1080 },
        logicalSizeDp: { width: 856.18, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 22.76 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 64 },
            cutoutShape: { xDp: 0, yDp: 166.4, widthDp: 22.76, heightDp: 51.2, rightDp: 833.42, bottomDp: 166.4, xPx: 0, yPx: 468, widthPx: 64, heightPx: 144, rightPx: 2344, bottomPx: 468 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A145F-RU1, same build UP1A.231005.007.A145FXXS9CYB1, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 2408×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A14 (SM-A145F), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a14-5g/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 68, right: 135, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 22.76 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 64 },
            cutoutShape: { xDp: 0, yDp: 166.4, widthDp: 22.76, heightDp: 51.2, rightDp: 833.42, bottomDp: 166.4, xPx: 0, yPx: 468, widthPx: 64, heightPx: 144, rightPx: 2344, bottomPx: 468 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A145F-RU1, same build UP1A.231005.007.A145FXXS9CYB1, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 2408×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A14 (SM-A145F), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a14-5g/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 2408, height: 1080 },
        logicalSizeDp: { width: 856.18, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 22.76, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 64, bottom: 0, left: 0 },
            cutoutShape: { xDp: 833.42, yDp: 166.4, widthDp: 22.76, heightDp: 51.2, rightDp: 0, bottomDp: 166.4, xPx: 2344, yPx: 468, widthPx: 64, heightPx: 144, rightPx: 0, bottomPx: 468 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A145F-RU1, same build UP1A.231005.007.A145FXXS9CYB1, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 2408×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A14 (SM-A145F), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a14-5g/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 68, right: 0, bottom: 0, left: 135 },
            displayCutout: { top: 0, right: 22.76, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 64, bottom: 0, left: 0 },
            cutoutShape: { xDp: 833.42, yDp: 166.4, widthDp: 22.76, heightDp: 51.2, rightDp: 0, bottomDp: 166.4, xPx: 2344, yPx: 468, widthPx: 64, heightPx: 144, rightPx: 0, bottomPx: 468 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A145F-RU1, same build UP1A.231005.007.A145FXXS9CYB1, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 2408×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A14 (SM-A145F), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a14-5g/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
