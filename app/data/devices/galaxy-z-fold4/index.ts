import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold4 specifications",
  url: "https://news.samsung.com/us/samsung-galaxy-z-flip4-galaxy-z-fold4-unpacked-2022-most-versatile-smartphones/",
  retrievedAt: "2026-09-23",
};
const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-23",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4";
const source = (screen: "cover" | "main", mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold4 ${screen}, ${mode} (SM-F936B)`,
  url: `${captureBase}/${screen}-${mode}.json`,
  retrievedAt: "2026-09-23",
});
const coverGesture = source("cover", "gesture");
const coverThreeButton = source("cover", "threeButton");
const mainGesture = source("main", "gesture");
const mainThreeButton = source("main", "threeButton");

const coverCondition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL, physically folded, portrait (rotation 0). Active window 904×2316 px with a 68×87 px cutout at x=418. A rotated first gesture attempt is retained as rejected evidence.",
};
const mainCondition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL, physically unfolded, portrait (rotation 0). Active window 1812×2176 px with a vertical FLAT folding feature at x=906. Taskbar was turned off for both accepted captures. The first gesture attempt with taskbar (168 px bottom) and a rotated 3-button attempt are retained as rejected evidence.",
};
const coverCutout = {
  xDp: 159.24,
  yDp: 0,
  widthDp: 25.9,
  heightDp: 33.14,
  rightDp: 159.24,
  bottomDp: 849.15,
  xPx: 418,
  yPx: 0,
  widthPx: 68,
  heightPx: 87,
  rightPx: 418,
  bottomPx: 2229,
};

export const galaxyZFold4: Device = {
  slug: "galaxy-z-fold4",
  name: "Galaxy Z Fold4",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2022,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 6.2,
      resolutionPx: { width: 904, height: 2316 },
      logicalSizePx: { width: 904, height: 2316 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 403,
      logicalSizeDp: { width: 344.38, height: 882.29 },
      densityDpi: 420,
      cornerRadiiDp: null,
      cornerRadiiPx: null,
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
                "top": 24,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
                "right": 0,
                "bottom": 39,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 33.14
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 87
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 159.24,
                "widthDp": 33.14,
                "heightDp": 25.9,
                "rightDp": 849.15,
                "bottomDp": 159.24,
                "xPx": 0,
                "yPx": 418,
                "widthPx": 87,
                "heightPx": 68,
                "rightPx": 2229,
                "bottomPx": 418
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. cover display, rotation 1, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 cover, rotation 1, gesture (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/cover-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 24,
                "right": 48,
                "bottom": 0,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
                "right": 126,
                "bottom": 0,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 33.14
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 87
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 159.24,
                "widthDp": 33.14,
                "heightDp": 25.9,
                "rightDp": 849.15,
                "bottomDp": 159.24,
                "xPx": 0,
                "yPx": 418,
                "widthPx": 87,
                "heightPx": 68,
                "rightPx": 2229,
                "bottomPx": 418
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. cover display, rotation 1, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 cover, rotation 1, threeButton (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/cover-landscape-1-threeButton.json",
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
                "top": 24,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
                "right": 0,
                "bottom": 39,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 33.14,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 87,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 849.14,
                "yDp": 159.24,
                "widthDp": 33.14,
                "heightDp": 25.9,
                "rightDp": 0.0,
                "bottomDp": 159.24,
                "xPx": 2229,
                "yPx": 418,
                "widthPx": 87,
                "heightPx": 68,
                "rightPx": 0,
                "bottomPx": 418
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. cover display, rotation 3, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 cover, rotation 3, gesture (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/cover-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 0,
                "left": 48
              },
              "systemBarsPx": {
                "top": 63,
                "right": 0,
                "bottom": 0,
                "left": 126
              },
              "displayCutout": {
                "top": 0,
                "right": 33.14,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 87,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 849.14,
                "yDp": 159.24,
                "widthDp": 33.14,
                "heightDp": 25.9,
                "rightDp": 0.0,
                "bottomDp": 159.24,
                "xPx": 2229,
                "yPx": 418,
                "widthPx": 87,
                "heightPx": 68,
                "rightPx": 0,
                "bottomPx": 418
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. cover display, rotation 3, 2316×904 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 cover, rotation 3, threeButton (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/cover-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      insets: {
        gesture: {
          systemBars: { top: 33.14, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 87, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 33.14, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 87, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 33.14, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 87, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 33.14, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 87, right: 0, bottom: 0, left: 0 },
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
      ppi: 377,
      logicalSizeDp: { width: 690.29, height: 828.95 },
      densityDpi: 420,
      cornerRadiiDp: { topLeft: 20.19, topRight: 20.19, bottomRight: 20.19, bottomLeft: 20.19 },
      cornerRadiiPx: { topLeft: 53, topRight: 53, bottomRight: 53, bottomLeft: 53 },
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
                "top": 24,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
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
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. main display, rotation 1, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 main, rotation 1, gesture (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/main-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
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
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. main display, rotation 1, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 main, rotation 1, threeButton (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/main-landscape-1-threeButton.json",
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
                "top": 24,
                "right": 0,
                "bottom": 14.86,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
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
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. main display, rotation 3, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 main, rotation 3, gesture (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/main-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 63,
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
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F936B, build UP1A.231005.007.F936BXXS7FXE6. main display, rotation 3, 2176×1812 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold4 main, rotation 3, threeButton (SM-F936B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold4/recapture-2026-09-27-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      insets: {
        gesture: {
          systemBars: { top: 31.24, right: 0, bottom: 14.86, left: 0 },
          systemBarsPx: { top: 82, right: 0, bottom: 39, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 31.24, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 82, right: 0, bottom: 126, left: 0 },
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
