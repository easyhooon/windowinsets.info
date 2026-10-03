#!/usr/bin/env node
// windowinsets-info: read measured Android WindowInsets from windowinsets.info.
// Zero dependencies; reads the site's public JSON (schema v1) and never estimates missing values.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

const VERSION = "0.2.0";
const DEFAULT_BASE = "https://windowinsets.info";
const NAV_ALIASES = { gesture: "gesture", threebutton: "threeButton", "3-button": "threeButton", "3button": "threeButton", buttons: "threeButton" };
const INSET_TYPES = ["statusBars", "navigationBars", "systemBars", "displayCutoutInsets", "systemGestures", "mandatorySystemGestures", "tappableElement"];

const HELP = `windowinsets-info ${VERSION}: measured Android WindowInsets for Galaxy and Pixel devices

Usage:
  windowinsets-info list [--series <text>] [--status complete|partial|pending] [--json]
  windowinsets-info get <device> [--screen main|cover] [--nav gesture|3-button] [--unit dp|px] [--json]
  windowinsets-info fixtures [<device>...] [--series <text>] [--screen main|cover] [--nav gesture|3-button] [--unit dp|px]
  windowinsets-info preview <device> [--screen main|cover] [--nav gesture|3-button] [--json]
  windowinsets-info sizeclass <device> [--screen main|cover] [--json]

<device> is a slug or part of one, e.g. galaxy-s26-ultra, s26-ultra, fold7.
"fixtures" prints compact JSON of measured screens for tests; unmeasured screens are skipped, never estimated.
"preview" prints a Compose @Preview spec per captured screen, rotation and navigation mode.
"sizeclass" prints the WindowSizeClass and FoldingFeature of every captured rotation.

Options:
  --base-url <url|dir>  Data source (default ${DEFAULT_BASE}; env WINDOWINSETS_BASE_URL). A local directory works too.
  -h, --help            Show this help
  -v, --version         Show the version

Data, sources and methodology: ${DEFAULT_BASE}`;

class UsageError extends Error {}

const { values: opts, positionals } = (() => {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        series: { type: "string" },
        status: { type: "string" },
        screen: { type: "string" },
        nav: { type: "string" },
        unit: { type: "string", default: "dp" },
        json: { type: "boolean", default: false },
        "base-url": { type: "string" },
        help: { type: "boolean", short: "h", default: false },
        version: { type: "boolean", short: "v", default: false },
      },
    });
  } catch (error) {
    console.error(`${error.message}\n\n${HELP}`);
    process.exit(2);
  }
})();

