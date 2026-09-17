// src/pages/names/NameRankingPage.tsx
import React, { useState, useMemo } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { POPULARITY_SEED } from '@/data/names/popularity-seed';
import { listWeekly, listAll } from '@/lib/name-popularity';
import { trackPageView } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';

type Tab = 'weekly' | 'all';

export default function NameRankingPage() {
  useNoindex();
  const [tab, setTab] = useState<Tab>('weekly');

  React.useEffect(() => {
    trackPageView('/names/ranking');
  }, []);

  const seed = useMemo(() => {
    const map: Record<string, number> = {};
    POPULARITY_SEED.forEach((s) => {
      map[s.nameId] = s.seedViews;
    });
    return map;
  }, []);

  const ranking = useMemo(() => {
    const list = tab === 'weekly' ? listWeekly(seed) : listAll(seed);
    return list.slice(0, 50).map((e, idx) => ({
      nameId: e.nameId,
      name: e.name,
      rank: idx + 1,
      totalViews: e.seedViews + e.views,
    }));
  }, [tab, seed]);

  return (
    <div className="name-ranking-page">
      <PageTopbar title="名字热度排行" onBack={() => window.history.back()} />
      <PrivacyHint />
      <div className="tabs">
        <button className={tab === 'weekly' ? 'active' : ''} onClick={() => setTab('weekly')}>
          周榜
        </button>
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
          总榜
        </button>
      </div>
      <div className="ranking-list">
        {ranking.length === 0 ? (
          <p>暂无热度数据</p>
        ) : (
          ranking.map((r) => (
            <div key={r.nameId} className="ranking-item">
              <span className="rank">{r.rank}</span>
              <span className="name">{r.name}</span>
              <span className="views">{r.totalViews}</span>
            </div>
          ))
        )}
      </div>
      <p className="disclaimer">热度为站内统计参考，不声称"最受欢迎名字"的客观性。</p>
    </div>
  );
}
