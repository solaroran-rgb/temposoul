/**
 * 住宅风水综合排盘页（历法风水组 · 波4 内容模板填充）
 *
 * 七语 i18n 接入位：本页中文文案集中于组件内联字符串，i18n 化时按 key 抽取。
 *
 * 引擎：@temposoul/core/residential-fengshui → generateResidentialFengshui({...})
 *   内部聚合 八宅（@temposoul/core/bazhai）+ 玄空（@temposoul/core/xuankong）双引擎。
 * 可视化（对照 A6 04 §23）：
 *   - 八方方位吉凶盘（八宅命卦吉凶方按方位着色）
 *   - 输入摘要卡 + 玄空宅运层摘要（period/到山到向）
 *   - 综合一致/互补列表 + 行动建议清单
 * 合规：常驻「居住环境参考，不构成任何工程/安全建议」角标；不涉购房/投资断言。
 */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateResidentialFengshui } from '@temposoul/core/residential-fengshui';
import type { ResidentialFengshuiResult } from '@temposoul/core/residential-fengshui';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

const MOUNTAINS = [
  '壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳',
  '丙', '午', '丁', '未', '坤', '申', '庚', '酉', '辛', '戌', '乾', '亥',
] as const;

/** 八方罗盘格（上北下南左西右东） */
const COMPASS_GRID: Array<{ dir: string; row: number; col: number }> = [
  { dir: '西北', row: 0, col: 0 },
  { dir: '北', row: 0, col: 1 },
  { dir: '东北', row: 0, col: 2 },
  { dir: '西', row: 1, col: 0 },
  { dir: '中', row: 1, col: 1 },
  { dir: '东', row: 1, col: 2 },
  { dir: '西南', row: 2, col: 0 },
  { dir: '南', row: 2, col: 1 },
  { dir: '东南', row: 2, col: 2 },
];

type PageState = 'idle' | 'ok' | 'empty' | 'error';

