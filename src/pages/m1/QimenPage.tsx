/**
 * 七语 i18n 接入位（本批仅中文，不要求 7 语）
 * QimenPage —— 奇门遁甲排盘页（三式重盘组）
 *
 * 引擎：@temposoul/core/divination/qimen  generateQimen(customDate, method, scope, juMethod)
 * 可视化落地（对照 A6 02 分册 §7 推荐可视化）：
 *   ① 3×3 九宫四盘 SVG（神盘八神→天盘星+干→人盘门→地盘干），值符/值使宫描金、空亡宫打灰
 *   ② 方位吉凶 chips（goodDirections 绿 / avoidDirections 红）+ 格局标签墙
 * 合规：传统文化娱乐参考，不涉医疗/法律/金融建议；引擎异常显示「排盘数据待补」，不编造盘面。
 */
import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateQimen, type QimenScope, type QimenMethod } from '@temposoul/core/divination/qimen';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type QimenData = ReturnType<typeof generateQimen>;

/** 洛书 3×3 排布（行优先）：4·9·2 / 3·5·7 / 8·1·6 */
const CELL_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6] as const;

const WUXING_COLOR: Record<string, string> = {
  木: '#4C9A6B', 火: '#D9534F', 土: '#C9A86A', 金: '#C9B458', 水: '#4A7BA6',
};

const SCOPE_OPTS: { v: QimenScope; label: string }[] = [
  { v: 'hour', label: '时家' },
  { v: 'day', label: '日家' },
  { v: 'month', label: '月家' },
  { v: 'year', label: '年家' },
];
const METHOD_OPTS: { v: QimenMethod; label: string }[] = [
  { v: 'zhuanpan', label: '转盘' },
  { v: 'feipan', label: '飞盘' },
];

const wrapStyle: CSSProperties = { maxWidth: 960, margin: '0 auto', padding: '28px 20px 64px', color: 'inherit' };
const cardStyle: CSSProperties = {
  border: '1px solid rgba(140,150,180,0.25)', borderRadius: 12,
  padding: '16px 18px', marginBottom: 14, background: 'rgba(255,255,255,0.03)',
};

