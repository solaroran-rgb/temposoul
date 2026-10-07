/**
 * XiaoliurenPage —— 波4·内容模板填充：小六壬速占真引擎页（易占速占组）
 *
 * 引擎入口：@temposoul/core/divination/xiaoliuren → generateXiaoliuren({ method, customDate? })
 * 可视化：A6 02 分册 §10「推荐可视化 1」六宫圆盘落点 SVG（大安→留连→…→空亡环形排布，
 *         月/日/时三宫依次点亮，主事宫=时宫描金放大）+ §10-2 三宫纵列签卡（verse 签语）。
 * 合规：常驻娱乐免责；不涉医疗/法律/金融；evidenceTrail 折叠；引擎异常显示「排盘数据待补」。
 *       说明：引擎 XiaoliurenPalaceDetail 仅提供 name/index/verse，不提供五行字段，
 *       故本页不臆造五行色，宫位只按 月/日/时/主事 角色高亮。
 *
 * 七语 i18n 接入位：本文件中文文案集中于 JSX 与下方常量，后续按 key 抽离。
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateXiaoliuren } from '@temposoul/core/divination/xiaoliuren';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type XiaoliurenResult = ReturnType<typeof generateXiaoliuren>;

const PAGE_CSS = `
.xl-page{max-width:760px;margin:0 auto;padding:28px 18px 64px;color:inherit;font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;}
.xl-kicker{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 6px;}
.xl-title{font-size:28px;margin:0 0 6px;font-weight:700;}
.xl-sub{font-size:14px;line-height:1.8;opacity:.8;margin:0 0 20px;}
.xl-form{border:1px solid rgba(140,150,180,.3);border-radius:12px;padding:18px;background:rgba(255,255,255,.03);}
.xl-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:12px;}
.xl-row label{font-size:14px;opacity:.85;}
.xl-row input{padding:7px 10px;border-radius:8px;border:1px solid rgba(140,150,180,.4);background:transparent;color:inherit;font-size:14px;}
.xl-btn{padding:10px 22px;border-radius:999;border:none;background:#BB9863;color:#1e1e1e;font-size:15px;font-weight:600;cursor:pointer;}
.xl-btn:disabled{opacity:.6;cursor:default;}
.xl-meta{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0;}
.xl-chip{font-size:12px;padding:3px 10px;border-radius:999;border:1px solid rgba(187,152,99,.5);color:#e8d3a8;}
.xl-card{border:1px solid rgba(140,150,180,.25);border-radius:12px;padding:14px 16px;margin:12px 0;background:rgba(255,255,255,.02);}
.xl-card h3{font-size:15px;margin:0 0 10px;}
.xl-cards{display:flex;flex-direction:column;gap:10px;}
.xl-sign{border:1px solid rgba(140,150,180,.3);border-left:4px solid #BB9863;border-radius:10px;padding:12px 14px;background:#FCF8EF;color:#2a2018;}
.xl-sign.primary{border-left-color:#EECB0D;background:#fff6e0;}
.xl-sign .hd{font-weight:700;font-size:15px;}
.xl-sign .verse{font-size:13px;line-height:1.9;margin-top:6px;}
.xl-text{font-size:14px;line-height:1.9;opacity:.9;}
.xl-disclaimer{margin-top:26px;font-size:12px;line-height:1.8;opacity:.5;}
.xl-empty{border:1px dashed rgba(140,150,180,.45);border-radius:12px;padding:34px 20px;text-align:center;opacity:.8;}
`;

export default function XiaoliurenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：URL 读初始值，合法链接直达即复现
  const initDate = readParam(searchParams, 'date', '');
  const [dateStr, setDateStr] = useState<string>(initDate);
  const [data, setData] = useState<XiaoliurenResult | null>(null);
  const [error, setError] = useState<string>('');
  const [running, setRunning] = useState(false);

  const run = (overrideDate?: string) => {
    const d = overrideDate ?? dateStr;
    setRunning(true);
    setError('');
    try {
      const customDate = d ? new Date(d) : undefined;
      const result = generateXiaoliuren({ method: 'time', customDate });
      setData(result);
      // 提交写回 URL（留空=当前时不下发 date）
      setSearchParams(d ? { date: d } : {}, { replace: true });
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  // 带参数直达（分享链接）时自动复现起课
  useEffect(() => {
    if (searchParams.get('date')) run(initDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 六宫环形落点几何
  const order = data?.palaceOrder ?? [];
  const C = 160;
  const R = 108;
  const monthIdx = data?.calculation?.monthPalaceIndex ?? -1;
  const dayIdx = data?.calculation?.dayPalaceIndex ?? -1;
  const hourIdx = data?.calculation?.hourPalaceIndex ?? -1;

  const nodePos = (i: number) => {
    const angle = ((-90 + i * 60) * Math.PI) / 180;
    return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) };
  };

  return (
    <main className="xl-page">
      <style>{PAGE_CSS}</style>
      <p className="xl-kicker">占卜 · 速占</p>
      <h1 className="xl-title">小六壬</h1>
      <p className="xl-sub">
        以农历月、日、时在六宫（大安、留连、速喜、赤口、小吉、空亡）上依次顺数做速断。默认按当下时间起课。
      </p>

      <div className="xl-form">
        <div className="xl-row">
          <label>
            起课时间（留空=当前）
            <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
          </label>
        </div>
        <button className="xl-btn" onClick={() => run()} disabled={running}>
          {running ? '起课中…' : '按时间起课'}
        </button>
      </div>

      {error && (
        <div className="xl-empty" role="alert">
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>排盘数据待补</p>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>引擎本次未返回有效课：{error}</p>
        </div>
      )}

      {!data && !error && <div className="xl-empty">结果占位区 — 点击「按时间起课」</div>}

      {data && !error && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot
            params={dateStr ? { method: 'time', date: dateStr } : { method: 'time' }}
            engineName="小六壬 · 六宫掌诀"
          />

          <div className="xl-meta">
            <span className="xl-chip">{data.methodLabel}</span>
            <span className="xl-chip">
              农历{data.isLeapMonth ? '闰' : ''}
              {data.lunarMonth}月{data.lunarDay}日 · {data.hourLabel}时
            </span>
            <span className="xl-chip">日家{data.ganzhi.day}</span>
            <span className="xl-chip">主事宫：{data.primary?.name}</span>
          </div>

          {/* 六宫圆盘落点图 SVG */}
          <div className="xl-card">
            <h3>六宫落点图（月→日→时依次落宫）</h3>
            <svg viewBox="0 0 320 320" width="100%" role="img" aria-label="小六壬六宫落点图">
              <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(140,150,180,.3)" strokeDasharray="3 4" />
              {order.map((p, i) => {
                const { x, y } = nodePos(i);
                const isHour = i === hourIdx;
                const isMonth = i === monthIdx;
                const isDay = i === dayIdx;
                return (
                  <g key={p.name}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHour ? 30 : 24}
                      fill={isHour ? '#EECB0D' : 'rgba(255,255,255,.04)'}
                      stroke={isHour ? '#BB9863' : 'rgba(140,150,180,.4)'}
                      strokeWidth={isHour ? 3 : 1.5}
                    />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight={isHour ? 700 : 400} fill={isHour ? '#2a2018' : 'inherit'}>
                      {p.name}
                    </text>
                    {(isMonth || isDay || isHour) && (
                      <text x={x} y={y + 44} textAnchor="middle" fontSize="11" fill="#66C9C3">
                        {[isMonth ? '月' : '', isDay ? '日' : '', isHour ? '时·主' : ''].filter(Boolean).join('/')}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <p style={{ fontSize: 12, opacity: 0.6, margin: '6px 0 0' }}>
              金色为「时宫·主事宫」；月、日落点以青字角标标注。宫序：大安→留连→速喜→赤口→小吉→空亡。
            </p>
          </div>

          {/* 三宫纵列签卡 */}
          <div className="xl-card">
            <h3>三宫签语（主事宫置顶）</h3>
            <div className="xl-cards">
              {[
                { label: '时宫 · 主事', palace: data.sequence?.hour, primary: true },
                { label: '月宫', palace: data.sequence?.month, primary: false },
                { label: '日宫', palace: data.sequence?.day, primary: false },
              ].map((row) => (
                <div key={row.label} className={`xl-sign${row.primary ? ' primary' : ''}`}>
                  <div className="hd">
                    {row.label}：{row.palace?.name}
                  </div>
                  <div className="verse">{row.palace?.verse}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 计算口径 */}
          <details className="xl-card">
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>落宫计算口径</summary>
            <p className="xl-text">
              月种={data.calculation?.monthSeed} → {data.sequence?.month.name}；
              日种={data.calculation?.daySeed} → {data.sequence?.day.name}；
              时种={data.calculation?.hourSeed}（{data.hourLabel}）→ {data.sequence?.hour.name}。
            </p>
            <p className="xl-text">
              换日口径：{data.calculation?.dayBoundary}；闰月口径：{data.calculation?.leapMonthRule}。
            </p>
          </details>

          {data.evidenceTrail && (
            <details className="xl-card">
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                起课依据与证据链（{data.evidenceTrail.items?.length ?? 0} 条）
              </summary>
              <p className="xl-text">{data.evidenceTrail.summary}</p>
              <ul style={{ paddingLeft: 18 }}>
                {(data.evidenceTrail.items ?? []).map((it, i) => (
                  <li key={i} className="xl-text">
                    <strong>{it.title}</strong>　出处：{it.source?.name}
                    {it.boundary?.cautionWhen && it.boundary.cautionWhen.length > 0
                      ? <span>　限制：{it.boundary.cautionWhen.join('；')}</span>
                      : null}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}

      <p className="xl-disclaimer">
        本页为传统文化·速占工具，结果仅供娱乐参考，不构成医疗、法律、投资或任何决策建议。
        六宫与签语均由引擎按固定掌诀顺数，请勿据以行事。板块标识：xiaoliuren。
      </p>
    </main>
  );
}
