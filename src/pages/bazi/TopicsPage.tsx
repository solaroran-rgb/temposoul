// src/pages/bazi/TopicsPage.tsx · IT-5.10 / IT-5.11-11 依据；不携 baziFortuneScope
// 修正：cache 解构稳定化；topic 切换依赖仅 activeTopic；错误分级；中文标签；无 input 不渲染 tabs
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { TopicTabs, TOPIC_LABEL, isTopic, type Topic } from './components/TopicTabs';
import { TopicEvidencePanel } from './components/TopicEvidencePanel';
import { useAiChat } from '../../hooks/useAiChat';
import { useFortuneCache } from '../../hooks/useFortuneCache';
import { trackChartSubmit } from '../../lib/analytics';
import './bazi-topics.css';

interface BirthInput {
  gender: 'male' | 'female';
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
}

interface BaziCalcData {
  pillars?: unknown;
  tenGods?: unknown;
  pillarRelations?: unknown;
  analysis?: unknown;
}

interface BaziPromptData {
  prompt?: string;
}

const DEFAULT_QUESTIONS: Record<Topic, string> = {
  career: '请从传统八字模型的角度分析此命盘在事业方向上的特征。',
  wealth: '请从传统八字模型的角度分析此命盘在财运方面的特征。',
  marriage: '请从传统八字模型的角度分析此命盘在婚姻感情方面的特征。',
  health: '请从传统八字模型的角度分析此命盘在健康倾向方面的特征（非医疗建议）。',
};

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

