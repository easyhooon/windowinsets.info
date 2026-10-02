import { findDevice, SITE_URL } from "../data/devices";
import { createDeviceMarkdown } from "../data/deviceMarkdown.server";
import type { Route } from "./+types/device-markdown";

export function loader({ params }: Route.LoaderArgs) {
  const device = findDevice(params.slug);
  if (!device) throw new Response("Not Found", { status: 404 });
  return new Response(createDeviceMarkdown(device, SITE_URL), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
