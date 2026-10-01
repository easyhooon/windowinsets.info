import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLoaderData, useLocation, useParams } from "react-router";
import { devices as catalog } from "../data/devices";
import { summarizeDevice, type DeviceSummary } from "../data/deviceSummary";
import { FEATURED_SLUG, REPO_URL } from "../data/site";
import { ResizeHandle } from "../components/ResizeHandle";
import { Icon } from "../components/Icon";
import { prefetchFoldRenderer } from "../components/foldRendererChunk";
import { trackDeviceSelection, trackSupportClick } from "../lib/analytics";

type Device = DeviceSummary;
type Brand = "Galaxy" | "Pixel";
type Family = "All" | "Z" | "S" | "Tab" | "Note" | "A" | "Fold" | "Phone" | "Tablet";
const brands: Brand[] = ["Galaxy", "Pixel"];
const familiesByBrand: Record<Brand, Family[]> = { Galaxy: ["All", "Z", "S", "Tab", "Note", "A"], Pixel: ["All", "Fold", "Phone", "Tablet"] };
const brandOf = (device: Device): Brand => device.brand === "Google" ? "Pixel" : "Galaxy";
const groupOf = (device: Device) => device.brand === "Google" ? device.series
  : device.formFactor === "tablet" ? "Galaxy Tab"
  : /^Galaxy S\d*$/.test(device.series) ? "Galaxy S" : device.series;
const familyOf = (device: Device): Family => device.brand === "Google"
  ? device.formFactor === "tablet" ? "Tablet" : device.formFactor.startsWith("foldable") ? "Fold" : "Phone"
  : device.formFactor === "tablet" ? "Tab"
  : device.series.startsWith("Galaxy Z") ? "Z" : device.series.startsWith("Galaxy Note") ? "Note"
  : device.series === "Galaxy A" ? "A" : "S";
const hasMeasurements = (device: Device) => device.measurementCount > 0;
const measurementLabel = (device: Device) => {
  const count = device.measurementCount;
  if (!count) return device.brand === "Google" ? "No emulator capture" : "No inset measurements";
  if (device.brand === "Google") return count === device.screenCount * 2 ? "Emulator insets" : "Some emulator insets";
  // Complete measurements are the expected state, so only exceptions get a label.
  return count === device.screenCount * 2 ? null : "Some insets measured";
};
const deviceCaption = (device: Device) => [device.releaseYear, measurementLabel(device)].filter(Boolean).join(" · ");

/** Runs at prerender: the sidebar gets summaries, and each page loads only its own device. */
export function loader() {
  return { devices: catalog.map(summarizeDevice) };
}

/** The catalog is fixed per build, so client navigation never refetches it. */
export function shouldRevalidate() {
  return false;
}

