/**
 * 五运六气排盘页（历法风水组 · 波4 内容模板填充）
 *
 * 七语 i18n 接入位：本页所有中文文案（标题/表单/字段名/免责）集中在本组件内联字符串，
 * 后续 i18n 化时按 key 抽取即可，不依赖任何中文硬编码于引擎层。
 *
 * 引擎：@temposoul/core/wuyun-liuqi → calculateWuyunLiuqi({ year })
 * 可视化（对照 A6 04 §18）：
 *   - 一年六步气时间轴 SVG（六段气，客气五行色块，司天/在泉标记）
 *   - 符会命中徽章墙（annualConformities.facts 命中高亮/未命中灰显）
 *   - 岁运/司天/在泉/关系结论卡
 * 合规：涉健康 → 常驻「非医疗建议」角标；引擎空/异常时显示「排盘数据待补」，禁止编造盘面。
 */
import { useState } from 'react';
import { calculateWuyunLiuqi } from '@temposoul/core/wuyun-liuqi';
import type { WuyunLiuqiResult, WuyunElement } from '@temposoul/core/wuyun-liuqi';

/** 五行色（全站统一，引自 A6 导读 §1.1） */
const ELEMENT_COLOR: Record<WuyunElement, string> = {
  木: '#4C9A6B',
  火: '#D9534F',
  土: '#C9A86A',
  金: '#C9B458',
  水: '#4A7BA6',
};

type PageState = 'idle' | 'ok' | 'empty' | 'error';

export function WuyunLiuqiPage() {
  const [yearInput, setYearInput] = useState<string>('2026');
  const [state, setState] = useState<PageState>('idle');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<WuyunLiuqiResult | null>(null);

  const run = () => {
    const year = Number.parseInt(yearInput, 10);
    if (!Number.isInteger(year) || year < 1 || year > 9999) {
      setState('error');
      setError('请输入 1-9999 之间的公历年。');
      setResult(null);
      return;
    }
    try {
      const r = calculateWuyunLiuqi({ year });
      if (!r || !r.qiSteps?.length || !r.annualMovement) {
        setState('empty');
        setResult(null);
        return;
      }
      setResult(r);
      setState('ok');
      setError('');
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : '排盘失败。');
      setResult(null);
    }
  };

  return (
    <div className="wylq-page">
      <style>{`
        .wylq-page{max-width:880px;margin:0 auto;padding:28px 18px 72px;color:inherit;
          font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;line-height:1.7}
        .wylq-page h1{font-size:28px;margin:0 0 6px;font-weight:700}
        .wylq-crumb{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 14px}
        .wylq-lead{font-size:14px;opacity:.8;margin:0 0 20px}
        .wylq-form{display:flex;flex-wrap:wrap;gap:10px;align-items:center;
          background:rgba(255,255,255,.04);border:1px solid rgba(150,160,190,.25);
          border-radius:12px;padding:14px 16px;margin-bottom:22px}
        .wylq-form label{font-size:14px;opacity:.85}
        .wylq-form input{width:120px;padding:8px 10px;border-radius:8px;
          border:1px solid rgba(150,160,190,.4);background:transparent;color:inherit;
          font-size:15px;font-variant-numeric:tabular-nums}
        .wylq-btn{padding:8px 18px;border-radius:8px;border:none;cursor:pointer;
          background:#BB9863;color:#fff;font-size:14px;font-weight:600}
        .wylq-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;
          border:1px solid rgba(226,78,76,.6);color:#ff8a87;background:rgba(226,78,76,.1)}
        .wylq-card{border:1px solid rgba(150,160,190,.22);border-radius:12px;
          padding:16px 18px;margin:14px 0;background:rgba(255,255,255,.03)}
        .wylq-card h2{font-size:16px;margin:0 0 12px;font-weight:600}
        .wylq-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
        .wylq-stat{border-radius:10px;padding:10px 12px;background:rgba(255,255,255,.05)}
        .wylq-stat span{font-size:12px;opacity:.6;display:block}
        .wylq-stat strong{font-size:18px;display:block;margin-top:2px;font-variant-numeric:tabular-nums}
        .wylq-stat small{font-size:12px;opacity:.7}
        .wylq-chips{display:flex;flex-wrap:wrap;gap:8px}
        .wylq-chip{padding:5px 12px;border-radius:999px;font-size:13px;border:1px solid transparent}
        .wylq-chip--hit{background:rgba(187,152,99,.2);border-color:#BB9863;color:#eecb9d}
        .wylq-chip--miss{opacity:.45;background:rgba(150,160,190,.1)}
        .wylq-empty{text-align:center;padding:40px 20px;border:1px dashed rgba(150,160,190,.4);
          border-radius:12px;color:inherit;opacity:.7}
        .wylq-detail{font-size:13px;opacity:.85}
        .wylq-detail summary{cursor:pointer;font-weight:600;opacity:.9;padding:4px 0}
        .wylq-detail ul{margin:8px 0;padding-left:20px}
        .wylq-foot{margin-top:26px;font-size:12px;opacity:.55;text-align:center;line-height:1.8}
        .wylq-qi-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;opacity:.8;margin-top:8px}
        .wylq-qi-legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px}
      `}</style>

      <p className="wylq-crumb">术数 · 历法易数</p>
      <h1>五运六气排盘</h1>
      <p className="wylq-lead">
        依年干支推岁运太过不及、五步主客运与司天在泉六步主客气，展示传统年度气候节律结构。
        <span className="wylq-badge">非医疗建议</span>
      </p>

      <div className="wylq-form">
        <label htmlFor="wylq-year">公历年</label>
        <input
          id="wylq-year"
          value={yearInput}
          inputMode="numeric"
          onChange={(e) => setYearInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') run();
          }}
        />
        <button type="button" className="wylq-btn" onClick={run}>
          排盘
        </button>
      </div>

      {state === 'error' && (
        <div className="wylq-empty" role="alert">
          {error || '排盘数据待补'}
        </div>
      )}
      {state === 'empty' && <div className="wylq-empty">排盘数据待补。</div>}

      {state === 'ok' && result && <WuyunResult result={result} />}

      <p className="wylq-foot">
        五运六气为传统历法气候模型，仅供文化参考与娱乐，不构成任何医疗、健康或决策建议。
        <br />
        年干支来源：{result?.input.yearGanZhiSource ?? '—'} ｜ 板块：wuyun-liuqi
      </p>
    </div>
  );
}

