// src/pages/community/ShareWallPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { SHARE_CARDS_SEED, ShareCard, ShareCardType } from '@/data/community/wall';
import { trackPageView, trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';
type Filter = 'all' | ShareCardType;

const FILTER_LABELS: Record<Filter, string> = {
  all: '全部',
  birth: '生辰',
  bazi: '八字',
  tarot: '塔罗',
  numerology: '灵数',
  name: '姓名',
};

export default function ShareWallPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [cards, setCards] = useState<ShareCard[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  useEffect(() => {
    trackPageView('/community/wall');
    const timer = setTimeout(() => {
      setCards(SHARE_CARDS_SEED);
      setStatus(SHARE_CARDS_SEED.length > 0 ? 'ok' : 'ok-empty');
    }, 0);
    return () => clearTimeout(timer);
  }, []);


  const filtered = cards
    .filter((card) => (activeFilter === 'all' ? true : card.cardType === activeFilter))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleFilterChange = (filter: Filter) => {
    trackEvent('wall_filter_change', { filter });
    setActiveFilter(filter);
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

      {filtered.length > 0 ? (
        <div className="share-card-grid">
          {filtered.map((card) => (
            <div key={card.id} className="share-card">
              <div className="share-card-header">
                <span className="share-card-type">{FILTER_LABELS[card.cardType]}</span>
                <span className="share-card-like">{card.likeCount} 赞</span>
              </div>
              <h3>{card.title}</h3>
              {card.payload.cardType === 'birth' && (
                <div className="share-card-body">
                  <p>{card.payload.summary}</p>
                  <p>公历：{card.payload.birthDate}</p>
                  {card.payload.westernSign && <p>星座：{card.payload.westernSign}</p>}
                </div>
              )}
              {card.payload.cardType === 'bazi' && (
                <div className="share-card-body">
                  <p>{card.payload.summary}</p>
                  <p>
                    四柱：{card.payload.fourPillars.year} {card.payload.fourPillars.month}{' '}
                    {card.payload.fourPillars.day} {card.payload.fourPillars.hour}
                  </p>
                  <p>日主：{card.payload.dayMaster}</p>
                </div>
              )}
              {card.payload.cardType === 'tarot' && (
                <div className="share-card-body">
                  <p>牌阵：{card.payload.spreadName}</p>
                  <ul>
                    {card.payload.cards.map((tarotCard, index) => (
                      <li key={`${card.id}-${index}`}>
                        {tarotCard.name}（{tarotCard.orientation}）
                      </li>
                    ))}
                  </ul>
                  <p>{card.payload.summary}</p>
                </div>
              )}
              {card.payload.cardType === 'numerology' && (
                <div className="share-card-body">
                  <p>生命数字：{card.payload.lifePathNumber}</p>
                  {card.payload.expressionNumber !== undefined && (
                    <p>表现数字：{card.payload.expressionNumber}</p>
                  )}
                  <p>{card.payload.summary}</p>
                </div>
              )}
              {card.payload.cardType === 'name' && (
                <div className="share-card-body">
                  <p>姓名：{card.payload.fullName}</p>
                  {card.payload.strokes !== undefined && <p>笔画：{card.payload.strokes}</p>}
                  {card.payload.fiveElements && <p>五行：{card.payload.fiveElements}</p>}
                  <p>{card.payload.summary}</p>
                </div>
              )}
              <div className="share-card-footer">
                <span>作者：{card.authorId}</span>
                {card.reportable && (
                  <button type="button" className="report-button">
                    举报
                  </button>
                )}
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
