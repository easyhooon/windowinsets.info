import { useEffect, useState } from "react";
import type { DeviceSkin } from "../data/skins";
import { skinAssetUrl } from "../data/skinAssetUrl";

/** Decoded skin images by URL; holding the elements keeps the bitmaps in the memory cache. */
const loads = new Map<string, Promise<void>>();
const ready = new Set<string>();

/** The artwork files one skin draws: body, plus the camera foreground when present. */
export function skinImagePaths(skin: DeviceSkin | undefined): string[] {
  return skin ? [skin.image, ...(skin.foreground ? [skin.foreground] : [])] : [];
}

function loadSkinImage(path: string): Promise<void> {
  const url = skinAssetUrl(path);
  let load = loads.get(url);
  if (!load) {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    // A failed image still settles, so it never holds the diagram back.
    load = image.decode().catch(() => {}).then(() => { ready.add(url); });
    loads.set(url, load);
  }
  return load;
}

/** Starts downloading a device's artwork on link intent, unless the user asked to save data. */
export function prefetchSkinImages(paths: readonly string[]) {
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
  paths.forEach(loadSkinImage);
}

/** True once every image is decoded, or after `timeoutMs`, so artwork and display content appear together. */
export function useSkinImagesReady(paths: readonly string[], timeoutMs = 1500): boolean {
  const key = paths.join("\n");
  const settled = () => typeof window !== "undefined" && paths.every(path => ready.has(skinAssetUrl(path)));
  const [readyKey, setReadyKey] = useState(() => settled() ? key : null);
  useEffect(() => {
    if (settled()) { setReadyKey(key); return; }
    let active = true;
    const reveal = () => { if (active) setReadyKey(key); };
    const timer = setTimeout(reveal, timeoutMs);
    Promise.all(paths.map(loadSkinImage)).then(reveal);
    return () => { active = false; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, timeoutMs]);
  return readyKey === key || settled();
}
