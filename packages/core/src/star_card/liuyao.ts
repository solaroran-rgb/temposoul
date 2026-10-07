/**
 * star_card · 六爻确定性封装（A5 卡 P3 冻结）
 * 幂等：uidHash + 本地日期 + 类别 → 确定性 seed（复用 shared/random，不改 liuyao 引擎）。
 * 同一用户同日同类别恒同卦象与解读；换类别各自独立。
 * 敏感拦截：医/法/金命中 → 不起卦不出解。
 */

import { generateLiuyao } from '../divination/algorithms/liuyao';
import { createRandomContext, randomInt } from '../shared/random';
import type { LiuyaoQuestionInput, LiuyaoResult } from './types';
import { isSensitiveHit, SENSITIVE_BLOCK_MESSAGE } from './compliance';
import { assembleSections } from './lexicon';

/** 类别 → 种子域（避免跨类别碰撞） */
const CATEGORY_SEED_DOMAIN: Record<string, string> = {
  party: 'party',
  direction: 'dir',
  lost: 'lost',
  career: 'career',
  love: 'love',
  general: 'gen',
};

/** 确定性种子：uidHash|dateKey|domain */
export function deterministicSeed(uidHash: string, dateKey: string, category: string): string {
  return `${uidHash}|${dateKey}|${CATEGORY_SEED_DOMAIN[category] ?? 'gen'}`;
}

/** 解析卦象二进制（自下而上 6 爻）——经 generateLiuyao 的确定性轨迹取卦 */
export function evaluateLiuyaoQuestion(input: LiuyaoQuestionInput): LiuyaoResult {
  const seed = deterministicSeed(input.uidHash, input.dateKey, input.category);

  // 敏感拦截：问题命中医/法/金 → 不起卦不出解
  if (input.question && isSensitiveHit(input.question)) {
    return {
      hexagramName: '',
      yaoLines: [],
      sections: [{ part: '行', text: SENSITIVE_BLOCK_MESSAGE }],
      blocked: true,
      seed,
    };
  }

  // 确定性起卦（审计闭环：六爻时间起卦拒收随机选项、天然按时间确定性；
  // 为保证「uid+日期+类别」幂等且互异，采用 manual 起卦 + seed 派生 6 爻值 6-9，
  // 完全确定性，且不违反引擎「manual 不接受随机选项」约束——我们传的是爻值而非随机选项）。
  const context = createRandomContext({ seed });
  const yaos = Array.from({ length: 6 }, () => 6 + randomInt(4, context.random)); // 6-9
  const customDate = new Date(`${input.dateKey}T12:00:00+08:00`);
  const cast = generateLiuyao(customDate, { method: 'manual', yaos });

  // 提取卦名（generateLiuyao 返回结构含主卦名；此处兼容其返回契约）
  const hexagramName = extractHexagramName(cast);
  const yaoLines = extractYaoLines(cast);

  return {
    hexagramName,
    yaoLines,
    sections: assembleSections(hexagramName, input.category),
    blocked: false,
    seed,
  };
}

/** 从 generateLiuyao 返回中提取主卦名（兼容 liuyao 引擎返回结构） */
function extractHexagramName(cast: unknown): string {
  if (cast && typeof cast === 'object') {
    const c = cast as Record<string, unknown>;
    const main = c.mainHexagram as Record<string, unknown> | undefined;
    const name =
      c.hexagramName ?? c.mainHexagramName ?? main?.name;
    if (typeof name === 'string' && name) return name;
  }
  return '水地比'; // 兜底不应发生；一旦发生保持确定性（标已知缺口）
}

/** 从 generateLiuyao 返回中提取 6 爻二进制（自下而上，1=阳）
 * 引擎 binarySymbol 编码 = [上三爻,下三爻]（各经卦内仍初爻→三爻），
 * 因此反解：lines = binary.slice(3) + binary.slice(0,3)。 */
function extractYaoLines(cast: unknown): number[] {
  if (cast && typeof cast === 'object') {
    const c = cast as Record<string, unknown>;
    const main = c.mainHexagram as Record<string, unknown> | undefined;
    const bin = main?.binarySymbol;
    if (typeof bin === 'string' && bin.length === 6) {
      const lines = (bin.slice(3, 6) + bin.slice(0, 3)).split('');
      return lines.map((ch) => (ch === '1' ? 1 : 0));
    }
  }
  return [1, 1, 0, 0, 1, 1]; // 兜底：水地比，保持确定性
}
