/** Product decision, 2026-09-22. Release evidence: docs/DEVICE_COVERAGE.md. */
export const MIN_RELEASE_YEAR = 2020;

// Audited release years for artwork previews and coverage boundaries.
// Do not infer a release year from a skin ZIP date.
export const checkedReleaseYears: Record<string, number> = {
  "galaxy-z-trifold": 2025,
  "galaxy-s20": 2020,
  "galaxy-s20-plus": 2020,
  "galaxy-s26-fe": 2026,
  "galaxy-tab-a11-plus": 2025,
  "galaxy-tab-a7-10-4-2022": 2022,
  "galaxy-tab-a9": 2023,
  "galaxy-tab-active3": 2020,
  "galaxy-tab-active4-pro": 2022,
  "galaxy-tab-active5": 2024,
  "galaxy-tab-active5-pro": 2025,
  "galaxy-tab-s7": 2020,
  "galaxy-a02s": 2020,
  "galaxy-a03s": 2021,
  "galaxy-a05s": 2023,
  "galaxy-a12": 2020,
  "galaxy-a13-5g": 2021,
  "galaxy-a22": 2021,
  "galaxy-a22-5g": 2021,
  "galaxy-a26-5g": 2025,
  "galaxy-a52": 2021,
  "galaxy-a72": 2021,
  "galaxy-tab-s4-10-5": 2018,
  "galaxy-tab-s6": 2019,
  "galaxy-fold": 2019,
  "galaxy-s10-lite": 2020,
  "galaxy-tab-s8-ultra": 2022,
  "galaxy-tab-s6-lite": 2020,
  "galaxy-z-flip": 2020,
  "galaxy-z-fold3": 2021,
  "galaxy-note-fe": 2017,
  "galaxy-note8": 2017,
  "galaxy-note9": 2018,
  "galaxy-note10": 2019,
  "galaxy-note10-plus": 2019,
  "galaxy-note10-lite": 2020,
  "galaxy-note20": 2020,
  "galaxy-note20-ultra": 2020,
  "galaxy-a01-core": 2020,
  "galaxy-a11": 2020,
  "galaxy-a21s": 2020,
  "galaxy-a31": 2020,
  "galaxy-a42-5g": 2020,
  "galaxy-a71": 2020,
};

export function isInCoverage(device: { slug: string; formFactor: string; releaseYear: number | null }): boolean {
  if (device.formFactor === "foldable-book" || device.formFactor === "foldable-flip") return true;
  const year = checkedReleaseYears[device.slug] ?? device.releaseYear;
  // Other existing previews have no exact year metadata; new imports require
  // a release-year review before publishing (see the coverage guide).
  return year === null || year >= MIN_RELEASE_YEAR;
}
