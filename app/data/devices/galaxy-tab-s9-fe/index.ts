import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy Tab S9 FE specifications",
  url: "https://www.samsung.com/sec/support/model/SM-X516NZAAKOO/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists a 10.9-inch (277.0 mm), 2304×1440 display; PPI is calculated from that diagonal and resolution.",
};
const gestureSource: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S9 FE 5G main (SM-X516N), gesture",
  url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab-s9-fe/main-gesture.json",
  retrievedAt: "2026-09-25",
};
const threeButtonSource: Source = {
  kind: "measured",
  label: "InsetsProbe 1.3.0 on Samsung RTL Galaxy Tab S9 FE 5G main (SM-X516N), 3-button recapture",
  url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-tab-s9-fe/recapture-2026-09-27/main-threeButton.json",
  retrievedAt: "2026-09-27",
};
const condition = {
  oneUi: "8.5",
  android: "16",
  note: "Samsung RTL Galaxy Tab S9 FE 5G (SM-X516N), build BP4A.251205.006.X516NKOSEEZG3. Main display landscape, rotation 1, full-screen 2304×1440 px, 280 dpi and font scale 1.08. InsetsProbe's non-foldable Phone label is classified as the tablet main display from model and skin-matching dimensions. Gesture mode is confirmed by Settings/config_navBarInteractionMode=2 and left/right system gesture insets, although the inset-only heuristic reports threeButton because the tappable bottom inset is nonzero. Font scale is non-default; the same-OS Tab S10 FE showed identical insets at 1.08 and 1.",
};
const gestureMeasurement: InsetsMeasurement = {
  systemBars: { top: 30.29, right: 0, bottom: 14.86, left: 0 },
  systemBarsPx: { top: 53, right: 0, bottom: 26, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition,
  sources: [gestureSource],
};
const threeButtonMeasurement: InsetsMeasurement = {
  systemBars: { top: 30.29, right: 0, bottom: 48, left: 0 },
  systemBarsPx: { top: 53, right: 0, bottom: 84, left: 0 },
  displayCutout: { top: 0, right: 0, bottom: 0, left: 0 },
  displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 0 },
  condition: {
    ...condition,
    note: "Samsung RTL Galaxy Tab S9 FE 5G (SM-X516N), build BP4A.251205.006.X516NKOSEEZG3, captured 2026-09-27. Main display landscape, rotation 1, full-screen 2304×1440 px, 280 dpi and font scale 1.08, the same conditions as the gesture capture. InsetsProbe's Phone label is classified as the tablet main display from model and skin-matching dimensions. 3-button mode agrees with Settings/config_navBarInteractionMode=0 and InsetsProbe. The 2026-09-25 attempt with a 1 px navigation bar remains rejected evidence. Font scale is non-default; the same-OS Tab S10 FE showed identical insets at 1.08 and 1.",
  },
  sources: [threeButtonSource],
};

export const galaxyTabS9Fe: Device = {
  slug: "galaxy-tab-s9-fe",
  name: "Galaxy Tab S9 FE",
  brand: "Samsung",
  series: "Galaxy Tab S",
  formFactor: "tablet",
  releaseYear: 2023,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 10.9,
    resolutionPx: { width: 2304, height: 1440 },
    logicalSizePx: { width: 2304, height: 1440 },
    captureOrientation: "landscape",
    captureRotation: 1,
    ppi: 249,
    logicalSizeDp: { width: 1316.57, height: 822.86 },
    densityDpi: 280,
    cornerRadiiDp: { topLeft: 13.14, topRight: 13.14, bottomRight: 13.14, bottomLeft: 13.14 },
    cornerRadiiPx: { topLeft: 23, topRight: 23, bottomRight: 23, bottomLeft: 23 },
    insets: { gesture: gestureMeasurement, threeButton: threeButtonMeasurement },
    sources: [samsungSpecs, gestureSource, threeButtonSource],
  }],
  sources: [samsungSpecs, gestureSource, threeButtonSource],
};
