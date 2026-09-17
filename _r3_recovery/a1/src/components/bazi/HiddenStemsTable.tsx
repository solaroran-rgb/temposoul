
// A11-1 · src/components/bazi/HiddenStemsTable.tsx · 藏干表
export interface HiddenStemsInput {
  year?: string[];
  month?: string[];
  day?: string[];
  hour?: string[];
}

export interface HiddenStemsTableProps {
  hiddenStems: HiddenStemsInput;
}

const LABELS: Array<[keyof HiddenStemsInput, string]> = [
  ['year', '年柱'],
  ['month', '月柱'],
  ['day', '日柱'],
  ['hour', '时柱'],
];

export function HiddenStemsTable({ hiddenStems }: HiddenStemsTableProps) {
  const rows = LABELS.map(([k, label]) => ({ label, stems: hiddenStems[k] ?? [] }));
  const hasAny = rows.some(r => r.stems.length > 0);
  if (!hasAny) return <div className="ts-empty">暂无藏干数据</div>;
  return (
    <table className="ts-table">
      <caption className="ts-table__caption">四柱藏干</caption>
      <thead>
        <tr><th>柱</th><th>藏干</th></tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.label}>
            <td>{r.label}</td>
            <td>{r.stems.length > 0 ? r.stems.join('、') : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HiddenStemsTable;

