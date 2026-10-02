import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    route("methodology", "routes/methodology.tsx"),
    route("developer-guide", "routes/developer-guide.tsx"),
    route("changelog", "routes/changelog.tsx"),
    route(":slug", "routes/device.tsx"),
  ]),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("llms.txt", "routes/llms-txt.ts"),
  route("changelog.xml", "routes/changelog-feed.ts"),
  route("data/index.json", "routes/device-index.ts"),
  route("data/:slug.json", "routes/device-data.ts"),
] satisfies RouteConfig;
