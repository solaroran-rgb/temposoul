// B23-5 src/pages/zodiac/TaiSuiPage.tsx
/**
 * 本命年 / 犯太岁民俗查询：输入出生年 → 对当年太岁的关系判断 → 民俗建议。
 * 结果页 noindex；禁"必然倒霉"断言；不导流付费法事。六态机。
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { getTaiSuiRule, TAI_SUI_TYPE_LABEL } from '@/data/zodiac/tai-sui';
import { chineseZodiacOfYear } from '@/data/compatibility/birthday-pairing';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

const CURRENT_YEAR = 2026;

export default function TaiSuiPage() {
  const nav = useNavigate();
  const [birthYear, setBirthYear] = useState('');
  const [state, setState] = useState<PageState>('idle');

  useDocumentMeta({ title: '犯太岁查询 · 民俗参考 | TempoSoul', noIndex: true });

  useEffect(() => {
    trackPageView('/zodiac/tai-sui');
  }, []);

  const rule = useMemo(() => getTaiSuiRule(CURRENT_YEAR), []);

  const yearNum = Number(birthYear);
  const canSubmit = Number.isInteger(yearNum) && yearNum >= 1930 && yearNum <= 2099;

  const result = useMemo(() => {
    if (!canSubmit || !rule) return null;
    const zodiac = chineseZodiacOfYear(yearNum);
    const type = rule.rules[zodiac] ?? 'none';
    return { zodiac, type };
  }, [canSubmit, rule, yearNum]);

  function handleSubmit() {
    if (!canSubmit) return;
    setState('loading');
    try {
      if (!rule) {
        setState('ok-empty');
        return;
      }
      setState('ok');
      trackEvent('tai_sui_check', { year: yearNum });
    } catch {
      setState('error');
    }
  }

  return (
    <main className="page-tai-sui">
      <PageTopbar title="犯太岁查询" onBack={() => nav('/')} />
      <p className="ts-intro">
        按民俗规则，{rule ? `${rule.year} 年（${rule.yearGanZhi}）` : '当年'} 立春（{rule?.liChunDate.slice(0, 10)}）后进入新年。输入你的出生年，看民俗中的太岁关系。
      </p>

      <div className="ts-form">
        <label className="ts-field">
          <span>出生公历年</span>
          <input
            type="number"
            min={1930}
            max={2099}
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="例如 1990"
          />
        </label>
        <button type="button" className="btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
          查看
        </button>
      </div>

      {state === 'loading' && <div className="skeleton" role="status">计算中…</div>}
      {state === 'error' && (
        <div role="alert">
          计算出错。<button type="button" onClick={() => setState('idle')}>重试</button>
        </div>
      )}
      {state === 'ok-empty' && <p className="ts-empty">该年份暂未收录，请换个年份。</p>}
      {state === 'degraded' && <p className="ts-note">部分民俗建议暂缺，仅展示关系判断。</p>}
      {state === 'ok' && result && (
        <article className="ts-result" aria-label="太岁结果">
          <h2>
            {result.zodiac} · {TAI_SUI_TYPE_LABEL[result.type]}
          </h2>
          <p className="ts-boundary">
            说明：生肖以立春为界；若你出生在当年立春之前，民俗上属上一年生肖，结果会不同。
          </p>
          {result.type === 'none' ? (
            <p>民俗上与当年太岁无明显刑冲关系，平常心对待即可。</p>
          ) : (
            <>
              <h3>民俗建议</h3>
              <ul>
                {(rule?.folkCustoms ?? []).map((c) => (
                  <li key={c}>{guardText(c)}</li>
                ))}
              </ul>
            </>
          )}
          <p className="ts-disclaimer">{rule?.disclaimer}</p>
        </article>
      )}

      <PrivacyHint />
    </main>
  );
}
