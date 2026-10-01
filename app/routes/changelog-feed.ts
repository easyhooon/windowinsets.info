import { changelogFeed } from "../data/changelog";

export function loader() {
  return new Response(changelogFeed(), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
