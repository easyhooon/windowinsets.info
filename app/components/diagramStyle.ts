/** Annotation stack observed on safearea.info; available system fonts need no download. */
export const DIAGRAM_FONT = 'ui-monospace, "SF Mono", SFMono-Regular, "Roboto Mono", "JetBrains Mono", Menlo, monospace';
export const DIAGRAM_COLORS = {
  // Theme-aware CSS variables (app.css); the rest stay fixed on the light screen.
  ink: "var(--color-diagram-ink)", inkText: "var(--color-diagram-ink-text)", bezel: "var(--color-diagram-bezel)",
  inset: "#bc4c00", radius: "#bf3989", safe: "#1a7f37",
  safeFill: "#b7ebc6", insetFill: "#ffddb0",
};

/** Gesture zones (hatched; mandatory part solid) and tappable system UI (dotted). */
export const GESTURE_COLOR = "#2f6fde";
export const TAPPABLE_COLOR = "#0f8b7d";
