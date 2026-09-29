import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A33 5G display specifications",
  url: "https://www.samsung.com/sec/support/model/SM-A336NZKTKOO/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.4-inch, 1080×2400 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A33 5G (SM-A336E), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a33-5g/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 28.44, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 28.44, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 28.44, rightDp: 166.4, bottomDp: 824.89, xPx: 468, yPx: 0, widthPx: 144, heightPx: 80, rightPx: 468, bottomPx: 2320 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A33 5G (SM-A336E), build TP1A.220624.014.A336EDXS7CWJ1. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});

export const galaxyA33: Device = {
  slug: "galaxy-a33-5g", name: "Galaxy A33 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2022,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.4, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 411, logicalSizeDp: { width: 384, height: 853.33 }, densityDpi: 450, cornerRadiiDp: null, cornerRadiiPx: null,
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
