// A23-5 · 塔罗每日一牌 /tarot/learn/daily（互动页 noindex，确定性每日 seed）
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { dateKey } from '@/lib/hash';
import { dailyCard, cardNameById } from '@/data/tarot/learn';

export default function TarotLearnDailyPage() {
  useDocumentMeta({ title: '塔罗每日一牌', noIndex: true });
  const navigate = useNavigate();
  const dk = dateKey();
  const payload = dailyCard(dk);
  trackPageView('/tarot/learn/daily');
  trackEvent('tarot_learn_daily_view', { date_key: dk });

  return (
    <div className="a23-page">
      <PageTopbar title="每日一牌" onBack={() => navigate('/tarot/learn')} />
      <PrivacyHint />

      <div className="a23-block" data-noindex>
        <h2>{cardNameById(payload.cardId)}</h2>
        <p className="a23-muted">日期 {payload.dateKey} · cardId {payload.cardId}</p>
        <p className="a23-muted">seed {payload.seed} · {payload.rulesetVersion}</p>
        <p>牌义科普（正位象法）：一张牌给出当下可观察的主题，仅供自我反思。</p>
      </div>

      <p className="a23-disclaimer" role="note">每日一牌为确定性文化展示，不构成占卜预测或决策依据。</p>
    </div>
  );
}
