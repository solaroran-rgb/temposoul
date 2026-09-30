// 修正：IT-1.1/1.2/1.3/1.7/1.9、IT-2.1/2.2 依据 + 契约 §4（targetYear 硬约束）+ 缓存策略
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { DayunTimeline, type DayunCycle } from './components/DayunTimeline';
import { TenGodTable, type TenGodRow } from './components/TenGodTable';
import {
  FortuneEvidenceCard,
  relationsToEvidence,
  type EvidenceItem,
} from '../../components/fortune/FortuneEvidenceCard';
import { L0SummaryCard, type L0TimeWindow } from '../../components/fortune/L0SummaryCard';
import { runSolutionForBazi } from '../../lib/full-chart-engine/solution-context';
import { AIChatBox } from '../../components/AIChatBox';
import { useAiChat } from '../../hooks/useAiChat';
import { useFortuneCache } from '../../hooks/useFortuneCache';
import { trackChartSubmit } from '../../lib/analytics';
import { SeoHead } from '../../components/SeoHead';

interface BirthInput {
  name: string;
  gender: 'male' | 'female';
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
}

interface BaziCalcData {
  pillars?: { year?: string; month?: string; day?: string; hour?: string };
  luckInfo?: { startInfo?: unknown; cycles?: unknown };
  tenGods?: unknown;
  pillarRelations?: unknown;
  analysis?: unknown;
}

interface BaziPromptData {
  prompt?: string;
}

const initialBirth: BirthInput = {
  name: '',
  gender: 'male',
  dateType: 'solar',
  year: 1990,
  month: 1,
  day: 1,
  timeIndex: 6,
};

const DEFAULT_QUESTION = '请分析此命盘的大运走势，并结合十神给出解释。';
const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

function validateBirth(b: BirthInput): string | null {
  if (!Number.isInteger(b.year) || b.year < YEAR_MIN || b.year > YEAR_MAX) {
    return `出生年需在 ${YEAR_MIN}-${YEAR_MAX} 之间`;
  }
  if (!Number.isInteger(b.month) || b.month < 1 || b.month > 12) return '月份需在 1-12 之间';
  if (!Number.isInteger(b.day) || b.day < 1 || b.day > 31) return '日期需在 1-31 之间';
  if (!Number.isInteger(b.timeIndex) || b.timeIndex < 0 || b.timeIndex > 12)
    return '时辰索引需在 0-12 之间';
  return null;
}

function normalizeCycles(raw: unknown): DayunCycle[] {
  if (!raw || typeof raw !== 'object') return [];
  const r = raw as Record<string, unknown>;
  const arr = r.cycles;
  if (!Array.isArray(arr)) return [];
  const out: DayunCycle[] = [];
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    const age = typeof o.age === 'number' ? o.age : Number(o.age);
    const year = typeof o.year === 'number' ? o.year : Number(o.year);
    if (!Number.isFinite(age) || !Number.isFinite(year)) continue;
    out.push({
      age,
      year,
      ganZhi: typeof o.ganZhi === 'string' ? o.ganZhi : '-',
    });
  }
  return out;
}

function normalizeTenGods(raw: unknown): TenGodRow[] {
  if (!raw || typeof raw !== 'object') return [];
  const r = raw as Record<string, unknown>;
  const keys: Array<{ key: string; label: string }> = [
    { key: 'year', label: '年柱' },
    { key: 'month', label: '月柱' },
    { key: 'day', label: '日柱' },
    { key: 'hour', label: '时柱' },
  ];
  const out: TenGodRow[] = [];
  for (const k of keys) {
    const v = r[k.key];
    if (typeof v === 'string' && v.trim()) {
      out.push({ pillar: k.label, tenGod: v });
    }
  }
  return out;
}

function extractStartInfo(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return '';
  const r = raw as Record<string, unknown>;
  if (typeof r.startInfo === 'string') return r.startInfo;
  if (r.startInfo && typeof r.startInfo === 'object') {
    try {
      return JSON.stringify(r.startInfo);
    } catch {
      return '';
    }
  }
  return '';
}

function formatApiError(json: { error?: { message?: string } }): string {
  return json?.error?.message || '请求失败';
}

