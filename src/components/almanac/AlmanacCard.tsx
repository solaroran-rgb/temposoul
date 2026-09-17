// B'11-1 src/components/almanac/AlmanacCard.tsx
/**
 * 首页黄历折叠卡
 * @module B'11-1
 */
import { useAlmanacData, type AlmanacDayData } from '@/hooks/useAlmanacData';
import { guardText } from '@/lib/assertions-guard';
import { PrivacyHint } from '@/components/PrivacyHint';

type CardState = 'loading' | 'ok' | 'degraded';

export function AlmanacCard() {
  const { data, loading, error } = useAlmanacData();

  let state: CardState = 'loading';
  if (error || !data) state = 'degraded';
  else if (!loading && data) state = 'ok';

  if (state === 'loading') {
    return (
      <div className="almanac-card almanac-card--skeleton" role="status" aria-label="黄历加载中">
        <div className="skeleton-line" />
      </div>
    );
  }
  if (state === 'degraded') {
    return (
      <div className="almanac-card almanac-card--fallback" role="alert">
        <p>{guardText('今日黄历暂不可用')}</p>
      </div>
    );
  }

  const d = data as AlmanacDayData;
  return (
    <details className="almanac-card">
      <summary className="almanac-card__summary">
        <span>{d.lunarDate}</span>
        <span>{Object.values(d.ganzhi).filter(Boolean).join(' ')}</span>
      </summary>
      <div className="almanac-card__body">
        <div className="almanac-card__section">
          <h3>宜</h3>
          <ul>
            {d.recommends.map((i) => (
              <li key={i}>{guardText(i)}</li>
            ))}
          </ul>
        </div>
        <div className="almanac-card__section">
          <h3>忌</h3>
          <ul>
            {d.avoids.map((i) => (
              <li key={i}>{guardText(i)}</li>
            ))}
          </ul>
        </div>
        <PrivacyHint />
      </div>
    </details>
  );
}
