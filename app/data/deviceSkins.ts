import { aospSkins } from "./aospSkins";
import { skins, type DeviceSkin } from "./skins";
import type { Device } from "./types";

const allSkins = { ...skins, ...aospSkins };

/** One device's artwork keyed by screen id, so pages load it with their device instead of every skin. */
export function deviceSkins(device: Device): Record<string, DeviceSkin> {
  return Object.fromEntries(device.screens.flatMap(screen => {
    const skin = allSkins[`${device.slug}/${screen.id}`];
    return skin ? [[screen.id, skin]] : [];
  }));
}
