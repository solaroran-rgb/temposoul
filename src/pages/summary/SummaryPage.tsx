/**
 * SummaryPage · 综合汇总页
 * 聚合多个排盘引擎结果，去重后按类别分组展示。
 *
 * 数据来源：
 * - 八字命盘 (bazi)：/api/v1/bazi/calculate + runSolutionForBazi（真算）
 * - 紫微斗数 (ziwei)：computeZiweiLocal / iztro（本地真算）
 * - 八宅风水 (bazhai)：calculateBazhaiBaseChart（本地真算）
 * - 其余类别：尚无本命真算引擎，保留确定性语料占位并显式标注「内容待引擎接入」
 * - 西洋星盘 (astrolabe)、七政四余 (qizheng)、奇门遁甲 (qimen)、大六壬 (liuren)
 * - 太乙 (taiyi)、六爻 (liuyao)、梅花易数 (meihua)、小六壬 (xiaoliuren)、签筒 (chughtai)
 */
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { L0SummaryCard } from '@/components/fortune/L0SummaryCard';
import { runSolutionForBazi } from '@/lib/full-chart-engine/solution-context';
import { computeZiweiLocal } from '@/pages/ziwei/lib/localZiwei';
import { calculateBazhaiBaseChart } from '@/lib/bazhai-chart';
import { parseBirthInput, formatApiError, type BirthInput } from '@/types/page-state';
import { buildBirthSignature, dateKey } from '@/lib/hash';
import { djb2, safeParseIntBase36 } from '@/lib/hash';
import { DAILY_CORPUS, type DailyTheme } from '@/data/bazi/daily-corpus';
import { EvidenceItem, FortuneEvidenceCard } from '@/components/fortune/FortuneEvidenceCard';
import { SeoHead } from '@/components/SeoHead';

type ChartType = 'bazi' | 'ziwei' | 'astrolabe' | 'qizheng' | 'qimen' | 'liuren' | 'taiyi' | 'liuyao' | 'meihua' | 'xiaoliuren' | 'chughtai' | 'bazhai';

const CHART_TYPES: Array<{ key: ChartType; label: string; icon: string }> = [
  { key: 'bazi', label: '八字命盘', icon: '🪷' },
  { key: 'ziwei', label: '紫微斗数', icon: '⭐' },
  { key: 'astrolabe', label: '西洋星盘', icon: '🌟' },
  { key: 'qizheng', label: '七政四余', icon: '☀️' },
  { key: 'qimen', label: '奇门遁甲', icon: '🚪' },
  { key: 'liuren', label: '大六壬', icon: '💧' },
  { key: 'taiyi', label: '太乙神数', icon: '🔮' },
  { key: 'liuyao', label: '六爻预测', icon: '🪙' },
  { key: 'meihua', label: '梅花易数', icon: '🌸' },
  { key: 'xiaoliuren', label: '小六壬', icon: '📿' },
  { key: 'chughtai', label: '签筒求签', icon: '🎋' },
  { key: 'bazhai', label: '八宅风水', icon: '🏠' },
];

interface CalcResult {
  type: ChartType;
  ok: boolean;
  /** 语料占位（真算引擎未接入），UI 需显式标注而非伪装成真算 */
  placeholder?: boolean;
  error?: string;
  l0Output?: {
    pro: {
      sentences: Array<{ text: string; polarity?: string; modality?: string }>;
      overallPolarity?: string;
      overallConfidence?: number;
      barnumRatio?: number;
    };
  };
  evidence?: EvidenceItem[];
}

