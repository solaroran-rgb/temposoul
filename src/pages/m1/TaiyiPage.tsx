/**
 * 七语 i18n 接入位（本批仅中文，不要求 7 语）
 * TaiyiPage —— 太乙神数 · 年计七十二局排盘页（三式重盘组）
 *
 * 引擎：@temposoul/core/taiyi  generateTaiyi({ year })
 * 能力边界（如实标注）：当前引擎仅开放【年计】；月计/日计/时计因章月、月法、日法、
 *   节气时刻、气应与小余的古籍历法链尚未完成校勘而失败关闭（X1-D-14 待专家）。
 *   本页因此只提供公历年份输入，不输出近似的月/日/时盘。
 *
 * 可视化落地（对照 A6 02 分册 §13 推荐可视化）：
 *   ① 太乙九宫算盘 SVG（四神落宫：太乙/文昌/始击/计神）
 *   ② 主客算（主算/客算/定算）三柱对比
 * 合规：传统文化娱乐参考，不涉医疗/法律/金融建议；引擎异常时显示「排盘数据待补」，不编造盘面。
 */
import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateTaiyi } from '@temposoul/core/taiyi';
import { ParamSnapshot, readParam, numParam } from '@/lib/m1-snapshot';

type TaiyiResult = ReturnType<typeof generateTaiyi>;

/** 太乙八宫 → 后天方位 3×3 格位（行优先：东北/南/西北 · 东/中/西 · 西南/北/东南） */
const CELL_ORDER = [3, 2, 1, 4, 5, 6, 7, 8, 9] as const;
const PALACE_DIR: Record<number, { gua: string; dir: string }> = {
  1: { gua: '乾', dir: '西北' },
  2: { gua: '离', dir: '南' },
  3: { gua: '艮', dir: '东北' },
  4: { gua: '震', dir: '东' },
  5: { gua: '中', dir: '中宫' },
  6: { gua: '兑', dir: '西' },
  7: { gua: '坤', dir: '西南' },
  8: { gua: '坎', dir: '北' },
  9: { gua: '巽', dir: '东南' },
};

const GOD_COLORS: Record<string, string> = {
  太乙: '#E24E4C',
  文昌: '#4C9A6B',
  始击: '#C9A86A',
  计神: '#4A7BA6',
};

const wrapStyle: CSSProperties = {
  maxWidth: 880,
  margin: '0 auto',
  padding: '28px 20px 64px',
  color: 'inherit',
};

const cardStyle: CSSProperties = {
  border: '1px solid rgba(140,150,180,0.25)',
  borderRadius: 12,
  padding: '16px 18px',
  marginBottom: 14,
  background: 'rgba(255,255,255,0.03)',
};

