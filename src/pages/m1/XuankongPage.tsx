/**
 * 玄空飞星排盘页（历法风水组 · 波4 内容模板填充）
 *
 * 七语 i18n 接入位：本页中文文案集中于组件内联字符串，i18n 化时按 key 抽取。
 *
 * 引擎：@temposoul/core/xuankong → generateXuanKong({ year, sitMountain })
 * 可视化（对照 A6 04 §22）：
 *   - 3×3 三盘飞星九宫（每宫叠排运星/山星/向星，当运旺星描金）
 *   - 到山到向结论 + 组合格局卡（吉格/凶格对照）
 *   - 引擎 scope 透明标注（已实现/未实现）
 * 能力边界（X1-D-27，如实标注）：当前仅下卦三盘；替卦（兼向替星）、玄空大卦、形峦断法【待排期/专家】。
 */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateXuanKong } from '@temposoul/core/xuankong';
import type { XuanKongResult } from '@temposoul/core/xuankong';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

/** 二十四山（用于坐山下拉；引擎侧做成员校验） */
const MOUNTAINS = [
  '壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳',
  '丙', '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥',
] as const;

/** 洛书九宫在盘面的排布（面南而居：上南下北、左东右西） */
const GRID: number[][] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

type PageState = 'idle' | 'ok' | 'empty' | 'error';

