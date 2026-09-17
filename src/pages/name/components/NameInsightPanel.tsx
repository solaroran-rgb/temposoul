/**
 * AI 深度解读面板：POST /api/v1/ai/analyze（SSE，useAiChat）
 * 付费：深度解读走 PremiumGate（每日免费额度 3 次，超出弹 PremiumGate；契约 v3.2 决策 22）
 * 输出：经断言治理过滤 + 固定解释边界。
 */
import React, { useCallback, useEffect, useState } from 'react';
import type { NameProfile } from '@temposoul/core/onomastics';
import { PremiumGate } from '../../../components/PremiumGate';
import { useNameInsight } from '../hooks/useNameInsight';
import { guardText } from '../../../lib/assertions-guard';
import { consumeQuota, readQuota, DAILY_FREE_LIMIT, type QuotaState } from '../lib/insightQuota';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';

export interface NameInsightPanelProps {
  profile: NameProfile;
  locked?: boolean;
}

const Gate = PremiumGate as unknown as React.ComponentType<{
  feature?: string;
  children?: React.ReactNode;
}>;

function localStore(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function NameInsightPanel({
  profile,
  locked: lockedByProp,
}: NameInsightPanelProps): React.ReactElement {
  const { t } = useNameI18n();
  const { content, loading, error, available, run } = useNameInsight();
  const [quota, setQuota] = useState<QuotaState>({
    date: '',
    used: 0,
    remaining: DAILY_FREE_LIMIT,
    locked: false,
  });

  useEffect(() => {
    setQuota(readQuota(localStore()));
  }, []);

  const locked = Boolean(lockedByProp) || quota.locked;

  const handleRun = useCallback(() => {
    if (quota.locked) return;
    setQuota(consumeQuota(localStore()));
    run(profile);
  }, [quota.locked, profile, run]);

  return (
    <section className="name-insight">
      <header className="name-insight__head">
        <h3 className="name-insight__title">{t('insight.title')}</h3>
        <button
          type="button"
          className="name-insight__run"
          onClick={handleRun}
          disabled={loading || !available || quota.locked}
        >
          {loading ? t('insight.running') : t('insight.run')}
        </button>
        <span className="name-insight__quota">
          {t('insight.quota')}：{quota.remaining}/{DAILY_FREE_LIMIT}
        </span>
      </header>
      {locked ? (
        <Gate feature="name-deep-insight">
          <p className="name-insight__locked">{t('insight.locked')}</p>
          <p className="name-insight__muted">{t('insight.quotaUsed')}</p>
        </Gate>
      ) : (
        <>
          {error && (
            <p className="name-insight__error" role="alert">
              {error}
            </p>
          )}
          {!available && !error && (
            <p className="name-insight__muted">{t('insight.unavailable')}</p>
          )}
          {content && <div className="name-insight__content">{guardText(content)}</div>}
        </>
      )}
      <p className="name-insight__boundary">{t('insight.boundary')}</p>
    </section>
  );
}

export default NameInsightPanel;
