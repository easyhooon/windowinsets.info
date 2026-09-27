import { galaxyZTriFold } from "./devices/galaxy-z-trifold";
import type { Device } from "./types";
import { galaxyS25 } from "./devices/galaxy-s25";
import { galaxyS25Edge } from "./devices/galaxy-s25-edge";
import { galaxyS25Fe } from "./devices/galaxy-s25-fe";
import { galaxyS25Plus } from "./devices/galaxy-s25-plus";
import { galaxyS25Ultra } from "./devices/galaxy-s25-ultra";
import { galaxyS24Plus } from "./devices/galaxy-s24-plus";
import { galaxyS24Ultra } from "./devices/galaxy-s24-ultra";
import { galaxyS24 } from "./devices/galaxy-s24";
import { galaxyS24Fe } from "./devices/galaxy-s24-fe";
import { galaxyS23Fe } from "./devices/galaxy-s23-fe";
import { galaxyS22Ultra } from "./devices/galaxy-s22-ultra";
import { galaxyS23Ultra } from "./devices/galaxy-s23-ultra";
import { galaxyS23Plus } from "./devices/galaxy-s23-plus";
import { galaxyS22Plus } from "./devices/galaxy-s22-plus";
import { galaxyS22 } from "./devices/galaxy-s22";
import { galaxyS21Ultra } from "./devices/galaxy-s21-ultra";
import { galaxyS21Plus } from "./devices/galaxy-s21-plus";
import { galaxyS21 } from "./devices/galaxy-s21";
import { galaxyS20Ultra } from "./devices/galaxy-s20-ultra";
import { galaxyS20Fe } from "./devices/galaxy-s20-fe";
import { galaxyNote20 } from "./devices/galaxy-note20";
import { galaxyNote20Ultra } from "./devices/galaxy-note20-ultra";
import { galaxyS26Ultra } from "./devices/galaxy-s26-ultra";
import { galaxyS26Plus } from "./devices/galaxy-s26-plus";
import { galaxyS26 } from "./devices/galaxy-s26";
import { galaxyZFold6 } from "./devices/galaxy-z-fold6";
import { galaxyZFold5 } from "./devices/galaxy-z-fold5";
import { galaxyZFold4 } from "./devices/galaxy-z-fold4";
import { galaxyZFold3 } from "./devices/galaxy-z-fold3";
import { galaxyZFold2 } from "./devices/galaxy-z-fold2";
import { galaxyZFlip6 } from "./devices/galaxy-z-flip6";
import { galaxyZFlip4 } from "./devices/galaxy-z-flip4";
import { galaxyZFlip } from "./devices/galaxy-z-flip";
import { galaxyZFlip5 } from "./devices/galaxy-z-flip5";
import { galaxyZFlip3 } from "./devices/galaxy-z-flip3";
import { galaxyZFlip7 } from "./devices/galaxy-z-flip7";
import { galaxyZFold8Ultra } from "./devices/galaxy-z-fold8-ultra";
import { galaxyZFold7 } from "./devices/galaxy-z-fold7";
import { galaxyZFold8 } from "./devices/galaxy-z-fold8";
import { galaxyZFlip8 } from "./devices/galaxy-z-flip8";
import { galaxyZFlip7Fe } from "./devices/galaxy-z-flip7-fe";
import { GalaxyTabS11 } from "./devices/galaxy-tab-s11";
import { GalaxyTabS10FePlus } from "./devices/galaxy-tab-s10-fe-plus";
import { GalaxyTabS10Fe } from "./devices/galaxy-tab-s10-fe";
import { GalaxyTabS9FePlus } from "./devices/galaxy-tab-s9-fe-plus";
import { galaxyTabS9Fe } from "./devices/galaxy-tab-s9-fe";
import { galaxyTabS9 } from "./devices/galaxy-tab-s9";
import { galaxyTabS9Plus } from "./devices/galaxy-tab-s9-plus";
import { galaxyTabS8Ultra } from "./devices/galaxy-tab-s8-ultra";
import { galaxyTabS8Plus } from "./devices/galaxy-tab-s8-plus";
import { galaxyTabS8 } from "./devices/galaxy-tab-s8";
import { galaxyTabS7Fe } from "./devices/galaxy-tab-s7-fe";
import { galaxyTabS7Plus } from "./devices/galaxy-tab-s7-plus";
import { galaxyTabS10Ultra } from "./devices/galaxy-tab-s10-ultra";
import { galaxyTabS10Plus } from "./devices/galaxy-tab-s10-plus";
import { galaxyTabS10Lite } from "./devices/galaxy-tab-s10-lite";
import { galaxyTabS11Ultra } from "./devices/galaxy-tab-s11-ultra";
import { galaxyTabS9Ultra } from "./devices/galaxy-tab-s9-ultra";
import { galaxyTabA9Plus } from "./devices/galaxy-tab-a9-plus";
import { galaxyTabA7Lite } from "./devices/galaxy-tab-a7-lite";
import { galaxyTabA11 } from "./devices/galaxy-tab-a11";
import { galaxyA27 } from "./devices/galaxy-a27-5g";
import { galaxyA55 } from "./devices/galaxy-a55-5g";
import { galaxyA35 } from "./devices/galaxy-a35-5g";
import { galaxyA14 } from "./devices/galaxy-a14-5g";
import { galaxyA04 } from "./devices/galaxy-a04";
import { galaxyA16 } from "./devices/galaxy-a16-5g";
import { galaxyA15 } from "./devices/galaxy-a15-5g";
import { galaxyA06 } from "./devices/galaxy-a06";
import { galaxyA05 } from "./devices/galaxy-a05";
import { galaxyA52s } from "./devices/galaxy-a52s-5g";
import { galaxyA24 } from "./devices/galaxy-a24";
import { galaxyA23 } from "./devices/galaxy-a23-5g";
import { galaxyA34 } from "./devices/galaxy-a34-5g";
import { galaxyA33 } from "./devices/galaxy-a33-5g";
import { galaxyA73 } from "./devices/galaxy-a73-5g";
import { galaxyA32 } from "./devices/galaxy-a32";
import { galaxyA32FiveG } from "./devices/galaxy-a32-5g";
import { galaxyA53 } from "./devices/galaxy-a53-5g";
import { galaxyA57 } from "./devices/galaxy-a57-5g";
import { galaxyA37 } from "./devices/galaxy-a37-5g";
import { galaxyA17 } from "./devices/galaxy-a17-5g";
import { galaxyA56 } from "./devices/galaxy-a56-5g";
import { galaxyA36 } from "./devices/galaxy-a36-5g";
import { galaxyA07 } from "./devices/galaxy-a07";
import { skinPreviews } from "./skinPreviews";
import { isInCoverage } from "./coverage";

