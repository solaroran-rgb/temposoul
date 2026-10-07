/**
 * MeihuaPage —— 波4·内容模板填充：梅花易数排盘真引擎页（易占速占组）
 *
 * 引擎入口：@temposoul/core/divination/meihua → generateMeihua(customDate?, settings?)
 * 可视化：A6 02 分册 §9「推荐可视化 1」本→互→变三卦卦象 + §9-2 体用生克关系图
 *         （以体卦为中心，用/体互/用互/变用按五行生克连线，生=绿、克=红、比和=灰）。
 * 合规：常驻娱乐免责；不涉医疗/法律/金融；evidenceTrail 折叠；引擎异常显示「排盘数据待补」，禁编造。
 *
 * 七语 i18n 接入位：本文件中文文案集中于 JSX 与下方常量，后续按 key 抽离。
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateMeihua } from '@temposoul/core/divination/meihua';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type MeihuaResult = ReturnType<typeof generateMeihua>;

const WUXING_COLOR: Record<string, string> = {
  木: '#4C9A6B',
  火: '#D9534F',
  土: '#C9A86A',
  金: '#C9B458',
  水: '#4A7BA6',
};

/** 生克关系配色：含「生」绿、含「克」红、比和灰、其余金 */
function relationColor(rel: string): string {
  if (!rel) return '#888';
  if (rel.includes('比和')) return '#9a9a9a';
  if (rel.includes('生')) return '#4C9A6B';
  if (rel.includes('克')) return '#D9534F';
  return '#BB9863';
}

const PAGE_CSS = `
.mh-page{max-width:780px;margin:0 auto;padding:28px 18px 64px;color:inherit;font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;}
.mh-kicker{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 6px;}
.mh-title{font-size:28px;margin:0 0 6px;font-weight:700;}
.mh-sub{font-size:14px;line-height:1.8;opacity:.8;margin:0 0 20px;}
.mh-form{border:1px solid rgba(140,150,180,.3);border-radius:12px;padding:18px;background:rgba(255,255,255,.03);}
.mh-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:12px;}
.mh-row label{font-size:14px;opacity:.85;}
.mh-row input,.mh-row select{padding:7px 10px;border-radius:8px;border:1px solid rgba(140,150,180,.4);background:transparent;color:inherit;font-size:14px;}
.mh-btn{padding:10px 22px;border-radius:999;border:none;background:#BB9863;color:#1e1e1e;font-size:15px;font-weight:600;cursor:pointer;}
.mh-btn:disabled{opacity:.6;cursor:default;}
.mh-meta{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0;}
.mh-chip{font-size:12px;padding:3px 10px;border-radius:999;border:1px solid rgba(187,152,99,.5);color:#e8d3a8;}
.mh-three{display:flex;gap:12px;flex-wrap:wrap;margin:8px 0 16px;}
.mh-hex{flex:1 1 140px;border:1px solid rgba(140,150,180,.25);border-radius:12px;padding:14px;text-align:center;background:rgba(255,255,255,.02);}
.mh-hex .sym{font-size:44px;line-height:1;}
.mh-hex .nm{font-size:15px;font-weight:700;margin-top:6px;}
.mh-hex .tg{font-size:12px;opacity:.6;margin-top:2px;}
.mh-hex .tag{display:inline-block;margin-top:6px;font-size:11px;padding:2px 8px;border-radius:999;background:rgba(226,78,76,.15);color:#f0a9a8;}
.mh-card{border:1px solid rgba(140,150,180,.25);border-radius:12px;padding:14px 16px;margin:12px 0;background:rgba(255,255,255,.02);}
.mh-card h3{font-size:15px;margin:0 0 10px;}
.mh-tiyong{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.mh-ti{border:2px solid #EECB0D;border-radius:12px;padding:14px 18px;text-align:center;}
.mh-ti .nm{font-size:20px;font-weight:700;}
.mh-node{flex:1 1 150px;border:1px solid rgba(140,150,180,.3);border-radius:10px;padding:10px 12px;}
.mh-node .rl{display:inline-block;margin-top:6px;font-size:12px;padding:2px 8px;border-radius:999;color:#1e1e1e;font-weight:600;}
.mh-text{font-size:14px;line-height:1.9;opacity:.9;}
.mh-disclaimer{margin-top:26px;font-size:12px;line-height:1.8;opacity:.5;}
.mh-empty{border:1px dashed rgba(140,150,180,.45);border-radius:12px;padding:34px 20px;text-align:center;opacity:.8;}
`;

type Method = 'time' | 'number' | 'random';

