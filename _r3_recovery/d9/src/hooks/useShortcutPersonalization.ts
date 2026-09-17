// D9-4
// src/hooks/useShortcutPersonalization.ts
import { useMemo, useCallback } from 'react';
import { safeStorage } from '../lib/safe-storage';
import { SHORTCUT_GROUPS, ShortcutItem } from '../data/home-shortcuts';
import { trackEvent } from '../lib/analytics';

export function useShortcutPersonalization() {
  const counts = safeStorage.getJSON<Record<string, number>>('temposoul:analytics:shortcuts', {});

  const sortedGroups = useMemo(() => {
    return SHORTCUT_GROUPS.map(g => ({
      ...g,
      items: [...g.items].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
    }));
  }, [counts]);

  const trackClick = useCallback((item: ShortcutItem) => {
    try {
      trackEvent('shortcut_click', { itemId: item.id });
    } catch (e) {
      // 埋点失败不阻塞主流程
    }
    const next = { ...counts, [item.id]: (counts[item.id] || 0) + 1 };
    safeStorage.setJSON('temposoul:analytics:shortcuts', next);
  }, [counts]);

  return { sortedGroups, trackClick };
}
