// A11-4 · src/data/ziwei-stars/tianliang.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tianliang',
  starName: '天梁',
  nature:
    '天梁属戊土，为南斗第三星，主荫、寿星，能逢凶化吉。象征成熟稳重、老成持重、好为人师，带孤高与清贵，亦主消灾解厄。',
  brightness: [
    { level: '庙', note: '得地最旺，主荫庇、逢凶化吉' },
    { level: '旺', note: '得地较旺，老成持重' },
    { level: '平', note: '平稳，略带孤高' },
    { level: '陷', note: '失地，孤芳自赏、易招是非' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '成熟稳重、逢凶化吉，宜顾问与长者角色' },
    { palace: '福德宫', note: '主寿，内心清明、重原则' },
    { palace: '父母宫', note: '长辈荫庇深，与长者缘厚' },
    { palace: '官禄宫', note: '宜教育、医疗、公益、顾问' },
  ],
  combos: [
    { partner: '太阳', note: '阳梁昌禄，利考试学术、清贵' },
    { partner: '天机', note: '机梁善谈兵，长于谋略' },
    { partner: '天同', note: '机月同梁格，稳而守成' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=天梁',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
