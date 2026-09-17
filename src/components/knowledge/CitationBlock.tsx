/**
 * C9-知识库：来源块组件（本地侧补交：C 交付清单缺该组件）
 */
import type { ArticleSource } from '../../data/knowledge/schema';

export function CitationBlock({ sources }: { sources: ArticleSource[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <section className="knowledge-citation" aria-label="来源">
      <h3>来源与依据</h3>
      <ul className="knowledge-citation__list">
        {sources.map((s, i) => (
          <li key={i} className="knowledge-citation__item">
            <span className="knowledge-citation__text">{s.text}</span>
            <span className="knowledge-citation__conf">{s.confidence}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
