
// A11-4 · src/components/ziwei/StarKeyPalaces.tsx · 关键宫
import type { StarPalace } from '../../data/ziwei-stars/types';

export function StarKeyPalaces({ rows }: { rows: StarPalace[] }) {
  const safe = Array.isArray(rows) ? rows : [];
  if (safe.length === 0) return <div className="ts-empty">暂无宫位说明</div>;
  return (
    <ul className="ts-star-palaces">
      {safe.map((r, i) => (
        <li key={`${r.palace}-${i}`} className="ts-star-palaces__item">
          <span className="ts-star-palaces__palace">{r.palace}</span>
          <span className="ts-star-palaces__note">{r.note}</span>
        </li>
      ))}
    </ul>
  );
}

export default StarKeyPalaces;

