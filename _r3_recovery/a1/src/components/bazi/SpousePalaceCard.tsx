
// A11-3 · src/components/bazi/SpousePalaceCard.tsx · 配偶宫卡
export interface SpousePalaceCardProps {
  dayBranch: string;
  hiddenStems: string[];
}

export function SpousePalaceCard({ dayBranch, hiddenStems }: SpousePalaceCardProps) {
  return (
    <div className="ts-spouse-palace">
      <div className="ts-spouse-palace__row">
        <span className="ts-spouse-palace__label">配偶宫（日支）</span>
        <span className="ts-spouse-palace__value">{dayBranch || '—'}</span>
      </div>
      <div className="ts-spouse-palace__row">
        <span className="ts-spouse-palace__label">藏干</span>
        <span className="ts-spouse-palace__value">{hiddenStems.length ? hiddenStems.join('、') : '—'}</span>
      </div>
    </div>
  );
}

export default SpousePalaceCard;

