import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Fold3 5G announcement and specifications",
  url: "https://news.samsung.com/us/galaxy-z-fold3-5g-galaxy-z-flip3-5g-unpacked-2021-next-mobile-innovation/",
  retrievedAt: "2026-09-25",
};
const samsungSkinPage: Source = {
  kind: "official",
  label: "Samsung Developer – Galaxy Z emulator skins",
  url: "https://developer.samsung.com/galaxy-emulator-skin/galaxy-z.html",
  retrievedAt: "2026-09-25",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3";
const source = (screen: "cover" | "main", mode: "gesture" | "threeButton", unit: "VN1" | "VN2"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Fold3 ${screen}, ${mode} (SM-F926B-${unit})`,
  url: `${captureBase}/${screen}-${mode}.json`,
  retrievedAt: "2026-09-25",
});
const coverThreeButton = source("cover", "threeButton", "VN1");
const coverGesture = source("cover", "gesture", "VN1");
const mainThreeButton = source("main", "threeButton", "VN1");
const mainGesture = source("main", "gesture", "VN2");

const coverCondition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL Vietnam/Hanoi, physically folded, portrait (rotation 0). The active window is 840×2289 px at 420 dpi, close to the official 832×2268 cover skin. The 62×82 px centered camera cutout gives an 82 px top safe inset. Both navigation modes were captured on SM-F926B-VN1.",
};
const mainCondition = {
  oneUi: "6.1",
  android: "14",
  note: "Samsung RTL Vietnam/Hanoi, physically unfolded, portrait (rotation 0). Active window 1768×2208 px with a vertical FLAT folding feature at x=884. The main 3-button capture is from SM-F926B-VN1; gesture is from SM-F926B-VN2, on the same model/build. User screenshots show the persistent Taskbar in both Buttons and Swipe gestures settings. Gesture navigation is confirmed by Settings/configuration and side system-gesture insets although Probe's inset-only classifier reports 3-button; the measured bottom system inset is 64 dp in gesture mode and 48 dp in 3-button mode. Preserve this model-specific difference.",
};
const coverCutout = {
  xDp: 148.19,
  yDp: 0,
  widthDp: 23.62,
  heightDp: 31.24,
  rightDp: 147.91,
  bottomDp: 839.16,
  xPx: 389,
  yPx: 0,
  widthPx: 62,
  heightPx: 82,
  rightPx: 389,
  bottomPx: 2207,
};
const mainCorners = { topLeft: 20.19, topRight: 20.19, bottomRight: 20.19, bottomLeft: 20.19 };
const mainCornersPx = { topLeft: 53, topRight: 53, bottomRight: 53, bottomLeft: 53 };

export const galaxyZFold3: Device = {
  slug: "galaxy-z-fold3",
  name: "Galaxy Z Fold3",
  brand: "Samsung",
  series: "Galaxy Z Fold",
  formFactor: "foldable-book",
  releaseYear: 2021,
  screens: [
    {
      id: "cover",
      label: "Cover",
      diagonalInch: 6.2,
      resolutionPx: { width: 832, height: 2268 },
      logicalSizePx: { width: 840, height: 2289 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 0,
      logicalSizeDp: { width: 320, height: 872 },
      densityDpi: 420,
      cornerRadiiDp: null,
      cornerRadiiPx: null,
      rotations: {
        "1": {
          "logicalSizePx": {
            "width": 2289,
            "height": 840
          },
          "logicalSizeDp": {
            "width": 872,
            "height": 320
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
                "left": 31.24
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 82
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 148.19,
                "widthDp": 31.24,
                "heightDp": 23.62,
                "rightDp": 840.76,
                "bottomDp": 148.19,
                "xPx": 0,
                "yPx": 389,
                "widthPx": 82,
                "heightPx": 62,
                "rightPx": 2207,
                "bottomPx": 389
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. cover display, rotation 1, 2289×840 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 cover, rotation 1, gesture (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/cover-landscape-1-gesture.json",
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
                "left": 31.24
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 82
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 148.19,
                "widthDp": 31.24,
                "heightDp": 23.62,
                "rightDp": 840.76,
                "bottomDp": 148.19,
                "xPx": 0,
                "yPx": 389,
                "widthPx": 82,
                "heightPx": 62,
                "rightPx": 2207,
                "bottomPx": 389
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. cover display, rotation 1, 2289×840 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 cover, rotation 1, threeButton (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/cover-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2289,
            "height": 840
          },
          "logicalSizeDp": {
            "width": 872,
            "height": 320
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
                "right": 31.24,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 82,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 840.76,
                "yDp": 148.19,
                "widthDp": 31.24,
                "heightDp": 23.62,
                "rightDp": 0,
                "bottomDp": 148.19,
                "xPx": 2207,
                "yPx": 389,
                "widthPx": 82,
                "heightPx": 62,
                "rightPx": 0,
                "bottomPx": 389
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. cover display, rotation 3, 2289×840 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 cover, rotation 3, gesture (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/cover-landscape-3-gesture.json",
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
                "right": 31.24,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 82,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 840.76,
                "yDp": 148.19,
                "widthDp": 31.24,
                "heightDp": 23.62,
                "rightDp": 0,
                "bottomDp": 148.19,
                "xPx": 2207,
                "yPx": 389,
                "widthPx": 82,
                "heightPx": 62,
                "rightPx": 0,
                "bottomPx": 389
              },
              "condition": {
                "oneUi": "6.1",
                "android": "14",
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. cover display, rotation 3, 2289×840 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 cover, rotation 3, threeButton (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/cover-landscape-3-threeButton.json",
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
          displayCutout: { top: 31.24, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
          cutoutShape: coverCutout,
          condition: coverCondition,
          sources: [coverGesture],
        },
        threeButton: {
          systemBars: { top: 31.24, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 82, right: 0, bottom: 126, left: 0 },
          displayCutout: { top: 31.24, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 82, right: 0, bottom: 0, left: 0 },
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
      resolutionPx: { width: 1768, height: 2208 },
      logicalSizePx: { width: 1768, height: 2208 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 0,
      logicalSizeDp: { width: 673.52, height: 841.14 },
      densityDpi: 420,
      cornerRadiiDp: mainCorners,
      cornerRadiiPx: mainCornersPx,
      rotations: {
        "1": {
          "logicalSizePx": {
            "width": 2208,
            "height": 1768
          },
          "logicalSizeDp": {
            "width": 841.14,
            "height": 673.52
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
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. main display, rotation 1, 2208×1768 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 main, rotation 1, gesture (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/main-landscape-1-gesture.json",
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
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. main display, rotation 1, 2208×1768 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 main, rotation 1, threeButton (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/main-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2208,
            "height": 1768
          },
          "logicalSizeDp": {
            "width": 841.14,
            "height": 673.52
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
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. main display, rotation 3, 2208×1768 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 main, rotation 3, gesture (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/main-landscape-3-gesture.json",
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
                "note": "Samsung RTL SM-F926B, build UP1A.231005.007.F926BXXU6HXDB. main display, rotation 3, 2208×1768 px, full screen, 420 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-fold3 main, rotation 3, threeButton (SM-F926B)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-fold/galaxy-z-fold3/recapture-2026-09-27-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      insets: {
        gesture: {
          systemBars: { top: 33.52, right: 0, bottom: 64, left: 0 },
          systemBarsPx: { top: 88, right: 0, bottom: 168, left: 0 },
          displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
          condition: mainCondition,
          sources: [mainGesture],
        },
        threeButton: {
          systemBars: { top: 33.52, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 88, right: 0, bottom: 126, left: 0 },
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
