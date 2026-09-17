// A11-4 · src/data/ziwei-stars/taiyang.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'taiyang',
  starName: '太阳',
  nature:
    '太阳属丙火，为中天主星，主贵、光明与博爱。象征热情大方、乐于付出、好面子，重名而轻利；昼生人、庙旺时最吉。',
  brightness: [
    { level: '庙', note: '得地最旺，主光明磊落、贵气显达' },
    { level: '旺', note: '得地较旺，热心外向' },
    { level: '平', note: '平稳，付出与回报略不对称' },
    { level: '陷', note: '失地，劳而无功、为人心累' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '热情博爱、好面子，宜公众与服务领域' },
    { palace: '夫妻宫', note: '配偶开朗外向，感情须防过热' },
    { palace: '官禄宫', note: '宜公职、教育、曝光度高的工作' },
    { palace: '田宅宫', note: '家中明亮，与父亲缘分深浅在此看' },
  ],
  combos: [
    { partner: '太阴', note: '日月并明，阴阳调和、事业家庭兼顾' },
    { partner: '巨门', note: '日巨同宫，靠口才专业立身，是非亦多' },
    { partner: '天梁', note: '阳梁昌禄，利考试、学术、清贵' },
  ],
  source: 'AI生成待专家审计（据《紫微斗数全书》传世文本整理）',
  note: 'AI 生成，待专家审计',
  confidence: 'legendary',
  engineRef: 'StarFact.name=太阳',
  reviewedBy: 'pending-review',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
