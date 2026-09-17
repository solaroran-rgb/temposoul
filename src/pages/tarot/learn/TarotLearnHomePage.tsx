// A23-5 · 塔罗学习首页 /tarot/learn（内容页可索引 + 5 组网格 + 进度）
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { TAROT_LEARN_GROUPS, readProgress, learnedCount } from '@/data/tarot/learn';

type State = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function TarotLearnHomePage() {
  useDocumentMeta({ title: '塔罗学习 · 78 牌义科普', noIndex: false });
  const navigate = useNavigate();
  const [state] = useState<State>('ok');
  const progress = readProgress();
  const total = TAROT_LEARN_GROUPS.reduce((a, g) => a + g.cardIds.length, 0);
  trackPageView('/tarot/learn');

  return (
    <div className="a23-page">
      <PageTopbar title="塔罗学习" onBack={() => navigate(-1)} />
      <PrivacyHint />

      <p className="a23-muted">已学 {learnedCount(progress)} / {total} 张 · 仅科普牌义，不作占卜断言。</p>

      {state === 'ok' && (
        <div className="a23-grid">
          {TAROT_LEARN_GROUPS.map((g) => (
            <Link key={g.id} className="a23-card" to={`/tarot/learn/${g.id}`}
              onClick={() => trackEvent('tarot_learn_group_open', { group: g.id })}>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <p className="a23-muted">{g.cardIds.length} 张</p>
            </Link>
          ))}
        </div>
      )}

      <p className="a23-link">
        <Link to="/tarot/learn/daily">每日一牌</Link> · <Link to="/tarot/lexicon">去牌义词条</Link> · <Link to="/tarot/spreads">去牌阵</Link>
      </p>
      <p className="a23-disclaimer" role="note">塔罗内容仅供文化娱乐与自我反思参考，不构成决策或占卜预测。</p>
    </div>
  );
}
