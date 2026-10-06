import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { CodeBlock } from "../components/CodeBlock";
import { FoldStateVideo } from "../components/FoldStateVideo";
import { insetRanges } from "../data/insetRanges.server";
import { insetsAnatomy } from "../data/insetsAnatomy.server";
import { AnatomyNumber, InsetsAnatomy } from "../components/InsetsAnatomy";
import { REPO_URL, SITE_URL } from "../data/site";
import { GUIDE_PAGES, guidePath, MOVED_GUIDE_ANCHORS } from "../data/guidePages";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/developer-guide";

const findPage = (topic: string | undefined) => GUIDE_PAGES.find(page => page.slug === (topic ?? ""));

export function meta({ params }: Route.MetaArgs) {
  const page = findPage(params.topic) ?? GUIDE_PAGES[0];
  return pageMeta({
    title: `${page.title} | windowinsets.info`,
    description: page.description,
    url: `${SITE_URL}${guidePath(page.slug)}`,
  });
}

function Section({ id, title, children }: { id?: string; title?: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-8 scroll-mt-4">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className={`${title ? "mt-2" : "mt-6"} space-y-3 text-[15px] leading-relaxed text-muted [&_b]:text-fg [&_code:not(.hljs)]:rounded [&_code:not(.hljs)]:bg-canvas [&_code:not(.hljs)]:px-1.5 [&_code:not(.hljs)]:font-mono [&_code:not(.hljs)]:text-[13px] [&_code:not(.hljs)]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_a]:text-accent [&_a]:underline [&_h3]:mt-4 [&_h3]:font-medium [&_h3]:text-fg`}>
        {children}
      </div>
    </section>
  );
}

/** Runs at prerender: measured spread across Galaxy devices, from the cited raw captures. */
export function loader({ params }: Route.LoaderArgs) {
  const page = findPage(params.topic);
  if (!page) throw new Response("Not Found", { status: 404 });
  return page.slug === "" ? { ranges: insetRanges(), anatomy: insetsAnatomy() } : { ranges: [], anatomy: null };
}


type LoaderData = Route.ComponentProps["loaderData"];

