// A23-5 · 测验干扰项生成 + 每日一牌 seed（确定性，禁真随机）
// 干扰项 = 同组其他牌义（排除正确项后）→ pickManyBySeed 取 3 → 与正确项组合 4 项 → 同 seed 洗牌
import { djb2 } from '@/lib/hash';
import { seedToIndex, pickManyBySeed } from '@/lib/deterministic';
import { TAROT_LEARN_GROUPS, LEARN_RULESET_VERSION } from './groups';
import type { DailyCardPayload, LearnQuizItem, TarotGroup } from './types';

function toSeed(str: string): number {
  return parseInt(djb2(str), 36) >>> 0;
}

function groupCards(group: TarotGroup): string[] {
  return TAROT_LEARN_GROUPS.find((g) => g.id === group)?.cardIds ?? [];
}

/** 生成一组四选一测验：seed = djb2(`${group}|${cardId}|${quizSeq}|v1.0.0`) */
export function genQuiz(group: TarotGroup, correctCardId: string, quizSeq: number): LearnQuizItem {
  const seed = toSeed(`${group}|${correctCardId}|${quizSeq}|${LEARN_RULESET_VERSION}`);
  const pool = groupCards(group).filter((c) => c !== correctCardId);
  const distractors = pickManyBySeed(pool, seed, 3);
  // 选项顺序由同一 seed 再洗一次
  const optionCardIds = pickManyBySeed([correctCardId, ...distractors], seed + 1, 4);
  return {
    kind: 'quiz-4of1',
    prompt: '这张牌对应的牌名是？',
    correctCardId,
    optionCardIds,
    seedUsed: seed,
  };
}

/** 每日一牌：seed = djb2(`${dateKey}|daily|v1.0.0`) → seedToIndex(78) */
export function dailyCard(dateKey: string): DailyCardPayload {
  const seed = toSeed(`${dateKey}|daily|${LEARN_RULESET_VERSION}`);
  const all = TAROT_LEARN_GROUPS.flatMap((g) => g.cardIds);
  const idx = seedToIndex(seed, all.length);
  return {
    dateKey,
    cardId: all[idx],
    seed,
    rulesetVersion: LEARN_RULESET_VERSION,
  };
}
