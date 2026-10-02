import type { Config } from "@react-router/dev/config";
import { allPaths, devices } from "./app/data/devices";
import { DEVICE_BUNDLE_PATH, DEVICE_INDEX_PATH, deviceExportPath, deviceMarkdownPath } from "./app/data/deviceExport";
import { LLMS_TXT_PATH } from "./app/data/llmsTxt";

export default {
  // Static site: every page is rendered to HTML at build time (SEO + link previews),
  // then hydrates as a normal React SPA. No server needed.
  ssr: false,
  prerender: [...allPaths(), ...devices.map(deviceExportPath), ...devices.map(deviceMarkdownPath), DEVICE_INDEX_PATH, DEVICE_BUNDLE_PATH, "/sitemap.xml", "/changelog.xml", LLMS_TXT_PATH],
} satisfies Config;
