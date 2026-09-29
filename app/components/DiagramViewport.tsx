import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

type Bounds = { left: number; top: number; right: number; bottom: number };
export type DiagramViewportHandle = { fitFoldBounds: (bounds: Bounds, body: Bounds) => number; setFoldAngle: (angle: number) => void; effectiveZoom: () => number; refitFold: () => void;
  /** Play an orientation change onto the already re-laid-out diagram, before it paints. */
  turn: (deltaDeg: number, before: DOMRect | null) => void };

// Displayed zoom is CSS px per dp, like the reference's px per pt.
// `zoom` itself stays the scale of the 700 px canvas, so limits are converted.
const MIN_ZOOM = 10, MAX_ZOOM = 500, MAX_FIT_ZOOM = 100;
const FOLD_LABEL_ROOM = 64;
const ROTATION_MS = 300;
const ROTATION_EASING = "cubic-bezier(0.2, 0, 0, 1)";
// Converts a screen offset into the rotated canvas frame.
// The floating toggles and the legend/controls footer overlay the canvas edges.
const overlayRoom = (el: Element, viewport: DOMRect) => {
  const panel = el.closest(".canvas-panel");
  const toggles = panel?.querySelector(".canvas-toggles")?.getBoundingClientRect();
  const footer = panel?.querySelector(".canvas-footer")?.getBoundingClientRect();
  return {
    topRoom: Math.max(16, toggles && toggles.height ? toggles.bottom - viewport.top + 8 : 16),
    bottomRoom: Math.max(16, footer && footer.height ? viewport.bottom - footer.top + 8 : 16),
  };
};
const rotateBack =(x: number, y: number, degrees: number) => {
  const r = -degrees * Math.PI / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
};

