import type { BaseContentRecord, ContentMeta, ContentQuery } from './types';
import { stableRank } from './deterministic';

export interface ContentRegistry<T extends BaseContentRecord> {
  listMeta(query?: ContentQuery): ContentMeta[];
  getMeta(slug: string): ContentMeta | undefined;
  loadRecord(slug: string): T | undefined;
  loadRecordById(id: string): T | undefined;
  search(query: ContentQuery): T[];
  all(): T[];
}

export function toMeta<T extends BaseContentRecord>(r: T): ContentMeta {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    confidence: r.confidence,
    ready: r.ready,
    completeness: r.completeness,
    updatedAt: r.updatedAt,
    order: r.order,
  };
}

export function createContentRegistry<T extends BaseContentRecord>(
  records: T[]
): ContentRegistry<T> {
  const bySlug = new Map<string, T>();
  const byId = new Map<string, T>();
  records.forEach((r) => {
    bySlug.set(r.slug, r);
    byId.set(r.id, r);
  });

  function matchScore(r: T, keyword: string): number {
    if (!keyword) return r.ready ? 1 : 0;
    const k = keyword.trim().toLowerCase();
    let score = 0;
    if (r.title.toLowerCase().includes(k)) score += 10;
    if (r.slug.toLowerCase().includes(k)) score += 6;
    if ((r.summary ?? '').toLowerCase().includes(k)) score += 3;
    return score;
  }

  return {
    all: () => records,
    listMeta(query: ContentQuery = {}) {
      const filtered = records.filter((r) => !query.category || r.category === query.category);
      const ranked = stableRank(filtered, query.category ?? query.keyword ?? 'all', (r) =>
        matchScore(r, query.keyword ?? '')
      );
      const start = query.offset ?? 0;
      const end = query.limit === undefined ? ranked.length : start + query.limit;
      return ranked.slice(start, end).map(toMeta);
    },
    getMeta(slug: string) {
      const r = bySlug.get(slug);
      return r ? toMeta(r) : undefined;
    },
    loadRecord: (slug: string) => bySlug.get(slug),
    loadRecordById: (id: string) => byId.get(id),
    search(query: ContentQuery = {}) {
      const k = (query.keyword ?? '').trim().toLowerCase();
      const filtered = records.filter((r) => {
        if (query.category && r.category !== query.category) return false;
        if (!k) return true;
        return (
          r.title.toLowerCase().includes(k) ||
          r.slug.toLowerCase().includes(k) ||
          (r.summary ?? '').toLowerCase().includes(k)
        );
      });
      return stableRank(filtered, k || query.category || 'all', (r) => matchScore(r, k));
    },
  };
}
