import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LookupCardLayout } from '@/components/divination/LookupCardLayout';
import { trackPageView, trackEvent } from '@/lib/analytics';

type EphemerisView = 'month' | 'list';

export default function EphemerisPage() {
  const [params] = useSearchParams();
  const viewParam = params.get('view');
  const view: EphemerisView = viewParam === 'list' ? 'list' : 'month';

  useEffect(() => {
    trackPageView(`/astrolabe/ephemeris?view=${view}`);
    trackEvent('ephemeris_view', { view });
  }, [view]);

  return (
    <LookupCardLayout
      title="星历表"
      state="ok-empty"
      renderPicker={() => (
        <div>
          <a href="?view=month">月历</a>
          <a href="?view=list">列表</a>
          <span>当前视图：{view === 'month' ? '月历' : '列表'}</span>
        </div>
      )}
      renderResult={() => <div />}
      emptyMessages={{ 'ok-empty': '星历数据接入中，当前为月历视图骨架。' }}
    />
  );
}
