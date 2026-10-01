import { SITE_URL } from "../data/site";

export const SITE_NAME = "windowinsets.info";

// Versioned asset URL lets sharing crawlers distinguish this artwork from v1.
const OG_IMAGE = `${SITE_URL}/og-android-v2.png`;
const OG_IMAGE_ALT = "Window Insets for Android — a folding phone with mint safe areas and apricot inset bands. windowinsets.info";

/** Standard <meta>/<link> tags every page should ship, following the pattern
 * safearea.info uses: og:title/description/type/site_name/image(+dims/alt),
 * twitter:card/title/description/image(+alt), and a canonical link. */
export function pageMeta({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:url", content: url },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: OG_IMAGE_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
    { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    { tagName: "link", rel: "canonical", href: url },
  ];
}
