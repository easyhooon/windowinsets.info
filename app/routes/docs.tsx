import { Link } from "react-router";
import { Methodology } from "../components/Methodology";
import { devices, hasVerifiedInsets } from "../data/devices";
import { DOCS_PAGES, docsPath } from "../data/docsPages";
import { readmeDocsHtml } from "../data/readmeDocs.server";
import { REPO_URL, SITE_URL } from "../data/site";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/docs";

const findPage = (topic: string | undefined) => DOCS_PAGES.find(page => page.slug === (topic ?? ""));

export function meta({ params }: Route.MetaArgs) {
  const page = findPage(params.topic) ?? DOCS_PAGES[0];
  return pageMeta({
    title: `${page.title} | windowinsets.info`,
    description: page.description,
    url: `${SITE_URL}${docsPath(page.slug)}`,
  });
}

/** Runs at prerender: README sections as HTML without shipping the Markdown parser, or catalog counts for How I measure. */
export function loader({ params }: Route.LoaderArgs) {
  const page = findPage(params.topic);
  if (!page) throw new Response("Not Found", { status: 404 });
  return page.slug === "methodology"
    ? {
      html: null,
      counts: {
        measured: devices.filter(d => d.brand === "Samsung" && hasVerifiedInsets(d)).length,
        emulated: devices.filter(d => d.brand === "Google" && hasVerifiedInsets(d)).length,
        total: devices.length,
      },
    }
    : { html: readmeDocsHtml(page.slug), counts: null };
}

export default function Docs({ loaderData: { html, counts }, params }: Route.ComponentProps) {
  const index = DOCS_PAGES.findIndex(page => page.slug === (params.topic ?? ""));
  const page = DOCS_PAGES[index];
  const previous = DOCS_PAGES[index - 1];
  const next = DOCS_PAGES[index + 1];
  return (
    <article className="mx-auto max-w-3xl p-4 md:p-8">
      {page.slug && <p className="text-sm font-medium text-muted">Docs</p>}
      <h1 className={`${page.slug ? "mt-1 " : ""}text-2xl font-semibold`}>{page.title}</h1>
      <nav aria-label="Docs pages" className="guide-nav">
        {DOCS_PAGES.map(item => (
          <Link key={item.slug} to={docsPath(item.slug)} aria-current={item.slug === page.slug ? "page" : undefined}>
            {item.nav}
          </Link>
        ))}
      </nav>
      {page.slug === "" && (
        <p className="mt-4 text-muted">
          The project README, split into pages. The{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-accent underline">repository ↗</a> holds the linked documents.
        </p>
      )}
      {counts
        ? <Methodology counts={counts} />
        : <div className="docs-content mt-6 text-[15px] leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: html! }} />}
      <nav aria-label="Previous and next docs pages" className="guide-pager">
        {previous ? <Link to={docsPath(previous.slug)} rel="prev"><span>Previous</span>{previous.title}</Link> : <span />}
        {next && <Link to={docsPath(next.slug)} rel="next"><span>Next</span>{next.title}</Link>}
      </nav>
    </article>
  );
}