export function XuankongPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：URL 读初始值（坐山按二十四山校验），合法链接直达即复现
  const initYear = readParam(searchParams, 'year', '2024');
  const initSit = readParam(searchParams, 'sit', '子', (v) =>
    (MOUNTAINS as readonly string[]).includes(v) ? v : null,
  );
  const [yearInput, setYearInput] = useState<string>(initYear);
  const [sit, setSit] = useState<string>(initSit);
  const [state, setState] = useState<PageState>('idle');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<XuanKongResult | null>(null);

  const run = (overrideYear?: string, overrideSit?: string) => {
    const y = overrideYear ?? yearInput;
    const s = overrideSit ?? sit;
    const year = Number.parseInt(y, 10);
    if (!Number.isSafeInteger(year) || year < 1 || year > 9999) {
      setState('error');
      setError('请输入 1-9999 的建造/起运年。');
      setResult(null);
      return;
    }
    try {
      const r = generateXuanKong({ year, sitMountain: s });
      if (!r || !r.palaces?.length) {
        setState('empty');
        setResult(null);
        return;
      }
      setResult(r);
      setState('ok');
      setError('');
      setSearchParams({ year: String(year), sit: s }, { replace: true });
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : '排盘失败。');
      setResult(null);
    }
  };

  // 带参数直达（分享链接）时自动排盘
  useEffect(() => {
    if (searchParams.get('year') || searchParams.get('sit')) run(initYear, initSit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="xkx-page">
      <style>{`
        .xkx-page{max-width:880px;margin:0 auto;padding:28px 18px 72px;color:inherit;
          font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;line-height:1.7}
        .xkx-page h1{font-size:28px;margin:0 0 6px;font-weight:700}
        .xkx-crumb{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 14px}
        .xkx-lead{font-size:14px;opacity:.8;margin:0 0 20px}
        .xkx-form{display:flex;flex-wrap:wrap;gap:10px;align-items:center;
          background:rgba(255,255,255,.04);border:1px solid rgba(150,160,190,.25);
          border-radius:12px;padding:14px 16px;margin-bottom:22px}
        .xkx-form label{font-size:14px;opacity:.85}
        .xkx-form input,.xkx-form select{padding:8px 10px;border-radius:8px;
          border:1px solid rgba(150,160,190,.4);background:transparent;color:inherit;
          font-size:15px;font-variant-numeric:tabular-nums}
        .xkx-form input{width:110px}
        .xkx-btn{padding:8px 18px;border-radius:8px;border:none;cursor:pointer;
          background:#BB9863;color:#fff;font-size:14px;font-weight:600}
        .xkx-card{border:1px solid rgba(150,160,190,.22);border-radius:12px;
          padding:16px 18px;margin:14px 0;background:rgba(255,255,255,.03)}
        .xkx-card h2{font-size:16px;margin:0 0 12px;font-weight:600}
        .xkx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:480px;margin:0 auto}
        .xkx-cell{position:relative;border:1px solid rgba(187,152,99,.45);border-radius:10px;
          aspect-ratio:1/1;display:flex;flex-direction:column;align-items:center;justify-content:center;
          background:rgba(255,255,255,.04)}
        .xkx-cell--sit{box-shadow:inset 0 0 0 2px #66C9C3}
        .xkx-cell--facing{box-shadow:inset 0 0 0 2px #E24E4C}
        .xkx-cell-head{font-size:11px;opacity:.65;position:absolute;top:5px;left:7px}
        .xkx-nums{display:flex;gap:8px;font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}
        .xkx-num{display:flex;flex-direction:column;align-items:center;line-height:1.2}
        .xkx-num small{font-size:9px;font-weight:400;opacity:.55}
        .xkx-num--gold{color:#EECB0D}
        .xkx-combo{display:flex;flex-direction:column;gap:8px}
        .xkx-combo-row{display:flex;gap:10px;align-items:flex-start;border-radius:8px;padding:8px 12px;
          background:rgba(255,255,255,.04);font-size:13px}
        .xkx-tag{flex:none;padding:2px 8px;border-radius:999px;font-size:11px}
        .xkx-tag--ausp{background:rgba(76,154,107,.2);color:#7fd6a4;border:1px solid #4C9A6B}
        .xkx-tag--inausp{background:rgba(217,83,79,.18);color:#ff9c98;border:1px solid #D9534F}
        .xkx-scope{display:flex;flex-wrap:wrap;gap:8px;font-size:12px}
        .xkx-chip{padding:3px 10px;border-radius:999px;border:1px solid rgba(150,160,190,.4)}
        .xkx-chip--ok{border-color:#4C9A6B;color:#7fd6a4}
        .xkx-chip--todo{opacity:.6;border-style:dashed}
        .xkx-empty{text-align:center;padding:40px 20px;border:1px dashed rgba(150,160,190,.4);
          border-radius:12px;opacity:.7}
        .xkx-detail{font-size:13px;opacity:.85}
        .xkx-detail summary{cursor:pointer;font-weight:600;opacity:.9;padding:4px 0}
        .xkx-detail ul{margin:8px 0;padding-left:20px}
        .xkx-foot{margin-top:26px;font-size:12px;opacity:.55;text-align:center;line-height:1.8}
        .xkx-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
        .xkx-stat{border-radius:10px;padding:10px 12px;background:rgba(255,255,255,.05)}
        .xkx-stat span{font-size:12px;opacity:.6;display:block}
        .xkx-stat strong{font-size:16px;display:block;margin-top:2px;font-variant-numeric:tabular-nums}
        .xkx-legend{font-size:11px;opacity:.6;margin-top:8px;text-align:center}
      `}</style>

      <p className="xkx-crumb">风水 · 理气</p>
      <h1>玄空飞星排盘</h1>
      <p className="xkx-lead">
        依三元九运与房屋坐山，排下卦运星、山星、向星三盘九宫，并判到山到向与组合格局。
      </p>

      <div className="xkx-form">
        <label htmlFor="xkx-year">建造/起运年</label>
        <input
          id="xkx-year"
          value={yearInput}
          inputMode="numeric"
          onChange={(e) => setYearInput(e.target.value)}
        />
        <label htmlFor="xkx-sit">坐山</label>
        <select id="xkx-sit" value={sit} onChange={(e) => setSit(e.target.value)}>
          {MOUNTAINS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button type="button" className="xkx-btn" onClick={() => run()}>
          排盘
        </button>
      </div>

      {state === 'error' && (
        <div className="xkx-empty" role="alert">
          {error || '排盘数据待补'}
        </div>
      )}
      {state === 'empty' && <div className="xkx-empty">排盘数据待补。</div>}

      {state === 'ok' && result && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：引擎输出 engine.name/version 优先，不伪造） */}
          <ParamSnapshot
            params={{ year: Number.parseInt(yearInput, 10), sit: result.sitMountain }}
            engineName={result.engine.name}
            engineVersion={result.engine.version}
          />
          <XuankongResultView result={result} />
        </>
      )}

      <p className="xkx-foot">
        玄空飞星为传统风水理气模型，仅供文化研究与娱乐参考，不构成购房、装修或任何工程/安全决策建议。
        <br />
        板块：xuankong
      </p>
    </div>
  );
}

