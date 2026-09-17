// 终版修正：IT-1.8 依据 (trackSearch 参数修正)；增强 Fuse 泛型类型安全与数据源防御
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { lexicon } from '../../data/lexicon';
import { ZeroStateFallback } from '../../components/search/ZeroStateFallback';
import { trackSearch } from '../../lib/analytics';

interface SearchIndexItem {
  id: string;
  type: 'lexicon' | 'feature' | 'article';
  title: string;
  summary: string;
  tags: string[];
  url: string;
  lang: string;
  confidence?: 'verified' | 'probable' | 'disputed' | 'legendary';
  updatedAt?: string;
}

const FEATURE_ENTRIES: SearchIndexItem[] = [
  {
    id: 'f1',
    type: 'feature',
    title: '八字排盘',
    summary: '专业八字大运流年排盘与十神分析',
    tags: ['八字', '排盘'],
    url: '/?mode=single&system=bazi',
    lang: 'zh-CN',
    confidence: 'verified',
    updatedAt: '2026-09-16',
  },
  {
    id: 'f2',
    type: 'feature',
    title: '紫微斗数',
    summary: '紫微十二宫与四化飞星深度解析',
    tags: ['紫微', '排盘'],
    url: '/?mode=single&system=ziwei',
    lang: 'zh-CN',
    confidence: 'verified',
    updatedAt: '2026-09-16',
  },
  {
    id: 'f3',
    type: 'feature',
    title: '姓名测试',
    summary: '五格三才与生肖音形义综合打分',
    tags: ['姓名', '测试'],
    url: '/name-test',
    lang: 'zh-CN',
    confidence: 'verified',
    updatedAt: '2026-09-16',
  },
];

// 终极防御：兼容命名导出或默认导出，确保不崩溃
type LexiconLike = Array<Partial<SearchIndexItem>>;
const lexiconObj = lexicon as unknown as LexiconLike & { default?: LexiconLike };
const lexiconData: LexiconLike = Array.isArray(lexicon)
  ? (lexicon as unknown as LexiconLike)
  : Array.isArray(lexiconObj.default)
    ? lexiconObj.default
    : [];

const SEARCH_INDEX: SearchIndexItem[] = [
  ...lexiconData.map((item) => ({ ...item, type: 'lexicon' as const })),
  ...FEATURE_ENTRIES,
] as SearchIndexItem[];

type TabType = 'lexicon' | 'feature' | 'article';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<TabType>('lexicon');

  useEffect(() => {
    if (query) {
      trackSearch({ query }); // 修正：IT-1.8 依据，传入对象参数
    }
  }, [query]);

  const fuse = useMemo(
    () =>
      new Fuse<SearchIndexItem>(SEARCH_INDEX, {
        keys: ['title', 'summary', 'tags'],
        threshold: 0.3,
        includeScore: true,
      }),
    [],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((result) => result.item);
  }, [query, fuse]);

  const filteredResults = useMemo(() => {
    if (activeTab === 'article') return []; // P1 预留，不发起任何网络请求
    return results.filter((r) => r.type === activeTab);
  }, [results, activeTab]);

  if (!query.trim()) {
    return <ZeroStateFallback query="" />;
  }

  return (
    <div className="search-page">
      <header className="search-page__header">
        <h1 className="search-page__title">搜索结果: "{query}"</h1>
        <div className="search-page__tabs" role="tablist">
          {(['lexicon', 'feature', 'article'] as TabType[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`search-page__tab ${activeTab === tab ? 'search-page__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'lexicon' ? '词库' : tab === 'feature' ? '功能入口' : '资讯 (P1)'}
            </button>
          ))}
        </div>
      </header>

      <main className="search-page__results">
        {filteredResults.length === 0 ? (
          <ZeroStateFallback query={query} />
        ) : (
          <ul className="search-page__list">
            {filteredResults.map((item) => (
              <li key={item.id} className="search-result-item">
                <Link to={item.url} className="search-result-item__link">
                  <span className="search-result-item__type-tag">{item.type}</span>
                  <h3 className="search-result-item__title">{item.title}</h3>
                  <p className="search-result-item__summary">{item.summary}</p>
                  {item.confidence && (
                    <span
                      className={`search-result-item__confidence confidence--${item.confidence}`}
                    >
                      置信度: {item.confidence}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
