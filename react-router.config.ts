import type { Config } from "@react-router/dev/config";
import { allPaths, devices } from "./app/data/devices";
import { DEVICE_INDEX_PATH, deviceExportPath } from "./app/data/deviceExport";
import { LLMS_TXT_PATH } from "./app/data/llmsTxt";

export default {
  // Static site: every page is rendered to HTML at build time (SEO + link previews),
  // then hydrates as a normal React SPA. No server needed.
  ssr: false,
  prerender: [...allPaths(), ...devices.map(deviceExportPath), DEVICE_INDEX_PATH, "/sitemap.xml", "/changelog.xml", LLMS_TXT_PATH],
} satisfies Config;