function compute(y: number): { data: TaiyiResult | null; error: string } {
  try {
    return { data: generateTaiyi({ year: y, scope: 'year' }), error: '' };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export default function TaiyiPage() {
  const thisYear = new Date().getFullYear();
  const [searchParams, setSearchParams] = useSearchParams();
  const [yearInput, setYearInput] = useState<number>(() => readParam(searchParams, 'year', thisYear, numParam));
  const [result, setResult] = useState<{ data: TaiyiResult | null; error: string }>(() => compute(thisYear));
  const data = result.data;
  const error = result.error;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const y = Math.trunc(Number(yearInput));
    if (!Number.isFinite(y) || y < 1 || y > 9999) {
      setResult({ data: null, error: '请输入 1-9999 之间的公历年份。' });
      return;
    }
    setResult(compute(y));
    setSearchParams({ year: String(y) }, { replace: true });
  }

  // 四神落宫映射
  const godsAt = useMemo(() => {
    const m: Record<number, { name: string; pos: string }[]> = {};
    if (!data) return m;
    const push = (palace: number, name: string, pos: string) => {
      (m[palace] = m[palace] || []).push({ name, pos });
    };
    push(data.taiyiPalace, '太乙', data.taiyiPosition);
    push(data.wenChangPalace, '文昌', data.wenChangPosition);
    push(data.shiJiPalace, '始击', data.shiJiPosition);
    push(data.jiShenPalace, '计神', data.jiShenPosition);
    return m;
  }, [data]);

  const maxCount = data ? Math.max(data.lordCount, data.guestCount, data.setCount, 10) : 10;

  return (
    <main style={wrapStyle}>
      <style>{`
        .ts-ty-fade { animation: tsTyFade .5s ease both; }
        @keyframes tsTyFade { from { opacity: 0; transform: translateY(6px);} to { opacity:1; transform:none;} }
        .ts-ty-bar { transition: width .6s ease; }
      `}</style>

      <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.6, margin: '0 0 8px' }}>术数 · 三式</p>
      <h1 style={{ fontSize: 28, margin: '0 0 6px', fontWeight: 700 }}>太乙神数 · 年计排盘</h1>
      <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.8, margin: '0 0 18px' }}>
        太乙三式之首，以积年与阳遁七十二局立成起局，观太乙、文昌、始击、计神落宫与主客定算。
        当前引擎仅开放年计；月/日/时计待古籍历法链校勘后开放。
      </p>

      {/* 输入表单 */}
      <form onSubmit={onSubmit} style={{ ...cardStyle, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 14, opacity: 0.85 }}>公历年份（年计）</label>
        <input
          type="number"
          value={yearInput}
          min={1}
          max={9999}
          onChange={(e) => setYearInput(Number(e.target.value))}
          style={{
            width: 120, padding: '6px 10px', borderRadius: 8, fontSize: 15,
            background: 'rgba(0,0,0,0.25)', color: 'inherit', border: '1px solid rgba(140,150,180,0.4)',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
            background: '#BB9863', color: '#1E2126', border: 'none', fontWeight: 600,
          }}
        >
          起年计盘
        </button>
        <span style={{ fontSize: 12, opacity: 0.55 }}>计式：年计（月/日/时计待专家校勘）</span>
      </form>

      {error && (
        <div style={{ ...cardStyle, borderColor: 'rgba(226,78,76,0.5)' }} role="alert">
          <p style={{ margin: 0, fontSize: 14, color: '#E24E4C' }}>排盘数据待补：{error}</p>
        </div>
      )}

      {data && !error && (
        <div className="ts-ty-fade">
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot params={{ year: yearInput, scope: 'year' }} engineName={data.model.name} />

          {/* 头部门类卡 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14 }}>
              <span>本计干支：<b>{data.ganZhi}</b></span>
              <span>{data.accumulatedLabel}：<b style={{ fontVariantNumeric: 'tabular-nums' }}>{data.accumulatedValue}</b></span>
              <span>360 周期余数：<b style={{ fontVariantNumeric: 'tabular-nums' }}>{data.entryYears}</b></span>
              <span>{data.yinYang}第 <b style={{ fontVariantNumeric: 'tabular-nums' }}>{data.bureau}</b> 局</span>
            </div>
          </div>

          {/* ① 太乙九宫算盘 SVG */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>太乙九宫算盘 · 四神落宫</h3>
            <svg viewBox="0 0 360 360" style={{ width: '100%', maxWidth: 360, display: 'block', margin: '0 auto' }} role="img" aria-label="太乙九宫四神落宫">
              {CELL_ORDER.map((palace, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x = col * 120;
                const y = row * 120;
                const info = PALACE_DIR[palace];
                const gods = godsAt[palace] || [];
                const isCenter = palace === 5;
                return (
                  <g key={palace}>
                    <rect x={x + 2} y={y + 2} width={116} height={116}
                      fill={isCenter ? 'rgba(187,152,99,0.10)' : 'rgba(255,255,255,0.02)'}
                      stroke={gods.length ? '#BB9863' : 'rgba(140,150,180,0.3)'}
                      strokeWidth={gods.length ? 1.6 : 1} />
                    <text x={x + 10} y={y + 20} fontSize={11} fill="rgba(160,170,190,0.8)">
                      {palace}宫 · {info.gua} · {info.dir}
                    </text>
                    {isCenter && (
                      <text x={x + 60} y={y + 66} fontSize={13} fill="rgba(160,170,190,0.6)" textAnchor="middle">中五</text>
                    )}
                    {gods.map((g, gi) => (
                      <g key={g.name}>
                        <circle cx={x + 18} cy={y + 44 + gi * 22} r={4} fill={GOD_COLORS[g.name]} />
                        <text x={x + 28} y={y + 48 + gi * 22} fontSize={12.5} fill={GOD_COLORS[g.name]} fontWeight={600}>
                          {g.name}·{g.pos}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, opacity: 0.8, marginTop: 8 }}>
              {Object.entries(GOD_COLORS).map(([k, v]) => (
                <span key={k}><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 8, background: v, marginRight: 4 }} />{k}</span>
              ))}
            </div>
          </div>

          {/* ② 主客算三柱 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>主算 · 客算 · 定算</h3>
            {[
              { label: '主算', value: data.lordCount, color: '#4A7BA6' },
              { label: '客算', value: data.guestCount, color: '#E24E4C' },
              { label: '定算', value: data.setCount, color: '#BB9863' },
            ].map((b) => (
              <div key={b.label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 13, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{b.label}</span>
                  <b style={{ fontVariantNumeric: 'tabular-nums' }}>{b.value}</b>
                </div>
                <div style={{ height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }}>
                  <div className="ts-ty-bar" style={{ height: '100%', borderRadius: 6, width: `${(b.value / maxCount) * 100}%`, background: b.color }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 12.5, opacity: 0.7, margin: '8px 0 0', lineHeight: 1.7 }}>
              将参：主大将 {data.lordGeneral} 宫 · 主参将 {data.lordAssistant} 宫；
              客大将 {data.guestGeneral} 宫 · 客参将 {data.guestAssistant} 宫；
              定大将 {data.setGeneral} 宫 · 定参将 {data.setAssistant} 宫。
            </p>
          </div>

          {/* 判断与十六神 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>格局判断</h3>
            {data.judgments.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.9 }}>
                {data.judgments.map((j, i) => <li key={i}>{j}</li>)}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>本局无掩/囚等特殊判断触发。</p>
            )}
            <p style={{ fontSize: 12.5, opacity: 0.65, margin: '12px 0 0', lineHeight: 1.8 }}>
              十六神：{data.sixteenGods.map((g) => `${g.branch}${g.god}`).join('、')}
            </p>
          </div>

          {/* 证据折叠 */}
          <details style={cardStyle}>
            <summary style={{ cursor: 'pointer', fontSize: 14, opacity: 0.85 }}>口径与证据链（{data.model.name}）</summary>
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, opacity: 0.85 }}>
              <p style={{ margin: '6px 0' }}>精度：{data.model.precision}</p>
              <p style={{ margin: '6px 0' }}>模型来源：</p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {data.model.sources.map((s) => (
                  <li key={s.title}>
                    <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#66C9C3' }}>{s.title}</a>
                    <span style={{ opacity: 0.7 }}> — {s.evidence}</span>
                  </li>
                ))}
              </ul>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, opacity: 0.7, marginTop: 10 }}>{data.prompt}</pre>
            </div>
          </details>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
        仅供传统文化娱乐参考，不构成任何医疗、法律、金融或人生决策建议。板块：taiyi（年计）。
      </p>
    </main>
  );
}
