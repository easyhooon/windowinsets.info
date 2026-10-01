import type { ReactNode } from "react";
import { CodeBlock } from "../components/CodeBlock";
import { insetRanges } from "../data/insetRanges.server";
import { insetsAnatomy } from "../data/insetsAnatomy.server";
import { AnatomyNumber, InsetsAnatomy } from "../components/InsetsAnatomy";
import { REPO_URL, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/developer-guide";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "How to use window insets in your app | windowinsets.info",
    description:
      "Reading and using window insets, display cutouts, and corner radii in Android apps. Code examples, official docs, and best practices.",
    url: `${SITE_URL}/developer-guide`,
  });
}

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-8 scroll-mt-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-muted [&_b]:text-fg [&_code:not(.hljs)]:rounded [&_code:not(.hljs)]:bg-canvas [&_code:not(.hljs)]:px-1.5 [&_code:not(.hljs)]:font-mono [&_code:not(.hljs)]:text-[13px] [&_code:not(.hljs)]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_a]:text-accent [&_a]:underline [&_h3]:mt-4 [&_h3]:font-medium [&_h3]:text-fg">
        {children}
      </div>
    </section>
  );
}

/** Runs at prerender: measured spread across Galaxy devices, from the cited raw captures. */
export function loader() {
  return { ranges: insetRanges(), anatomy: insetsAnatomy() };
}

