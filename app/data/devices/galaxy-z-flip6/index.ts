import type { Device, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Z Flip6 Specifications",
  url: "https://www.samsung.com/us/smartphones/galaxy-z-flip6/specs/",
  retrievedAt: "2025-01-14",
};
const captureBase = "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip6";
const measuredSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy Z Flip6 main, ${mode} (SM-F741U)`,
  url: `${captureBase}/main-${mode}.json`,
  retrievedAt: "2026-09-23",
});
const gestureSource = measuredSource("gesture");
const threeButtonSource = measuredSource("threeButton");
const condition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL Korea/Gumi, SM-F741U-KR10, physically unfolded in portrait (rotation 0). Active and maximum windows both 1080×2640 px; density 480 dpi matched the default. A horizontal FLAT folding feature crossed y=1320. View rotation does not supply landscape insets.",
};
const cutoutShape = {
  xPx: 505, yPx: 0, widthPx: 71, heightPx: 94, rightPx: 504, bottomPx: 2546,
  xDp: 168.33, yDp: 0, widthDp: 23.67, heightDp: 31.33, rightDp: 168, bottomDp: 848.67,
};

export const galaxyZFlip6: Device = {
  slug: "galaxy-z-flip6",
  name: "Galaxy Z Flip6",
  brand: "Samsung",
  series: "Galaxy Z Flip",
  formFactor: "foldable-flip",
  releaseYear: 2024,
  screens: [
    {
      id: "main",
      label: "Main",
      diagonalInch: 6.7,
      resolutionPx: { width: 1080, height: 2640 },
      logicalSizePx: { width: 1080, height: 2640 },
      captureOrientation: "portrait",
      captureRotation: 0,
      ppi: 425,
      logicalSizeDp: { width: 360, height: 880 },
      densityDpi: 480,
      cornerRadiiDp: { topLeft: 38, topRight: 38, bottomRight: 38, bottomLeft: 38 },
      cornerRadiiPx: { topLeft: 114, topRight: 114, bottomRight: 114, bottomLeft: 114 },
      rotations: {
        "1": {
          "logicalSizePx": {
            "width": 2640,
            "height": 1080
          },
          "logicalSizeDp": {
            "width": 880,
            "height": 360
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 30,
                "right": 0,
                "bottom": 15,
                "left": 0
              },
              "systemBarsPx": {
                "top": 90,
                "right": 0,
                "bottom": 45,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 31.33
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 94
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 168,
                "widthDp": 31.33,
                "heightDp": 23.67,
                "rightDp": 848.67,
                "bottomDp": 168.33,
                "xPx": 0,
                "yPx": 504,
                "widthPx": 94,
                "heightPx": 71,
                "rightPx": 2546,
                "bottomPx": 505
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Samsung RTL SM-F741U, build BP4A.251205.006.F741USQS4DZG3. main display, rotation 1, 2640×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-flip6 main, rotation 1, gesture (SM-F741U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip6/recapture-2026-09-27-rotation/main-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30,
                "right": 48,
                "bottom": 0,
                "left": 0
              },
              "systemBarsPx": {
                "top": 90,
                "right": 144,
                "bottom": 0,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 31.33
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 94
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 168,
                "widthDp": 31.33,
                "heightDp": 23.67,
                "rightDp": 848.67,
                "bottomDp": 168.33,
                "xPx": 0,
                "yPx": 504,
                "widthPx": 94,
                "heightPx": 71,
                "rightPx": 2546,
                "bottomPx": 505
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Samsung RTL SM-F741U, build BP4A.251205.006.F741USQS4DZG3. main display, rotation 1, 2640×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-flip6 main, rotation 1, threeButton (SM-F741U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip6/recapture-2026-09-27-rotation/main-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2640,
            "height": 1080
          },
          "logicalSizeDp": {
            "width": 880,
            "height": 360
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 30,
                "right": 0,
                "bottom": 15,
                "left": 0
              },
              "systemBarsPx": {
                "top": 90,
                "right": 0,
                "bottom": 45,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 31.33,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 94,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 848.67,
                "yDp": 168.33,
                "widthDp": 31.33,
                "heightDp": 23.67,
                "rightDp": 0,
                "bottomDp": 168,
                "xPx": 2546,
                "yPx": 505,
                "widthPx": 94,
                "heightPx": 71,
                "rightPx": 0,
                "bottomPx": 504
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Samsung RTL SM-F741U, build BP4A.251205.006.F741USQS4DZG3. main display, rotation 3, 2640×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-flip6 main, rotation 3, gesture (SM-F741U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip6/recapture-2026-09-27-rotation/main-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30,
                "right": 0,
                "bottom": 0,
                "left": 48
              },
              "systemBarsPx": {
                "top": 90,
                "right": 0,
                "bottom": 0,
                "left": 144
              },
              "displayCutout": {
                "top": 0,
                "right": 31.33,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 94,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 848.67,
                "yDp": 168.33,
                "widthDp": 31.33,
                "heightDp": 23.67,
                "rightDp": 0,
                "bottomDp": 168,
                "xPx": 2546,
                "yPx": 505,
                "widthPx": 94,
                "heightPx": 71,
                "rightPx": 0,
                "bottomPx": 504
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Samsung RTL SM-F741U, build BP4A.251205.006.F741USQS4DZG3. main display, rotation 3, 2640×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL galaxy-z-flip6 main, rotation 3, threeButton (SM-F741U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-flip6/recapture-2026-09-27-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      insets: {
        gesture: {
          systemBars: { top: 31.33, right: 0, bottom: 15, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 45, left: 0 },
          displayCutout: { top: 31.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [gestureSource],
        },
        threeButton: {
          systemBars: { top: 31.33, right: 0, bottom: 48, left: 0 },
          systemBarsPx: { top: 94, right: 0, bottom: 144, left: 0 },
          displayCutout: { top: 31.33, right: 0, bottom: 0, left: 0 },
          displayCutoutPx: { top: 94, right: 0, bottom: 0, left: 0 },
          cutoutShape,
          condition,
          sources: [threeButtonSource],
        },
      },
      sources: [samsungSpecs, gestureSource, threeButtonSource],
    },
  ],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