// Explicit entries own all verified data. Skins can add missing screens, never
// replace a screen's captures. Add a measured entry here as RTL data arrives.
const verifiedEntries = [galaxyA57, galaxyA55, galaxyA53, galaxyA52s, galaxyA73, galaxyA37, galaxyA35, galaxyA34, galaxyA33, galaxyA32, galaxyA32FiveG, galaxyA24, galaxyA23, galaxyA17, galaxyA16, galaxyA15, galaxyA14, galaxyA06, galaxyA05, galaxyA04, galaxyA56, galaxyA36, galaxyA27, galaxyA07, galaxyTabA11, galaxyTabA7Lite, galaxyTabA9Plus, GalaxyTabS11, galaxyTabS10Ultra, galaxyTabS10Plus, GalaxyTabS10FePlus, GalaxyTabS10Fe, galaxyTabS10Lite, GalaxyTabS9FePlus, galaxyTabS9Fe, galaxyTabS9, galaxyTabS9Plus, galaxyTabS8Ultra, galaxyTabS8Plus, galaxyTabS8, galaxyTabS7Plus, galaxyTabS7Fe, galaxyZTriFold, galaxyZFold8Ultra, galaxyZFold8, galaxyZFlip8, galaxyZFlip7Fe, galaxyTabS11Ultra, galaxyTabS9Ultra, galaxyS26Ultra, galaxyS26Plus, galaxyS26,
  galaxyS25Ultra, galaxyS25Plus, galaxyS25Edge, galaxyS25Fe, galaxyS25, galaxyS24Ultra, galaxyS24Plus, galaxyS24, galaxyS24Fe, galaxyS23Ultra, galaxyS23Plus, galaxyS23Fe, galaxyS22Ultra, galaxyS22Plus, galaxyS22, galaxyS21Ultra, galaxyS21Plus, galaxyS21, galaxyS20Ultra, galaxyS20Fe, galaxyNote20Ultra, galaxyNote20, galaxyZFlip7, galaxyZFold7, galaxyZFold6, galaxyZFold5, galaxyZFold4, galaxyZFold3, galaxyZFlip6, galaxyZFlip5, galaxyZFlip4, galaxyZFlip3, galaxyZFlip, galaxyZFold2];
const mergedDevices = verifiedEntries.map(device => {
  const preview = skinPreviews.find(entry => entry.slug === device.slug);
  const missingScreens = preview?.screens.filter(screen => !device.screens.some(s => s.id === screen.id)) ?? [];
  return { ...device, screens: [...device.screens, ...missingScreens].sort((a, b) => Number(a.id === "main") - Number(b.id === "main")) };
}).concat(skinPreviews.filter(preview => !verifiedEntries.some(device => device.slug === preview.slug)));

const groupOrder = (device: Device) => device.formFactor === "foldable-trifold" ? -1 : device.formFactor === "foldable-book" ? 0
  : device.formFactor === "foldable-flip" ? 1 : device.formFactor === "tablet" ? 3
  : device.series.startsWith("Galaxy Note") ? 4 : device.series === "Galaxy A" ? 5 : 2;
const generation = (device: Device) => Number(device.slug.match(/(?:fold|flip|s|a|active|note)(\d+)/)?.[1] ?? 1);
const tier = (device: Device) => device.slug.endsWith("ultra") ? 0 : device.slug.endsWith("plus") ? 1
  : device.slug.endsWith("edge") ? 2 : device.slug.includes("-fe") ? 4 : 3;

export const devices: Device[] = mergedDevices.filter(isInCoverage).sort((a, b) => groupOrder(a) - groupOrder(b)
  || generation(b) - generation(a) || tier(a) - tier(b) || a.name.localeCompare(b.name));

export const featuredDevice = devices.find(device => device.slug === "galaxy-z-fold8")!;

export const SITE_URL = "https://windowinsets.info";
export const REPO_URL = "https://github.com/easyhooon/windowinsets.info";

/** Non-device pages that are prerendered and listed in the sitemap. */
export const STATIC_PATHS = ["/", "/methodology"];

export const allPaths = () => [...STATIC_PATHS, ...devices.map((d) => `/${d.slug}`)];

export function findDevice(slug: string | undefined): Device | undefined {
  return devices.find((d) => d.slug === slug);
}

export function hasVerifiedInsets(device: Device): boolean {
  return device.screens.some((s) =>
    Object.values(s.insets).some((m) => m !== null),
  );
}

/** A screen counts as "specced" once resolution/ppi were filled in from a source. */
export function isSpecced(screen: Device["screens"][number]): boolean {
  return screen.ppi > 0 && screen.resolutionPx.width > 0;
}
