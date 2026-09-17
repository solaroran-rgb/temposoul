// B'11-1 src/pages/almanac/AlmanacPage.tsx
/**
 * 黄历独立页容器 (6态机)
 * @module B'11-1
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import { useAlmanacMonthData } from './lib/useAlmanacMonthData';
import { AlmanacMonthView } from '@/components/almanac/AlmanacMonthView';
import { AlmanacDayDetail } from '@/components/almanac/AlmanacDayDetail';
import { PageTopbar } from '@/components/PageTopbar';
import { trackPageView } from '@/lib/analytics';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function AlmanacPage() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date') ?? undefined;
  const { data, loading: dayLoading, error: dayError } = useAlmanacData(dateParam);

  const now = new Date();
  const year = dateParam ? new Date(dateParam).getFullYear() : now.getFullYear();
  const month = dateParam ? new Date(dateParam).getMonth() + 1 : now.getMonth() + 1;
  const { state: monthState, days } = useAlmanacMonthData(year, month);

  const [pageState, setPageState] = useState<PageState>('idle');

  useEffect(() => {
    trackPageView('/almanac');
  }, []);

  useEffect(() => {
    if (dayLoading || monthState === 'loading' || monthState === 'idle') setPageState('loading');
    else if (dayError) setPageState('error');
    else if (data && (monthState === 'ok' || monthState === 'ok-empty')) setPageState('ok');
    else if (!data && monthState === 'ok-empty') setPageState('ok-empty');
    else setPageState('degraded');
  }, [dayLoading, dayError, data, monthState]);

  return (
    <main className="page-almanac">
      <PageTopbar title="传统黄历" onBack={() => nav("/")} />
      {pageState === 'loading' && <div className="skeleton-page" role="status" />}
      {pageState === 'error' && <div role="alert">黄历数据加载失败</div>}
      {pageState === 'ok-empty' && <p>本月暂无黄历数据</p>}
      {pageState === 'degraded' && <p>部分数据暂不可用</p>}

      {(pageState === 'ok' || pageState === 'ok-empty') && (
        <AlmanacMonthView
          year={year}
          month={month}
          days={days}
          selectedDate={dateParam}
          onDateSelect={(d) => setSearchParams({ date: d })}
        />
      )}
      {pageState === 'ok' && data && <AlmanacDayDetail data={data} />}
      <nav className="almanac-nav">
        <a href="/almanac/select">专业择日 →</a>
      </nav>
    </main>
  );
}
