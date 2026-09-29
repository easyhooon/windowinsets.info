import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A32 display specifications",
  url: "https://www.samsung.com/es/business/smartphones/galaxy-a/a32-sm-a325fzbgeub/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.4-inch, 1080×2400 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A32 (SM-A325F), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 30.48, right: 0, bottom: mode === "gesture" ? 14.86 : 48, left: 0 },
  systemBarsPx: { top: 80, right: 0, bottom: mode === "gesture" ? 39 : 126, left: 0 },
  displayCutout: { top: 30.48, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 80, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 178.29, yDp: 0, widthDp: 54.86, heightDp: 30.48, rightDp: 178.29, bottomDp: 883.81, xPx: 468, yPx: 0, widthPx: 144, heightPx: 80, rightPx: 468, bottomPx: 2320 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A32 LTE (SM-A325F), build TP1A.220624.014.A325FXXSCDYA2. Portrait rotation 0, 1080×2400 px full-screen capture, 420 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});
const corners = { topLeft: 32, topRight: 32, bottomRight: 32, bottomLeft: 32 };
const cornersPx = { topLeft: 84, topRight: 84, bottomRight: 84, bottomLeft: 84 };

export const galaxyA32: Device = {
  slug: "galaxy-a32", name: "Galaxy A32", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2021,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.4, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 411, logicalSizeDp: { width: 411.43, height: 914.29 }, densityDpi: 420, cornerRadiiDp: corners, cornerRadiiPx: cornersPx,
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
