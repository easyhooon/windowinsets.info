import type { Device, InsetsMeasurement, Source } from "../../types";

const specifications: Source = {
  kind: "official",
  label: "Samsung Galaxy A24 display specifications",
  url: "https://www.samsung.com/vn/smartphones/galaxy-a/galaxy-a24-dark-red-128gb-sm-a245fdrdxxv/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.5-inch, 1080×2340 FHD+ main display.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A24 (SM-A245F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a24/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 27.38, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 77, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 27.38, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 77, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 169.6, yDp: 0, widthDp: 44.8, heightDp: 27.38, rightDp: 169.6, bottomDp: 804.62, xPx: 477, yPx: 0, widthPx: 126, heightPx: 77, rightPx: 477, bottomPx: 2263 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A24 (SM-A245F), build TP1A.220624.014.A245FXXU2AWE6. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1. ${mode === "gesture" ? "Gesture" : "3-button"} mode agrees with Android Settings and InsetsProbe.` },
  sources: [captureSource(mode)],
});

const cornerRadii = { topLeft: 32, topRight: 32, bottomRight: 32, bottomLeft: 32 };
const cornerRadiiPx = { topLeft: 90, topRight: 90, bottomRight: 90, bottomLeft: 90 };

export const galaxyA24: Device = {
  slug: "galaxy-a24",
  name: "Galaxy A24",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 1080, height: 2340 },
    logicalSizePx: { width: 1080, height: 2340 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 396,
    logicalSizeDp: { width: 384, height: 832 },
    densityDpi: 450,
    cornerRadiiDp: cornerRadii,
    cornerRadiiPx,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2340, height: 1080 },
        logicalSizeDp: { width: 832, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 27.38 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 77 },
            cutoutShape: { xDp: 0, yDp: 169.6, widthDp: 27.38, heightDp: 44.8, rightDp: 804.62, bottomDp: 169.6, xPx: 0, yPx: 477, widthPx: 77, heightPx: 126, rightPx: 2263, bottomPx: 477 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A245F-IN5, same build TP1A.220624.014.A245FXXU2AWE6, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A24 (SM-A245F), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a24/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 68, right: 135, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 27.38 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 77 },
            cutoutShape: { xDp: 0, yDp: 169.6, widthDp: 27.38, heightDp: 44.8, rightDp: 804.62, bottomDp: 169.6, xPx: 0, yPx: 477, widthPx: 77, heightPx: 126, rightPx: 2263, bottomPx: 477 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A245F-IN5, same build TP1A.220624.014.A245FXXU2AWE6, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A24 (SM-A245F), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a24/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
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
            displayCutout: { top: 0, right: 27.38, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 77, bottom: 0, left: 0 },
            cutoutShape: { xDp: 804.62, yDp: 169.6, widthDp: 27.38, heightDp: 44.8, rightDp: 0, bottomDp: 169.6, xPx: 2263, yPx: 477, widthPx: 77, heightPx: 126, rightPx: 0, bottomPx: 477 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A245F-IN5, same build TP1A.220624.014.A245FXXU2AWE6, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A24 (SM-A245F), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a24/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 68, right: 0, bottom: 0, left: 135 },
            displayCutout: { top: 0, right: 27.38, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 77, bottom: 0, left: 0 },
            cutoutShape: { xDp: 804.62, yDp: 169.6, widthDp: 27.38, heightDp: 44.8, rightDp: 0, bottomDp: 169.6, xPx: 2263, yPx: 477, widthPx: 77, heightPx: 126, rightPx: 0, bottomPx: 477 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A245F-IN5, same build TP1A.220624.014.A245FXXU2AWE6, 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 2340×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A24 (SM-A245F), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a24/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [specifications, captureSource("gesture"), captureSource("threeButton")],
};
