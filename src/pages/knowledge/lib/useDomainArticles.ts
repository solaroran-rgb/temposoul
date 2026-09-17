// src/pages/knowledge/lib/useDomainArticles.ts
import { useEffect, useMemo, useState } from 'react';
import type { PageState } from '@/types/page-state';
import { ttlCache } from '@/lib/safe-storage-ttl';
import { ZIWEI_STAR_METAS, ZIWEI_STAR_RECORDS } from '@/data/knowledge/content/ziwei-stars';
import { ZIWEI_PALACE_METAS, ZIWEI_PALACE_RECORDS } from '@/data/knowledge/content/ziwei-palaces';

export type EntryConfidence = 'verified' | 'probable' | 'legendary';
export type EntryCompleteness = 'full' | 'partial' | 'stub';
export type DomainCategory = 'ziwei-star' | 'ziwei-palace';

export interface DomainArticleMeta {
  readonly slug: string;
  readonly title: string;
  readonly category: DomainCategory;
  readonly summary: string;
}

export interface DomainArticleBlock {
  readonly kind: 'paragraph';
  readonly text: string;
}

export interface DomainArticle {
  readonly slug: string;
  readonly title: string;
  readonly category: DomainCategory;
  readonly blocks: readonly DomainArticleBlock[];
  readonly confidence: EntryConfidence;
  readonly completeness: EntryCompleteness;
  readonly ready: boolean;
  readonly sources: readonly string[];
}

export interface DomainArticleQuery {
  readonly category: DomainCategory;
}

export interface DomainArticlesView {
  readonly state: PageState;
  readonly metas: readonly DomainArticleMeta[];
  readonly load: (slug: string) => DomainArticle | null;
}

const META_CACHE_TTL_MS = 60 * 60 * 1000;

function metaCacheKey(category: DomainCategory): string {
  return category === 'ziwei-star'
    ? 'temposoul:knowledge:ziwei-stars:meta'
    : 'temposoul:knowledge:ziwei-palaces:meta';
}

function selectMetas(category: DomainCategory): readonly DomainArticleMeta[] {
  return category === 'ziwei-star' ? ZIWEI_STAR_METAS : ZIWEI_PALACE_METAS;
}

function selectRecords(category: DomainCategory): Readonly<Record<string, DomainArticle>> {
  return category === 'ziwei-star' ? ZIWEI_STAR_RECORDS : ZIWEI_PALACE_RECORDS;
}

export function useDomainArticles(query: DomainArticleQuery): DomainArticlesView {
  const [state, setState] = useState<PageState>('idle');
  const [metas, setMetas] = useState<readonly DomainArticleMeta[]>([]);
  const cacheKey = metaCacheKey(query.category);

  useEffect(() => {
    setState('loading');
    try {
      const cached = ttlCache.get<readonly DomainArticleMeta[]>(cacheKey);
      if (cached !== null) {
        setMetas(cached);
        setState(cached.length > 0 ? 'ok' : 'ok-empty');
        return;
      }
      const list = selectMetas(query.category);
      ttlCache.set(cacheKey, list, META_CACHE_TTL_MS);
      setMetas(list);
      setState(list.length > 0 ? 'ok' : 'ok-empty');
    } catch {
      setState('error');
    }
  }, [cacheKey, query.category]);

  const load = useMemo(
    () =>
      (slug: string): DomainArticle | null => {
        const article = selectRecords(query.category)[slug];
        if (article === undefined) return null;
        if (!article.ready || article.completeness === 'stub') return null;
        return article;
      },
    [query.category],
  );

  return { state, metas, load };
}
