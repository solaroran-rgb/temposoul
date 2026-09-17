import { seedFromParts } from '@/lib/a23-seed';
import type { GufaSchool } from './types';

export interface MatchInput {
  fourPillars: string[];
  mingGua?: number;
}

export interface MatchResult {
  matchKey: string;
  rulesetVersion: string;
}

const RULESET_VERSION: Record<GufaSchool, string> = {
  sanming: 'gufa-sanming/v1.0.0',
  guiguzi: 'gufa-guiguzi/v1.0.0',
  jiuxing: 'gufa-jiuxing/v1.0.0',
};

/**
 * 确定性 matchKey 派生（无随机）：seedFromParts -> slot 索引。
 * 三命通会 / 鬼谷子：按四柱 slot 索引；九星：按命卦落宫。
 */
export function deriveMatchKey(school: GufaSchool, input: MatchInput): MatchResult {
  const base = input.fourPillars.join('|');
  const h = seedFromParts(school, base);
  if (school === 'sanming') return { matchKey: `sanming-slot-${h % 12}`, rulesetVersion: RULESET_VERSION.sanming };
  if (school === 'guiguzi') return { matchKey: `guiguzi-slot-${h % 12}`, rulesetVersion: RULESET_VERSION.guiguzi };
  const gua = input.mingGua ?? (h % 9) + 1;
  return { matchKey: String(gua), rulesetVersion: RULESET_VERSION.jiuxing };
}
