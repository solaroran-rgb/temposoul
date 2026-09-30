// D9-1
// src/pages/platform/FaqPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaqCategory } from '../../data/faq';
import { getFaqCategories } from '../../i18n/body/content';
import { useFaqSearch } from '../../hooks/useFaqSearch';
import { ContactForm } from '../../components/faq/ContactForm';
import { trackEvent } from '../../lib/analytics';

export const FaqPage: React.FC = () => {
  const [activeCat, setActiveCat] = useState<FaqCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const results = useFaqSearch(query);

  useEffect(() => {
    if (query.trim()) {
      trackEvent('faq_search', { query });
    }
  }, [query]);

  const filtered = activeCat === 'all' ? results : results.filter((i) => i.category === activeCat);

  return (
    <div className="faq-page">
      <h1 className="faq-page__title">帮助中心与联系我们</h1>

      <div className="faq-page__search">
        <input
          type="text"
          className="form-input"
          placeholder="搜索常见问题..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="搜索常见问题"
        />
      </div>

      <div className="faq-page__layout">
        <nav className="faq-page__nav" aria-label="FAQ 分类导航">
          <button
            className={`faq-page__nav-item ${activeCat === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            全部问题
          </button>
          {getFaqCategories().map((c) => (
            <button
              key={c.key}
              className={`faq-page__nav-item ${activeCat === c.key ? 'active' : ''}`}
              onClick={() => setActiveCat(c.key)}
            >
              {c.label}
            </button>
          ))}
          <Link to="/compliance?tab=dsar" className="faq-page__nav-link">
            DSAR 数据申请 →
          </Link>
        </nav>

        <main className="faq-page__content">
          {filtered.length === 0 ? (
            <p className="faq-page__empty">未找到相关问题，请尝试其他关键词或直接联系支持。</p>
          ) : (
            filtered.map((item) => (
              <details key={item.id} className="faq-accordion">
                <summary className="faq-accordion__q">{item.question}</summary>
                <p className="faq-accordion__a">{item.answer}</p>
              </details>
            ))
          )}

          <div className="faq-page__contact">
            <ContactForm />
          </div>
        </main>
      </div>
    </div>
  );
};
