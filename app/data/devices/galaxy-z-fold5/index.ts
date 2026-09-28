import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold5 specifications",
  url: "https://news.samsung.com/global/samsung-galaxy-z-flip5-and-galaxy-z-fold5-delivering-flexibility-and-versatility-without-compromise",
  retrievedAt: "2026-09-23",
};
const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-23",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5";
const mainCaptureBase = `${captureBase}/recapture-2026-09-25`;
const coverThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold5 cover, 3-button (SM-F946B)",
  url: `${captureBase}/cover-threeButton.json`,
  retrievedAt: "2026-09-23",
};
const coverGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold5 cover, gestures (SM-F946B)",
  url: `${captureBase}/cover-gesture.json`,
  retrievedAt: "2026-09-23",
};
const mainThreeButton: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold5 inner display, 3-button (SM-F946B)",
  url: `${mainCaptureBase}/main-threeButton.json`,
  retrievedAt: "2026-09-25",
};
const mainGesture: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold5 inner display, gestures (SM-F946B)",
  url: `${mainCaptureBase}/main-gesture.json`,
  retrievedAt: "2026-09-25",
};

const coverCondition = {
  oneUi: "8.0",
  android: "16",
  note: "Samsung RTL, physically folded, portrait. Active window 904×2316 px; cover 3-button and gesture were captured across two reservations. The first gesture attempt was rotated and is retained as rejected evidence.",
};
const mainCondition = {
  oneUi: "8.0",
  android: "16",
  note: "Samsung RTL, fully unfolded, portrait (rotation 0). Active window 1812×2176 px with a vertical FLAT folding feature at x=906. In gesture mode Settings/configuration and side gesture insets agree, while Probe's inset-only classifier reports 3-button.",
};
const coverCutout = {
  xDp: 161.14,
  yDp: 0,
  widthDp: 22.48,
  heightDp: 32.38,
  rightDp: 160.76,
  bottomDp: 849.91,
  xPx: 423,
  yPx: 0,
  widthPx: 59,
  heightPx: 85,
  rightPx: 422,
  bottomPx: 2231,
};

export const galaxyZFold5: Device = {
  slug: "galaxy-z-fold5",
  name: "Galaxy Z Fold5",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2023,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 6.2,
      resolutionPx: { width: 904, height: 2316 },
      logicalSizePx: { width: 904, height: 2316 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 402,
      logicalSizeDp: { width: 344.38, height: 882.29 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 25.9, topRight: 25.9, bottomRight: 25.9, bottomLeft: 25.9 },
      cornerRadiiPx: { topLeft: 68, topRight: 68, bottomRight: 68, bottomLeft: 68 },
      rotations: {
        "1": {
          "logicalSizePx": {
            "width": 2316,
            "height": 904
          },
          "logicalSizeDp": {
            "width": 882.29,
            "height": 344.38
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 39,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 32.38
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 85
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 160.76,
                "widthDp": 32.38,
                "heightDp": 22.48,
                "rightDp": 849.91,
                "bottomDp": 161.14,
                "xPx": 0,
                "yPx": 422,
                "widthPx": 85,
                "heightPx": 59,
                "rightPx": 2231,
                "bottomPx": 423
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. cover display, rotation 1, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 cover, rotation 1, gesture (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/cover-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30.1,
                "right": 48,
                "bottom": 0,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 126,
                "bottom": 0,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 32.38
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 85
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 160.76,
                "widthDp": 32.38,
                "heightDp": 22.48,
                "rightDp": 849.91,
                "bottomDp": 161.14,
                "xPx": 0,
                "yPx": 422,
                "widthPx": 85,
                "heightPx": 59,
                "rightPx": 2231,
                "bottomPx": 423
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. cover display, rotation 1, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 cover, rotation 1, threeButton (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/cover-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2316,
            "height": 904
          },
          "logicalSizeDp": {
            "width": 882.29,
            "height": 344.38
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 39,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 32.38,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 85,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 849.9,
                "yDp": 161.14,
                "widthDp": 32.38,
                "heightDp": 22.48,
                "rightDp": 0.0,
                "bottomDp": 160.76,
                "xPx": 2231,
                "yPx": 423,
                "widthPx": 85,
                "heightPx": 59,
                "rightPx": 0,
                "bottomPx": 422
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. cover display, rotation 3, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 cover, rotation 3, gesture (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/cover-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 0,
                "left": 48
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 0,
                "left": 126
              },
              "displayCutout": {
                "top": 0,
                "right": 32.38,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 85,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 849.9,
                "yDp": 161.14,
                "widthDp": 32.38,
                "heightDp": 22.48,
                "rightDp": 0.0,
                "bottomDp": 160.76,
                "xPx": 2231,
                "yPx": 423,
                "widthPx": 85,
                "heightPx": 59,
                "rightPx": 0,
                "bottomPx": 422
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. cover display, rotation 3, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 cover, rotation 3, threeButton (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/cover-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      insets: {
        gesture: {
          systemBars: { top: 32.38, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 85, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 32.38, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 85, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 32.38, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 85, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 32.38, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 85, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverThreeButton],
        },
      },
      sources: [samsungSpecs, samsungSkinPage, coverThreeButton, coverGesture],
    },
    {
      id: "main",
      label: "Main",
      diagonalInch: 7.6,
      resolutionPx: { width: 1812, height: 2176 },
      logicalSizePx: { width: 1812, height: 2176 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 374,
      logicalSizeDp: { width: 690.29, height: 828.95 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 25.9, topRight: 25.9, bottomRight: 25.9, bottomLeft: 25.9 },
      cornerRadiiPx: { topLeft: 68, topRight: 68, bottomRight: 68, bottomLeft: 68 },
      rotations: {
        "1": {
          "logicalSizePx": {
            "width": 2176,
            "height": 1812
          },
          "logicalSizeDp": {
            "width": 828.95,
            "height": 690.29
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 39,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. main display, rotation 1, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 main, rotation 1, gesture (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/main-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 126,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. main display, rotation 1, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 main, rotation 1, threeButton (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/main-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2176,
            "height": 1812
          },
          "logicalSizeDp": {
            "width": 828.95,
            "height": 690.29
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 39,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. main display, rotation 3, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 main, rotation 3, gesture (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/main-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30.1,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 79,
                "right": 0,
                "bottom": 126,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "condition": {
                "oneUi": "8.0",
                "android": "16",
                "note": "Samsung RTL SM-F946B, build BP2A.250605.031.A3.F946BXXS5FYJ3. main display, rotation 3, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold5 main, rotation 3, threeButton (SM-F946B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold5/recapture-2026-09-27-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      insets: {
        gesture: {
          systemBars: { top: 30.48, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 80, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 30.48, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 80, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainThreeButton],
        },
      },
      sources: [samsungSpecs, samsungSkinPage, mainThreeButton, mainGesture],
    },
  ],
  sources: [samsungSpecs, samsungSkinPage, coverThreeButton, coverGesture, mainThreeButton, mainGesture],
};