export function SummaryPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Map<ChartType, CalcResult>>(new Map());

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);
  const onBack = useCallback(() => navigate(-1), [navigate]);

  // 从出生数据计算所有图表类型
  const calcAll = useCallback(async (birthInput: BirthInput) => {
    const newResults = new Map<ChartType, CalcResult>();

    // 1. 八字命盘
    try {
      const res = await fetch('/api/v1/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthInput),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(formatApiError(json));

      const baziData = json.data;
      const l0Output = runSolutionForBazi(baziData);

      newResults.set('bazi', {
        type: 'bazi',
        ok: true,
        l0Output,
        evidence: [
          { id: 'b1', label: '四柱干支', value: `${baziData.pillars?.year}/${baziData.pillars?.month}/${baziData.pillars?.day}/${baziData.pillars?.hour}`, confidence: 'verified' },
          { id: 'b2', label: '五行强弱', value: '已计算', confidence: 'verified' },
          { id: 'b3', label: '十神格局', value: '已分析', confidence: 'probable' },
        ],
      });
    } catch (e) {
      newResults.set('bazi', { type: 'bazi', ok: false, error: e instanceof Error ? e.message : '计算失败' });
    }

    // 2. 紫微斗数（本地真算：复用 localZiwei / iztro，BirthInput 即 ZiweiInput）
    try {
      const zwChart = await computeZiweiLocal(birthInput, { algorithm: 'default', school: 'sanhe' });
      const mingPalace = zwChart.palaces.find((p) => p.name.includes('命宫'));
      const mingStars = mingPalace?.majorStars?.length ? mingPalace.majorStars.join('、') : '星盘已排定';
      newResults.set('ziwei', {
        type: 'ziwei',
        ok: true,
        l0Output: {
          pro: {
            sentences: [
              { text: `紫微斗数排盘完成：共 ${zwChart.palaces.length} 宫，命宫主星为 ${mingStars}。`, polarity: '0', modality: 'likely' },
            ],
            overallPolarity: '0',
            overallConfidence: 0.72,
            barnumRatio: 0.2,
          },
        },
        evidence: [
          { id: 'zw-1', label: '命宫主星', value: mingStars, confidence: 'verified' },
          { id: 'zw-2', label: '宫位数', value: `${zwChart.palaces.length} 宫`, confidence: 'verified' },
          { id: 'zw-3', label: '算法流派', value: 'default / sanhe', confidence: 'verified' },
        ],
      });
    } catch (e) {
      newResults.set('ziwei', { type: 'ziwei', ok: false, error: e instanceof Error ? e.message : '紫微计算失败' });
    }

    // 3. 八宅风水（本地真算：复用 bazhai-chart，仅需出生年月日+性别）
    try {
      const bz = calculateBazhaiBaseChart({
        year: birthInput.year,
        month: birthInput.month,
        day: birthInput.day,
        gender: birthInput.gender,
      });
      const luckyN = Array.isArray(bz.luckyDirections) ? bz.luckyDirections.length : 0;
      const unluckyN = Array.isArray(bz.unluckyDirections) ? bz.unluckyDirections.length : 0;
      newResults.set('bazhai', {
        type: 'bazhai',
        ok: true,
        l0Output: {
          pro: {
            sentences: [
              { text: `八宅命卦为 ${String(bz.mingGua)}，属${String(bz.mingGroup)}。`, polarity: '0', modality: 'likely' },
            ],
            overallPolarity: '0',
            overallConfidence: 0.72,
            barnumRatio: 0.2,
          },
        },
        evidence: [
          { id: 'bz-1', label: '命卦', value: String(bz.mingGua), confidence: 'verified' },
          { id: 'bz-2', label: '命组', value: String(bz.mingGroup), confidence: 'probable' },
          { id: 'bz-3', label: '吉方/凶方', value: `${luckyN} / ${unluckyN}`, confidence: 'probable' },
        ],
      });
    } catch (e) {
      newResults.set('bazhai', { type: 'bazhai', ok: false, error: e instanceof Error ? e.message : '八宅计算失败' });
    }

    // 4-12. 其余占卜系统：本页仅有出生数据（无经纬度/无问事），尚无本命真算引擎接入；
    //       保留确定性语料占位，并在文案与证据链上显式标注「内容待引擎接入」，不伪装成真算。
    const dk = dateKey();
    const sig = buildBirthSignature(birthInput);
    const seed = djb2(`${dk}|${sig}`);

    const placeholderTypes: ChartType[] = ['astrolabe', 'qizheng', 'qimen', 'liuren', 'taiyi', 'liuyao', 'meihua', 'xiaoliuren', 'chughtai'];

    for (let i = 0; i < placeholderTypes.length; i++) {
      const type = placeholderTypes[i];
      const label = CHART_TYPES.find((t) => t.key === type)?.label ?? type;
      const typeSeed = djb2(`${seed}|${type}`);
      const intSeed = safeParseIntBase36(typeSeed);

      // 从对应语料池选取内容（仅作占位展示）
      const theme: DailyTheme = ['focus', 'advice', 'reminder'][i % 3] as DailyTheme;
      const corpus = DAILY_CORPUS[theme];
      const sentenceIdx = intSeed === null ? 0 : intSeed % Math.max(1, corpus.groups?.[0]?.main?.length ?? 1);
      const mainText = corpus.groups?.[0]?.main?.[sentenceIdx % (corpus.groups[0].main?.length ?? 1)] ?? '暂无内容';

      newResults.set(type, {
        type,
        ok: true,
        placeholder: true,
        l0Output: {
          pro: {
            sentences: [
              { text: `【${label}·语料占位】内容待引擎接入：${mainText}`, polarity: '0', modality: 'likely' },
            ],
            overallPolarity: '0',
            overallConfidence: 0.5,
            barnumRatio: 0.5,
          },
        },
        evidence: [
          { id: `${type}-1`, label: '引擎接入状态', value: '内容待引擎接入', confidence: 'probable' },
        ],
      });
    }

    return newResults;
  }, []);

  // 初始化计算
  useEffect(() => {
    if (!input) {
      setState('error');
      setError('缺少出生信息，请从排盘入口进入');
      return;
    }

    let cancelled = false;
    setState('loading');
    setError(null);

    (async () => {
      try {
        const res = await calcAll(input);
        if (cancelled) return;
        setResults(res);
        setState('ok');
      } catch (e) {
        if (cancelled) return;
        setState('error');
        setError(e instanceof Error ? e.message : '初始化失败');
      }
    })();

    return () => { cancelled = true; };
  }, [input, calcAll]);

  // 按类别分组去重后的结论
  const groupedConclusions = useMemo(() => {
    const groups: Record<string, Array<{ type: ChartType; output: NonNullable<CalcResult['l0Output']>; evidence?: EvidenceItem[] }>> = {};

    for (const [type, result] of results.entries()) {
      if (!result.ok || !result.l0Output) continue;
      const category = CHART_TYPES.find(t => t.key === type)?.label ?? type;
      if (!groups[category]) groups[category] = [];
      groups[category].push({ type, output: result.l0Output, evidence: result.evidence });
    }

    return groups;
  }, [results]);

  // 所有结论合并去重
  const allSentences = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ text: string; polarity?: string; modality?: string; source: string }> = [];

    for (const [type, result] of results.entries()) {
      if (!result.ok || !result.l0Output || result.placeholder) continue;
      const label = CHART_TYPES.find(t => t.key === type)?.label ?? type;
      for (const s of result.l0Output.pro.sentences) {
        if (seen.has(s.text)) continue;
        seen.add(s.text);
        out.push({ ...s, source: label });
      }
    }

    return out;
  }, [results]);

  if (state === 'error') {
    return (
      <div className="ts-page">
        <PageTopbar title="综合汇总" onBack={onBack} />
        <main className="ts-page__main">
          <div className="ts-empty">
            <p>{error ?? '加载失败'}</p>
            <button className="ts-btn ts-btn--primary" onClick={onBack}>回到排盘入口</button>
          </div>
        </main>
        <PrivacyHint />
      </div>
    );
  }

  return (
    <div className="ts-page ts-page--summary">
      <SeoHead
        title="综合命理分析 · 命律 TempoSoul"
        description="聚合八字、紫微、八宅等多引擎排盘结果，一站式综合命理解读。"
      />
      <PageTopbar title="综合汇总" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">命盘综合分析</h1>
        <p className="ts-page__note">共 {results.size} 个占卜系统已计算</p>

        {state === 'loading' && <div className="ts-empty">分析中…</div>}

        {state === 'ok' && (
          <>
            {/* 综合结论区 */}
            {allSentences.length > 0 && (
              <section className="ts-card">
                <h2 className="ts-card__title">综合结论摘要</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {allSentences.map((s, i) => (
                    <li key={`${s.source}-${i}`} style={{
                      padding: '8px 0',
                      borderBottom: i < allSentences.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      color: '#e2e8f0',
                      fontSize: 14,
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: 12, marginRight: 8 }}>{s.source}</span>
                      {s.text}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 分类展示区 */}
            {Object.entries(groupedConclusions).map(([category, items]) => (
              <section key={category} className="ts-card" style={{ marginBottom: 16 }}>
                <h2 className="ts-card__title">{category}</h2>
                {items.map(({ type, output, evidence }) => (
                  <div key={type} style={{ marginBottom: 16 }}>
                    {output && (
                      <L0SummaryCard
                        output={output}
                        title={CHART_TYPES.find(t => t.key === type)?.label}
                        previewCount={3}
                      />
                    )}
                    {evidence && evidence.length > 0 && (
                      <FortuneEvidenceCard
                        title="证据链"
                        items={evidence}
                      />
                    )}
                  </div>
                ))}
              </section>
            ))}

            {/* 各系统状态网格 */}
            <section className="ts-card">
              <h2 className="ts-card__title">系统状态</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                {CHART_TYPES.map(({ key, label, icon }) => {
                  const result = results.get(key);
                  const tone = !result?.ok
                    ? { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)', color: '#fb7185', text: '✗ 失败' }
                    : result.placeholder
                      ? { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: '#fbbf24', text: '⏳ 待接入' }
                      : { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', color: '#34d399', text: '✓ 完成' };
                  return (
                    <div key={key} style={{
                      padding: 12,
                      borderRadius: 8,
                      background: tone.bg,
                      border: `1px solid ${tone.border}`,
                    }}>
                      <div style={{ fontSize: 20 }}>{icon}</div>
                      <div style={{ fontSize: 13, color: '#e2e8f0', marginTop: 4 }}>{label}</div>
                      <div style={{ fontSize: 11, color: tone.color, marginTop: 2 }}>
                        {tone.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <p className="ts-page__note" style={{ marginTop: 24, textAlign: 'center', color: '#64748b' }}>
          解释边界：本分析基于传统文化模型，仅供文化研究与自我参照，不构成任何决策依据。
        </p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default SummaryPage;
