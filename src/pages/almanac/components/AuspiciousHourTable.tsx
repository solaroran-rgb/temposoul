// 保留第 3 轮实现
export type HourQuality = 'auspicious' | 'inauspicious' | 'neutral';

export interface HourRow {
  time: string;
  branch: string;
  quality: HourQuality;
  note?: string;
}

const QUALITY_LABEL: Record<HourQuality, string> = {
  auspicious: '吉',
  inauspicious: '忌',
  neutral: '平',
};

function normalizeQuality(v: unknown): HourQuality {
  return v === 'auspicious' || v === 'inauspicious' || v === 'neutral' ? v : 'neutral';
}

export function AuspiciousHourTable({ rows }: { rows: HourRow[] }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  if (safeRows.length === 0) return <div className="ts-empty">暂无吉时数据</div>;
  return (
    <table className="ts-table ts-hour-table">
      <thead>
        <tr>
          <th>时间</th>
          <th>时辰</th>
          <th>吉凶</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        {safeRows.map((r, i) => {
          const q = normalizeQuality(r.quality);
          return (
            <tr key={`${r.time}-${i}`} className={`ts-hour-table__row ts-hour-table__row--${q}`}>
              <td>{r.time}</td>
              <td>{r.branch}</td>
              <td>{QUALITY_LABEL[q]}</td>
              <td>{r.note ?? '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default AuspiciousHourTable;
