// Developer guide pages, kept apart from the route so the sitemap, prerender list
// and llms.txt can list them without importing React.
export const GUIDE_PAGES = [
  {
    slug: "",
    nav: "Basics",
    title: "Window insets basics",
    description: "What window insets are, why their size varies by device, and how gesture zones differ from tappable elements.",
  },
  {
    slug: "code",
    nav: "Compose & Views",
    title: "Window insets in Compose and Views",
    description: "Edge-to-edge, Scaffold and safeDrawing in Jetpack Compose, and WindowInsetsCompat in Views.",
  },
  {
    slug: "foldables",
    nav: "Foldables",
    title: "Foldables: detecting the fold",
    description: "Reading FoldingFeature state, orientation and bounds in Compose and Views, tabletop and book postures, and the hinge angle sensor.",
  },
  {
    slug: "patterns",
    nav: "Patterns",
    title: "Common window inset patterns",
    description: "Keeping content off the cutout, full-screen media and custom navigation UI.",
  },
  {
    slug: "data",
    nav: "Site data & CLI",
    title: "Using windowinsets.info in your code",
    description: "Shareable view URLs, JSON exports, the device index and bundle, and the windowinsets-info CLI.",
  },
  {
    slug: "references",
    nav: "References",
    title: "Official references",
    description: "Android and Samsung documentation on window insets, edge-to-edge and foldables.",
  },
] as const;

export type GuideSlug = (typeof GUIDE_PAGES)[number]["slug"];

export const guidePath = (slug: string) => (slug ? `/developer-guide/${slug}` : "/developer-guide");

/** Old single-page anchors that now live on their own page. */
export const MOVED_GUIDE_ANCHORS: Record<string, GuideSlug> = {
  "jetpack-compose": "code",
  views: "code",
};
