import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { TESTS } from '@/data/tests/tests';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function TestsPage() {
  const [state, setState] = useState<LookupState>('idle');
  const [testId, setTestId] = useState(TESTS[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<null | { title: string; observation: string; reflection: string; action: string }>(null);

  useEffect(() => { trackPageView('/tests'); }, []);

  const test = TESTS.find((t) => t.id === testId);

  const submit = () => {
    if (!test) return;
    setState('loading');
    const total = test.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const outcome = test.outcomes.find((o) => total >= o.min && total <= o.max);
    if (!outcome) { setState('ok-empty'); return; }
    setResult(outcome);
    setState('ok');
    trackEvent('test_submit', { test_id: test.id, total });
  };

  return (
    <LookupCardLayout
      title="心理趣味测试"
      state={state}
      renderPicker={() => (
        <div>
          <select value={testId} onChange={(e) => { setTestId(e.target.value); setAnswers({}); setResult(null); setState('idle'); }}>
            {TESTS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          {test?.questions.map((q) => (
            <div key={q.id}>
              <p>{guardText(q.text)}</p>
              {q.options.map((o) => (
                <label key={o.label}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === o.score}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.score }))}
                  />
                  {guardText(o.label)}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submit}>查看结果</button>
        </div>
      )}
      renderResult={() => result && (
        <div>
          <h2>{guardText(result.title)}</h2>
          <section><h3>观察角度</h3><p>{guardText(result.observation)}</p></section>
          <section><h3>反思问题</h3><p>{guardText(result.reflection)}</p></section>
          <section><h3>行动建议</h3><p>{guardText(result.action)}</p></section>
          <p>{test?.disclaimer && guardText(test.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '暂未匹配到结果区间', idle: '请选择测试并作答' }}
    />
  );
}
