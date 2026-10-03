import { devices } from "../data/devices";
import { createDeviceBundle } from "../data/deviceExport";
import { deviceDevelopment } from "../data/devCaptures.server";
import { rawInsets } from "../data/rawInsets.server";

export function loader() {
  return new Response(`${JSON.stringify(createDeviceBundle(devices, rawInsets, deviceDevelopment))}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