export default function Shell() {
  const { devices } = useLoaderData<typeof loader>();
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  // Platform-specific hint is client-only, so the prerendered HTML stays identical.
  const [searchHint, setSearchHint] = useState<string | null>(null);
  useEffect(() => {
    setSearchHint(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K");
    // ⌘K / Ctrl+K anywhere, or "/" outside text fields, jumps to device search (docs-site convention).
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      const command = (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k";
      if (!command && !(e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey)) return;
      e.preventDefault();
      // The sidebar is a collapsed drawer on phones; open it so the field can take focus.
      if (window.matchMedia("(max-width: 767px)").matches) setMobileOpen(true);
      requestAnimationFrame(() => { searchInput.current?.focus(); searchInput.current?.select(); });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const location = useLocation();
  const { slug } = useParams();
  const current = devices.find(d => d.slug === slug) ?? devices.find(d => d.slug === FEATURED_SLUG)!;
  const [brand, setBrand] = useState<Brand>(() => brandOf(current));
  const [family, setFamily] = useState<Family>(() => familyOf(current));
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set([groupOf(current)]));
  const [expandedPreviews, setExpandedPreviews] = useState<Set<string>>(() => new Set(hasMeasurements(current) ? [] : [groupOf(current)]));
  useEffect(() => {
    setBrand(brandOf(current));
    setFamily(familyOf(current));
    setExpandedGroups(new Set([groupOf(current)]));
    setExpandedPreviews(new Set(hasMeasurements(current) ? [] : [groupOf(current)]));
  }, [location.pathname]);
  const search = query.trim().toLowerCase();
  const filtered = devices.filter(d => search ? d.name.toLowerCase().includes(search)
    : brandOf(d) === brand && (family === "All" || familyOf(d) === family));
  const series = [...new Set(filtered.map(groupOf))];
  const selectFamily = (next: Family, nextBrand: Brand = brand) => {
    setBrand(nextBrand);
    setFamily(next);
    setQuery("");
    const inBrand = devices.filter(d => brandOf(d) === nextBrand);
    const first = inBrand.includes(current) && (next === "All" || familyOf(current) === next) ? current
      : inBrand.find(d => next === "All" || familyOf(d) === next);
    setExpandedGroups(new Set(first ? [groupOf(first)] : []));
    setExpandedPreviews(new Set(first && !hasMeasurements(first) ? [groupOf(first)] : []));
  };
  const toggleGroup = (group: string) => setExpandedGroups(previous => {
    const next = new Set(previous);
    if (next.has(group)) next.delete(group); else next.add(group);
    return next;
  });
  const togglePreviews = (group: string) => setExpandedPreviews(previous => {
    const next = new Set(previous);
    if (next.has(group)) next.delete(group); else next.add(group);
    return next;
  });
  const deviceLink = (d: Device) => <NavLink key={d.slug} to={`/${d.slug}`} onMouseEnter={() => prefetchFoldRenderer(d.formFactor)} onFocus={() => prefetchFoldRenderer(d.formFactor)} onTouchStart={() => prefetchFoldRenderer(d.formFactor)} onClick={() => { trackDeviceSelection(d); setQuery(""); setMobileOpen(false); }} onAuxClick={e => { if (e.button === 1) trackDeviceSelection(d); }} className={`device-link ${current.slug === d.slug ? "selected" : ""}`}>
    <span className={`device-thumbnail ${d.formFactor}`} /><span>{d.name}<small>{deviceCaption(d)}</small></span>
  </NavLink>;
  return <div style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties} className="app-shell" data-build-commit={__BUILD_COMMIT__}>
    <a href="#device-canvas" className="skip-link">Skip to device canvas</a>
    <header className="app-header">
      <NavLink to="/" className="brand"><img src="/favicon-v2.svg" width="28" height="28" alt="" />windowinsets.info</NavLink>
      <button className="mobile-model" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><span className={`device-thumbnail ${current.formFactor}`} /><span>{current.name}{measurementLabel(current) && <small>{measurementLabel(current)}</small>}</span><Icon name="chevron" /></button>
    </header>
    <div className="app-content">
      <aside className={`device-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Devices">
        <div className="sidebar-heading"><strong>Devices</strong><span>{devices.length}</span></div>
        <label className="device-search"><Icon name="search" /><input ref={searchInput} type="search" aria-label="Search devices" aria-keyshortcuts="Meta+K Control+K /" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Escape") e.currentTarget.blur(); }} placeholder="Search devices…" />{searchHint && !query && <kbd className="search-shortcut" aria-hidden="true">{searchHint}</kbd>}</label>
        <div className="device-brand-tabs" role="group" aria-label="Brand">
          {brands.map(option => <button key={option} type="button" aria-pressed={brand === option} onClick={() => selectFamily("All", option)}>{option}</button>)}
        </div>
        <div className="device-family-tabs" role="group" aria-label="Device series">
          {familiesByBrand[brand].map(option => <button key={option} type="button" aria-pressed={family === option} onClick={() => selectFamily(option)}>{option}</button>)}
        </div>
        <nav className="device-list">
          {series.map(group => {
            const members = filtered.filter(d => groupOf(d) === group);
            const measured = members.filter(hasMeasurements);
            const previews = members.filter(d => !hasMeasurements(d));
            const expanded = Boolean(search) || expandedGroups.has(group);
            const id = `device-group-${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            const previewsExpanded = Boolean(search) || expandedPreviews.has(group);
            return <section key={group} aria-label={group}>
            <h2><button type="button" className="device-group-toggle" aria-expanded={expanded} aria-controls={id} disabled={Boolean(search)} onClick={() => toggleGroup(group)}><span>{group}</span><span className="device-group-count">{members.length}</span><Icon name="chevron" /></button></h2>
            <div id={id} hidden={!expanded}>
              {measured.map(deviceLink)}
              {previews.length > 0 && <div className="device-preview-group">
                <button type="button" className="device-group-toggle device-preview-toggle" aria-expanded={previewsExpanded} aria-controls={`${id}-previews`} disabled={Boolean(search)} onClick={() => togglePreviews(group)}><span>{members[0]?.brand === "Google" ? "Artwork previews" : "Skin previews"}</span><span className="device-group-count">{previews.length}</span><Icon name="chevron" /></button>
                <div id={`${id}-previews`} hidden={!previewsExpanded}>{previews.map(deviceLink)}</div>
              </div>}
            </div>
          </section>})}
          {!filtered.length && <p className="p-3 text-sm text-muted">No devices found.</p>}
        </nav>
        <nav className="sidebar-footer">
          <NavLink to="/developer-guide" onClick={() => setMobileOpen(false)}>Developer guide</NavLink>
          <NavLink to="/methodology" onClick={() => setMobileOpen(false)}>How I measure</NavLink>
          <NavLink to="/changelog" onClick={() => setMobileOpen(false)}>Changelog</NavLink>
          <a href={`${REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer" aria-label="Send feedback or report an issue on GitHub (opens in a new tab)">Send feedback ↗</a>
          <p className="sidebar-footer-support">
            <span>Found this useful?</span>
            <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="Star windowinsets.info on GitHub (opens in a new tab)">★ Star it on GitHub</a>
            <a href="https://ko-fi.com/easyhooon" target="_blank" rel="noopener noreferrer" onClick={trackSupportClick} onAuxClick={e => { if (e.button === 1) trackSupportClick(); }} aria-label="Support windowinsets.info on Ko-fi (opens in a new tab)">☕ Support on Ko-fi ↗</a>
          </p>
          <a href="https://safearea.info" target="_blank" rel="noreferrer">Inspired by safearea.info ↗</a>
        </nav>
      </aside>
      <ResizeHandle label="Devices width" value={sidebarWidth} onChange={setSidebarWidth} min={190} max={360} />
      <main className="workspace"><Outlet /></main>
    </div>
  </div>;
}
