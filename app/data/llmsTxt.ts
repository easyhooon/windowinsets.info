import type { Device } from "./types";
import { REPO_URL } from "./site";
import { GUIDE_PAGES, guidePath } from "./guidePages";
import { createDeviceIndex, DEVICE_BUNDLE_PATH, DEVICE_BUNDLE_SCHEMA, DEVICE_EXPORT_SCHEMA, DEVICE_INDEX_PATH, DEVICE_INDEX_SCHEMA } from "./deviceExport";

export const LLMS_TXT_PATH = "/llms.txt";

const STATUS_LABEL = { complete: "both navigation modes measured", partial: "partly measured", pending: "not measured yet" } as const;

/** Builds /llms.txt (https://llmstxt.org) from the device catalog, so it never drifts from the data. */
export function createLlmsTxt(devices: Device[], siteUrl: string): string {
  const index = createDeviceIndex(devices, siteUrl);
  const bySeries = new Map<string, typeof index.devices>();
  for (const device of index.devices) {
    bySeries.set(device.series, [...(bySeries.get(device.series) ?? []), device]);
  }
  const deviceSections = [...bySeries].map(([series, list]) => [
    `### ${series}`,
    "",
    ...list.map(device => {
      const rotations = [...new Set(device.screens.flatMap(screen => screen.measuredRotations))];
      const extra = [
        device.evidence === "emulator" ? "Android Emulator evidence" : device.evidence === "measured" ? "physical-device capture" : null,
        rotations.length ? `separately captured rotations ${rotations.join(", ")}` : null,
      ].filter(Boolean).join("; ");
      return `- [${device.name}](${device.page}): ${STATUS_LABEL[device.measurementStatus]}${extra ? ` (${extra})` : ""}. JSON: ${device.export}`;
    }),
    "",
  ].join("\n"));

  return `# windowinsets.info

> Measured Android WindowInsets, display cutouts, corner radii and foldable states for ${index.deviceCount} Samsung Galaxy and Google Pixel devices. Every published value comes from a raw InsetsProbe capture linked as its source; values that were not captured are null, never estimated.

Use this site to answer questions such as "how tall is the status bar on Galaxy S26 Ultra?" or "what are the Fold7 cover screen's gesture navigation insets?". Prefer the JSON exports below over scraping the HTML pages.

Rules for using the data:

- Values come per screen (\`main\`, \`cover\`) and per navigation mode (\`gesture\`, \`threeButton\`). Insets differ between modes; do not reuse one for the other.
- Units: \`dp\` and \`px\` are both given. \`px\` can be null when only dp was captured.
- \`capture.status: "pending"\` or a null measurement means not measured yet. Do not infer it from a similar device, a rotation or artwork.
- \`evidence: "measured"\` is a capture from a physical device (Samsung Remote Test Lab or a user device); \`"emulator"\` is an Android Emulator capture (Pixel).
- The safe area is derived as max(systemBars, displayCutout) per edge; raw inset types (statusBars, navigationBars, systemGestures, mandatorySystemGestures, tappableElement) are listed separately.
- Each JSON export describes the screen in its capture orientation. Other rotations are shown on the device page only when that rotation was captured separately (listed below); otherwise the page says "not measured yet".
- Cite the device page or the raw capture in \`sources\` when quoting a value.

## Data

- [Device index](${siteUrl}${DEVICE_INDEX_PATH}): every device with measurement status, measured modes and rotations, and links to its export. Schema: ${DEVICE_INDEX_SCHEMA}
- Per-device export: \`${siteUrl}/data/<slug>.json\`. Schema: ${DEVICE_EXPORT_SCHEMA}
- [All devices in one file](${siteUrl}${DEVICE_BUNDLE_PATH}): every per-device export in a \`devices\` array, for bulk use. Schema: ${DEVICE_BUNDLE_SCHEMA}
- CLI: \`npx windowinsets-info get <device>\` prints a device's insets; \`npx windowinsets-info fixtures --series fold > insets.json\` writes measured values for tests. See ${REPO_URL}/tree/main/cli
- [Raw captures on GitHub](${REPO_URL}/tree/main/measurements): immutable InsetsProbe JSON behind every value.

## Docs

${GUIDE_PAGES.map(page => `- [Developer guide: ${page.title}](${siteUrl}${guidePath(page.slug)}): ${page.description}`).join("\n")}
- [Methodology](${siteUrl}/methodology): how captures are made and validated.
- [Changelog](${siteUrl}/changelog): data and site changes. RSS: ${siteUrl}/changelog.xml

## Devices

${deviceSections.join("\n")}`;
}
