import { useEffect } from "react";
import { useLocation, useRouteLoaderData } from "react-router";
import type { loader as shellLoader } from "../routes/shell";
import { FEATURED_SLUG } from "../data/site";
import { initializeAnalytics, trackPageView } from "../lib/analytics";

export function Analytics() {
  const { pathname } = useLocation();
  const devices = useRouteLoaderData<typeof shellLoader>("routes/shell")?.devices;
  useEffect(() => {
    initializeAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID, import.meta.env.PROD);
    const slug = pathname === "/" ? FEATURED_SLUG : pathname.slice(1);
    trackPageView(pathname, devices?.find(d => d.slug === slug));
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
