// 修正：IT-1.1/1.2/1.3/1.7、IT-2.3 依据；任务包2.1 接入解盘引擎
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateBaziChartFromInput } from '@core/bazi/input';
import { PageTopbar } from '../../components/PageTopbar';
import { ReportExportButton } from '../../components/ReportExportButton';
import { PrivacyHint } from '../../components/PrivacyHint';
import { SolutionPanel, type SolutionSource } from '../../components/solution/SolutionPanel';
import { baziSolutionSources } from '../../lib/solution/solutionContext';
import { runSolutionForBazi } from '../../lib/full-chart-engine/solution-context';
import { L0SummaryCard } from '../../components/fortune/L0SummaryCard';
import {
  DayMasterRelationCard,
  type DayMasterRelationInput,
} from './components/CompatibilityDualChart';
import {
  CompatibilityEvidenceCard,
  type SummaryFactInput,
} from './components/CompatibilityEvidenceCard';
import { useAiChat } from '../../hooks/useAiChat';
import { useFortuneCache } from '../../hooks/useFortuneCache';
import { trackChartSubmit } from '../../lib/analytics';
import { SeoHead } from '../../components/SeoHead';

interface PersonInput {
  name: string;
  gender: 'male' | 'female';
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
}

interface CompatData {
  prompt?: string;
  resultSummary?: {
    people?: unknown;
    dayMasterRelation?: unknown;
    spousePalaceRelations?: unknown;
    summaryFact?: unknown;
  };
}

const emptyPerson = (gender: 'male' | 'female'): PersonInput => ({
  name: '',
  gender,
  dateType: 'solar',
  year: 1990,
  month: 1,
  day: 1,
  timeIndex: 6,
});

const DEFAULT_QUESTION = '请从传统合婚模型的角度分析双方日主关系与配偶宫关系。';

function validatePerson(p: PersonInput, label: string): string | null {
  if (!Number.isInteger(p.year) || p.year < 1900 || p.year > 2100)
    return `${label}：出生年需在 1900-2100 之间`;
  if (!Number.isInteger(p.month) || p.month < 1 || p.month > 12)
    return `${label}：月份需在 1-12 之间`;
  if (!Number.isInteger(p.day) || p.day < 1 || p.day > 31) return `${label}：日期需在 1-31 之间`;
  if (!Number.isInteger(p.timeIndex) || p.timeIndex < 0 || p.timeIndex > 12)
    return `${label}：时辰索引需在 0-12 之间`;
  return null;
}

function asObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
}
function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined;
}
function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}
function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === 'string') as string[];
}
function formatApiError(json: { error?: { message?: string } }): string {
  return json?.error?.message || '请求失败';
}

// 5.2 内容补缺：基于双方日主十神关系推导相处模式与建议（规则化，不显示分数）。
type TenGodCategory = '比和' | '我生' | '生我' | '我克' | '克我';
const TEN_GOD_CATEGORY: Record<string, TenGodCategory> = {
  比肩: '比和',
  劫财: '比和',
  食神: '我生',
  伤官: '我生',
  正印: '生我',
  偏印: '生我',
  正财: '我克',
  偏财: '我克',
  正官: '克我',
  七杀: '克我',
};
const COHABIT_ADVICE: Record<TenGodCategory, { mode: string; advice: string }> = {
  比和: {
    mode: '同气共振',
    advice:
      '双方气场相近、想法易同频，相处自然轻松；但同质化也易缺乏互补，建议保留各自独立空间与兴趣，避免小事上互不相让。',
  },
  我生: {
    mode: '滋养输出',
    advice:
      '你方生扶对方，关系里多有付出与照顾；注意平衡给予与接受，避免长期单向消耗，也别忘了表达自身需求。',
  },
  生我: {
    mode: '被滋养接纳',
    advice:
      '对方生扶你方，你能在关系中获得支持与安定；可主动回馈，让滋养双向流动，减少一方过度承担。',
  },
  我克: {
    mode: '吸引掌控',
    advice: '你方对对方有自然的吸引与主导感；关系中需多一份尊重与商量，避免因掌控欲盖过倾听。',
  },
  克我: {
    mode: '张力磨合',
    advice:
      '双方存在克制的张力，磨合中易有压力与分歧；建议以沟通与包容消解对立，把张力转化为互相督促的动力。',
  },
};

