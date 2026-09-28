import type { Device } from "../../types";

// Raw captures are immutable. PPI and diagonal remain unsourced; do not infer them.
export const galaxyZFold2: Device = {
  "slug": "galaxy-z-fold2",
  "name": "Galaxy Z Fold2",
  "brand": "Samsung",
  "series": "Galaxy Z Fold",
  "formFactor": "foldable-book",
  "releaseYear": 2020,
  "screens": [
    {
      "id": "cover",
      "label": "Cover",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 816,
        "height": 2260
      },
      "logicalSizePx": { "width": 960, "height": 2658 },
      "captureOrientation": "portrait",
      "ppi": 0,
      "logicalSizeDp": {
        "width": 320,
        "height": 886
      },
      "densityDpi": 480,
      "cornerRadiiDp": null,
      "cornerRadiiPx": null,
      "rotations": {
        "1": {
          "logicalSizePx": {
            "width": 2658,
            "height": 960
          },
          "logicalSizeDp": {
            "width": 886.0,
            "height": 320.0
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 15,
                "left": 0
              },
              "systemBarsPx": {
                "top": 72,
                "right": 0,
                "bottom": 45,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 30.67
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 92
              },
              "cutoutShape": {
                "xDp": 0.0,
                "yDp": 148.0,
                "widthDp": 30.67,
                "heightDp": 24.0,
                "rightDp": 855.33,
                "bottomDp": 148.0,
                "xPx": 0,
                "yPx": 444,
                "widthPx": 92,
                "heightPx": 72,
                "rightPx": 2566,
                "bottomPx": 444
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, closed, rotation 1, 2658×960 px, full screen, 480 dpi, font scale 0.8. Swipe gestures with hints. App window uses the observed 960×2658 cover override while wm reports an 816×2260 panel. Rounded corners unavailable. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 cover, rotation 1, gesture (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/cover-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-28"
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
                "top": 72,
                "right": 144,
                "bottom": 0,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 30.67
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 92
              },
              "cutoutShape": {
                "xDp": 0.0,
                "yDp": 148.0,
                "widthDp": 30.67,
                "heightDp": 24.0,
                "rightDp": 855.33,
                "bottomDp": 148.0,
                "xPx": 0,
                "yPx": 444,
                "widthPx": 92,
                "heightPx": 72,
                "rightPx": 2566,
                "bottomPx": 444
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, closed, rotation 1, 2658×960 px, full screen, 480 dpi, font scale 0.8. Three-button navigation. App window uses the observed 960×2658 cover override while wm reports an 816×2260 panel. Rounded corners unavailable. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 cover, rotation 1, threeButton (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/cover-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-28"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2658,
            "height": 960
          },
          "logicalSizeDp": {
            "width": 886.0,
            "height": 320.0
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 15,
                "left": 0
              },
              "systemBarsPx": {
                "top": 72,
                "right": 0,
                "bottom": 45,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 30.67,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 92,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 855.33,
                "yDp": 148.0,
                "widthDp": 30.67,
                "heightDp": 24.0,
                "rightDp": 0.0,
                "bottomDp": 148.0,
                "xPx": 2566,
                "yPx": 444,
                "widthPx": 92,
                "heightPx": 72,
                "rightPx": 0,
                "bottomPx": 444
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, closed, rotation 3, 2658×960 px, full screen, 480 dpi, font scale 0.8. Swipe gestures with hints. App window uses the observed 960×2658 cover override while wm reports an 816×2260 panel. Rounded corners unavailable. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 cover, rotation 3, gesture (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/cover-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-28"
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
                "top": 72,
                "right": 0,
                "bottom": 0,
                "left": 144
              },
              "displayCutout": {
                "top": 0,
                "right": 30.67,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 92,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 855.33,
                "yDp": 148.0,
                "widthDp": 30.67,
                "heightDp": 24.0,
                "rightDp": 0.0,
                "bottomDp": 148.0,
                "xPx": 2566,
                "yPx": 444,
                "widthPx": 92,
                "heightPx": 72,
                "rightPx": 0,
                "bottomPx": 444
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, closed, rotation 3, 2658×960 px, full screen, 480 dpi, font scale 0.8. Three-button navigation. App window uses the observed 960×2658 cover override while wm reports an 816×2260 panel. Rounded corners unavailable. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 cover, rotation 3, threeButton (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/cover-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-28"
                }
              ]
            }
          }
        }
      },
      "insets": {
        "gesture": {
          "systemBars": {
            "top": 31,
            "right": 0,
            "bottom": 15,
            "left": 0
          },
          "systemBarsPx": { "top": 93, "right": 0, "bottom": 45, "left": 0 },
          "displayCutout": {
            "top": 30.67,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": { "top": 92, "right": 0, "bottom": 0, "left": 0 },
          "cutoutShape": {
            "xDp": 148,
            "yDp": 0,
            "widthDp": 24,
            "heightDp": 30.67,
            "rightDp": 148,
            "bottomDp": 855.33,
            "xPx": 444, "yPx": 0, "widthPx": 72, "heightPx": 92,
            "rightPx": 444, "bottomPx": 2566
          },
          "condition": {
            "oneUi": "5.1.1",
            "android": "13",
            "note": "Physical device, closed, portrait; swipe gestures with gesture hints; font scale 0.8; density 480 dpi. Captured app window is 960×2658 px (320×886 dp), while wm reports a physical panel of 816×2260. This cover configuration reappeared automatically after closing; its original source is unverified. Bottom gesture inset is 15 dp. Hinge-angle sensor and rounded corners unavailable."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Fold2 cover, gestures (SM-F916N)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/cover-gesture.json",
              "retrievedAt": "2026-09-22"
            }
          ]
        },
        "threeButton": {
          "systemBars": {
            "top": 31,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "systemBarsPx": { "top": 93, "right": 0, "bottom": 144, "left": 0 },
          "displayCutout": {
            "top": 30.67,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": { "top": 92, "right": 0, "bottom": 0, "left": 0 },
          "cutoutShape": {
            "xDp": 148,
            "yDp": 0,
            "widthDp": 24,
            "heightDp": 30.67,
            "rightDp": 148,
            "bottomDp": 855.33,
            "xPx": 444, "yPx": 0, "widthPx": 72, "heightPx": 92,
            "rightPx": 444, "bottomPx": 2566
          },
          "condition": {
            "oneUi": "5.1.1",
            "android": "13",
            "note": "Physical device, closed, portrait; font scale 0.8; density 480 dpi. Captured app window is 960×2658 px (320×886 dp), while wm reports a physical panel of 816×2260. A size reset retained the 960×2658 override; its origin is unverified. These values describe the observed app configuration, not every Fold2. Hinge-angle sensor and rounded corners unavailable."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 cover (SM-F916N)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/cover-threeButton.json",
              "retrievedAt": "2026-09-22"
            }
          ]
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "Galaxy Z Fold2 physical panel and app-window investigation notes",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/README.md",
          "retrievedAt": "2026-09-22"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 cover (SM-F916N)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/cover-threeButton.json",
          "retrievedAt": "2026-09-22"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Fold2 cover, gestures (SM-F916N)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/cover-gesture.json",
          "retrievedAt": "2026-09-22"
        }
      ]
    },
    {
      "id": "main",
      "label": "Main",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 1768,
        "height": 2208
      },
      "logicalSizePx": { "width": 1768, "height": 2208 },
      "captureOrientation": "portrait",
      "ppi": 0,
      "logicalSizeDp": {
        "width": 589.33,
        "height": 736
      },
      "densityDpi": 480,
      "cornerRadiiDp": {
        "topLeft": 20,
        "topRight": 20,
        "bottomRight": 20,
        "bottomLeft": 20
      },
      "cornerRadiiPx": { "topLeft": 60, "topRight": 60, "bottomRight": 60, "bottomLeft": 60 },
      "rotations": {
        "1": {
          "logicalSizePx": {
            "width": 2208,
            "height": 1768
          },
          "logicalSizeDp": {
            "width": 736.0,
            "height": 589.33
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 72,
                "right": 0,
                "bottom": 144,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 29.33
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 88
              },
              "cutoutShape": {
                "xDp": 0.0,
                "yDp": 128.0,
                "widthDp": 29.33,
                "heightDp": 25.0,
                "rightDp": 706.67,
                "bottomDp": 436.33,
                "xPx": 0,
                "yPx": 384,
                "widthPx": 88,
                "heightPx": 75,
                "rightPx": 2120,
                "bottomPx": 1309
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, fully open, rotation 1, 2208×1768 px, full screen, 480 dpi, font scale 0.8. Swipe gestures with hints; persistent taskbar supplies the 48 dp bottom inset. Hinge-angle sensor unavailable; WindowManager reports a FLAT fold. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 inner, rotation 1, gesture (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/main-landscape-1-gesture.json",
                  "retrievedAt": "2026-09-28"
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
                "top": 72,
                "right": 0,
                "bottom": 144,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 29.33
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 88
              },
              "cutoutShape": {
                "xDp": 0.0,
                "yDp": 128.0,
                "widthDp": 29.33,
                "heightDp": 25.0,
                "rightDp": 706.67,
                "bottomDp": 436.33,
                "xPx": 0,
                "yPx": 384,
                "widthPx": 88,
                "heightPx": 75,
                "rightPx": 2120,
                "bottomPx": 1309
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, fully open, rotation 1, 2208×1768 px, full screen, 480 dpi, font scale 0.8. Three-button navigation; persistent taskbar supplies the 48 dp bottom inset. Hinge-angle sensor unavailable; WindowManager reports a FLAT fold. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 inner, rotation 1, threeButton (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/main-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-28"
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
            "width": 736.0,
            "height": 589.33
          },
          "insets": {
            "gesture": {
              "systemBars": {
                "top": 24,
                "right": 0,
                "bottom": 48,
                "left": 0
              },
              "systemBarsPx": {
                "top": 72,
                "right": 0,
                "bottom": 144,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 29.33,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 88,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 706.67,
                "yDp": 436.33,
                "widthDp": 29.33,
                "heightDp": 25.0,
                "rightDp": 0.0,
                "bottomDp": 128.0,
                "xPx": 2120,
                "yPx": 1309,
                "widthPx": 88,
                "heightPx": 75,
                "rightPx": 0,
                "bottomPx": 384
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, fully open, rotation 3, 2208×1768 px, full screen, 480 dpi, font scale 0.8. Swipe gestures with hints; persistent taskbar supplies the 48 dp bottom inset. Hinge-angle sensor unavailable; WindowManager reports a FLAT fold. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 inner, rotation 3, gesture (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/main-landscape-3-gesture.json",
                  "retrievedAt": "2026-09-28"
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
                "top": 72,
                "right": 0,
                "bottom": 144,
                "left": 0
              },
              "displayCutout": {
                "top": 0,
                "right": 29.33,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 88,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 706.67,
                "yDp": 436.33,
                "widthDp": 29.33,
                "heightDp": 25.0,
                "rightDp": 0.0,
                "bottomDp": 128.0,
                "xPx": 2120,
                "yPx": 1309,
                "widthPx": 88,
                "heightPx": 75,
                "rightPx": 0,
                "bottomPx": 384
              },
              "condition": {
                "oneUi": "5.1.1",
                "android": "13",
                "note": "Physical device, fully open, rotation 3, 2208×1768 px, full screen, 480 dpi, font scale 0.8. Three-button navigation; persistent taskbar supplies the 48 dp bottom inset. Hinge-angle sensor unavailable; WindowManager reports a FLAT fold. Build TP1A.220624.014.F916NKSS4KXH1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on physical Galaxy Z Fold2 inner, rotation 3, threeButton (SM-F916N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/recapture-2026-09-28-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-28"
                }
              ]
            }
          }
        }
      },
      "insets": {
        "gesture": {
          "systemBars": {
            "top": 29.33,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "systemBarsPx": { "top": 88, "right": 0, "bottom": 144, "left": 0 },
          "displayCutout": {
            "top": 29.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": { "top": 88, "right": 0, "bottom": 0, "left": 0 },
          "cutoutShape": {
            "xDp": 436.33,
            "yDp": 0,
            "widthDp": 25,
            "heightDp": 29.33,
            "rightDp": 128,
            "bottomDp": 706.67,
            "xPx": 1309, "yPx": 0, "widthPx": 75, "heightPx": 88,
            "rightPx": 384, "bottomPx": 2120
          },
          "condition": {
            "oneUi": "5.1.1",
            "android": "13",
            "note": "Physical device, fully open, portrait; font scale 0.8; density 480 dpi. Swipe gestures with gesture hints and persistent taskbar visible: the taskbar contributes 48 dp bottom insets. Probe 1.1.2 verifies gesture mode using the active resource configuration and side system-gesture regions; the bottom-inset heuristic alone reports threeButton. Hinge-angle sensor unavailable; WindowManager reports FLAT."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Fold2 inner, gestures with taskbar (SM-F916N)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/main-gesture.json",
              "retrievedAt": "2026-09-22"
            }
          ]
        },
        "threeButton": {
          "systemBars": {
            "top": 29.33,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "systemBarsPx": { "top": 88, "right": 0, "bottom": 144, "left": 0 },
          "displayCutout": {
            "top": 29.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": { "top": 88, "right": 0, "bottom": 0, "left": 0 },
          "cutoutShape": {
            "xDp": 436.33,
            "yDp": 0,
            "widthDp": 25,
            "heightDp": 29.33,
            "rightDp": 128,
            "bottomDp": 706.67,
            "xPx": 1309, "yPx": 0, "widthPx": 75, "heightPx": 88,
            "rightPx": 384, "bottomPx": 2120
          },
          "condition": {
            "oneUi": "5.1.1",
            "android": "13",
            "note": "Physical device; portrait; font scale 0.8; density 480 dpi (matches reported default). Full-window dimensions include system bars. Hinge-angle sensor unavailable; WindowManager reports FLAT."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 (SM-F916N)",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/main-threeButton.json",
              "retrievedAt": "2026-09-22"
            }
          ]
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 (SM-F916N)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/main-threeButton.json",
          "retrievedAt": "2026-09-22"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Fold2 inner, gestures with taskbar (SM-F916N)",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/main-gesture.json",
          "retrievedAt": "2026-09-22"
        }
      ]
    }
  ],
  "sources": [
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 (SM-F916N)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/main-threeButton.json",
      "retrievedAt": "2026-09-22"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 cover (SM-F916N)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/cover-threeButton.json",
      "retrievedAt": "2026-09-22"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Fold2 inner, gestures with taskbar (SM-F916N)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/main-gesture.json",
      "retrievedAt": "2026-09-22"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Fold2 cover, gestures (SM-F916N)",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-z-fold2/cover-gesture.json",
      "retrievedAt": "2026-09-22"
    }
  ]
};
