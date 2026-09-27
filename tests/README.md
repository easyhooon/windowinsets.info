# Visual regression coverage

`rendering.test.mjs` is the deterministic regression suite for evidence-backed
dimensions and fold geometry. Run it with:

```sh
node --test tests/rendering.test.mjs
```

`pnpm test:visual` runs the Chrome regression suite at
1440×900 and 390×844. It covers Fold8, Fold7 and Flip8 at 0°/90°/180°, dp/px and both
navigation modes where measured, real and reduced-motion hinge transitions,
auto-fit versus manual zoom, WebGL label copy, measured Fold display switching, and
the complete S25 Ultra navigation/unit/orientation matrix. Update approved images
intentionally with `pnpm test:visual --update-snapshots` after comparing the
result against the live safearea.info reference. Chrome must be installed on the
runner.

The automated set is the release floor. Every release that changes the device
canvas must also manually compare this wider matrix against safearea.info at the
same viewport:

| Form factor | Viewports | Navigation | Units | Required states |
| --- | --- | --- | --- | --- |
| Bar | 1440×900, 390×844 | 3-button, gesture | dp, px | portrait, landscape left/right |
| Fold | 1440×900, 390×844 | 3-button, gesture | dp, px | outer/closed, inner/90°, inner/open |
| Flip | 1440×900, 390×844 | 3-button, gesture | dp, px | cover preview/closed, main/90°, main/open |

For each state, check the Metrics values, distinct inset labels (equal symmetric
values share one ruler), cutout position,
corner labels, legend, controls, and fit-to-canvas result. During hinge motion,
also check for clipping, mirrored text, detached artwork, stale Metrics, and a
visible jump at 0° or 180°. Reduced-motion mode must reach the same endpoints.

Do not approve baseline screenshots that contain pending measurements as if they
were captured values. Preview-only artwork needs its own explicit baseline.

For release validation, build once and serve stable output in a separate terminal:

```sh
pnpm build
PORT=4175 node scripts/serve-test-build.mjs
# In another terminal:
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4175 pnpm test:visual
```

Do not rebuild while this run is using `build/client`. Production checks include
prerendered device selection, context-loss SVG fallback, one WebGL surface per
fold, all integer hinge angles, compact rulers and workspace breakpoints.
