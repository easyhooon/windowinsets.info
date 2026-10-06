import { Link } from "react-router";
import { readmeDocsHtml } from "../data/readmeDocs.server";
import { REPO_URL, SITE_URL } from "../data/site";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/docs";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Docs | windowinsets.info",
    description: "Using windowinsets.info data, project documentation, device coverage, adding devices and local development.",
    url: `${SITE_URL}/docs`,
  });
}

/** Runs at prerender: the README as HTML, without shipping the Markdown parser. */
export function loader() {
  return { html: readmeDocsHtml() };
}

export default function Docs({ loaderData: { html } }: Route.ComponentProps) {
  return (
    <article className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">Docs</h1>
      <p className="mt-2 text-muted">
        The project README, without the parts covered by <Link to="/methodology" className="text-accent underline">How I measure</Link>.
        The <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-accent underline">repository ↗</a> holds the linked documents.
      </p>
      <div
        className="docs-content mt-6 text-[15px] leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
