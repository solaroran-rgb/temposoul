/**
 * 知识总览端点（GET /api/v1/knowledge/overview）消费层。
 *
 * 服务端契约（已冻结）：
 * {
 *   lexicon_categories: string[]（37 个分类名）,
 *   classics: [{ slug, title, author, dynasty, description, chapterCount, ready }]
 * }
 * 仅服务「词库页」的分类按钮集合与经典典籍区块；词条本体仍为本地静态词库。
 */
import { fetchJson, type FetchResult } from '@/lib/http/fetch-json';

export interface KnowledgeClassic {
  slug: string;
  title: string;
  author: string;
  dynasty: string;
  description: string;
  chapterCount: number;
  ready: boolean;
}

export interface KnowledgeOverview {
  lexicon_categories: string[];
  classics: KnowledgeClassic[];
}

export function fetchKnowledgeOverview(timeoutMs = 8000): Promise<FetchResult<KnowledgeOverview>> {
  return fetchJson<KnowledgeOverview>('/api/v1/knowledge/overview', { timeoutMs });
}
