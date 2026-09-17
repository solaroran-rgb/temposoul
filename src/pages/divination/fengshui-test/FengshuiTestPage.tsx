import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';
import { safeStorage } from '@/lib/safe-storage';
import { FS_QUESTIONS, FS_QUESTION_IDS } from '@/data/divination/fengshui-test/questions';
import { FS_MANIFEST, FS_DRAFT_KEY, FS_RESULT_KEY_PREFIX } from '@/data/divination/fengshui-test/manifest';
import { buildOutcome } from '@/data/divination/fengshui-test/outcomes';
import type { FsDraft, FsOutcome } from '@/data/divination/fengshui-test/types';
import './FengshuiTestPage.css';

type UiState = 'idle' | 'answering' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

const RULESET_VERSION = FS_MANIFEST.rulesetVersion;

export default function FengshuiTestPage() {
  useNoindex();
  const [uiState, setUiState] = useState<UiState>('idle');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [outcome, setOutcome] = useState<FsOutcome | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    trackPageView('/divination/fengshui-test');
    const draft = safeStorage.getJSON<FsDraft | null>(FS_DRAFT_KEY, null);
    if (draft && draft.rulesetVersion === RULESET_VERSION && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers);
      setUiState('answering');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (uiState !== 'answering') return;
    const draft: FsDraft = { answers, updatedAt: new Date().toISOString(), rulesetVersion: RULESET_VERSION };
    safeStorage.setJSON(FS_DRAFT_KEY, draft);
  }, [answers, hydrated, uiState]);

  const answeredCount = useMemo(() => FS_QUESTION_IDS.filter((id) => answers[id]).length, [answers]);

  const onStart = useCallback(() => {
    setUiState('answering');
    trackEvent('fs_test_start', {});
  }, []);

  const onAnswer = useCallback((qid: string, value: string) => {
    setAnswers((p) => ({ ...p, [qid]: value }));
    trackEvent('fs_test_step', { step: qid });
  }, []);

  const onSubmit = useCallback(() => {
    if (answeredCount < FS_MANIFEST.questionCount) { setUiState('error'); return; }
    setUiState('loading');
    try {
      const r = buildOutcome(answers);
      setOutcome(r);
      setUiState('ok');
      safeStorage.setJSON(`${FS_RESULT_KEY_PREFIX}${RULESET_VERSION}`, r);
      trackEvent('fs_test_submit', { question_count: answeredCount });
      trackEvent('fs_test_result_view', { overall_grade: r.overallGrade });
    } catch {
      setUiState('degraded');
    }
  }, [answeredCount, answers]);

  const onRetry = useCallback(() => {
    setAnswers({});
    setOutcome(null);
    setUiState('idle');
    trackEvent('fs_test_retry', {});
  }, []);

  return (
    <div className="a23-page">
      <PageTopbar title="阳宅风水测试" onBack={() => window.history.back()} />
      <div className="a23-boundary-callout" role="note">
        风水为传统民俗参考，不构成建筑、工程、安全、医疗建议。
      </div>

      {uiState === 'idle' && (
        <div role="status">
          <p>共 {FS_MANIFEST.questionCount} 题，按引导输入。</p>
          <button className="a23-cta" onClick={onStart}>开始测试</button>
        </div>
      )}

      {uiState === 'answering' && (
        <div>
          <div className="fs-step">
            {FS_QUESTIONS.map((q) => (
              <span key={q.id} data-active={answers[q.id] ? 'true' : 'false'}>{q.id.toUpperCase()}</span>
            ))}
          </div>
          {FS_QUESTIONS.map((q) => (
            <div key={q.id} className="fs-question">
              <p>{q.text}</p>
              {q.options.map((o) => (
                <label key={o.value}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === o.value}
                    onChange={() => onAnswer(q.id, o.value)}
                  />
                  {o.label}
                </label>
              ))}
            </div>
          ))}
          <button className="a23-cta" onClick={onSubmit} disabled={answeredCount < FS_MANIFEST.questionCount}>
            查看结果（已答 {answeredCount}/{FS_MANIFEST.questionCount}）
          </button>
        </div>
      )}

      {uiState === 'loading' && (
        <div className="a23-skeleton" role="status" aria-live="polite">
          <div className="a23-skeleton-row" /><div className="a23-skeleton-row" />
        </div>
      )}

      {uiState === 'ok-empty' && <div role="status">{FS_MANIFEST.emptyMessage}</div>}
      {uiState === 'degraded' && <div role="alert" className="a23-error">{FS_MANIFEST.degradedMessage}</div>}
      {uiState === 'error' && <div role="alert" className="a23-error">请完成全部 {FS_MANIFEST.questionCount} 题。</div>}

      {uiState === 'ok' && outcome && (
        <div>
          <h2>结果：{outcome.overallGrade}</h2>
          {outcome.dimensions.map((d) => (
            <div key={d.dimension + d.ruleTrace.hitPath}>
              <h3>{d.dimension} · {d.grade}</h3>
              <p>{d.note}</p>
            </div>
          ))}
          <ul>{outcome.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
          <p>{outcome.disclaimer}</p>
          <button className="a23-cta" onClick={onRetry}>重新测试</button>
        </div>
      )}

      <PrivacyHint />
    </div>
  );
}
