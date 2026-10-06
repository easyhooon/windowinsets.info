import { Marked } from "marked";
import readme from "../../README.md?raw";
import { REPO_URL, SITE_URL } from "./site";

/** README sections the How I measure page already covers. */
const METHODOLOGY_SECTIONS = new Set(["How I measure", "Measuring a device", "Camera cutouts and cover-screen limits"]);

const slugify = (text: string) => text.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

/** Site links stay on the site; repository-relative links and images point at GitHub. */
function rewrite(href: string, image: boolean): string {
  if (href.startsWith(SITE_URL)) return href.slice(SITE_URL.length) || "/";
  if (/^([a-z]+:|#)/i.test(href)) return href;
  return `${REPO_URL}/${image ? "raw" : "blob"}/main/${href.replace(/^\.\//, "")}`;
}

/** Splits the README at `## ` headings, dropping the badge, title and methodology sections. */
function docsMarkdown(source: string): string {
  const parts = source.split(/^(?=## )/m);
  const intro = parts[0].replace(/^.*\n# .*\n/s, "");
  return [intro, ...parts.slice(1).filter(part => !METHODOLOGY_SECTIONS.has(part.slice(3, part.indexOf("\n")).trim()))].join("");
}

const marked = new Marked({
  walkTokens(token) {
    if (token.type === "link" || token.type === "image") token.href = rewrite(token.href, token.type === "image");
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

export function readmeDocsHtml(): string {
  return marked.parse(docsMarkdown(readme), { async: false });
}
