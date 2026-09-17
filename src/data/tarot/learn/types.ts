export type TarotGroup = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type LearnStepKind = 'flashcard' | 'quiz-4of1' | 'daily';

export interface LearnGroupMeta {
  id: TarotGroup;
  title: string;
  cardIds: string[];
  order: number;
  description: string;
}

export interface LearnProgress {
  groupId: TarotGroup;
  cardId: string;
  learned: boolean;
  lastSeenAt: string;
  score?: number;
}

export interface LearnProgressStore {
  version: string;
  updatedAt: string;
  items: LearnProgress[];
}

export interface LearnQuizItem {
  kind: 'quiz-4of1';
  prompt: string;
  correctCardId: string;
  optionCardIds: string[];
  seedUsed: number;
}

export interface DailyCardPayload {
  dateKey: string;
  cardId: string;
  seed: number;
  rulesetVersion: string;
}
