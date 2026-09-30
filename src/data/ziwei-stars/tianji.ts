// A11-4 · src/data/ziwei-stars/tianji.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tianji',
  starName: '天机',
  nature:
    '天机属乙木，为南斗第三星，主智慧、思虑与机变。象征头脑灵活、善于策划与变动，反应快但易思虑过多、朝三暮四。',
  brightness: [
    { level: '庙', note: '得地最旺，主聪明善谋' },
    { level: '旺', note: '得地较旺，机变过人' },
    { level: '平', note: '平稳，思虑偏多' },
    { level: '陷', note: '失地，多思多虑、决断不足' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '头脑灵活、善分析，但易想得多做得少' },
    { palace: '兄弟宫', note: '兄弟姊妹多机智、关系多变' },
    { palace: '财帛宫', note: '以脑力与企划生财，不主固定收入' },
    { palace: '官禄宫', note: '宜企划、顾问、技术、动脑型工作' },
  ],
  combos: [
    { partner: '太阴', note: '机月同梁格，善谋而稳' },
    { partner: '巨门', note: '机巨同宫，善分析口舌，宜专业研究' },
    { partner: '天梁', note: '机梁善谈兵，长于策划谋略' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=天机',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
