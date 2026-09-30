// 修正：IT-2.2 依据 + 目标年高亮 + 流月窗口（起讫节气）
import { type LiuyueInfo } from '@temposoul/core/bazi';

export interface LiunianItem {
  year: number;
  age: number;
  ganZhi: string;
  tenGod: string;
  tenGodZhi: string;
  monthWindows?: { startDate: string; endDate: string }[];
}

export interface LiunianTimelineProps {
  items: LiunianItem[];
  targetYear?: number;
}

function formatMonthWindows(windows: LiuyueInfo[]): string {
  return windows.map((w) => `${w.month}月(${w.startDate}—${w.endDate})`).join('；');
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
          <th>流月窗口</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr
            key={it.year}
            className={`ts-liunian-timeline__row${
              targetYear === it.year ? ' ts-liunian-timeline__row--selected' : ''
            }`}
          >
            <td>{it.year}</td>
            <td>{it.age}</td>
            <td>{it.ganZhi}</td>
            <td>{it.tenGod}</td>
            <td>{it.tenGodZhi}</td>
            <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.85em' }}>
              {it.monthWindows?.length
                ? formatMonthWindows(
                    it.monthWindows.map((mw) => ({ ...mw }) as unknown as LiuyueInfo),
                  )
                : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LiunianTimeline;
