// A11-6 · src/components/divination/SpreadLayoutPreview.tsx · 布局预览
import type { SpreadLayoutPoint } from '../../data/tarot/spreads-extra';

export interface SpreadLayoutPreviewProps {
  layout: SpreadLayoutPoint[];
  cardCount: number;
}

export function SpreadLayoutPreview({ layout, cardCount }: SpreadLayoutPreviewProps) {
  const aria = `牌阵布局：共 ${cardCount} 张牌`;
  return (
    <div className="ts-spread-layout" role="img" aria-label={aria}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="ts-spread-layout__svg"
      >
        {layout.map((p, i) => (
          <g key={i} transform={`translate(${p.x * 100}, ${p.y * 100}) rotate(${p.rotation ?? 0})`}>
            <rect
              x={-4}
              y={-6}
              width={8}
              height={12}
              rx={1}
              fill="rgba(77,195,255,0.18)"
              stroke="var(--neon-cyan, #4DC3FF)"
              strokeWidth={0.4}
            />
            <text x={0} y={0.8} textAnchor="middle" fontSize={4} fill="#E0E6ED">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default SpreadLayoutPreview;
