// src/data/bazi/shishen.ts
import type { ContentEntryBase, ContentPack, ContentBlockParagraph } from '@/data/content/entry-types';

export interface ShishenEntry extends ContentEntryBase {
  relation: '同性' | '异性';
  wuxing: string;
  imagery: string[];
  classicQuote: string;
}

const U = '2026-09-16';
const P = (text: string): ContentBlockParagraph => ({ kind: 'paragraph', text });
const BASE = {
  citations: [] as string[],
  confidence: 'probable' as const,
  completeness: 'stub' as const,
  ready: false,
  status: 'published' as const,
  updatedAt: U,
  classicQuote: '',
};

export const shishenPack: ContentPack<ShishenEntry> = {
  version: '1.0.0',
  ready: false,
  entries: [
    { ...BASE, key: 'bijian', title: '比肩', summary: '与日主五行同性、阴阳相同者。', blocks: [P('比肩为十神之一，指与日主五行相同且阴阳属性相同的天干或地支藏干。传统命理中用以描述自我意志、同辈关系与竞争性。')], relation: '同性', wuxing: '随日主', imagery: ['自我', '同辈', '竞争'] },
    { ...BASE, key: 'jiecai', title: '劫财', summary: '与日主五行相同、阴阳相异者。', blocks: [P('劫财为十神之一，指与日主五行相同但阴阳属性相异者。传统命理中用以描述合作、分夺与行动力。')], relation: '异性', wuxing: '随日主', imagery: ['合作', '分夺', '行动'] },
    { ...BASE, key: 'shishen', title: '食神', summary: '日主所生、阴阳相同者。', blocks: [P('食神为十神之一，指日主所生且阴阳属性相同者。传统命理中用以描述表达、才艺与温和的产出。')], relation: '同性', wuxing: '日主所生', imagery: ['表达', '才艺', '产出'] },
    { ...BASE, key: 'shangguan', title: '伤官', summary: '日主所生、阴阳相异者。', blocks: [P('伤官为十神之一，指日主所生且阴阳属性相异者。传统命理中用以描述才华外显、批判性与创新。')], relation: '异性', wuxing: '日主所生', imagery: ['才华', '批判', '创新'] },
    { ...BASE, key: 'zhengcai', title: '正财', summary: '日主所克、阴阳相异者。', blocks: [P('正财为十神之一，指日主所克且阴阳属性相异者。传统命理中用以描述稳定收入、务实经营。')], relation: '异性', wuxing: '日主所克', imagery: ['稳定', '务实', '积累'] },
    { ...BASE, key: 'piancai', title: '偏财', summary: '日主所克、阴阳相同者。', blocks: [P('偏财为十神之一，指日主所克且阴阳属性相同者。传统命理中用以描述流动收益、社交经营。')], relation: '同性', wuxing: '日主所克', imagery: ['流动', '社交', '机遇'] },
    { ...BASE, key: 'zhengguan', title: '正官', summary: '克日主、阴阳相异者。', blocks: [P('正官为十神之一，指克制日主且阴阳属性相异者。传统命理中用以描述规则、责任与秩序感。')], relation: '异性', wuxing: '克日主', imagery: ['规则', '责任', '秩序'] },
    { ...BASE, key: 'qisha', title: '七杀', summary: '克日主、阴阳相同者。', blocks: [P('七杀为十神之一，指克制日主且阴阳属性相同者。传统命理中用以描述压力、决断与突破。')], relation: '同性', wuxing: '克日主', imagery: ['压力', '决断', '突破'] },
    { ...BASE, key: 'zhengyin', title: '正印', summary: '生日主、阴阳相异者。', blocks: [P('正印为十神之一，指生日主且阴阳属性相异者。传统命理中用以描述庇佑、学识与规范养育。')], relation: '异性', wuxing: '生日主', imagery: ['庇佑', '学识', '养育'] },
    { ...BASE, key: 'pianyin', title: '偏印', summary: '生日主、阴阳相同者。', blocks: [P('偏印为十神之一，指生日主且阴阳属性相同者。传统命理中用以描述偏门学识、直觉与独立。')], relation: '同性', wuxing: '生日主', imagery: ['偏才', '直觉', '独立'] },
  ],
};

export function findShishen(key: string): ShishenEntry | undefined {
  return shishenPack.entries.find((e) => e.key === key);
}
