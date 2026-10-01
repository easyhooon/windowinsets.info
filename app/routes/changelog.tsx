import { Link } from "react-router";
import { changelog, CHANGELOG_FEED_PATH, CHANGELOG_PATH, changelogDeviceName, commitUrl } from "../data/changelog";
import { SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/changelog";

export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta({
      title: "Data changelog | windowinsets.info",
      description: "New and corrected Android window inset measurements, generated from the data commits.",
      url: `${SITE_URL}${CHANGELOG_PATH}`,
    }),
    { tagName: "link", rel: "alternate", type: "application/rss+xml", title: "windowinsets.info data changelog", href: `${SITE_URL}${CHANGELOG_FEED_PATH}` },
  ];
}

export default function Changelog() {
  const days = [...new Set(changelog.map(entry => entry.date))];
  return (
    <article className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">Data changelog</h1>
      <p className="mt-2 text-muted">
        Every measurement added or corrected, generated from the data commits.{" "}
        <a href={CHANGELOG_FEED_PATH} className="text-accent underline">RSS feed</a>
      </p>
      {days.map(day => (
        <section key={day} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">
            <time dateTime={day}>{day}</time>
          </h2>
          <ul className="mt-2 divide-y divide-line">
            {changelog.filter(entry => entry.date === day).map(entry => (
              <li key={entry.hash} className="changelog-entry py-2.5 text-[15px] leading-relaxed">
                <span className={`changelog-kind ${entry.kind}`}>{entry.kind === "corrected" ? "Corrected" : "Added"}</span>
                <span className="text-fg">{entry.summary}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {entry.devices.map((slug, i) => {
                    const name = changelogDeviceName(slug);
                    return <span key={slug}>{i > 0 && ", "}{name ? <Link to={`/${slug}`} className="text-accent underline">{name}</Link> : slug}</span>;
                  })}
                  {" · "}
                  <a href={commitUrl(entry.hash)} className="font-mono underline">{entry.hash.slice(0, 7)}</a>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
