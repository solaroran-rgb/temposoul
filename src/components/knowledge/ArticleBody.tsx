//  (ArticleToc + ArticleBlocks 的复合, 供 NewsDetail 使用)
// ============================================================
import type { KnowledgeArticle } from '@/data/knowledge/schema';
import { ArticleBlocks } from './ArticleBlocks';

interface ArticleBodyProps {
  readonly sections: KnowledgeArticle['sections'];
}

export function ArticleBody({ sections }: ArticleBodyProps) {
  return <ArticleBlocks sections={sections} />;
}
