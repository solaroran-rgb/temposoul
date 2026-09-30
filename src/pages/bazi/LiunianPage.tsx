// 修正：IT-1.1/1.2/1.3/1.7/1.9、IT-2.2 依据 + 契约 §4（targetYear 硬约束）+ 缓存策略 + 流月窗口
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateLiuyue } from '@temposoul/core/bazi';
import { PageTopbar } from '../../components/PageTopbar';
import { ReportExportButton } from '../../components/ReportExportButton';
import { PrivacyHint } from '../../components/PrivacyHint';
import { LiunianTimeline, type LiunianItem } from './components/LiunianTimeline';
import { AnnualTenGodPanel } from './components/AnnualTriggerList';
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
  liunian?: unknown;
  tenGods?: unknown;
  pillarRelations?: unknown;
  dayMaster?: { gan: string };
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

const DEFAULT_QUESTION = '请分析此命盘目标流年的十神与干支关系。';
const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

function validateBirth(b: BirthInput): string | null {
  if (!Number.isInteger(b.year) || b.year < YEAR_MIN || b.year > YEAR_MAX)
    return `出生年需在 ${YEAR_MIN}-${YEAR_MAX} 之间`;
  if (!Number.isInteger(b.month) || b.month < 1 || b.month > 12) return '月份需在 1-12 之间';
  if (!Number.isInteger(b.day) || b.day < 1 || b.day > 31) return '日期需在 1-31 之间';
  if (!Number.isInteger(b.timeIndex) || b.timeIndex < 0 || b.timeIndex > 12)
    return '时辰索引需在 0-12 之间';
  return null;
}

function validateTargetYear(y: number): string | null {
  if (!Number.isInteger(y)) return '目标年必须为整数';
  if (y < YEAR_MIN || y > YEAR_MAX) return `目标年需在 ${YEAR_MIN}-${YEAR_MAX} 之间`;
  return null;
}

function normalizeLiunian(raw: unknown, dayMasterGan?: string): LiunianItem[] {
  if (!Array.isArray(raw)) return [];
  const out: LiunianItem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const it = raw[i];
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    const year = typeof o.year === 'number' ? o.year : Number(o.year);
    if (!Number.isFinite(year)) continue;
    const monthWindows = dayMasterGan
      ? Array.from({ length: 12 }, (_, m) => {
          try {
            const info = calculateLiuyue(year, m + 1, dayMasterGan);
            return { startDate: info.startDate, endDate: info.endDate };
          } catch {
            return null;
          }
        }).filter((w): w is NonNullable<typeof w> => w !== null)
      : undefined;
    out.push({
      year,
      age: typeof o.age === 'number' ? o.age : Number(o.age) || 0,
      ganZhi: typeof o.ganZhi === 'string' ? o.ganZhi : '-',
      tenGod: typeof o.tenGod === 'string' ? o.tenGod : '-',
      tenGodZhi: typeof o.tenGodZhi === 'string' ? o.tenGodZhi : '-',
      monthWindows,
    });
  }
  return out;
}

function formatApiError(json: { error?: { message?: string } }): string {
  return json?.error?.message || '请求失败';
}

