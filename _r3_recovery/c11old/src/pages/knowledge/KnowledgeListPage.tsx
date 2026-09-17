
/**

* C9-终版：知识库列表 /knowledge
* 修复：只读 manifest（不再 import 正文），构建不再因缺文件失败
  */
  import React, { useMemo, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Fuse from 'fuse.js';
  import { PageTopbar } from '../../components/PageTopbar';
  import { KnowledgeCard } from '../../components/knowledge/KnowledgeCard';
  import { listMeta, toSearchItems } from '../../data/knowledge/registry';
  import type { KnowledgeCategory } from '../../data/knowledge/schema';
  import { trackPageView } from '../../lib/analytics';

const CATEGORIES: (KnowledgeCategory | 'all')[] = ['all', 'wuxing', 'ganzhi', 'shishen', 'paipan', 'shensha', 'dayun', 'boundary'];
const CATEGORY_LABEL: Record<KnowledgeCategory | 'all', string> = {
  all: '全部', wuxing: '五行', ganzhi: '天干地支', shishen: '十神',
  paipan: '排盘基础', shensha: '神煞', dayun: '大运流年', boundary: '边界与理性',
};

export function KnowledgeListPage(): React.ReactElement {
  const nav = useNavigate();
  const [category, setCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  React.useEffect(() => { void trackPageView('/knowledge'); }, []);

  const fuse = useMemo(() => new Fuse(toSearchItems(), {
    keys: ['title', 'summary', 'keywords'], threshold: 0.35,
  }), []);

  const cards = useMemo(() => {
    let base = listMeta(category === 'all' ? undefined : category);
    if (query.trim()) {
      const hits = new Set(fuse.search(query.trim()).map((r) => r.item.id));
      base = base.filter((m) => hits.has(m.slug));
    }
    return base;
  }, [category, query, fuse]);

  return (
    <>
      <PageTopbar title="八字知识库" onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))} />
      <main className="knowledge-list">
        <p className="knowledge-list__intro">
          理性命理 + 民俗文化双标注：每篇标明哪些是可核验的结构性事实，哪些是传统文化解读。
        </p>
        <div className="knowledge-list__filters" role="group" aria-label="分类筛选">
          {CATEGORIES.map((c) => (
            <button key={c} type="button"
              className={`knowledge-list__chip ${category === c ? 'knowledge-list__chip--active' : ''}`}
              onClick={() => setCategory(c)}>
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        <label className="knowledge-list__search">
          <span className="knowledge-list__search-label">搜索文章</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="如：五行、十神、桃花" />
        </label>
        {cards.length === 0 ? (
          <p className="knowledge-list__empty">未找到相关文章，换个关键词试试。</p>
        ) : (
          <ul className="knowledge-list__grid">
            {cards.map((m) => <KnowledgeCard key={m.slug} data={m} />)}
          </ul>
        )}
      </main>
    </>
  );
}

