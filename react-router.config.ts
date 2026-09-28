import type { Config } from "@react-router/dev/config";
import { allPaths, devices } from "./app/data/devices";
import { deviceExportPath } from "./app/data/deviceExport";

export default {
  // Static site: every page is rendered to HTML at build time (SEO + link previews),
  // then hydrates as a normal React SPA. No server needed.
  ssr: false,
  prerender: [...allPaths(), ...devices.map(deviceExportPath), "/sitemap.xml"],
} satisfies Config;
