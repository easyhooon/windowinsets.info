// Docs pages, kept apart from the route so the sitemap, prerender list and
// llms.txt can list them without importing React. `sections` names the README
// `## ` headings each page renders; the How I measure page is written in React.
export const DOCS_PAGES = [
  {
    slug: "",
    nav: "Overview",
    title: "Docs",
    description: "What windowinsets.info is for, the problems it solves and common objections.",
    sections: ["", "Why this exists"],
  },
  {
    slug: "methodology",
    nav: "How I measure",
    title: "How I measure Android window insets",
    description: "How windowinsets.info captures Android inset data, records its sources and conditions, and explains measurement limits.",
    sections: ["How I measure", "Measuring a device", "Camera cutouts and cover-screen limits"],
  },
  {
    slug: "data",
    nav: "Use the data",
    title: "Use the data",
    description: "The windowinsets-info CLI, Use in development specs, Markdown references and JSON exports.",
    sections: ["Use the data"],
  },
  {
    slug: "3d",
    nav: "3D folds",
    title: "3D foldable rendering",
    description: "Galaxy Fold, Flip and TriFold hinge states in 3D, and which device dimensions are published or illustrative.",
    sections: ["Fold it. Measure it.", "Device thickness and artwork limits"],
  },
  {
    slug: "coverage",
    nav: "Coverage",
    title: "Device coverage",
    description: "Which Galaxy and Pixel models are in scope, current coverage, and how to add a device.",
    sections: ["Device coverage and priorities", "Adding a device"],
  },
  {
    slug: "development",
    nav: "Development",
    title: "Development",
    description: "Project documents, the rendering stack, local development and support.",
    sections: ["Documentation", "Stack", "Development", "Support"],
  },
] as const;

export type DocsSlug = (typeof DOCS_PAGES)[number]["slug"];

export const docsPath = (slug: string) => (slug ? `/docs/${slug}` : "/docs");