export default function DeveloperGuide({ loaderData }: Route.ComponentProps) {
  return (
    <article className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">How to handle window insets in your app</h1>
      <p className="mt-2 text-muted">
        windowinsets.info shows you the insets on each device. This guide tells you what they
        mean and how to use them in code.
      </p>

      <Section title="What are window insets?">
        <p>
          Window insets describe how much screen space is reserved by the system and cannot be
          used by your app:
        </p>
        <div className="anatomy-layout">
        <ul>
          <li>
            {loaderData.anatomy && <AnatomyNumber n={1} />}<b>Status bar:</b> Clock, signal, battery at the top. Inset: <code>statusBars()</code>
          </li>
          <li>
            {loaderData.anatomy && <AnatomyNumber n={2} />}<b>Navigation bar:</b> Back, home, recent apps at the bottom (or side). Inset:{" "}
            <code>navigationBars()</code>
          </li>
          <li>
            {loaderData.anatomy && <AnatomyNumber n={3} />}<b>Display cutout:</b> Camera holes, notches, waterfalls. Inset:{" "}
            <code>displayCutout()</code>
          </li>
          <li>
            {loaderData.anatomy && <AnatomyNumber n={4} />}<b>System gestures:</b> Swipe areas at screen edges that trigger the system back or
            recents. Inset: <code>systemGestures()</code>
          </li>
          <li>
            {loaderData.anatomy && <AnatomyNumber n={5} />}<b>Corner radii:</b> How rounded the screen corners are. API:{" "}
            <code>Display.getRoundedCorner()</code>
          </li>
        </ul>
          {loaderData.anatomy && <InsetsAnatomy anatomy={loaderData.anatomy} />}
        </div>
      </Section>

      <Section title="Why you can't hardcode insets">
        <p>
          Measured Galaxy values differ by device, so a fixed status bar or navigation bar height
          will be wrong somewhere. Ranges below are portrait captures in dp, computed from this
          site's raw InsetsProbe captures at build time.
        </p>
        {loaderData.ranges.map(group => (
          <div key={group.label}>
            <p><b>{group.label}</b> ({group.ranges[0].count} devices)</p>
            <table className="inset-ranges">
              <tbody>
                {group.ranges.map(range => (
                  <tr key={range.label}>
                    <th scope="row">{range.label}</th>
                    <td>{range.min.value === range.max.value
                      ? <>{range.min.value} dp on every device</>
                      : <>{range.min.value} dp <span>({range.min.device})</span> – {range.max.value} dp <span>({range.max.device})</span></>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <p>
          The status bar varies most: a layout padded by a hardcoded value is either cut off or
          leaves a gap. Read the insets at runtime with <code>WindowInsets</code> (Compose) or{" "}
          <code>WindowInsetsCompat</code> (Views) as shown below. Flip and TriFold cover screens
          use different system UI and are not mixed into these ranges.
        </p>
      </Section>

      <Section id="jetpack-compose" title="Jetpack Compose">
        <p>
          Compose is Android's recommended UI toolkit, so its examples come first. If your app
          still uses XML layouts, the View-based equivalents follow below.
        </p>
        <p>
          In Compose,{" "}
          <a href="https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#(androidx.compose.foundation.layout.WindowInsets.Companion).safeDrawing()">
            WindowInsets.safeDrawing
          </a>{" "}
          is the union of <code>systemBars</code>, <code>displayCutout</code> and{" "}
          <code>ime</code>. With the keyboard hidden it equals the <b>Safe Area Insets</b> shown
          on each device page, so those values are what this padding resolves to on that model.
        </p>
        <h3>Opting in to edge-to-edge</h3>
        <p>
          Apps targeting Android 15 (API 35) are drawn edge-to-edge by default. Call{" "}
          <code>enableEdgeToEdge()</code> so older versions behave the same, then pad content
          yourself:
        </p>
        <CodeBlock title="Padding content by safeDrawing">{`class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
    setContent {
      Box(
        Modifier
          .fillMaxSize()
          .background(MaterialTheme.colorScheme.surface) // drawn behind the bars
          .windowInsetsPadding(WindowInsets.safeDrawing) // or .safeDrawingPadding()
      ) {
        Content()
      }
    }
  }
}`}</CodeBlock>

        <h3>With Material 3 Scaffold</h3>
        <p>
          <code>Scaffold</code> places its bars inside the insets and hands the remaining space
          to the content as <code>innerPadding</code>. Pass <code>contentWindowInsets</code>{" "}
          explicitly so the cutout is included in landscape:
        </p>
        <CodeBlock title="Scaffold with safeDrawing">{`Scaffold(
  topBar = { TopAppBar(title = { Text("Inbox") }) },
  floatingActionButton = { FloatingActionButton(onClick = {}) { Icon(Icons.Default.Add, null) } },
  contentWindowInsets = WindowInsets.safeDrawing,
) { innerPadding ->
  LazyColumn(
    modifier = Modifier.consumeWindowInsets(innerPadding),
    contentPadding = innerPadding, // list scrolls behind the bars, last item stays reachable
  ) {
    items(messages) { MessageRow(it) }
  }
}`}</CodeBlock>

        <h3>Picking the right inset type</h3>
        <ul>
          <li>
            <code>safeDrawing</code>: keep text and images from being covered by bars, the cutout
            or the keyboard.
          </li>
          <li>
            <code>safeGestures</code>: keep draggable controls out of the system gesture zones.
          </li>
          <li>
            <code>safeContent</code>: both of the above, for content that is visible and
            interactive.
          </li>
          <li>
            <code>displayCutout</code> alone: full-bleed media that only needs to avoid the
            camera.
          </li>
        </ul>

        <h3>Reading the values</h3>
        <CodeBlock title="Resolving safeDrawing to dp and px">{`val density = LocalDensity.current
val layoutDirection = LocalLayoutDirection.current
val safe = WindowInsets.safeDrawing

val topPx = safe.getTop(density)                       // Int, px
val padding = safe.asPaddingValues()                   // PaddingValues, dp
val startDp = padding.calculateStartPadding(layoutDirection)`}</CodeBlock>
      </Section>

      <Section id="views" title="Views: reading insets in your Activity or Fragment">
        <h3>With ViewCompat (Jetpack, recommended)</h3>
        <p>
          Use{" "}
          <a href="https://developer.android.com/reference/androidx/core/view/ViewCompat#setOnApplyWindowInsetsListener(android.view.View,androidx.core.view.OnApplyWindowInsetsListener)">
            ViewCompat.setOnApplyWindowInsetsListener
          </a>
          :
        </p>
        <CodeBlock title="Reading window insets">{`ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
  val statusBars = insets.getInsets(Type.statusBars())
  val navBars = insets.getInsets(Type.navigationBars())
  val cutout = insets.getInsets(Type.displayCutout())

  // Apply padding: view.setPadding(
  //   statusBars.left, statusBars.top,
  //   statusBars.right, navBars.bottom
  // )

  insets  // return unhandled insets to others
}`}</CodeBlock>

        <h3>Direct API access</h3>
        <p>
          On API 29+, use{" "}
          <a href="https://developer.android.com/reference/android/view/WindowInsets#getInsets(int)">
            WindowInsets.getInsets()
          </a>
          . On newer APIs (31+), also check <code>Display.getRoundedCorner()</code>.
        </p>
      </Section>

      <Section title="Views: safe areas for content">
        <p>
          <b>Safe area</b> = system bars + display cutout. Combine them to find where content is
          always visible and tappable:
        </p>
        <CodeBlock title="Calculating safe areas">{`val systemBars = insets.getInsets(Type.systemBars())
val cutout = insets.getInsets(Type.displayCutout())
val safe = Insets.of(
  max(systemBars.left, cutout.left),
  max(systemBars.top, cutout.top),
  max(systemBars.right, cutout.right),
  max(systemBars.bottom, cutout.bottom)
)`}</CodeBlock>
      </Section>

      <Section title="Foldables: detecting the hinge">
        <p>
          On foldable devices, use{" "}
          <a href="https://developer.android.com/reference/androidx/window/layout/FoldingFeature">
            FoldingFeature
          </a>{" "}
          to detect the hinge and adapt your layout. The hinge angle sensor (API 31+) gives
          real-time rotation:
        </p>
        <CodeBlock title="Detecting the hinge">{`val hinges = windowLayoutInfo.displayFeatures
  .filterIsInstance<FoldingFeature>()

hinges.forEach { hinge ->
  when (hinge.state) {
    FoldingFeature.State.FLAT -> /* opened flat */
    FoldingFeature.State.HALF_OPENED -> /* tent mode */
  }
  // hinge.bounds: pixel coordinates of the fold
}`}</CodeBlock>
      </Section>

      <Section title="Official documentation & resources">
        <ul>
          <li>
            <a href="https://developer.android.com/develop/ui/views/system-ui/window-insets">
              Android Developers: System gestures and window insets
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/reference/androidx/core/view/WindowInsetsCompat">
              WindowInsetsCompat (Jetpack Core)
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/reference/androidx/window/layout/FoldingFeature">
              FoldingFeature (Jetpack Window Manager)
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/reference/android/view/RoundedCorner">
              RoundedCorner API (Android 12+)
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/training/system-ui/edge-to-edge">
              Edge-to-edge and inset handling
            </a>
          </li>
          <li>
            <a href="https://developer.samsung.com/one-ui/largescreen-and-foldable/designing_for_foldable.html">
              Samsung: Designing for foldables
            </a>
          </li>
        </ul>
      </Section>

      <Section title="Common patterns">
        <h3>Keeping content off the cutout</h3>
        <p>
          Apply the <code>displayCutout()</code> inset as padding to your root view. Status bar
          is usually separate; combine both for full safety.
        </p>

        <h3>Full-screen video or images</h3>
        <p>
          Use <code>systemGestures()</code> to avoid covering the back swipe zones, but let
          content go behind cutouts if you want the full-screen look. Give users a way to peek
          at the status bar (swipe down).
        </p>

        <h3>Custom navigation UI</h3>
        <p>
          If you draw your own navigation bar instead of using the system one, account for both
          the navigation bar inset and system gesture zones.
        </p>
      </Section>

      <Section title="Using windowinsets.info in your code">
        <p>
          This site's <b>measured</b> values (from real devices or Samsung RTL) show what Android
          actually returns on that model and OS version. Use them to:
        </p>
        <ul>
          <li>
            <b>Test layouts locally:</b> Hardcode or mock the inset values from here in your
            emulator/device tests.
          </li>
          <li>
            <b>Debug device-specific issues:</b> If your app behaves differently on a Galaxy
            S25+ vs another device, check the inset values here.
          </li>
          <li>
            <b>Document assumptions:</b> Link to the inset data when filing bugs or PRs, so your
            team knows which device/OS you measured on.
          </li>
        </ul>
        <p>
          All values are linked to their source (official specs, raw probe JSON, or community
          reports), so you can always trace where a number came from.
        </p>
        <h3>Sharing a specific view</h3>
        <p>
          A device page's URL follows its controls, so you can paste it into an issue or PR
          as-is. For example,{" "}
          <code>/galaxy-z-fold7?nav=gesture&amp;rotate=90&amp;hinge=180&amp;unit=px</code> opens the
          inner display in gesture navigation, turned clockwise, in pixels. Supported keys
          are <code>nav</code> (<code>gesture</code>, <code>3-button</code>),{" "}
          <code>rotate</code> (clockwise degrees), <code>hinge</code> (0–180, foldables),{" "}
          <code>unit</code> (<code>dp</code>, <code>px</code>) and <code>app</code>{" "}
          (<code>ignored</code>, <code>applied</code>). Defaults are left out of the URL.
        </p>
        <h3>Exporting a complete device</h3>
        <p>
          Choose <b>Export JSON</b> at the top of a device's Metrics panel to download every
          registered screen and both Android navigation modes. The versioned export keeps raw
          dp and px separate, labels safe-area calculations as derived, includes capture
          conditions and sources, and leaves unmeasured values explicitly pending.
          Each measurement also splits <code>systemBars</code> into <code>statusBars</code> and{" "}
          <code>navigationBars</code>, and adds <code>systemGestures</code>,{" "}
          <code>mandatorySystemGestures</code> and <code>tappableElement</code>, all read from the
          raw InsetsProbe capture it cites (<code>null</code> when that capture cannot be resolved).
        </p>
        <p>
          Choose <b>JSON link</b> to open a shareable URL. Scripts can fetch the same data at{" "}
          <code>https://windowinsets.info/data/&lt;device-slug&gt;.json</code>.
        </p>
        <p>
          To discover devices, fetch <code>https://windowinsets.info/data/index.json</code>. It
          lists every public device with its measurement status (<code>complete</code>,{" "}
          <code>partial</code> or <code>pending</code>), the navigation modes and rotations
          captured per screen, and the URL of its full export.
        </p>
      </Section>

      <Section title="Found an issue or want to contribute?">
        <p>
          Open an{" "}
          <a href={`${REPO_URL}/issues`}>
            issue or pull request on GitHub
          </a>
          . If you have a device and want to add insets data, use{" "}
          <a href={`${REPO_URL}/tree/main/tools/insets-probe`}>InsetsProbe</a> and share your
          JSON.
        </p>
      </Section>
    </article>
  );
}
