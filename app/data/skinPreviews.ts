import catalog from "./skinCatalog.json";
import { checkedReleaseYears } from "./coverage";
import type { Device, FormFactor, Screen, Source } from "./types";

const source: Source = {
  kind: "official",
  label: "Samsung Galaxy Emulator Skin (artwork only)",
  url: "https://developer.samsung.com/galaxy-emulator-skin",
  retrievedAt: "2026-09-22",
  note: "Skin layout describes artwork pixels, not device measurements or product specifications.",
};

const galaxyFoldChassisSource: Source = {
  kind: "official",
  label: "Samsung Galaxy Fold specifications",
  url: "https://www.samsungmobilepress.com/media-assets/galaxy_fold/?tab=specs",
  retrievedAt: "2026-09-25",
  note: "Published unfolded width/depth and maximum folded depth; Android insets remain unmeasured.",
};

/** Imported artwork is browsable before RTL captures arrive. No specs are inferred. */
export const skinPreviews: Device[] = catalog.map(entry => ({
  slug: entry.slug, name: entry.name, brand: "Samsung", series: entry.series,
  formFactor: entry.formFactor as FormFactor, releaseYear: checkedReleaseYears[entry.slug] ?? null,
  ...(entry.slug === "galaxy-fold" ? {
    chassisMm: { unfoldedWidth: 117.9, unfoldedDepth: 6.9, foldedDepth: 17.1, source: galaxyFoldChassisSource },
  } : {}),
  screens: entry.screens.map(id => ({
    id: id as Screen["id"], label: id === "cover" ? "Cover" : "Main",
    diagonalInch: 0, resolutionPx: { width: 0, height: 0 }, ppi: 0,
    logicalSizeDp: null, densityDpi: null, cornerRadiiDp: null,
    insets: { gesture: null, threeButton: null }, sources: [{ ...source, retrievedAt: entry.providedAt ?? source.retrievedAt }],
  })),
  sources: [{ ...source, retrievedAt: entry.providedAt ?? source.retrievedAt },
    ...(entry.slug === "galaxy-fold" ? [galaxyFoldChassisSource] : [])],
}));
