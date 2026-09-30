import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A53 5G display specifications",
  url: "https://www.samsung.com/pt/smartphones/galaxy-a/galaxy-a53-5g-awesome-black-128gb-sm-a536bzkneub/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.5-inch, 1080×2400 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A53 5G (SM-A536B), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a53-5g/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 31.29, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 88, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 31.29, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 88, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 182.04, yDp: 0, widthDp: 19.91, heightDp: 31.29, rightDp: 182.04, bottomDp: 822.04, xPx: 512, yPx: 0, widthPx: 56, heightPx: 88, rightPx: 512, bottomPx: 2312 },
  condition: { oneUi: "6.1", android: "14", note: `Samsung RTL, Galaxy A53 5G (SM-A536B), build UP1A.231005.007.A536BXXSDEYB9. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});

export const galaxyA53: Device = {
  slug: "galaxy-a53-5g", name: "Galaxy A53 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2022,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.5, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 405, logicalSizeDp: { width: 384, height: 853.33 }, densityDpi: 450, cornerRadiiDp: null, cornerRadiiPx: null,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 2400, height: 1080 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24.18, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 68, right: 0, bottom: 42, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 31.29 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 88 },
            cutoutShape: { xDp: 0, yDp: 182.04, widthDp: 31.29, heightDp: 19.91, rightDp: 822.04, bottomDp: 182.04, xPx: 0, yPx: 512, widthPx: 88, heightPx: 56, rightPx: 2312, bottomPx: 512 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL India/Noida, SM-A536E-IN2, build UP1A.231005.007.A536EXXSEEYCB (the SM-A536E variant on the same Android 14 / One UI 6.1 release line as the accepted SM-A536B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures exactly. Landscape rotation 1, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A53 5G (SM-A536E), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a53-5g/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 68, right: 135, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 31.29 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 88 },
            cutoutShape: { xDp: 0, yDp: 182.04, widthDp: 31.29, heightDp: 19.91, rightDp: 822.04, bottomDp: 182.04, xPx: 0, yPx: 512, widthPx: 88, heightPx: 56, rightPx: 2312, bottomPx: 512 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL India/Noida, SM-A536E-IN2, build UP1A.231005.007.A536EXXSEEYCB (the SM-A536E variant on the same Android 14 / One UI 6.1 release line as the accepted SM-A536B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures exactly. Landscape rotation 1, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A53 5G (SM-A536E), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a53-5g/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
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
            displayCutout: { top: 0, right: 31.29, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 88, bottom: 0, left: 0 },
            cutoutShape: { xDp: 822.04, yDp: 182.04, widthDp: 31.29, heightDp: 19.91, rightDp: 0, bottomDp: 182.04, xPx: 2312, yPx: 512, widthPx: 88, heightPx: 56, rightPx: 0, bottomPx: 512 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL India/Noida, SM-A536E-IN2, build UP1A.231005.007.A536EXXSEEYCB (the SM-A536E variant on the same Android 14 / One UI 6.1 release line as the accepted SM-A536B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures exactly. Landscape rotation 3, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A53 5G (SM-A536E), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a53-5g/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24.18, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 68, right: 0, bottom: 0, left: 135 },
            displayCutout: { top: 0, right: 31.29, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 88, bottom: 0, left: 0 },
            cutoutShape: { xDp: 822.04, yDp: 182.04, widthDp: 31.29, heightDp: 19.91, rightDp: 0, bottomDp: 182.04, xPx: 2312, yPx: 512, widthPx: 88, heightPx: 56, rightPx: 0, bottomPx: 512 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL India/Noida, SM-A536E-IN2, build UP1A.231005.007.A536EXXSEEYCB (the SM-A536E variant on the same Android 14 / One UI 6.1 release line as the accepted SM-A536B capture), 450 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted font-scale-1.1 captures exactly. Landscape rotation 3, 2400×1080 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A53 5G (SM-A536E), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a53-5g/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
