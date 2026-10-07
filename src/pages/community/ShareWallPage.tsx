// src/pages/community/ShareWallPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView, trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

/** 分享卡类型与服务端 N-09 wall 端点枚举一致（单一真值源，禁两套分类） */
type ShareCardType = 'birth' | 'bazi' | 'tarot' | 'numerology' | 'name' | 'starmark';
type Filter = 'all' | ShareCardType;

/** 服务端返回的分享条目（契约字段逐字命中 /api/v1/community/wall） */
interface WallShare {
  id: string;
  userId: string;
  type: ShareCardType;
  refId: string;
  title: string;
  summary: string;
  shareToken: string;
  likeCount: number;
  status: 'published' | 'hidden';
  createdAt: string;
  ready: boolean;
}

const FILTER_LABELS: Record<Filter, string> = {
  all: '全部',
  birth: '生辰',
  bazi: '八字',
  tarot: '塔罗',
  numerology: '灵数',
  name: '姓名',
  starmark: '星标',
};

/**
 * 真实数据源：GET /api/v1/community/wall（N-09 canonical 端点）。
 * 反假红线：取不到数据时呈诚实空态/降级态，不再回落本地 seed（seed 为演示用假数据）。
 */
async function fetchWall(signal?: AbortSignal): Promise<WallShare[]> {
  const res = await fetch('/api/v1/community/wall?limit=50', { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { items?: WallShare[] };
  return Array.isArray(body.items) ? body.items : [];
}

export default function ShareWallPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [cards, setCards] = useState<WallShare[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [likes, setLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    trackPageView('/community/wall');
    const controller = new AbortController();
    fetchWall(controller.signal)
      .then((items) => {
        setCards(items);
        setStatus(items.length > 0 ? 'ok' : 'ok-empty');
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        // 端点未配置（503）→ 降级；其余 → 错误态
        setStatus(String((e as Error)?.message ?? '').includes('503') ? 'degraded' : 'error');
      });
    return () => controller.abort();
  }, []);

  const filtered = cards
    .filter((card) => (activeFilter === 'all' ? true : card.type === activeFilter))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleFilterChange = (filter: Filter) => {
    trackEvent('wall_filter_change', { filter });
    setActiveFilter(filter);
  };

  const handleLike = async (card: WallShare) => {
    try {
      const res = await fetch(`/api/v1/community/wall/${encodeURIComponent(card.id)}/like`, {
        method: 'POST',
      });
      if (!res.ok) return;
      const body = (await res.json()) as { likeCount?: number };
      if (typeof body.likeCount === 'number') {
        setLikes(prev => ({ ...prev, [card.id]: body.likeCount as number }));
      }
    } catch {
      /* 点赞失败静默：不阻断浏览 */
    }
  };

  if (status === 'loading') {
    return (
      <div>
        <PageTopbar title="分享墙" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div>
      <PageTopbar title="分享墙" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="wall-filter-tabs">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? 'wall-tab is-active' : 'wall-tab'}
            onClick={() => handleFilterChange(filter)}
          >
            {FILTER_LABELS[filter]}
          </button>
        ))}
      </div>

      {status === 'error' ? (
        <div className="empty-tip">分享墙加载失败，请稍后重试</div>
      ) : status === 'degraded' ? (
        <div className="empty-tip">分享墙暂未开放（服务未配置）</div>
      ) : filtered.length > 0 ? (
        <div className="share-card-grid">
          {filtered.map((card) => (
            <div key={card.id} className="share-card">
              <div className="share-card-header">
                <span className="share-card-type">{FILTER_LABELS[card.type] ?? card.type}</span>
                <button type="button" className="share-card-like" onClick={() => handleLike(card)}>
                  {likes[card.id] ?? card.likeCount} 赞
                </button>
              </div>
              <h3>{card.title}</h3>
              {card.summary ? (
                <div className="share-card-body">
                  <p>{card.summary}</p>
                </div>
              ) : null}
              <div className="share-card-footer">
                <span>作者：{card.userId}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-tip">暂无分享卡片，来发布第一张吧</div>
      )}
    </div>
  );
}
