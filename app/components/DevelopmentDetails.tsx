import { CodeBlock } from "./LazyCodeBlock";
import {
  adbCommands, avdProfile, extendedWidthClass, foldingFeatureLabel, heightClass, previewSnippet, ROTATION_NAMES, sizeClassRows, widthClass,
  type DevCapture, type FoldingFeatureCapture,
} from "../data/devTools";
import type { Device, InsetsMeasurement } from "../data/types";

const SAMSUNG_SKINS_URL = "https://developer.samsung.com/galaxy-emulator-skin";
const RAW_PATH = /\/blob\/main\/(measurements\/.+\.json)$/;

function Label({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-subtle first:mt-0">{children}</h3>;
}

const fmtDp = (v: number) => String(Number(v.toFixed(2)));
const sizeClass = (window: DevCapture["windowDp"]) => {
  const extended = extendedWidthClass(window.width);
  return `${widthClass(window.width)}${extended ? ` (${extended})` : ""} / ${heightClass(window.height)}`;
};
const posture = (features: FoldingFeatureCapture[], hingeAngle: number | null) => features.length === 0 ? null
  : `${features.map(foldingFeatureLabel).join("; ")}${hingeAngle !== null ? ` · hinge sensor ${hingeAngle}°` : ""}`;

function download(fileName: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/xml" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: fileName });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Compose Preview spec, WindowSizeClass and emulator profile for the current capture. */
export function DevelopmentDetails({ device, captures, measurement }: {
  device: Device; captures: DevCapture[]; measurement: InsetsMeasurement | null;
}) {
  if (captures.length === 0) return null;
  const path = measurement?.sources.map(source => source.url?.match(RAW_PATH)?.[1]).find(p => p && captures.some(c => c.path === p));
  const capture = captures.find(c => c.path === path) ?? null;
  const rows = sizeClassRows(device, captures);
  const foldable = device.formFactor !== "bar" && device.formFactor !== "tablet";
  const halfOpenedCaptured = captures.some(c => c.foldingFeatures.some(f => f.state === "HALF_OPENED"));
  const profile = capture && device.brand === "Samsung" ? avdProfile(device, capture) : null;
  const emulatorProfile = measurement?.condition.emulator?.deviceProfile;

  return <details className="sources-details dev-details"><summary>Use in development <span className="details-hint">Preview spec, size class, AVD, adb</span></summary>
    <Label>Compose Preview</Label>
    {capture ? <>
      <CodeBlock title="Compose · @Preview">{previewSnippet(device, capture)}</CodeBlock>
      <p className="text-muted">
        Size and density match this capture exactly. Compose Preview draws its own generic system bars
        and cutout, not {device.brand === "Samsung" ? "One UI's" : "the device's"}: check layouts against the measured insets above.
      </p>
    </> : <p className="text-muted">No capture for this selection, so no Preview spec is offered.</p>}

    <Label>Window Size Class</Label>
    <dl>
      <div className="metric-row"><dt>Window</dt><dd>{capture ? `${fmtDp(capture.windowDp.width)} × ${fmtDp(capture.windowDp.height)} dp` : <span className="text-subtle">not measured yet</span>}</dd></div>
      <div className="metric-row"><dt>Width / Height</dt><dd>{capture ? sizeClass(capture.windowDp) : <span className="text-subtle">not measured yet</span>}</dd></div>
      {foldable && capture?.screen === "main" && <div className="metric-row"><dt>FoldingFeature</dt><dd>{capture.foldingFeatures.length ? capture.foldingFeatures.map(f => f.state).join(", ") : "none reported"}</dd></div>}
    </dl>
    <ul className="size-class-list" aria-label="Window size class per capture">{rows.map(row => {
      const fold = posture(row.foldingFeatures, row.hingeAngle);
      return <li key={`${row.screen}${row.rotation}${fold}`}>
        <div><span>{device.screens.length > 1 ? `${row.screen === "cover" ? "Cover" : "Main"} · ` : ""}{ROTATION_NAMES[row.rotation]}</span>
          <strong>{row.windowDp ? sizeClass(row.windowDp) : <span className="text-subtle">not measured yet</span>}</strong></div>
        {row.windowDp && <small>{fmtDp(row.windowDp.width)} × {fmtDp(row.windowDp.height)} dp</small>}
        {fold && <small>{fold}</small>}
      </li>;
    })}</ul>
    <p className="text-muted">
      From WindowMetrics' maximum window in each capture (breakpoints: width 600 / 840 dp, height 480 / 900 dp;
      Large ≥ 1200 dp). Rotations without a capture are never derived by swapping width and height.
      {foldable && !halfOpenedCaptured && " HALF_OPENED (tabletop and book postures) is not measured yet: Remote Test Lab devices cannot be folded."}
      {foldable && halfOpenedCaptured && " FoldingFeature states are shown as WindowManager reported them in each capture."}
    </p>

    <Label>Emulator</Label>
    {device.brand === "Google"
      ? <p className="text-muted">{emulatorProfile ? <>Built into Android Studio as the <code>{emulatorProfile}</code> device profile.</> : "Use Android Studio's built-in Pixel device profile."}</p>
      : profile?.ok ? <>
        <button type="button" className="toolbar-button dev-download" onClick={() => download(profile.fileName, profile.xml)}>Download AVD hardware profile</button>
        <p className="text-muted">
          Screen from this capture and the official diagonal; other hardware entries are emulator defaults.
          Import in Device Manager › Create Virtual Device › Import Hardware Profiles.
          {foldable && " Android Studio profiles describe a single screen; each display gets its own profile."}
        </p>
      </> : <p className="text-muted">{profile?.reason ?? "No capture for this selection."}</p>}
    {capture && <>
      <CodeBlock title="Emulator · adb" language="bash">{adbCommands(device, capture)}</CodeBlock>
      <p className="text-muted">
        Runs your app at this capture's window size and density in the selected navigation mode and rotation; open your app first, since a portrait-locked launcher keeps the display upright.
        The cutout is AOSP's generic punch hole and the system bars stay the emulator's own, so the measured insets above are not reproduced.
      </p>
    </>}
    {device.brand === "Samsung" && <a href={SAMSUNG_SKINS_URL} className="block text-accent underline" target="_blank" rel="noreferrer">Official Samsung emulator skins ↗</a>}
  </details>;
}
