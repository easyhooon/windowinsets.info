import type { Device } from "../../types";

// PPI and diagonal are not inferred from captures.
export const galaxyZFlip7: Device = {
  "slug": "galaxy-z-flip7",
  "name": "Galaxy Z Flip7",
  "brand": "Samsung",
  "series": "Galaxy Z Flip",
  "formFactor": "foldable-flip",
  "releaseYear": 2025,
  "screens": [
    {
      "id": "cover",
      "label": "Cover",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 948,
        "height": 1048
      },
      "ppi": 0,
      "logicalSizeDp": {
        "width": 361.14,
        "height": 399.24
      },
      "densityDpi": 420,
      "cornerRadiiDp": {
        "topLeft": 6.1,
        "topRight": 6.1,
        "bottomRight": 41.14,
        "bottomLeft": 41.14
      },
      "insets": {
        "threeButton": {
          "systemBars": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutout": {
            "top": 0,
            "right": 0,
            "bottom": 83.81,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 428,
            "yPx": 828,
            "widthPx": 520,
            "heightPx": 220,
            "rightPx": 0,
            "bottomPx": 0,
            "xDp": 163.05,
            "yDp": 315.43,
            "widthDp": 198.1,
            "heightDp": 83.81,
            "rightDp": 0.0,
            "bottomDp": 0.0
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, closed (0\u00b0), portrait; Probe explicitly launched on cover display 1 through ADB, full screen and awake. Density 420 dpi (2.625 scale), font scale 1.0; defaultDensityDpi 480 is the primary-display property, not a cover default. No system bars are exposed on this cover window. Navigation classification falls back to the selected Android setting; it does not imply visible navigation buttons or gestures. Rotation only rotates the recorded portrait diagram."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), threeButton setting",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/cover-threeButton-awake.json",
              "retrievedAt": "2026-09-23"
            },
            {
              "kind": "measured",
              "label": "InsetsProbe 1.6.0 on Samsung RTL Galaxy Z Flip7 cover via FlexWindow widget (SM-F766N), threeButton setting; values match the physical capture",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-28-flexwindow/cover-threeButton.json",
              "retrievedAt": "2026-09-28"
            }
          ],
          "systemBarsPx": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 0,
            "right": 0,
            "bottom": 220,
            "left": 0
          }
        },
        "gesture": {
          "systemBars": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutout": {
            "top": 0,
            "right": 0,
            "bottom": 83.81,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 428,
            "yPx": 828,
            "widthPx": 520,
            "heightPx": 220,
            "rightPx": 0,
            "bottomPx": 0,
            "xDp": 163.05,
            "yDp": 315.43,
            "widthDp": 198.1,
            "heightDp": 83.81,
            "rightDp": 0.0,
            "bottomDp": 0.0
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, closed (0\u00b0), portrait; Probe explicitly launched on cover display 1 through ADB, full screen and awake. Density 420 dpi (2.625 scale), font scale 1.0; defaultDensityDpi 480 is the primary-display property, not a cover default. No system bars are exposed on this cover window. Navigation classification falls back to the selected Android setting; it does not imply visible navigation buttons or gestures. Rotation only rotates the recorded portrait diagram."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), gesture setting",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/cover-gesture.json",
              "retrievedAt": "2026-09-23"
            },
            {
              "kind": "measured",
              "label": "InsetsProbe 1.6.0 on Samsung RTL Galaxy Z Flip7 cover via FlexWindow widget (SM-F766N), gesture setting; values match the physical capture",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-28-flexwindow/cover-gesture.json",
              "retrievedAt": "2026-09-28"
            }
          ],
          "systemBarsPx": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 0,
            "right": 0,
            "bottom": 220,
            "left": 0
          }
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), threeButton setting",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/cover-threeButton-awake.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.6.0 on Samsung RTL Galaxy Z Flip7 cover via FlexWindow widget (SM-F766N), threeButton setting; values match the physical capture",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-28-flexwindow/cover-threeButton.json",
          "retrievedAt": "2026-09-28"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), gesture setting",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/cover-gesture.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.6.0 on Samsung RTL Galaxy Z Flip7 cover via FlexWindow widget (SM-F766N), gesture setting; values match the physical capture",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-28-flexwindow/cover-gesture.json",
          "retrievedAt": "2026-09-28"
        }
      ],
      "logicalSizePx": {
        "width": 948,
        "height": 1048
      },
      "captureOrientation": "portrait",
      "cornerRadiiPx": {
        "topLeft": 16,
        "topRight": 16,
        "bottomRight": 108,
        "bottomLeft": 108
      }
    },
    {
      "id": "main",
      "label": "Main",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 1080,
        "height": 2520
      },
      "ppi": 0,
      "logicalSizeDp": {
        "width": 360.0,
        "height": 840.0
      },
      "densityDpi": 480,
      "cornerRadiiDp": {
        "topLeft": 22,
        "topRight": 22,
        "bottomRight": 22,
        "bottomLeft": 22
      },
      rotations: {
        "1": {
          "logicalSizePx": {
            "width": 2520,
            "height": 1080
          },
          "logicalSizeDp": {
            "width": 840,
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
                "left": 36.33
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 109
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 168,
                "widthDp": 36.33,
                "heightDp": 24,
                "rightDp": 803.67,
                "bottomDp": 168,
                "xPx": 0,
                "yPx": 504,
                "widthPx": 109,
                "heightPx": 72,
                "rightPx": 2411,
                "bottomPx": 504
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Galaxy Z Flip7 SM-F766N, build BP4A.251205.006.F766NKSSBBZG3. main display, rotation 1, 2520×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Galaxy Z Flip7 main, rotation 1, gesture (SM-F766N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-27-rotation/main-landscape-1-gesture.json",
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
                "left": 36.33
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 109
              },
              "cutoutShape": {
                "xDp": 0,
                "yDp": 168,
                "widthDp": 36.33,
                "heightDp": 24,
                "rightDp": 803.67,
                "bottomDp": 168,
                "xPx": 0,
                "yPx": 504,
                "widthPx": 109,
                "heightPx": 72,
                "rightPx": 2411,
                "bottomPx": 504
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Galaxy Z Flip7 SM-F766N, build BP4A.251205.006.F766NKSSBBZG3. main display, rotation 1, 2520×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Galaxy Z Flip7 main, rotation 1, threeButton (SM-F766N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-27-rotation/main-landscape-1-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        },
        "3": {
          "logicalSizePx": {
            "width": 2520,
            "height": 1080
          },
          "logicalSizeDp": {
            "width": 840,
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
                "right": 36.33,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 109,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 803.67,
                "yDp": 168,
                "widthDp": 36.33,
                "heightDp": 24,
                "rightDp": 0,
                "bottomDp": 168,
                "xPx": 2411,
                "yPx": 504,
                "widthPx": 109,
                "heightPx": 72,
                "rightPx": 0,
                "bottomPx": 504
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Galaxy Z Flip7 SM-F766N, build BP4A.251205.006.F766NKSSBBZG3. main display, rotation 3, 2520×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Galaxy Z Flip7 main, rotation 3, gesture (SM-F766N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-27-rotation/main-landscape-3-gesture.json",
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
                "right": 36.33,
                "bottom": 0,
                "left": 0
              },
              "displayCutoutPx": {
                "top": 0,
                "right": 109,
                "bottom": 0,
                "left": 0
              },
              "cutoutShape": {
                "xDp": 803.67,
                "yDp": 168,
                "widthDp": 36.33,
                "heightDp": 24,
                "rightDp": 0,
                "bottomDp": 168,
                "xPx": 2411,
                "yPx": 504,
                "widthPx": 109,
                "heightPx": 72,
                "rightPx": 0,
                "bottomPx": 504
              },
              "condition": {
                "oneUi": "8.5",
                "android": "16",
                "note": "Galaxy Z Flip7 SM-F766N, build BP4A.251205.006.F766NKSSBBZG3. main display, rotation 3, 2520×1080 px, full screen, 480 dpi, font scale 1. Captured separately with InsetsProbe 1.5.0."
              },
              "sources": [
                {
                  "kind": "measured",
                  "label": "InsetsProbe 1.5.0 on Galaxy Z Flip7 main, rotation 3, threeButton (SM-F766N)",
                  "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/recapture-2026-09-27-rotation/main-landscape-3-threeButton.json",
                  "retrievedAt": "2026-09-27"
                }
              ]
            }
          }
        }
      },
      "insets": {
        "gesture": {
          "systemBars": {
            "top": 36.33,
            "right": 0,
            "bottom": 15,
            "left": 0
          },
          "displayCutout": {
            "top": 36.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 504,
            "yPx": 0,
            "widthPx": 72,
            "heightPx": 109,
            "rightPx": 504,
            "bottomPx": 2411,
            "xDp": 168.0,
            "yDp": 0.0,
            "widthDp": 24.0,
            "heightDp": 36.33,
            "rightDp": 168.0,
            "bottomDp": 803.67
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, fully open (180\u00b0), portrait, full screen; density 480 dpi matches default; font scale 1.0. View rotation only rotates this portrait capture; landscape insets were not measured."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), gesture",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/main-gesture.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "systemBarsPx": {
            "top": 109,
            "right": 0,
            "bottom": 45,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 109,
            "right": 0,
            "bottom": 0,
            "left": 0
          }
        },
        "threeButton": {
          "systemBars": {
            "top": 36.33,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "displayCutout": {
            "top": 36.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 504,
            "yPx": 0,
            "widthPx": 72,
            "heightPx": 109,
            "rightPx": 504,
            "bottomPx": 2411,
            "xDp": 168.0,
            "yDp": 0.0,
            "widthDp": 24.0,
            "heightDp": 36.33,
            "rightDp": 168.0,
            "bottomDp": 803.67
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, fully open (180\u00b0), portrait, full screen; density 480 dpi matches default; font scale 1.0. View rotation only rotates this portrait capture; landscape insets were not measured."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), threeButton",
              "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/main-threeButton.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "systemBarsPx": {
            "top": 109,
            "right": 0,
            "bottom": 144,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 109,
            "right": 0,
            "bottom": 0,
            "left": 0
          }
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), gesture",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/main-gesture.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), threeButton",
          "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/main-threeButton.json",
          "retrievedAt": "2026-09-23"
        }
      ],
      "logicalSizePx": {
        "width": 1080,
        "height": 2520
      },
      "captureOrientation": "portrait",
      "cornerRadiiPx": {
        "topLeft": 66,
        "topRight": 66,
        "bottomRight": 66,
        "bottomLeft": 66
      }
    }
  ],
  "sources": [
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), gesture",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/main-gesture.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), threeButton",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/main-threeButton.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), threeButton setting",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/cover-threeButton-awake.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), gesture setting",
      "url": "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-flip/galaxy-z-flip7/cover-gesture.json",
      "retrievedAt": "2026-09-23"
    }
  ]
};
