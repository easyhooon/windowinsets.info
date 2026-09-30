import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A33 5G display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A336NZKTKOO/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.4-inch, 1080×2400 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A33 5G (SM-A336E), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a33-5g/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 28.44, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 28.44, rightDp: 166.4, bottomDp: 824.89, xPx: 468, yPx: 0, widthPx: 144, heightPx: 80, rightPx: 468, bottomPx: 2320 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A33 5G (SM-A336E), build TP1A.220624.014.A336EDXS7CWJ1. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});

export const galaxyA33: Device = {
  slug: "galaxy-a33-5g", name: "Galaxy A33 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2022,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.4, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 411, logicalSizeDp: { width: 384, height: 853.33 }, densityDpi: 450, cornerRadiiDp: null, cornerRadiiPx: null,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2400, height: 1080 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 28.44 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 80 },
            cutoutShape: { xDp: 0, yDp: 166.4, widthDp: 28.44, heightDp: 51.2, rightDp: 824.89, bottomDp: 166.4, xPx: 0, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 2320, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A336E-IN2, build TP1A.220624.014.A336EDXU7CWG3 (the same Android 13 / One UI 5.1 release line as the accepted capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with gesture navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 file reproduces the accepted gesture capture. Landscape rotation 1, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A33 5G (SM-A336E), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a33-5g/recapture-2026-09-30-gesture-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 68, right: 135, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 28.44 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 80 },
            cutoutShape: { xDp: 0, yDp: 166.4, widthDp: 28.44, heightDp: 51.2, rightDp: 824.89, bottomDp: 166.4, xPx: 0, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 2320, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A336E-IN1, same build TP1A.220624.014.A336EDXS7CWJ1, 450 dpi after resetting the unit's 540 dpi display-size override, font scale 1, captured over Remote Debug Bridge with 3-button navigation selected in Settings and the rotation locked. The session's rotation 0 file reproduces the accepted 3-button capture. Landscape rotation 1, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A33 5G (SM-A336E), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a33-5g/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 2400, height: 1080 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 28.44, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 80, bottom: 0, left: 0 },
            cutoutShape: { xDp: 824.89, yDp: 166.4, widthDp: 28.44, heightDp: 51.2, rightDp: 0, bottomDp: 166.4, xPx: 2320, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 0, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A336E-IN2, build TP1A.220624.014.A336EDXU7CWG3 (the same Android 13 / One UI 5.1 release line as the accepted capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with gesture navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 file reproduces the accepted gesture capture. Landscape rotation 3, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A33 5G (SM-A336E), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a33-5g/recapture-2026-09-30-gesture-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 68, right: 0, bottom: 0, left: 135 },
            displayCutout: { top: 0, right: 28.44, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 80, bottom: 0, left: 0 },
            cutoutShape: { xDp: 824.89, yDp: 166.4, widthDp: 28.44, heightDp: 51.2, rightDp: 0, bottomDp: 166.4, xPx: 2320, yPx: 468, widthPx: 80, heightPx: 144, rightPx: 0, bottomPx: 468 },
            condition: { oneUi: "5.1", android: "13", note: `Samsung RTL India/Noida, SM-A336E-IN1, same build TP1A.220624.014.A336EDXS7CWJ1, 450 dpi after resetting the unit's 540 dpi display-size override, font scale 1, captured over Remote Debug Bridge with 3-button navigation selected in Settings and the rotation locked. The session's rotation 0 file reproduces the accepted 3-button capture. Landscape rotation 3, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A33 5G (SM-A336E), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a33-5g/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
