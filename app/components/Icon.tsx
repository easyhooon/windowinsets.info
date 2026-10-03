export type PoseGlyph = `${"book" | "flip" | "trifold"}-${"closed" | "partial" | "open"}`;
export type IconName = "chevron" | "settings" | "sun" | "moon" | "search" | "check" | "zoom-in" | "zoom-out" | "zoom-fit" | "rotate-ccw" | "rotate-cw" | "github" | PoseGlyph;

// Pose glyphs follow each hinge: a Fold folds about a vertical hinge, a Flip about
// a horizontal one, and a TriFold about two vertical hinges. Flip closed and
// partial use side profiles: two stacked halves at the hinge, then two outlined
// panels at the 90° Flex mode angle.
const poses: Record<PoseGlyph, React.ReactNode> = {
  "book-closed": <><rect x="7.5" y="4" width="9" height="16" rx="1.5" /><path d="M9.5 4v16" /></>,
  "book-partial": <><path d="M12 6H5.5A1.5 1.5 0 0 0 4 7.5v9A1.5 1.5 0 0 0 5.5 18H12z" /><path d="m12 6 7-2.5v17L12 18z" /></>,
  "book-open": <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M12 5v14" strokeDasharray="2 2" /></>,
  "flip-closed": <><rect x="7" y="6" width="13" height="4.5" rx="1" /><rect x="7" y="13.5" width="13" height="4.5" rx="1" /><path d="M7 8.25a3.75 3.75 0 0 0 0 7.5" /></>,
  "flip-partial": <><rect x="4" y="4" width="6" height="11" rx="1" /><path d="M9 15h10a1 1 0 0 1 1 1v4H9z" /></>,
  "flip-open": <><rect x="7" y="2.5" width="10" height="19" rx="1.5" /><path d="M7 12h10" strokeDasharray="2 2" /></>,
  "trifold-closed": <><rect x="8" y="5" width="8" height="14" rx="1.5" /><path d="M10 5v14M11.5 5v14" /></>,
  "trifold-partial": <><rect x="3" y="6" width="12" height="12" rx="1" /><path d="M9 6v12" strokeDasharray="2 2" /><path d="m15 6 6-2.5v17L15 18" /></>,
  "trifold-open": <><rect x="2" y="5" width="20" height="14" rx="1.5" /><path d="M8.7 5v14M15.3 5v14" strokeDasharray="2 2" /></>,
};

export function Icon({ name }: { name: IconName }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "chevron" && <path d="m8 10 4 4 4-4" />}
    {name === "search" && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>}
    {name === "check" && <path d="m5 12 4 4 10-10" />}
    {name === "settings" && <><path d="m9 3-.6 3-2 .9-2.7-.9-2 3.5 2.2 2v2.3l-2.2 2 2 3.5 2.7-.9 2 .9.6 3h4l.6-3 2-.9 2.7.9 2-3.5-2.2-2v-2.3l2.2-2-2-3.5-2.7.9-2-.9-.6-3z" /><circle cx="11" cy="12.7" r="3" /></>}
    {name === "sun" && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
    {name === "moon" && <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />}
    {name.startsWith("zoom-") && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>}
    {name === "zoom-in" && <path d="M8 10.5h5M10.5 8v5" />}
    {name === "zoom-out" && <path d="M8 10.5h5" />}
    {name === "zoom-fit" && <rect x="8.5" y="8.5" width="4" height="4" rx=".5" />}
    {name === "rotate-cw" && <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M3 8V6a3 3 0 0 1 3-3h2M6 1l2 2-2 2M21 16v2a3 3 0 0 1-3 3h-2m2-2-2 2 2 2" /></>}
    {name === "rotate-ccw" && <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M21 8V6a3 3 0 0 0-3-3h-2m2-2-2 2 2 2M3 16v2a3 3 0 0 0 3 3h2m-2-2 2 2-2 2" /></>}
    {name === "github" && <path fill="currentColor" stroke="none" d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.8c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.1-.27-.47-1.33.1-2.78 0 0 .88-.28 2.89 1.08a10 10 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.21 2.51.1 2.78.68.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5z" />}
    {name in poses && poses[name as PoseGlyph]}
  </svg>;
}
