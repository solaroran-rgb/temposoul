// A11-4 · src/components/ziwei/StarBrightnessTable.tsx · 亮度表（String 容错）
import type { StarBrightness } from '../../data/ziwei-stars/types';

export function StarBrightnessTable({ rows }: { rows: StarBrightness[] }) {
  const safe = Array.isArray(rows) ? rows : [];
  if (safe.length === 0) return <div className="ts-empty">暂无亮度数据</div>;
  return (
    <table className="ts-table">
      <caption className="ts-table__caption">庙旺利陷</caption>
      <thead>
        <tr>
          <th>亮度</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        {safe.map((r, i) => (
          <tr key={`${r.level}-${i}`}>
            <td>{typeof r.level === 'string' && r.level ? r.level : '—'}</td>
            <td>{typeof r.note === 'string' && r.note ? r.note : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StarBrightnessTable;
