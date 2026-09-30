import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { PageTopbar } from '../components/PageTopbar';
import { parseInputState } from '../lib/query-state';
import { buildPersonFromInput, calculateFullBaziChart } from '../lib/full-chart-engine/bazi';
import { runSolutionForBazi } from '../lib/full-chart-engine/solution-context';
import { L0SummaryCard } from '../components/fortune/L0SummaryCard';
import { EngineStepsCard } from '../components/solution/EngineStepsCard';
import { DepthSelector, depthPanelTitle, type DepthLevel } from '../components/DepthSelector';
import { RelatedNavLinks } from '../components/RelatedNavLinks';
import { solution } from '@temposoul/core';
import type { BaziChartResult } from '@temposoul/core/bazi';
import { SeoHead } from '../components/SeoHead';

/**
 * 命律 · 主结果页
 * 已接入解盘引擎：顶部展示 runSolution 的 L0 白话结论，下方保留四柱数据展示
 * 后续可在此基础上做 L0-L4 渐进下钻
 */
export function ResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // F01 · 深度游标：L0 事实层 / L1 术语层 / L2 白话层 / L3 散文层 / L4 决策层
  const [depth, setDepth] = useState<DepthLevel>('L2');

  const input = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return parseInputState(params);
  }, [searchParams]);

  const chart = useMemo<BaziChartResult | null>(() => {
    try {
      const person = buildPersonFromInput({
        gender: input.gender,
        year: input.year,
        month: input.month,
        day: input.day,
        timeIndex: input.timeIndex,
        dateType: input.dateType,
        isLeapMonth: input.isLeapMonth,
        useTrueSolarTime: input.useTrueSolarTime,
        birthHour: input.birthHour,
        birthMinute: input.birthMinute,
        birthPlace: input.birthPlace,
        birthLongitude: input.birthLongitude,
        applyChinaDst: input.applyChinaDst,
      });
      return calculateFullBaziChart(person);
    } catch (e) {
      console.error('排盘计算失败:', e);
      return null;
    }
  }, [input]);

  const pillars = chart?.pillars;

  // 解盘引擎接入：排盘结果 → runSolution → L0 白话结论
  const solutionOutput = useMemo(
    () => (chart ? runSolutionForBazi(chart) : null),
    [chart],
  );

  // F01 · 各深度层展示数据派生
  // L0 事实层 / L1 术语层 → pro（术语原文）；L2 白话层 → lay（通俗解读）
  const pathForDepth = useMemo(() => {
    if (!solutionOutput) return null;
    if (depth === 'L0' || depth === 'L1') return solutionOutput.pro;
    if (depth === 'L2') return solutionOutput.lay;
    if (depth === 'L4') return solutionOutput.pro; // 决策层建议仍取 pro 的原子依据
    return null;
  }, [solutionOutput, depth]);

  // 每层句数徽标（sentenceCount）
  const depthCounts = useMemo(() => {
    if (!solutionOutput) return {};
    return {
      L0: solutionOutput.pro?.sentences?.length ?? 0,
      L1: solutionOutput.pro?.sentences?.length ?? 0,
      L2: solutionOutput.lay?.sentences?.length ?? 0,
      L3: solutionOutput.meta?.atoms?.length ?? 0,
      L4: solutionOutput.meta?.atoms?.length ?? 0,
    };
  }, [solutionOutput]);

  // L3 散文层：直接使用 runSolution 输出的专属散文诗（G02 同盘同诗 · 单一事实源，
  // 不在页面重复生成，避免刷新变诗；降级态由 ProseLayerCard 给出说明而非编造）
  const prosePoem = useMemo(
    () => (depth === 'L3' ? (solutionOutput?.prose ?? null) : null),
    [depth, solutionOutput],
  );

  // P0-3 · 无出生数据 / 排盘解析失败时的友好兜底，避免白屏无引导
  const hasBirthData = Boolean(input.year && input.month && input.day);
  const parseFailed = hasBirthData && !chart;

  if (!hasBirthData || !chart) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0e1a',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: 22 }}>
          {parseFailed ? '出生信息解析失败' : '请先输入出生信息'}
        </h2>
        <p
          style={{
            margin: '0 0 24px',
            color: '#94a3b8',
            fontSize: 14,
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          {parseFailed
            ? '当前链接中的出生信息无法完成排盘，请返回重新填写。'
            : '填写出生信息后，即可生成你的专属命理报告。'}
        </p>
        <Link to="/" className="primary-button">
          去排盘
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0' }}>
      <SeoHead
        title="八字排盘结果 · 命律 TempoSoul"
        description="基于出生时间的四柱八字命盘排盘结果，含十神、日主关系与 AI 白话解盘。"
      />
      <PageTopbar
        title="命理报告"
        onBack={() => navigate('/')}
      />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        {/* 基本信息 */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
        }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>
            {input.name || '命主'} · {input.gender === 'male' ? '男' : '女'}
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 14 }}>
            {input.year}年{input.month}月{input.day}日 · 时辰索引 {input.timeIndex}
            {input.useTrueSolarTime && ' · 真太阳时'}
          </p>
        </div>

        {/* F01 · 深度游标 L0-L4：文字化五段式切换（禁纯图形滑块），拖动/点击切换深度 */}
        {solutionOutput && (
          <div style={{ marginBottom: 24 }}>
            <DepthSelector
              activeLevel={depth}
              onChange={setDepth}
              sentenceCount={depthCounts}
            />
            {/* 深度面板：随游标切换内容层 */}
            <div
              aria-live="polite"
              style={{ marginTop: 12 }}
            >
              {depth === 'L3' ? (
                <ProseLayerCard poem={prosePoem} />
              ) : depth === 'L4' ? (
                <DecisionLayerCard output={solutionOutput} />
              ) : (
                <L0SummaryCard
                  output={pathForDepth ? { pro: pathForDepth, meta: solutionOutput.meta } : null}
                  title={depthPanelTitle(depth)}
                />
              )}
            </div>
          </div>
        )}

        {/* 7.1 排盘后问题钩子：情绪化追问，引导深度互动 */}
        <div style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 12,
          padding: '16px 18px',
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#c7d2fe', marginBottom: 10 }}>
            ✨ 这一刻的星空，你最想了解什么？
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {
              [
                { q: '今年什么时候该出手？', to: '/bazi/dayun' },
                { q: '我的财运卡点在哪？', to: '/bazi/topics/wealth' },
                { q: '感情何时明朗？', to: '/bazi/topics/marriage' },
                { q: '健康要注意哪些阶段？', to: '/bazi/topics/health' },
              ].map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#e2e8f0',
                    fontSize: 13,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {item.q}
                </button>
              ))
            }
          </div>
        </div>

        {/* H01 · 功能跳转矩阵：八字 → 大运 → 流年 → 择日 等自然跳转 */}
        <RelatedNavLinks title="继续探索" />

        {/* 科学验证区 */}
        <EngineStepsCard evidenceTrail={chart?.evidenceTrail ?? null} />

        {/* 四柱 */}
        {pillars && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>四柱八字</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <PillarCard label="年柱" value={pillars.year.ganZhi} />
              <PillarCard label="月柱" value={pillars.month.ganZhi} />
              <PillarCard label="日柱" value={pillars.day.ganZhi} />
              <PillarCard label="时柱" value={pillars.hour.ganZhi} />
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            className="secondary-button"
          >
            重新排盘
          </button>
          <button
            onClick={() => navigate('/bazi/dayun')}
            className="primary-button"
          >
            查看大运 →
          </button>
        </div>

        {/* 9.1 付费 CTA 漏斗：排盘后即时引导付费 */}
        <div style={{
          marginTop: 28,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(201,162,39,0.10))',
          border: '1px solid rgba(201,162,39,0.4)',
          borderRadius: 14,
          padding: '20px 22px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#fbbf24', marginBottom: 6 }}>
            解锁完整命理报告
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            大运流年 · 十神深度解读 · 每日运势推送 · 无限次解盘
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="primary-button"
          >
            立即升级会员 →
          </button>
        </div>
      </div>
    </div>
  );
}

