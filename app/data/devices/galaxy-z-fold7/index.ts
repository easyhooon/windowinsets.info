import type { Device, Insets, InsetsMeasurement, Source } from "../../types";

const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold7";
const mainCaptureBase = `${captureBase}/recapture-2026-09-25`;

const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-22",
};

const chassisSource: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold7 specifications",
  url: "https://www.samsung.com/es/smartphones/galaxy-z-fold7/",
  retrievedAt: "2026-09-23",
};

const coverThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.2.0 on Samsung RTL Galaxy Z Fold7 cover, 3-button (SM-F966U)",
  url: `${captureBase}/cover-threeButton.json`,
  retrievedAt: "2026-09-23",
};

const coverGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold7 cover, gestures (SM-F966U)",
  url: `${captureBase}/cover-gesture.json`,
  retrievedAt: "2026-09-23",
};

const mainThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold7 inner display, 3-button (SM-F966U)",
  url: `${mainCaptureBase}/main-threeButton.json`,
  retrievedAt: "2026-09-25",
};

const mainGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold7 inner display, gestures (SM-F966U)",
  url: `${mainCaptureBase}/main-gesture.json`,
  retrievedAt: "2026-09-25",
};

const coverCondition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL, physically folded, portrait. Active window 1080×2520 px; hinge 0° with no folding feature. The two navigation modes were captured from separate SM-F966U reservations on the same software build. A 2026-09-27 InsetsProbe 1.5.0 sweep (recapture-2026-09-27-rotation/) reproduces these rotation 0 values and adds rotations 1 and 3 in both modes as evidence.",
};

const mainCondition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL, fully unfolded, portrait (rotation 0). Active window 1968×2184 px. RTL's hinge sensor remained at 0°, while WindowManager reported a vertical FLAT folding feature at x=984 px. In the gesture capture, Settings and the navigation configuration report gestures while the inset-only classifier reports 3-button; the recorded insets are used as captured. A 2026-09-27 InsetsProbe 1.5.0 capture set (recapture-2026-09-27-rotation/) reproduces these rotation 0 values; its rotation 1 and 3 captures were taken by rotating with the RTL Rotate control because the inner display ignored the app orientation request, and report a 79 px top bar with the navigation bar still at the bottom. The taskbar setting stayed at the device default (on).",
};

const coverCutout = {
  xDp: 194.29,
  yDp: 0,
  widthDp: 22.86,
  heightDp: 38.86,
  rightDp: 194.29,
  bottomDp: 921.14,
  xPx: 510,
  yPx: 0,
  widthPx: 60,
  heightPx: 102,
  rightPx: 510,
  bottomPx: 2418,
};

