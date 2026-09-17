// 修正：IT-2.2 依据（数据源 = data.tenGods 四柱映射）
export interface TenGodRow {
  pillar: string;
  tenGod: string;
  note?: string;
}

export function TenGodTable({ rows }: { rows: TenGodRow[] }) {
  if (!rows || rows.length === 0) return <div className="ts-empty">暂无十神数据</div>;
  return (
    <table className="ts-table">
      <thead>
        <tr>
          <th>柱</th>
          <th>十神</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={`${r.pillar}-${i}`}>
            <td>{r.pillar}</td>
            <td>{r.tenGod}</td>
            <td>{r.note ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TenGodTable;
