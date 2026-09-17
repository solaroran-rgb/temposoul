/**
 * C9-知识库：正文块组件（本地侧补交：C 交付清单缺该组件）
 * 支持 paragraph / list / table / quote / callout / engineRef
 */
import type { ContentBlock } from '../../data/knowledge/schema';

export function ArticleSection({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case 'list':
      return (
        <ul className="knowledge-block knowledge-block--list">
          {(block.items ?? []).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case 'table': {
      const head = block.header ?? [];
      const rows = block.rows ?? [];
      return (
        <table className="knowledge-block knowledge-block--table">
          {head.length > 0 && (
            <thead>
              <tr>
                {head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    case 'quote':
      return (
        <blockquote className="knowledge-block knowledge-block--quote">{block.text}</blockquote>
      );
    case 'callout':
      return (
        <aside
          className={`knowledge-block knowledge-block--callout ${block.tone === 'boundary' ? 'is-boundary' : ''}`}
        >
          {block.text}
        </aside>
      );
    case 'engineRef':
      return (
        <p className="knowledge-block knowledge-block--engine">
          <code>{block.enginePath ?? block.text}</code>
        </p>
      );
    case 'paragraph':
    default:
      return <p className="knowledge-block knowledge-block--para">{block.text}</p>;
  }
}
