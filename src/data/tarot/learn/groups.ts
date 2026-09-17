// A23-5 · 5 组学习分组（引用现有 tarot-data 的 78 张牌）
// 自查：@temposoul/core/divination/tarot-data 导出名已核验为 tarotCards（{ name, type, number, suit? }，无独立 cardId）；
//       本层按 number 区间确定性派生 cardId（major-1..22 / wands-1..14 / cups-1..14 / swords-1..14 / pentacles-1..14），
//       与 core tarotCards 的 number 1..78 顺序一一对应。
import { tarotCards } from '@temposoul/core/divination/tarot-data';
import type { LearnGroupMeta, TarotGroup } from './types';

export const LEARN_RULESET_VERSION = 'tarot-learn/v1.0.0';

/** core tarotCards number 区间：major 1-22, wands 23-36, cups 37-50, swords 51-64, pentacles 65-78 */
const RANGE: Record<TarotGroup, [number, number]> = {
  major: [1, 22],
  wands: [23, 36],
  cups: [37, 50],
  swords: [51, 64],
  pentacles: [65, 78],
};

function groupCardIds(group: TarotGroup): string[] {
  const [lo, hi] = RANGE[group];
  const prefix = group;
  return tarotCards
    .filter((c) => c.number >= lo && c.number <= hi)
    .map((c) => `${prefix}-${c.number - lo + 1}`);
}

export const TAROT_LEARN_GROUPS: LearnGroupMeta[] = [
  { id: 'major', title: '大阿卡纳', cardIds: groupCardIds('major'), order: 0, description: '22 张大阿卡纳牌义科普。' },
  { id: 'wands', title: '权杖', cardIds: groupCardIds('wands'), order: 1, description: '权杖 14 张，火元素行动与热情。' },
  { id: 'cups', title: '圣杯', cardIds: groupCardIds('cups'), order: 2, description: '圣杯 14 张，水元素情感与关系。' },
  { id: 'swords', title: '宝剑', cardIds: groupCardIds('swords'), order: 3, description: '宝剑 14 张，风元素思想与冲突。' },
  { id: 'pentacles', title: '星币', cardIds: groupCardIds('pentacles'), order: 4, description: '星币 14 张，土元素物质与务实。' },
];

/** cardId → 中文牌名（来自 core tarotCards）。cardId=<group>-<seq(1-based 组内)>，core 编号 = RANGE 起点 + seq - 1 */
export function cardNameById(cardId: string): string {
  const dash = cardId.lastIndexOf('-');
  if (dash < 0) return cardId;
  const group = cardId.slice(0, dash) as TarotGroup;
  const seq = Number(cardId.slice(dash + 1));
  if (!Number.isFinite(seq) || !(group in RANGE)) return cardId;
  const coreNumber = RANGE[group][0] + seq - 1;
  const c = tarotCards.find((t) => t.number === coreNumber);
  return c ? c.name : cardId;
}

export function getGroupById(id: string): LearnGroupMeta | undefined {
  return TAROT_LEARN_GROUPS.find((g) => g.id === id);
}

export const TAROT_LEARN_GROUP_IDS = TAROT_LEARN_GROUPS.map((g) => g.id);
