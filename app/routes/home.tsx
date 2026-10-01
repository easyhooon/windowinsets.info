import { DeviceView } from "../components/DeviceView";
import { featuredDevice } from "../data/devices";
import { SITE_URL } from "../data/site";
import { pageMeta } from "../lib/seo";
import { deviceRawInsets } from "../data/rawInsets.server";
import { deviceSkins } from "../data/deviceSkins";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Android Window Insets & Safe Areas | windowinsets.info",
    description:
      "Explore window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy and Google Pixel devices. See how the measurements were captured.",
    url: SITE_URL,
  });
}

/** Landing page shows the featured device's own detail view directly —
 * safearea.info does the same with iPhone Duo — instead of a separate
 * list-only summary page. Pick any other device from the sidebar. */
export function loader() {
  return { device: featuredDevice, skins: deviceSkins(featuredDevice), rawInsets: deviceRawInsets(featuredDevice) };
}

export default function Home({ loaderData: { device, skins, rawInsets } }: Route.ComponentProps) {
  return <DeviceView key={device.slug} device={device} skins={skins} rawInsets={rawInsets} />;
}
