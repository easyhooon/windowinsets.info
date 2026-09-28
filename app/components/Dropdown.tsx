import { useEffect, useId, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";

export function Dropdown({ label, value, options, onChange, valueWidthCh, icon, hideLabel, opensUp }: {
  label: string; value: string;
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  valueWidthCh?: number;
  // Compact triggers keep "Label:" as the accessible name without showing it.
  icon?: IconName; hideLabel?: boolean; opensUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  const current = options.find(o => o.value === value);
  return <div className="dropdown" ref={ref}>
    <button ref={trigger} className="toolbar-button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      {icon && <Icon name={icon} />}
      <span className={hideLabel ? "sr-only" : "text-muted"}>{label}:</span>
      <span className="tabular-nums" style={{ minWidth: valueWidthCh ? `${valueWidthCh}ch` : undefined }}>{current?.label ?? value}</span>
      <Icon name="chevron" />
    </button>
    {open && <div id={id} className={`dropdown-panel${opensUp ? " opens-up" : ""}`} aria-label={label}>
      {options.map(o => <button key={o.value} disabled={o.disabled} aria-pressed={o.value === value} onClick={() => { onChange(o.value); setOpen(false); trigger.current?.focus(); }}>
        <span className="w-4">{o.value === value && <Icon name="check" />}</span>{o.label}
      </button>)}
    </div>}
  </div>;
}
