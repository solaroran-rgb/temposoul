/**
 * LiuyaoPage —— 波4·内容模板填充：六爻排盘真引擎页（易占速占组）
 *
 * 引擎入口：@temposoul/core/divination/liuyao → generateLiuyao(customDate?, options?)
 * 可视化：A6 02 分册 §8「推荐可视化 1」六爻纵列 SVG（自下而上 6 爻，动爻 ○/× 标记，
 *         左列六神、右列六亲+纳甲+五行，世/应徽标、空亡置灰）+ §8-2 本→互→变卦流转。
 * 合规：每页常驻「娱乐参考」免责；不涉医疗/法律/金融建议；证据链 evidenceTrail 折叠展示；
 *       引擎抛错/输出缺失时显示「排盘数据待补」+ 免责，禁止编造卦象/断语。
 *
 * 七语 i18n 接入位：本文件中文文案集中于 JSX 文本与下方常量，后续按 key 抽离。
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateLiuyao } from '@temposoul/core/divination/liuyao';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type LiuyaoResult = ReturnType<typeof generateLiuyao>;

/** 五行色（全站统一，引自 A6 导读 §1.1） */
const WUXING_COLOR: Record<string, string> = {
  木: '#4C9A6B',
  火: '#D9534F',
  土: '#C9A86A',
  金: '#C9B458',
  水: '#4A7BA6',
};

const PAGE_CSS = `
.ly-page{max-width:760px;margin:0 auto;padding:28px 18px 64px;color:inherit;font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;}
.ly-kicker{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 6px;}
.ly-title{font-size:28px;margin:0 0 6px;font-weight:700;}
.ly-sub{font-size:14px;line-height:1.8;opacity:.8;margin:0 0 20px;}
.ly-form{border:1px solid rgba(140,150,180,.3);border-radius:12px;padding:18px;background:rgba(255,255,255,.03);}
.ly-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:12px;}
.ly-row label{font-size:14px;opacity:.85;}
.ly-row input,.ly-row select{padding:7px 10px;border-radius:8px;border:1px solid rgba(140,150,180,.4);background:transparent;color:inherit;font-size:14px;}
.ly-btn{padding:10px 22px;border-radius:999;border:none;background:#BB9863;color:#1e1e1e;font-size:15px;font-weight:600;cursor:pointer;}
.ly-btn:disabled{opacity:.6;cursor:default;}
.ly-meta{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0;}
.ly-chip{font-size:12px;padding:3px 10px;border-radius:999;border:1px solid rgba(187,152,99,.5);color:#e8d3a8;}
.ly-flow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 18px;font-size:16px;font-weight:600;}
.ly-flow .arrow{opacity:.5;font-weight:400;}
.ly-card{border:1px solid rgba(140,150,180,.25);border-radius:12px;padding:14px 16px;margin:12px 0;background:rgba(255,255,255,.02);}
.ly-card h3{font-size:15px;margin:0 0 8px;}
.ly-guaci{font-size:14px;line-height:1.9;opacity:.9;}
.ly-disclaimer{margin-top:26px;font-size:12px;line-height:1.8;opacity:.5;}
.ly-empty{border:1px dashed rgba(140,150,180,.45);border-radius:12px;padding:34px 20px;text-align:center;opacity:.8;}
`;

