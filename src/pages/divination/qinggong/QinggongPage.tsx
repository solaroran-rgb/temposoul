import { useCallback, useEffect, useState } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';
import { QINGGONG_TABLE, lookupQinggong } from '@/data/divination/qinggong';
import type { QinggongResultPayload } from '@/data/divination/qinggong';
import './QinggongPage.css';

type State = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function QinggongPage() {
  useNoindex();
  const [state, setState] = useState<State>('idle');
  const [age, setAge] = useState(28);
  const [month, setMonth] = useState(1);
  const [result, setResult] = useState<QinggongResultPayload | null>(null);

  useEffect(() => { trackPageView('/divination/qinggong'); }, []);

  const submit = useCallback(() => {
    setState('loading');
    const r = lookupQinggong({ virtualAge: age, lunarMonth: month });
    if (!r) { setState('ok-empty'); return; }
    setResult(r);
    setState('ok');
    trackEvent('qinggong_submit', { virtual_age: age, lunar_month: month });
    trackEvent('qinggong_result_view', { result: r.result });
  }, [age, month]);

  return (
    <div className="a23-page">
      <PageTopbar title="生男生女预测（清宫表）" onBack={() => window.history.back()} />
      <div className="a23-boundary-callout" role="note">
        仅为传统民俗趣味测试，无科学依据，不构成任何医疗建议。禁止用于性别选择。
      </div>

      <div className="qg-input">
        <label>虚岁：<input type="number" min={18} max={45} value={age} onChange={(e) => setAge(Number(e.target.value))} /></label>
        <label>农历月：<input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} /></label>
        <button className="a23-cta" onClick={submit}>查表</button>
        <small>口径：{QINGGONG_TABLE.ageConvention} / {QINGGONG_TABLE.leapMonthRule}</small>
      </div>

      {state === 'loading' && <div className="a23-skeleton" role="status" aria-live="polite"><div className="a23-skeleton-row" /></div>}
      {state === 'ok-empty' && <div role="status">请输入 18-45 虚岁、1-12 农历月。</div>}
      {state === 'degraded' && <div role="alert" className="a23-error">农历换算服务降级，请手动选择农历月。</div>}
      {state === 'error' && <div role="alert" className="a23-error">输入非法。</div>}

      {state === 'ok' && result && (
        <div>
          <h2>预测结果：{result.result === 'male' ? '男' : '女'}</h2>
          <p>{result.sourceNote}</p>
          <p>{QINGGONG_TABLE.disclaimer}</p>
        </div>
      )}

      <details>
        <summary>查看整表</summary>
        <table className="qg-table">
          <thead>
            <tr><th>虚岁\月</th>{Array.from({ length: 12 }, (_, i) => <th key={i}>{i + 1}</th>)}</tr>
          </thead>
          <tbody>
            {QINGGONG_TABLE.rows.map((r) => (
              <tr key={r.virtualAge}>
                <td>{r.virtualAge}</td>
                {Array.from({ length: 12 }, (_, i) => {
                  const v = r.lunarMonthResults[i + 1];
                  return <td key={i}>{v === 'male' ? '男' : v === 'female' ? '女' : '—'}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <PrivacyHint />
    </div>
  );
}
