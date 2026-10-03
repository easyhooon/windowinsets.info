import { useEffect, useRef, useState } from "react";

const DISABLED_KEY = "windowinsets:shortcuts-off";

export interface ViewShortcut {
  key: string;
  label: string;
  run: () => void;
  /** Hidden from help and ignored when the control does not apply. */
  available?: boolean;
}

/** Shortcuts handled elsewhere, listed in the help dialog only. */
const FIXED_SHORTCUTS = [
  ["⌘K / Ctrl K, /", "Search devices (Enter opens the first match)"],
  ["+ / −", "Zoom in / out"],
  ["0", "Fit to canvas"],
] as const;

export function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/**
 * Single-key view shortcuts plus a "?" help dialog. They never fire while typing
 * or with Ctrl/⌘/Alt held, leave the canvas zoom keys alone, and can be turned
 * off from the dialog (WCAG 2.1.4) for screen reader and speech input users.
 */
export function useViewShortcuts(shortcuts: ViewShortcut[]) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [enabled, setEnabledState] = useState(true);
  const latest = useRef(shortcuts);
  latest.current = shortcuts;
  useEffect(() => {
    try { setEnabledState(localStorage.getItem(DISABLED_KEY) !== "1"); } catch { /* Storage blocked: keep them on. */ }
  }, []);
  const setEnabled = (next: boolean) => {
    setEnabledState(next);
    try { if (next) localStorage.removeItem(DISABLED_KEY); else localStorage.setItem(DISABLED_KEY, "1"); } catch { /* Session-only then. */ }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector("dialog[open]:not(.shortcuts-dialog)")) return;
      if (e.key === "?") { e.preventDefault(); setHelpOpen(open => !open); return; }
      if (!enabled) return;
      const shortcut = latest.current.find(s => s.key === e.key && s.available !== false);
      if (!shortcut) return;
      e.preventDefault();
      shortcut.run();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enabled]);
  return { helpOpen, setHelpOpen, enabled, setEnabled };
}

export function ShortcutsDialog({ open, onClose, shortcuts, enabled, onEnabledChange }: {
  open: boolean; onClose: () => void; shortcuts: ViewShortcut[]; enabled: boolean; onEnabledChange: (enabled: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return <dialog ref={dialog} className="shortcuts-dialog" aria-labelledby="shortcuts-title" onClose={onClose}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="shortcuts-header">
      <h2 id="shortcuts-title">Keyboard shortcuts</h2>
      <button type="button" className="support-notice-close" aria-label="Close keyboard shortcuts" onClick={onClose}>×</button>
    </div>
    <dl>
      {shortcuts.filter(s => s.available !== false).map(s => <div key={s.key} className="metric-row"><dt>{s.label}</dt><dd><kbd>{s.key}</kbd></dd></div>)}
      {FIXED_SHORTCUTS.map(([keys, label]) => <div key={keys} className="metric-row"><dt>{label}</dt><dd><kbd>{keys}</kbd></dd></div>)}
      <div className="metric-row"><dt>Show this help</dt><dd><kbd>?</kbd></dd></div>
    </dl>
    <label className="shortcuts-toggle"><input type="checkbox" checked={enabled} onChange={e => onEnabledChange(e.target.checked)} />Single-key shortcuts</label>
    <p className="text-muted">They never fire while typing. Turn them off if they conflict with a screen reader or speech input.</p>
  </dialog>;
}
