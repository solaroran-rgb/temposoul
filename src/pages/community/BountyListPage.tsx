// src/pages/community/BountyListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import type { BountyQuestion, BountyStatus } from '@/data/community/bounty';
import { trackPageView, trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';
type Filter = 'all' | BountyStatus;

/**
 * 真实数据源：GET /api/v1/community/bounty（N-09 canonical 端点）。
 * 反假红线：取不到数据时呈诚实空态/降级态，不再回落本地 seed（seed 为演示用假数据）。
 */
async function fetchBounties(signal?: AbortSignal): Promise<BountyQuestion[]> {
  const res = await fetch('/api/v1/community/bounty?limit=50', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { items?: BountyQuestion[] };
  return Array.isArray(body.items) ? body.items : [];
}

export default function BountyListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [questions, setQuestions] = useState<BountyQuestion[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  useEffect(() => {
    trackPageView('/community/bounty');
    const controller = new AbortController();
    fetchBounties(controller.signal)
      .then((items) => {
        setQuestions(items);
        setStatus(items.length > 0 ? 'ok' : 'ok-empty');
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        // 端点未配置（503）→ 降级；其余 → 错误态
        setStatus(String((e as Error)?.message ?? '').includes('503') ? 'degraded' : 'error');
      });
    return () => controller.abort();
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

      {status === 'error' ? (
        <div className="empty-tip">悬赏列表加载失败，请稍后重试</div>
      ) : status === 'degraded' ? (
        <div className="empty-tip">悬赏功能暂未开放（服务未配置）</div>
      ) : filtered.length > 0 ? (
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
