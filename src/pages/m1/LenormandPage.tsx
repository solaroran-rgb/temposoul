/**
 * LenormandPage —— 雷诺曼真实排盘页（波4 · 组B 板块1）
 *
 * 七语 i18n 接入位：本页文案暂以中文硬编码，待后续抽取为 i18n key
 * （标题/牌阵名/按钮/组合义/免责角标等）后接入 @/i18n。
 *
 * 引擎：@temposoul/core/divination/lenormand → drawLenormandSpread(spreadType)
 * 可视化对照 A6 分册03 §15②：
 *   1) 牌阵落位卡片布局（九官/大桌按 row/column 落格，其余按牌序横排）；
 *   2) combinations 组合义连线列表（固定组合 / 相邻牌义合读，带 relation 角标）；
 *   3) layoutEvidence 大桌落宫证据（男士/女士近身牌、归宫牌）。
 *
 * 合规：全程娱乐参考免责；不编造牌面——空/异常时显示「排盘数据待补」。
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { drawLenormandSpread } from '@temposoul/core/divination/lenormand';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type LenormandResult = ReturnType<typeof drawLenormandSpread>;
type SpreadType = NonNullable<Parameters<typeof drawLenormandSpread>[0]>;

const SPREAD_OPTIONS: { value: SpreadType; label: string }[] = [
  { value: 'single', label: '单牌线索' },
  { value: 'three', label: '三牌事件线' },
  { value: 'five', label: '五牌十字阵' },
  { value: 'relationship', label: '关系牌阵' },
  { value: 'decision', label: '选择牌阵' },
  { value: 'nine', label: '九宫牌阵' },
  { value: 'element', label: '元素牌阵' },
  { value: 'grandTableau', label: '大桌牌阵（36格）' },
];

type PageState = 'idle' | 'loading' | 'ok' | 'error';

export function LenormandPage() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：URL 读初始 spread（带校验）；seed 可选，带则直达复现
  const initSpread = readParam(searchParams, 'spread', 'three', (v) =>
    SPREAD_OPTIONS.some((o) => o.value === v) ? (v as SpreadType) : null,
  );
  const seedRaw = searchParams.get('seed');
  const initSeed = seedRaw !== null && Number.isFinite(Number(seedRaw)) ? Number(seedRaw) : null;

  const [spreadType, setSpreadType] = useState<SpreadType>(initSpread);
  const [state, setState] = useState<PageState>('idle');
  const [result, setResult] = useState<LenormandResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const [lastSeed, setLastSeed] = useState<number | null>(null);

  const cards = useMemo(() => result?.cards ?? [], [result]);
  const combinations = useMemo(() => result?.combinations ?? [], [result]);
  const layoutEvidence = useMemo(() => result?.layoutEvidence ?? [], [result]);

  function draw(spread: SpreadType, forcedSeed?: number) {
    setState('loading');
    setErrorMsg('');
    try {
      // 修复批次2 P1-①：引擎支持 seed，抽牌带 seed 并写回 URL → 分享链接完整复现
      const seed = forcedSeed ?? Math.floor(Math.random() * 2147483647);
      const r = drawLenormandSpread(spread, { seed });
      setResult(r);
      setLastSeed(seed);
      setState('ok');
      setSearchParams({ spread, seed: String(seed) }, { replace: true });
    } catch (e) {
      setResult(null);
      setErrorMsg(e instanceof Error ? e.message : '排盘数据待补');
      setState('error');
    }
  }

  // 带 seed 的分享链接直达时自动复现同一局牌
  useEffect(() => {
    if (initSeed != null) draw(initSpread, initSeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="lnm-page">
      <style>{`
        .lnm-page { max-width: 1080px; margin: 0 auto; padding: 0 16px 64px; color: inherit; }
        .lnm-lead { font-size: 14px; line-height: 1.8; opacity: .8; margin: 0 0 16px; }
        .lnm-spreads { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .lnm-spread { padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(187,152,99,.5);
          background: transparent; color: inherit; font-size: 13px; cursor: pointer; min-height: 36px; }
        .lnm-spread.is-active { background: #BB9863; color: #fff; border-color: #BB9863; }
        .lnm-draw { min-height: 44px; padding: 10px 22px; border-radius: 10px; border: none;
          background: #E24E4C; color: #fff; font-size: 15px; cursor: pointer; }
        .lnm-board { margin: 20px 0; display: grid; gap: 10px; }
        .lnm-board--flow { display: flex; flex-wrap: wrap; }
        .lnm-board--nine { grid-template-columns: repeat(3, minmax(72px, 1fr)); }
        .lnm-board--grand { grid-template-columns: repeat(9, minmax(72px, 1fr)); }
        /* 修复批次2 P1·任务6：≤480px 大桌 9 列(最小 648px)必溢出 → 降级 3 列横滑卡（单张≤100px）。
           3×100 + 2×8(gap) = 316px ≤ 343px(375视口-content-padding32)，数学上不横向溢出；
           overflow-x:auto 仅作兜底。≥480px 保持原 9 列不变。 */
        @media (max-width: 480px) {
          .lnm-board--grand {
            grid-template-columns: repeat(3, minmax(0, 100px));
            gap: 8px;
            overflow-x: auto;
          }
          .lnm-board--grand .lnm-card { min-height: 0; padding: 6px; }
          .lnm-board--grand .lnm-card__meaning { display: none; }
          .lnm-board--grand .lnm-card__kw { margin: 3px 0; }
        }
        .lnm-card { border: 1px solid rgba(187,152,99,.45); border-radius: 10px; padding: 10px;
          background: var(--bg-paper, #FCF8EF); min-height: 120px; display: flex; flex-direction: column; }
        .lnm-board--flow .lnm-card { flex: 1 1 150px; max-width: 220px; }
        .lnm-card__pos { font-size: 11px; opacity: .6; }
        .lnm-card__name { font-size: 17px; font-weight: 700; margin: 4px 0; color: #BB9863; }
        .lnm-card__house { font-size: 11px; opacity: .65; }
        .lnm-kw { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
        .lnm-kw span { font-size: 11px; padding: 2px 6px; border-radius: 6px;
          background: rgba(102,201,195,.15); color: #66C9C3; }
        .lnm-card__meaning { font-size: 12px; line-height: 1.6; opacity: .85; }
        .lnm-sec { margin: 24px 0; }
        .lnm-sec h2 { font-size: 18px; margin: 0 0 10px; }
        .lnm-combo { border: 1px solid rgba(140,150,180,.3); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
        .lnm-combo__head { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .lnm-badge { display: inline-block; font-size: 11px; padding: 1px 8px; border-radius: 999px;
          margin-left: 6px; border: 1px solid rgba(230,180,90,.5); color: rgba(200,160,80,.95); }
        .lnm-combo__meaning { font-size: 13px; line-height: 1.7; opacity: .85; }
        .lnm-ev { font-size: 13px; line-height: 1.8; opacity: .8; padding-left: 18px; }
        .lnm-ev li { margin-bottom: 4px; }
        .lnm-foldbtn { margin-top: 8px; background: transparent; border: 1px solid #6366f1;
          color: #818cf8; border-radius: 6px; padding: 4px 10px; cursor: pointer; }
        .lnm-note { font-size: 12px; opacity: .55; line-height: 1.7; margin-top: 24px; }
        .lnm-empty { border: 1px dashed rgba(140,150,180,.45); border-radius: 12px; padding: 28px;
          text-align: center; opacity: .7; }
      `}</style>

      <PageTopbar title="雷诺曼" onBack={() => nav(-1)} />

      <h1 style={{ fontSize: 26, margin: '16px 0 8px' }}>雷诺曼 · 36 张小牌阵</h1>
      <p className="lnm-lead">
        选择牌阵后洗牌抽牌。雷诺曼以 36 张象征牌读取具体人事与走向，牌阵简明、贴近现实。
      </p>

      <div className="lnm-spreads" role="tablist" aria-label="牌阵选择">
        {SPREAD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={spreadType === opt.value}
            className={`lnm-spread${spreadType === opt.value ? ' is-active' : ''}`}
            onClick={() => setSpreadType(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button type="button" className="lnm-draw" onClick={() => draw(spreadType)}>
        {state === 'loading' ? '洗牌抽牌中…' : '开始抽牌'}
      </button>

      {state === 'error' && (
        <div className="lnm-empty" role="alert">
          排盘数据待补。{errorMsg || '引擎暂未返回有效牌面。'}
        </div>
      )}

      {state === 'ok' && result && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：seed 可复现 / 引擎 semver） */}
          <ParamSnapshot
            params={{ spread: spreadType, ...(lastSeed != null ? { seed: lastSeed } : {}) }}
            engineName="雷诺曼 · 36 张小牌阵"
          />

          <p style={{ fontSize: 13, opacity: .65, margin: '16px 0 4px' }}>
            {result.spreadName} ｜ 抽牌方式：{result.draw?.method ?? '—'} ｜ 牌组 {result.draw?.deckSize ?? 36} 张
          </p>

          <div
            className={
              spreadType === 'grandTableau'
                ? 'lnm-board lnm-board--grand'
                : spreadType === 'nine'
                  ? 'lnm-board lnm-board--nine'
                  : 'lnm-board lnm-board--flow'
            }
          >
            {cards.map((card) => (
              <div key={card.id} className="lnm-card" title={card.position}>
                <span className="lnm-card__pos">{card.position}</span>
                <span className="lnm-card__name">
                  {card.id}.{card.name}
                </span>
                {card.house ? <span className="lnm-card__house">落宫：{card.house}宫</span> : null}
                <span className="lnm-kw">
                  {card.keywords.map((kw) => (
                    <span key={kw}>{kw}</span>
                  ))}
                </span>
                <span className="lnm-card__meaning">{card.meaning}</span>
              </div>
            ))}
          </div>

          {combinations.length > 0 && (
            <section className="lnm-sec">
              <h2>组合连读（{combinations.length}）</h2>
              {combinations.map((combo, i) => (
                <div className="lnm-combo" key={`${combo.card1}-${combo.card2}-${i}`}>
                  <div className="lnm-combo__head">
                    {combo.card1} × {combo.card2}
                    <span className="lnm-badge">{combo.relation ?? '相邻'}</span>
                    <span className="lnm-badge">{combo.source ?? '合读'}</span>
                  </div>
                  <div className="lnm-combo__meaning">{combo.meaning}</div>
                </div>
              ))}
            </section>
          )}

          {layoutEvidence.length > 0 && (
            <section className="lnm-sec">
              <h2>盘面落宫证据</h2>
              <ul className="lnm-ev">
                {layoutEvidence.map((ev) => (
                  <li key={ev}>{ev}</li>
                ))}
              </ul>
            </section>
          )}

          {result.evidenceTrail && (
            <section className="lnm-sec">
              <h2>计算证据链</h2>
              <p style={{ fontSize: 13, opacity: .65 }}>
                共 {result.evidenceTrail.items.length} 步 {result.evidenceTrail.summary ?? ''}
              </p>
              {showEvidence && (
                <ol className="lnm-ev">
                  {result.evidenceTrail.items.map((it, i) => (
                    <li key={i}>{it.title}</li>
                  ))}
                </ol>
              )}
              <button
                type="button"
                className="lnm-foldbtn"
                onClick={() => setShowEvidence((v) => !v)}
              >
                {showEvidence ? '收起' : '展开全部步骤'}
              </button>
            </section>
          )}
        </>
      )}

      <p className="lnm-note">
        雷诺曼为西洋传统象征牌卡，牌义与组合读法仅供娱乐与文化参考，不构成医疗、法律、金融等任何决策建议。
        当前固定组合库以引擎现有能力为准（约 50 余组，完整 100+ 组组合库为后续能力）。
      </p>
      <PrivacyHint />
    </main>
  );
}

export default LenormandPage;
