import type { InsetsAnatomy as Anatomy } from "../data/insetsAnatomy.server";
import { skinAssetUrl } from "../data/skinAssetUrl";
import { DIAGRAM_COLORS, GESTURE_COLOR } from "./diagramStyle";

const CUTOUT_FILL = "#c4a0f1";

/** Numbered marker shared by the figure and the list it illustrates. */
export function AnatomyNumber({ n }: { n: number }) {
  return <span className="anatomy-number" aria-hidden="true">{n}</span>;
}

/** Where each inset type sits on a real device: a measured Galaxy S25 capture on its official skin. */
export function InsetsAnatomy({ anatomy }: { anatomy: Anatomy }) {
  const { skin, px } = anatomy;
  const { x: sx, y: sy, width: W, height: H } = skin.screen;
  const r = px.cornerRadius;
  const marker = (n: number, x: number, y: number) => (
    <g key={n}>
      <circle cx={x} cy={y} r={88} fill="#1f2328" stroke="#fff" strokeWidth={14} />
      <text x={x} y={y + 3} textAnchor="middle" dominantBaseline="middle" fontSize={110} fontWeight={700} fill="#fff" fontFamily="system-ui, sans-serif">{n}</text>
    </g>
  );
  return (
    <figure className="insets-anatomy">
      <svg viewBox={`0 0 ${skin.width} ${skin.height}`} role="img" aria-label={`${anatomy.device}: status bar, navigation bar, display cutout, gesture zones and corner radius`}>
        <defs>
          <pattern id="anatomy-gesture" width={36} height={36} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={36} height={36} fill={GESTURE_COLOR} fillOpacity={.2} />
            <line x1={0} y1={0} x2={0} y2={36} stroke={GESTURE_COLOR} strokeWidth={14} strokeOpacity={.6} />
          </pattern>
          <clipPath id="anatomy-screen"><rect x={sx} y={sy} width={W} height={H} rx={r} /></clipPath>
        </defs>
        <image href={skinAssetUrl(skin.image)} width={skin.width} height={skin.height} />
        <g clipPath="url(#anatomy-screen)">
          <rect x={sx} y={sy} width={W} height={H} fill="#fff" />
          <rect x={sx} y={sy} width={W} height={px.statusTop} fill={DIAGRAM_COLORS.insetFill} />
          <rect x={sx} y={sy + H - px.navBottom} width={W} height={px.navBottom} fill={DIAGRAM_COLORS.insetFill} />
          <rect x={sx} y={sy} width={px.gestureLeft} height={H} fill="url(#anatomy-gesture)" />
          <rect x={sx + W - px.gestureRight} y={sy} width={px.gestureRight} height={H} fill="url(#anatomy-gesture)" />
          <rect x={sx + px.cutout.x} y={sy + px.cutout.y} width={px.cutout.width} height={px.cutout.height} fill={CUTOUT_FILL} stroke="#8950e8" strokeWidth={6} />
        </g>
        {skin.foreground && <image href={skinAssetUrl(skin.foreground)} x={sx} y={sy} width={W} height={H} preserveAspectRatio="none" />}
        {/* Corner radius: the rounded display edge at the top-right corner. */}
        <path d={`M ${sx + W - r} ${sy} A ${r} ${r} 0 0 1 ${sx + W} ${sy + r}`} fill="none" stroke={DIAGRAM_COLORS.radius} strokeWidth={16} strokeLinecap="round" />
        {marker(1, sx + W * .27, sy + px.statusTop / 2)}
        {marker(2, sx + W * .5, sy + H - px.navBottom / 2)}
        {marker(3, sx + px.cutout.x + px.cutout.width / 2, sy + px.cutout.height + 150)}
        {marker(4, sx + px.gestureLeft / 2 + 40, sy + H * .5)}
        {marker(5, sx + W - r * .55, sy + r * 1.9)}
      </svg>
      <figcaption>{anatomy.device}, gesture navigation, measured</figcaption>
    </figure>
  );
}
