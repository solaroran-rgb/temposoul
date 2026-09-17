/**

* C9-终版：知识库详情 /knowledge/:slug
* 修复：① 按需 import（不再静态 import 全部正文）② 干支页由编译器提供，死链已消
  */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { ArticleToc, type TocItem } from '../../components/knowledge/ArticleToc';
import { ArticleSection } from '../../components/knowledge/ArticleSection';
import { CitationBlock } from '../../components/knowledge/CitationBlock';
import { ConfidenceBadge } from '../../components/knowledge/ConfidenceBadge';
import { loadArticle, getMeta, allArticleMeta } from '../../data/knowledge/registry';
import type { KnowledgeArticle } from '../../data/knowledge/schema';
import { guardText } from '../../lib/assertions-guard';
import { trackPageView } from '../../lib/analytics';

function anchorOf(_heading: string, index: number): string {
  return `sec-${index}`;
}

export function KnowledgeDetailPage(): React.ReactElement {
  const nav = useNavigate();
  const { slug = '' } = useParams();
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoaded(false);
    void trackPageView(`/knowledge/${slug}`);
    loadArticle(slug).then((a) => {
      if (!alive) return;
      setArticle(a);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  const toc = useMemo<TocItem[]>(
    () =>
      (article?.sections ?? []).map((s, i) => ({
        id: anchorOf(s.heading, i),
        heading: s.heading,
        level: s.level,
      })),
    [article],
  );

  const pager = useMemo(() => {
    const all = allArticleMeta();
    const idx = all.findIndex((m) => m.slug === slug);
    return {
      prev: idx > 0 ? all[idx - 1] : undefined,
      next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined,
    };
  }, [slug]);

  const meta = getMeta(slug);

  if (!loaded) {
    return (
      <>
        <PageTopbar
          title="加载中"
          onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
        />
        <main className="knowledge-detail">
          <p className="knowledge-detail__empty">正在加载…</p>
        </main>
      </>
    );
  }

  if (!article) {
    const known = Boolean(meta);
    return (
      <>
        <PageTopbar title="文章" onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))} />
        <main className="knowledge-detail">
          <p className="knowledge-detail__empty">
            {known ? '本篇内容正在整理中，敬请期待。' : '文章不存在，可返回列表查看其他内容。'}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <PageTopbar
        title={article.title}
        onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
      />
      <main className="knowledge-detail">
        <header className="knowledge-detail__header">
          <h1>{article.h1}</h1>
          <div className="knowledge-detail__meta">
            <ConfidenceBadge confidence={article.confidence} />
            <span>{article.readingMinutes} 分钟阅读</span>
            <span>更新于 {article.updatedAt}</span>
            {!article.ready && <span className="knowledge-detail__wip">内容整理中</span>}
          </div>
        </header>

        <ArticleToc items={toc} />

        {article.sections.map((s, i) => (
          <section
            key={anchorOf(s.heading, i)}
            id={anchorOf(s.heading, i)}
            className="knowledge-detail__section"
          >
            {s.level === 2 ? <h2>{s.heading}</h2> : <h3>{s.heading}</h3>}
            {s.blocks.map((b, bi) => (
              <ArticleSection key={bi} block={b} />
            ))}
          </section>
        ))}

        <CitationBlock sources={article.sources} />

        {article.engineModule && (
          <section className="knowledge-detail__engine">
            <h3>关联引擎模块</h3>
            <p>
              {article.engineModule.module}（{article.engineModule.exports.join(', ')}）
            </p>
            <p className="knowledge-detail__engine-note">{article.engineModule.note}</p>
          </section>
        )}

        {article.relatedFeatures && article.relatedFeatures.length > 0 && (
          <section className="knowledge-detail__features">
            <h3>去试试</h3>
            <ul>
              {article.relatedFeatures.map((f) => (
                <li key={f.url}>
                  <a href={f.url}>{f.label}</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="knowledge-detail__disclaimer">{guardText(article.disclaimer)}</p>

        <nav className="knowledge-detail__pager" aria-label="上一篇下一篇">
          {pager.prev && <a href={`/knowledge/${pager.prev.slug}`}>← {pager.prev.title}</a>}
          {pager.next && <a href={`/knowledge/${pager.next.slug}`}>{pager.next.title} →</a>}
        </nav>
      </main>
    </>
  );
}
