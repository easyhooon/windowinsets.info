import { DIAGRAM_COLORS, DIAGRAM_FONT } from './diagramStyle';
import { rulerValue, layoutMeasurementRulers, type RulerMeasurements } from './measurementLayout';

/** One annotation renderer for flat displays and projected folding displays. */
export function MeasurementRulers({ measurements, onCopy }: {
  measurements: RulerMeasurements;
  onCopy: (value: string) => void | Promise<void>;
}) {
  const { scale, units } = measurements;
  const colors = { size: DIAGRAM_COLORS.ink, inset: DIAGRAM_COLORS.inset, radius: DIAGRAM_COLORS.radius, cutout: '#8950e8' };
  return <g aria-label="Measurement rulers" data-measurement-rulers="true">
    {layoutMeasurementRulers(measurements).map(ruler => {
      const color = colors[ruler.kind];
      const { p, q } = ruler;
      const angle = Math.atan2(q.y - p.y, q.x - p.x);
      const tip = 3 * scale;
      const arrows = [[p, angle], [q, angle + Math.PI]] as const;
      const copy = () => { void onCopy(rulerValue(ruler, measurements.format)); };
      return <g key={ruler.name} data-ruler={ruler.name} data-symmetry={ruler.symmetry} data-value={ruler.value} stroke={color} strokeWidth={.75 * scale} fill="none">
        {ruler.bracket && <path opacity=".7" d={`M${ruler.start.x},${ruler.start.y} L${ruler.end.x},${ruler.end.y} L${ruler.bracket.x},${ruler.bracket.y}`} />}
        <path data-guide="true" opacity=".45" strokeDasharray={`${2 * scale} ${3 * scale}`}
          d={`M${ruler.start.x},${ruler.start.y} L${p.x},${p.y} M${ruler.end.x},${ruler.end.y} L${q.x},${q.y}`} />
        <path d={`M${p.x},${p.y} L${q.x},${q.y}`} />
        {arrows.map(([point, direction], i) => <path key={i} d={`M${point.x + tip * Math.cos(direction - .7)},${point.y + tip * Math.sin(direction - .7)} L${point.x},${point.y} L${point.x + tip * Math.cos(direction + .7)},${point.y + tip * Math.sin(direction + .7)}`} />)}
        <g data-ruler-label="true" role="button" tabIndex={0} aria-label={`Copy ${ruler.name}: ${ruler.text} ${units}`} onClick={event => { event.stopPropagation(); copy(); }}
          onPointerDown={event => event.stopPropagation()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); copy(); } }}
          style={{ pointerEvents: 'auto', cursor: 'copy', transformBox: 'view-box', transformOrigin: `${ruler.x}px ${ruler.y}px` }}>
          <title>{`${ruler.secondaryValue === undefined ? ruler.equivalentNames?.join(", ") ?? ruler.name : ruler.name}: ${ruler.text} ${units}. Copy recorded measurement.`}</title>
          <rect data-badge="true" x={ruler.x - ruler.width / 2} y={ruler.y - ruler.height / 2} width={ruler.width} height={ruler.height} rx={2 * scale} fill={color} stroke="none" />
          <text x={ruler.x} y={ruler.y} fill="white" stroke="none" textAnchor="middle" dominantBaseline="central" fontFamily={DIAGRAM_FONT} fontWeight="500" fontSize={12 * scale}>{ruler.text}</text>
        </g>
      </g>;
    })}
  </g>;
}
