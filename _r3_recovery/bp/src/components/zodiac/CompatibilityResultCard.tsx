// B'11-4 src/components/zodiac/CompatibilityResultCard.tsx
/**
 * 配对结果卡
 * @module B'11-4
 */
import type { CompatibilityScore } from '@/data/astro-compat/matrix';
import type { CompatCorpus } from '@/data/astro-compat/pool';
import { guardText } from '@/lib/assertions-guard';
import PrivacyHint from '@/components/PrivacyHint';

interface Props { score: CompatibilityScore; corpus: CompatCorpus | null; }

export function CompatibilityResultCard({ score, corpus }: Props) {
  return (
    <article className="compat-result" aria-label="星座配对结果">
      <div className="compat-result__score" role="img" aria-label={`匹配度 ${score.total}%`}>
        <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
          <circle cx="50" cy="50" r="45" stroke="var(--neon-border)" strokeWidth="8" fill="none" />
          <circle cx="50" cy="50" r="45" stroke="var(--neon-primary)" strokeWidth="8" fill="none"
            strokeDasharray={`${score.total * 2.83} 283`} transform="rotate(-90 50 50)" />
        </svg>
        <span className="compat-result__number">{score.total}%</span>
      </div>
      <p className="compat-result__note">{guardText('规则参考分，非吉凶断言')}</p>
      {corpus && (
        <dl className="compat-result__dims">
          <div><dt>综合</dt><dd>{guardText(corpus.summary)}</dd></div>
          <div><dt>吸引力</dt><dd>{guardText(corpus.attraction)}</dd></div>
          <div><dt>沟通</dt><dd>{guardText(corpus.communication)}</dd></div>
          <div><dt>雷区</dt><dd>{guardText(corpus.risk)}</dd></div>
          <div><dt>价值观</dt><dd>{guardText(corpus.values)}</dd></div>
        </dl>
      )}
      <p className="disclaimer">{guardText('娱乐参考，非关系预测。')}</p>
      <PrivacyHint />
    </article>
  );
}
