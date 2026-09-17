// src/pages/names/NameCatalogPage.tsx
import React, { useState, useMemo } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ALL_NAMES, filterNames } from '@/data/names/catalog-index';
import NameFilterBar from '@/components/names/NameFilterBar';
import NameCard from '@/components/names/NameCard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';

export default function NameCatalogPage() {
  useNoindex();
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');
  const [keyword, setKeyword] = useState('');

  React.useEffect(() => {
    trackPageView('/names/catalog');
  }, []);

  const results = useMemo(
    () => filterNames({ gender, keyword: keyword.trim() || undefined }, ALL_NAMES),
    [gender, keyword],
  );

  React.useEffect(() => {
    if (results.length > 0) {
      trackEvent('name_catalog_filter', { gender, resultCount: results.length });
    }
  }, [gender, results.length]);

  return (
    <div className="name-catalog-page">
      <PageTopbar title="名字大全" onBack={() => window.history.back()} />
      <PrivacyHint />
      <NameFilterBar
        gender={gender}
        setGender={setGender}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <div className="catalog-list">
        {results.length === 0 ? (
          <p>未找到匹配名字，请调整筛选条件</p>
        ) : (
          results.map((entry) => <NameCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
