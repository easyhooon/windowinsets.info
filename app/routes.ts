import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    route("developer-guide/:topic?", "routes/developer-guide.tsx"),
    route("docs/:topic?", "routes/docs.tsx"),
    route("changelog", "routes/changelog.tsx"),
    route(":slug", "routes/device.tsx"),
  ]),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("llms.txt", "routes/llms-txt.ts"),
  route(":slug.md", "routes/device-markdown.ts"),
  route("changelog.xml", "routes/changelog-feed.ts"),
  route("data/index.json", "routes/device-index.ts"),
  route("data/all.json", "routes/device-bundle.ts"),
  route("data/:slug.json", "routes/device-data.ts"),
] satisfies RouteConfig;