export default function LiuyaoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：URL 读初始值（带校验），合法链接直达即复现
  const initMethod = readParam(searchParams, 'method', 'time', (v) =>
    v === 'time' || v === 'coins' ? v : null,
  );
  const initDate = readParam(searchParams, 'date', '');
  const [method, setMethod] = useState<'time' | 'coins'>(initMethod);
  const [dateStr, setDateStr] = useState<string>(initDate);
  const [question, setQuestion] = useState('');
  const [data, setData] = useState<LiuyaoResult | null>(null);
  const [error, setError] = useState<string>('');
  const [running, setRunning] = useState(false);

  const run = (override?: { method?: 'time' | 'coins'; date?: string }) => {
    const m = override?.method ?? method;
    const d = override?.date ?? dateStr;
    setRunning(true);
    setError('');
    try {
      const date = d ? new Date(d) : undefined;
      const result = generateLiuyao(date, { method: m });
      setData(result);
      // 提交写回 URL（留空时间不下发 date）
      setSearchParams(d ? { method: m, date: d } : { method: m }, { replace: true });
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  // 带参数直达（分享链接）时自动复现起卦
  useEffect(() => {
    if (searchParams.get('method') || searchParams.get('date')) {
      run({ method: initMethod, date: initDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yaos = data?.yaosDetail ?? [];
  // 自下而上排列：SVG 顶部画上爻(position 6)、底部画初爻(position 1)
  const rows = [...yaos].reverse();

  return (
    <main className="ly-page">
      <style>{PAGE_CSS}</style>
      <p className="ly-kicker">占卜 · 易占</p>
      <h1 className="ly-title">六爻</h1>
      <p className="ly-sub">
        以京房八宫法装六亲、六神、纳甲，按时间或铜钱摇卦排本卦、互卦、变卦。输入起卦时间（可留空用当下）后点击排盘。
      </p>

      <div className="ly-form">
        <div className="ly-row">
          <label>
            起卦方式
            <select value={method} onChange={(e) => setMethod(e.target.value as 'time' | 'coins')}>
              <option value="time">时间起卦</option>
              <option value="coins">铜钱摇卦（模拟三钱）</option>
            </select>
          </label>
          <label>
            起卦时间（留空=当前）
            <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
          </label>
        </div>
        <div className="ly-row">
          <label style={{ flex: '1 1 100%' }}>
            所问之事（仅作记录，不参与算法）
            <input
              style={{ width: '100%' }}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="如：近期一项决定是否宜进"
            />
          </label>
        </div>
        <button className="ly-btn" onClick={() => run()} disabled={running}>
          {running ? '排盘中…' : '开始起卦'}
        </button>
      </div>

      {error && (
        <div className="ly-empty" role="alert">
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>排盘数据待补</p>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>引擎本次未返回有效盘面：{error}</p>
        </div>
      )}

      {!data && !error && (
        <div className="ly-empty">结果占位区 — 选择起卦方式后点击「开始起卦」</div>
      )}

      {data && !error && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot
            params={{
              method,
              ...(dateStr ? { date: dateStr } : {}),
              ...(method === 'coins' ? { note: '*铜钱模拟*' } : {}),
            }}
            engineName="六爻 · 京房八宫纳甲"
          />

          <div className="ly-meta">
            <span className="ly-chip">{data.palace?.name}宫 · {data.palace?.wuxing}</span>
            {data.palaceStage ? <span className="ly-chip">{data.palaceStage}</span> : null}
            {data.specialPattern ? <span className="ly-chip">{data.specialPattern}</span> : null}
            <span className="ly-chip">年{data.ganzhi.year}</span>
            <span className="ly-chip">月{data.ganzhi.month}</span>
            <span className="ly-chip">日{data.ganzhi.day}</span>
            <span className="ly-chip">时{data.ganzhi.hour}</span>
          </div>

          <div className="ly-flow">
            <span>本卦 {data.originalName}</span>
            <span className="arrow">→</span>
            <span>互卦 {data.interName ?? '—'}</span>
            <span className="arrow">→</span>
            <span>变卦 {data.changedName ?? '—'}</span>
          </div>

          {/* 核心盘面：六爻纵列 SVG */}
          <div className="ly-card">
            <h3>六爻盘面（上爻在上，初爻在下）</h3>
            <svg viewBox="0 0 400 372" width="100%" role="img" aria-label="六爻卦象图">
              {rows.map((yao, i) => {
                const y = 44 + i * 52;
                const isYang = yao.yaoType === '阳';
                const voidDim = yao.isVoid ? 0.35 : 1;
                const lineColor = '#e8e8e8';
                return (
                  <g key={yao.position} opacity={voidDim}>
                    {/* 世/应徽标 */}
                    {(yao.isWorld || yao.isResponse) && (
                      <text x={120} y={y + 4} textAnchor="end" fontSize="12" fill="#EECB0D" fontWeight="700">
                        {yao.isWorld ? '世' : '应'}
                      </text>
                    )}
                    {/* 六神（左列） */}
                    <text x={96} y={y + 4} textAnchor="end" fontSize="12" fill="#BB9863">
                      {yao.sixGod}
                    </text>
                    {/* 爻线 */}
                    {isYang ? (
                      <rect x={130} y={y - 5} width={130} height={10} rx={1} fill={lineColor} />
                    ) : (
                      <>
                        <rect x={130} y={y - 5} width={58} height={10} rx={1} fill={lineColor} />
                        <rect x={202} y={y - 5} width={58} height={10} rx={1} fill={lineColor} />
                      </>
                    )}
                    {/* 动爻标记：老阳 ○、老阴 × */}
                    {yao.isChanging && (
                      yao.rawValue === 9 ? (
                        <circle cx={278} cy={y} r={7} fill="none" stroke="#E24E4C" strokeWidth={2} />
                      ) : (
                        <g stroke="#E24E4C" strokeWidth={2}>
                          <line x1={272} y1={y - 6} x2={284} y2={y + 6} />
                          <line x1={284} y1={y - 6} x2={272} y2={y + 6} />
                        </g>
                      )
                    )}
                    {/* 右列：六亲 + 纳甲 + 五行 */}
                    <text x={296} y={y + 4} fontSize="12" fill={WUXING_COLOR[yao.wuxing] ?? '#ccc'}>
                      {yao.sixRelative} {yao.najiaDizhi}
                    </text>
                    {/* 旺衰小字 */}
                    <text x={296} y={y + 18} fontSize="10" fill="#888">
                      {yao.seasonState ?? ''}{yao.isVoid ? ' · 空亡' : ''}{yao.isHiddenMove ? ' · 暗动' : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p style={{ fontSize: 12, opacity: 0.6, margin: '6px 0 0' }}>
              ○ 为老阳动、× 为老阴动；金色「世/应」为世爻/应爻；置灰爻临旬空。
            </p>
          </div>

          {/* 卦爻辞 */}
          {data.guaCi && (
            <div className="ly-card">
              <h3>本卦卦辞</h3>
              <p className="ly-guaci">{data.guaCi}</p>
              {data.changingYaos && data.changingYaos.length > 0 && data.yaoCi && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 13 }}>逐爻爻辞（初→上）</summary>
                  <ol className="ly-guaci" style={{ paddingLeft: 20 }}>
                    {data.yaoCi.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          )}

          {/* 反证/特殊提示 */}
          {data.specialAdvice && (
            <div className="ly-card">
              <h3>卦象提示</h3>
              <p className="ly-guaci">{data.specialAdvice}</p>
              {data.fanfuRelations && data.fanfuRelations.labels.length > 0 && (
                <p className="ly-guaci">结构标记：{data.fanfuRelations.labels.join('、')}</p>
              )}
              {data.hexagramRelations?.transition && (
                <p className="ly-guaci">卦变：{data.hexagramRelations.transition}</p>
              )}
            </div>
          )}

          {/* 证据链（折叠） */}
          {data.evidenceTrail && (
            <details className="ly-card">
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                排盘依据与证据链（{data.evidenceTrail.items?.length ?? 0} 条）
              </summary>
              <p className="ly-guaci">{data.evidenceTrail.summary}</p>
              <ul style={{ paddingLeft: 18 }}>
                {(data.evidenceTrail.items ?? []).map((it, i) => (
                  <li key={i} className="ly-guaci">
                    <strong>{it.title}</strong>
                    <br />
                    出处：{it.source?.name}
                    {it.source?.location ? `（${it.source.location}）` : ''}
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

      <p className="ly-disclaimer">
        本页为传统文化·易占速占工具，结果仅供娱乐参考，不构成医疗、法律、投资或任何决策建议。
        卦象与断语均由引擎按固定规则排出，请勿据以行事。板块标识：liuyao。
      </p>
    </main>
  );
}
