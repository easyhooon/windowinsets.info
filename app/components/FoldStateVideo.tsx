import { useEffect, useRef, useState } from "react";
import { coverRevealAngle } from "./foldMath";

const FPS = 15;
const LAST_FRAME = 142;

/**
 * Hinge angle shown in a frame of the README hinge recordings (scripts/capture-readme-gifs.mjs):
 * 12 frames at 0°, 3° steps to 180°, 12 frames at 180°, then 3° steps back to 3°.
 */
export function recordedAngle(frame: number): number {
  if (frame < 12) return 0;
  if (frame < 72) return (frame - 11) * 3;
  if (frame < 84) return 180;
  return 177 - (frame - 84) * 3;
}

function foldState(angle: number, orientation: "VERTICAL" | "HORIZONTAL") {
  // Matches the renderer: below this angle the recording faces the cover screen.
  if (angle < coverRevealAngle(false)) return { label: angle === 0 ? "Closed" : "Nearly closed", detail: null };
  if (angle === 180) return { label: "Fully open", detail: `state = FLAT, orientation = ${orientation}` };
  return { label: "Partly open", detail: `state = HALF_OPENED, orientation = ${orientation}, isSeparating = true` };
}

/** A hinge recording with a caption that follows the FoldingFeature state at the angle on screen. */
export function FoldStateVideo({ src, name, orientation }: { src: string; name: string; orientation: "VERTICAL" | "HORIZONTAL" }) {
  const video = useRef<HTMLVideoElement>(null);
  const [angle, setAngle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let handle = 0;
    const update = () => {
      const frame = Math.min(LAST_FRAME, Math.max(0, Math.floor(element.currentTime * FPS)));
      setAngle(recordedAngle(frame));
      handle = requestAnimationFrame(update);
    };
    handle = requestAnimationFrame(update);
    // Animation frames pause in background tabs; timeupdate keeps the caption close meanwhile.
    const onTime = () => setAngle(recordedAngle(Math.min(LAST_FRAME, Math.floor(element.currentTime * FPS))));
    element.addEventListener("timeupdate", onTime);
    return () => { cancelAnimationFrame(handle); element.removeEventListener("timeupdate", onTime); };
  }, []);

  const state = foldState(angle, orientation);
  return (
    <figure className="fold-state">
      <video
        ref={video}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        autoPlay={!reducedMotion}
        controls={reducedMotion}
        aria-label={`${name} hinge opening from 0° to 180° and closing`}
      />
      <figcaption>
        <span className="fold-state-angle">{name} · {angle}°</span>
        <b>{state.label}</b>
        {state.detail
          ? <span>FoldingFeature: <code>{state.detail}</code></span>
          : <span>The app runs on the cover screen, which has no FoldingFeature.</span>}
      </figcaption>
    </figure>
  );
}
