// B'11-3 src/pages/fortune/DailyFortunePage.tsx
/**
 * 星座运势页 (含scope扩展)
 * @module B'11-3
 */
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateDailyFortune, generateZodiacFortune, ZODIAC_SIGNS, type ZodiacScope } from '@/pages/fortune/lib/daily-fortune';
import { ASTRO_EVENTS_2026 } from '@/data/astro-events/2026';
import { ScopeTabs } from '@/components/fortune/ScopeTabs';
import { PageTopbar } from '@/components/PageTopbar';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';
import PrivacyHint from '@/components/PrivacyHint';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function DailyFortunePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const signId = searchParams.get('sign') ?? 'aries';
  const scope = (searchParams.get('scope') as ZodiacScope) ?? 'today';
  const [state, setState] = useState<PageState>('idle');

  useEffect(() => { trackPageView('/fortune/daily'); }, []);

  const today = new Date().toISOString().slice(0, 10);
  const data = useMemo(() => {
    setState('loading');
    try {
      let result: { main: string; sub: string };
      if (scope === 'today') {
        const daily = generateDailyFortune(today, signId);
        result = { main: daily.main, sub: daily.sub };
      } else {
        const zodiac = generateZodiacFortune(today, signId, scope);
        let bias = 0;
        if (scope === 'year') {
          ASTRO_EVENTS_2026.forEach(e => { if (today >= e.startDate && today <= e.endDate) bias += e.weightBias; });
        }
        result = { main: zodiac.main + (bias !== 0 ? ' (星象微调)' : ''), sub: zodiac.sub };
      }
      setState('ok');
      trackChartSubmit({ mode: 'daily_fortune', trueSolarTime: false });
      return result;
    } catch { setState('error'); return null; }
  }, [signId, scope, today]);

  return (
    <main className="page-daily-fortune">
      <PageTopbar title="星座运势" />
      <select value={signId} onChange={(e) => setSearchParams({ sign: e.target.value, scope })} aria-label="选择星座" style={{ minHeight: '44px' }}>
        {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <ScopeTabs value={scope} onChange={(s) => setSearchParams({ sign: signId, scope: s })} />
      {state === 'loading' && <div className="skeleton" role="status" />}
      {state === 'error' && <div role="alert">生成失败</div>}
      {state === 'ok' && data && (
        <article className="fortune-card">
          <h3>{guardText(data.main)}</h3>
          <p>{guardText(data.sub)}</p>
          <p className="disclaimer">{guardText('娱乐参考，非吉凶断言。')}</p>
          <PrivacyHint />
        </article>
      )}
    </main>
  );
}
