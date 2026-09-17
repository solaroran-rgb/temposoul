//  关键: 【原文】/【注】通过 heading 正则识别加前缀, 禁新增块类型
// ============================================================
import type { KnowledgeArticle, ContentBlock } from '@/data/knowledge/schema';

interface ArticleBlocksProps {
  readonly sections: KnowledgeArticle['sections'];
}

const ORIGIN_PREFIX = /^[【\[]原文/;
const NOTE_PREFIX = /^[【\[]注/;

function renderBlock(block: ContentBlock, index: number) {
  switch (block.kind) {
    case 'paragraph':
      return <p key={index} className="article-blocks__paragraph">{block.text}</p>;
    case 'list':
      return <ul key={index} className="article-blocks__list">{block.items?.map((it, i) => <li key={i}>{it}</li>)}</ul>;
    case 'table':
      return (
        <table key={index} className="article-blocks__table">
          <tbody>
            {block.rows?.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      );
    case 'quote':
      return <blockquote key={index} className="article-blocks__quote">{block.text}</blockquote>;
    case 'callout':
      return <aside key={index} className={`article-blocks__callout article-blocks__callout--${block.tone}`}>{block.text}</aside>;
    case 'engineRef':
      return <div key={index} className="article-blocks__engine-ref" data-ref={block.enginePath}>相关工具 →</div>;
    default:
      return null;
  }
}

export function ArticleBlocks({ sections }: ArticleBlocksProps) {
  return (
    <div className="article-blocks">
      {sections.map((section) => {
        const isOrigin = ORIGIN_PREFIX.test(section.heading);
        const isNote = NOTE_PREFIX.test(section.heading);
        const headingClass = isOrigin ? 'article-blocks__heading article-blocks__heading--origin'
          : isNote ? 'article-blocks__heading article-blocks__heading--note'
          : 'article-blocks__heading';
        return (
          <section key={section.heading} className="article-blocks__section">
            <h2 id={encodeURIComponent(section.heading)} className={headingClass}>
              {isOrigin && <span className="article-blocks__prefix">原文</span>}
              {isNote && <span className="article-blocks__prefix">注</span>}
              {section.heading.replace(ORIGIN_PREFIX, '').replace(NOTE_PREFIX, '')}
            </h2>
            {section.blocks.map(renderBlock)}
          </section>
        );
      })}
    </div>
  );
}
