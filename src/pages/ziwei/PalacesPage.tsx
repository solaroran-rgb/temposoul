// 修正：接入 useFortuneCache；埋点只在首次成功计算时触发
// 任务包2.3：接入解盘引擎（紫微十四主星逐宫解读）
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { PalaceTable } from './components/PalaceTable';
import { ZiweiScopeSwitcher } from './components/ZiweiScopeSwitcher';
import { SolutionPanel } from '../../components/solution/SolutionPanel';
import { ziweiSolutionSources } from '../../lib/solution/solutionContext';
import { runSolution } from '@core/solution/semantic';
import {
  L0SummaryCard,
  type L0SummarySource,
  type L0SummarySentence,
} from '../../components/fortune/L0SummaryCard';
import { useAiChat } from '../../hooks/useAiChat';
import { useFortuneCache } from '../../hooks/useFortuneCache';
import {
  computeZiweiLocal,
  buildZiweiPrompt,
  type ZiweiInput,
  type ZiweiRuntime,
  type ZiweiChart,
} from './lib/localZiwei';
import { trackChartSubmit } from '../../lib/analytics';
import { SeoHead } from '../../components/SeoHead';
import './ziwei-palaces.css';

const DEFAULT_QUESTION = '请结合十二宫、四化与大限，给出该命盘的整体解读。';

type Algorithm = ZiweiRuntime['algorithm'];
type School = ZiweiRuntime['school'];
type Scope = 'decadal' | 'yearly';

function parseInput(sp: URLSearchParams): ZiweiInput | null {
  const genderRaw = sp.get('gender');
  const dateTypeRaw = sp.get('dateType');
  const year = Number(sp.get('year'));
  const month = Number(sp.get('month'));
  const day = Number(sp.get('day'));
  const timeIndex = Number(sp.get('timeIndex'));
  if (genderRaw !== 'male' && genderRaw !== 'female') return null;
  if (dateTypeRaw !== 'solar' && dateTypeRaw !== 'lunar') return null;
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  if (!Number.isInteger(timeIndex) || timeIndex < 0 || timeIndex > 12) return null;
  return { gender: genderRaw, dateType: dateTypeRaw, year, month, day, timeIndex };
}

export function PalacesPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [algorithm, setAlgorithm] = useState<Algorithm>('default');
  const [school, setSchool] = useState<School>('sanhe');
  const [scope, setScope] = useState<Scope>('decadal');
  const [question, setQuestion] = useState('');
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [degraded, setDegraded] = useState<string | null>(null);
  const ai = useAiChat();
  const firstTrackRef = useRef(false);

  const input = useMemo(() => parseInput(sp), [sp]);

  const cache = useFortuneCache({
    scope: 'ziwei-palaces',
    gender: input?.gender ?? 'male',
    dateType: input?.dateType ?? 'solar',
    year: input?.year ?? 0,
    month: input?.month ?? 0,
    day: input?.day ?? 0,
    timeIndex: input?.timeIndex ?? 0,
    school,
    extra: { algorithm, school },
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

    const cached = cache.get<ZiweiChart>();
    if (cached) {
      setChart(cached);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const c = await computeZiweiLocal(input, { algorithm, school });
        if (cancelled) return;
        setChart(c);
        cache.set(c);
        if (!firstTrackRef.current) {
          firstTrackRef.current = true;
          try {
            trackChartSubmit({ mode: 'ziwei-palaces', trueSolarTime: false });
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
  }, [input, algorithm, school, cache]);

  const onAnalyze = useCallback(() => {
    if (!input || !chart) return;
    const prompt = buildZiweiPrompt(
      chart,
      input,
      { algorithm, school },
      scope,
      question.trim() || DEFAULT_QUESTION,
    );
    ai.analyze(prompt);
  }, [input, chart, algorithm, school, scope, question, ai]);

  const aiText =
    ai.streamingContent || (ai.turns.length > 0 ? ai.turns[ai.turns.length - 1].content : '');
  const aiBusy = ai.status === 'loading' || ai.status === 'streaming';

  // 任务包2.3：解盘引擎 L0 白话结论（逐主星）
  const solutionSources = useMemo(() => ziweiSolutionSources(chart), [chart]);

  // 首屏 L0 结论卡：紫微不走八字引擎，逐星 runSolution 的白话句去重汇总成宽松 L0 source，
  // 结论文句与下方 SolutionPanel 同源（不硬塞八字算法）。
  const ziweiL0 = useMemo<L0SummarySource | null>(() => {
    if (solutionSources.length === 0) return null;
    const sentences: L0SummarySentence[] = [];
    const seen = new Set<string>();
    for (const src of solutionSources) {
      if (!src.context || Object.keys(src.context).length === 0) continue;
      try {
        const out = runSolution({ context: src.context, termIds: src.termIds });
        for (const s of out.pro.sentences) {
          if (seen.has(s.text)) continue;
          seen.add(s.text);
          sentences.push({ text: s.text, polarity: s.polarity, modality: s.modality });
        }
      } catch {
        /* 单星异常不阻塞 */
      }
    }
    if (sentences.length === 0) return null;
    return { pro: { sentences } };
  }, [solutionSources]);

  return (
    <div className="ts-page ts-page--ziwei-palaces">
      <SeoHead
        title="紫微斗数命盘 · 命律 TempoSoul"
        description="紫微斗数十二宫排盘与四化解读，含主星逐宫分析。"
      />
      <PageTopbar title="紫微命盘深化" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">紫微命盘深化</h1>

        {degraded && <div className="ts-alert ts-alert--info">{degraded}</div>}
        {error && (
          <div className="ts-alert ts-alert--error" role="alert">
            {error}
          </div>
        )}

        {input && (
          <section className="ts-card">
            <h2 className="ts-card__title">命盘信息</h2>
            <p className="ts-page__note">
              {input.gender === 'male' ? '男' : '女'}｜
              {input.dateType === 'solar' ? '公历' : '农历'}｜{input.year}-{input.month}-{input.day}
              ｜时辰索引 {input.timeIndex}
            </p>
            <ZiweiScopeSwitcher
              algorithm={algorithm}
              school={school}
              scope={scope}
              onAlgorithmChange={setAlgorithm}
              onSchoolChange={setSchool}
              onScopeChange={setScope}
            />
          </section>
        )}

        {chart && (
          <section className="ts-card">
            <h2 className="ts-card__title">十二宫</h2>
            {loading && <p className="ts-page__note">本地引擎重算中…</p>}
            <PalaceTable palaces={chart.palaces} />
          </section>
        )}

        {chart && ziweiL0 && (
          <L0SummaryCard output={ziweiL0} title="紫微命盘 · 一句话结论" />
        )}

        {chart && (
          <SolutionPanel
            sources={solutionSources}
            title="详细解读 · 十四主星"
            boundary="解释边界：本解读由本地解盘引擎按传统紫微模型生成，仅供文化研究与自我参照，不构成任何决策依据。"
          />
        )}

        {chart && (
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
                  解释边界：本解读基于传统紫微模型，仅供文化研究与自我参照，不构成任何决策依据。
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

export default PalacesPage;