export function ResidentialPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：URL 读初始值（坐山按二十四山、性别校验），合法链接直达即复现
  const initYear = readParam(searchParams, 'year', '2010');
  const initBy = readParam(searchParams, 'by', '1990');
  const initGender = readParam(searchParams, 'g', 'male', (v) =>
    v === 'male' || v === 'female' ? v : null,
  );
  const initSit = readParam(searchParams, 'sit', '子', (v) =>
    (MOUNTAINS as readonly string[]).includes(v) ? v : null,
  );
  const [yearInput, setYearInput] = useState<string>(initYear);
  const [birthYearInput, setBirthYearInput] = useState<string>(initBy);
  const [gender, setGender] = useState<'male' | 'female'>(initGender);
  const [sit, setSit] = useState<string>(initSit);
  const [state, setState] = useState<PageState>('idle');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<ResidentialFengshuiResult | null>(null);

  const run = (override?: { year?: string; by?: string; g?: 'male' | 'female'; sit?: string }) => {
    const y = override?.year ?? yearInput;
    const by = override?.by ?? birthYearInput;
    const g = override?.g ?? gender;
    const s = override?.sit ?? sit;
    const year = Number.parseInt(y, 10);
    const birthYear = Number.parseInt(by, 10);
    const hasYear = Number.isSafeInteger(year) && year >= 1 && year <= 9999;
    const hasBirth = Number.isSafeInteger(birthYear) && birthYear >= 1 && birthYear <= 9999;
    try {
      const r = generateResidentialFengshui({
        ...(hasYear ? { year } : {}),
        ...(hasBirth ? { birthYear, gender: g } : {}),
        sitMountain: s,
      });
      if (!r || (!r.bazhai && !r.xuankong)) {
        setState('empty');
        setResult(null);
        return;
      }
      setResult(r);
      setState('ok');
      setError('');
      // 提交写回 URL
      setSearchParams({ year: y, by, g, sit: s }, { replace: true });
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : '排盘失败。');
      setResult(null);
    }
  };

  // 带参数直达（分享链接）时自动排盘
  useEffect(() => {
    if (searchParams.get('year') || searchParams.get('by') || searchParams.get('sit')) {
      run({ year: initYear, by: initBy, g: initGender, sit: initSit });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="res-page">
      <style>{`
        .res-page{max-width:880px;margin:0 auto;padding:28px 18px 72px;color:inherit;
          font-family:"Noto Sans SC","Microsoft Yahei",sans-serif;line-height:1.7}
        .res-page h1{font-size:28px;margin:0 0 6px;font-weight:700}
        .res-crumb{font-size:12px;letter-spacing:2px;opacity:.55;margin:0 0 14px}
        .res-lead{font-size:14px;opacity:.8;margin:0 0 16px}
        .res-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;
          border:1px solid rgba(102,201,195,.55);color:#9be3de;background:rgba(102,201,195,.1)}
        .res-form{display:flex;flex-wrap:wrap;gap:10px;align-items:center;
          background:rgba(255,255,255,.04);border:1px solid rgba(150,160,190,.25);
          border-radius:12px;padding:14px 16px;margin-bottom:22px}
        .res-form label{font-size:14px;opacity:.85}
        .res-form input,.res-form select{padding:8px 10px;border-radius:8px;
          border:1px solid rgba(150,160,190,.4);background:transparent;color:inherit;
          font-size:15px;font-variant-numeric:tabular-nums}
        .res-form input{width:110px}
        .res-btn{padding:8px 18px;border-radius:8px;border:none;cursor:pointer;
          background:#BB9863;color:#fff;font-size:14px;font-weight:600}
        .res-card{border:1px solid rgba(150,160,190,.22);border-radius:12px;
          padding:16px 18px;margin:14px 0;background:rgba(255,255,255,.03)}
        .res-card h2{font-size:16px;margin:0 0 12px;font-weight:600}
        .res-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
        .res-stat{border-radius:10px;padding:10px 12px;background:rgba(255,255,255,.05)}
        .res-stat span{font-size:12px;opacity:.6;display:block}
        .res-stat strong{font-size:16px;display:block;margin-top:2px;font-variant-numeric:tabular-nums}
        .res-stat small{font-size:12px;opacity:.7}
        .res-compass{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:360px;margin:0 auto}
        .res-cell{border:1px solid rgba(150,160,190,.3);border-radius:10px;aspect-ratio:1/1;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          font-size:13px;text-align:center;padding:4px}
        .res-cell--center{opacity:.5;border-style:dashed}
        .res-cell--lucky{background:rgba(76,154,107,.18);border-color:#4C9A6B;color:#a9e6c3}
        .res-cell--unlucky{background:rgba(217,83,79,.15);border-color:#D9534F;color:#ffb3b0}
        .res-cell strong{font-size:14px}
        .res-cell small{font-size:11px;opacity:.85}
        .res-agree{display:flex;flex-direction:column;gap:8px}
        .res-agree-row{border-radius:8px;padding:8px 12px;background:rgba(255,255,255,.04);font-size:13px}
        .res-agree-row strong{display:block;font-size:13px}
        .res-list{margin:6px 0 0;padding-left:20px;font-size:13px}
        .res-empty{text-align:center;padding:40px 20px;border:1px dashed rgba(150,160,190,.4);
          border-radius:12px;opacity:.7}
        .res-detail{font-size:13px;opacity:.85}
        .res-detail summary{cursor:pointer;font-weight:600;opacity:.9;padding:4px 0}
        .res-foot{margin-top:26px;font-size:12px;opacity:.55;text-align:center;line-height:1.8}
      `}</style>

      <p className="res-crumb">风水 · 形势</p>
      <h1>住宅风水综合</h1>
      <p className="res-lead">
        聚合八宅人宅层与玄空宅运层，给出方位参考与分层断语。
        <span className="res-badge">居住环境参考，不构成任何工程/安全建议</span>
      </p>

      <div className="res-form">
        <label htmlFor="res-year">建造/起运年</label>
        <input id="res-year" value={yearInput} inputMode="numeric" onChange={(e) => setYearInput(e.target.value)} />
        <label htmlFor="res-by">出生年</label>
        <input id="res-by" value={birthYearInput} inputMode="numeric" onChange={(e) => setBirthYearInput(e.target.value)} />
        <label htmlFor="res-gender">性别</label>
        <select id="res-gender" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')}>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
        <label htmlFor="res-sit">坐山</label>
        <select id="res-sit" value={sit} onChange={(e) => setSit(e.target.value)}>
          {MOUNTAINS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button type="button" className="res-btn" onClick={() => run()}>
          排盘
        </button>
      </div>

      {state === 'error' && (
        <div className="res-empty" role="alert">
          {error || '排盘数据待补'}
        </div>
      )}
      {state === 'empty' && <div className="res-empty">排盘数据待补。</div>}

      {state === 'ok' && result && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot
            params={{
              year: Number.parseInt(yearInput, 10),
              by: Number.parseInt(birthYearInput, 10),
              g: gender === 'male' ? '男' : '女',
              sit,
            }}
            engineName="住宅风水 · 八宅+玄空"
          />
          <ResidentialResult result={result} />
        </>
      )}

      <p className="res-foot">
        住宅风水为传统居住环境参考，不构成购房、装修、结构改动或任何工程/安全决策建议。
        <br />
        板块：residential
      </p>
    </div>
  );
}

function ResidentialResult({ result }: { result: ResidentialFengshuiResult }) {
  const { inputSummary, bazhai, xuankong } = result;

  // 八方盘：按八宅命卦宫位着色
  const palaceByDir = useMemo(() => {
    const map = new Map<string, { label: string; luck: '吉' | '凶' }>();
    if (bazhai) {
      for (const p of bazhai.mingPalace) map.set(p.direction, { label: p.label, luck: p.luck });
    }
    return map;
  }, [bazhai]);

  return (
    <>
      {/* 输入摘要 */}
      <div className="res-card">
        <h2>输入摘要</h2>
        <div className="res-stats">
          <div className="res-stat">
            <span>山向</span>
            <strong>{inputSummary.orientationText}</strong>
          </div>
          <div className="res-stat">
            <span>宅运年份</span>
            <strong>{inputSummary.houseYear ?? '—'}</strong>
          </div>
          <div className="res-stat">
            <span>玄空状态</span>
            <strong style={{ fontSize: 14 }}>{inputSummary.xuankongStatus}</strong>
            <small>
              {inputSummary.hasPerson ? '已含居住人信息' : '未含居住人信息'}
            </small>
          </div>
        </div>
      </div>

      {/* 八宅人宅层 */}
      {bazhai && (
        <div className="res-card">
          <h2>八宅人宅层</h2>
          <div className="res-stats">
            <div className="res-stat">
              <span>命卦</span>
              <strong>
                {bazhai.mingGua}（{bazhai.mingGroup}）
              </strong>
            </div>
            <div className="res-stat">
              <span>宅卦</span>
              <strong>{bazhai.houseGua ? `${bazhai.houseGua}宅` : '未定向'}</strong>
              <small>{bazhai.houseGroup ?? '需结合坐山'}</small>
            </div>
            <div className="res-stat">
              <span>命宅关系</span>
              <strong>{bazhai.match}</strong>
              <small>{bazhai.matchAdvice}</small>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="res-compass">
              {COMPASS_GRID.map((cell) => {
                if (cell.dir === '中') {
                  return (
                    <div className="res-cell res-cell--center" key="center">
                      中宫
                    </div>
                  );
                }
                const p = palaceByDir.get(cell.dir);
                const cls = !p
                  ? ''
                  : p.luck === '吉'
                    ? 'res-cell--lucky'
                    : 'res-cell--unlucky';
                return (
                  <div className={`res-cell ${cls}`} key={cell.dir}>
                    <strong>{cell.dir}</strong>
                    <small>{p ? p.label : '—'}</small>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 11, opacity: 0.6, textAlign: 'center', marginTop: 8 }}>
              绿=命卦吉方 ｜ 红=命卦凶方（上北下南）。
            </p>
          </div>
        </div>
      )}

      {/* 玄空宅运层 */}
      {xuankong && (
        <div className="res-card">
          <h2>玄空宅运层</h2>
          <div className="res-stats">
            <div className="res-stat">
              <span>运程</span>
              <strong style={{ fontSize: 14 }}>{xuankong.period.label}</strong>
            </div>
            <div className="res-stat">
              <span>山向</span>
              <strong>
                坐{xuankong.sitMountain}向{xuankong.facingMountain}
              </strong>
            </div>
            <div className="res-stat">
              <span>到山到向</span>
              <strong style={{ fontSize: 14 }}>{xuankong.daoShanXiang.summary}</strong>
            </div>
          </div>
          {xuankong.scope && (
            <p style={{ fontSize: 12, opacity: 0.6, margin: '10px 0 0' }}>
              玄空实现范围：{xuankong.scope.implemented.join('、')}；
              {xuankong.scope.notImplemented.join('、')}待排期。
            </p>
          )}
        </div>
      )}

      {/* 综合断语 */}
      <div className="res-card">
        <h2>分层并观结论</h2>
        <div className="res-agree">
          {result.agreements.map((a, i) => (
            <div className="res-agree-row" key={i}>
              <strong>
                【{a.level}】{a.title}
              </strong>
              <span style={{ opacity: 0.85 }}>{a.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 行动建议 */}
      <div className="res-card">
        <h2>行动建议（分层参考）</h2>
        <ul className="res-list">
          {result.advice.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      {/* 证据折叠 */}
      <details className="res-detail res-card">
        <summary>证据与口径</summary>
        <p style={{ fontSize: 13, opacity: 0.85, margin: '6px 0' }}>{result.evidencePromptText}</p>
      </details>
    </>
  );
}

export default ResidentialPage;
