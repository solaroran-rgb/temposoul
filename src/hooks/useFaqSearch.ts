// D9-1
// src/hooks/useFaqSearch.ts
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { FaqItem } from '../data/faq';
import { getFaq } from '../i18n/body/content';

export function useFaqSearch(query: string): FaqItem[] {
  // 升维：Fuse 实例单例化，避免每次 query 变化都重新构建索引树
  const fuse = useMemo(
    () =>
      new Fuse(getFaq(), {
        keys: ['question', 'answer'],
        threshold: 0.3,
        includeScore: true,
      }),
    [],
  );

  return useMemo(() => {
    if (!query.trim()) return getFaq();
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);
}
