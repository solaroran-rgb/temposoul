/**
 * 敏感词过滤
 * 复用现有 src/data/community/moderation.ts
 */

import { checkSensitive, type SensitiveWord } from '../../../data/community/moderation';

export interface ModerationResult {
  safe: boolean;
  hits: SensitiveWord[];
  filteredText?: string;
}

export function moderateText(text: string): ModerationResult {
  const hits = checkSensitive(text);
  return {
    safe: hits.length === 0,
    hits,
    filteredText: hits.length > 0 ? filterSensitive(text, hits) : text,
  };
}

function filterSensitive(text: string, hits: SensitiveWord[]): string {
  let result = text;
  for (const hit of hits) {
    const regex = new RegExp(hit.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, '*'.repeat(hit.word.length));
  }
  return result;
}

/** 组合多字段内容进行审核 */
export function moderateContent(fields: Record<string, string>): ModerationResult {
  const allText = Object.values(fields).join('\n');
  const result = moderateText(allText);
  return result;
}