export function LiunianPage() {
  const navigate = useNavigate();
  const [birth, setBirth] = useState<BirthInput>(initialBirth);
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [question, setQuestion] = useState('');
  const [calcData, setCalcData] = useState<BaziCalcData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analyze, reset, cancel, status, streamingContent, turns, error: aiError } = useAiChat();

  const cache = useFortuneCache({
    scope: 'bazi-liunian',
    gender: birth.gender,
    dateType: birth.dateType,
    year: birth.year,
    month: birth.month,
    day: birth.day,
    timeIndex: birth.timeIndex,
    targetYear,
  });

  const update = useCallback(<K extends keyof BirthInput>(k: K, v: BirthInput[K]) => {
    setBirth((p) => ({ ...p, [k]: v }));
  }, []);

  const liunian = useMemo(
    () => normalizeLiunian(calcData?.liunian, calcData?.dayMaster?.gan),
    [calcData],
  );
  const evidence: EvidenceItem[] = useMemo(
    () => relationsToEvidence(calcData?.pillarRelations),
    [calcData],
  );
  const selected = useMemo(
    () => liunian.find((l) => l.year === targetYear) ?? null,
    [liunian, targetYear],
  );

  // 解盘引擎接入：排盘结果 → runSolution → L0 白话结论（流年页，直接展示）
  const l0Output = useMemo(() => (calcData ? runSolutionForBazi(calcData) : null), [calcData]);

  // F04 · AI 追问框上下文：流年目标年 + 流年干支 + 日主 + L0 结论摘要
  const aiContextPrompt = useMemo(() => {
    if (!calcData) return '';
    const l0Text = (l0Output?.pro?.sentences ?? [])
      .map((s: { text?: string }) => s.text)
      .filter(Boolean)
      .join(' ');
    const selectedYear = liunian.find((l) => l.year === targetYear);
    return [
      `【八字流年】${birth.name ? `${birth.name}，` : ''}${birth.gender === 'male' ? '男' : '女'}，${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')}，目标 ${targetYear} 年`,
      calcData.dayMaster?.gan && `日主：${calcData.dayMaster.gan}`,
      selectedYear && `流年：${targetYear} ${selectedYear.ganZhi ?? ''}`,
      l0Text && `L0 结论：${l0Text}`,
    ]
      .filter(Boolean)
      .join('\n');
  }, [calcData, l0Output, birth, targetYear, liunian]);

  // L0 结论卡时间窗：目标流年（当年窗口）
  const l0TimeWindow = useMemo<L0TimeWindow[]>(
    () => [
      {
        scale: 'current',
        label: `${targetYear} 流年${selected?.ganZhi ? ` · ${selected.ganZhi}` : ''}`,
        detail: '当年运势窗口，可结合流月进一步细化节奏',
        share: 1,
      },
    ],
    [targetYear, selected],
  );

  const onSubmit = useCallback(async () => {
    setError(null);
    reset();
    const v1 = validateBirth(birth);
    if (v1) {
      setError(v1);
      return;
    }
    const v2 = validateTargetYear(targetYear);
    if (v2) {
      setError(v2);
      return;
    }
    const cached = cache.get<BaziCalcData>();
    if (cached) {
      setCalcData(cached);
      try {
        trackChartSubmit({ mode: 'bazi-liunian', trueSolarTime: false });
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
        trackChartSubmit({ mode: 'bazi-liunian', trueSolarTime: false });
      } catch {
        /* noop */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [birth, targetYear, cache, reset]);

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
          baziFortuneScope: 'year',
          baziFortuneYear: targetYear,
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
  }, [calcData, birth, question, targetYear, analyze]);

  const aiText = streamingContent || (turns.length > 0 ? turns[turns.length - 1].content : '');
  const aiBusy = status === 'loading' || status === 'streaming';

  return (
    <div className="ts-page ts-page--bazi-liunian">
      <PageTopbar title="八字流年" onBack={() => navigate(-1)} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">八字流年</h1>

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
            <label>
              目标年
              <input
                type="number"
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
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
            <h2 className="ts-card__title">流年时间轴</h2>
            {l0Output && (
              <L0SummaryCard output={l0Output} title="当年运势白话解读" timeWindow={l0TimeWindow} />
            )}
            <LiunianTimeline items={liunian} targetYear={targetYear} />
            <h3 className="ts-card__subtitle">目标年干支十神</h3>
            <AnnualTenGodPanel item={selected} targetYear={targetYear} />
            <h3 className="ts-card__subtitle">四柱关系证据</h3>
            <FortuneEvidenceCard title="流年证据" items={evidence} />
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
            <div className="ts-ai-actions">
              <ReportExportButton type="liunian" subject={birth.name} />
            </div>
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
              resetKey={`bazi-liunian-${birth.year}-${birth.month}-${birth.day}-${birth.timeIndex}-${targetYear}`}
            />
          </section>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default LiunianPage;
