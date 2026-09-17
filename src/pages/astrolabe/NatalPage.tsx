// 修正：接入 useFortuneCache；timeZoneId 白名单校验
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { PlanetTable } from './components/PlanetTable';
import { HouseTable } from './components/HouseTable';
import { AspectGrid } from './components/AspectGrid';
import { useAiChat } from '../../hooks/useAiChat';
import { useFortuneCache } from '../../hooks/useFortuneCache';
import {
  computeAstrolabeLocal,
  buildAstrolabePrompt,
  type AstrolabeInput,
  type AstrolabeChart,
} from './lib/localAstrolabe';
import { trackChartSubmit } from '../../lib/analytics';
import './astrolabe-natal.css';

const DEFAULT_QUESTION = '请结合行星、宫位与主要相位，给出该本命盘的整体解读。';

function isValidTimeZoneId(id: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: id });
    return true;
  } catch {
    return false;
  }
}

function parseInput(sp: URLSearchParams): AstrolabeInput | null {
  const year = Number(sp.get('year'));
  const month = Number(sp.get('month'));
  const day = Number(sp.get('day'));
  const hour = Number(sp.get('hour'));
  const minute = Number(sp.get('minute'));
  const latitude = Number(sp.get('latitude'));
  const longitude = Number(sp.get('longitude'));
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null;
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null;
  const tz = sp.get('timezone');
  const tzId = sp.get('timeZoneId');
  const tzNum = tz !== null ? Number(tz) : undefined;
  const tzIdValid = tzId && isValidTimeZoneId(tzId) ? tzId : undefined;
  return {
    year,
    month,
    day,
    hour,
    minute,
    latitude,
    longitude,
    timezone: tzNum !== undefined && Number.isFinite(tzNum) ? tzNum : undefined,
    timeZoneId: tzIdValid,
  };
}

export function NatalPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [chart, setChart] = useState<AstrolabeChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [degraded, setDegraded] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const ai = useAiChat();
  const firstTrackRef = useRef(false);

  const input = useMemo(() => parseInput(sp), [sp]);

  const cache = useFortuneCache({
    scope: 'astrolabe-natal',
    gender: 'mixed',
    dateType: 'solar',
    year: input?.year ?? 0,
    month: input?.month ?? 0,
    day: input?.day ?? 0,
    timeIndex: input?.hour ?? 0, // 复用时字段：存放小时
    extra: {
      minute: input?.minute,
      lat: input?.latitude,
      lon: input?.longitude,
      tzId: input?.timeZoneId,
      tz: input?.timezone,
    },
    ttlScope: 'natal',
  });

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!input) {
      setError('URL 参数缺失或非法，请从结果页进入');
      setChart(null);
      return;
    }
    let cancelled = false;
    setError(null);
    setDegraded(null);

    const cached = cache.get<AstrolabeChart>();
    if (cached) {
      setChart(cached);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const c = await computeAstrolabeLocal(input);
        if (cancelled) return;
        setChart(c);
        cache.set(c);
        if (!firstTrackRef.current) {
          firstTrackRef.current = true;
          try {
            trackChartSubmit({ mode: 'astrolabe-natal', trueSolarTime: false });
          } catch {
            /* noop */
          }
        }
      } catch (e) {
        if (cancelled) return;
        setChart(null);
        setDegraded(e instanceof Error ? e.message : '在线深度计算暂不可用，已用本地引擎展示');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input, cache]);

  const onAnalyze = useCallback(() => {
    if (!input || !chart) return;
    const prompt = buildAstrolabePrompt(chart, input, question.trim() || DEFAULT_QUESTION);
    ai.analyze(prompt);
  }, [input, chart, question, ai]);

  const aiText =
    ai.streamingContent || (ai.turns.length > 0 ? ai.turns[ai.turns.length - 1].content : '');
  const aiBusy = ai.status === 'loading' || ai.status === 'streaming';

  return (
    <div className="ts-page ts-page--astrolabe-natal">
      <PageTopbar title="西占本命" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">西方星盘本命</h1>
        {degraded && <div className="ts-alert ts-alert--info">{degraded}</div>}
        {error && (
          <div className="ts-alert ts-alert--error" role="alert">
            {error}
          </div>
        )}

        {input && (
          <section className="ts-card">
            <h2 className="ts-card__title">出生信息</h2>
            <p className="ts-page__note">
              {input.year}-{input.month}-{input.day} {String(input.hour).padStart(2, '0')}:
              {String(input.minute).padStart(2, '0')}｜ 纬度 {input.latitude}｜经度{' '}
              {input.longitude}｜时区 {input.timeZoneId ?? input.timezone ?? '—'}
            </p>
            <div className="ts-astrolabe-transit-note">行运分析：敬请期待（P2）</div>
          </section>
        )}

        {chart && (
          <>
            <section className="ts-card">
              <h2 className="ts-card__title">行星</h2>
              {loading && <p className="ts-page__note">本地计算中…</p>}
              <PlanetTable planets={chart.planets} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">宫位</h2>
              <HouseTable houses={chart.houses} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">主要相位（≤8°）</h2>
              <AspectGrid aspects={chart.aspects} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">AI 解读</h2>
              <label className="ts-field-block">
                问题（可选）
                <textarea
                  value={question}
                  maxLength={5000}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </label>
              <div className="ts-ai-actions">
                <button className="ts-btn" disabled={aiBusy} onClick={onAnalyze}>
                  {aiBusy ? 'AI 解读中…' : 'AI 深度解读'}
                </button>
                {aiBusy && (
                  <button className="ts-btn ts-btn--ghost" onClick={ai.cancel}>
                    取消
                  </button>
                )}
              </div>
              {ai.error && <div className="ts-alert ts-alert--error">{ai.error}</div>}
              {aiText && (
                <div className="ts-ai-panel">
                  <div className="ts-ai-panel__body">{aiText}</div>
                  <div className="ts-ai-panel__boundary">
                    解释边界：本解读基于传统占星模型，仅供文化研究与自我参照，不构成任何决策依据。
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default NatalPage;