const CONTENT: Record<string, (props: { loaderData: LoaderData }) => ReactNode> = {
  "": ({ loaderData }) => (
    <>
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
          <code>WindowInsetsCompat</code> (Views) as shown in the{" "}
          <Link to="/developer-guide/code">Compose and Views guide</Link>. Flip and TriFold cover screens
          use different system UI and are not mixed into these ranges.
        </p>
      </Section>

      <Section id="gestures-vs-tappable" title="Gesture zones vs. tappable elements">
        <p>
          A device page's <b>Gesture Zones</b> and <b>Tappable</b> layers answer different
          questions, so they can look alike in one navigation mode and diverge in the other:
        </p>
        <ul>
          <li>
            <code>systemGestures()</code> (Gesture Zones): where the system may take a swipe
            for back, home or the notification shade. Keep drag handles, sliders and swipeable
            rows out of it.
          </li>
          <li>
            <code>mandatorySystemGestures()</code>: the part of those zones apps can never
            reclaim with <code>setSystemGestureExclusionRects()</code>, such as the home swipe at
            the bottom.
          </li>
          <li>
            <code>tappableElement()</code> (Tappable): where visible system controls receive
            taps. Keep buttons and other tap targets out of it.
          </li>
        </ul>
        <p>
          <b>Gesture navigation:</b> the two differ on almost every captured device.
          Gesture zones add back-swipe strips on the left and right edges and a band at the
          bottom, while the tappable inset is zero on the sides and at the bottom (unless a
          taskbar is shown). A button may sit in the bottom gesture band, but a horizontal
          slider there competes with the home gesture.
        </p>
        <p>
          <b>3-button navigation:</b> the sides have no back swipe, so both insets usually
          equal the status bar and the navigation bar. Many Galaxy devices still report a
          gesture zone at the top that extends past the status bar, where a swipe opens the
          notification shade.
        </p>
      </Section>
    </>
  ),
  code: () => (
    <>
      <Section id="jetpack-compose" title="Jetpack Compose">
        <p>
          Compose is Android's recommended UI toolkit, so its examples come first. If your app
          still uses XML layouts, the View-based equivalents follow below.
        </p>
        <p>
          In Compose,{" "}
          <a href="https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary#(androidx.compose.foundation.layout.WindowInsets.Companion).safeDrawing()" target="_blank" rel="noreferrer">
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
          <a href="https://developer.android.com/reference/androidx/core/view/ViewCompat#setOnApplyWindowInsetsListener(android.view.View,androidx.core.view.OnApplyWindowInsetsListener)" target="_blank" rel="noreferrer">
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
          <a href="https://developer.android.com/reference/android/view/WindowInsets#getInsets(int)" target="_blank" rel="noreferrer">
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
    </>
  ),
  foldables: () => (
    <>
      <Section title="How Android reports a fold">
        <p>
          A Galaxy Z Fold or Flip reports its hinge as a{" "}
          <a href="https://developer.android.com/reference/androidx/window/layout/FoldingFeature" target="_blank" rel="noreferrer">
            FoldingFeature
          </a>
          , one of the display features in{" "}
          <a href="https://developer.android.com/reference/androidx/window/layout/WindowLayoutInfo" target="_blank" rel="noreferrer">
            WindowLayoutInfo
          </a>{" "}
          from Jetpack WindowManager. It is not a window inset: the fold never changes{" "}
          <code>systemBars</code> or <code>displayCutout</code>, so pad for insets and lay out
          around the fold separately. Each feature has:
        </p>
        <ul>
          <li>
            <code>state</code>: <code>FLAT</code> (fully open) or <code>HALF_OPENED</code>{" "}
            (partly folded).
          </li>
          <li>
            <code>orientation</code>: <code>VERTICAL</code> for a book fold such as Galaxy Z Fold,{" "}
            <code>HORIZONTAL</code> for a clamshell such as Galaxy Z Flip.
          </li>
          <li>
            <code>isSeparating</code>: whether the fold splits the window into two logical areas.
            It is always <code>true</code> while <code>HALF_OPENED</code>.
          </li>
          <li>
            <code>occlusionType</code>: <code>NONE</code> or <code>FULL</code>, whether the fold
            hides part of the display.
          </li>
          <li>
            <code>bounds</code>: the fold's rectangle in window coordinates (px).
          </li>
        </ul>
        <p>
          A closed device reports no folding feature. The app then runs on the cover display,
          which is a separate screen with its own insets. On this site, choose <b>Cover</b> or{" "}
          <b>Main</b> on a foldable's page to see each one.
        </p>
        <p>
          The recordings below show what each posture reports as the hinge moves through
          0°, the partly open range and 180°:
        </p>
        <div className="fold-state-grid">
          <FoldStateVideo src="/media/guide/galaxy-z-fold8-hinge.mp4" name="Galaxy Z Fold8" orientation="VERTICAL" />
          <FoldStateVideo src="/media/guide/galaxy-z-flip8-hinge.mp4" name="Galaxy Z Flip8" orientation="HORIZONTAL" />
        </div>
        <p className="text-[13px]">
          Recorded from this site's 3D renderer with the measured cover and inner displays.
          The angle where the animation turns from the cover to the inner display is
          illustrative; real devices switch displays at their own angle.
        </p>
      </Section>

      <Section title="Jetpack Compose">
        <p>
          <a href="https://developer.android.com/reference/kotlin/androidx/compose/material3/adaptive/package-summary" target="_blank" rel="noreferrer">
            Compose Material 3 Adaptive
          </a>{" "}
          (<code>androidx.compose.material3.adaptive:adaptive</code>) provides{" "}
          <code>collectFoldingFeaturesAsState()</code>, which recomposes whenever the fold
          changes. The posture checks below follow Android's{" "}
          <a href="https://developer.android.com/develop/ui/compose/layouts/adaptive/foldables/make-your-app-fold-aware" target="_blank" rel="noreferrer">
            Make your app fold aware
          </a>{" "}
          guide.
        </p>
        <CodeBlock title="Tabletop and book postures">{`@Composable
fun FoldAwareScreen() {
  val foldingFeatures by collectFoldingFeaturesAsState()
  val fold = foldingFeatures.firstOrNull()

  val isTabletop = fold?.state == FoldingFeature.State.HALF_OPENED &&
    fold.orientation == FoldingFeature.Orientation.HORIZONTAL
  val isBook = fold?.state == FoldingFeature.State.HALF_OPENED &&
    fold.orientation == FoldingFeature.Orientation.VERTICAL

  when {
    isTabletop -> TabletopLayout(foldBounds = fold!!.bounds) // content above, controls below
    isBook -> TwoPaneLayout(foldBounds = fold!!.bounds)      // one pane on each side
    else -> SinglePaneLayout()
  }
}`}</CodeBlock>
        <p>
          If you only need the posture, <code>currentWindowAdaptiveInfoV2().windowPosture</code>{" "}
          exposes it directly, for example <code>windowPosture.isTabletop</code>.
        </p>
      </Section>

      <Section title="Views">
        <p>
          With Views, collect{" "}
          <a href="https://developer.android.com/reference/androidx/window/layout/WindowInfoTracker" target="_blank" rel="noreferrer">
            WindowInfoTracker
          </a>{" "}
          (<code>androidx.window:window</code>) while the activity is started:
        </p>
        <CodeBlock title="Observing the fold in an Activity">{`override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
      WindowInfoTracker.getOrCreate(this@MainActivity)
        .windowLayoutInfo(this@MainActivity)
        .collect { layoutInfo ->
          val fold = layoutInfo.displayFeatures
            .filterIsInstance<FoldingFeature>()
            .firstOrNull()
          updateLayoutForFold(fold) // null when flat without a fold or closed
        }
    }
  }
}`}</CodeBlock>
      </Section>

      <Section title="Hinge angle">
        <p>
          <code>FoldingFeature</code> does not expose the angle. If you need it, read{" "}
          <a href="https://developer.android.com/reference/android/hardware/Sensor#TYPE_HINGE_ANGLE" target="_blank" rel="noreferrer">
            Sensor.TYPE_HINGE_ANGLE
          </a>{" "}
          (API 30+) through <code>SensorManager</code>. Reporting ranges and accuracy vary by
          device, so prefer <code>state</code> and <code>orientation</code> for layout
          decisions. The hinge slider on this site's foldable pages is a visualization; the
          measured insets come from captures of the open and closed displays.
        </p>
        <p>
          For design guidance on cover and inner screens, see Samsung's{" "}
          <a href="https://developer.samsung.com/one-ui/largescreen-and-foldable/designing_for_foldable.html" target="_blank" rel="noreferrer">
            Designing for foldables
          </a>
          , and for app-level patterns, Android's{" "}
          <a href="https://developer.android.com/develop/ui/compose/layouts/adaptive/foldables/learn-about-foldables" target="_blank" rel="noreferrer">
            Learn about foldables
          </a>
          .
        </p>
      </Section>
    </>
  ),
  patterns: () => (
    <>
      <Section title="Edge to edge is the default">
        <p>
          Apps that target Android 15 (SDK 35) draw edge to edge by default, and on Android 15
          devices <code>LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS</code> is the only cutout mode for
          non-floating windows. Content can therefore sit under every bar and cutout, so each
          pattern below decides which inset to respect. Start with Android's{" "}
          <a href="https://developer.android.com/develop/ui/compose/system/setup-e2e" target="_blank" rel="noreferrer">edge-to-edge setup for Compose</a>{" "}
          or the{" "}
          <a href="https://developer.android.com/develop/ui/views/layout/edge-to-edge" target="_blank" rel="noreferrer">Views edge-to-edge guide</a>.
        </p>
      </Section>

      <Section title="Keeping content off the cutout">
        <p>
          Let backgrounds and images fill the screen, and pad text and controls with{" "}
          <code>WindowInsets.safeDrawing</code>, which covers the status bar, navigation bar and
          cutout together. Use <code>displayCutout</code> alone only when the bars are handled
          elsewhere. Don't hardcode a status bar height: in landscape the cutout moves to a
          side edge, which a device page shows when you rotate it. See{" "}
          <a href="https://developer.android.com/develop/ui/compose/system/cutouts" target="_blank" rel="noreferrer">Display cutouts in Compose</a>{" "}
          and{" "}
          <a href="https://developer.android.com/develop/ui/views/layout/display-cutout" target="_blank" rel="noreferrer">Support display cutouts</a>{" "}
          for Views.
        </p>
      </Section>

      <Section title="Lists and bottom bars">
        <p>
          A list should scroll behind the navigation bar while its first and last items stay
          reachable. Pass the insets as content padding instead of padding the list itself.
          Material components such as <code>TopAppBar</code> and <code>NavigationBar</code>{" "}
          apply their own insets, and <code>Scaffold</code> hands the rest to your content (see{" "}
          <a href="https://developer.android.com/develop/ui/compose/system/material-insets" target="_blank" rel="noreferrer">Material insets in Compose</a>
          ):
        </p>
        <CodeBlock title="List content padding inside Scaffold">{`Scaffold { innerPadding ->
  LazyColumn(
    // Scaffold does not consume the insets it passes down.
    modifier = Modifier.consumeWindowInsets(innerPadding),
    contentPadding = innerPadding,
  ) {
    // Items scroll behind the bars; the first and last stay clear of them.
  }
}`}</CodeBlock>
        <p>
          In Views, apply the bottom inset as the RecyclerView's padding and set{" "}
          <code>clipToPadding="false"</code> for the same effect.
        </p>
      </Section>

      <Section title="Full-screen video or images">
        <p>
          Hide the system bars with{" "}
          <a href="https://developer.android.com/reference/androidx/core/view/WindowInsetsControllerCompat" target="_blank" rel="noreferrer">
            WindowInsetsControllerCompat
          </a>{" "}
          and let users swipe them back temporarily, as described in{" "}
          <a href="https://developer.android.com/develop/ui/views/layout/immersive" target="_blank" rel="noreferrer">Hide system bars for immersive mode</a>
          :
        </p>
        <CodeBlock title="Immersive mode">{`val controller = WindowCompat.getInsetsController(window, window.decorView)
controller.systemBarsBehavior =
  WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
controller.hide(WindowInsetsCompat.Type.systemBars())`}</CodeBlock>
        <p>
          Hidden bars report zero insets, but the cutout and gesture zones remain. Keep playback
          controls inside <code>displayCutout</code> and out of the side gesture zones.
        </p>
      </Section>

      <Section title="Swipes near the screen edge">
        <p>
          In gesture navigation, a swipe from the left or right edge goes back. A seek bar,
          carousel or drawing canvas that starts at the edge competes with it. Move it inside
          the <code>systemGestures</code> inset, or opt a small area out with{" "}
          <code>Modifier.systemGestureExclusion()</code> in{" "}
          <a href="https://developer.android.com/reference/kotlin/androidx/compose/foundation/package-summary" target="_blank" rel="noreferrer">Compose Foundation</a>{" "}
          or{" "}
          <a href="https://developer.android.com/reference/android/view/View#setSystemGestureExclusionRects(java.util.List%3Candroid.graphics.Rect%3E)" target="_blank" rel="noreferrer">
            View.setSystemGestureExclusionRects()
          </a>
          . The system limits how much of an edge can be excluded, and{" "}
          <code>mandatorySystemGestures</code>, such as the home swipe, can never be excluded. See{" "}
          <a href="https://developer.android.com/develop/ui/views/touch-and-input/gestures/gesturenav" target="_blank" rel="noreferrer">Gesture navigation</a>{" "}
          and{" "}
          <Link to="/developer-guide#gestures-vs-tappable">Gesture zones vs. tappable elements</Link>.
        </p>
      </Section>

      <Section title="Custom bottom controls">
        <p>
          If you draw your own bottom bar or floating controls, keep tap targets above the{" "}
          <code>tappableElement</code> inset and drag handles out of <code>systemGestures</code>.
          The bottom navigation inset is small in gesture mode and much taller with 3-button
          navigation, so check both modes on a device page before shipping a fixed height.
        </p>
      </Section>

      <Section title="The keyboard">
        <p>
          The on-screen keyboard is an inset too. Add <code>Modifier.imePadding()</code> to the
          screen or field container so text inputs stay visible, as shown in{" "}
          <a href="https://developer.android.com/develop/ui/compose/system/keyboard-animations" target="_blank" rel="noreferrer">Keyboard animations in Compose</a>
          . <code>safeDrawing</code> already includes the IME, so a container padded with it
          needs no extra padding.
        </p>
      </Section>

      <Section id="webview" title="WebViews">
        <p>
          A full-screen <code>WebView</code> is edge to edge too, and Android 16 removes the
          opt-out. How to handle it depends on whether your app owns the web content, as
          described in Android Developers'{" "}
          <a href="https://medium.com/androiddevelopers/make-webviews-edge-to-edge-a6ef319adfac" target="_blank" rel="noreferrer">Make WebViews edge-to-edge</a>
          .
        </p>
        <h3>Content you don't own</h3>
        <p>
          Pad the WebView's container instead of the page: in Compose, apply{" "}
          <code>Modifier.windowInsetsPadding(WindowInsets.safeDrawing)</code> to the{" "}
          <code>AndroidView</code>; in Views, wrap it in a <code>FrameLayout</code> and pad that
          for <code>systemBars</code>, <code>displayCutout</code> and <code>ime</code>. Set the
          window background close to the page's so the padded strips don't stand out.
        </p>
        <h3>Content you own</h3>
        <p>
          Let the page draw edge to edge and pad it in CSS. Add{" "}
          <code>viewport-fit=cover</code> to the viewport meta tag. Android WebView may report{" "}
          <code>env(safe-area-inset-*)</code> as <code>0px</code>, so pass the insets in from
          the app as CSS variables, converted from px to dp (one dp is one CSS px at{" "}
          <code>initial-scale=1</code>):
        </p>
        <CodeBlock title="Injecting safe-area insets into the page">{`ViewCompat.setOnApplyWindowInsetsListener(webView) { view, insets ->
  val safe = insets.getInsets(Type.systemBars() or Type.displayCutout() or Type.ime())
  val metrics = view.resources.displayMetrics
  fun dp(px: Int) = TypedValueCompat.pxToDp(px.toFloat(), metrics)
  webView.evaluateJavascript(
    """
    const s = document.documentElement.style;
    s.setProperty('--safe-area-inset-top', '${"${dp(safe.top)}"}px');
    s.setProperty('--safe-area-inset-right', '${"${dp(safe.right)}"}px');
    s.setProperty('--safe-area-inset-bottom', '${"${dp(safe.bottom)}"}px');
    s.setProperty('--safe-area-inset-left', '${"${dp(safe.left)}"}px');
    """, null)
  insets
}
webView.webViewClient = object : WebViewClient() {
  override fun onPageFinished(view: WebView, url: String) {
    view.requestApplyInsets() // re-send insets to the loaded page
  }
}`}</CodeBlock>
        <CodeBlock title="Using the variables in the page" language="xml">{`<meta name="viewport" content="viewport-fit=cover, initial-scale=1">
<style>
  body {
    padding: var(--safe-area-inset-top) var(--safe-area-inset-right)
             var(--safe-area-inset-bottom) var(--safe-area-inset-left);
  }
</style>`}</CodeBlock>
        <p>
          Keep <code>ime()</code> in the mask: without it, a text field focused near the bottom
          stays behind the keyboard and the page cannot scroll it into view. In Compose, read{" "}
          <code>WindowInsets.safeDrawing</code> and inject the values from the{" "}
          <code>AndroidView</code> <code>update</code> block so they follow the keyboard.
          With the keyboard hidden, the values match the <b>Safe Area Insets</b> on each
          device page.
        </p>
      </Section>
    </>
  ),
  data: () => (
    <>
      <Section>
        <p>
          This site's <b>measured</b> values (from real devices or Samsung RTL) show what Android
          actually returns on that model and OS version. Use them to:
        </p>
        <ul>
          <li>
            <b>Test layouts locally:</b> Each device's Metrics panel has a collapsed{" "}
            <b>Test fixture</b> block: a <code>WindowInsetsCompat</code> with the capture's exact px for every inset
            type, ready to dispatch to the view under test in Robolectric, Paparazzi or Roborazzi.
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
          Choose <b>Markdown</b> to open the same values as a readable reference at{" "}
          <code>https://windowinsets.info/&lt;device-slug&gt;.md</code>: one table per screen,
          rotation and navigation mode, with the raw capture behind each. It is convenient to
          paste into an issue or give to an AI assistant.
        </p>
        <p>
          Choose <b>JSON</b> to open a shareable URL. Scripts can fetch the same data at{" "}
          <code>https://windowinsets.info/data/&lt;device-slug&gt;.json</code>.
        </p>
        <p>
          To discover devices, fetch <code>https://windowinsets.info/data/index.json</code>. It
          lists every public device with its measurement status (<code>complete</code>,{" "}
          <code>partial</code> or <code>pending</code>), the navigation modes and rotations
          captured per screen, and the URL of its full export. For bulk use,{" "}
          <code>https://windowinsets.info/data/all.json</code> holds every device export in one
          file.
        </p>
        <h3>From the command line</h3>
        <p>
          The{" "}
          <a href="https://www.npmjs.com/package/windowinsets-info" target="_blank" rel="noreferrer">
            <code>windowinsets-info</code>
          </a>{" "}
          CLI reads the same data with no install (Node.js 18.3 or later):
        </p>
        <ul>
          <li>
            <code>npx windowinsets-info get s26-ultra --nav gesture</code> prints a device's
            insets per screen. Add <code>--unit px</code>, <code>--screen cover</code> or{" "}
            <code>--json</code> as needed.
          </li>
          <li>
            <code>npx windowinsets-info list --series fold</code> lists devices and their
            measurement status.
          </li>
          <li>
            <code>npx windowinsets-info fixtures --series fold &gt; insets.json</code> writes every
            measured screen and navigation mode as compact JSON for screenshot and layout tests.
          </li>
        </ul>
        <p>
          Unmeasured modes print "not measured yet" and are left out of fixtures; nothing is
          estimated. AI tools can start from <a href="/llms.txt" target="_blank" rel="noreferrer">/llms.txt</a>.
        </p>
      </Section>
    </>
  ),
  references: () => (
    <>
      <Section>
        <ul>
          <li>
            <a href="https://developer.android.com/develop/ui/views/system-ui/window-insets" target="_blank" rel="noreferrer">
              Android Developers: System gestures and window insets
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/reference/androidx/core/view/WindowInsetsCompat" target="_blank" rel="noreferrer">
              WindowInsetsCompat (Jetpack Core)
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/reference/androidx/window/layout/FoldingFeature" target="_blank" rel="noreferrer">
              FoldingFeature (Jetpack Window Manager)
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/reference/android/view/RoundedCorner" target="_blank" rel="noreferrer">
              RoundedCorner API (Android 12+)
            </a>
          </li>
          <li>
            <a href="https://developer.android.com/training/system-ui/edge-to-edge" target="_blank" rel="noreferrer">
              Edge-to-edge and inset handling
            </a>
          </li>
          <li>
            <a href="https://developer.samsung.com/one-ui/largescreen-and-foldable/designing_for_foldable.html" target="_blank" rel="noreferrer">
              Samsung: Designing for foldables
            </a>
          </li>
          <li>
            <a href="https://medium.com/androiddevelopers/make-webviews-edge-to-edge-a6ef319adfac" target="_blank" rel="noreferrer">
              Android Developers blog: Make WebViews edge-to-edge
            </a>
          </li>
        </ul>
      </Section>
    </>
  ),
};