function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function compute(dateStr: string, scope: QimenScope, method: QimenMethod): { data: QimenData | null; error: string } {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) throw new Error('排盘时间无效。');
    return { data: generateQimen(d, method, scope, 'chaibu'), error: '' };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export default function QimenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateStr, setDateStr] = useState<string>(() => readParam(searchParams, 'date', toLocalInput(new Date())));
  const [scope, setScope] = useState<QimenScope>(() =>
    readParam(searchParams, 'scope', 'hour', (v) => (SCOPE_OPTS.some((o) => o.v === v) ? (v as QimenScope) : null)),
  );
  const [method, setMethod] = useState<QimenMethod>(() =>
    readParam(searchParams, 'method', 'zhuanpan', (v) => (METHOD_OPTS.some((o) => o.v === v) ? (v as QimenMethod) : null)),
  );
  const [result, setResult] = useState<{ data: QimenData | null; error: string }>(() =>
    compute(toLocalInput(new Date()), 'hour', 'zhuanpan'),
  );
  const data = result.data;
  const error = result.error;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(compute(dateStr, scope, method));
    setSearchParams({ date: dateStr, scope, method }, { replace: true });
  }

  // 值符星落宫 / 值使门落宫 / 空亡宫（由盘面真实字段推导）
  const highlights = useMemo(() => {
    if (!data) return { fuPalace: -1, shiPalace: -1, voidPalaces: new Set<number>() };
    let fu = -1;
    let shi = -1;
    for (const g of data.jiuGongGe) {
      if (g.tianPan.star === data.zhiFu) fu = g.gong;
      if (g.renPan.door === data.zhiShi) shi = g.gong;
    }
    const voids = new Set<number>((data.voidPalaces || []).map((v) => v.palace));
    return { fuPalace: fu, shiPalace: shi, voidPalaces: voids };
  }, [data]);

  return (
    <main style={wrapStyle}>
      <style>{`
        .ts-qm-fade { animation: tsQmFade .5s ease both; }
        @keyframes tsQmFade { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
      `}</style>

      <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.6, margin: '0 0 8px' }}>占卜 · 三式</p>
      <h1 style={{ fontSize: 28, margin: '0 0 6px', fontWeight: 700 }}>奇门遁甲 · 排盘</h1>
      <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.8, margin: '0 0 18px' }}>
        以拆补法定局，转盘/飞盘排天地人神四盘，附九宫格局、方位吉凶与应期节奏。
      </p>

      <form onSubmit={onSubmit} style={{ ...cardStyle, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13, opacity: 0.8 }}>占时</label>
        <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 8, fontSize: 14, background: 'rgba(0,0,0,0.25)', color: 'inherit', border: '1px solid rgba(140,150,180,0.4)' }} />
        <label style={{ fontSize: 13, opacity: 0.8 }}>级别</label>
        <select value={scope} onChange={(e) => setScope(e.target.value as QimenScope)}
          style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: 'inherit', fontSize: 14 }}>
          {SCOPE_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
        <label style={{ fontSize: 13, opacity: 0.8 }}>法</label>
        <select value={method} onChange={(e) => setMethod(e.target.value as QimenMethod)}
          style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: 'inherit', fontSize: 14 }}>
          {METHOD_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
        <button type="submit" style={{ padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, background: '#BB9863', color: '#1E2126', border: 'none', fontWeight: 600 }}>
          起奇门盘
        </button>
      </form>

      {error && (
        <div style={{ ...cardStyle, borderColor: 'rgba(226,78,76,0.5)' }} role="alert">
          <p style={{ margin: 0, fontSize: 14, color: '#E24E4C' }}>排盘数据待补：{error}</p>
        </div>
      )}

      {data && !error && (
        <div className="ts-qm-fade">
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot params={{ date: dateStr, scope, method }} engineName="奇门遁甲 · 拆补法" />

          {/* 头部卡 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 14 }}>
              <span>{data.method === 'feipan' ? '飞盘' : '转盘'} · {SCOPE_OPTS.find((o) => o.v === data.scope)?.label}</span>
              <span>{data.isYangDun ? '阳遁' : '阴遁'} <b style={{ fontVariantNumeric: 'tabular-nums' }}>{data.juShu}</b> 局</span>
              <span>值符 <b>{data.zhiFu}</b></span>
              <span>值使 <b>{data.zhiShi}</b></span>
              <span>节气 {data.timeInfo.solarTerm}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, opacity: 0.8, marginTop: 8 }}>
              <span>年 {data.ganzhi.year}</span><span>月 {data.ganzhi.month}</span>
              <span>日 {data.ganzhi.day}</span><span>时 {data.ganzhi.hour}</span>
            </div>
          </div>

          {/* ① 九宫四盘 SVG */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>九宫四盘（神 → 星干 → 门 → 地盘干）</h3>
            <svg viewBox="0 0 480 480" style={{ width: '100%', maxWidth: 480, display: 'block', margin: '0 auto' }} role="img" aria-label="奇门九宫四盘">
              {CELL_ORDER.map((gong, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const x = col * 160;
                const y = row * 160;
                const cell = data.jiuGongGe.find((g) => g.gong === gong);
                const isFu = highlights.fuPalace === gong;
                const isShi = highlights.shiPalace === gong;
                const isVoid = highlights.voidPalaces.has(gong);
                const stroke = isFu || isShi ? '#EECB0D' : isVoid ? 'rgba(150,150,150,0.5)' : 'rgba(140,150,180,0.3)';
                const sw = isFu || isShi ? 2.4 : 1;
                return (
                  <g key={gong} opacity={isVoid ? 0.55 : 1}>
                    <rect x={x + 2} y={y + 2} width={156} height={156} fill="rgba(255,255,255,0.02)" stroke={stroke} strokeWidth={sw} />
                    {cell && (
                      <>
                        <text x={x + 10} y={y + 20} fontSize={11} fill={WUXING_COLOR[cell.element] || '#999'}>
                          {cell.gong}·{cell.name}·{cell.direction}
                        </text>
                        {/* 神盘 */}
                        <text x={x + 10} y={y + 44} fontSize={12.5} fill="#BB9863">{cell.shenPan.god}</text>
                        {/* 天盘 星+干 */}
                        <text x={x + 10} y={y + 68} fontSize={13} fill="#E24E4C" fontWeight={600}>
                          {cell.tianPan.star} {cell.tianPan.stem}
                        </text>
                        {/* 人盘 门 */}
                        <text x={x + 10} y={y + 92} fontSize={13} fill="#4C9A6B">{cell.renPan.door}</text>
                        {/* 地盘干 */}
                        <text x={x + 10} y={y + 116} fontSize={13} fill="#4A7BA6">{cell.diPan.stem}</text>
                        {(isFu || isShi) && (
                          <text x={x + 148} y={y + 20} fontSize={10.5} fill="#EECB0D" textAnchor="end">
                            {isFu ? '值符' : ''}{isShi ? ' 值使' : ''}
                          </text>
                        )}
                        {isVoid && <text x={x + 148} y={y + 148} fontSize={11} fill="#999" textAnchor="end">空亡</text>}
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, opacity: 0.75, marginTop: 8 }}>
              <span style={{ color: '#BB9863' }}>— 神盘</span>
              <span style={{ color: '#E24E4C' }}>— 天盘星/干</span>
              <span style={{ color: '#4C9A6B' }}>— 人盘门</span>
              <span style={{ color: '#4A7BA6' }}>— 地盘干</span>
            </div>
          </div>

          {/* ② 方位吉凶 */}
          {data.directions && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>方位参考</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                {data.directions.goodDirections.slice(0, 6).map((d) => (
                  <span key={`g${d.gong}`} title={d.reasons.join('；')}
                    style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12.5, border: '1px solid rgba(76,154,107,0.6)', color: '#4C9A6B', cursor: 'default' }}>
                    宜 {d.direction}（{d.use}）
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {data.directions.avoidDirections.slice(0, 6).map((d) => (
                  <span key={`a${d.gong}`} title={d.reasons.join('；')}
                    style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12.5, border: '1px solid rgba(217,83,79,0.6)', color: '#D9534F' }}>
                    忌 {d.direction}（{d.use}）
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 格局标签 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>格局标签</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(data.patternTags || []).map((t) => (
                <span key={t} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12.5, background: 'rgba(187,152,99,0.15)', color: '#EECB0D' }}>{t}</span>
              ))}
              {(data.patternCombos || []).map((c) => (
                <span key={c.key} title={c.summary}
                  style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 12.5,
                    border: '1px dashed rgba(140,150,180,0.4)',
                    color: c.tone === 'super-good' ? '#4C9A6B' : c.tone === 'super-bad' ? '#D9534F' : '#C9A86A',
                  }}>
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* 应期 */}
          {data.yingQi && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>应期节奏</h3>
              <p style={{ margin: '0 0 6px', fontSize: 14 }}>
                节奏：<b>{data.yingQi.rhythm}</b>
                {data.yingQi.minDays != null && `（约 ${data.yingQi.minDays}${data.yingQi.maxDays ? `–${data.yingQi.maxDays}` : ''} 日量级）`}
              </p>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.75, lineHeight: 1.7 }}>{data.yingQi.description}</p>
            </div>
          )}

          {/* 证据折叠 */}
          <details style={cardStyle}>
            <summary style={{ cursor: 'pointer', fontSize: 14, opacity: 0.85 }}>口径与证据链</summary>
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, opacity: 0.85 }}>
              {data.specialConditions?.description && <p style={{ margin: '4px 0' }}>{data.specialConditions.description}</p>}
              {(data.palaceInsights ?? []).length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(data.palaceInsights ?? []).map((p) => (
                    <li key={p.gong}>[{p.level}] {p.name}：{p.summary}</li>
                  ))}
                </ul>
              )}
              <p style={{ opacity: 0.7 }}>空亡：{(data.voidBranches || []).join('、') || '无'}；
                {data.horseStar ? ` 驿马 ${data.horseStar.branch}（${data.horseStar.name}）` : ''}</p>
            </div>
          </details>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
        仅供传统文化娱乐参考，不构成任何医疗、法律、金融或人生决策建议。板块：qimen（拆补法定局）。
      </p>
    </main>
  );
}
