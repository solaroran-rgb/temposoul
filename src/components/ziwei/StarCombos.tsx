// A11-4 · src/components/ziwei/StarCombos.tsx · 组合
import type { StarCombo } from '../../data/ziwei-stars/types';

export function StarCombos({ rows }: { rows: StarCombo[] }) {
  const safe = Array.isArray(rows) ? rows : [];
  if (safe.length === 0) return <div className="ts-empty">暂无组合数据</div>;
  return (
    <ul className="ts-star-combos">
      {safe.map((r, i) => (
        <li key={`${r.partner}-${i}`} className="ts-star-combos__item">
          <span className="ts-star-combos__partner">与{r.partner}</span>
          <span className="ts-star-combos__note">{r.note}</span>
        </li>
      ))}
    </ul>
  );
}

export default StarCombos;
