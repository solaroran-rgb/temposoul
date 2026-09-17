// A23-5 · 塔罗学习 聚合 + 进度读写（safe-storage 键 temposoul:a23:tarot-learn:progress）
import { safeStorage } from '@/lib/safe-storage';
import type { LearnProgressStore } from './types';
import { LEARN_RULESET_VERSION, TAROT_LEARN_GROUPS, TAROT_LEARN_GROUP_IDS, getGroupById, cardNameById } from './groups';
import { genQuiz, dailyCard } from './quiz-gen';

const PROGRESS_KEY = 'temposoul:a23:tarot-learn:progress';
const EMPTY: LearnProgressStore = { version: LEARN_RULESET_VERSION, updatedAt: '', items: [] };

export function readProgress(): LearnProgressStore {
  const stored = safeStorage.getJSON<LearnProgressStore | null>(PROGRESS_KEY, null);
  if (!stored || stored.version !== LEARN_RULESET_VERSION) return { ...EMPTY, updatedAt: new Date().toISOString() };
  return stored;
}

export function markLearned(groupId: LearnProgressStore['items'][number]['groupId'], cardId: string, score?: number): LearnProgressStore {
  const cur = readProgress();
  const rest = cur.items.filter((it) => !(it.groupId === groupId && it.cardId === cardId));
  const next: LearnProgressStore = {
    version: LEARN_RULESET_VERSION,
    updatedAt: new Date().toISOString(),
    items: [...rest, { groupId, cardId, learned: true, lastSeenAt: new Date().toISOString(), score }],
  };
  safeStorage.setJSON(PROGRESS_KEY, next);
  return next;
}

export function learnedCount(store: LearnProgressStore): number {
  return store.items.filter((i) => i.learned).length;
}

export { TAROT_LEARN_GROUPS, TAROT_LEARN_GROUP_IDS, getGroupById, cardNameById, LEARN_RULESET_VERSION };
export { genQuiz, dailyCard };
export type {
  TarotGroup,
  LearnStepKind,
  LearnGroupMeta,
  LearnProgress,
  LearnProgressStore,
  LearnQuizItem,
  DailyCardPayload,
} from './types';