const base = (opts["base-url"] ?? process.env.WINDOWINSETS_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");
// Pages always link to the public site, even when data is read from a local directory.
const pageBase = /^https?:\/\//.test(base) ? base : DEFAULT_BASE;

async function load(path) {
  if (!/^https?:\/\//.test(base)) return JSON.parse(await readFile(join(base.replace(/^file:\/\//, ""), path), "utf8"));
  const response = await fetch(`${base}${path}`, { headers: { "User-Agent": `windowinsets-info-cli/${VERSION}` } });
  if (!response.ok) throw new Error(`${base}${path}: HTTP ${response.status}`);
  return response.json();
}

const navMode = value => {
  if (value === undefined) return undefined;
  const mode = NAV_ALIASES[value.toLowerCase()];
  if (!mode) throw new UsageError(`Unknown --nav "${value}". Use gesture or 3-button.`);
  return mode;
};
const unit = () => {
  if (opts.unit !== "dp" && opts.unit !== "px") throw new UsageError(`Unknown --unit "${opts.unit}". Use dp or px.`);
  return opts.unit;
};
const navLabel = mode => (mode === "threeButton" ? "3-button" : "gesture");

function resolveDevice(index, query) {
  const q = query.toLowerCase();
  const exact = index.devices.find(device => device.slug === q || device.slug === `galaxy-${q}` || device.slug === `pixel-${q}`);
  if (exact) return exact;
  const words = q.split(/[\s-]+/).filter(Boolean);
  const matches = index.devices.filter(device => words.every(word => device.slug.split("-").includes(word) || device.slug.includes(word)));
  const whole = matches.filter(device => words.every(word => device.slug.split("-").includes(word)));
  const candidates = whole.length ? whole : matches;
  if (candidates.length === 1) return candidates[0];
  if (!candidates.length) throw new UsageError(`No device matches "${query}". Try: windowinsets-info list`);
  throw new UsageError(`"${query}" matches ${candidates.length} devices: ${candidates.slice(0, 10).map(d => d.slug).join(", ")}${candidates.length > 10 ? ", ..." : ""}`);
}

/** Flattens one device export into measured screen/mode rows; pending entries are dropped. */
function rows(exported, { screen, nav, unit: u }) {
  const out = [];
  for (const s of exported.screens) {
    if (screen && s.id !== screen) continue;
    const capture = s.capture.status === "measured" ? s.capture.value : null;
    for (const mode of ["gesture", "threeButton"]) {
      if (nav && mode !== nav) continue;
      const m = s.navigationModes[mode];
      if (m.status !== "measured" || !capture) continue;
      const raw = m.value.raw;
      const pick = pair => (pair ? pair[u] : null);
      out.push({
        device: exported.device.slug,
        name: exported.device.name,
        screen: s.id,
        navigation: mode,
        unit: u,
        densityDpi: capture.densityDpi,
        orientation: capture.orientation,
        displayRotation: capture.displayRotation,
        windowSize: capture.logicalSize[u],
        insets: {
          ...Object.fromEntries(INSET_TYPES.map(type => [type === "displayCutoutInsets" ? "displayCutout" : type, pick(raw[type])])),
          safeArea: pick(m.value.derived.safeAreaInsets),
        },
        evidence: m.value.evidence,
        condition: { android: m.value.condition.android, oneUi: m.value.condition.oneUi },
        source: `${pageBase}/${exported.device.slug}`,
      });
    }
  }
  return out;
}

const ROTATION_NAMES = ["ROTATION_0", "ROTATION_90", "ROTATION_180", "ROTATION_270"];
const screenLabel = (exported, id) => (exported.screens.length > 1 ? `${id === "cover" ? "Cover" : "Main"} · ` : "");
const sizeClassLabel = c => `${c.width}${c.widthExtended ? ` (${c.widthExtended})` : ""} / ${c.height}`;
const featureLabel = f => [f.state, f.orientation, f.isSeparating ? "separating" : null,
  f.orientation === "VERTICAL" ? `x=${fmt(f.boundsDp.left)}dp` : `y=${fmt(f.boundsDp.top)}dp`].filter(Boolean).join(" · ");
const postureLabel = row => (row.foldingFeatures.length
  ? `${row.foldingFeatures.map(featureLabel).join("; ")}${row.hingeAngleDegrees !== null ? ` · hinge sensor ${row.hingeAngleDegrees}°` : ""}` : null);

/** Development values are only in published exports; older copies of the data have none. */
function development(exported) {
  if (exported.development) return exported.development;
  throw new Error(`${exported.device.slug}: this data source has no development section yet.`);
}

/** Unique per capture, so every printed preview can be pasted into one file. */
function composeName(exported, capture) {
  const screen = exported.screens.length > 1 ? capture.screen : "";
  const nav = capture.navigation === "threeButton" ? "three button" : "gesture";
  const words = `${exported.device.name.replace(/^Galaxy\s+/, "")} ${screen} ${nav} rotation ${capture.rotation * 90} preview`;
  return words.split(/[^A-Za-z0-9]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join("");
}

const pad = (text, width) => String(text).padEnd(width);
const fmt = value => (value === null || value === undefined ? "-" : Number.isInteger(value) ? String(value) : value.toFixed(2));

function printRows(exported, list, u) {
  console.log(`${exported.device.name} (${exported.device.slug})`);
  for (const s of exported.screens) {
    const shown = list.filter(row => row.screen === s.id);
    const pending = ["gesture", "threeButton"].filter(mode => s.navigationModes[mode].status !== "measured");
    if (!shown.length && !pending.length) continue;
    const capture = s.capture.status === "measured" ? s.capture.value : null;
    console.log(`\n${s.label} screen${capture ? `: ${fmt(capture.logicalSize[u]?.width)}×${fmt(capture.logicalSize[u]?.height)} ${u}, ${capture.densityDpi} dpi, ${capture.orientation} (rotation ${capture.displayRotation})` : ""}`);
    for (const row of shown) {
      console.log(`  ${navLabel(row.navigation)} (Android ${row.condition.android}${row.condition.oneUi ? `, One UI ${row.condition.oneUi}` : ""}, ${row.evidence})`);
      console.log(`    ${pad("", 24)}${["top", "right", "bottom", "left"].map(edge => pad(edge, 9)).join("")}`);
      for (const [type, value] of Object.entries(row.insets)) {
        console.log(`    ${pad(type, 24)}${["top", "right", "bottom", "left"].map(edge => pad(value ? fmt(value[edge]) : "-", 9)).join("")}`);
      }
    }
    for (const mode of pending) console.log(`  ${navLabel(mode)}: not measured yet`);
  }
  console.log(`\nSource: ${pageBase}/${exported.device.slug}`);
}

async function main() {
  if (opts.version) return console.log(VERSION);
  const [command, ...args] = positionals;
  if (opts.help || !command) return console.log(HELP);
  const nav = navMode(opts.nav);
  const u = unit();
  const screen = opts.screen;
  if (screen && screen !== "main" && screen !== "cover") throw new UsageError(`Unknown --screen "${screen}". Use main or cover.`);

  if (command === "list") {
    const index = await load("/data/index.json");
    const series = opts.series?.toLowerCase();
    const devices = index.devices.filter(d => (!series || `${d.series} ${d.name}`.toLowerCase().includes(series)) && (!opts.status || d.measurementStatus === opts.status));
    if (opts.json) return console.log(JSON.stringify(devices, null, 2));
    const width = Math.max(...devices.map(d => d.slug.length), 4) + 2;
    for (const d of devices) console.log(`${pad(d.slug, width)}${pad(d.measurementStatus, 10)}${d.name}`);
    return console.error(`${devices.length} device(s)`);
  }

  if (command === "get") {
    if (args.length !== 1) throw new UsageError("Usage: windowinsets-info get <device>");
    const entry = resolveDevice(await load("/data/index.json"), args[0]);
    const exported = await load(`/data/${entry.slug}.json`);
    const list = rows(exported, { screen, nav, unit: u });
    if (opts.json) return console.log(JSON.stringify(list, null, 2));
    return printRows(exported, list, u);
  }

  if (command === "fixtures") {
    const bundle = await load("/data/all.json");
    let exports = bundle.devices;
    if (args.length) {
      const index = { devices: bundle.devices.map(e => e.device) };
      const slugs = new Set(args.map(query => resolveDevice(index, query).slug));
      exports = exports.filter(e => slugs.has(e.device.slug));
    }
    if (opts.series) exports = exports.filter(e => `${e.device.series} ${e.device.name}`.toLowerCase().includes(opts.series.toLowerCase()));
    return console.log(JSON.stringify(exports.flatMap(e => rows(e, { screen, nav, unit: u })), null, 2));
  }

  if (command === "preview" || command === "sizeclass") {
    if (args.length !== 1) throw new UsageError(`Usage: windowinsets-info ${command} <device>`);
    const entry = resolveDevice(await load("/data/index.json"), args[0]);
    const exported = await load(`/data/${entry.slug}.json`);
    const dev = development(exported);
    const source = `\nSource: ${pageBase}/${exported.device.slug}`;

    if (command === "preview") {
      const captures = dev.captures.filter(c => (!screen || c.screen === screen) && (!nav || c.navigation === nav));
      if (opts.json) return console.log(JSON.stringify(captures.map(c => ({ device: exported.device.slug, ...c })), null, 2));
      console.log(`${exported.device.name} (${exported.device.slug})`);
      if (!captures.length) return console.log(`\nNo capture matches, so no Preview spec is offered.${source}`);
      for (const c of captures) {
        console.log(`\n// ${screenLabel(exported, c.screen)}${navLabel(c.navigation)} · ${ROTATION_NAMES[c.rotation]} (captured ${c.capturedAt})`);
        console.log(`${c.composePreview}\n@Composable\nfun ${composeName(exported, c)}() {\n    // Your screen here\n}`);
      }
      console.log("\nSize and density match each capture. Compose Preview draws generic system bars and cutout, not One UI's.");
      return console.log(source);
    }

    const rows = dev.windowSizeClasses.filter(row => !screen || row.screen === screen);
    if (opts.json) return console.log(JSON.stringify(rows.map(row => ({ device: exported.device.slug, ...row })), null, 2));
    console.log(`${exported.device.name} (${exported.device.slug})\n`);
    const labels = rows.map(row => `${screenLabel(exported, row.screen)}${ROTATION_NAMES[row.rotation]}`);
    const width = Math.max(...labels.map(l => l.length), 8) + 2;
    rows.forEach((row, i) => {
      const size = row.windowSizeDp ? `${fmt(row.windowSizeDp.width)} × ${fmt(row.windowSizeDp.height)} dp` : "";
      console.log(`${pad(labels[i], width)}${pad(row.windowSizeClass ? sizeClassLabel(row.windowSizeClass) : "not measured yet", 28)}${size}`);
      const posture = postureLabel(row);
      if (posture) console.log(`${pad("", width)}${posture}`);
    });
    console.log("\nFrom WindowMetrics' maximum window in each capture (width 600 / 840 dp, height 480 / 900 dp; Large ≥ 1200 dp).");
    console.log("Rotations without a capture are never derived by swapping width and height.");
    return console.log(source);
  }

  throw new UsageError(`Unknown command "${command}".\n\n${HELP}`);
}

main().catch(error => {
  console.error(error instanceof UsageError ? error.message : `windowinsets-info: ${error.message}`);
  process.exit(error instanceof UsageError ? 2 : 1);
});
