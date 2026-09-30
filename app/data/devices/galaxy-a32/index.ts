import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A32 display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-a/a32-sm-a325fzbgeub/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.4-inch, 1080×2400 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A32 (SM-A325F), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 30.48, right: 0, bottom: mode === "gesture" ? 14.86 : 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: mode === "gesture" ? 39 : 126, left: 0 },
  displayCutout: { top: 30.48, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.29, yDp: 0, widthDp: 54.86, heightDp: 30.48, rightDp: 178.29, bottomDp: 883.81, xPx: 468, yPx: 0, widthPx: 144, heightPx: 80, rightPx: 468, bottomPx: 2320 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A32 LTE (SM-A325F), build TP1A.220624.014.A325FXXSCDYA2. Portrait rotation 0, 1080×2400 px full-screen capture, 420 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});
const corners = { topLeft: 32, topRight: 32, bottomRight: 32, bottomLeft: 32 };
const cornersPx = { topLeft: 84, topRight: 84, bottomRight: 84, bottomLeft: 84 };

export const galaxyA32: Device = {
  slug: "galaxy-a32", name: "Galaxy A32", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2021,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.4, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 411, logicalSizeDp: { width: 411.43, height: 914.29 }, densityDpi: 420, cornerRadiiDp: corners, cornerRadiiPx: cornersPx,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2400, height: 1080 },
        logicalSizeDp: { width: 914.29, height: 411.43 },
        insets: {
          gesture: {
            systemBars: { top: 24, right: 0, bottom: 14.86, left: 0 },
            systemBarsPx: { top: 63, right: 0, bottom: 39, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 30.48 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 80 },
            cutoutShape: { xDp: 0, yDp: 178.29, widthDp: 30.48, heightDp: 54.86, rightDp: 883.81, bottomDp: 178.29, xPx: 0, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 2320, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A325F-IN4, same build TP1A.220624.014.A325FXXSCDYA2, 420 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures. Landscape rotation 1, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A32 (SM-A325F), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 63, right: 126, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 30.48 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 80 },
            cutoutShape: { xDp: 0, yDp: 178.29, widthDp: 30.48, heightDp: 54.86, rightDp: 883.81, bottomDp: 178.29, xPx: 0, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 2320, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A325F-IN4, same build TP1A.220624.014.A325FXXSCDYA2, 420 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures. Landscape rotation 1, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A32 (SM-A325F), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 2400, height: 1080 },
        logicalSizeDp: { width: 914.29, height: 411.43 },
        insets: {
          gesture: {
            systemBars: { top: 24, right: 0, bottom: 14.86, left: 0 },
            systemBarsPx: { top: 63, right: 0, bottom: 39, left: 0 },
            displayCutout: { top: 0, right: 30.48, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 80, bottom: 0, left: 0 },
            cutoutShape: { xDp: 883.81, yDp: 178.29, widthDp: 30.48, heightDp: 54.86, rightDp: 0, bottomDp: 178.29, xPx: 2320, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 0, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A325F-IN4, same build TP1A.220624.014.A325FXXSCDYA2, 420 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures. Landscape rotation 3, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A32 (SM-A325F), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 63, right: 0, bottom: 0, left: 126 },
            displayCutout: { top: 0, right: 30.48, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 80, bottom: 0, left: 0 },
            cutoutShape: { xDp: 883.81, yDp: 178.29, widthDp: 30.48, heightDp: 54.86, rightDp: 0, bottomDp: 178.29, xPx: 2320, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 0, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A325F-IN4, same build TP1A.220624.014.A325FXXSCDYA2, 420 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures. Landscape rotation 3, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A32 (SM-A325F), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
