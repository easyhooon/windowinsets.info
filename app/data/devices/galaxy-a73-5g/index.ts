import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A73 5G display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A736B/", retrievedAt: "2026-09-25",
  note: "The registered official skin and captured SM-A736B both use a 1080×2400 display.",
};
const capture: Source = {
  kind: "measured", label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy A73 5G (SM-A736B), main gesture",
  url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a73-5g/main-gesture.json", retrievedAt: "2026-09-25",
};
const recapture: Source = {
  kind: "measured", label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy A73 5G (SM-A736B), main 3-button and gesture recapture",
  url: "https://github.com/easyhooon/windowinsets.info/tree/main/measurements/galaxy-a/galaxy-a73-5g/recapture-2026-09-27", retrievedAt: "2026-09-27",
};
const gesture: InsetsMeasurement = {
  systemBars: { top: 34.84, right: 0, bottom: 14.93, left: 0 },
  systemBarsPx: { top: 98, right: 0, bottom: 42, left: 0 },
  displayCutout: { top: 34.84, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 98, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.13, yDp: 0, widthDp: 27.73, heightDp: 34.84, rightDp: 178.13, bottomDp: 818.49, xPx: 501, yPx: 0, widthPx: 78, heightPx: 98, rightPx: 501, bottomPx: 2302 },
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, Galaxy A73 5G (SM-A736B), build AP3A.240905.015.A2.A736BXXUAFYE6. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The 2026-09-27 recapture reproduced every gesture value." },
  sources: [capture, recapture],
};
const threeButton: InsetsMeasurement = {
  systemBars: { top: 34.84, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 98, right: 0, bottom: 135, left: 0 },
  displayCutout: gesture.displayCutout,
  displayCutoutPx: gesture.displayCutoutPx,
  cutoutShape: gesture.cutoutShape,
  condition: { oneUi: "7.0", android: "15", note: "Samsung RTL, Galaxy A73 5G (SM-A736B), build AP3A.240905.015.A2.A736BXXUAFYE6, captured 2026-09-27. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The earlier 3-button file dated 2025-05-15 is retained as historical evidence." },
  sources: [recapture],
};

export const galaxyA73: Device = {
  slug: "galaxy-a73-5g", name: "Galaxy A73 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2022,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.7, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 393, logicalSizeDp: { width: 384, height: 853.33 }, densityDpi: 450, cornerRadiiDp: null, cornerRadiiPx: null,
    insets: { gesture, threeButton }, sources: [official, capture, recapture] }],
  sources: [official, capture, recapture],
};
