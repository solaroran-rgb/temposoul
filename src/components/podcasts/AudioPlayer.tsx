//  六态机完整: idle | loading | playing | paused | degraded | error
// ============================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PodcastEpisode } from '@/data/podcasts';

interface AudioPlayerProps {
  readonly episode: PodcastEpisode | null;
}

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'degraded' | 'error';

export function AudioPlayer({ episode }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!episode) {
      setState('idle');
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    setState('loading');
    setCurrentTime(0);
    setDuration(0);
    const audio = audioRef.current;
    if (audio) {
      audio.src = episode.audioUrl;
      audio.load();
    }
  }, [episode]);

  const handleRetry = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !episode) return;
    setState('loading');
    audio.load();
    audio.play().catch(() => setState('error'));
  }, [episode]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !episode) return;
    if (state === 'playing') {
      audio.pause();
      return;
    }
    if (state === 'error' || state === 'degraded') {
      handleRetry();
      return;
    }
    audio.play().catch(() => setState('error'));
  }, [state, episode, handleRetry]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!episode) {
    return (
      <section className="audio-player audio-player--idle" aria-live="polite">
        <p className="audio-player__hint">选择一集后开始播放。</p>
      </section>
    );
  }

  return (
    <section className={`audio-player audio-player--${state}`} aria-live="polite">
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setState('playing')}
        onPause={() => setState('paused')}
        onWaiting={() => { if (state !== 'error') setState('loading'); }}
        onCanPlay={() => { if (state === 'loading') setState('paused'); }}
        onError={() => setState('error')}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (e.currentTarget.readyState < 3) setState('degraded');
        }}
      />

      <div className="audio-player__meta">
        <h3 className="audio-player__title">{episode.title}</h3>
        <span className="audio-player__episode">第 {episode.episode} 集</span>
      </div>
    
      <div className="audio-player__controls">
        <button
          type="button"
          className="audio-player__toggle"
          onClick={togglePlay}
          disabled={state === 'error'}
          aria-label={state === 'playing' ? '暂停' : '播放'}
        >
          {state === 'playing' ? '暂停' : '播放'}
        </button>
        <span className="audio-player__time">{formatTime(currentTime)}</span>
        <div className="audio-player__progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="audio-player__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="audio-player__time">{formatTime(duration)}</span>
      </div>
    
      {state === 'loading' && <p className="audio-player__status">加载中…</p>}
      {state === 'degraded' && (
        <p className="audio-player__status audio-player__status--degraded">
          音频加载较慢，可点击重试。
          <button type="button" className="audio-player__retry" onClick={handleRetry}>重试</button>
        </p>
      )}
      {state === 'error' && (
        <div className="audio-player__status audio-player__status--error">
          <p>音频加载失败，请检查网络或稍后重试。</p>
          <button type="button" className="audio-player__retry" onClick={handleRetry}>重试</button>
        </div>
      )}
    </section>

  );
}
