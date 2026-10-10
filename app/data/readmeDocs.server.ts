import { Marked } from "marked";
import readme from "../../README.md?raw";
import { DOCS_PAGES, docsPath } from "./docsPages";
import { REPO_URL, SITE_URL } from "./site";

const slugify = (text: string) => text.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

/** The README split at `## ` headings, keyed by heading ("" for the intro, without badge and title). */
function readmeSections(source: string): Map<string, string> {
  const parts = source.split(/^(?=## )/m);
  const sections = new Map([["", parts[0].replace(/^.*\n# .*\n/s, "")]]);
  for (const part of parts.slice(1)) sections.set(part.slice(3, part.indexOf("\n")).trim(), part);
  return sections;
}

const sections = readmeSections(readme);
const pageOfSection = new Map<string, string>(DOCS_PAGES.flatMap(page => page.sections.map(section => [section, page.slug] as const)));
const unplaced = [...sections.keys()].filter(section => !pageOfSection.has(section));
if (unplaced.length) throw new Error(`README sections without a docs page: ${unplaced.join(", ")}`);

/** Heading anchors, so README-internal links can point at the page that now holds them. */
const pageOfAnchor = new Map([...sections].flatMap(([section, markdown]) =>
  [...markdown.matchAll(/^#{2,6} (.+)$/gm)].map(([, heading]) => [slugify(heading), pageOfSection.get(section)!] as const)));

/** Site links stay on the site; repository-relative links and images point at GitHub. */
function rewrite(href: string, image: boolean, page: string): string {
  if (href.startsWith(SITE_URL)) return href.slice(SITE_URL.length) || "/";
  if (href.startsWith("#")) {
    const target = pageOfAnchor.get(href.slice(1));
    return target === undefined || target === page ? href : `${docsPath(target)}${href}`;
  }
  if (/^[a-z]+:/i.test(href)) return href;
  return `${REPO_URL}/${image ? "raw" : "blob"}/main/${href.replace(/^\.\//, "")}`;
}

const markedFor = (page: string) => new Marked({
  walkTokens(token) {
    if (token.type === "link" || token.type === "image") token.href = rewrite(token.href, token.type === "image", page);
  },
  renderer: {
    /** A one-row table of images (the hinge GIFs) becomes captioned figures that can stack on phones. */
    table({ header, rows }) {
      const cells = rows.length === 1 ? rows[0].map(cell => this.parser.parseInline(cell.tokens)) : [];
      if (!cells.length || !cells.every(cell => cell.includes("<img"))) return false;
      const figures = cells.map((cell, i) => `<figure>${cell}<figcaption>${this.parser.parseInline(header[i].tokens)}</figcaption></figure>`);
      return `<div class="docs-gallery">${figures.join("")}</div>\n`;
    },
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(html)}">${html}</h${depth}>\n`;
    },
  },
});

/** One docs page's README sections as HTML. A page made of one section drops its heading, which the page title repeats. */
export function readmeDocsHtml(slug: string): string {
  const page = DOCS_PAGES.find(item => item.slug === slug)!;
  const markdown = page.sections.map(section => sections.get(section) ?? "").join("");
  const body = page.sections.length === 1 ? markdown.replace(/^## .*\n/, "") : markdown;
  return markedFor(slug).parse(body, { async: false });
}
