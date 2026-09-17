// 修正：IT-2.2 依据 + 目标年高亮
export interface LiunianItem {
  year: number;
  age: number;
  ganZhi: string;
  tenGod: string;
  tenGodZhi: string;
}

export interface LiunianTimelineProps {
  items: LiunianItem[];
  targetYear?: number;
}

export function LiunianTimeline({ items, targetYear }: LiunianTimelineProps) {
  if (!items || items.length === 0) return <div className="ts-empty">暂无流年数据</div>;
  return (
    <table className="ts-table ts-liunian-timeline">
      <thead>
        <tr>
          <th>年</th>
          <th>年龄</th>
          <th>干支</th>
          <th>天干十神</th>
          <th>地支藏干十神</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr
            key={it.year}
            className={targetYear === it.year ? 'ts-liunian-timeline__row--selected' : undefined}
          >
            <td>{it.year}</td>
            <td>{it.age}</td>
            <td>{it.ganZhi}</td>
            <td>{it.tenGod}</td>
            <td>{it.tenGodZhi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LiunianTimeline;
