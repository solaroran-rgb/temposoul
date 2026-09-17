// B'11-2 src/components/zodiac/FortuneCard.tsx
/**
 * 运势结果卡
 * @module B'11-2
 */
import type { ZodiacFortuneData } from '@/pages/fortune/lib/daily-fortune';
import { guardText } from '@/lib/assertions-guard';
import PrivacyHint from '@/components/PrivacyHint';

interface Props { data: ZodiacFortuneData; }

export function FortuneCard({ data }: Props) {
  return (
    <article className="fortune-card" aria-label={`${data.scope}运势`}>
      <span className="confidence-badge confidence-badge--legendary">传统规则</span>
      <h3 className="fortune-card__main">{guardText(data.main)}</h3>
      <p className="fortune-card__sub">{guardText(data.sub)}</p>
      <div className="fortune-card__seasonal">
        <span className="fortune-card__label">节气提示：</span>
        <span>{guardText(data.seasonal)}</span>
      </div>
      <p className="fortune-card__disclaimer">{guardText('娱乐参考，非吉凶断言。')}</p>
      <PrivacyHint />
    </article>
  );
}
