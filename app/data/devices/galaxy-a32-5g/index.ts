import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A32 5G display specifications",
  url: "https://www.samsung.com/gr/smartphones/galaxy-a/galaxy-a32-5g-blue-128gb-sm-a326bzbveue/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.5-inch, 720×1600 HD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A32 5G (SM-A326B), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a32-5g/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 28.27, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 53, right: 0, bottom: mode === "gesture" ? 28 : 90, left: 0 },
  displayCutout: { top: 28.27, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 53, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 28.27, rightDp: 166.4, bottomDp: 825.07, xPx: 312, yPx: 0, widthPx: 96, heightPx: 53, rightPx: 312, bottomPx: 1547 },
  condition: { oneUi: "5.1", android: "13", note: `Samsung RTL, Galaxy A32 5G (SM-A326B), build TP1A.220624.014.A326BXXSECYB5. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});
const corners = { topLeft: 32, topRight: 32, bottomRight: 32, bottomLeft: 32 };
const cornersPx = { topLeft: 60, topRight: 60, bottomRight: 60, bottomLeft: 60 };

export const galaxyA32FiveG: Device = {
  slug: "galaxy-a32-5g", name: "Galaxy A32 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2021,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.5, resolutionPx: { width: 720, height: 1600 }, logicalSizePx: { width: 720, height: 1600 }, captureOrientation: "portrait", captureRotation: 0, ppi: 270, logicalSizeDp: { width: 384, height: 853.33 }, densityDpi: 300, cornerRadiiDp: corners, cornerRadiiPx: cornersPx,
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