function PillarCard({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.2)',
      borderRadius: 8,
      padding: '16px 12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: '#fbbf24' }}>
        {value || '—'}
      </div>
    </div>
  );
}

// ─── F01 · L3 散文层卡片 ─────────────────────────────────────────────────────────
// 数据来源：散文诗生成器（R3-13 generateProsePoem），降级时给出说明而非编造
function ProseLayerCard({ poem }: { poem: solution.ProsePoem | null }) {
  if (!poem) {
    return (
      <section
        aria-label="散文层 · 意象化表达"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '18px 20px',
        }}
      >
        <h3 style={{ margin: '0 0 10px', fontSize: 16, color: '#e2e8f0' }}>✍️ 散文层 · 意象化表达</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#94a3b8' }}>
          当前命盘信息不足，暂未生成专属散文诗，可先查看事实层与白话层。
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="散文层 · 意象化表达"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(255,255,255,0.03))',
        border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: 12,
        padding: '18px 20px',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, color: '#e2e8f0' }}>✍️ 散文层 · 意象化表达</h3>
      <div style={{ fontStyle: 'italic', lineHeight: 2, color: '#f1f5f9', fontSize: 15 }}>
        {poem.lines.map((l) => (
          <p key={l.atom_id} style={{ margin: '0 0 6px' }}>
            {l.text}
          </p>
        ))}
        <p style={{ margin: '6px 0 0', color: '#a5b4fc' }}>{poem.anchor_line}</p>
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 12, color: '#94a3b8' }}>
        意象锚定 · {poem.archetype}（信息增益 {poem.ig_score.toFixed(2)} · 反巴纳姆{' '}
        {poem.passed_barnum_check ? '通过' : '待复核'}）
      </p>
      {poem.degraded && (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#fbbf24' }}>
          已降级：{poem.degradation_reason ?? '信息不足'}，以下为通用陪伴短句。
        </p>
      )}
    </section>
  );
}