function WuyunResult({ result }: { result: WuyunLiuqiResult }) {
  const { annualMovement, sitian, zaiquan, annualRelation, annualConformities, qiSteps } = result;

  // 六步气时间轴几何：6 段均分
  const SEG = 6;
  const W = 820;
  const H = 150;
  const padX = 24;
  const segW = (W - padX * 2) / SEG;

  return (
    <>
      {/* 结论卡 */}
      <div className="wylq-card">
        <h2>年度总览（{result.input.yearGanZhi}
          {result.input.year != null ? ` · ${result.input.year} 年` : ''}）
        </h2>
        <div className="wylq-stats">
          <div className="wylq-stat">
            <span>岁运</span>
            <strong>{annualMovement.name}</strong>
            <small>
              {annualMovement.toneName} · {annualMovement.strength}（{annualMovement.yinYang}干）
            </small>
          </div>
          <div className="wylq-stat">
            <span>司天</span>
            <strong>{sitian.name}</strong>
            <small>五行 {sitian.element}</small>
          </div>
          <div className="wylq-stat">
            <span>在泉</span>
            <strong>{zaiquan.name}</strong>
            <small>五行 {zaiquan.element}</small>
          </div>
          <div className="wylq-stat">
            <span>中运与司天</span>
            <strong>{annualRelation.kind}</strong>
            <small>{annualRelation.basis}</small>
          </div>
        </div>
      </div>

      {/* 六步气时间轴 SVG */}
      <div className="wylq-card">
        <h2>一年六步气（主气 / 客气）</h2>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="六步气时间轴">
          {qiSteps.map((step, i) => {
            const x = padX + i * segW;
            const color = ELEMENT_COLOR[step.guestQi.element];
            const isSitian = step.guestRole === '司天';
            const isZaiquan = step.guestRole === '在泉';
            return (
              <g key={step.label}>
                <rect
                  x={x + 3}
                  y={34}
                  width={segW - 6}
                  height={56}
                  rx={6}
                  fill={color}
                  opacity={isSitian || isZaiquan ? 0.95 : 0.55}
                />
                <text x={x + segW / 2} y={22} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.85}>
                  {step.label}
                </text>
                <text x={x + segW / 2} y={56} textAnchor="middle" fontSize={11} fill="#fff">
                  客 {step.guestQi.name}
                </text>
                <text x={x + segW / 2} y={76} textAnchor="middle" fontSize={11} fill="#fff" opacity={0.95}>
                  主 {step.hostQi.name}
                </text>
                {(isSitian || isZaiquan) && (
                  <text x={x + segW / 2} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fill="#EECB0D">
                    {step.guestRole}
                  </text>
                )}
                <text x={x + segW / 2} y={132} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6}>
                  {step.solarTerms[0]}等四气
                </text>
                {i < SEG - 1 && (
                  <line x1={x + segW} y1={34} x2={x + segW} y2={90} stroke="currentColor" opacity={0.2} />
                )}
              </g>
            );
          })}
        </svg>
        <div className="wylq-qi-legend">
          {(['木', '火', '土', '金', '水'] as WuyunElement[]).map((el) => (
            <span key={el}>
              <i style={{ background: ELEMENT_COLOR[el] }} />
              {el}
            </span>
          ))}
          <span>色块=客气五行；三之气司天、终之气在泉。</span>
        </div>
      </div>

      {/* 符会徽章墙 */}
      <div className="wylq-card">
        <h2>年度符会核验</h2>
        <div className="wylq-chips">
          {annualConformities.facts.map((fact) => (
            <span key={fact.name} className={`wylq-chip ${fact.matched ? 'wylq-chip--hit' : 'wylq-chip--miss'}`}
              title={fact.basis}>
              {fact.name}（{fact.matched ? '成' : '不成'}）
            </span>
          ))}
        </div>
      </div>

      {/* 证据折叠 */}
      <details className="wylq-detail wylq-card">
        <summary>计算链与依据（参数透明）</summary>
        <ul>
          {result.calculationChain.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <strong>传统依据</strong>
        <ul>
          {result.sources.map((s) => (
            <li key={s.title}>
              {s.title}：{s.scope}
            </li>
          ))}
        </ul>
        <strong>口径局限</strong>
        <ul>
          {result.limitations.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

export default WuyunLiuqiPage;
