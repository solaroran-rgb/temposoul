import type { VedicPoint } from '@temposoul/core/vedic';

/**
 * 吠陀盘面渲染（V3 星盘三兄弟共用基建）
 *
 * 支持两种传统盘式：
 *   · north 北印度式：菱形（固定 Lagna 在顶格，12 宫逆时针排布）
 *   · south 南印度式：4×3 方格（固定星座位置，Lagna 格标记「Lagna」）
 * 本组件纯渲染，不含任何算法；所有落位由 VedicPoint.bhava / rashiIndex 提供。
 */

const GRAHA_ABBR: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
};

const RASHI_ABBR = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
];

/** 北印度式：宫位 → 格位坐标（菱形 12 格） */
const NORTH_CELLS: Array<{ house: number; x: number; y: number }> = [
  { house: 1, x: 150, y: 62 },
  { house: 2, x: 62, y: 24 },
  { house: 3, x: 24, y: 88 },
  { house: 4, x: 150, y: 150 },
  { house: 5, x: 62, y: 150 },
  { house: 6, x: 24, y: 150 },
  { house: 7, x: 150, y: 238 },
  { house: 8, x: 238, y: 150 },
  { house: 9, x: 276, y: 150 },
  { house: 10, x: 150, y: 276 },
  { house: 11, x: 238, y: 276 },
  { house: 12, x: 276, y: 62 },
];

/** 南印度式：星座索引 → 4×3 方格坐标（星座固定，Lagna 高亮） */
const SOUTH_CELLS: Array<{ rashi: number; x: number; y: number }> = [
  { rashi: 0, x: 62, y: 40 },
  { rashi: 1, x: 150, y: 40 },
  { rashi: 2, x: 238, y: 40 },
  { rashi: 3, x: 300, y: 40 },
  { rashi: 11, x: 62, y: 130 },
  { rashi: 4, x: 300, y: 130 },
  { rashi: 10, x: 62, y: 220 },
  { rashi: 5, x: 300, y: 220 },
  { rashi: 9, x: 62, y: 290 },
  { rashi: 8, x: 150, y: 290 },
  { rashi: 7, x: 238, y: 290 },
  { rashi: 6, x: 300, y: 290 },
];

export function VedicChart({
  lagna,
  grahas,
  style = 'north',
}: {
  lagna: VedicPoint;
  grahas: VedicPoint[];
  style?: 'north' | 'south';
}) {
  const points: VedicPoint[] = [lagna, ...grahas];

  if (style === 'south') {
    return (
      <svg
        className="vedic-chart-svg"
        viewBox="0 0 360 330"
        role="img"
        aria-label="吠陀南印度式盘面"
      >
        <rect x="16" y="16" width="328" height="298" rx="10" className="vedic-chart-frame" />
        {SOUTH_CELLS.map((cell) => {
          const isLagna = lagna.rashiIndex === cell.rashi;
          const inCell = points.filter((p) => p.rashiIndex === cell.rashi);
          return (
            <g key={`south-${cell.rashi}`}>
              <rect
                x={cell.x}
                y={cell.y}
                width="72"
                height="80"
                rx="6"
                className={isLagna ? 'vedic-cell vedic-cell--lagna' : 'vedic-cell'}
              />
              <text x={cell.x + 6} y={cell.y + 15} className="vedic-cell-index">
                {RASHI_ABBR[cell.rashi]}
              </text>
              {inCell.map((p, i) => (
                <text
                  key={p.name}
                  x={cell.x + 6}
                  y={cell.y + 32 + i * 16}
                  className="vedic-graha-text"
                >
                  {p.name === 'Lagna' ? 'Lg' : GRAHA_ABBR[p.name] ?? p.name}
                  {p.retrograde ? 'ᴿ' : ''}
                </text>
              ))}
            </g>
          );
        })}
        <text x="180" y="160" className="vedic-center-label" textAnchor="middle">
          南印度式（星座固定）
        </text>
      </svg>
    );
  }

  return (
    <svg className="vedic-chart-svg" viewBox="0 0 300 300" role="img" aria-label="吠陀北印度式盘面">
      <polygon points="150,10 290,150 150,290 10,150" className="vedic-chart-diamond" />
      <polygon points="150,70 230,150 150,230 70,150" className="vedic-chart-diamond-inner" />
      <line x1="10" y1="150" x2="290" y2="150" className="vedic-chart-line" />
      <line x1="150" y1="10" x2="150" y2="290" className="vedic-chart-line" />
      <line x1="70" y1="70" x2="230" y2="230" className="vedic-chart-line" />
      <line x1="230" y1="70" x2="70" y2="230" className="vedic-chart-line" />
      {NORTH_CELLS.map((cell) => {
        const inCell = points.filter((p) => p.bhava === cell.house);
        return (
          <g key={`north-${cell.house}`}>
            <text x={cell.x} y={cell.y} className="vedic-cell-index" textAnchor="middle">
              {cell.house}
            </text>
            {inCell.map((p, i) => (
              <text
                key={p.name}
                x={cell.x}
                y={cell.y + 16 + i * 15}
                className={p.name === 'Lagna' ? 'vedic-graha-text vedic-graha-text--lagna' : 'vedic-graha-text'}
                textAnchor="middle"
              >
                {p.name === 'Lagna' ? 'Lg' : GRAHA_ABBR[p.name] ?? p.name}
                {p.retrograde ? 'ᴿ' : ''}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