function parseIntStrict(v: string | null): number | null {
  if (v === null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

function parseInput(sp: URLSearchParams): BirthInput | null {
  const g = sp.get('gender');
  const dt = sp.get('dateType');
  const y = parseIntStrict(sp.get('year'));
  const m = parseIntStrict(sp.get('month'));
  const d = parseIntStrict(sp.get('day'));
  const ti = parseIntStrict(sp.get('timeIndex'));
  if (g !== 'male' && g !== 'female') return null;
  if (dt !== 'solar' && dt !== 'lunar') return null;
  if (y === null || y < YEAR_MIN || y > YEAR_MAX) return null;
  if (m === null || m < 1 || m > 12) return null;
  if (d === null || d < 1 || d > 31) return null;
  if (ti === null || ti < 0 || ti > 12) return null;
  return { gender: g, dateType: dt, year: y, month: m, day: d, timeIndex: ti };
}

function formatApiError(json: { error?: { message?: string } }): string {
  return json?.error?.message || '请求失败';
}

export function TopicsPage() {
  const navigate = useNavigate();
  const { topic } = useParams<{ topic: string }>();
  const [sp] = useSearchParams();

  const [calcData, setCalcData] = useState<BaziCalcData | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstTrackRef = useRef(false);

  const { analyze, reset, cancel, status, streamingContent, turns, error: aiError } = useAiChat();

  // reset 可能每次渲染都不稳定引用 —— 用 ref 保存，避免进入 effect 依赖
  const resetRef = useRef(reset);
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  const input = useMemo(() => parseInput(sp), [sp]);
  const activeTopic: Topic = isTopic(topic) ? topic : 'career';

  // 非法 topic → replace 到 career，保留查询串
  useEffect(() => {
    if (topic && !isTopic(topic)) {
      const qs = sp.toString();
      navigate(`/bazi/topics/career${qs ? `?${qs}` : ''}`, { replace: true });
    }
  }, [topic, sp, navigate]);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  // 关键修复：解构为稳定的 cacheGet / cacheSet，避免 cache 对象引用进入依赖
  const { get: cacheGet, set: cacheSet } = useFortuneCache({
    scope: 'bazi-topics',
    gender: input?.gender ?? 'male',
    dateType: input?.dateType ?? 'solar',
    year: input?.year ?? 0,
    month: input?.month ?? 0,
    day: input?.day ?? 0,
    timeIndex: input?.timeIndex ?? 0,
    ttlScope: 'natal',
  });

  // 首次加载 / 出生信息变更：先缓存命中，再网络请求
  useEffect(() => {
    if (!input) {
      setCalcData(null);
      setError('URL 参数缺失或非法，请从结果页进入');
      setLoading(false);
      return;
    }

    const cached = cacheGet<BaziCalcData>();
    if (cached) {
      setCalcData(cached);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch('/api/v1/bazi/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: '',
            gender: input.gender,
            dateType: input.dateType,
            year: input.year,
            month: input.month,
            day: input.day,
            timeIndex: input.timeIndex,
          }),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(formatApiError(json));
        if (cancelled) return;
        const data = json.data as BaziCalcData;
        setCalcData(data);
        cacheSet(data);
        if (!firstTrackRef.current) {
          firstTrackRef.current = true;
          try {
            trackChartSubmit({ mode: 'bazi-topics', trueSolarTime: false });
          } catch {
            /* 埋点失败不阻塞主流程 */
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '未知错误');
          setCalcData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input, cacheGet, cacheSet]);

  // 切换 topic：仅重置 AI 与问题（不依赖 reset 引用，用 ref 规避不稳定）
  useEffect(() => {
    resetRef.current?.();
    setQuestion('');
  }, [activeTopic]);

  const onAnalyze = useCallback(async () => {
    if (!input) return;
    setError(null);
    try {
      const res = await fetch('/api/v1/bazi/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          gender: input.gender,
          dateType: input.dateType,
          year: input.year,
          month: input.month,
          day: input.day,
          timeIndex: input.timeIndex,
          question: question.trim() || DEFAULT_QUESTIONS[activeTopic],
          promptTopic: activeTopic,
          responseMode: 'summary',
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(formatApiError(json));
      const p = (json.data as BaziPromptData)?.prompt;
      if (p) analyze(p);
      else setError('未返回可解读提示词');
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    }
  }, [input, activeTopic, question, analyze]);

  const aiText = streamingContent || (turns.length > 0 ? turns[turns.length - 1].content : '');
  const aiBusy = status === 'loading' || status === 'streaming';

  return (
    <div className="ts-page ts-page--bazi-topics">
      <PageTopbar title="八字主题解读" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">八字主题解读</h1>

        {input && (
          <p className="ts-page__note">
            {input.gender === 'male' ? '男' : '女'}｜{input.dateType === 'solar' ? '公历' : '农历'}
            ｜{input.year}-{input.month}-{input.day}｜时辰索引 {input.timeIndex}
          </p>
        )}

        {/* 无 input 时不渲染 tabs（避免误导用户可切换） */}
        {input && <TopicTabs active={activeTopic} />}

        {error && (
          <div className="ts-alert ts-alert--error" role="alert">
            {error}
          </div>
        )}

        {loading && !calcData && (
          <section className="ts-card">
            <p className="ts-page__note">排盘中…</p>
          </section>
        )}

        {calcData && (
          <section className="ts-card">
            <h2 className="ts-card__title">证据</h2>
            <TopicEvidencePanel
              tenGods={calcData.tenGods}
              pillarRelations={calcData.pillarRelations}
              analysis={calcData.analysis}
            />
          </section>
        )}

        {calcData && (
          <section className="ts-card">
            <h2 className="ts-card__title">AI 主题解读 · {TOPIC_LABEL[activeTopic]}</h2>
            <label className="ts-field-block">
              问题（可选）
              <textarea
                value={question}
                placeholder={DEFAULT_QUESTIONS[activeTopic]}
                maxLength={5000}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </label>
            <div className="ts-ai-actions">
              <button className="ts-btn ts-btn--primary" disabled={aiBusy} onClick={onAnalyze}>
                {aiBusy ? 'AI 解读中…' : 'AI 深度解读'}
              </button>
              {aiBusy && (
                <button className="ts-btn ts-btn--ghost" onClick={cancel}>
                  取消
                </button>
              )}
            </div>
            {aiError && <div className="ts-alert ts-alert--error">{aiError}</div>}
            {aiText && (
              <div className="ts-ai-panel">
                <div className="ts-ai-panel__body">{aiText}</div>
                <div className="ts-ai-panel__boundary">
                  解释边界：本解读基于传统文化模型，仅供文化研究与自我参照，不构成任何决策依据。
                </div>
              </div>
            )}
          </section>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default TopicsPage;