// ─── F01 · L4 决策层卡片 ─────────────────────────────────────────────────────────
// 数据来源：runSolution meta.atoms（原子结论 → 决策建议），禁编造
function DecisionLayerCard({ output }: { output: solution.SolutionOutput }) {
  const atoms = output.meta?.atoms ?? [];
  const overall = output.pro?.overallPolarity ?? '0';
  const confidence = output.pro?.overallConfidence;

  // 按时间作用域聚类原子结论，形成「可行动」窗口
  const timeScopes = new Map<string, number>();
  for (const a of atoms) {
    const scope = a.time_scope ?? 'general';
    timeScopes.set(scope, (timeScopes.get(scope) ?? 0) + 1);
  }
  const topScopes = [...timeScopes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  const scopeLabel: Record<string, string> = {
    event: '近期事件窗（1-3 个月）',
    current: '当下运势窗（12 个月内）',
    long_term: '长期底色（10 年以上）',
    general: '常态参考',
  };

  const tone =
    overall === '++' || overall === '+'
      ? { icon: '▶', label: '可推进', color: '#34d399' }
      : overall === '--' || overall === '-'
        ? { icon: '■', label: '宜守成', color: '#fb7185' }
        : { icon: '◉', label: '先观察', color: '#94a3b8' };

  return (
    <section
      aria-label="决策层 · 行动建议"
      style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 12,
        padding: '18px 20px',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, color: '#e2e8f0' }}>🎯 决策层 · 行动建议</h3>

      {/* 总体行动基调 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 14,
      }}>
        <span style={{
          flex: 'none',
          width: 34,
          height: 34,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          fontWeight: 700,
          color: tone.color,
          background: `${tone.color}1f`,
        }}>
          {tone.icon}
        </span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: tone.color }}>
            整体基调 · {tone.label}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            置信度 {typeof confidence === 'number' && Number.isFinite(confidence) ? `${(confidence * 100).toFixed(0)}%` : '—'} · 依据 {atoms.length} 条原子结论
          </div>
        </div>
      </div>

      {/* 建议执行顺序（按时间作用域） */}
      {topScopes.length > 0 && (
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600, marginBottom: 8 }}>
            建议节奏
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {topScopes.map(([scope, n]) => (
              <div
                key={scope}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.04)',
                  borderLeft: '3px solid #6366f1',
                  borderRadius: 6,
                  padding: '8px 12px',
                }}
              >
                <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0' }}>
                  {scopeLabel[scope] ?? scope}
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  {n} 条结论
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ margin: '14px 0 0', color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>
        决策参考：以上建议由原子结论按时间作用域聚类生成，供自我参照，不构成投资、医疗或法律建议。
      </p>
    </section>
  );
}
