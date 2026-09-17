// src/pages/almanac/WanNianLiPage.tsx
// B16-补交终版：IT-8-7 修正 —— 请求体 {dateType:'solar',topic:'custom',startDate,endDate,responseMode:'full'}；
// 响应解析 resp.data.days 数组；缓存改用本地 safeStorage
import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { calcLuckScore } from '@/lib/almanac-rules';
import { safeStorage } from '@/lib/safe-storage';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import type { AlmanacDayData } from '@/hooks/useAlmanacData';
import './wannianli-page.css';

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const CACHE_KEY_PREFIX = 'temposoul:almanac:month:';
const CHUNK_SIZE = 7;

interface CalendarDay {
  date: string;
  lunarDate: string;
  ganzhi: string;
  solarTerm?: string;
  luckScore: number;
  loaded: boolean;
}

interface AlmanacBatchResponse {
  ok: boolean;
  data?: { days?: AlmanacDayData[] };
}

function getMonthRange(year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const days: string[] = [];
  for (let d = 1; d <= lastDay; d++) {
    days.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return { startDate, endDate, days };
}

function toCalendarDay(date: string, d: AlmanacDayData | null | undefined): CalendarDay {
  if (!d) return { date, lunarDate: '', ganzhi: '', luckScore: 0, loaded: false };
  return {
    date,
    lunarDate: d.lunarDate ?? '',
    ganzhi: typeof d.ganzhi === 'string' ? d.ganzhi : '',
    solarTerm: d.highlights?.find(h => h.includes('节气'))?.replace('节气:', ''),
    luckScore: calcLuckScore(d),
    loaded: true,
  };
}

export default function WanNianLiPage(): ReactElement {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [pageState, setPageState] = useState<PageState>('idle');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { trackPageView('/almanac/calendar'); }, []);

  const loadMonth = useCallback(async (y: number, m: number) => {
    if (y < MIN_YEAR || y > MAX_YEAR) { setPageState('ok-empty'); return; }

    const cacheKey = `${CACHE_KEY_PREFIX}${y}-${String(m).padStart(2, '0')}`;
    const cached = safeStorage.getJSON<CalendarDay[] | null>(cacheKey, null);
    if (cached) { setDays(cached); setPageState('ok'); return; }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPageState('loading');

    const { startDate, endDate, days: dateList } = getMonthRange(y, m);
    const body = JSON.stringify({ dateType: 'solar', topic: 'custom', startDate, endDate, responseMode: 'full' });

    try {
      // L1: 批量模式（IT-8-7 请求体）
      const resp = await fetch('/api/v1/divination/almanac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });

      if (resp.ok) {
        const parsed: AlmanacBatchResponse = await resp.json();
        const batchDays = parsed.data?.days ?? [];
        const byDate = new Map<string, AlmanacDayData>();
        batchDays.forEach((d) => { if (d && typeof d === 'object') { const key = (d as { date?: string }).date ?? ''; if (key) byDate.set(key, d); } });
        const result: CalendarDay[] = dateList.map(date => toCalendarDay(date, byDate.get(date)));
        safeStorage.setJSON(cacheKey, result);
        setDays(result); setPageState('ok'); return;
      }
    } catch (e) { if ((e as Error).name === 'AbortError') return; }

    // L2: 分片聚合降级（IT-8-7 单日响应同样解析 data.days[0]）
    try {
      const chunks: string[][] = [];
      for (let i = 0; i < dateList.length; i += CHUNK_SIZE) chunks.push(dateList.slice(i, i + CHUNK_SIZE));

      const chunkPromises = chunks.map(chunk =>
        Promise.all(chunk.map(date =>
          fetch('/api/v1/divination/almanac', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dateType: 'solar', topic: 'custom', startDate: date, endDate: date, responseMode: 'full' }),
            signal: controller.signal,
          }).then(async r => {
            if (!r.ok) return null;
            const parsed: AlmanacBatchResponse = await r.json();
            return parsed.data?.days?.[0] ?? null;
          }).catch(() => null)
        ))
      );

      const chunkResults = await Promise.allSettled(chunkPromises);

      const flatResults: (AlmanacDayData | null)[] = [];
      chunkResults.forEach(r => {
        if (r.status === 'fulfilled') flatResults.push(...r.value);
        else flatResults.push(...Array(CHUNK_SIZE).fill(null));
      });

      const failRate = flatResults.filter(r => !r).length / dateList.length;

      if (failRate <= 0.3) {
        const result: CalendarDay[] = dateList.map((date, i) => toCalendarDay(date, flatResults[i]));
        safeStorage.setJSON(cacheKey, result);
        setDays(result); setPageState('ok'); return;
      }

      // L3: 按需渲染（失败率 > 0.3，保留骨架由前端按日补齐）
      setDays(dateList.map(date => ({ date, lunarDate: '', ganzhi: '', luckScore: 0, loaded: false })));
      setPageState('degraded');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setDays(dateList.map(date => ({ date, lunarDate: '', ganzhi: '', luckScore: 0, loaded: false })));
      setPageState('degraded');
    }
  }, []);

  useEffect(() => { void loadMonth(year, month); }, [year, month, loadMonth]);

  return (
    <div className="wannianli-page">
      <PageTopbar title="万年历" onBack={() => window.history.back()} />
      <PrivacyHint />
      <div className="wannianli-page__controls">
        <button type="button" onClick={() => setMonth((m) => (m === 1 ? 12 : m - 1))}>上一月</button>
        <span className="wannianli-page__current">{year}年{month}月</span>
        <button type="button" onClick={() => setMonth((m) => (m === 12 ? 1 : m + 1))}>下一月</button>
      </div>
      {pageState === 'loading' && <div className="skeleton" />}
      {pageState === 'error' && <p className="wannianli-page__error">日历加载失败，请稍后重试。</p>}
      {pageState === 'ok-empty' && <p className="wannianli-page__empty">暂无可展示的日历数据。</p>}
      {pageState === 'degraded' && <p className="wannianli-page__notice">部分日期数据暂不可用，仅展示基础信息。</p>}
      {(pageState === 'ok' || pageState === 'degraded') && (
        <div className="wannianli-page__grid">
          {days.map((d) => (
            <div key={d.date} className={`wannianli-page__cell ${d.loaded ? '' : 'wannianli-page__cell--stub'}`}>
              <span className="wannianli-page__day">{Number(d.date.slice(8, 10))}</span>
              {d.loaded && (
                <>
                  <span className="wannianli-page__lunar">{d.lunarDate}</span>
                  <span className="wannianli-page__ganzhi">{d.ganzhi}</span>
                  {d.solarTerm && <span className="wannianli-page__term">{d.solarTerm}</span>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="wannianli-page__disclaimer">本页历法数据用于传统文化展示，仅供民俗参考。</p>
    </div>
  );
}
