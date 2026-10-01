import type { Insets } from "./types";

type PxInsets = Record<"statusBars" | "navigationBars" | "systemGestures" | "mandatorySystemGestures" | "tappableElement" | "displayCutout", Insets>;

const TYPES: Array<[keyof PxInsets, string]> = [
  ["statusBars", "statusBars"], ["navigationBars", "navigationBars"], ["displayCutout", "displayCutout"],
  ["systemGestures", "systemGestures"], ["mandatorySystemGestures", "mandatorySystemGestures"], ["tappableElement", "tappableElement"],
];

/** Kotlin identifier for a fixture, e.g. "Galaxy S25 Ultra", "Gesture", "Landscape Left" → galaxyS25UltraGestureLandscapeLeft. */
export function fixtureName(...parts: string[]): string {
  const words = parts.join(" ").replace(/\+/g, " Plus ").split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words.map((word, i) => i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()).join("");
}

/**
 * A WindowInsetsCompat built from one capture's exact px values, for JVM UI
 * tests (Robolectric, Paparazzi, Roborazzi). Every type is measured; nothing
 * is derived from systemBars.
 */
export function testFixtureSnippet(insets: PxInsets, label: { device: string; mode: string; orientation: string }): string {
  const name = fixtureName(label.device, label.mode, label.orientation);
  const lines = TYPES.map(([key, type]) => {
    const i = insets[key];
    return `  .setInsets(Type.${type}(), Insets.of(${i.left}, ${i.top}, ${i.right}, ${i.bottom}))`;
  });
  return `// ${label.device} · ${label.mode} · ${label.orientation}
// Measured px (left, top, right, bottom), keyboard hidden
val ${name} = WindowInsetsCompat.Builder()
${lines.join("\n")}
  .build()

// Apply to the view under test, e.g. in Robolectric:
// ViewCompat.dispatchApplyWindowInsets(rootView, ${name})`;
}
