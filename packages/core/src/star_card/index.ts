/**
 * star_card · 编排入口（A5 卡 P0）
 * generateStarCard：五区块 + 六爻 + 健康检查 + 内容熔断降级链 L0-L3。
 *  - L0 完整版（五段+六爻）
 *  - L1 无气候版（养生退化为仅节气）
 *  - L2 精简版（今日一句话+方位）
 *  - L3 静态兜底（预置通用文案）
 * 健康检查：空段→L2；超长→截断或 L2；敏感词命中→替换中性兜底（sanitize 内已处理）；
 * 规则引擎抛错→L3。全局层不得含个人信息（uidHash 仅在 key 层，不进入内容）。
 */

import type { StarCardInput, StarCardOutput, StarCardBlock, LiuyaoCategory } from './types';
import { buildBlocks, dayGanzhi, buildWeather, buildDirections, buildDeepLinks } from './rules';
import { evaluateLiuyaoQuestion } from './liuyao';
import { buildCacheKeys, DEFAULT_FLAGS } from './cache';
import { withDisclaimer, sanitizeForbidden } from './compliance';

const STATIC_FALLBACK: StarCardBlock[] = [
  {
    id: 'summary',
    title: '今日一句话',
    content: withDisclaimer('今日宜从容安排，保持平稳心态，按自己的节奏行事。'),
    sourceKey: 'fallback:L3:summary',
  },
  {
    id: 'fortune',
    title: '今日方位参考',
    content: withDisclaimer('今日方位参考：宜选择熟悉与安全的方位出行（传统参考）。'),
    sourceKey: 'fallback:L3:fortune',
  },
];

/** 主要入口：生成每日星图卡片（规则层，服务端调用） */
export function generateStarCard(input: StarCardInput): StarCardOutput {
  const climateZone = input.climateZone ?? 'temperate';
  const weatherWarning = input.weatherWarning ?? '';

  /** B2 升级富化：零依赖天气 + 结构化方位 + 卡底深链 + 双层视图（两路径一致挂载） */
  const enrich = () => ({
    weather: buildWeather(input.dateKey, input.ruleVersion, climateZone, weatherWarning),
    directions: buildDirections(input.dateKey, input.ruleVersion),
    deepLinks: buildDeepLinks(input.ruleVersion),
    layers: {
      global: { dateKey: input.dateKey, ruleVersion: input.ruleVersion },
      personal: input.uidHash ? { uidHash: input.uidHash } : null,
    },
  });

  let blocks: StarCardBlock[];
  let fallbackLevel: 0 | 1 | 2 | 3 = 0;

  try {
    blocks = buildBlocks(input.dateKey, input.ruleVersion, climateZone, weatherWarning);

    // 健康检查 1：空段 → L2 精简版
    const nonEmpty = blocks.filter((b) => b.content && b.content.length > 2);
    if (nonEmpty.length < 2) {
      fallbackLevel = 2;
      blocks = nonEmpty.length >= 1 ? nonEmpty.slice(0, 2) : STATIC_FALLBACK;
    } else if (nonEmpty.length < blocks.length) {
      // 部分段失效 → 保留有效段，视为 L1
      fallbackLevel = 1;
      blocks = nonEmpty;
    }

    // 健康检查 2：超长截断（单段 > 200 字 → 截断，仍算 L0 内容安全）
    blocks = blocks.map((b) => ({
      ...b,
      content: b.content.length > 200 ? `${b.content.slice(0, 180)}…` : b.content,
    }));

    // 合规兜底：全文再过一次禁用词（buildBlocks 已处理，双保险）
    blocks = blocks.map((b) => ({ ...b, content: sanitizeForbidden(b.content).text }));
  } catch (e) {
    // 规则引擎抛错 → L3 静态兜底
    return {
      blocks: STATIC_FALLBACK,
      fallbackLevel: 3,
      ruleVersion: input.ruleVersion,
      personalized: Boolean(input.uidHash),
      ...enrich(),
    };
  }

  return {
    blocks,
    fallbackLevel,
    ruleVersion: input.ruleVersion,
    personalized: Boolean(input.uidHash),
    ...enrich(),
  };
}

/** 六爻入口：每日一问（服务端调用） */
export function starCardLiuyao(
  input: {
    uidHash: string;
    dateKey: string;
    category: LiuyaoCategory;
    question?: string;
  },
) {
  return evaluateLiuyaoQuestion(input);
}

/** 日干支入口（供前端展示/调试） */
export function getDayGanzhi(dateKey: string) {
  return dayGanzhi(dateKey);
}

export { buildCacheKeys, DEFAULT_FLAGS };
export { classifyQuestion } from './liuyao';
