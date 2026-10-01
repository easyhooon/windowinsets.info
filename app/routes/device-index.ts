import { devices, SITE_URL } from "../data/devices";
import { createDeviceIndex } from "../data/deviceExport";

export function loader() {
  return new Response(`${JSON.stringify(createDeviceIndex(devices, SITE_URL), null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
