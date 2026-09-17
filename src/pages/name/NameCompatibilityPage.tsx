/**

* C9-终版：姓名配对页 /name/compatibility（score 恒 null）
* 修复：trackEvent 不再链式 .catch（void 类型无 catch → TS 报错），改 try/catch
  */
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { NameCompatForm, type CompatFormValue } from '../../components/name/NameCompatForm';
import { PairDimensionList } from '../../components/name/PairDimensionList';
import { MethodOriginCard } from '../../components/name/MethodOriginCard';
import { PairDisclaimer } from '../../components/name/PairDisclaimer';
import { computeNamePair } from './lib/nameCompat';
import type { DossierProvider } from '../../types/pair';
import { usePromptCopyShare } from '../../hooks/usePromptCopyShare';
import { trackEvent } from '../../lib/analytics';
import { guardText } from '../../lib/assertions-guard';
import type { PairResult } from '../../types/pair';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

/** 注入点：由本地侧按实际字档案 loader 替换 */
const dossierProvider: DossierProvider = () => undefined;

export function NameCompatibilityPage(): React.ReactElement {
  const nav = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [result, setResult] = useState<PairResult | null>(null);

  const onBack = useCallback(() => {
    if (window.history.length > 1) nav(-1);
    else nav('/');
  }, [nav]);

  const onSubmit = useCallback((v: CompatFormValue) => {
    setState('loading');
    // 修复：不用 .catch?.()，改 try/catch（trackEvent 返回 void）
    try {
      trackEvent('name_compat_submit', {
        aScript: v.aScript,
        bScript: v.bScript,
        crossScript: v.aScript !== v.bScript,
      });
    } catch {
      /* 埋点失败不阻塞主流程 */
    }

    try {
      const r = computeNamePair(
        { name: v.aName.trim(), script: v.aScript as 'han' | 'latin' },
        { name: v.bName.trim(), script: v.bScript as 'han' | 'latin' },
        dossierProvider,
      );
      setResult(r);
      const usable = r.dimensions.filter((d) => !d.unavailableReason).length;
      setState(usable === 0 ? 'ok-empty' : r.caveats.length > 2 ? 'degraded' : 'ok');
    } catch {
      setState('error');
    }
  }, []);

  const shareText = useMemo(() => {
    if (!result) return '';
    return [
      '姓名配对观察（娱乐参考，非关系预测）',
      result.summary,
      ...result.caveats.slice(0, 2),
      '—— 命律 TempoSoul',
    ].join('\n');
  }, [result]);
  const { copyState, handleCopy } = usePromptCopyShare(shareText);

  return (
    <>
      <PageTopbar title="姓名配对" onBack={onBack} />
      <main className="name-compat-page">
        <p className="name-compat-page__boundary">娱乐参考，非关系预测；不含吉凶判断与事件断言。</p>

        <NameCompatForm onSubmit={onSubmit} loading={state === 'loading'} />

        {state === 'loading' && <p className="name-compat-page__hint">正在计算…</p>}
        {state === 'error' && (
          <p className="name-compat-page__error">计算失败，请稍后重试（本页不上传任何数据）。</p>
        )}
        {state === 'ok-empty' && (
          <p className="name-compat-page__empty">
            当前输入下无可比对维度，建议双方均使用中文姓名查看。
          </p>
        )}

        {result && (state === 'ok' || state === 'ok-empty' || state === 'degraded') && (
          <>
            <section className="name-compat-page__summary">
              <h2>关系特征描述</h2>
              <p>{guardText(result.summary)}</p>
              <p className="name-compat-page__score-note">
                本页不输出缘分总分（评分易被误读为吉凶判断）。
              </p>
            </section>
            <PairDimensionList dimensions={result.dimensions} />
            <MethodOriginCard origin={result.methodOrigin} />
            <PairDisclaimer caveats={result.caveats} disclaimer={result.disclaimer} />
            <div className="name-compat-page__share">
              <button type="button" onClick={() => void handleCopy()} disabled={!shareText}>
                {copyState === '复制' ? '复制分享文案' : copyState}
              </button>
            </div>
          </>
        )}
      </main>
      <PrivacyHint />
    </>
  );
}