export default function MeihuaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：URL 读初始值（带校验），合法链接直达即复现
  const initMethod = readParam(searchParams, 'method', 'time', (v) =>
    v === 'time' || v === 'number' || v === 'random' ? v : null,
  );
  const initN1 = readParam(searchParams, 'n1', '123');
  const initN2 = readParam(searchParams, 'n2', '');
  const [method, setMethod] = useState<Method>(initMethod);
  const [number, setNumber] = useState<string>(initN1);
  const [number2, setNumber2] = useState<string>(initN2);
  const [question, setQuestion] = useState('');
  const [data, setData] = useState<MeihuaResult | null>(null);
  const [error, setError] = useState<string>('');
  const [running, setRunning] = useState(false);

  const run = (override?: { method?: Method; n1?: string; n2?: string }) => {
    const m = override?.method ?? method;
    const n1 = override?.n1 ?? number;
    const n2 = override?.n2 ?? number2;
    setRunning(true);
    setError('');
    try {
      const settings: { method: Method; number?: number; number2?: number } = { method: m };
      if (m === 'number') {
        settings.number = Number(n1);
        if (n2.trim() !== '') settings.number2 = Number(n2);
      }
      const result = generateMeihua(undefined, settings);
      setData(result);
      // 提交写回 URL：method 恒带；数字起课带 n1/n2
      const params: Record<string, string> = { method: m };
      if (m === 'number') {
        params.n1 = n1;
        if (n2.trim() !== '') params.n2 = n2;
      }
      setSearchParams(params, { replace: true });
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  // 带参数直达（分享链接）时自动复现起卦
  useEffect(() => {
    if (searchParams.get('method') || searchParams.get('n1')) {
      run({ method: initMethod, n1: initN1, n2: initN2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mh-page">
      <style>{PAGE_CSS}</style>
      <p className="mh-kicker">占卜 · 易占</p>
      <h1 className="mh-title">梅花易数</h1>
      <p className="mh-sub">
        以心动起卦、体用生克断事，重即时外应。可选时间起卦、数字起卦（单个数或两数报数）或随机起卦。
      </p>

      <div className="mh-form">
        <div className="mh-row">
          <label>
            起卦方式
            <select value={method} onChange={(e) => setMethod(e.target.value as Method)}>
              <option value="time">时间起卦</option>
              <option value="number">数字起卦</option>
              <option value="random">随机起卦</option>
            </select>
          </label>
        </div>
        {method === 'number' && (
          <div className="mh-row">
            <label>
              第一数
              <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
            </label>
            <label>
              第二数（留空=单个数法）
              <input type="number" value={number2} onChange={(e) => setNumber2(e.target.value)} />
            </label>
          </div>
        )}
        <div className="mh-row">
          <label style={{ flex: '1 1 100%' }}>
            所问之事（仅作记录，不参与算法）
            <input style={{ width: '100%' }} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="心动之时所念之事" />
          </label>
        </div>
        <button className="mh-btn" onClick={() => run()} disabled={running}>
          {running ? '起卦中…' : '起卦'}
        </button>
      </div>

      {error && (
        <div className="mh-empty" role="alert">
          <p style={{ margin: '0 0 6px', fontWeight: 600 }}>排盘数据待补</p>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>引擎本次未返回有效卦盘：{error}</p>
        </div>
      )}

      {!data && !error && <div className="mh-empty">结果占位区 — 选择起卦方式后点击「起卦」</div>}

      {data && !error && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot
            params={{
              method,
              ...(method === 'number'
                ? { n1: number, ...(number2.trim() !== '' ? { n2: number2 } : {}) }
                : {}),
              ...(method === 'random' ? { note: '*随机起卦*' } : {}),
            }}
            engineName="梅花易数 · 体用生克"
          />

          <div className="mh-meta">
            <span className="mh-chip">{data.movingYao?.yaoName}动</span>
            <span className="mh-chip">季节 {data.analysis?.season}</span>
            {data.analysis?.monthElement ? <span className="mh-chip">月建 {data.analysis.monthElement}</span> : null}
            <span className="mh-chip">年{data.ganzhi.year}</span>
            <span className="mh-chip">月{data.ganzhi.month}</span>
            <span className="mh-chip">日{data.ganzhi.day}</span>
            <span className="mh-chip">时{data.ganzhi.hour}</span>
          </div>

          {/* 三卦：本→互→变 */}
          <div className="mh-three">
            <div className="mh-hex">
              <div className="sym">{data.mainHexagram?.symbol ?? '—'}</div>
              <div className="nm">本卦 {data.originalName}</div>
              <div className="tg">上{data.mainHexagram?.upper} · 下{data.mainHexagram?.lower}</div>
              {data.movingYao && <span className="tag">{data.movingYao.yaoName}动</span>}
            </div>
            <div className="mh-hex">
              <div className="sym">{data.interHexagram?.symbol ?? '—'}</div>
              <div className="nm">互卦 {data.interName ?? '—'}</div>
              <div className="tg">上{data.interHexagram?.upper} · 下{data.interHexagram?.lower}</div>
            </div>
            <div className="mh-hex">
              <div className="sym">{data.changedHexagram?.symbol ?? '—'}</div>
              <div className="nm">变卦 {data.changedName ?? '—'}</div>
              <div className="tg">上{data.changedHexagram?.upper} · 下{data.changedHexagram?.lower}</div>
            </div>
          </div>

          {/* 体用生克关系图 */}
          <div className="mh-card">
            <h3>体用生克关系（体为己，用为事）</h3>
            <div className="mh-tiyong">
              <div className="mh-ti" style={{ background: `${WUXING_COLOR[data.tiGua?.element] ?? '#888'}22` }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>体卦（己）</div>
                <div className="nm">{data.tiGua?.name}</div>
                <div style={{ fontSize: 12, color: WUXING_COLOR[data.tiGua?.element] ?? '#ccc' }}>
                  {data.tiGua?.element} · {data.tiGua?.nature}
                </div>
                <div style={{ fontSize: 11, marginTop: 4 }}>旺衰：{data.analysis?.tiSeasonState ?? '—'}</div>
              </div>
              <div style={{ flex: '1 1 100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
                <div className="mh-node">
                  <strong>用卦 {data.yongGua?.name}</strong>
                  <div style={{ fontSize: 12, color: WUXING_COLOR[data.yongGua?.element] ?? '#ccc' }}>{data.yongGua?.element}</div>
                  <span className="rl" style={{ background: relationColor(data.analysis?.tiYongRaw ?? '') }}>
                    {data.analysis?.tiYongRaw ?? '—'}
                  </span>
                </div>
                <div className="mh-node">
                  <strong>体互 {data.interTiGua?.name ?? '—'}</strong>
                  <div style={{ fontSize: 12, color: WUXING_COLOR[data.interTiGua?.element ?? ''] ?? '#ccc' }}>{data.interTiGua?.element ?? ''}</div>
                  <span className="rl" style={{ background: relationColor(data.analysis?.inter1Relation ?? '') }}>
                    {data.analysis?.inter1Relation ?? '—'}
                  </span>
                </div>
                <div className="mh-node">
                  <strong>用互 {data.interYongGua?.name ?? '—'}</strong>
                  <div style={{ fontSize: 12, color: WUXING_COLOR[data.interYongGua?.element ?? ''] ?? '#ccc' }}>{data.interYongGua?.element ?? ''}</div>
                  <span className="rl" style={{ background: relationColor(data.analysis?.inter2Relation ?? '') }}>
                    {data.analysis?.inter2Relation ?? '—'}
                  </span>
                </div>
                <div className="mh-node">
                  <strong>变用 {data.changedYongGua?.name ?? '—'}</strong>
                  <div style={{ fontSize: 12, color: WUXING_COLOR[data.changedYongGua?.element ?? ''] ?? '#ccc' }}>{data.changedYongGua?.element ?? ''}</div>
                  <span className="rl" style={{ background: relationColor(data.analysis?.changedRelation ?? '') }}>
                    {data.analysis?.changedRelation ?? '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 动爻爻辞置顶 + 卦辞手风琴 */}
          {data.mainHexagram?.movingYaoCi && (
            <div className="mh-card">
              <h3>动爻爻辞（{data.movingYao?.yaoName}）</h3>
              <p className="mh-text">{data.mainHexagram.movingYaoCi}</p>
            </div>
          )}
          <details className="mh-card">
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>卦辞（本卦 / 互卦 / 变卦）</summary>
            <p className="mh-text"><strong>本卦</strong>：{data.mainHexagram?.description}</p>
            <p className="mh-text"><strong>互卦</strong>：{data.interHexagram?.description}</p>
            <p className="mh-text"><strong>变卦</strong>：{data.changedHexagram?.description}</p>
          </details>

          {data.analysis?.yingQi && data.analysis.yingQi.length > 0 && (
            <div className="mh-card">
              <h3>应期线索（只作快慢参考，不机械定日）</h3>
              <ul className="mh-text" style={{ margin: 0, paddingLeft: 18 }}>
                {data.analysis.yingQi.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}

          {data.evidenceTrail && (
            <details className="mh-card">
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                起卦依据与证据链（{data.evidenceTrail.items?.length ?? 0} 条）
              </summary>
              <p className="mh-text">{data.evidenceTrail.summary}</p>
              <ul style={{ paddingLeft: 18 }}>
                {(data.evidenceTrail.items ?? []).map((it, i) => (
                  <li key={i} className="mh-text">
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

      <p className="mh-disclaimer">
        本页为传统文化·易占速占工具，结果仅供娱乐参考，不构成医疗、法律、投资或任何决策建议。
        卦象与体用生克均由引擎按固定规则推出，请勿据以行事。板块标识：meihua。
      </p>
    </main>
  );
}
