import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

export function Dropdown({ label, value, options, onChange, footer, valueWidthCh, reserveLabels = [] }: {
  label: string; value: string;
  /** Labels the value may switch to without a click; the button keeps room for each. */
  reserveLabels?: string[];
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  footer?: React.ReactNode; valueWidthCh?: number;
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
      <span className="text-muted">{label}:</span>
      <span className="tabular-nums dropdown-value" style={{ minWidth: valueWidthCh ? `${valueWidthCh}ch` : undefined }}>
        <span>{current?.label ?? value}</span>
        {reserveLabels.map(text => <span key={text} className="dropdown-value-reserve" aria-hidden="true">{text}</span>)}
      </span>
      <Icon name="chevron" />
    </button>
    {open && <div id={id} className="dropdown-panel" aria-label={label}>
      {options.map(o => <button key={o.value} disabled={o.disabled} aria-pressed={o.value === value} onClick={() => { onChange(o.value); setOpen(false); trigger.current?.focus(); }}>
        <span className="w-4">{o.value === value && <Icon name="check" />}</span>{o.label}
      </button>)}
      {footer && <div className="dropdown-footer">{footer}</div>}
    </div>}
  </div>;
}