// Rotation sweep (2026-09-27): each rotation from its own capture, never rotated from portrait.
const rotationBase = `${captureBase}/recapture-2026-09-27-rotation`;
const rotationSource = (screen: "cover" | "main", rotation: 1 | 3, mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold7 ${screen === "cover" ? "cover" : "inner display"}, rotation ${rotation} ${mode === "gesture" ? "gestures" : "3-button"} (SM-F966U)`,
  url: `${rotationBase}/${screen}-landscape-${rotation}-${mode}.json`,
  retrievedAt: "2026-09-27",
});
type RotationValues = Pick<InsetsMeasurement, "cutoutShape"> & { systemBars: Insets; systemBarsPx: Insets; displayCutout: Insets; displayCutoutPx: Insets };
const rotationInsets = (screen: "cover" | "main", rotation: 1 | 3, mode: "gesture" | "threeButton", values: RotationValues): InsetsMeasurement => ({
  ...values,
  condition: {
    oneUi: "8.5",
    android: "16",
    note: screen === "cover"
      ? `Samsung RTL, SM-F966U, physically folded. Landscape rotation ${rotation}, 2520×1080 px, 420 dpi, font scale 1. The status bar is 79 px here versus 110 px in portrait, and the camera cutout moves to the ${rotation === 1 ? "left" : "right"} edge.`
      : `Samsung RTL, SM-F966U, fully unfolded. Landscape rotation ${rotation}, 2184×1968 px, 420 dpi, font scale 1, rotated with the RTL Rotate control because the inner display ignored the app orientation request. The status bar is 79 px and the navigation bar stays at the bottom.${mode === "gesture" ? " Settings report gestures while the inset-only classifier reports 3-button, as in the portrait capture; the recorded insets are used as captured." : ""}`,
  },
  sources: [rotationSource(screen, rotation, mode)],
});

export const galaxyZFold7: Device = {
  slug: "galaxy-z-fold7",
  name: "Galaxy Z Fold7",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  chassisMm: { unfoldedWidth: 143.2, unfoldedDepth: 4.2, foldedDepth: 8.9, source: chassisSource },
  releaseYear: 2025,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 0,
      resolutionPx: { width: 1080, height: 2520 },
      logicalSizePx: { width: 1080, height: 2520 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 0,
      logicalSizeDp: { width: 411.43, height: 960 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 4.95, topRight: 4.95, bottomRight: 4.95, bottomLeft: 4.95 },
      cornerRadiiPx: { topLeft: 13, topRight: 13, bottomRight: 13, bottomLeft: 13 },
      insets: {
        gesture: {
          systemBars: { top: 41.9, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 110, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 38.86, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 102, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 41.9, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 110, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 38.86, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 102, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverThreeButton],
        },
      },
      rotations: {
      1: { logicalSizePx: { width: 2520, height: 1080 }, logicalSizeDp: { width: 960, height: 411.43 }, insets: {
        gesture: rotationInsets("cover", 1, "gesture", { systemBars: { top: 30.1, right: 0, bottom: 14.86, left: 0 }, systemBarsPx: { top: 79, right: 0, bottom: 39, left: 0 }, displayCutout: { top: 0, right: 0, bottom: 0, left: 38.86 }, displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 102 }, cutoutShape: { xDp: 0, yDp: 194.29, widthDp: 38.86, heightDp: 22.86, rightDp: 921.14, bottomDp: 194.29, xPx: 0, yPx: 510, widthPx: 102, heightPx: 60, rightPx: 2418, bottomPx: 510 } }),
        threeButton: rotationInsets("cover", 1, "threeButton", { systemBars: { top: 30.1, right: 48, bottom: 0, left: 0 }, systemBarsPx: { top: 79, right: 126, bottom: 0, left: 0 }, displayCutout: { top: 0, right: 0, bottom: 0, left: 38.86 }, displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 102 }, cutoutShape: { xDp: 0, yDp: 194.29, widthDp: 38.86, heightDp: 22.86, rightDp: 921.14, bottomDp: 194.29, xPx: 0, yPx: 510, widthPx: 102, heightPx: 60, rightPx: 2418, bottomPx: 510 } }),
      } },
      3: { logicalSizePx: { width: 2520, height: 1080 }, logicalSizeDp: { width: 960, height: 411.43 }, insets: {
        gesture: rotationInsets("cover", 3, "gesture", { systemBars: { top: 30.1, right: 0, bottom: 14.86, left: 0 }, systemBarsPx: { top: 79, right: 0, bottom: 39, left: 0 }, displayCutout: { top: 0, right: 38.86, bottom: 0, left: 0 }, displayCutoutPx: { top: 0, right: 102, bottom: 0, left: 0 }, cutoutShape: { xDp: 921.14, yDp: 194.29, widthDp: 38.86, heightDp: 22.86, rightDp: 0, bottomDp: 194.29, xPx: 2418, yPx: 510, widthPx: 102, heightPx: 60, rightPx: 0, bottomPx: 510 } }),
        threeButton: rotationInsets("cover", 3, "threeButton", { systemBars: { top: 30.1, right: 0, bottom: 0, left: 48 }, systemBarsPx: { top: 79, right: 0, bottom: 0, left: 126 }, displayCutout: { top: 0, right: 38.86, bottom: 0, left: 0 }, displayCutoutPx: { top: 0, right: 102, bottom: 0, left: 0 }, cutoutShape: { xDp: 921.14, yDp: 194.29, widthDp: 38.86, heightDp: 22.86, rightDp: 0, bottomDp: 194.29, xPx: 2418, yPx: 510, widthPx: 102, heightPx: 60, rightPx: 0, bottomPx: 510 } }),
      } },
      },
      sources: [samsungSkinPage, coverThreeButton, coverGesture],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 8.0,
      resolutionPx: { width: 1968, height: 2184 },
      logicalSizePx: { width: 1968, height: 2184 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 368,
      logicalSizeDp: { width: 749.71, height: 832 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 4.95, topRight: 4.95, bottomRight: 4.95, bottomLeft: 4.95 },
      cornerRadiiPx: { topLeft: 13, topRight: 13, bottomRight: 13, bottomLeft: 13 },
      insets: {
        gesture: {
          systemBars: { top: 33.9, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 89, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 33.9, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 89, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainThreeButton],
        },
      },
      rotations: {
      1: { logicalSizePx: { width: 2184, height: 1968 }, logicalSizeDp: { width: 832, height: 749.71 }, insets: {
        gesture: rotationInsets("main", 1, "gesture", { systemBars: { top: 30.1, right: 0, bottom: 14.86, left: 0 }, systemBarsPx: { top: 79, right: 0, bottom: 39, left: 0 }, displayCutout: { top: 0, right: 0, bottom: 0, left: 0 }, displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 } }),
        threeButton: rotationInsets("main", 1, "threeButton", { systemBars: { top: 30.1, right: 0, bottom: 48, left: 0 }, systemBarsPx: { top: 79, right: 0, bottom: 126, left: 0 }, displayCutout: { top: 0, right: 0, bottom: 0, left: 0 }, displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 } }),
      } },
      3: { logicalSizePx: { width: 2184, height: 1968 }, logicalSizeDp: { width: 832, height: 749.71 }, insets: {
        gesture: rotationInsets("main", 3, "gesture", { systemBars: { top: 30.1, right: 0, bottom: 14.86, left: 0 }, systemBarsPx: { top: 79, right: 0, bottom: 39, left: 0 }, displayCutout: { top: 0, right: 0, bottom: 0, left: 0 }, displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 } }),
        threeButton: rotationInsets("main", 3, "threeButton", { systemBars: { top: 30.1, right: 0, bottom: 48, left: 0 }, systemBarsPx: { top: 79, right: 0, bottom: 126, left: 0 }, displayCutout: { top: 0, right: 0, bottom: 0, left: 0 }, displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 } }),
      } },
      },
      sources: [samsungSkinPage, mainThreeButton, mainGesture],
    },
  ],
  sources: [chassisSource, samsungSkinPage, coverThreeButton, coverGesture, mainThreeButton, mainGesture],
};
