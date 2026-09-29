import type { Device, InsetsMeasurement, Source } from "../../types";

const official: Source = {
  kind: "official", label: "Samsung Galaxy A53 5G display specifications",
  url: "https://www.samsung.com/pt/smartphones/galaxy-a/galaxy-a53-5g-awesome-black-128gb-sm-a536bzkneub/", retrievedAt: "2026-09-25",
  note: "Samsung lists a 6.5-inch, 1080×2400 FHD+ display.",
};
const capture = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured", label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A53 5G (SM-A536B), main ${mode}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a53-5g/main-${mode}.json`, retrievedAt: "2026-09-25",
});
const measurement = (mode: "gesture" | "threeButton"): InsetsMeasurement => ({
  systemBars: { top: 31.29, right: 0, bottom: mode === "gesture" ? 14.93 : 48, left: 0 },
  systemBarsPx: { top: 88, right: 0, bottom: mode === "gesture" ? 42 : 135, left: 0 },
  displayCutout: { top: 31.29, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 88, right: 0, bottom: 0, left: 0 },
  cutoutShape: { xDp: 182.04, yDp: 0, widthDp: 19.91, heightDp: 31.29, rightDp: 182.04, bottomDp: 822.04, xPx: 512, yPx: 0, widthPx: 56, heightPx: 88, rightPx: 512, bottomPx: 2312 },
  condition: { oneUi: "6.1", android: "14", note: `Samsung RTL, Galaxy A53 5G (SM-A536B), build UP1A.231005.007.A536BXXSDEYB9. Portrait rotation 0, 1080×2400 px full-screen capture, 450 dpi, font scale 1.1. ${mode} navigation agrees with Android Settings and InsetsProbe.` },
  sources: [capture(mode)],
});

export const galaxyA53: Device = {
  slug: "galaxy-a53-5g", name: "Galaxy A53 5G", brand: "Samsung", series: "Galaxy A", formFactor: "bar", releaseYear: 2022,
  screens: [{ id: "main", label: "Main", diagonalInch: 6.5, resolutionPx: { width: 1080, height: 2400 }, logicalSizePx: { width: 1080, height: 2400 }, captureOrientation: "portrait", captureRotation: 0, ppi: 405, logicalSizeDp: { width: 384, height: 853.33 }, densityDpi: 450, cornerRadiiDp: null, cornerRadiiPx: null,
    insets: { gesture: measurement("gesture"), threeButton: measurement("threeButton") }, sources: [official, capture("gesture"), capture("threeButton")] }],
  sources: [official, capture("gesture"), capture("threeButton")],
};