export function DayunPage() {
  const navigate = useNavigate();
  const [birth, setBirth] = useState<BirthInput>(initialBirth);
  const [question, setQuestion] = useState('');
  const [calcData, setCalcData] = useState<BaziCalcData | null>(null);
  const [selectedCycleIndex, setSelectedCycleIndex] = useState<number>(-1);
  const [showL0, setShowL0] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analyze, reset, cancel, status, streamingContent, turns, error: aiError } = useAiChat();

  const cache = useFortuneCache({
    scope: 'bazi-dayun',
    gender: birth.gender,
    dateType: birth.dateType,
    year: birth.year,
    month: birth.month,
    day: birth.day,
    timeIndex: birth.timeIndex,
  });

  const update = useCallback(<K extends keyof BirthInput>(k: K, v: BirthInput[K]) => {
    setBirth((prev) => ({ ...prev, [k]: v }));
  }, []);

  const cycles = useMemo(() => normalizeCycles(calcData?.luckInfo), [calcData]);
  const tenGods = useMemo(() => normalizeTenGods(calcData?.tenGods), [calcData]);
  const evidence: EvidenceItem[] = useMemo(
    () => relationsToEvidence(calcData?.pillarRelations),
    [calcData],
  );
  const startInfo = useMemo(() => extractStartInfo(calcData?.luckInfo), [calcData]);

  // 解盘引擎接入：排盘结果 → runSolution → L0 白话结论（大运页，按钮展开）
  const l0Output = useMemo(
    () => (calcData ? runSolutionForBazi(calcData) : null),
    [calcData],
  );

  // F04 · AI 追问框上下文：排盘四柱 + 大运 + L0 结论摘要
  const aiContextPrompt = useMemo(() => {
    if (!calcData) return '';
    const pillars = calcData.pillars ?? {};
    const pillarText =
      [
        pillars.year ? `年柱 ${pillars.year}` : null,
        pillars.month ? `月柱 ${pillars.month}` : null,
        pillars.day ? `日柱 ${pillars.day}` : null,
        pillars.hour ? `时柱 ${pillars.hour}` : null,
      ]
        .filter(Boolean)
        .join('，');
    const cyclesText = cycles.map((c) => `${c.year}-${c.year + 9} ${c.ganZhi}`).join('，');
    const l0Text = (l0Output?.pro?.sentences ?? [])
      .map((s: { text?: string }) => s.text)
      .filter(Boolean)
      .join(' ');
    return [
      `【八字大运】${birth.name ? `${birth.name}，` : ''}${birth.gender === 'male' ? '男' : '女'}，${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')}`,
      pillarText && `四柱：${pillarText}`,
      cyclesText && `大运：${cyclesText}`,
      l0Text && `L0 结论：${l0Text}`,
    ]
      .filter(Boolean)
      .join('\n');
  }, [calcData, cycles, l0Output, birth]);

  const onSelectCycle = useCallback((index: number) => {
    setSelectedCycleIndex((prev) => (prev === index ? -1 : index));
  }, []);

  // L0 结论卡时间窗：当前选中（或首步）大运的十年窗口
  const l0TimeWindow = useMemo<L0TimeWindow[]>(() => {
    const c = cycles[selectedCycleIndex] ?? cycles[0];
    if (!c) return [];
    return [
      {
        scale: 'long_term',
        label: `${c.year}-${c.year + 9} 大运 · ${c.ganZhi}`,
        detail: `${c.age} 岁起运，十年一运，代表该阶段的长期底色`,
        share: 1,
      },
    ];
  }, [cycles, selectedCycleIndex]);

  const onSubmit = useCallback(async () => {
    setError(null);
    reset();
    const v = validateBirth(birth);
    if (v) {
      setError(v);
      return;
    }
    setSelectedCycleIndex(-1);
    const cached = cache.get<BaziCalcData>();
    if (cached) {
      setCalcData(cached);
      try {
        trackChartSubmit({ mode: 'bazi-dayun', trueSolarTime: false });
      } catch {
        /* noop */
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birth.name,
          gender: birth.gender,
          dateType: birth.dateType,
          year: birth.year,
          month: birth.month,
          day: birth.day,
          timeIndex: birth.timeIndex,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(formatApiError(json));
      setCalcData(json.data as BaziCalcData);
      cache.set(json.data);
      try {
        trackChartSubmit({ mode: 'bazi-dayun', trueSolarTime: false });
      } catch {
        /* noop */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [birth, cache, reset]);

  const onAi = useCallback(async () => {
    if (!calcData) return;
    try {
      const res = await fetch('/api/v1/bazi/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birth.name,
          gender: birth.gender,
          dateType: birth.dateType,
          year: birth.year,
          month: birth.month,
          day: birth.day,
          timeIndex: birth.timeIndex,
          question: question.trim() || DEFAULT_QUESTION,
          baziFortuneScope: 'dayun',
          baziFortuneCycleIndex: selectedCycleIndex,
          responseMode: 'summary',
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(formatApiError(json));
      const p = (json.data as BaziPromptData)?.prompt;
      if (p) analyze(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    }
  }, [calcData, cycles, selectedCycleIndex, birth, question, analyze]);

  const aiText = streamingContent || (turns.length > 0 ? turns[turns.length - 1].content : '');
  const aiBusy = status === 'loading' || status === 'streaming';

  return (
    <div className="ts-page ts-page--bazi-dayun">
      <SeoHead
        title="八字大运流年 · 命律 TempoSoul"
        description="八字大运走势与十神分析，查看人生各阶段运势起伏。"
      />
      <PageTopbar title="八字大运" onBack={() => navigate(-1)} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">八字大运</h1>

        <section className="ts-card">
          <h2 className="ts-card__title">出生信息</h2>
          <div className="ts-form-grid">
            <label>
              姓名
              <input value={birth.name} onChange={(e) => update('name', e.target.value)} />
            </label>
            <label>
              性别
              <select
                value={birth.gender}
                onChange={(e) => update('gender', e.target.value as 'male' | 'female')}
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </label>
            <label>
              历法
              <select
                value={birth.dateType}
                onChange={(e) => update('dateType', e.target.value as 'solar' | 'lunar')}
              >
                <option value="solar">公历</option>
                <option value="lunar">农历</option>
              </select>
            </label>
            <label>
              年
              <input
                type="number"
                value={birth.year}
                onChange={(e) => update('year', Number(e.target.value))}
              />
            </label>
            <label>
              月
              <input
                type="number"
                value={birth.month}
                onChange={(e) => update('month', Number(e.target.value))}
              />
            </label>
            <label>
              日
              <input
                type="number"
                value={birth.day}
                onChange={(e) => update('day', Number(e.target.value))}
              />
            </label>
            <label>
              时辰 (0-12)
              <input
                type="number"
                min={0}
                max={12}
                value={birth.timeIndex}
                onChange={(e) =>
                  update('timeIndex', Math.max(0, Math.min(12, Number(e.target.value))))
                }
              />
            </label>
          </div>
          <label className="ts-field-block">
            问题（可选，AI 解读使用）
            <textarea
              value={question}
              maxLength={5000}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <button className="ts-btn ts-btn--primary" disabled={loading} onClick={onSubmit}>
            {loading ? '排盘中…' : '开始排盘'}
          </button>
          {error && (
            <div className="ts-alert ts-alert--error" role="alert">
              {error}
            </div>
          )}
        </section>

        {calcData && (
          <section className="ts-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <h2 className="ts-card__title" style={{ margin: 0 }}>
                大运时间轴
              </h2>
              <button
                className="ts-btn"
                disabled={!l0Output}
                onClick={() => setShowL0((v) => !v)}
                aria-expanded={showL0}
              >
                {showL0 ? '收起 AI 解读' : 'AI 解读'}
              </button>
            </div>
            {showL0 && l0Output && (
              <L0SummaryCard output={l0Output} title="大运白话解读" timeWindow={l0TimeWindow} />
            )}
            {startInfo && <p className="ts-page__note">起运：{startInfo}</p>}
            <DayunTimeline
              cycles={cycles}
              selectedIndex={selectedCycleIndex}
              onSelect={onSelectCycle}
            />
            <p className="ts-page__note">点击大运条目以定位 AI 解读的分析目标年</p>
            <h3 className="ts-card__subtitle">四柱十神</h3>
            <TenGodTable rows={tenGods} />
            <h3 className="ts-card__subtitle">四柱关系证据</h3>
            <FortuneEvidenceCard title="大运证据" items={evidence} />
            <div className="ts-ai-actions">
              <button className="ts-btn" disabled={aiBusy} onClick={onAi}>
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
            <AIChatBox
              contextPrompt={aiContextPrompt}
              resetKey={`bazi-dayun-${birth.year}-${birth.month}-${birth.day}-${birth.timeIndex}-${selectedCycleIndex}`}
            />
          </section>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default DayunPage;
