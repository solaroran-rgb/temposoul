// 保留第 3 轮实现（props 不变，供专家 B 组装）
import { YiJiPanel, type YiJiItem } from './YiJiPanel';
import { AuspiciousHourTable, type HourRow } from './AuspiciousHourTable';
import { AlmanacEvidenceCard } from './AlmanacEvidenceCard';
import {
  normalizeEvidence,
  type EvidenceItem,
} from '../../../components/fortune/FortuneEvidenceCard';

export interface DateSelectionDay {
  date: string;
  lunar?: string;
  ganZhi?: string;
  yi: YiJiItem[];
  ji: YiJiItem[];
  hours: HourRow[];
  evidence?: EvidenceItem[];
}

export interface DateSelectionResultProps {
  days: DateSelectionDay[];
  onDateClick?: (date: string) => void;
  className?: string;
}

export function DateSelectionResult({ days, onDateClick, className }: DateSelectionResultProps) {
  const safeDays = Array.isArray(days) ? days : [];
  if (safeDays.length === 0) {
    return <div className="ts-empty ts-date-selection__empty">暂无择日结果</div>;
  }
  return (
    <div className={`ts-date-selection ${className ?? ''}`.trim()}>
      {safeDays.map((d) => {
        const evidence = Array.isArray(d.evidence) ? d.evidence : normalizeEvidence(undefined);
        const headInner = (
          <>
            <span className="ts-date-selection__date">{d.date}</span>
            {d.lunar && <span className="ts-date-selection__lunar">{d.lunar}</span>}
            {d.ganZhi && <span className="ts-date-selection__ganzhi">{d.ganZhi}</span>}
          </>
        );
        return (
          <article key={d.date} className="ts-date-selection__day">
            {onDateClick ? (
              <button
                type="button"
                className="ts-date-selection__head ts-date-selection__head--interactive"
                onClick={() => onDateClick(d.date)}
              >
                {headInner}
              </button>
            ) : (
              <div className="ts-date-selection__head">{headInner}</div>
            )}
            <YiJiPanel yi={d.yi} ji={d.ji} />
            <AuspiciousHourTable rows={d.hours} />
            <AlmanacEvidenceCard items={evidence} />
          </article>
        );
      })}
    </div>
  );
}

export default DateSelectionResult;
