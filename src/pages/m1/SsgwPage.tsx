/**
 * SsgwPage —— 三山国王灵签真实排盘页（波4 · 组B 板块2）
 *
 * 七语 i18n 接入位：本页文案暂以中文硬编码，待后续抽取为 i18n key 后接入 @/i18n。
 *
 * 引擎：@temposoul/core/divination/ssgw
 *   - drawRandomSign()      随机求签（92 签池）
 *   - resolveSignByNumber(n) 按签号回看（1-92）
 *   配套：@temposoul/core/divination/ssgw-content → resolveSsgwStoryContent 合并典故重复字段
 *
 * 可视化对照 A6 分册03 §16②：
 *   1) 签诗卷轴（--bg-paper 米黄纸感），签号大字 + 四句签诗；
 *   2) details{} 分门断语做手风琴 chips；
 *   3) 干支/抽签方式角标 + 证据链折叠。
 *
 * 合规：民俗文本娱乐参考；不编造签文——异常时显示「排盘数据待补」。
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { drawRandomSign, resolveSignByNumber } from '@temposoul/core/divination/ssgw';
import { resolveSsgwStoryContent } from '@temposoul/core/divination/ssgw-content';
import { ParamSnapshot, readParam, numParam } from '@/lib/m1-snapshot';

type SsgwResult = ReturnType<typeof drawRandomSign>;

type PageState = 'idle' | 'loading' | 'ok' | 'error';

export function SsgwPage() {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // 修复批次2 P1-①：灵签无 seed（抽签随机），URL 回写「本次签号 n」实现展示层可复现。
  const initN = readParam<number>(searchParams, 'n', 0, (v) => {
    const n = numParam(v);
    return n !== null && Number.isInteger(n) && n >= 1 && n <= 92 ? n : null;
  });
  const [state, setState] = useState<PageState>('idle');
  const [result, setResult] = useState<SsgwResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualNumber, setManualNumber] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const poemLines = useMemo(() => (result?.poem ?? '').split('\n').filter(Boolean), [result]);
  const story = useMemo(
    () => (result ? resolveSsgwStoryContent(result) : null),
    [result],
  );
  const detailEntries = useMemo(() => {
    if (!result?.details) return [] as [string, string][];
    return Object.entries(result.details).filter(
      ([, v]) => typeof v === 'string' && v.trim().length > 0,
    );
  }, [result]);

  function loadSign(n: number, method: 'random' | 'manual') {
    setState('loading');
    setErrorMsg('');
    try {
      // 随机抽签后按结果签号写回 URL；按签号回看同样写回 → 分享链接直达即得该签
      setResult(method === 'random' ? drawRandomSign() : resolveSignByNumber(n));
      setState('ok');
      setSearchParams({ n: String(n) }, { replace: true });
    } catch (e) {
      setResult(null);
      setErrorMsg(e instanceof Error ? e.message : '排盘数据待补');
      setState('error');
    }
  }

  function handleRandom() {
    // 随机签号需先抽出才知道 n，故先抽再写回（见 loadSign 调用后用结果 number）
    setState('loading');
    setErrorMsg('');
    try {
      const r = drawRandomSign();
      setResult(r);
      setState('ok');
      setSearchParams({ n: String(r.number) }, { replace: true });
    } catch (e) {
      setResult(null);
      setErrorMsg(e instanceof Error ? e.message : '排盘数据待补');
      setState('error');
    }
  }

  function handleResolve() {
    const n = Number(manualNumber);
    if (!Number.isInteger(n) || n < 1 || n > 92) {
      setErrorMsg('签号需为 1 到 92 的整数');
      setState('error');
      return;
    }
    loadSign(n, 'manual');
  }

  // 带签号直达（分享链接）时自动回看该签
  useEffect(() => {
    if (initN >= 1 && initN <= 92) loadSign(initN, 'manual');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="ssgw-page">
      <style>{`
        .ssgw-page { max-width: 760px; margin: 0 auto; padding: 0 16px 64px; color: inherit; }
        .ssgw-lead { font-size: 14px; line-height: 1.8; opacity: .8; margin: 0 0 16px; }
        .ssgw-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 16px; }
        .ssgw-draw { min-height: 44px; padding: 10px 22px; border-radius: 999px; border: none;
          background: #E24E4C; color: #fff; font-size: 15px; cursor: pointer; }
        .ssgw-manual { display: flex; gap: 8px; align-items: center; }
        .ssgw-manual input { width: 90px; padding: 8px; border-radius: 8px; border: 1px solid rgba(140,150,180,.4);
          background: transparent; color: inherit; min-height: 40px; }
        .ssgw-manual button { min-height: 40px; padding: 6px 14px; border-radius: 8px; cursor: pointer;
          border: 1px solid rgba(187,152,99,.6); background: transparent; color: inherit; }
        .ssgw-scroll { background: var(--bg-paper, #FCF8EF); border: 1px solid rgba(187,152,99,.5);
          border-radius: 14px; padding: 28px 22px; margin: 20px 0; }
        .ssgw-num { font-size: 44px; font-weight: 800; color: #E24E4C; text-align: center; line-height: 1; }
        .ssgw-title { font-size: 18px; font-weight: 700; text-align: center; margin: 10px 0 16px; }
        .ssgw-poem { font-family: 'Noto Serif SC', serif; font-size: 19px; line-height: 2.1;
          text-align: center; }
        .ssgw-poem p { margin: 0; }
        .ssgw-meta { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }
        .ssgw-chip { font-size: 12px; padding: 3px 10px; border-radius: 999px;
          border: 1px solid rgba(187,152,99,.5); color: rgba(150,110,50,.9); }
        .ssgw-story { font-size: 14px; line-height: 1.9; opacity: .88; margin-top: 18px; }
        .ssgw-story h3, .ssgw-details h3 { font-size: 15px; margin: 0 0 8px; }
        .ssgw-item { border: 1px solid rgba(140,150,180,.25); border-radius: 10px; margin-bottom: 8px; overflow: hidden; }
        .ssgw-item__head { width: 100%; text-align: left; padding: 10px 12px; background: transparent;
          border: none; color: inherit; font-size: 14px; font-weight: 600; cursor: pointer; min-height: 40px; }
        .ssgw-item__body { padding: 0 12px 12px; font-size: 13px; line-height: 1.8; opacity: .88; }
        .ssgw-foldbtn { margin-top: 8px; background: transparent; border: 1px solid #6366f1;
          color: #818cf8; border-radius: 6px; padding: 4px 10px; cursor: pointer; }
        .ssgw-ev { font-size: 13px; line-height: 1.8; opacity: .8; padding-left: 18px; }
        .ssgw-note { font-size: 12px; opacity: .55; line-height: 1.7; margin-top: 24px; }
        .ssgw-empty { border: 1px dashed rgba(140,150,180,.45); border-radius: 12px; padding: 28px;
          text-align: center; opacity: .7; }
      `}</style>

      <PageTopbar title="三山国王灵签" onBack={() => nav(-1)} />

      <h1 style={{ fontSize: 26, margin: '16px 0 8px' }}>三山国王灵签</h1>
      <p className="ssgw-lead">
        诚心默念所问之事后摇签，从 92 支签谱中求得一支；也可输入签号回看旧签。签诗与典故为民俗文本。
      </p>

      <div className="ssgw-actions">
        <button type="button" className="ssgw-draw" onClick={handleRandom}>
          {state === 'loading' ? '摇签中…' : '诚心摇签'}
        </button>
        <div className="ssgw-manual">
          <input
            aria-label="签号"
            inputMode="numeric"
            placeholder="签号1-92"
            value={manualNumber}
            onChange={(e) => setManualNumber(e.target.value)}
          />
          <button type="button" onClick={handleResolve}>
            按签号查看
          </button>
        </div>
      </div>

      {state === 'error' && (
        <div className="ssgw-empty" role="alert">
          排盘数据待补。{errorMsg || '引擎暂未返回有效签文。'}
        </div>
      )}

      {state === 'ok' && result && (
        <>
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：签号可复现；抽签本身随机，不做伪复现承诺） */}
          <ParamSnapshot
            params={{
              n: result.number,
              draw: result.draw?.method === 'manual' ? '按签号回看' : '*随机摇签*',
            }}
            engineName="三山国王灵签"
          />

          <article className="ssgw-scroll" aria-label="签文结果">
            <div className="ssgw-num">第 {result.number} 签</div>
            <div className="ssgw-title">{result.title}</div>
            <div className="ssgw-poem">
              {poemLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="ssgw-meta">
              <span className="ssgw-chip">
                干支 {result.ganzhi.year}年 {result.ganzhi.month}月 {result.ganzhi.day}日{' '}
                {result.ganzhi.hour}时
              </span>
              <span className="ssgw-chip">
                {result.draw?.method === 'manual' ? '按签号回看' : '随机摇签'} ｜ 签池{' '}
                {result.draw?.poolSize ?? 92}
              </span>
            </div>
          </article>

          {story?.canonicalStory && (
            <section className="ssgw-story">
              <h3>典故</h3>
              <p style={{ margin: 0 }}>{story.canonicalStory}</p>
            </section>
          )}

          {detailEntries.length > 0 && (
            <section className="ssgw-details" style={{ marginTop: 20 }}>
              <h3>分门断语</h3>
              {detailEntries.map(([key, value]) => {
                const open = openKey === key;
                return (
                  <div className="ssgw-item" key={key}>
                    <button
                      type="button"
                      className="ssgw-item__head"
                      aria-expanded={open}
                      onClick={() => setOpenKey(open ? null : key)}
                    >
                      {key} {open ? '−' : '+'}
                    </button>
                    {open && <div className="ssgw-item__body">{value}</div>}
                  </div>
                );
              })}
            </section>
          )}

          {result.evidenceTrail && (
            <section style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: 15 }}>计算证据链</h3>
              <p style={{ fontSize: 13, opacity: .65 }}>
                共 {result.evidenceTrail.items.length} 步 {result.evidenceTrail.summary ?? ''}
              </p>
              {showEvidence && (
                <ol className="ssgw-ev">
                  {result.evidenceTrail.items.map((it, i) => (
                    <li key={i}>{it.title}</li>
                  ))}
                </ol>
              )}
              <button
                type="button"
                className="ssgw-foldbtn"
                onClick={() => setShowEvidence((v) => !v)}
              >
                {showEvidence ? '收起' : '展开全部步骤'}
              </button>
            </section>
          )}
        </>
      )}

      <p className="ssgw-note">
        三山国王灵签为地方民俗信仰文本，签序、题名与字句在不同庙本间可能存在差异；本页签文仅供文化与娱乐参考，
        不构成医疗、法律、金融等任何决策建议。
      </p>
      <PrivacyHint />
    </main>
  );
}

export default SsgwPage;
