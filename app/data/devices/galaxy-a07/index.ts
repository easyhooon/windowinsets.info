import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A07 5G display specifications",
  url: "https://www.samsung.com/br/smartphones/galaxy-a/galaxy-a07-5g-black-128gb-sm-a076mzkbzto/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch, 720×1600 HD+ display. PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A07 5G (SM-A076M), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a07/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 34.13, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 64, right: 0, bottom: 28, left: 0 },
      displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 64, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 42.67, heightDp: 34.13, rightDp: 170.67, bottomDp: 819.2, xPx: 320, yPx: 0, widthPx: 80, heightPx: 64, rightPx: 320, bottomPx: 1536 },
      condition: { oneUi: "8.0", android: "16", note: "Samsung RTL, Galaxy A07 5G (SM-A076M), build BP2A.250605.031.A3.A076MXXS4AZD2. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 34.13, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 64, right: 0, bottom: 90, left: 0 },
      displayCutout: { top: 34.13, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 64, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 170.67, yDp: 0, widthDp: 42.67, heightDp: 34.13, rightDp: 170.67, bottomDp: 819.2, xPx: 320, yPx: 0, widthPx: 80, heightPx: 64, rightPx: 320, bottomPx: 1536 },
      condition: { oneUi: "8.0", android: "16", note: "Samsung RTL, Galaxy A07 5G (SM-A076M), build BP2A.250605.031.A3.A076MXXS4AZD2. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA07: Device = {
  slug: "galaxy-a07",
  name: "Galaxy A07 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2026,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 720, height: 1600 },
    logicalSizePx: { width: 720, height: 1600 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 262,
    logicalSizeDp: { width: 384, height: 853 },
    densityDpi: 300,
    cornerRadiiDp: { topLeft: 36.27, topRight: 36.27, bottomRight: 36.27, bottomLeft: 36.27 },
    cornerRadiiPx: { topLeft: 68, topRight: 68, bottomRight: 68, bottomLeft: 68 },
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 1600, height: 720 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 56, right: 0, bottom: 28, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 34.13 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 64 },
            cutoutShape: { xDp: 0, yDp: 170.67, widthDp: 34.13, heightDp: 42.67, rightDp: 819.2, bottomDp: 170.67, xPx: 0, yPx: 320, widthPx: 64, heightPx: 80, rightPx: 1536, bottomPx: 320 },
            condition: { oneUi: "8.0", android: "16", note: `Samsung RTL Brazil/Manaus, SM-A076M_BR2, same build BP2A.250605.031.A3.A076MXXS4AZD2, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A07 5G (SM-A076M), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a07/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 29.87, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 56, right: 90, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 34.13 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 64 },
            cutoutShape: { xDp: 0, yDp: 170.67, widthDp: 34.13, heightDp: 42.67, rightDp: 819.2, bottomDp: 170.67, xPx: 0, yPx: 320, widthPx: 64, heightPx: 80, rightPx: 1536, bottomPx: 320 },
            condition: { oneUi: "8.0", android: "16", note: `Samsung RTL Brazil/Manaus, SM-A076M_BR2, same build BP2A.250605.031.A3.A076MXXS4AZD2, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A07 5G (SM-A076M), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a07/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 1600, height: 720 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 29.87, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 56, right: 0, bottom: 28, left: 0 },
            displayCutout: { top: 0, right: 34.13, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 64, bottom: 0, left: 0 },
            cutoutShape: { xDp: 819.2, yDp: 170.67, widthDp: 34.13, heightDp: 42.67, rightDp: 0, bottomDp: 170.67, xPx: 1536, yPx: 320, widthPx: 64, heightPx: 80, rightPx: 0, bottomPx: 320 },
            condition: { oneUi: "8.0", android: "16", note: `Samsung RTL Brazil/Manaus, SM-A076M_BR2, same build BP2A.250605.031.A3.A076MXXS4AZD2, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A07 5G (SM-A076M), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a07/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 29.87, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 56, right: 0, bottom: 0, left: 90 },
            displayCutout: { top: 0, right: 34.13, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 64, bottom: 0, left: 0 },
            cutoutShape: { xDp: 819.2, yDp: 170.67, widthDp: 34.13, heightDp: 42.67, rightDp: 0, bottomDp: 170.67, xPx: 1536, yPx: 320, widthPx: 64, heightPx: 80, rightPx: 0, bottomPx: 320 },
            condition: { oneUi: "8.0", android: "16", note: `Samsung RTL Brazil/Manaus, SM-A076M_BR2, same build BP2A.250605.031.A3.A076MXXS4AZD2, 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A07 5G (SM-A076M), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a07/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
