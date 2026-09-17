// src/pages/video/VideoChannelPage.tsx
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { seoGate } from '@/lib/seo-gate';
import { ttlCache } from '@/lib/safe-storage-ttl';
import type { PageState } from '@/types/page-state';
import type { VideoItem, VideoListResponse } from '@/data/video/schema';
import { VIDEO_PLACEHOLDER } from '@/data/video/content';
import './video-channel-page.css';

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function VideoCategoryTabs({ categories, active, onSelect }: { categories: readonly { key: string; label: string }[]; active: string; onSelect: (key: string) => void }): ReactElement {
  return (
    <div className="video-channel__tabs">
      {categories.map((c) => (
        <button key={c.key} type="button" className={c.key === active ? 'video-channel__tab video-channel__tab--active' : 'video-channel__tab'} onClick={() => onSelect(c.key)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}

export function VideoCard({ item, onPlay }: { item: VideoItem; onPlay: (id: string) => void }): ReactElement {
  return (
    <li className="video-channel__grid-item">
      <button type="button" className="video-channel__card" onClick={() => onPlay(item.videoId)}>
        <span className="video-channel__card-title">{guardText(item.title)}</span>
        <span className="video-channel__card-state">{item.ready ? '可播放' : '即将上线'}</span>
      </button>
    </li>
  );
}

export function VideoPlayerPlaceholder(): ReactElement {
  return (
    <div className="video-channel__player-placeholder">播放器即将接入，当前为占位区域。</div>
  );
}

export default function VideoChannelPage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [data, setData] = useState<VideoListResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('brand');
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    trackPageView('/video');
    seoGate.applyToDocument(seoGate.policyFor('tool-placeholder'));
    setState('loading');
    try {
      const cached = ttlCache.get<VideoListResponse>('temposoul:video:list');
      const list = cached ?? VIDEO_PLACEHOLDER;
      if (cached === null) ttlCache.set('temposoul:video:list', list, CACHE_TTL_MS);
      setData(list);
      setState(list.items.length > 0 ? 'degraded' : 'ok-empty');
    } catch {
      setState('error');
    }
  }, []);

  const items = data === null ? [] : data.items.filter((i) => i.category === activeCategory);
  const categories = data === null ? [] : data.categories;

  return (
    <div className="video-channel">
      <PageTopbar
        title="视频频道"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton" />}
      {(state === 'degraded' || state === 'ok') && data !== null && (
        <>
          <VideoCategoryTabs categories={categories} active={activeCategory} onSelect={setActiveCategory} />
          {items.length > 0 ? (
            <ul className="video-channel__grid">
              {items.map((item) => (
                <VideoCard key={item.videoId} item={item} onPlay={(id) => { trackEvent('video_item_click', { videoId: id }); setPlaying(true); }} />
              ))}
            </ul>
          ) : (
            <p className="video-channel__empty">该分类暂无视频。</p>
          )}
          {playing && <VideoPlayerPlaceholder />}
          <p className="video-channel__notice">视频内容即将上线，当前为占位列表。</p>
        </>
      )}
      {state === 'ok-empty' && <p className="video-channel__empty">暂无视频内容。</p>}
      {state === 'error' && <p className="video-channel__empty">视频列表加载失败，请重试。</p>}
    </div>
  );
}
