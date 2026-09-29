import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official",
  label: "Samsung Galaxy A34 5G display specifications",
  url: "https://www.samsung.com/id/smartphones/galaxy-a/galaxy-a34-5g-silver-256gb-sm-a346ezsexid/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.6-inch, 1080×2340 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A34 5G (SM-A346E), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a34-5g/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 26.67, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 75, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 26.67, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 75, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 166.4, yDp: 0, widthDp: 51.2, heightDp: 26.67, rightDp: 166.4, bottomDp: 805.33, xPx: 468, yPx: 0, widthPx: 144, heightPx: 75, rightPx: 468, bottomPx: 2265 },
  condition: { oneUi: "6.1", android: "14", note: `Samsung RTL, Galaxy A34 5G (SM-A346E), build UP1A.231005.007.A346EXXS9CYD1. Portrait rotation 0, 1080×2340 px full-screen capture, 450 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});

export const galaxyA34: Device = {
  slug: "galaxy-a34-5g", name: "Galaxy A34 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2023,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.6, resolutionPx: { width: 1080, height: 2340 }, logicalSizePx: { width: 1080, height: 2340 }, captureOrientation: "portrait", captureRotation: 0, ppi: 390, logicalSizeDp: { width: 384, height: 832 }, densityDpi: 450, cornerRadiiDp: null, cornerRadiiPx: null,
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
