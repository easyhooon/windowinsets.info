import type { Device, InsetsMeasurement, Source } from "../../types";

const samsungSpecs: Source = {
  kind: "official",
  label: "Samsung Galaxy A04 (SM-A045F) display specifications",
  url: "https://www.samsung.com/id/smartphones/galaxy-a/galaxy-a04-black-32gb-sm-a045fzkdxid/",
  retrievedAt: "2026-09-25",
  note: "Samsung lists the 165.5 mm (6.5-inch), 720×1600 HD+ main display.",
};

const captureSource = (mode: "gesture" | "threeButton"): Source => ({
  kind: "measured",
  label: `InsetsProbe 1.3.0 on Samsung RTL Galaxy A04 (SM-A045F), main ${mode === "gesture" ? "gesture" : "3-button"}`,
  url: `https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a04/main-${mode}.json`,
  retrievedAt: "2026-09-25",
});

const measuredInsets = (mode: "gesture" | "threeButton"): InsetsMeasurement => mode === "gesture"
  ? {
      systemBars: { top: 25.6, right: 0, bottom: 14.93, left: 0 },
      systemBarsPx: { top: 48, right: 0, bottom: 28, left: 0 },
      displayCutout: { top: 24, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 45, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 145.07, yDp: 0, widthDp: 93.87, heightDp: 24, rightDp: 145.07, bottomDp: 829.33, xPx: 272, yPx: 0, widthPx: 176, heightPx: 45, rightPx: 272, bottomPx: 1555 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A04 (SM-A045F), build UP1A.231005.007.A045FXXSFEZE2. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. Gesture mode agrees with Android Settings and InsetsProbe. The system reports a 48 px status inset and a 45 px cutout safe inset." },
      sources: [captureSource("gesture")],
    }
  : {
      systemBars: { top: 25.6, right: 0, bottom: 48, left: 0 },
      systemBarsPx: { top: 48, right: 0, bottom: 90, left: 0 },
      displayCutout: { top: 24, right: 0, bottom: 0, left: 0 },
      displayCutoutPx: { top: 45, right: 0, bottom: 0, left: 0 },
      cutoutShape: { xDp: 145.07, yDp: 0, widthDp: 93.87, heightDp: 24, rightDp: 145.07, bottomDp: 829.33, xPx: 272, yPx: 0, widthPx: 176, heightPx: 45, rightPx: 272, bottomPx: 1555 },
      condition: { oneUi: "6.1", android: "14", note: "Samsung RTL, Galaxy A04 (SM-A045F), build UP1A.231005.007.A045FXXSFEZE2. Portrait rotation 0, 720×1600 px full-screen capture, 300 dpi, font scale 1. 3-button mode agrees with Android Settings and InsetsProbe. The system reports a 48 px status inset and a 45 px cutout safe inset." },
      sources: [captureSource("threeButton")],
    };

export const galaxyA04: Device = {
  slug: "galaxy-a04",
  name: "Galaxy A04",
  brand: "Samsung",
  series: "Galaxy A",
  formFactor: "bar",
  releaseYear: 2022,
  screens: [{
    id: "main",
    label: "Main",
    diagonalInch: 6.5,
    resolutionPx: { width: 720, height: 1600 },
    logicalSizePx: { width: 720, height: 1600 },
    captureOrientation: "portrait",
    captureRotation: 0,
    ppi: 270,
    logicalSizeDp: { width: 384, height: 853 },
    densityDpi: 300,
    cornerRadiiDp: null,
    cornerRadiiPx: null,
    // Separate captures of rotations 1 and 3; never derived from rotation 0.
    rotations: {
      1: {
        logicalSizePx: { width: 1600, height: 720 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 45, right: 0, bottom: 28, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 24 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 45 },
            cutoutShape: { xDp: 0, yDp: 145.07, widthDp: 24, heightDp: 93.87, rightDp: 829.33, bottomDp: 145.07, xPx: 0, yPx: 272, widthPx: 45, heightPx: 176, rightPx: 1555, bottomPx: 272 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A045F-RU3, build UP1A.231005.007.A045FXXU7EXH2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A04 (SM-A045F), rotation 1, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a04/recapture-2026-09-30-rotation/main-landscape-1-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24, right: 48, bottom: 0, left: 0 },
            systemBarsPx: { top: 45, right: 90, bottom: 0, left: 0 },
            displayCutout: { top: 0, right: 0, bottom: 0, left: 24 },
            displayCutoutPx: { top: 0, right: 0, bottom: 0, left: 45 },
            cutoutShape: { xDp: 0, yDp: 145.07, widthDp: 24, heightDp: 93.87, rightDp: 829.33, bottomDp: 145.07, xPx: 0, yPx: 272, widthPx: 45, heightPx: 176, rightPx: 1555, bottomPx: 272 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A045F-RU3, build UP1A.231005.007.A045FXXU7EXH2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 1, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A04 (SM-A045F), rotation 1, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a04/recapture-2026-09-30-rotation/main-landscape-1-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
      3: {
        logicalSizePx: { width: 1600, height: 720 },
        logicalSizeDp: { width: 853.33, height: 384 },
        insets: {
          gesture: {
            systemBars: { top: 24, right: 0, bottom: 14.93, left: 0 },
            systemBarsPx: { top: 45, right: 0, bottom: 28, left: 0 },
            displayCutout: { top: 0, right: 24, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 45, bottom: 0, left: 0 },
            cutoutShape: { xDp: 829.33, yDp: 145.07, widthDp: 24, heightDp: 93.87, rightDp: 0, bottomDp: 145.07, xPx: 1555, yPx: 272, widthPx: 45, heightPx: 176, rightPx: 0, bottomPx: 272 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A045F-RU3, build UP1A.231005.007.A045FXXU7EXH2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A04 (SM-A045F), rotation 3, gesture", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a04/recapture-2026-09-30-rotation/main-landscape-3-gesture.json", retrievedAt: "2026-09-30" }],
          },
          threeButton: {
            systemBars: { top: 24, right: 0, bottom: 0, left: 48 },
            systemBarsPx: { top: 45, right: 0, bottom: 0, left: 90 },
            displayCutout: { top: 0, right: 24, bottom: 0, left: 0 },
            displayCutoutPx: { top: 0, right: 45, bottom: 0, left: 0 },
            cutoutShape: { xDp: 829.33, yDp: 145.07, widthDp: 24, heightDp: 93.87, rightDp: 0, bottomDp: 145.07, xPx: 1555, yPx: 272, widthPx: 45, heightPx: 176, rightPx: 0, bottomPx: 272 },
            condition: { oneUi: "6.1", android: "14", note: `Samsung RTL Russia/Moscow, SM-A045F-RU3, build UP1A.231005.007.A045FXXU7EXH2 (the same Android 14 / One UI 6.1 release line as the accepted capture), 300 dpi and font scale 1, captured over Remote Debug Bridge with navigation selected in Settings and the rotation locked. The Android navigation setting and configuration agree, and the same session's rotation 0 files reproduce the accepted captures. Landscape rotation 3, 1600×720 px.` },
            sources: [{ kind: "measured", label: "InsetsProbe 1.6.0 on Samsung RTL Galaxy A04 (SM-A045F), rotation 3, 3-button", url: "https://github.com/easyhooon/windowinsets.info/blob/main/measurements/galaxy-a/galaxy-a04/recapture-2026-09-30-rotation/main-landscape-3-threeButton.json", retrievedAt: "2026-09-30" }],
          },
        },
      },
    },
    insets: { gesture: measuredInsets("gesture"), threeButton: measuredInsets("threeButton") },
    sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
  }],
  sources: [samsungSpecs, captureSource("gesture"), captureSource("threeButton")],
};
