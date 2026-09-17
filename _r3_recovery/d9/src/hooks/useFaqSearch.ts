// D9-1
// src/hooks/useFaqSearch.ts
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { FAQ_DATA, FaqItem } from '../data/faq';

export function useFaqSearch(query: string): FaqItem[] {
  // 升维：Fuse 实例单例化，避免每次 query 变化都重新构建索引树
  const fuse = useMemo(() => new Fuse(FAQ_DATA, { 
    keys: ['question', 'answer'], 
    threshold: 0.3,
    includeScore: true
  }), []);

  return useMemo(() => {
    if (!query.trim()) return FAQ_DATA;
    return fuse.search(query).map(r => r.item);
  }, [query, fuse]);
}
