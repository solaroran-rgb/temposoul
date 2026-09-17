//  ok-empty 安全: sections 至少 1 占位 (契约 A.1-4)
// ============================================================
import type { KnowledgeArticle } from '@/data/knowledge/schema';

interface ChapterTocProps {
  readonly sections: KnowledgeArticle['sections'];
}

export function ChapterToc({ sections }: ChapterTocProps) {
  const tocItems = sections.filter((s) => s.level === 2);
  if (tocItems.length === 0) {
    return (
      <nav className="chapter-toc chapter-toc--empty" aria-label="章节目录">
        <p className="chapter-toc__placeholder">本章暂无分节。</p>
      </nav>
    );
  }
  return (
    <nav className="chapter-toc" aria-label="章节目录">
      <h2 className="chapter-toc__title">章节</h2>
      <ul>
        {tocItems.map((s) => (
          <li key={s.heading}>
            <a href={`#${encodeURIComponent(s.heading)}`}>{s.heading}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
