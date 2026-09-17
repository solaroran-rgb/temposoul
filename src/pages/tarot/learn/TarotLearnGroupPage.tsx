// A23-5 · 塔罗学习分组页 /tarot/learn/:group（翻卡 + 四选一 + 进度持久化，noindex）
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { getGroupById, cardNameById, genQuiz, markLearned, TAROT_LEARN_GROUP_IDS } from '@/data/tarot/learn';
import { ERR_A23_INVALID_GROUP } from '@/lib/a23-errors';

type State = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function TarotLearnGroupPage() {
  const { group } = useParams<{ group: string }>();
  const navigate = useNavigate();
  const valid = group !== undefined && (TAROT_LEARN_GROUP_IDS as string[]).includes(group);
  const meta = valid ? getGroupById(group) : undefined;
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<State>(valid ? 'loading' : 'error');

  useDocumentMeta({ title: meta ? `学习 · ${meta.title}` : '未知组', noIndex: true });

  useEffect(() => {
    if (!valid || !meta) {
      navigate('/tarot/learn', { replace: true });
      return;
    }
    trackPageView(`/tarot/learn/${group}`);
    setState('ok');
  }, [valid, meta, group, navigate]);

  const quiz = useMemo(() => {
    if (!meta) return null;
    const cardId = meta.cardIds[Math.min(idx, meta.cardIds.length - 1)];
    return genQuiz(meta.id, cardId, idx);
  }, [meta, idx]);

  if (!valid || !meta || !quiz) {
    return (
      <div className="a23-page">
        <div className="a23-block a23-error" role="alert">错误码 {ERR_A23_INVALID_GROUP}</div>
      </div>
    );
  }

  const cardId = quiz.correctCardId;
  const m = meta;

  function answer(option: string) {
    const correct = option === cardId;
    markLearned(m.id, cardId, correct ? 1 : 0);
    trackEvent('tarot_learn_card_view', { group: m.id, card_id: cardId });
    trackEvent('tarot_learn_quiz_submit', { group: m.id, correct });
    if (idx < m.cardIds.length - 1) setIdx(idx + 1);
  }

  return (
    <div className="a23-page">
      <PageTopbar title={`${meta.title} · 学习`} onBack={() => navigate('/tarot/learn')} />
      <PrivacyHint />

      {state === 'loading' && <div className="skeleton" role="status" aria-live="polite" />}

      {state === 'ok' && (
        <div className="a23-block">
          <p className="a23-muted">第 {idx + 1} / {meta.cardIds.length} 张 · seed {quiz.seedUsed}</p>
          <div className="a23-card">
            <h2>{quiz.prompt}</h2>
            <p className="a23-muted">牌义科普：{cardNameById(cardId)}</p>
          </div>
          <div className="a23-options">
            {quiz.optionCardIds.map((opt) => (
              <button key={opt} type="button" className="a23-btn" onClick={() => answer(opt)}>
                {cardNameById(opt)}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="a23-link"><Link to="/tarot/learn">← 返回学习首页</Link></p>
      <p className="a23-disclaimer" role="note">仅科普牌义，不输出占卜断言。</p>
    </div>
  );
}
