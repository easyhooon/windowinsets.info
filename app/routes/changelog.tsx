import { Link } from "react-router";
import { areaLabel, changelog, CHANGELOG_FEED_PATH, CHANGELOG_PATH, changelogRows, commitUrl, entryUrl } from "../data/changelog";
import { changelogDeviceName } from "../data/changelog.server";
import { SITE_URL } from "../data/site";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/changelog";

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta({
      title: "Changelog | windowinsets.info",
      description: "Android window inset measurements and site changes, generated from the repository history.",
      url: `${SITE_URL}${CHANGELOG_PATH}`,
    }),
    { tagName: "link", rel: "alternate", type: "application/rss+xml", title: "windowinsets.info changelog", href: `${SITE_URL}${CHANGELOG_FEED_PATH}` },
  ];
}

/** Runs at prerender: device names for the slugs entries mention, without shipping the catalog. */
export function loader() {
  const slugs = [...new Set(changelog.flatMap(entry => entry.devices))];
  return { names: Object.fromEntries(slugs.map(slug => [slug, changelogDeviceName(slug)])) };
}

export default function Changelog({ loaderData: { names } }: Route.ComponentProps) {
  const rows = changelogRows();
  const days = [...new Set(rows.map(row => row.date))];
  return (
    <article className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">Changelog</h1>
      <p className="mt-2 text-muted">
        Measurements and site changes, generated from the repository history.{" "}
        <a href={CHANGELOG_FEED_PATH} className="text-accent underline">RSS feed</a>
      </p>
      {days.map(day => (
        <section key={day} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">
            <time dateTime={day}>{day}</time>
          </h2>
          <ul className="mt-2 divide-y divide-line">
            {rows.filter(entry => entry.date === day).map(entry => (
              <li key={entry.hash} className="changelog-entry py-2.5 text-[15px] leading-relaxed">
                <span className={`changelog-kind ${entry.area}`}>{areaLabel(entry)}</span>
                <span className="text-fg">{entry.summary}</span>
                {/* Site entries have no device line, so their link trails the summary. */}
                {entry.devices.length === 0 ? <>
                  {" "}<a href={entryUrl(entry)} className="font-mono text-xs text-muted underline">{entry.pr ? `#${entry.pr}` : entry.hash.slice(0, 7)}</a>
                </> : <span className="mt-0.5 block text-xs text-muted">
                  {entry.devices.map((slug, i) => {
                    const name = names[slug];
                    return <span key={slug}>{i > 0 && ", "}{name ? <Link to={`/${slug}`} className="text-accent underline">{name}</Link> : slug}</span>;
                  })}
                  {" · "}
                  {entry.commits ? <details className="changelog-commits inline">
                    <summary className="cursor-pointer underline">{entry.commits.length} commits</summary>
                    <ul className="mt-1 space-y-0.5">
                      {entry.commits.map(commit => (
                        <li key={commit.hash}>
                          {commit.summary}{" · "}
                          <a href={commitUrl(commit.hash)} className="font-mono underline">{commit.hash.slice(0, 7)}</a>
                        </li>
                      ))}
                    </ul>
                  </details> : <a href={entryUrl(entry)} className="font-mono underline">{entry.hash.slice(0, 7)}</a>}
                </span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
