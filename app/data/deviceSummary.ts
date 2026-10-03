import type { Device } from "./types";
import { deviceSkins } from "./deviceSkins";
import { skinImagePaths } from "../lib/skinImages";

/** The catalog fields the sidebar and analytics need, sent instead of full device data. */
export type DeviceSummary = Pick<Device, "slug" | "name" | "brand" | "series" | "formFactor" | "releaseYear"> & {
  /** Recorded navigation-mode measurements across all screens. */
  measurementCount: number;
  screenCount: number;
  /** Artwork files the device page draws, prefetched on link intent. */
  skinImages: string[];
};

export function summarizeDevice(device: Device): DeviceSummary {
  const { slug, name, brand, series, formFactor, releaseYear } = device;
  return {
    slug, name, brand, series, formFactor, releaseYear,
    measurementCount: device.screens.reduce((count, screen) =>
      count + Number(screen.insets.gesture !== null) + Number(screen.insets.threeButton !== null), 0),
    screenCount: device.screens.length,
    skinImages: Object.values(deviceSkins(device)).flatMap(skinImagePaths),
  };
}
