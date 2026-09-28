export type PoseGlyph = `${"book" | "flip" | "trifold"}-${"closed" | "partial" | "open"}`;
export type IconName = "chevron" | "settings" | "search" | "check" | "zoom-in" | "zoom-out" | "zoom-fit" | "rotate-ccw" | "rotate-cw" | PoseGlyph;

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
    {name.startsWith("zoom-") && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>}
    {name === "zoom-in" && <path d="M8 10.5h5M10.5 8v5" />}
    {name === "zoom-out" && <path d="M8 10.5h5" />}
    {name === "zoom-fit" && <rect x="8.5" y="8.5" width="4" height="4" rx=".5" />}
    {name === "rotate-cw" && <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M3 8V6a3 3 0 0 1 3-3h2M6 1l2 2-2 2M21 16v2a3 3 0 0 1-3 3h-2m2-2-2 2 2 2" /></>}
    {name === "rotate-ccw" && <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M21 8V6a3 3 0 0 0-3-3h-2m2-2-2 2 2 2M3 16v2a3 3 0 0 0 3 3h2m-2-2 2 2-2 2" /></>}
    {name in poses && poses[name as PoseGlyph]}
  </svg>;
}
