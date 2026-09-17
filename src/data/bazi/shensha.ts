// src/data/bazi/shensha.ts
import type { ContentEntryBase, ContentPack, ContentBlockParagraph } from '@/data/content/entry-types';

export interface ShenshaEntry extends ContentEntryBase {
  rule: string;
  ruleSource: string;
  imagery: string[];
  boundary: string;
}

const U = '2026-09-16';
const P = (text: string): ContentBlockParagraph => ({ kind: 'paragraph', text });
const B = {
  citations: [] as string[], confidence: 'legendary' as const,
  completeness: 'stub' as const, ready: false, status: 'published' as const,
  updatedAt: U, ruleSource: '',
};

export const shenshaPack: ContentPack<ShenshaEntry> = {
  version: '1.0.0', ready: false,
  entries: [
    { ...B, key: 'taohua', title: '桃花', summary: '主人际吸引与情感互动的传统神煞。', blocks: [P('桃花为传统神煞之一，以年支或日支所属三合局的特定位置起法，命理中用以描述人际吸引与情感互动倾向。')], rule: '以年支或日支三合局为基础，取对应位置起桃花。', imagery: ['吸引', '情感', '社交'], boundary: '桃花仅为传统神煞描述，不代表行为评价。' },
    { ...B, key: 'yima', title: '驿马', summary: '主变动、迁移与远行的传统神煞。', blocks: [P('驿马为传统神煞之一，以三合局的冲位起法，命理中用以描述迁移、变动与远行倾向。')], rule: '以年支或日支三合局为基础，取冲位起驿马。', imagery: ['变动', '迁移', '远行'], boundary: '驿马描述变动倾向，不代表必然发生迁移事件。' },
    { ...B, key: 'tianyi', title: '天乙贵人', summary: '传统神煞中的吉助象征。', blocks: [P('天乙贵人为传统神煞之一，以日干或年干起法，命理中用以象征助力与善缘。')], rule: '以日干或年干对应起法。', imagery: ['助力', '善缘', '庇护'], boundary: '贵人象征善缘，不代表具体事件或决策建议。' },
    { ...B, key: 'yangren', title: '羊刃', summary: '传统神煞中的刚烈象征。', blocks: [P('羊刃为传统神煞之一，以日干所对应地支起法，命理中用以描述刚烈、果断与锋芒。')], rule: '以日干对应地支起法。', imagery: ['刚烈', '果断', '锋芒'], boundary: '羊刃描述性格倾向，不构成行动建议或行为评价。' },
    { ...B, key: 'huagai', title: '华盖', summary: '主孤高、艺术与宗教倾向的传统神煞。', blocks: [P('华盖为传统神煞之一，以年支或日支三合局取墓位起法，命理中用以描述孤高、艺术与宗教倾向。')], rule: '以年支或日支三合局取墓位起华盖。', imagery: ['孤高', '艺术', '宗教'], boundary: '华盖描述倾向性，不构成对个人生活方式的价值判断。' },
    { ...B, key: 'wenchang', title: '文昌', summary: '主文才、学业与文书倾向的传统神煞。', blocks: [P('文昌为传统神煞之一，以日干起法，命理中用以描述文才、学业与文书倾向。')], rule: '以日干对应起法。', imagery: ['文才', '学业', '文书'], boundary: '文昌描述倾向性，不代表必然的学业或职业结果。' },
    { ...B, key: 'guchen', title: '孤辰', summary: '传统神煞中与独处倾向相关的象征。', blocks: [P('孤辰为传统神煞之一，以年支所属季节起法，命理中用以描述独处与内省倾向。')], rule: '以年支所属季节起法。', imagery: ['独处', '内省'], boundary: '孤辰描述倾向，不构成对人际关系状况的断言。' },
    { ...B, key: 'guasu', title: '寡宿', summary: '传统神煞中与内敛倾向相关的象征。', blocks: [P('寡宿为传统神煞之一，与孤辰常并列，命理中用以描述内敛与自守倾向。')], rule: '以年支所属季节起法。', imagery: ['内敛', '自守'], boundary: '寡宿描述倾向，不构成对人际或婚姻状况的断言。' },
  ],
};
