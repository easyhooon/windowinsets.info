import type { Device } from "../../types";

// Values transcribed from the dated immutable Probe captures; product specs remain unsourced.
export const galaxyZFold8Ultra: Device = {
  "slug": "galaxy-z-fold8-ultra",
  "name": "Galaxy Z Fold8 Ultra",
  "brand": "Samsung",
  "series": "Galaxy Z Fold",
  "formFactor": "foldable-book",
  "releaseYear": 2026,
  "screens": [
    {
      "id": "cover",
      "label": "Cover",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 1080,
        "height": 2520
      },
      "logicalSizePx": {
        "width": 1080,
        "height": 2520
      },
      "captureOrientation": "portrait",
      "captureRotation": 0,
      "ppi": 0,
      "logicalSizeDp": {
        "width": 360,
        "height": 840
      },
      "densityDpi": 480,
      "cornerRadiiDp": {
        "topLeft": 5,
        "topRight": 5,
        "bottomRight": 5,
        "bottomLeft": 5
      },
      "cornerRadiiPx": {
        "topLeft": 15,
        "topRight": 15,
        "bottomRight": 15,
        "bottomLeft": 15
      },
      "insets": {
        "gesture": {
          "systemBars": {
            "top": 37.67,
            "right": 0,
            "bottom": 15,
            "left": 0
          },
          "systemBarsPx": {
            "top": 113,
            "right": 0,
            "bottom": 45,
            "left": 0
          },
          "displayCutout": {
            "top": 36,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 108,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "condition": {
            "oneUi": "9.0",
            "android": "17",
            "note": "Samsung RTL Korea/Gumi, SM-F976U_KR2, build CP2A.260605.016.F976USQS2AZH7. Portrait, default density 480 dpi and font scale 1. Physically folded, 1080×2520 px, no folding feature. RTL hinge sensor stayed at 90° in both states and is not used to classify the screen. View rotation rotates this capture, not measured landscape insets."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra cover, gesture (SM-F976U)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/cover-gesture-2026-09-23.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "cutoutShape": {
            "xDp": 168.33,
            "yDp": 0,
            "widthDp": 23.33,
            "heightDp": 36,
            "rightDp": 168.33,
            "bottomDp": 804.0,
            "xPx": 505,
            "yPx": 0,
            "widthPx": 70,
            "heightPx": 108,
            "rightPx": 505,
            "bottomPx": 2412
          }
        },
        "threeButton": {
          "systemBars": {
            "top": 37.67,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "systemBarsPx": {
            "top": 113,
            "right": 0,
            "bottom": 144,
            "left": 0
          },
          "displayCutout": {
            "top": 36,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 108,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "condition": {
            "oneUi": "9.0",
            "android": "17",
            "note": "Samsung RTL Korea/Gumi, SM-F976U_KR2, build CP2A.260605.016.F976USQS2AZH7. Portrait, default density 480 dpi and font scale 1. Physically folded, 1080×2520 px, no folding feature. RTL hinge sensor stayed at 90° in both states and is not used to classify the screen. View rotation rotates this capture, not measured landscape insets."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra cover, threeButton (SM-F976U)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/cover-threeButton-2026-09-23.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "cutoutShape": {
            "xDp": 168.33,
            "yDp": 0,
            "widthDp": 23.33,
            "heightDp": 36,
            "rightDp": 168.33,
            "bottomDp": 804.0,
            "xPx": 505,
            "yPx": 0,
            "widthPx": 70,
            "heightPx": 108,
            "rightPx": 505,
            "bottomPx": 2412
          }
        }
      },
      rotations: {
        "1": {
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
                "left": 36
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 108
              },
              "cutoutShape": {
                "xDp": 0.0,
                "yDp": 168.33,
                "widthDp": 36.0,
                "heightDp": 23.33,
                "rightDp": 804.0,
                "bottomDp": 168.33,
                "xPx": 0,
                "yPx": 505,
                "widthPx": 108,
                "heightPx": 70,
                "rightPx": 2412,
                "bottomPx": 505
              },
              "condition": {
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Cover display, rotation 1, 2520×1080 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra cover, rotation 1, gesture (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/cover-landscape-1-gesture.json",
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
                "left": 36
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 108
              },
              "cutoutShape": {
                "xDp": 0.0,
                "yDp": 168.33,
                "widthDp": 36.0,
                "heightDp": 23.33,
                "rightDp": 804.0,
                "bottomDp": 168.33,
                "xPx": 0,
                "yPx": 505,
                "widthPx": 108,
                "heightPx": 70,
                "rightPx": 2412,
                "bottomPx": 505
              },
              "condition": {
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Cover display, rotation 1, 2520×1080 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra cover, rotation 1, threeButton (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/cover-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          },
          "logicalSizePx": {
            "width": 2520,
            "height": 1080
          },
          "logicalSizeDp": {
            "width": 840.0,
            "height": 360.0
          }
        },
        "3": {
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
                "right": 36,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 108,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 804.0,
                "yDp": 168.33,
                "widthDp": 36.0,
                "heightDp": 23.33,
                "rightDp": 0.0,
                "bottomDp": 168.33,
                "xPx": 2412,
                "yPx": 505,
                "widthPx": 108,
                "heightPx": 70,
                "rightPx": 0,
                "bottomPx": 505
              },
              "condition": {
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Cover display, rotation 3, 2520×1080 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra cover, rotation 3, gesture (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/cover-landscape-3-gesture.json",
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
                "right": 36,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 108,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 804.0,
                "yDp": 168.33,
                "widthDp": 36.0,
                "heightDp": 23.33,
                "rightDp": 0.0,
                "bottomDp": 168.33,
                "xPx": 2412,
                "yPx": 505,
                "widthPx": 108,
                "heightPx": 70,
                "rightPx": 0,
                "bottomPx": 505
              },
              "condition": {
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Cover display, rotation 3, 2520×1080 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra cover, rotation 3, threeButton (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/cover-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          },
          "logicalSizePx": {
            "width": 2520,
            "height": 1080
          },
          "logicalSizeDp": {
            "width": 840.0,
            "height": 360.0
          }
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra cover, gesture (SM-F976U)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/cover-gesture-2026-09-23.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra cover, threeButton (SM-F976U)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/cover-threeButton-2026-09-23.json",
          "retrievedAt": "2026-09-23"
        }
      ]
    },
    {
      "id": "main",
      "label": "Main",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 2256,
        "height": 2504
      },
      "logicalSizePx": {
        "width": 2256,
        "height": 2504
      },
      "captureOrientation": "portrait",
      "captureRotation": 0,
      "ppi": 0,
      "logicalSizeDp": {
        "width": 752,
        "height": 834.67
      },
      "densityDpi": 480,
      "cornerRadiiDp": {
        "topLeft": 5,
        "topRight": 5,
        "bottomRight": 5,
        "bottomLeft": 5
      },
      "cornerRadiiPx": {
        "topLeft": 15,
        "topRight": 15,
        "bottomRight": 15,
        "bottomLeft": 15
      },
      "insets": {
        "gesture": {
          "systemBars": {
            "top": 37.67,
            "right": 0,
            "bottom": 15,
            "left": 0
          },
          "systemBarsPx": {
            "top": 113,
            "right": 0,
            "bottom": 45,
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
            "oneUi": "9.0",
            "android": "17",
            "note": "Samsung RTL Korea/Gumi, SM-F976U_KR2, build CP2A.260605.016.F976USQS2AZH7. Portrait, default density 480 dpi and font scale 1. Fully unfolded, 2256×2504 px, vertical FLAT folding feature at x=1128 px. Gesture navigation is confirmed by Android config and side gesture regions; the legacy tappable-inset heuristic disagrees. RTL hinge sensor stayed at 90° in both states and is not used to classify the screen. View rotation rotates this capture, not measured landscape insets."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra main, gesture (SM-F976U)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/main-gesture-2026-09-23.json",
              "retrievedAt": "2026-09-23"
            }
          ]
        },
        "threeButton": {
          "systemBars": {
            "top": 37.67,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "systemBarsPx": {
            "top": 113,
            "right": 0,
            "bottom": 144,
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
            "oneUi": "9.0",
            "android": "17",
            "note": "Samsung RTL Korea/Gumi, SM-F976U_KR2, build CP2A.260605.016.F976USQS2AZH7. Portrait, default density 480 dpi and font scale 1. Fully unfolded, 2256×2504 px, vertical FLAT folding feature at x=1128 px. RTL hinge sensor stayed at 90° in both states and is not used to classify the screen. View rotation rotates this capture, not measured landscape insets."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra main, threeButton (SM-F976U)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/main-threeButton-2026-09-23.json",
              "retrievedAt": "2026-09-23"
            }
          ]
        }
      },
      rotations: {
        "1": {
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
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "condition": {
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Inner display, rotation 1, 2504×2256 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra inner, rotation 1, gesture (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/main-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 90,
                "right": 0,
                "bottom": 144,
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
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Inner display, rotation 1, 2504×2256 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra inner, rotation 1, threeButton (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/main-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          },
          "logicalSizePx": {
            "width": 2504,
            "height": 2256
          },
          "logicalSizeDp": {
            "width": 834.67,
            "height": 752.0
          }
        },
        "3": {
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
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
              },
              "condition": {
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Inner display, rotation 3, 2504×2256 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra inner, rotation 3, gesture (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/main-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            },
            "threeButton": {
              "systemBars": {
                "top": 30,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 90,
                "right": 0,
                "bottom": 144,
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
                "oneUi": "9.0",
                "android": "17",
                "note": "Samsung RTL SM-F976U, build CP2A.260605.016.F976USQU1AZGI. Inner display, rotation 3, 2504×2256 px at 480 dpi and font scale 1. Captured separately with InsetsProbe 1.5.0 on 2026-09-27; the Android navigation setting and configuration agree."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Samsung RTL Galaxy Z Fold8 Ultra inner, rotation 3, threeButton (SM-F976U)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/recapture-2026-09-27-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          },
          "logicalSizePx": {
            "width": 2504,
            "height": 2256
          },
          "logicalSizeDp": {
            "width": 834.67,
            "height": 752.0
          }
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra main, gesture (SM-F976U)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/main-gesture-2026-09-23.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra main, threeButton (SM-F976U)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/main-threeButton-2026-09-23.json",
          "retrievedAt": "2026-09-23"
        }
      ]
    }
  ],
  "sources": [
    {
      "kind": "measured",
      "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra cover, gesture (SM-F976U)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/cover-gesture-2026-09-23.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra cover, threeButton (SM-F976U)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/cover-threeButton-2026-09-23.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra main, gesture (SM-F976U)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/main-gesture-2026-09-23.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.2.1 on Samsung RTL Galaxy Z Fold8 Ultra main, threeButton (SM-F976U)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold8-ultra/main-threeButton-2026-09-23.json",
      "retrievedAt": "2026-09-23"
    }
  ]
};
