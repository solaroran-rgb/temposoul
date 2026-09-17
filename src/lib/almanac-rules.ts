// src/lib/almanac-rules.ts
import type { AlmanacDayData } from '@/hooks/useAlmanacData';

export type SceneType = 'marriage' | 'travel' | 'move' | 'business' | 'build';
export type VerdictType = 'auspicious' | 'neutral' | 'inauspicious';

export interface SceneVerdict {
  sceneId: SceneType;
  sceneName: string;
  verdict: VerdictType;
  score: number;
  confidence: 'verified' | 'probable' | 'legendary';
  evidence: string[];
}

interface SceneRule {
  name: string;
  exactTerms: string[];
  fuzzyTerms: string[];
  tabooTerms: string[];
}

const SCENE_RULES: Record<SceneType, SceneRule> = {
  marriage: { name: '婚嫁', exactTerms: ['嫁娶'], fuzzyTerms: ['结婚', '订婚', '纳采'], tabooTerms: ['离婚', '分居', '破土'] },
  travel: { name: '出行', exactTerms: ['出行'], fuzzyTerms: ['旅游', '赴任', '出差'], tabooTerms: ['闭口', '安葬'] },
  move: { name: '搬家', exactTerms: ['入宅', '移徙'], fuzzyTerms: ['搬家', '乔迁'], tabooTerms: ['破土', '安葬'] },
  business: { name: '开业', exactTerms: ['开市'], fuzzyTerms: ['开业', '交易', '立券'], tabooTerms: ['闭市', '破土'] },
  build: { name: '动土', exactTerms: ['动土', '修造'], fuzzyTerms: ['起基', '竖柱', '上梁'], tabooTerms: ['破土', '安葬'] }
};

// 修复：精确提取生肖字（如 "冲猴" -> "猴"）
function extractZodiac(clashStr: string): string | null {
  const match = clashStr.match(/冲([鼠牛虎兔龙蛇马羊猴鸡狗猪])/);
  return match ? match[1] : null;
}

export function evaluateScene(
  sceneId: SceneType,
  data: AlmanacDayData,
  userZodiac?: string
): SceneVerdict {
  const rule = SCENE_RULES[sceneId];
  let score = 0;
  const evidence: string[] = [];
  const recommends = data.recommends || [];
  const avoids = data.avoids || [];

  for (const item of recommends) {
    if (rule.exactTerms.includes(item)) { score += 20; evidence.push(`宜: ${item}`); } 
    else if (rule.fuzzyTerms.includes(item)) { score += 10; evidence.push(`宜: ${item}`); }
  }

  for (const item of avoids) {
    if (rule.tabooTerms.includes(item)) { score -= 100; evidence.push(`忌: ${item} (大忌)`); }
    if (rule.exactTerms.includes(item)) { score -= 80; evidence.push(`忌: ${item} (冲场景)`); }
  }

  // 修复：冲煞校验逻辑
  if (userZodiac && data.clash) {
    const clashedZodiac = extractZodiac(data.clash);
    if (clashedZodiac === userZodiac) {
      score -= 50;
      evidence.push(`冲煞: 今日冲${userZodiac}`);
    }
  }

  if (data.dayOfficer) {
    if (['建', '满', '成', '开'].includes(data.dayOfficer)) score += 5;
    if (['破', '危', '闭'].includes(data.dayOfficer)) score -= 10;
  }

  const verdict: VerdictType = score > 30 ? 'auspicious' : score < -30 ? 'inauspicious' : 'neutral';

  return {
    sceneId, sceneName: rule.name, verdict,
    score: Math.max(-100, Math.min(100, score)),
    confidence: evidence.length > 3 ? 'verified' : 'probable',
    evidence
  };
}

export function calcLuckScore(data: AlmanacDayData): number {
  let s = 0;
  const recs = data.recommends?.length || 0;
  const avds = data.avoids?.length || 0;
  s += Math.min(recs * 2, 6);
  s -= Math.min(avds * 2, 6);
  if (data.dayOfficer && ['建', '满', '成', '开'].includes(data.dayOfficer)) s += 2;
  if (data.dayOfficer && ['破', '危', '闭'].includes(data.dayOfficer)) s -= 2;
  return Math.max(-10, Math.min(10, s));
}
