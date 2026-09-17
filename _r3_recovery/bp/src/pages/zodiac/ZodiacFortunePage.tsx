// B'11-2 src/pages/zodiac/ZodiacFortunePage.tsx
/**
 * 生肖运势四档页 (6态机)
 * @module B'11-2
 */
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateZodiacFortune, type ZodiacScope, type ZodiacFortuneData } from '@/pages/fortune/lib/daily-fortune';
import { ZodiacSelector } from '@/components/zodiac/ZodiacSelector';
import { FortuneTabs } from '@/components/zodiac/FortuneTabs';
import { FortuneCard } from '@/components/zodiac/FortuneCard';
import { PageTopbar } from '@/components/PageTopbar';
import { safeStorage } from '@/lib/safe-storage';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';
interface CacheEntry { data: ZodiacFortuneData; ts: number; }

export default function ZodiacFortunePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const signId = searchParams.get('sign') ?? 'rat';
  const scope = (searchParams.get('scope') as ZodiacScope) ?? 'today';
  const [state, setState] = useState<PageState>('idle');

  useEffect(() => { trackPageView('/zodiac/fortune'); }, []);

  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `temposoul:fortune:zodiac:${scope}:${today}:${signId}`;

  const data = useMemo(() => {
    setState('loading');
    try {
      const cached = safeStorage.getJSON<CacheEntry | null>(cacheKey, null);
      if (cached && Date.now() - cached.ts < 86400000) { 
        setState('ok'); 
        return cached.data; 
      }
      const res = generateZodiacFortune(today, signId, scope);
      safeStorage.setJSON(cacheKey, { data: res, ts: Date.now() });
      setState('ok');
      trackChartSubmit({ mode: 'zodiac_fortune', trueSolarTime: false });
      return res;
    } catch { 
      setState('error'); 
      return null; 
    }
  }, [cacheKey, signId, scope, today]);

  return (
    <main className="page-zodiac-fortune">
      <PageTopbar title="生肖运势" />
      <ZodiacSelector value={signId} onChange={(s) => setSearchParams({ sign: s, scope })} />
      <FortuneTabs value={scope} onChange={(s) => setSearchParams({ sign: signId, scope: s })} />
      {state === 'loading' && <div className="skeleton" role="status" />}
      {state === 'error' && <div role="alert">运势生成失败</div>}
      {state === 'ok' && data && <FortuneCard data={data} />}
    </main>
  );
}
