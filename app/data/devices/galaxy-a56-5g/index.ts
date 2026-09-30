import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A56 5G display specifications",
  url: "https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a56-5g-awesome-graphite-256gb-sm-a566bzkceub/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.7-inch, 1080×2340 FHD+ display; PPI is calculated from those values.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A56 5G (SM-A566B), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a56-5g/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement | null => {
  if (mode === "gesture") return {
      systemBars: { top: 32.71, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 92, right: 0, bottom: 42, left: 0 },
      displayCutout: { top: 32.71, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.55556, yDp: 0.00000, widthDp: 24.88889, heightDp: 32.71111, rightDp: 179.55556, bottomDp: 799.28889, xPx: 505, yPx: 0, widthPx: 70, heightPx: 92, rightPx: 505, bottomPx: 2248 },
      condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, Galaxy A56 5G (SM-A566B), build AP3A.240905.015.A2.A566BXXS4AYE6. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("gesture")],
    };
  if (mode === "threeButton") return {
      systemBars: { top: 32.71, right: 0, bottom: 48.00, left: 0 },
      systemBarsPx: { top: 92, right: 0, bottom: 135, left: 0 },
      displayCutout: { top: 32.71, right: 0.00, bottom: 0.00, left: 0.00 },
      displayCutoutPx: { top: 92, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 179.55556, yDp: 0.00000, widthDp: 24.88889, heightDp: 32.71111, rightDp: 179.55556, bottomDp: 799.28889, xPx: 505, yPx: 0, widthPx: 70, heightPx: 92, rightPx: 505, bottomPx: 2248 },
      condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, Galaxy A56 5G (SM-A566B), build AP3A.240905.015.A2.A566BXXS4AYE6. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe." },
      sources: [captureSource("threeButton")],
    };
  return null;
};

export const galaxyA56: Device = {
  slug: "galaxy-a56-5g",
  name: "Galaxy A56 5G",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2025,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.7,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 385,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: { topLeft: 41.96, topRight: 41.96, bottomRight: 41.96, bottomLeft: 41.96 },
    cornerRadiiPx: { topLeft: 118, topRight: 118, bottomRight: 118, bottomLeft: 118 },
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2340, height: 1080 },
        logicalSizeDp: { width: 832, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 32.71 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 92 },
            cutoutShape: { xDp: 0, yDp: 179.56, widthDp: 32.71, heightDp: 24.89, rightDp: 799.29, bottomDp: 179.56, xPx: 0, yPx: 505, widthPx: 92, heightPx: 70, rightPx: 2248, bottomPx: 505 },
            condition: { oneUi: "7.0", android: "15", note: `Samsung RTL Russia/Moscow, SM-A566E-RU1, build AP3A.240905.015.A2.A566EXXS6AYGE (the SM-A566E variant on the same Android 15 / One UI 7.0 release line as the accepted SM-A566B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures exactly. Landscape rotation 1, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A56 5G (SM-A566E), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a56-5g/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 68, right: 135, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 32.71 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 92 },
            cutoutShape: { xDp: 0, yDp: 179.56, widthDp: 32.71, heightDp: 24.89, rightDp: 799.29, bottomDp: 179.56, xPx: 0, yPx: 505, widthPx: 92, heightPx: 70, rightPx: 2248, bottomPx: 505 },
            condition: { oneUi: "7.0", android: "15", note: `Samsung RTL Russia/Moscow, SM-A566E-RU1, build AP3A.240905.015.A2.A566EXXS6AYGE (the SM-A566E variant on the same Android 15 / One UI 7.0 release line as the accepted SM-A566B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures exactly. Landscape rotation 1, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A56 5G (SM-A566E), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a56-5g/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
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
            displayCutout: { top: 0, right: 32.71, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 92, bottom: 0, left: 0 },
            cutoutShape: { xDp: 799.29, yDp: 179.56, widthDp: 32.71, heightDp: 24.89, rightDp: 0, bottomDp: 179.56, xPx: 2248, yPx: 505, widthPx: 92, heightPx: 70, rightPx: 0, bottomPx: 505 },
            condition: { oneUi: "7.0", android: "15", note: `Samsung RTL Russia/Moscow, SM-A566E-RU1, build AP3A.240905.015.A2.A566EXXS6AYGE (the SM-A566E variant on the same Android 15 / One UI 7.0 release line as the accepted SM-A566B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures exactly. Landscape rotation 3, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A56 5G (SM-A566E), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a56-5g/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 68, right: 0, bottom: 0, left: 135 },
            displayCutout: { top: 0, right: 32.71, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 92, bottom: 0, left: 0 },
            cutoutShape: { xDp: 799.29, yDp: 179.56, widthDp: 32.71, heightDp: 24.89, rightDp: 0, bottomDp: 179.56, xPx: 2248, yPx: 505, widthPx: 92, heightPx: 70, rightPx: 0, bottomPx: 505 },
            condition: { oneUi: "7.0", android: "15", note: `Samsung RTL Russia/Moscow, SM-A566E-RU1, build AP3A.240905.015.A2.A566EXXS6AYGE (the SM-A566E variant on the same Android 15 / One UI 7.0 release line as the accepted SM-A566B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures exactly. Landscape rotation 3, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A56 5G (SM-A566E), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a56-5g/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
