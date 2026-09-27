import type { ReactNode } from "react";
import { devices, hasVerifiedInsets, REPO_URL, SITE_URL } from "../data/devices";
import { pageMeta } from "../lib/seo";
import type { Route } from "./+types/methodology";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "How I measure Android window insets | windowinsets.info",
    description:
      "How windowinsets.info captures Android inset data, records its sources and conditions, and explains measurement limits.",
    url: `${SITE_URL}/methodology`,
  });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-muted [&_b]:text-fg [&_code]:rounded [&_code]:bg-canvas [&_code]:px-1 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_a]:text-accent [&_a]:underline">
        {children}
      </div>
    </section>
  );
}

export default function Methodology() {
  const measured = devices.filter((d) => d.brand === "Samsung" && hasVerifiedInsets(d)).length;
  const emulated = devices.filter((d) => d.brand === "Google" && hasVerifiedInsets(d)).length;

  return (
    <article className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">How I measure</h1>
      <p className="mt-2 text-muted">
        This site is only useful if you can trust its numbers, so here is exactly where each
        one comes from and where it stops being reliable.
      </p>

      <p className="mt-4 rounded-[10px] border border-line bg-surface p-3 text-sm shadow-card">
        <b>Current status:</b> {measured} of {devices.length} devices have measured inset
        values from real hardware, and {emulated} Pixel devices have Android Emulator
        values. Everything else is shown as <i>pending</i>.
      </p>

      <Section title="1. Every value has a source tier">
        <ul>
          <li>
            <b>official</b> – published by Samsung or Google (for example resolution and
            pixel density on the Samsung Developer site).
          </li>
          <li>
            <b>measured</b> – captured by InsetsProbe on a real device or on Samsung Remote
            Test Lab. The raw JSON is committed to the repository and linked from the value.
          </li>
          <li>
            <b>emulator</b> – captured by the same InsetsProbe on the Android Emulator with the
            SDK's Pixel device profile and system image. These values show what the framework
            reports for that profile; they were not read from Pixel hardware. The raw JSON and a
            manifest with the emulator version, device profile and build fingerprint are
            committed next to each other.
          </li>
          <li>
            <b>community</b> – contributed by someone else and not yet reproduced. Shown with a
            clear label until a second capture confirms it.
          </li>
        </ul>
        <p>
          Each source also shows the date it was last checked, and each measurement records the
          One UI and Android version it was taken on. Emulator captures name the emulator
          version, device profile and system image build instead of a One UI version.
        </p>
      </Section>

      <Section title="2. Why insets must be measured">
        <p>
          Samsung publishes screen size, resolution and density, but not status bar height,
          navigation bar height, cutout geometry or corner radii. Those depend on the device
          and on the software running on it, so I read them from Android itself instead of
          estimating.
        </p>
      </Section>

      <Section title="3. What InsetsProbe reads">
        <p>
          <a href={`${REPO_URL}/tree/main/tools/insets-probe`}>InsetsProbe</a> is a small,
          open-source Android app in this repository. It records:
        </p>
        <ul>
          <li>
            <code>WindowInsets</code>: status bars, navigation bars, system bars, display
            cutout, caption bar, system gestures, mandatory system gestures, tappable element
            (px and dp, with and without visibility).
          </li>
          <li>
            <code>DisplayCutout</code>: safe insets, bounding rectangles, waterfall insets, and an OS cutout path when returned (probe 1.3.0+).
          </li>
          <li>
            <code>RoundedCorner</code> for all four corners.
          </li>
          <li>
            Foldables: <code>FoldingFeature</code> (state, orientation, occlusion, bounds) and
            the hinge angle sensor.
          </li>
          <li>
            Device, Android and One UI version, <code>densityDpi</code> next to the device's
            default density, font scale and navigation mode.
          </li>
        </ul>
        <p>
          It prints the raw values as JSON. I do not edit these files by hand. You can build
          the app yourself and reproduce any number.
        </p>
      </Section>

      <div id="camera-cutouts">
        <Section title="Camera cutouts: what can be measured">
          <p>
            Cover displays support the same Android cutout APIs when the probe is running on
            that display. The diagram shows the reported exclusion rectangle's width, height
            and distances to the captured window's four edges. These are app-layout measurements,
            not the physical diameter of a camera lens.
          </p>
          <p>
            For example, the verified Flip8 cover capture reports one 520 × 209 px rectangle
            at (428, 839) in a 948 × 1048 px window. Its edge distances are left 428, top 839,
            right 0 and bottom 0 px. Android groups that camera area into one rectangle;
            it does not identify each lens or the gap between lenses.
          </p>
          <p>
            <a href="https://developer.android.com/reference/android/view/DisplayCutout#getCutoutPath()">Android 12+ also exposes a cutout path</a>.
            Probe 1.3.0+ saves it when returned, with display coordinates and a 0.25 px
            polyline approximation tolerance. Published captures do not yet contain this path;
            detailed contour dimensions remain pending a new, verified capture. A returned
            path still describes the OS cutout and is not guaranteed to separate physical lenses.
          </p>
          <p>
            A missing path in an older JSON means it was not collected. A null path in a new
            capture means the API did not return one. Neither is evidence of a zero-size lens.
            Camera artwork is illustrative; I do not infer measured lens diameters or spacing
            from skin pixels. Browser safe-area values cannot provide the missing geometry.
          </p>
        </Section>
      </div>

      <Section title="4. Conditions a measurement is valid for">
        <ul>
          <li>
            A recorded display rotation, app in full screen (no split-screen or pop-up window).
            Each rotation is its own capture; InsetsProbe turns itself through portrait,
            landscape and reverse landscape.
          </li>
          <li>
            Default <b>Display size</b>, <b>Font size</b> and, on Samsung, default{" "}
            <b>Screen resolution</b>. Changing them changes pixels and density, so dp values
            change too. The capture records <code>densityDpi</code> and{" "}
            <code>defaultDensityDpi</code>, which makes a non-default setting visible.
          </li>
          <li>
            One navigation mode per capture (<b>gesture</b> or <b>3-button</b>), because bar
            heights and gesture insets differ between them.
          </li>
          <li>
            Foldables: cover and main screens are captured separately, and the hinge angle is
            recorded.
          </li>
        </ul>
        <p>
          dp is computed as <code>px ÷ (densityDpi ÷ 160)</code> and rounded to two decimals.
        </p>
      </Section>

      <Section title="5. What I never do">
        <ul>
          <li>Estimate or interpolate a value from another device or from resolution alone.</li>
          <li>Fill a value from a source that cannot be linked.</li>
          <li>Overwrite a measurement without keeping the earlier capture in the history.</li>
        </ul>
        <p>Anything I cannot verify stays visible as <i>pending</i>.</p>
      </Section>

      <Section title="6. Known limitations">
        <ul>
          <li>
            Values can change with a One UI update. That is why every measurement names its
            One UI and Android version.
          </li>
          <li>Each capture comes from a specific unit and firmware, recorded by model number.</li>
          <li>
            Rotations without their own capture show as not measured. Insets are never
            rotated from another orientation. Multi-window modes are not covered yet.
          </li>
          <li>
            Only tablets offer upside-down portrait. Galaxy phones and foldables leave 180°
            out of auto-rotation, so apps never see that orientation there.
          </li>
          <li>
            Pixel values come from emulator device profiles. A profile can reuse cutout or
            corner geometry across models, so it may differ from the shipping phone until a
            real-device capture confirms it.
          </li>
          <li>
            Apps can add their own padding or use different window flags, so a real app may
            see different insets than the raw platform values shown here.
          </li>
        </ul>
      </Section>

      <Section title="7. Found a mistake, or want to add a device?">
        <p>
          Open an <a href={`${REPO_URL}/issues`}>issue</a> or a pull request with your
          InsetsProbe JSON. A capture that reproduces (or contradicts) an existing one is just
          as valuable as a new device.
        </p>
      </Section>
    </article>
  );
}
