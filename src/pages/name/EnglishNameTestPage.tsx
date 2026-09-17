// src/pages/name/EnglishNameTestPage.tsx
import React, { useState } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { analyzeEnglishName, EnglishNameAnalysis } from '@/lib/english-name';
import NumberMeaningCard from '@/components/name/NumberMeaningCard';
import WuxingRefCard from '@/components/name/WuxingRefCard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';

type State = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function EnglishNameTestPage() {
  useNoindex();
  const [name, setName] = useState('');
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<EnglishNameAnalysis | null>(null);

  React.useEffect(() => {
    trackPageView('/name/english');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setState('ok-empty');
      return;
    }
    setState('loading');
    try {
      const analysis = analyzeEnglishName(name);
      setResult(analysis);
      setState('ok');
      trackEvent('english_name_test_submit', { nameLength: name.length });
    } catch {
      setState('error');
    }
  };

  return (
    <div className="english-name-test-page">
      <PageTopbar title="英文名/网名测试" onBack={() => window.history.back()} />
      <PrivacyHint />
      <div className="page-content">
        <p className="disclaimer">数字学为民俗参考，不构成科学断言或现实决策建议。</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入英文名（如 Emma Smith）"
            aria-label="英文名输入"
          />
          <button type="submit">开始分析</button>
        </form>

        {state === 'loading' && <p>分析中...</p>}
        {state === 'ok-empty' && <p>请输入有效英文名</p>}
        {state === 'error' && <p>分析失败，请重试</p>}

        {state === 'ok' && result && (
          <div className="result">
            <h2>分析结果：{result.fullName}</h2>
            <p>生命路径数字：{result.lifePathNumber}</p>
            <p>表现数字：{result.expressionNumber}</p>
            <p>个性数字：{result.personalityNumber}</p>
            <p>中文音译五行参考：{result.chineseWuxingRef}</p>
            {result.meanings.map((m) => (
              <NumberMeaningCard key={m.number} meaning={m} />
            ))}
            <WuxingRefCard wuxing={result.chineseWuxingRef} />
          </div>
        )}
      </div>
    </div>
  );
}
