/**
 * 词库页专用 hook：服务端优先拉取 GET /api/v1/knowledge/overview。
 *
 * 三态语义：
 * - loading  ：首次请求中（页面继续用静态分组渲染，不阻塞白屏）；
 * - ok       ：服务端分类全集 + 典籍列表可用；
 * - degraded ：端点失败 / 超时 / 结构异常，调用方回退本地 CATEGORY_GROUPS 与 CLASSICS_META。
 */
import { useEffect, useState } from 'react';
import { fetchKnowledgeOverview, type KnowledgeClassic } from '@/lib/knowledge/api';

export type OverviewState = 'loading' | 'ok' | 'degraded';

export interface UseKnowledgeOverviewResult {
  state: OverviewState;
  /** 服务端分类全集（仅 state=ok 时有意义）。 */
  categories: string[];
  /** 服务端典籍列表（仅 state=ok 时有意义）。 */
  classics: KnowledgeClassic[];
}

export function useKnowledgeOverview(): UseKnowledgeOverviewResult {
  const [state, setState] = useState<OverviewState>('loading');
  const [categories, setCategories] = useState<string[]>([]);
  const [classics, setClassics] = useState<KnowledgeClassic[]>([]);

  useEffect(() => {
    let alive = true;
    fetchKnowledgeOverview()
      .then((res) => {
        if (!alive) return;
        if (res.ok && Array.isArray(res.data.lexicon_categories)) {
          setCategories(res.data.lexicon_categories);
          setClassics(Array.isArray(res.data.classics) ? res.data.classics : []);
          setState('ok');
        } else {
          setState('degraded');
        }
      })
      .catch(() => {
        if (alive) setState('degraded');
      });
    return () => {
      alive = false;
    };
  }, []);

  return { state, categories, classics };
}
