// A11-4 · src/data/ziwei-stars/taiyin.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'taiyin',
  starName: '太阴',
  nature:
    '太阴属癸水，为中天主星，主富、柔与田宅。象征温柔细腻、重感情与美感，善积蓄；夜生人、庙旺时最吉。',
  brightness: [
    { level: '庙', note: '得地最旺，主富、田宅美' },
    { level: '旺', note: '得地较旺，细腻内敛' },
    { level: '平', note: '平稳，情绪偏柔' },
    { level: '陷', note: '失地，多愁善感、财运不稳' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '温柔细腻、重感情，宜文艺与幕后' },
    { palace: '财帛宫', note: '主富，靠积蓄、不动产生财' },
    { palace: '田宅宫', note: '田宅主星入田宅，置产运佳' },
    { palace: '夫妻宫', note: '配偶温柔，与母亲/女性缘分重' },
  ],
  combos: [
    { partner: '太阳', note: '日月并明，阴阳调和' },
    { partner: '天机', note: '机月同梁格，善谋稳重' },
    { partner: '天同', note: '同阴同宫，情绪细腻、晚发' },
  ],
  source: 'AI生成待专家审计（据《紫微斗数全书》传世文本整理）',
  note: 'AI 生成，待专家审计',
  confidence: 'legendary',
  engineRef: 'StarFact.name=太阴',
  reviewedBy: 'pending-review',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
