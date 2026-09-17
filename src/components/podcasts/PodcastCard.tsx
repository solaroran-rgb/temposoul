// ============================================================
import type { PodcastEpisode } from '@/data/podcasts';
import { PODCAST_CATEGORY_LABELS } from '@/data/podcasts';
import { trackEvent } from '@/lib/analytics';

interface PodcastCardProps {
  readonly episode: PodcastEpisode;
  readonly active: boolean;
  readonly onPlay: (episode: PodcastEpisode) => void;
}

export function PodcastCard({ episode, active, onPlay }: PodcastCardProps) {
  const handleClick = () => {
    if (!episode.ready) return;
    trackEvent('podcast_play', { id: episode.id, title: episode.title });
    onPlay(episode);
  };

  return (
    <article className={`podcast-card${active ? ' podcast-card--active' : ''}`} aria-current={active}>
      <div className="podcast-card__main">
        <span className="podcast-card__category">{PODCAST_CATEGORY_LABELS[episode.category]}</span>
        <h3 className="podcast-card__title">{episode.title}</h3>
        <p className="podcast-card__description">{episode.description}</p>
        <time className="podcast-card__date" dateTime={episode.publishedAt}>
          {episode.publishedAt.replaceAll('-', '.')}
        </time>
      </div>
      <button
        type="button"
        className="podcast-card__play"
        onClick={handleClick}
        disabled={!episode.ready}
        aria-label={active ? '暂停播放' : `播放：${episode.title}`}
      >
        {episode.ready ? (active ? '暂停' : '播放') : '即将上线'}
      </button>
    </article>
  );
}
