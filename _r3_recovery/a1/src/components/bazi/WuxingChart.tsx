
// A11-1 · src/components/bazi/WuxingChart.tsx · 五行分布 SVG 环形
const ELEMENT_COLORS: Record<string, string> = {
  '木': '#4EC9B0',
  '火': 'var(--neon-pink, #FF4D6D)',
  '土': '#CE9178',
  '金': '#E0E6ED',
  '水': 'var(--neon-cyan, #4DC3FF)',
};

const ALL_ELEMENTS = ['木', '火', '土', '金', '水'] as const;

export interface WuxingChartProps {
  present: string[];
  dominant: string[];
  missing: string[];
}

/**
 * 状态优先级：missing > dominant（且 dominant ∈ present）> present > 未出现
 * 说明：dominant 不在 present 时按"未出现"处理，避免语义冲突。
 */
export function WuxingChart({ present, dominant, missing }: WuxingChartProps) {
  const aria = `五行分布：存在 ${present.join('、') || '无'}；过旺 ${dominant.join('、') || '无'}；缺失 ${missing.join('、') || '无'}`;
  return (
    <div className="ts-wuxing-chart" role="img" aria-label={aria}>
      <ul className="ts-wuxing-chart__list">
        {ALL_ELEMENTS.map(el => {
          const isPresent = present.includes(el);
          const isMissing = missing.includes(el);
          const isDominant = isPresent && dominant.includes(el);
          const state = isMissing ? '缺失' : isDominant ? '过旺' : isPresent ? '存在' : '—';
          const cls = `ts-wuxing-chart__item${isMissing ? ' is-missing' : ''}${isDominant ? ' is-dominant' : ''}`;
          return (
            <li key={el} className={cls}>
              <span className="ts-wuxing-chart__dot" style={{ background: ELEMENT_COLORS[el] ?? '#666' }} aria-hidden />
              <span className="ts-wuxing-chart__name">{el}</span>
              <span className="ts-wuxing-chart__state">{state}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default WuxingChart;

