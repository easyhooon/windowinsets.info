import { DeviceView } from "../components/DeviceView";
import { featuredDevice, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Android Window Insets & Safe Areas | windowinsets.info",
    description:
      "Explore window insets, display cutouts, corner radii and foldable hinge states for Samsung Galaxy and Google Pixel devices. See how the measurements were captured.",
    url: SITE_URL,
  });
}

/** Landing page shows the newest device's own detail view directly —
 * safearea.info does the same with iPhone Duo — instead of a separate
 * list-only summary page. Pick any other device from the sidebar. */
export default function Home() {
  const featured = featuredDevice;
  return <DeviceView key={featured.slug} device={featured} />;
}
