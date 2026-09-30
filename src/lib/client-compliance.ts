// 前端合规层：22 禁词（医疗 / 法律 / 投资 / 宿命 / 心理危机）过滤 + 三道闸判定。
// 禁词表与服务端 server/compliance/blacklist 同源（纯数据，无服务端依赖），前端复用避免双份维护。
import { BLACKLISTS } from '@/lib/server/compliance/blacklist';
import { hasAssertion } from '@/lib/assertions-guard';

const MARK = '［已过滤］';

interface CategoryCfg {
  terms: string[];
  exemptions: string[];
}

function buildBannedIndex(): Array<{ term: string; cat: string }> {
  const idx: Array<{ term: string; cat: string }> = [];
  for (const [cat, cfg] of Object.entries(BLACKLISTS) as [string, CategoryCfg][]) {
    for (const term of cfg.terms) idx.push({ term, cat });
  }
  return idx;
}

const BANNED_INDEX = buildBannedIndex();

/** 文本是否命中任一禁词（已考虑上下文豁免） */
export function hasBannedWord(text: string): boolean {
  if (!text) return false;
  for (const { term, cat } of BANNED_INDEX) {
    if (!text.includes(term)) continue;
    const exemptions = (BLACKLISTS as Record<string, CategoryCfg>)[cat].exemptions;
    if (exemptions.some((ex) => text.includes(ex))) continue;
    return true;
  }
  return false;
}

/** 将文本中的禁词替换为标记（已考虑上下文豁免） */
export function filterBannedWords(text: string): string {
  if (!text) return '';
  let out = text;
  for (const { term, cat } of BANNED_INDEX) {
    if (!out.includes(term)) continue;
    const exemptions = (BLACKLISTS as Record<string, CategoryCfg>)[cat].exemptions;
    if (exemptions.some((ex) => out.includes(ex))) continue;
    out = out.split(term).join(MARK);
  }
  return out;
}

export interface ThreeGates {
  /** 安全闸：输出不含禁词 / 危机词 */
  safety: boolean;
  /** 巴纳姆闸：巴纳姆比 ≤ 0.25 */
  barnum: boolean;
  /** 事实闸：无强断言且置信度已披露 */
  factual: boolean;
}

export interface ThreeGatesInput {
  /** 拼接后的全部结论文本 */
  text: string;
  /** 巴纳姆比（无则视为通过） */
  barnumRatio?: number;
  /** 置信度是否已披露 */
  confidenceDisclosed: boolean;
}

/** 三道闸前端判定：安全 / 巴纳姆 / 事实 */
export function evaluateThreeGates(input: ThreeGatesInput): ThreeGates {
  const safety = !hasBannedWord(input.text);
  const barnum = input.barnumRatio === undefined || input.barnumRatio <= 0.25;
  const factual = !hasAssertion(input.text) && input.confidenceDisclosed;
  return { safety, barnum, factual };
}
