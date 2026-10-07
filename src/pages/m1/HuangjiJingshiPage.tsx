/**
 * 皇极经世排盘页（历法风水组 · 波4 内容模板填充）
 *
 * 七语 i18n 接入位：本页中文文案集中于组件内联字符串，i18n 化时按 key 抽取。
 *
 * 引擎：@temposoul/core/huangji-jingshi → calculateHuangjiJingshi({ epochYear, year })
 * 可视化（对照 A6 04 §20）：
 *   - 元会运世四层进度条（套匣进度矩阵：元/会/运/世各层已过比例）
 *   - 当前坐标定位卡（公元年 → 第几元/会/运/世 + 起止年坐标）
 *   - 本会值卦（十二辟卦/消息卦）展示
 * 能力边界（如实标注）：值年卦给到「本会辟卦」层；逐年值卦细法传世多口径，待专家终审，不臆推。
 */
import { useState } from 'react';
import { calculateHuangjiJingshi } from '@temposoul/core/huangji-jingshi';
import type { HuangjiJingshiResult } from '@temposoul/core/huangji-jingshi';

type PageState = 'idle' | 'ok' | 'empty' | 'error';

const pct = (part: number, whole: number) =>
  Math.min(100, Math.max(0, (part / whole) * 100));

export function HuangjiJingshiPage() {
  const [epochInput, setEpochInput] = useState<string>('1984');
  const [yearInput, setYearInput] = useState<string>('2026');
  const [state, setState] = useState<PageState>('idle');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<HuangjiJingshiResult | null>(null);

  const run = () => {
    const epochYear = Number.parseInt(epochInput, 10);
    const year = Number.parseInt(yearInput, 10);
    if (!Number.isSafeInteger(epochYear) || !Number.isSafeInteger(year)) {
      setState('error');
      setError('纪元与目标年都必须是整数年坐标。');
      setResult(null);
      return;
    }
    if (year < epochYear) {
      setState('error');
      setError('目标年不能早于纪元第一年。');
      setResult(null);
      return;
    }
    try {
      const r = calculateHuangjiJingshi({ epochYear, year });
      if (!r || !r.position) {
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
    <div className="hjs-page">
      <style>{`
        .hjs-page{max-width:880px;margin:0 auto;padding:28px 18px 72px;color:inherit;
          font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;line-height:1.7}
        .hjs-page h1{font-size:28px;margin:0 0 6px;font-weight:700}
        .hjs-crumb{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 14px}
        .hjs-lead{font-size:14px;opacity:.8;margin:0 0 20px}
        .hjs-form{display:flex;flex-wrap:wrap;gap:10px;align-items:center;
          background:rgba(255,255,255,.04);border:1px solid rgba(150,160,190,.25);
          border-radius:12px;padding:14px 16px;margin-bottom:22px}
        .hjs-form label{font-size:14px;opacity:.85}
        .hjs-form input{width:120px;padding:8px 10px;border-radius:8px;
          border:1px solid rgba(150,160,190,.4);background:transparent;color:inherit;
          font-size:15px;font-variant-numeric:tabular-nums}
        .hjs-btn{padding:8px 18px;border-radius:8px;border:none;cursor:pointer;
          background:#BB9863;color:#fff;font-size:14px;font-weight:600}
        .hjs-card{border:1px solid rgba(150,160,190,.22);border-radius:12px;
          padding:16px 18px;margin:14px 0;background:rgba(255,255,255,.03)}
        .hjs-card h2{font-size:16px;margin:0 0 12px;font-weight:600}
        .hjs-locate{font-size:16px;line-height:1.9}
        .hjs-locate strong{color:#EECB0D;font-variant-numeric:tabular-nums}
        .hjs-bar-row{display:grid;grid-template-columns:64px 1fr 90px;gap:10px;align-items:center;
          margin:10px 0;font-size:13px}
        .hjs-bar-track{height:12px;border-radius:999px;background:rgba(150,160,190,.18);overflow:hidden}
        .hjs-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#BB9863,#EECB0D)}
        .hjs-bar-meta{font-variant-numeric:tabular-nums;opacity:.75;font-size:12px}
        .hjs-gua{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
        .hjs-gua-sym{font-size:52px;line-height:1;color:#EECB0D}
        .hjs-gua-info strong{font-size:18px}
        .hjs-empty{text-align:center;padding:40px 20px;border:1px dashed rgba(150,160,190,.4);
          border-radius:12px;opacity:.7}
        .hjs-detail{font-size:13px;opacity:.85}
        .hjs-detail summary{cursor:pointer;font-weight:600;opacity:.9;padding:4px 0}
        .hjs-detail ul{margin:8px 0;padding-left:20px}
        .hjs-foot{margin-top:26px;font-size:12px;opacity:.55;text-align:center;line-height:1.8}
        .hjs-note{font-size:12px;opacity:.6;margin-top:10px}
      `}</style>

      <p className="hjs-crumb">术数 · 历法易数</p>
      <h1>皇极经世 · 元会运世</h1>
      <p className="hjs-lead">
        以某一元第一年为纪元，按 1 世=30 年、1 运=12 世、1 会=30 运、1 元=12 会的纯数学周期，
        定位目标年在元会运世中的坐标。
      </p>

      <div className="hjs-form">
        <label htmlFor="hjs-epoch">纪元第一年坐标</label>
        <input
          id="hjs-epoch"
          value={epochInput}
          inputMode="numeric"
          onChange={(e) => setEpochInput(e.target.value)}
        />
        <label htmlFor="hjs-year">目标年坐标</label>
        <input
          id="hjs-year"
          value={yearInput}
          inputMode="numeric"
          onChange={(e) => setYearInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') run();
          }}
        />
        <button type="button" className="hjs-btn" onClick={run}>
          定位
        </button>
      </div>

      {state === 'error' && (
        <div className="hjs-empty" role="alert">
          {error || '排盘数据待补'}
        </div>
      )}
      {state === 'empty' && <div className="hjs-empty">排盘数据待补。</div>}

      {state === 'ok' && result && <HuangjiResult result={result} />}

      <p className="hjs-foot">
        皇极经世为传统时间易学模型，仅供文化研究与娱乐参考，不构成任何决策建议。
        <br />
        板块：huangji-jingshi
      </p>
    </div>
  );
}

function HuangjiResult({ result }: { result: HuangjiJingshiResult }) {
  const { position, progress, conversion, valueHexagram, input } = result;

  const bars: Array<{ label: string; pct: number; range: string }> = [
    {
      label: '世',
      pct: pct(progress.shi.completedYears, conversion.yearsPerShi),
      range: `${position.shi.startYear}-${position.shi.endYear}`,
    },
    {
      label: '运',
      pct: pct(progress.yun.completedYears, conversion.yearsPerYun),
      range: `${position.yun.startYear}-${position.yun.endYear}`,
    },
    {
      label: '会',
      pct: pct(progress.hui.completedYears, conversion.yearsPerHui),
      range: `${position.hui.startYear}-${position.hui.endYear}`,
    },
    {
      label: '元',
      pct: pct(progress.yuan.completedYears, conversion.yearsPerYuan),
      range: `${position.yuan.startYear}-${position.yuan.endYear}`,
    },
  ];

  return (
    <>
      {/* 一句话定位 */}
      <div className="hjs-card">
        <h2>坐标定位</h2>
        <p className="hjs-locate">
          目标年 <strong>{input.year}</strong>（纪元 {input.epochYear} 起已过 {input.elapsedYears} 年）处于
          第 <strong>{position.yuan.indexFromEpoch}</strong> 元、本元第 <strong>{position.hui.indexInYuan}</strong> 会、
          本元第 <strong>{position.yun.indexInYuan}</strong> 运（本会第 {position.yun.indexInHui} 运）、
          本运第 <strong>{position.shi.indexInYun}</strong> 世（本世第 {position.year.indexInShi} 年）。
        </p>
      </div>

      {/* 四层进度（套匣进度矩阵） */}
      <div className="hjs-card">
        <h2>各周期已过进度</h2>
        {bars.map((bar) => (
          <div className="hjs-bar-row" key={bar.label}>
            <span>{bar.label}</span>
            <div className="hjs-bar-track">
              <div className="hjs-bar-fill" style={{ width: `${bar.pct}%` }} />
            </div>
            <span className="hjs-bar-meta">
              {bar.pct.toFixed(1)}% · {bar.range}
            </span>
          </div>
        ))}
        <p className="hjs-note">
          换算常数：1 世 {conversion.yearsPerShi} 年 ｜ 1 运 {conversion.yearsPerYun} 年 ｜ 1 会{' '}
          {conversion.yearsPerHui.toLocaleString()} 年 ｜ 1 元 {conversion.yearsPerYuan.toLocaleString()} 年。
        </p>
      </div>

      {/* 本会值卦 */}
      <div className="hjs-card">
        <h2>本会值卦（十二辟卦）</h2>
        <div className="hjs-gua">
          <span className="hjs-gua-sym">{valueHexagram.hui.symbol}</span>
          <div className="hjs-gua-info">
            <strong>
              {valueHexagram.hui.fullName}（{valueHexagram.hui.name}）
            </strong>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.8 }}>
              {valueHexagram.hui.phase} ｜ 目标年在本会内进度{' '}
              {(valueHexagram.yearProgressInHui * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <p className="hjs-note">{valueHexagram.basis}</p>
      </div>

      {/* 证据折叠 */}
      <details className="hjs-detail hjs-card">
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

export default HuangjiJingshiPage;
