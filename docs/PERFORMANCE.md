# Frontend performance

This page records the client bundle optimizations, their measured effect, the
rules that keep the gains, and the candidates not done yet. Re-measure with the
method below before and after any change that adds a dependency or moves data
between the server and client bundles.

## Results (2026-10-01)

Initial JavaScript is every `/assets/*.js` file a prerendered page references
(entry, route modules and `modulepreload` links), each gzip-compressed at level 9
and summed. Baseline is `6905afb` (before the work). After is main
with #140, #141, #143 and the CodeBlock change for #144 merged.

| Page | Baseline | After | Change |
|---|---:|---:|---:|
| Home (featured Flip8) | 350.9 kB | 143.3 kB | −207.6 kB (−59%) |
| Flat device (Galaxy S25 Ultra) | 351.0 kB | 143.3 kB | −207.7 kB (−59%) |
| Foldable device (Galaxy Z Fold7) | 351.0 kB | 143.3 kB + 139.1 kB lazy | −68.6 kB (−20%) total |
| Methodology | 176.4 kB | 122.4 kB | −54.0 kB (−31%) |
| Changelog | 182.9 kB | 129.2 kB | −53.7 kB (−29%) |
| Developer guide | 189.3 kB | 135.9 kB | −53.4 kB (−28%) |

| Chunk | Baseline | After |
|---|---:|---:|
| `DeviceView` | 167.6 kB (with three.js) | 16.0 kB |
| `CodeBlock` (highlight.js, lazy on device pages) | every device page | 10.0 kB, when a snippet opens |
| `FoldRenderer3D` (three.js, lazy) | in `DeviceView` | 139.1 kB, foldable pages only |
| `devices` (full catalog) | 54.5 kB, every page | removed from the client |
| `galaxy-s25-ultra.data` (per navigation) | 0.8 kB | 5.1 kB |

Each client navigation now fetches the target device and its skins (about
5 kB) instead of shipping all 140+ devices up front. Prerendered HTML is
unchanged.

## What changed

### Lazy three.js renderer (#140)

`FoldRenderer3D` and three.js load through `React.lazy` only when a page shows a
3D foldable. Hinge and camera math that flat pages also need moved to the
three.js-free `app/components/foldMath.ts`. An `OnMount` helper inside the
`Suspense` boundary reruns the diagram fit once the renderer replaces the
placeholder.

### Per-page device data (#141)

Route loaders run at prerender and emit `<slug>.data` files, so the client gets
only what the page shows:

- `routes/shell.tsx` sends `DeviceSummary[]` for the sidebar and analytics and
  never revalidates.
- `routes/device.tsx` and `routes/home.tsx` send one device, its skins
  (`deviceSkins`) and its raw insets.
- `routes/methodology.tsx` sends counts; `routes/changelog.tsx` sends the device
  names its entries mention.
- Site constants live in `app/data/site.ts`. Changelog name lookup and the RSS
  feed live in `app/data/changelog.server.ts`.

### Prefetch the 3D chunk on intent (#143)

Hovering, focusing or touching a foldable link in the sidebar calls
`prefetchFoldRenderer`, which starts the same `import()` that `React.lazy` uses
(`app/components/foldRendererChunk.ts`). In a production build check, the chunk
arrived about 1.5 s before the click and was not requested again on mount. Flat
devices and Save-Data connections skip it. Non-device pages pay about 1.7 kB for
the shared chunk that holds the loader.

React Router's `prefetch="intent"` was tried and rejected. It downloads
`<slug>.data?_routes=…` on hover, but navigation then fetches `<slug>.data`
without the query, so each hovered page's data was transferred twice.

### Lazy code blocks on device pages (#144)

Device pages show no code on first paint: the Compose and Views snippets appear
only with App Preview on, and the test fixture sits in a collapsed disclosure.
`DeviceView` loads `CodeBlock` and highlight.js through `React.lazy`, renders the
fixture only after its disclosure opens, and shows the plain code as the
Suspense fallback until highlighting arrives. The developer guide keeps a static
import because its code is visible on first paint. The prerendered device HTML no
longer contains the fixture code.

## Rules that keep the gains

- Never import `app/data/devices.ts`, `skins.ts` or `aospSkins.ts` from a
  component, client module or route component. Read device data in a route
  `loader` (or a `*.server.ts` module) and pass the result through loader data.
  A top-level `new Map(devices.map(...))` in a client module pulls the whole
  catalog back into the bundle.
- Import three.js only from `FoldRenderer3D.tsx` and its private helpers. Math
  shared with flat pages belongs in `foldMath.ts`.
- Load `FoldRenderer3D` only through `loadFoldRenderer()`, so prefetch and lazy
  mount share one request.
- Keep `CodeBlock` out of static imports in modules every device page loads;
  use the lazy wrapper in `DeviceView`.
- Relative imports used by `node --test` need explicit `.ts` extensions
  (`allowImportingTsExtensions` is on).

## Measuring

```bash
pnpm build
```

Then sum the gzip size of each `/assets/*.js` file that the page's prerendered
`index.html` references. Restore the regenerated `app/data/changelog.json`
before committing. For the lazy chunk, open a foldable page in the built site and
check the network panel for `FoldRenderer3D-*.js`.

## Candidates not done yet

- Low priority: `app/data/changelog.json` (about 9 kB gzip) is bundled into the
  10.4 kB gzip changelog route chunk, which loads only on `/changelog`. That page
  carries the entries twice, in the JS and in the rendered HTML. Moving the JSON
  into the loader alone saves almost nothing, because loader data is inlined in
  the HTML. It pays off only if the loader trims the entries to the fields the
  page renders or paginates older entries.
- Negligible: prefetch the 3D chunk from the device-name links in `/changelog`
  entries. The changelog loader sends names without a form factor today. Visitors
  rarely open a device from there, the sidebar links already prefetch, and a miss
  only delays the 3D view by one chunk download.
