// src/pages/names/BusinessNamePage.tsx
import React, { useState } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { INDUSTRY_WUXING } from '@/data/onomastics/industry-wuxing';
import { generateBusinessNames, BusinessNameCandidate } from '@/lib/business-name';
import CandidateNameCard from '@/components/names/CandidateNameCard';
import OwnerWuxingBadge from '@/components/names/OwnerWuxingBadge';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';

type State = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function BusinessNamePage() {
  useNoindex();
  const [industryId, setIndustryId] = useState('');
  const [surname, setSurname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [state, setState] = useState<State>('idle');
  const [results, setResults] = useState<BusinessNameCandidate[]>([]);

  React.useEffect(() => {
    trackPageView('/names/business');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!industryId) {
      setState('ok-empty');
      return;
    }
    setState('loading');
    try {
      const candidates = generateBusinessNames({
        industryId,
        ownerSurname: surname || undefined,
        ownerBirthYear: birthYear ? parseInt(birthYear, 10) : undefined,
      });
      setResults(candidates);
      setState(candidates.length ? 'ok' : 'ok-empty');
      trackEvent('business_name_generate', { industryId, count: candidates.length });
    } catch {
      setState('error');
    }
  };

  return (
    <div className="business-name-page">
      <PageTopbar title="公司/店铺起名" onBack={() => window.history.back()} />
      <PrivacyHint />
      <div className="page-content">
        <p className="disclaimer">
          起名为传统文化参考，不承诺商业成功；不涉及商标/工商注册的专业合规结论，请另行向专业机构核名。
        </p>
        <form onSubmit={handleSubmit}>
          <select
            value={industryId}
            onChange={(e) => setIndustryId(e.target.value)}
            aria-label="行业选择"
          >
            <option value="">请选择行业</option>
            {INDUSTRY_WUXING.map((ind) => (
              <option key={ind.industryId} value={ind.industryId}>
                {ind.industryName}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="老板姓氏（可选）"
            aria-label="姓氏输入"
          />
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="老板出生年（可选）"
            aria-label="出生年输入"
          />
          <button type="submit">生成候选名</button>
        </form>

        {state === 'loading' && <p>生成中...</p>}
        {state === 'ok-empty' && <p>未找到合适候选名，请调整条件</p>}
        {state === 'error' && <p>生成失败，请重试</p>}

        {state === 'ok' && results.map((c, idx) => <CandidateNameCard key={idx} candidate={c} />)}

        {birthYear && <OwnerWuxingBadge birthYear={parseInt(birthYear, 10)} />}
      </div>
    </div>
  );
}
