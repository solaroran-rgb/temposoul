/**
 * C9-知识库：目录组件（本地侧补交：C 交付清单缺该组件）
 */

export interface TocItem {
  id: string;
  heading: string;
  level: 2 | 3;
}

export function ArticleToc({ items }: { items: TocItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav className="article-toc" aria-label="目录">
      <span className="article-toc__title">目录</span>
      <ol className="article-toc__list">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? 'article-toc__item--sub' : ''}>
            <a href={`#${it.id}`}>{it.heading}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
