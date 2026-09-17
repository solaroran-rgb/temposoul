// src/pages/community/BountyListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { BOUNTY_SEED, BountyQuestion, BountyStatus } from '@/data/community/bounty';
import { trackPageView, trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';
type Filter = 'all' | BountyStatus;


export default function BountyListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [questions, setQuestions] = useState<BountyQuestion[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  useEffect(() => {
    trackPageView('/community/bounty');
    const timer = setTimeout(() => {
      setQuestions(BOUNTY_SEED);
      setStatus(BOUNTY_SEED.length > 0 ? 'ok' : 'ok-empty');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filtered = questions
    .filter((item) => (activeFilter === 'all' ? true : item.status === activeFilter))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleFilterChange = (filter: Filter) => {
    trackEvent('bounty_filter_change', { filter });
    setActiveFilter(filter);
  };

  const statusLabel: Record<BountyStatus, string> = {
    open: '悬赏中',
    solved: '已解决',
    closed: '已关闭',
  };

  if (status === 'loading') {
    return (
      <div>
        <PageTopbar title="悬赏问答" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div>
      <PageTopbar title="悬赏问答" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="bounty-filter-tabs" role="tablist">
        {(['all', 'open', 'solved', 'closed'] as Filter[]).map((filter) => {
          const label = filter === 'all' ? '全部' : statusLabel[filter];
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={activeFilter === filter ? 'bounty-tab is-active' : 'bounty-tab'}
              onClick={() => handleFilterChange(filter)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="bounty-list">
          {filtered.map((question) => (
            <div key={question.id} className="bounty-card">
              <div className="bounty-title">{question.title}</div>
              <div className="bounty-desc">{question.description}</div>
              <div className="bounty-meta">
                <span className={`bounty-status bounty-status--${question.status}`}>
                  {statusLabel[question.status]}
                </span>
                <span>悬赏 {question.rewardPoints} 积分</span>
                <span>{new Date(question.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-tip">当前筛选条件下暂无问题</div>
      )}
    </div>
  );
}
