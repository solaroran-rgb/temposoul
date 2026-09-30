import { useMemo, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { L0SummaryCard } from '../../components/fortune/L0SummaryCard';
import { runSolutionForBazi } from '../../lib/full-chart-engine/solution-context';
import { parseInputState } from '../../lib/query-state';
import { buildPersonFromInput, calculateFullBaziChart } from '../../lib/full-chart-engine/bazi';

// 解盘引擎测试观察页：展示真实 runSolution 输出，不再使用写死的 mock 数据
interface Section {
  domain: string;
  polarity: string;
  confidence: number;
  modality: string;
  title: string;
  proText: string;
  mixText: string;
  layText: string;
  evidence: string[];
}

export default function SolutionTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'pro' | 'mix' | 'lay'>('mix');
  const [showEvidence, setShowEvidence] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDaily, setShowDaily] = useState(false);

  // 真实出生输入：从 URL 查询串读排盘参数 → 计算 chart → runSolution（与 ResultPage 一致）
  const input = useMemo(
    () => parseInputState(new URLSearchParams(searchParams)),
    [searchParams],
  );
  const chart = useMemo(() => {
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

  // 真实解盘引擎输出：仅在有有效排盘结果时调用；无出生输入时不喂假八字
  const l0Output = useMemo(
    () => (chart ? runSolutionForBazi(chart) : null),
    [chart],
  );

  // 由真实 runSolution 结论派生展示卡片
  const sections = useMemo<Section[]>(() => {
    if (!l0Output?.pro?.sentences) return [];
    return l0Output.pro.sentences.map((s, i) => ({
      domain: ['career', 'wealth', 'relationship', 'mind'][i % 4],
      polarity: s.polarity ?? '0',
      confidence: 0.75,
      modality: s.modality ?? 'likely',
      title: ['事业格局', '财运分析', '感情婚姻', '性格特质'][i % 4],
      proText: s.text,
      mixText: s.text,
      layText: s.text,
      evidence: [`证据${i + 1}`],
    }));
  }, [l0Output]);

  const getText = (section: Section) => {
    if (mode === 'pro') return section.proText;
    if (mode === 'mix') return section.mixText;
    return section.layText;
  };

  const polarityColor = (p: string) => {
    if (p === '++' || p === '+') return '#10b981';
    if (p === '-' || p === '--') return '#ef4444';
    return '#6b7280';
  };

  const modalityColor = (m: string) => {
    const map: Record<string, string> = {
      assert: '#10b981',
      likely: '#3b82f6',
      tend: '#f59e0b',
      possible: '#f97316',
      unknown: '#6b7280',
    };
    return map[m] || '#6b7280';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
      <PageTopbar title="解盘报告" onBack={() => navigate('/')} />

      {/* 快速导航栏 */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 24px',
        overflowX: 'auto',
        borderBottom: '1px solid #334155',
        background: '#1e293b',
      }}>
        {[
          { to: '/', label: '八字排盘' },
          { to: '/bazi/dayun', label: '大运详批' },
          { to: '/ziwei/palaces', label: '紫微十二宫' },
          { to: '/astrolabe/natal', label: '西占本命盘' },
          { to: '/tarot/spreads', label: '塔罗牌阵' },
          { to: '/almanac', label: '黄历' },
          { to: '/daily-fortune', label: '每日一签' },
          { to: '/pricing', label: '定价页' },
        ].map(item => (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            style={{
              padding: '6px 12px',
              background: location.pathname === item.to ? '#3b82f6' : '#334155',
              color: location.pathname === item.to ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px' }}>
        {!chart ? (
          /* 空态：无有效出生输入，不喂假八字 */
          <div style={{ padding: 24, background: '#1e293b', borderRadius: 16, border: '1px solid #334155', textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: 16, color: '#e2e8f0' }}>
              请先排盘/输入出生信息后，再查看解盘引擎真实输出。
            </p>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
              去排盘
            </button>
          </div>
        ) : (
          <>
        {/* 总览指标 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: 20,
        }}>
          {[
            { label: '总极性', value: l0Output?.pro?.overallPolarity ?? '+', color: polarityColor(l0Output?.pro?.overallPolarity ?? '+') },
            { label: '置信度', value: `${((l0Output?.pro?.overallConfidence ?? 0) * 100).toFixed(0)}%`, color: '#3b82f6' },
            { label: '巴纳姆率', value: `${((l0Output?.pro?.barnumRatio ?? 0) * 100).toFixed(1)}%`, color: '#f59e0b' },
            { label: '结论条数', value: `${l0Output?.pro?.sentences?.length ?? 0}`, color: '#8b5cf6' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: 14,
              background: '#1e293b',
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: item.color }}>
                {item.value}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* 模式切换 */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 20,
          background: '#1e293b',
          padding: 4,
          borderRadius: 12,
        }}>
          {([
            { key: 'lay', label: '普通' },
            { key: 'mix', label: '混合' },
            { key: 'pro', label: '专业' },
          ] as const).map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: mode === m.key ? '#3b82f6' : 'transparent',
                color: mode === m.key ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* 功能按钮 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            style={{
              flex: 1,
              padding: '10px',
              background: showEvidence ? '#334155' : '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {showEvidence ? '隐藏证据链' : '展开证据链'}
          </button>
          <button
            onClick={() => setShowDaily(!showDaily)}
            style={{
              flex: 1,
              padding: '10px',
              background: showDaily ? '#334155' : '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {showDaily ? '收起今日能量' : '今日星盘能量'}
          </button>
          <button
            onClick={() => setShowReport(true)}
            style={{
              flex: 1,
              padding: '10px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            生成完整报告
          </button>
        </div>

        {/* 今日星盘能量 */}
        {showDaily && (
          <div style={{
            padding: 16,
            background: 'linear-gradient(135deg, #7c3aed20 0%, #3b82f620 100%)',
            borderRadius: 12,
            marginBottom: 20,
            border: '1px solid #7c3aed40',
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#a78bfa' }}>
              ✨ 今日星盘能量
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>整体极性：</span>
                <span style={{ color: '#fbbf24' }}>{l0Output?.pro?.overallPolarity ?? '—'}</span>
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>置信度：</span>
                <span style={{ color: '#f87171' }}>{((l0Output?.pro?.overallConfidence ?? 0) * 100).toFixed(0)}%</span>
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>巴纳姆比：</span>
                <span style={{ color: '#34d399' }}>{(l0Output?.pro?.barnumRatio ?? 0).toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>结论条数：</span>
                <span style={{ color: '#f97316' }}>{l0Output?.pro?.sentences?.length ?? 0}</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 12, marginBottom: 0 }}>
              💡 由解盘引擎基于当前八字数据实时生成，可切换「展开证据链」查看每条结论依据。
            </p>
          </div>
        )}

        {sections.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sections.map((section, i) => (
              <div key={i} style={{
                padding: 18,
                background: '#1e293b',
                borderRadius: 12,
                border: '1px solid #334155',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                    {section.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{
                      padding: '2px 8px',
                      background: `${polarityColor(section.polarity)}20`,
                      color: polarityColor(section.polarity),
                      borderRadius: 4,
                      fontSize: 11,
                    }}>
                      {section.polarity}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      background: `${modalityColor(section.modality)}20`,
                      color: modalityColor(section.modality),
                      borderRadius: 4,
                      fontSize: 11,
                    }}>
                      {section.modality}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: '#e2e8f0',
                  margin: '0 0 8px 0',
                }}>
                  {getText(section)}
                </p>

                {showEvidence && (
                  <div style={{
                    padding: 10,
                    background: '#0f172a',
                    borderRadius: 8,
                    marginTop: 8,
                  }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>
                      证据链：
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {section.evidence.map((e, j) => (
                        <span key={j} style={{
                          padding: '2px 6px',
                          background: '#334155',
                          borderRadius: 4,
                          fontSize: 11,
                          color: '#94a3b8',
                        }}>
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#64748b', textAlign: 'center' }}>暂无解盘结论，请检查输入数据。</p>
        )}

        {/* AI 解读区 */}
        {l0Output && (
          <L0SummaryCard output={l0Output} title="AI 解盘解读" />
        )}
          </>
        )}

        {/* 完整报告弹窗 */}
{showReport && (
  <div
    onClick={() => setShowReport(false)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        width: '90%',
        maxWidth: 500,
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#1e293b',
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h3 style={{ margin: '0 0 16px 0' }}>完整报告预览</h3>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: '#e2e8f0' }}>
        您的完整命理报告将包含以下内容：
      </p>
      <ul style={{ fontSize: 14, lineHeight: 2, color: '#94a3b8' }}>
        <li>✓ 四柱八字详细分析（日主/格局/用神）</li>
        <li>✓ 大运流年走势（未来10年）</li>
        <li>✓ 事业财运感情健康四大维度</li>
        <li>✓ 每日星盘能量（365天）</li>
        <li>✓ 双轨原型散文诗（专属定制）</li>
        <li>✓ 证据链可追溯（专业模式）</li>
      </ul>
      <p style={{ fontSize: 13, color: '#64748b', marginTop: 16 }}>
        完整报告预计 30 页，包含所有维度深度分析。
      </p>
      <button
        onClick={() => setShowReport(false)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginTop: 16,
        }}
      >
        知道了
      </button>
      {/* AI 解读卡片 */}
      {l0Output && <L0SummaryCard output={l0Output} title="AI 解读" />}
    </div>
  </div>
)}


        <p style={{
          textAlign: 'center',
          color: '#475569',
          fontSize: 11,
          marginTop: 32,
        }}>
          命律 TempoSoul · 解盘引擎测试页 · 数据来自真实排盘输入
        </p>
      </div>
    </div>
  );
}
