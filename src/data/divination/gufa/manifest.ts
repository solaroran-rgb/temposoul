import type { GufaManifest, GufaSchool, GufaSourceRef } from './types';

export const GUFA_SCHOOLS: readonly GufaSchool[] = ['sanming', 'guiguzi', 'jiuxing'] as const;

export function isGufaSchool(v: string | undefined | null): v is GufaSchool {
  return !!v && (GUFA_SCHOOLS as readonly string[]).includes(v);
}

const SOURCES: Record<GufaSchool, GufaSourceRef[]> = {
  sanming: [{ text: '《三命通会》', edition: '明·万民英 通行本', confidence: 'legendary' }],
  guiguzi: [{ text: '《鬼谷子》命理口诀', edition: '通行本', confidence: 'legendary' }],
  jiuxing: [{ text: '《洛书》九星体系', edition: '九星落宫通行口诀', confidence: 'legendary' }],
};

const DISPLAY_NAME: Record<GufaSchool, string> = {
  sanming: '三命通会', guiguzi: '鬼谷子', jiuxing: '九星论命',
};

const RULESET_VERSION: Record<GufaSchool, string> = {
  sanming: 'gufa-sanming/v1.0.0', guiguzi: 'gufa-guiguzi/v1.0.0', jiuxing: 'gufa-jiuxing/v1.0.0',
};

export const GUFA_MANIFESTS: Record<GufaSchool, GufaManifest> = GUFA_SCHOOLS.reduce(
  (acc, school) => {
    acc[school] = {
      school, displayName: DISPLAY_NAME[school], entryCount: 36,
      rulesetVersion: RULESET_VERSION[school], sources: SOURCES[school],
      degradedMessage: '解读服务降级，展示已缓存四柱。',
      emptyMessage: '该语料整理中，敬请期待。',
    };
    return acc;
  },
  {} as Record<GufaSchool, GufaManifest>,
);

/** 合规免责声明：古法/神煞内容为民俗文化参考，不构成任何决策依据 */
export const gufa_disclaimer =
  '本页为传统子平、神煞文化科普，属民俗与历史参考，不构成命运、健康、财运、婚姻或任何重大决策的依据；请勿据此作出生活决定。';