export function CompatibilityPage() {
  const navigate = useNavigate();
  const [p1, setP1] = useState<PersonInput>(emptyPerson('male'));
  const [p2, setP2] = useState<PersonInput>(emptyPerson('female'));
  const [question, setQuestion] = useState('');
  const [data, setData] = useState<CompatData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analyze, reset, cancel, status, streamingContent, turns, error: aiError } = useAiChat();

  const cache = useFortuneCache({
    scope: `bazi-compat:${p1.gender}:${p1.year}-${p1.month}-${p1.day}-${p1.timeIndex}-${p2.gender}:${p2.year}-${p2.month}-${p2.day}-${p2.timeIndex}`,
    gender: 'mixed',
    dateType: p1.dateType,
    year: p1.year,
    month: p1.month,
    day: p1.day,
    timeIndex: p1.timeIndex,
  });

  const updateP1 = useCallback(
    <K extends keyof PersonInput>(k: K, v: PersonInput[K]) => setP1((p) => ({ ...p, [k]: v })),
    [],
  );
  const updateP2 = useCallback(
    <K extends keyof PersonInput>(k: K, v: PersonInput[K]) => setP2((p) => ({ ...p, [k]: v })),
    [],
  );

  const dayMaster = useMemo<DayMasterRelationInput | null>(() => {
    const o = asObject(data?.resultSummary?.dayMasterRelation);
    if (!o) return null;
    return {
      person1Gan: asString(o.person1Gan),
      person1Wuxing: asString(o.person1Wuxing),
      person2Gan: asString(o.person2Gan),
      person2Wuxing: asString(o.person2Wuxing),
      person1ToPerson2: asString(o.person1ToPerson2),
      person2ToPerson1: asString(o.person2ToPerson1),
      person2GanAsPerson1TenGod: asString(o.person2GanAsPerson1TenGod),
      person1GanAsPerson2TenGod: asString(o.person1GanAsPerson2TenGod),
      promptText: asString(o.promptText),
      sources: asStringArray(o.sources),
      limitation: asString(o.limitation),
    };
  }, [data]);

  const summary = useMemo<SummaryFactInput | null>(() => {
    const o = asObject(data?.resultSummary?.summaryFact);
    if (!o) return null;
    return {
      factKeys: asStringArray(o.factKeys),
      crossPillarRelationCount: asNumber(o.crossPillarRelationCount),
      spousePalaceRelationCount: asNumber(o.spousePalaceRelationCount),
      crossBranchCombinationCount: asNumber(o.crossBranchCombinationCount),
      tenGodMappingCount: asNumber(o.tenGodMappingCount),
      favorableCoverageCount: asNumber(o.favorableCoverageCount),
      unfavorableCoverageCount: asNumber(o.unfavorableCoverageCount),
      unavailableCoverageCount: asNumber(o.unavailableCoverageCount),
      promptText: asString(o.promptText),
      sources: asStringArray(o.sources),
      limitation: asString(o.limitation),
    };
  }, [data]);

  const spouseText = useMemo(() => {
    const o = asObject(data?.resultSummary?.spousePalaceRelations);
    return o ? asString(o.promptText) : undefined;
  }, [data]);

  // 5.2 相处建议（无分数）：由日主十神关系推导模式与建议。
  const cohabit = useMemo(() => {
    const rel = dayMaster?.person1ToPerson2;
    if (!rel) return null;
    const cat = TEN_GOD_CATEGORY[rel] ?? '比和';
    const info = COHABIT_ADVICE[cat];
    return { rel, mode: info.mode, advice: info.advice };
  }, [dayMaster]);

  // 任务包2.1：解盘引擎 L0 白话结论（本地补算双方排盘作为引擎上下文）
  const solutionSources = useMemo<SolutionSource[]>(() => {
    if (!data) return [];
    const out: SolutionSource[] = [];
    try {
      out.push(...baziSolutionSources(calculateBaziChartFromInput(p1), '本人命盘'));
      out.push(...baziSolutionSources(calculateBaziChartFromInput(p2), '对方命盘'));
    } catch {
      /* 补算失败则不显示引擎解读区，不影响原有展示 */
    }
    return out;
  }, [data, p1, p2]);

  // 首屏 L0 结论卡：以本人（p1）命盘跑解盘引擎；双人盘详细对照留在下方 SolutionPanel
  const p1Solution = useMemo(() => {
    if (!data) return null;
    try {
      return runSolutionForBazi(calculateBaziChartFromInput(p1));
    } catch {
      return null;
    }
  }, [data, p1]);

  const onSubmit = useCallback(async () => {
    setError(null);
    reset();
    const e1 = validatePerson(p1, '本人');
    if (e1) {
      setError(e1);
      return;
    }
    const e2 = validatePerson(p2, '对方');
    if (e2) {
      setError(e2);
      return;
    }
    const cached = cache.get<CompatData>();
    if (cached) {
      setData(cached);
      try {
        trackChartSubmit({ mode: 'bazi-compatibility', trueSolarTime: false });
      } catch {
        /* noop */
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/bazi/compatibility/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person1: p1,
          person2: p2,
          question: question.trim() || DEFAULT_QUESTION,
          promptTopic: 'marriage',
          responseMode: 'summary',
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(formatApiError(json));
      setData(json.data as CompatData);
      cache.set(json.data);
      try {
        trackChartSubmit({ mode: 'bazi-compatibility', trueSolarTime: false });
      } catch {
        /* noop */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [p1, p2, question, cache, reset]);

  const onAi = useCallback(() => {
    if (data?.prompt) analyze(data.prompt);
  }, [data, analyze]);

  const aiText = streamingContent || (turns.length > 0 ? turns[turns.length - 1].content : '');
  const aiBusy = status === 'loading' || status === 'streaming';

  const renderPerson = (
    label: string,
    p: PersonInput,
    upd: <K extends keyof PersonInput>(k: K, v: PersonInput[K]) => void,
  ) => (
    <fieldset className="ts-fieldset">
      <legend>{label}</legend>
      <div className="ts-form-grid">
        <label>
          姓名
          <input value={p.name} onChange={(e) => upd('name', e.target.value)} />
        </label>
        <label>
          性别
          <select
            value={p.gender}
            onChange={(e) => upd('gender', e.target.value as 'male' | 'female')}
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>
        <label>
          历法
          <select
            value={p.dateType}
            onChange={(e) => upd('dateType', e.target.value as 'solar' | 'lunar')}
          >
            <option value="solar">公历</option>
            <option value="lunar">农历</option>
          </select>
        </label>
        <label>
          年
          <input
            type="number"
            value={p.year}
            onChange={(e) => upd('year', Number(e.target.value))}
          />
        </label>
        <label>
          月
          <input
            type="number"
            value={p.month}
            onChange={(e) => upd('month', Number(e.target.value))}
          />
        </label>
        <label>
          日
          <input type="number" value={p.day} onChange={(e) => upd('day', Number(e.target.value))} />
        </label>
        <label>
          时辰 (0-12)
          <input
            type="number"
            min={0}
            max={12}
            value={p.timeIndex}
            onChange={(e) => upd('timeIndex', Math.max(0, Math.min(12, Number(e.target.value))))}
          />
        </label>
      </div>
    </fieldset>
  );

  return (
    <div className="ts-page ts-page--bazi-compat">
      <SeoHead
        title="八字合婚 · 命律 TempoSoul"
        description="传统八字合婚分析，对比双方日主关系与配偶宫，给出契合度解读。"
      />
      <PageTopbar title="八字合婚" onBack={() => navigate(-1)} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">八字合婚</h1>

        <section className="ts-card">
          <h2 className="ts-card__title">双人出生信息</h2>
          {renderPerson('本人', p1, updateP1)}
          {renderPerson('对方', p2, updateP2)}
          <label className="ts-field-block">
            问题（可选，AI 解读使用）
            <textarea
              value={question}
              maxLength={5000}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </label>
          <button className="ts-btn ts-btn--primary" disabled={loading} onClick={onSubmit}>
            {loading ? '合盘中…' : '开始合盘'}
          </button>
          {error && (
            <div className="ts-alert ts-alert--error" role="alert">
              {error}
            </div>
          )}
        </section>

        {data && p1Solution && (
          <L0SummaryCard
            output={{ pro: p1Solution.pro, meta: p1Solution.meta }}
            title="合婚 · 一句话结论（以本人命盘）"
          />
        )}

        {data && (
          <SolutionPanel
            sources={solutionSources}
            title="详细解读 · 双方命盘"
            boundary="解释边界：本解读由本地解盘引擎按传统命理规则生成，仅供文化研究与自我参照，不构成任何决策依据，不显示匹配分数或成功率。"
          />
        )}

        {data && (
          <section className="ts-card">
            <h2 className="ts-card__title">日主关系</h2>
            <DayMasterRelationCard relation={dayMaster} />
            <h3 className="ts-card__subtitle">配偶宫关系</h3>
            {spouseText ? (
              <div className="ts-spouse-palace">
                <p>{spouseText}</p>
              </div>
            ) : (
              <div className="ts-empty">当前合盘未返回配偶宫关系文本</div>
            )}
            <h3 className="ts-card__subtitle">证据汇总</h3>
            <CompatibilityEvidenceCard summary={summary} />
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
              <ReportExportButton type="hehun" subject={`${p1.name}-${p2.name}`} />
            </div>
            {aiText && (
              <div className="ts-ai-panel">
                <div className="ts-ai-panel__body">{aiText}</div>
                <div className="ts-ai-panel__boundary">
                  解释边界：本内容基于传统合婚模型，仅供文化研究与自我参照，不构成任何决策依据，不显示匹配分数或成功率。
                </div>
              </div>
            )}
          </section>
        )}

        {data && cohabit && (
          <section className="ts-card">
            <h2 className="ts-card__title">相处建议</h2>
            <div className="ts-cohabit-mode">
              <span className="ts-cohabit-mode__tag">{cohabit.mode}</span>
              <span className="ts-cohabit-mode__rel">日主关系：{cohabit.rel}</span>
            </div>
            <p className="ts-cohabit-advice">{cohabit.advice}</p>
            <p className="ts-cohabit-boundary">
              说明：以上为基于双方日主五行生克与十神关系的文化参考，仅作相处视角的提示，不计算、不显示匹配分数或成功率。
            </p>
          </section>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default CompatibilityPage;
