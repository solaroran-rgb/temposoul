import React, { useState, useEffect, useMemo } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { EventTimeline } from './components/EventTimeline';
import './EventsPage.css';

const CURRENT_YEAR = new Date().getFullYear();
const TYPES = ['all', 'eclipse', 'retrograde', 'phase', 'aspect'] as const;
type AstroType = (typeof TYPES)[number];

interface AstroEvent {
  date?: string;
  type?: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export const EventsPage: React.FC = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [filter, setFilter] = useState<AstroType>('all');
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // 完美优化：使用 fetch 加载 public 目录下的 JSON，规避 Vite 动态 import 陷阱
    fetch(`/data/astro/${year}.json`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (mounted) setEvents(data);
      })
      .catch(() => {
        if (mounted) setEvents([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [year]);

  const filtered = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.type === filter)),
    [events, filter],
  );

  return (
    <div className="events-page">
      <PageTopbar
        title="星象事件日历"
        onBack={() =>
          window.history.length > 1 ? window.history.back() : (window.location.href = '/')
        }
      />

      <div className="events-page__controls">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="events-page__select"
        >
          {Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}年
            </option>
          ))}
        </select>
        <div className="events-page__filters">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`events-page__filter-btn ${filter === t ? 'is-active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? '全部' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="events-page__content">
        {loading ? (
          <div className="events-page__loading">星轨数据同步中...</div>
        ) : (
          <EventTimeline events={filtered} />
        )}
      </div>
      <footer className="events-page__footer">
        <PrivacyHint />
      </footer>
    </div>
  );
};
export default EventsPage;
