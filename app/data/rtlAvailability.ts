// Partial official listing; never infer non-support from this snapshot.
export const rtlCatalog = {
  "checkedAt": "2026-09-25",
  "sourceUrl": "https://developer.samsung.com/remote-test-lab",
  "scope": "featured-devices",
  "complete": false,
  "reservationCatalogUrl": "https://developer.samsung.com/remotetestlab/devices",
  "reservationCatalogResult": "Accessible after manual sign-in. Galaxy Z inventory was inspected; Galaxy Z Fold8, Fold7, Fold6, Fold5, Fold4, Fold3, Flip8, Flip7, Flip7 FE, Flip6, Flip5, Flip4, Flip3 and the original Galaxy Z Flip (SM-F700F-IN5, India/Noida) were successfully reserved. Galaxy S25 (SM-S931N_KR1), Galaxy S25 Edge (SM-S937N_KR10), Galaxy S25 FE (SM-S731N_KR1), Galaxy S24 Ultra (SM-S928N-KR3), Galaxy S24+ (SM-S926N-KR3), Galaxy S24 (SM-S921N-KR3), Galaxy S24 FE (SM-S721N_KR4), Galaxy S23 FE (SM-S711B), Galaxy S22 Ultra (SM-S908U), Galaxy S22+ (SM-S906B), Galaxy S22 (SM-S901B), Galaxy S21 Ultra (SM-G998B), Galaxy S21+ (SM-G996B), Galaxy S21 (SM-G991B), Galaxy S20 Ultra (SM-G988B), Galaxy S20 FE (SM-G780G), Galaxy Note20 (SM-N981U), Galaxy Note20 Ultra 5G (SM-N985F), Galaxy A27 5G / Galaxy Jump5 (SM-A276K), Galaxy A55 5G / Galaxy Quantum5 (SM-A556S), Galaxy A35 5G (SM-A356N), Galaxy A25 5G (SM-A256N), Galaxy A14 LTE (SM-A145F), Galaxy A04 (SM-A045F), Galaxy A57 5G (SM-A576S), Galaxy A37 5G (SM-A376N), Galaxy A17 LTE (SM-A175N), Galaxy A56 5G (SM-A566B), Galaxy A36 5G (SM-A366N), Galaxy A07 5G (SM-A076M), Galaxy A16 LTE (SM-A165N), Galaxy A15 LTE (SM-A155F), Galaxy A06 (SM-A065F), Galaxy A05 (SM-A055F), Galaxy Tab S9+ (SM-X816B), Galaxy Tab S8 Ultra (SM-X906B), Galaxy Tab S8+ (SM-X806B) and Galaxy Tab S8 (SM-X706N), Galaxy A23 LTE (SM-A235F), Galaxy A34 5G (SM-A346E), Galaxy A33 5G (SM-A336E) and Galaxy A73 5G (SM-A736B), Galaxy A32 LTE (SM-A325F), Galaxy A32 5G (SM-A326B) and Galaxy A53 5G (SM-A536B) were also successfully reserved. Galaxy Tab S7 FE (SM-T735), Galaxy Tab S10 Ultra (SM-X920), Galaxy Tab S10+ (SM-X820), Galaxy Tab S10 Lite (SM-X406B), Galaxy Tab S7+ (SM-T970), Galaxy Tab A11 (SM-X135F) and Galaxy S23 Ultra (SM-S918U) were reserved on 2026-09-27. The full cross-series and cross-region inventory is still incomplete.",
  "reservableSlugs": [
    "galaxy-z-trifold",
    "galaxy-s24",
    "galaxy-s24-fe",
    "galaxy-s24-plus",
    "galaxy-s24-ultra",
    "galaxy-s23-fe",
    "galaxy-s22-ultra",
    "galaxy-s22-plus",
    "galaxy-s22",
    "galaxy-s21-ultra",
    "galaxy-s21-plus",
    "galaxy-s21",
    "galaxy-s20-ultra",
    "galaxy-s20-fe",
    "galaxy-note20",
    "galaxy-note20-ultra",
    "galaxy-a27-5g",
    "galaxy-a32",
    "galaxy-a32-5g",
    "galaxy-a33-5g",
    "galaxy-a34-5g",
    "galaxy-a73-5g",
    "galaxy-a55-5g",
    "galaxy-a35-5g",
    "galaxy-a14-5g",
    "galaxy-a04",
    "galaxy-a53-5g",
    "galaxy-a57-5g",
    "galaxy-a37-5g",
    "galaxy-a17-5g",
    "galaxy-a56-5g",
    "galaxy-a36-5g",
    "galaxy-a07",
    "galaxy-a16-5g",
    "galaxy-a15-5g",
    "galaxy-a06",
    "galaxy-a05",
    "galaxy-tab-s9-plus",
    "galaxy-tab-s8-ultra",
    "galaxy-tab-s8-plus",
    "galaxy-tab-s8",
    "galaxy-tab-s7-fe",
    "galaxy-tab-s7-plus",
    "galaxy-tab-a11",
    "galaxy-tab-s10-ultra",
    "galaxy-tab-s10-plus",
    "galaxy-tab-s10-lite",
    "galaxy-s23-ultra",
    "galaxy-s23-plus",
    "galaxy-s25-fe",
    "galaxy-s25-edge",
    "galaxy-s25",
    "galaxy-z-fold8",
    "galaxy-z-fold7",
    "galaxy-z-fold6",
    "galaxy-z-fold5",
    "galaxy-z-fold4",
    "galaxy-z-fold3",
    "galaxy-z-flip7",
    "galaxy-z-flip7-fe",
    "galaxy-z-flip6",
    "galaxy-z-flip5",
    "galaxy-z-flip4",
    "galaxy-z-flip3",
    "galaxy-z-flip"
  ],
  "listedSlugs": [
    "galaxy-z-fold8",
    "galaxy-z-flip8",
    "galaxy-s26-ultra",
    "galaxy-tab-s11"
  ]
};


export interface RtlCatalog {
  checkedAt: string;
  sourceUrl: string;
  scope: string;
  complete: boolean;
  listedSlugs: string[];
  reservableSlugs?: string[];
}

/** Absence from a featured list or a blocked page is not evidence of non-support. */
export function getRtlAvailability(slug: string, snapshot: RtlCatalog = rtlCatalog) {
  const reservable = snapshot.reservableSlugs?.includes(slug) ?? false;
  const status = snapshot.listedSlugs.includes(slug) || reservable ? "listed"
    : snapshot.complete ? "not-listed" : "unknown";
  return {
    status,
    checkedAt: snapshot.checkedAt,
    sourceUrl: snapshot.sourceUrl,
    label: reservable ? "Reservable on RTL"
      : status === "listed"
      ? snapshot.scope === "featured-devices" ? "Featured on RTL" : "Listed on RTL"
      : status === "not-listed" ? "Not listed on RTL" : "RTL status unverified",
    description: reservable
      ? "A live Samsung RTL reservation was opened successfully. Measurement coverage is shown separately for each screen and navigation mode."
      : status === "listed"
      ? "Samsung lists this model on Remote Test Lab. Live reservation slots have not been checked."
      : status === "not-listed"
        ? "This model was not in the checked RTL device catalog. Its official skin remains available here."
        : "The full RTL device catalog could not be checked. This does not mean the model is unsupported.",
    previewNotice: status === "listed"
      ? "Skin preview · RTL measurement pending for this screen and navigation mode"
      : status === "not-listed"
        ? "Skin preview · Not listed on Samsung RTL · No measurement available"
        : "Skin preview · RTL availability unverified · No measurement available",
  };
}
