// A11-2 · src/components/bazi/DailyPillarCard.tsx · 日柱卡
export interface DailyPillarCardProps {
  dayPillar: string;
  todayGanZhi: string;
  nayin?: string;
}

export function DailyPillarCard({ dayPillar, todayGanZhi, nayin }: DailyPillarCardProps) {
  return (
    <div className="ts-daily-pillar">
      <div className="ts-daily-pillar__row">
        <span className="ts-daily-pillar__label">日柱</span>
        <span className="ts-daily-pillar__value">{dayPillar || '—'}</span>
      </div>
      {nayin && (
        <div className="ts-daily-pillar__row">
          <span className="ts-daily-pillar__label">纳音</span>
          <span className="ts-daily-pillar__value">{nayin}</span>
        </div>
      )}
      <div className="ts-daily-pillar__row">
        <span className="ts-daily-pillar__label">今日干支</span>
        <span className="ts-daily-pillar__value">{todayGanZhi || '—'}</span>
      </div>
    </div>
  );
}

export default DailyPillarCard;
