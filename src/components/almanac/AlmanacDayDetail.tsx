// B'11-1 src/components/almanac/AlmanacDayDetail.tsx
/**
 * 黄历单日详情
 * @module B'11-1
 */
import type { AlmanacDayData } from '@/hooks/useAlmanacData';
import { YiJiPanel } from '@/pages/almanac/components/YiJiPanel';
import { AlmanacEvidenceCard } from '@/pages/almanac/components/AlmanacEvidenceCard';
import { PrivacyHint } from '@/components/PrivacyHint';

interface Props {
  data: AlmanacDayData;
}

export function AlmanacDayDetail({ data }: Props) {
  return (
    <section className="almanac-detail" aria-label="黄历详情">
      <header className="almanac-detail__header">
        <h2>{data.lunarDate}</h2>
        <p>
          {Object.values(data.ganzhi).filter(Boolean).join(' ')} · {data.dayOfficer} · 冲{data.clash}
        </p>
      </header>
      <YiJiPanel yi={data.recommends.map((label) => ({ label }))} ji={data.avoids.map((label) => ({ label }))} />

      {data.highlights && data.highlights.length > 0 && (
        <AlmanacEvidenceCard items={data.highlights.map((t, i) => ({ id: `h${i}`, label: t, confidence: 'legendary' }))} />
      )}
      <PrivacyHint />
    </section>
  );
}