export default function DeveloperGuide({ loaderData, params }: Route.ComponentProps) {
  const index = GUIDE_PAGES.findIndex(page => page.slug === (params.topic ?? ""));
  const page = GUIDE_PAGES[index];
  const Content = CONTENT[page.slug];
  const previous = GUIDE_PAGES[index - 1];
  const next = GUIDE_PAGES[index + 1];
  const location = useLocation();
  const navigate = useNavigate();

  // Links to the former single-page guide used anchors for sections that now have their own page.
  useEffect(() => {
    const moved = page.slug === "" ? MOVED_GUIDE_ANCHORS[location.hash.slice(1)] : undefined;
    if (moved !== undefined) navigate(`${guidePath(moved)}${location.hash}`, { replace: true });
  }, [page.slug, location.hash, navigate]);

  return (
    <article className="mx-auto max-w-2xl p-4 md:p-8">
      <p className="text-sm font-medium text-muted">Developer guide</p>
      <h1 className="mt-1 text-2xl font-semibold">{page.title}</h1>
      <nav aria-label="Developer guide pages" className="guide-nav">
        {GUIDE_PAGES.map(item => (
          <Link key={item.slug} to={guidePath(item.slug)} aria-current={item.slug === page.slug ? "page" : undefined}>
            {item.nav}
          </Link>
        ))}
      </nav>
      {page.slug === "" && (
        <p className="mt-4 text-muted">
          windowinsets.info shows you the insets on each device. This guide tells you what they
          mean and how to use them in code.
        </p>
      )}

      <Content loaderData={loaderData} />

      <nav aria-label="Previous and next guide pages" className="guide-pager">
        {previous ? <Link to={guidePath(previous.slug)} rel="prev"><span>Previous</span>{previous.title}</Link> : <span />}
        {next && <Link to={guidePath(next.slug)} rel="next"><span>Next</span>{next.title}</Link>}
      </nav>

      <Section title="Found an issue or want to contribute?">
        <p>
          Open an{" "}
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
            issue or pull request on GitHub
          </a>
          . If you have a device and want to add insets data, use{" "}
          <a href={`${REPO_URL}/tree/main/tools/insets-probe`} target="_blank" rel="noreferrer">InsetsProbe</a> and share your
          JSON.
        </p>
      </Section>
    </article>
  );
}
