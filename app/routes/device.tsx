import { DeviceView } from "../components/DeviceView";
import { findDevice, hasVerifiedInsets, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import { deviceRawInsets } from "../data/rawInsets.server";
import type { Route } from "./+types/device";

export function meta({ params }: Route.MetaArgs) {
  const device = findDevice(params.slug);
  if (!device) return [{ title: "Not found | windowinsets.info" }];
  return pageMeta({
    title: `${device.name} Window Insets & Display Metrics | windowinsets.info`,
    description: hasVerifiedInsets(device)
      ? `Explore measured window insets, safe areas and display cutouts for ${device.name}, with capture conditions and sources.`
      : `Explore the ${device.name} device preview. Android window insets are pending real-device measurement.`,
    url: `${SITE_URL}/${device.slug}`,
  });
}

/** Runs at prerender: gesture and tappable insets read from the cited raw captures. */
export function loader({ params }: Route.LoaderArgs) {
  const device = findDevice(params.slug);
  return { rawInsets: device ? deviceRawInsets(device) : {} };
}

export default function DevicePage({ params, loaderData }: Route.ComponentProps) {
  const device = findDevice(params.slug);
  if (!device) throw new Response("Not Found", { status: 404 });
  return <DeviceView key={device.slug} device={device} rawInsets={loaderData.rawInsets} />;
}
