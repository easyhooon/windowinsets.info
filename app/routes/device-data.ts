import { findDevice } from "../data/devices";
import { serializeDeviceExport } from "../data/deviceExport";
import type { Route } from "./+types/device-data";

export function loader({ params }: Route.LoaderArgs) {
  const device = findDevice(params.slug);
  if (!device) throw new Response("Not Found", { status: 404 });
  return new Response(serializeDeviceExport(device), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