function XuankongResultView({ result }: { result: XuanKongResult }) {
  const palaceByGong = useMemo(() => {
    const map = new Map<number, (typeof result.palaces)[number]>();
    for (const p of result.palaces) map.set(p.gong, p);
    return map;
  }, [result.palaces]);

  const yunStar = result.period.yunStar;
  const sitDirection = directionOfMountain(result.sitMountain, palaceByGong);
  const facingDirection = directionOfMountain(result.facingMountain, palaceByGong);

  return (
    <>
      <div className="xkx-card">
        <h2>局</h2>
        <div className="xkx-stats">
          <div className="xkx-stat">
            <span>运程</span>
            <strong>{result.period.label}</strong>
          </div>
          <div className="xkx-stat">
            <span>坐向</span>
            <strong>
              坐{result.sitMountain}向{result.facingMountain}
            </strong>
          </div>
          <div className="xkx-stat">
            <span>到山到向</span>
            <strong style={{ fontSize: 14 }}>{result.daoShanXiang.summary}</strong>
          </div>
        </div>
      </div>

      {/* 三盘九宫 */}
      <div className="xkx-card">
        <h2>三盘飞星九宫（运 / 山 / 向）</h2>
        <div className="xkx-grid">
          {GRID.flat().map((gong) => {
            const p = palaceByGong.get(gong);
            if (!p) return <div key={gong} className="xkx-cell" />;
            const isSit = p.direction === sitDirection;
            const isFacing = p.direction === facingDirection;
            return (
              <div
                key={gong}
                className={`xkx-cell ${isSit ? 'xkx-cell--sit' : ''} ${isFacing ? 'xkx-cell--facing' : ''}`}
                title={`${p.name}（${p.direction}）：运${p.yunStar} 山${p.shanStar} 向${p.xiangStar}`}
              >
                <span className="xkx-cell-head">
                  {p.name}·{p.direction}
                </span>
                <div className="xkx-nums">
                  <span className={`xkx-num ${p.yunStar === yunStar ? 'xkx-num--gold' : ''}`}>
                    {p.yunStar}
                    <small>运</small>
                  </span>
                  <span className={`xkx-num ${p.shanStar === yunStar ? 'xkx-num--gold' : ''}`}>
                    {p.shanStar}
                    <small>山</small>
                  </span>
                  <span className={`xkx-num ${p.xiangStar === yunStar ? 'xkx-num--gold' : ''}`}>
                    {p.xiangStar}
                    <small>向</small>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="xkx-legend">
          青框=坐山方 ｜ 红框=朝向方 ｜ 金色=当运旺星（{yunStar} 运）。数字依次为运星/山星/向星。
        </p>
      </div>

      {/* 组合格局 */}
      <div className="xkx-card">
        <h2>组合格局</h2>
        {result.combinations.length === 0 ? (
          <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>未检出特殊组合。</p>
        ) : (
          <div className="xkx-combo">
            {result.combinations.map((c) => (
              <div className="xkx-combo-row" key={c.name}>
                <span className={`xkx-tag ${c.kind === 'auspicious' ? 'xkx-tag--ausp' : 'xkx-tag--inausp'}`}>
                  {c.kind === 'auspicious' ? '吉格' : '凶格'}
                </span>
                <span>
                  <strong>{c.name}</strong>
                  <br />
                  {c.note}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* scope 透明标注 */}
      {result.scope && (
        <div className="xkx-card">
          <h2>实现范围标注</h2>
          <div className="xkx-scope">
            {result.scope.implemented.map((s) => (
              <span key={s} className="xkx-chip xkx-chip--ok">
                已实现：{s}
              </span>
            ))}
            {result.scope.notImplemented.map((s) => (
              <span key={s} className="xkx-chip xkx-chip--todo">
                待排期：{s}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, opacity: 0.6, margin: '10px 0 0' }}>{result.scope.note}</p>
        </div>
      )}

      {/* 证据折叠 */}
      <details className="xkx-detail xkx-card">
        <summary>引擎与证据（版本透明）</summary>
        <p style={{ fontSize: 13, opacity: 0.85, margin: '6px 0' }}>
          引擎：{result.engine.name} v{result.engine.version}（{result.engine.mode}）
          {result.measurement ? `；测量稳定性：${result.measurement.stability}` : ''}
        </p>
      </details>
    </>
  );
}

/**
 * 由山名反查其所在九宫方位文本。直接在本页 palaceByGong 中按山→宫映射；
 * 为保持与引擎 MOUNTAIN_TO_GONG 一致，这里采用同一套山-宫对照（只读引用）。
 */
function directionOfMountain(
  mountain: string,
  palaceByGong: Map<number, { gong: number; direction: string }>,
): string | null {
  const MOUNTAIN_TO_GONG: Record<string, number> = {
    子: 1, 癸: 1, 丑: 8, 艮: 8, 寅: 8, 甲: 3, 卯: 3, 乙: 3, 辰: 4, 巽: 4, 巳: 4,
    丙: 9, 午: 9, 丁: 9, 未: 2, 坤: 2, 申: 2, 庚: 7, 酉: 7, 辛: 7, 戌: 6, 乾: 6, 亥: 6, 壬: 1,
  };
  const gong = MOUNTAIN_TO_GONG[mountain];
  if (gong == null) return null;
  return palaceByGong.get(gong)?.direction ?? null;
}

export default XuankongPage;
