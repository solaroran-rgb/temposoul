// B'11-1 src/components/almanac/AlmanacMonthView.tsx
/**
 * 黄历月历视图
 * @module B'11-1
 */
import { useMemo } from 'react';
import { calcDayBlock, type DayBlockColor } from '@/pages/almanac/lib/dayBlock';
import type { AlmanacDayData } from '@/hooks/useAlmanacData';

interface Props {
  year: number;
  month: number;
  days: AlmanacDayData[];
  selectedDate?: string;
  onDateSelect: (date: string) => void;
}

const COLOR_MAP: Record<DayBlockColor, string> = {
  auspicious: 'almanac-month__day--green',
  inauspicious: 'almanac-month__day--red',
  neutral: 'almanac-month__day--gray',
};

export function AlmanacMonthView({ year, month, days, selectedDate, onDateSelect }: Props) {
  const grid = useMemo(() => days.map((d) => ({ ...d, color: calcDayBlock(d.recommends, d.avoids) })), [days]);

  return (
    <div className="almanac-month" role="grid" aria-label={`${year}年${month}月黄历`}>
      <div className="almanac-month__header" role="row">
        {['日', '一', '二', '三', '四', '五', '六'].map((w) => (
          <div key={w} className="almanac-month__weekday" role="columnheader">{w}</div>
        ))}
      </div>
      <div className="almanac-month__grid" role="rowgroup">
        {grid.map((d) => (
          <button
            key={d.date}
            type="button"
            className={`almanac-month__day ${COLOR_MAP[d.color]} ${selectedDate === d.date ? 'is-selected' : ''}`}
            onClick={() => onDateSelect(d.date)}
            aria-label={`${d.date} ${d.color === 'auspicious' ? '吉' : d.color === 'inauspicious' ? '凶' : '平'}`}
            aria-pressed={selectedDate === d.date}
          >
            <span>{d.date.slice(8)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
