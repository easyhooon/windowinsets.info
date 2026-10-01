import { DeviceView } from "../components/DeviceView";
import { findDevice, hasVerifiedInsets } from "../data/devices";
import { SITE_URL } from "../data/site";
import { pageMeta } from "../lib/seo";
import { deviceRawInsets } from "../data/rawInsets.server";
import { deviceSkins } from "../data/deviceSkins";
import type { Route } from "./+types/device";

export function meta({ loaderData }: Route.MetaArgs) {
  const device = loaderData?.device;
  if (!device) return [{ title: "Not found | windowinsets.info" }];
  return pageMeta({
    title: `${device.name} Window Insets & Display Metrics | windowinsets.info`,
    description: loaderData.verified
      ? `Explore measured window insets, safe areas and display cutouts for ${device.name}, with capture conditions and sources.`
      : `Explore the ${device.name} device preview. Android window insets are pending real-device measurement.`,
    url: `${SITE_URL}/${device.slug}`,
  });
}

/** Runs at prerender: the page's device, plus gesture and tappable insets read from the cited raw captures. */
export function loader({ params }: Route.LoaderArgs) {
  const device = findDevice(params.slug);
  if (!device) throw new Response("Not Found", { status: 404 });
  return { device, verified: hasVerifiedInsets(device), skins: deviceSkins(device), rawInsets: deviceRawInsets(device) };
}

export default function DevicePage({ loaderData: { device, skins, rawInsets } }: Route.ComponentProps) {
  return <DeviceView key={device.slug} device={device} skins={skins} rawInsets={rawInsets} />;
}
