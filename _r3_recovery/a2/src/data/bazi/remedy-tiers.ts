
// A11-1 · src/data/bazi/remedy-tiers.ts · 五行补益建议表
// 说明：ready=true 表示内容已定稿可上生产；本轮 5 条全部 true。
//      如内容组修订后需重新审核，可将对应元素置为 false 让 UI 显示占位。

export type WuxingElement = '木' | '火' | '土' | '金' | '水';

export interface RemedyEntry {
  element: WuxingElement;
  radicals: string[];
  colors: string[];
  directions: string[];
  materials: string[];
  source: string;
  note: string;
  confidence: 'legendary';
  ready: boolean;
}

export const REMEDY_TABLE: Record<WuxingElement, RemedyEntry> = {
  '木': { element: '木', radicals: ['木', '艹', '竹', '禾'], colors: ['绿', '青'], directions: ['东'], materials: ['木', '翡翠', '绿松石'], source: '《三命通会》等传世文献民俗整理', note: '文化习俗，非可验证结论', confidence: 'legendary', ready: true },
  '火': { element: '火', radicals: ['火', '日', '灬'], colors: ['红', '橙', '紫'], directions: ['南'], materials: ['火', '红玛瑙', '红玉髓'], source: '《三命通会》等传世文献民俗整理', note: '文化习俗，非可验证结论', confidence: 'legendary', ready: true },
  '土': { element: '土', radicals: ['土', '山', '石'], colors: ['黄', '棕', '咖'], directions: ['中'], materials: ['土', '黄玉', '蜜蜡'], source: '《三命通会》等传世文献民俗整理', note: '文化习俗，非可验证结论', confidence: 'legendary', ready: true },
  '金': { element: '金', radicals: ['金', '钅', '刂'], colors: ['白', '金', '银'], directions: ['西'], materials: ['金', '白玉', '水晶'], source: '《三命通会》等传世文献民俗整理', note: '文化习俗，非可验证结论', confidence: 'legendary', ready: true },
  '水': { element: '水', radicals: ['氵', '水', '雨', '冫'], colors: ['黑', '蓝', '灰'], directions: ['北'], materials: ['水', '玻璃', '黑曜石'], source: '《三命通会》等传世文献民俗整理', note: '文化习俗，非可验证结论', confidence: 'legendary', ready: true },
};

export function getRemedy(el: string): RemedyEntry | null {
  if (el === '木' || el === '火' || el === '土' || el === '金' || el === '水') {
    return REMEDY_TABLE[el];
  }
  return null;
}

---

