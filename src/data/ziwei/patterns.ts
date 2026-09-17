// src/data/ziwei/patterns.ts
import type {
  ContentEntryBase,
  ContentPack,
  ContentBlockParagraph,
} from '@/data/content/entry-types';

export interface PatternEntry extends ContentEntryBase {
  criteria: string[];
  breakCriteria: string[];
  exampleChart: string;
  tier: 'main' | 'secondary';
}

const U = '2026-09-18';
const P = (text: string): ContentBlockParagraph => ({ kind: 'paragraph', text });
const B = {
  citations: ['AI生成待专家审计', '《紫微斗数全书》传世格局白话整理'] as string[],
  confidence: 'probable' as const,
  completeness: 'full' as const,
  ready: true,
  status: 'published' as const,
  updatedAt: U,
  exampleChart: '',
};

export const patternPack: ContentPack<PatternEntry> = {
  version: '1.1.0',
  ready: true,
  entries: [
    {
      ...B,
      key: 'sha-po-lang',
      title: '杀破狼',
      summary: '七杀、破军、贪狼三方交会构成的开创变动格局。',
      blocks: [
        P(
          '杀破狼指七杀、破军、贪狼三星必在三方四正交会，命坐其一即为杀破狼格。传统认为主一生多变动、多开创，敢于打破旧局；横发横破、起伏较大，宜动中求财、从事开创性行业。',
        ),
        P('成格要诀：三方会齐且不被煞星过度冲破；若煞忌交冲，则变动变成折腾。'),
      ],
      criteria: ['七杀、破军、贪狼于命宫或三方四正交会'],
      breakCriteria: ['三星不交会或煞忌过冲'],
      tier: 'main',
    },
    {
      ...B,
      key: 'ji-yue-tong-liang',
      title: '机月同梁',
      summary: '天机、太阴、天同、天梁会合的稳守辅助格局。',
      blocks: [
        P(
          '机月同梁指天机、太阴、天同、天梁四星在命宫三方四正会合。传统认为主稳、善谋划、宜公职与幕僚，性格保守、不喜冒险，适合按部就班。',
        ),
        P('成格要诀：四星齐会且不落陷；多则近于平庸，需配合吉星提拔方能显。'),
      ],
      criteria: ['天机、太阴、天同、天梁于命宫三方四正会合'],
      breakCriteria: ['四星不齐或落陷'],
      tier: 'main',
    },
    {
      ...B,
      key: 'huo-tan',
      title: '火贪格',
      summary: '火星与贪狼同宫或会照构成的突发横发格局。',
      blocks: [
        P(
          '火贪格（含铃贪格）指火星或铃星与贪狼同宫或会照。传统认为主突发性的机缘与暴发，尤其在横财运、意外机遇上明显。',
        ),
        P('成格要诀：贪狼庙旺且火铃同度；若贪狼落陷，则爆发变成冲动破耗。'),
      ],
      criteria: ['火星或铃星与贪狼同宫或会照'],
      breakCriteria: ['火铃与贪狼不交会'],
      tier: 'main',
    },
    {
      ...B,
      key: 'zi-fu-tong-gong',
      title: '紫府同宫',
      summary: '紫微与天府同宫构成的稳贵格局。',
      blocks: [
        P(
          '紫府同宫指紫微与天府在寅申同宫。两颗主星一主贵一主库，同宫主稳重、有格局、善守成，易得地位与资源。',
        ),
        P('成格要诀：二星庙旺、不见煞忌冲破；煞重则贵而不实。'),
      ],
      criteria: ['紫微与天府于寅申同宫'],
      breakCriteria: ['二星不同宫或遭煞忌冲破'],
      tier: 'main',
    },
    {
      ...B,
      key: 'shi-zhong-yin-yu',
      title: '石中隐玉',
      summary: '巨门在子午与化禄/禄存相会构成的含蓄晚发格局。',
      blocks: [
        P(
          '石中隐玉指巨门独坐子午、逢禄存或化禄。传统认为主才华深藏、早年不显、厚积薄发，靠专业与口才晚成。',
        ),
        P('成格要诀：巨门庙旺得禄；若无禄或逢煞忌，则玉难出石，怀才不遇。'),
      ],
      criteria: ['巨门独坐子午且与禄存或化禄同宫或会照'],
      breakCriteria: ['禄存或化禄不现，或巨门落陷'],
      tier: 'secondary',
    },
  ],
};

export function findPattern(key: string): PatternEntry | undefined {
  return patternPack.entries.find((e) => e.key === key);
}
