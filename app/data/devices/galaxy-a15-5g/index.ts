import type { Device, InsetsMeasurement, Source } from "../../types";

const lteSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A15 LTE display specifications",
  url: "https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a15-blue-128gb-sm-a155fzbdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 163.9 mm (6.5-inch), 1080×2340 FHD+ display for Galaxy A15 LTE (SM-A155F).",
};

const fiveGSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A15 5G display specifications",
  url: "https://www.samsung.com/uk/business/smartphones/galaxy-a/galaxy-a15-5g-blue-black-128gb-sm-a156bzkdeub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists the same 163.9 mm (6.5-inch), 1080×2340 FHD+ display geometry for A15 5G, matching the LTE model and available skin.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A15 LTE (SM-A155F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a15-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 28.44, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 80, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.82, yDp: 0, widthDp: 48.36, heightDp: 28.44, rightDp: 167.82, bottomDp: 803.56, xPx: 472, yPx: 0, widthPx: 136, heightPx: 80, rightPx: 472, bottomPx: 2260 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A15 LTE (SM-A155F), build UP1A.231005.007.A155FXXS6BYE1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The available official skin is A15 5G; Samsung lists both LTE and 5G displays as 163.9 mm, 1080×2340 FHD+." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 28.44, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 80, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 167.82, yDp: 0, widthDp: 48.36, heightDp: 28.44, rightDp: 167.82, bottomDp: 803.56, xPx: 472, yPx: 0, widthPx: 136, heightPx: 80, rightPx: 472, bottomPx: 2260 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A15 LTE (SM-A155F), build UP1A.231005.007.A155FXXS6BYE1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The available official skin is A15 5G; Samsung lists both LTE and 5G displays as 163.9 mm, 1080×2340 FHD+." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA15: Device = {
  slug: "galaxy-a15-5g",
  name: "Galaxy A15",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2024,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 399,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2340, height: 1080 },
        logicalSizeDp: { width: 832, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 28.44 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 80 },
            cutoutShape: { xDp: 0, yDp: 167.82, widthDp: 28.44, heightDp: 48.36, rightDp: 803.56, bottomDp: 167.82, xPx: 0, yPx: 472, widthPx: 80, heightPx: 136, rightPx: 2260, bottomPx: 472 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A155F-RU2, build UP1A.231005.007.A155FXXS5BYC2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A15 (SM-A155F), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a15-5g/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 68, right: 135, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 28.44 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 80 },
            cutoutShape: { xDp: 0, yDp: 167.82, widthDp: 28.44, heightDp: 48.36, rightDp: 803.56, bottomDp: 167.82, xPx: 0, yPx: 472, widthPx: 80, heightPx: 136, rightPx: 2260, bottomPx: 472 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A155F-RU2, build UP1A.231005.007.A155FXXS5BYC2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A15 (SM-A155F), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a15-5g/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 2340, height: 1080 },
        logicalSizeDp: { width: 832, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 28.44, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 80, bottom: 0, left: 0 },
            cutoutShape: { xDp: 803.56, yDp: 167.82, widthDp: 28.44, heightDp: 48.36, rightDp: 0, bottomDp: 167.82, xPx: 2260, yPx: 472, widthPx: 80, heightPx: 136, rightPx: 0, bottomPx: 472 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A155F-RU2, build UP1A.231005.007.A155FXXS5BYC2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A15 (SM-A155F), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a15-5g/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 68, right: 0, bottom: 0, left: 135 },
            displayCutout: { top: 0, right: 28.44, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 80, bottom: 0, left: 0 },
            cutoutShape: { xDp: 803.56, yDp: 167.82, widthDp: 28.44, heightDp: 48.36, rightDp: 0, bottomDp: 167.82, xPx: 2260, yPx: 472, widthPx: 80, heightPx: 136, rightPx: 0, bottomPx: 472 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A155F-RU2, build UP1A.231005.007.A155FXXS5BYC2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A15 (SM-A155F), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a15-5g/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [lteSpecs, fiveGSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [lteSpecs, fiveGSpecs, captureSource("gesture"), captureSource("threeButton")],
};