export function DiagramViewport({ viewportRef, autoFit = false, closedFit, children, zoom, setZoom, rotation, fitKey, onUserTransform, onFit, baseWidth = 700, baseHeight = 700, fitWidth = baseWidth, fitHeight = baseHeight, dpScale = 1 }: {
  viewportRef?: React.Ref<DiagramViewportHandle>; autoFit?: boolean; closedFit?: { width: number; height: number };
  children: React.ReactNode; zoom: number; setZoom: (value: number) => void;
  rotation: number; fitKey: number; baseWidth?: number; baseHeight?: number; fitWidth?: number; fitHeight?: number;
  onUserTransform?: () => void; onFit?: () => void;
  /** Canvas px per dp at 100% canvas scale. */
  dpScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<HTMLDivElement>(null);
  // Fit must measure where the diagram will settle, not a frame of a running turn
  // or zoom transition: jump every animation to its end, measure, then restore.
  const measureSettled = <T,>(measure: () => T): T => {
    const animations = ref.current?.getAnimations({ subtree: true }) ?? [];
    const times = animations.map(animation => animation.currentTime);
    for (const animation of animations) {
      const end = animation.effect?.getComputedTiming().endTime;
      if (typeof end === "number") animation.currentTime = end;
    }
    try { return measure(); } finally { animations.forEach((animation, i) => { animation.currentTime = times[i]; }); }
  };
  // Unwrapped view angle so orientation changes animate along the shortest turn.
  const turn = useRef(rotation);
  const previousRotation = useRef(rotation);
  const turnTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const displayedAngle = useRef(0);
  const effectiveZoom = useRef(zoom);
  const fitScales = useRef({ closed: zoom, open: zoom });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const live = useRef({ zoom, pan, setZoom, onUserTransform, onFit, autoFit, closedFit, rotation, dpScale });
  live.current = { zoom, pan, setZoom, onUserTransform, onFit, autoFit, closedFit, rotation, dpScale };
  const clampZoom = (value: number, max = MAX_ZOOM) =>
    Math.max(MIN_ZOOM / live.current.dpScale, Math.min(max / live.current.dpScale, value));
  // Folds fit the visible pose and keep that scale while the hinge moves, as
  // the reference does for its foldable. Automatic fit then eases to the new pose.
  const foldFitPending = useRef(true);
  // Stop fold fitting immediately; renderer frames can arrive before autoFit=false renders.
  // User input ends any fit still converging, so a later pass cannot recentre over it.
  const fitting = useRef(false);
  const userTransform = () => { foldFitPending.current = false; fitting.current = false; live.current.onUserTransform?.(); };
  const foldFitAngle = useRef<number | null>(null);
  const fitBounds = useRef({ fitWidth, fitHeight });
  fitBounds.current = { fitWidth, fitHeight };
  const fitCenter = useRef({ x: 0, y: 0 });
  const projectedFit = useRef<{ bounds: Bounds; body: Bounds } | null>(null);
  // Folds scale the projected body, not its labels, whose lanes shift with
  // scale. Fixed label room gives a first scale; labels laid out there set the
  // final one once, so Fit and pose endpoints settle on the same value.
  const foldFitSession = useRef<{ base: number; zoom: number | null } | null>(null);
  const fitFoldBounds = (bounds: Bounds, body: Bounds, replay = false) => {
      projectedFit.current = { bounds, body };
      if (!live.current.autoFit || !foldFitPending.current || !ref.current || !scaleRef.current) return effectiveZoom.current;
      foldFitAngle.current ??= displayedAngle.current;
      const sideways = Math.abs(live.current.rotation) % 180 === 90;
      const width = body.right - body.left, height = body.bottom - body.top;
      const viewport = ref.current.getBoundingClientRect();
      // The toggles and legend overlay the canvas; keep the device clear of them.
      const { topRoom, bottomRoom } = overlayRoom(ref.current, viewport);
      const availableW = viewport.width - 32, availableH = viewport.height - topRoom - bottomRoom;
      const scaleFor = (roomX: number, roomY: number) => clampZoom(100 * Math.min((availableW - roomX) / (sideways ? height : width),
        (availableH - roomY) / (sideways ? width : height)), MAX_FIT_ZOOM);
      const base = scaleFor(2 * FOLD_LABEL_ROOM, 2 * FOLD_LABEL_ROOM);
      if (foldFitSession.current?.base !== base) foldFitSession.current = { base, zoom: null };
      const session = foldFitSession.current;
      // Replayed bounds may predate the current scale; only fresh renderer
      // bounds laid out at the session scale may settle it.
      const laidOut = session.zoom ?? base;
      if (!replay && Math.abs(effectiveZoom.current - laidOut) < .001) {
        const px = laidOut / 100;
        const roomX = (body.left - bounds.left + bounds.right - body.right) * px;
        const roomY = (body.top - bounds.top + bounds.bottom - body.bottom) * px;
        const next = scaleFor(sideways ? roomY : roomX, sideways ? roomX : roomY);
        // Lanes laid out at the final scale may need more room; only shrink so it converges.
        if (session.zoom === null || next < session.zoom - .001) session.zoom = next;
      }
      effectiveZoom.current = session.zoom ?? base;
      if (Math.abs(live.current.zoom - effectiveZoom.current) > .001) {
        live.current.zoom = effectiveZoom.current; live.current.setZoom(effectiveZoom.current);
      }
      // Center the labelled bounds, since labels stack unevenly, then lift
      // the center by half the difference between the overlay rooms.
      const lift = (bottomRoom - topRoom) / 2 / (effectiveZoom.current / 100);
      const x = (bounds.left + bounds.right) / 2 - 350;
      const y = (bounds.top + bounds.bottom) / 2 - 350;
      const [dx, dy] = rotateBack(0, lift, live.current.rotation);
      fitCenter.current = { x: x + dx, y: y + dy };
      scaleRef.current.style.transform = `scale(${effectiveZoom.current / 100}) rotate(${turn.current}deg) translate(${-fitCenter.current.x}px, ${-fitCenter.current.y}px)`;
      return effectiveZoom.current;
    };
  const applyScale = (includeBounds = true) => {
    const progress = displayedAngle.current / 180;
    // Use the renderer's actual angle, including interrupted and reduced-motion frames.
    effectiveZoom.current = live.current.autoFit && live.current.closedFit
      ? fitScales.current.closed + (fitScales.current.open - fitScales.current.closed) * progress
      : live.current.zoom;
    if (scaleRef.current) scaleRef.current.style.transform = `scale(${effectiveZoom.current / 100}) rotate(${turn.current}deg) translate(${-fitCenter.current.x}px, ${-fitCenter.current.y}px)`;
    if (includeBounds && projectedFit.current) fitFoldBounds(projectedFit.current.bounds, projectedFit.current.body, true);
  };
  useImperativeHandle(viewportRef, () => ({
    setFoldAngle: angle => {
      displayedAngle.current = angle;
      if (foldFitAngle.current !== null && angle !== foldFitAngle.current) foldFitPending.current = false;
      applyScale(false);
    },
    effectiveZoom: () => effectiveZoom.current,
    fitFoldBounds,
    turn: (deltaDeg, before) => {
      const wrap = turnRef.current;
      if (!wrap || !deltaDeg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      for (const animation of wrap.getAnimations({ subtree: true })) animation.cancel();
      // Runs before paint on the new layout at the previous zoom. Turned back by
      // -delta about its own centre, it matches the previous pose (size swaps with
      // orientation), so the turn starts without a jump. Fit passes then ease zoom and
      // pan through the same window; they measure the settled pose (measureSettled).
      const body = wrap.querySelector("[data-fit-body]")?.getBoundingClientRect();
      const box = wrap.getBoundingClientRect();
      if (!body || !body.width || !body.height) return;
      const sideways = Math.abs(deltaDeg) % 180 === 90;
      // Layouts are sized by height, so the re-laid-out device can differ in scale; match the previous box.
      const k = before && before.width && before.height
        ? Math.min(before.width / (sideways ? body.height : body.width), before.height / (sideways ? body.width : body.height)) : 1;
      wrap.style.transformOrigin = `${body.left + body.width / 2 - box.left}px ${body.top + body.height / 2 - box.top}px`;
      // The new layout may centre slightly differently; start from the previous centre too.
      const dx = before ? before.left + before.width / 2 - (body.left + body.width / 2) : 0;
      const dy = before ? before.top + before.height / 2 - (body.top + body.height / 2) : 0;
      wrap.animate([{ transform: `translate(${dx}px, ${dy}px) rotate(${-deltaDeg}deg) scale(${k})` }, { transform: "none" }], { duration: ROTATION_MS, easing: ROTATION_EASING });
      const eased = [scaleRef.current, positionRef.current].filter(Boolean) as HTMLDivElement[];
      for (const el of eased) el.style.transition = `transform ${ROTATION_MS}ms ${ROTATION_EASING}`;
      clearTimeout(turnTimer.current);
      turnTimer.current = setTimeout(() => { for (const el of eased) el.style.transition = ""; }, ROTATION_MS + 120);
      const content = wrap.querySelector<SVGGElement>("[data-screen-content]");
      const timing = { duration: ROTATION_MS, easing: ROTATION_EASING };
      // The frame turns around the already re-laid-out diagram. Apply the
      // inverse turn with identical timing so text stays upright throughout.
      if (content) {
        const fit = sideways ? Number(content.dataset.turnScale ?? 1) : 1;
        content.animate([{ transform: `rotate(${deltaDeg}deg) scale(${fit})` }, { transform: "none" }], timing);
      }
      // The reference briefly clears external annotations while the device turns.
      wrap.querySelector("[data-measurement-rulers]")?.animate(
        [{ opacity: 0, offset: 0 }, { opacity: 0, offset: .7 }, { opacity: 1, offset: 1 }],
        { duration: ROTATION_MS },
      );
      for (const label of wrap.querySelectorAll<SVGGElement>("[data-ruler-label]")) {
        label.animate([{ transform: `rotate(${deltaDeg}deg)` }, { transform: "none" }], timing);
      }
    },
    refitFold: () => {
      if (!live.current.autoFit || foldFitPending.current || !scaleRef.current) return;
      const el = scaleRef.current;
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.transition = "transform 240ms ease-out";
        setTimeout(() => { el.style.transition = ""; }, 260);
      }
      // Share the explicit Fit path so both settle on the same label layout.
      fit.current();
    },
  }));
  // Orientation changes ease the canvas into the new view, modeled on One UI's
  // ~300 ms decelerating screen rotation. Fit passes retarget the same transition.
  useLayoutEffect(() => {
    if (rotation === previousRotation.current) return;
    const delta = ((rotation - previousRotation.current) % 360 + 540) % 360 - 180;
    turn.current += delta === -180 ? 180 : delta;
    previousRotation.current = rotation;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = [scaleRef.current, positionRef.current].filter(Boolean) as HTMLDivElement[];
    for (const el of targets) el.style.transition = `transform ${ROTATION_MS}ms ${ROTATION_EASING}`;
    clearTimeout(turnTimer.current);
    turnTimer.current = setTimeout(() => { for (const el of targets) el.style.transition = ""; }, ROTATION_MS + 120);
  }, [rotation]);
  useEffect(() => () => clearTimeout(turnTimer.current), []);
  useLayoutEffect(() => applyScale(), [zoom, rotation, autoFit]);
  const [fitRevision, setFitRevision] = useState(0);
  const fit = useRef(() => {});
  useEffect(() => {
    const el = ref.current!;
    const fitCanvas = () => {
      fitting.current = true;
      foldFitPending.current = true;
      foldFitAngle.current = null;
      foldFitSession.current = null;
      setFitRevision(value => value + 1);
      const bounds = fitBounds.current;
      const sideways = Math.abs(rotation) % 180 === 90;
      const w = sideways ? bounds.fitHeight : bounds.fitWidth, h = sideways ? bounds.fitWidth : bounds.fitHeight;
      const scale = (width: number, height: number) => clampZoom(Math.floor(Math.min((el.clientWidth - 32) / width, (el.clientHeight - 32) / height) * 100), MAX_FIT_ZOOM);
      const open = scale(w, h);
      fitScales.current = { open, closed: closedFit ? scale(sideways ? closedFit.height : closedFit.width, sideways ? closedFit.width : closedFit.height) : open };
      live.current.zoom = open;
      live.current.setZoom(open);
      applyScale();
      setPan({ x: 0, y: 0 });
      // A fold session settles only on fresh label layout; the zoom prop may
      // not change after batching, so ask the renderer for another frame.
      requestAnimationFrame(() => (el.querySelector("[data-fold-renderer]") as (Element & { __update?: () => void }) | null)?.__update?.());
    };
    fit.current = fitCanvas;
    // Canvas resizes (for example a wrapping mobile control) refit only
    // automatic views; an explicit zoom and pan survive until Fit.
    const observer = new ResizeObserver(() => { if (live.current.autoFit) fitCanvas(); });
    observer.observe(el);
    fitCanvas();
    return () => observer.disconnect();
  }, [rotation]);
  useEffect(() => { fit.current(); }, [fitKey]);
  useEffect(() => {
    if (!fitting.current) return;
    const frame = requestAnimationFrame(() => {
      // A refit in the same commit may already have scaled to a zoom this render
      // predates, while labels still follow the old one; measure once it catches up.
      if (!fitting.current || Math.abs(live.current.zoom - zoom) > .001) return;
      const el = ref.current!;
      const svg = el.querySelector('svg[role="group"]');
      if (!svg) { fitting.current = false; return; }
      // Fit the visible body and annotations, not the SVG's unused margins.
      // Constant-size labels need another pass after the device scale changes.
      const boxes = measureSettled(() => [...svg.querySelectorAll('[data-fit-body], [data-ruler]')].map(node => node.getBoundingClientRect()));
      const left = Math.min(...boxes.map(box => box.left)), right = Math.max(...boxes.map(box => box.right));
      const top = Math.min(...boxes.map(box => box.top)), bottom = Math.max(...boxes.map(box => box.bottom));
      const viewport = el.getBoundingClientRect();
      // Same overlay room as the fold fit.
      const { topRoom, bottomRoom } = overlayRoom(el, viewport);
      const ratio = Math.min((viewport.width - 32) / (right - left), (viewport.height - topRoom - bottomRoom) / (bottom - top));
      setPan(previous => ({ x: previous.x + viewport.left + viewport.width / 2 - (left + right) / 2,
        y: previous.y + viewport.top + topRoom + (viewport.height - topRoom - bottomRoom) / 2 - (top + bottom) / 2 }));
      console.log('FIT', zoom, left|0, right|0, top|0, bottom|0, ratio.toFixed(3));
      const next = clampZoom(Math.floor(zoom * ratio), MAX_FIT_ZOOM); if (Math.abs(next - zoom) > 1) setZoom(next); else fitting.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [zoom, rotation, baseWidth, baseHeight, fitKey, fitRevision, setZoom]);

  useEffect(() => {
    const el = ref.current!;
    const changeZoom = (value: number) => {
      userTransform();
      live.current.setZoom(clampZoom(Math.round(value * live.current.dpScale) / live.current.dpScale));
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) changeZoom(effectiveZoom.current * Math.exp(-e.deltaY * 0.01));
      else {
        userTransform();
        setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
    };
    const keys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input,button,select,textarea,a")) return;
      if (["+", "=", "-", "0"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "0") { live.current.onFit?.(); fit.current(); }
        else changeZoom(effectiveZoom.current + (e.key === "-" ? -10 : 10) / live.current.dpScale);
      }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keys);
    return () => { el.removeEventListener("wheel", wheel); window.removeEventListener("keydown", keys); };
  }, []);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);
  return <div id="device-canvas" ref={ref} className="diagram-viewport" tabIndex={0} aria-label="Zoomable device canvas"
    onPointerDown={e => {
      if ((e.target as Element).closest("button,a,[role=button]")) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchStart.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: effectiveZoom.current };
      }
    }}
    onPointerMove={e => {
      const previous = pointers.current.get(e.pointerId);
      if (!previous) return;
      userTransform();
      const others = [...pointers.current.entries()].filter(([id]) => id !== e.pointerId);
      if (others.length) {
        const other = others[0][1];
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        const start = pinchStart.current;
        if (start && start.distance > 0) setZoom(clampZoom(start.zoom * after / start.distance));
      } else setPan(p => ({ x: p.x + e.clientX - previous.x, y: p.y + e.clientY - previous.y }));
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }}
    onPointerUp={e => { pointers.current.delete(e.pointerId); pinchStart.current = null; }} onPointerCancel={e => { pointers.current.delete(e.pointerId); pinchStart.current = null; }}
    onLostPointerCapture={e => { pointers.current.delete(e.pointerId); pinchStart.current = null; }}>
    <div ref={positionRef} className="diagram-position" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
      <div ref={turnRef} data-orientation-turn="true">
        <div ref={scaleRef} style={{ width: baseWidth, height: baseHeight, transformOrigin: "center" }}>{children}</div>
      </div>
    </div>
  </div>;
}
