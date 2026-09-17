// A11-4 · src/data/ziwei-stars/wuqu.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'wuqu',
  starName: '武曲',
  nature:
    '武曲属辛金，为北斗第六星，主财帛与刚直。象征务实果断、重实际利益、行动力强，但性格刚硬、不善表达情感。',
  brightness: [
    { level: '庙', note: '得地最旺，主财星得地、善经营' },
    { level: '旺', note: '得地较旺，执行力强' },
    { level: '平', note: '平稳，理财务实' },
    { level: '陷', note: '失地，刚愎孤克、财务易波动' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '务实果决、重钱财，宜金融与实干' },
    { palace: '财帛宫', note: '正财星入财帛，靠实干赚钱' },
    { palace: '夫妻宫', note: '感情偏务实，配偶能干但略刚' },
    { palace: '官禄宫', note: '宜财务、金属、技术、军警等硬领域' },
  ],
  combos: [
    { partner: '天府', note: '武府同宫，财库稳守、善理财' },
    { partner: '七杀', note: '武杀同宫，刚决过人，宜武职' },
    { partner: '破军', note: '武破同宫，财来财去、先破后成' },
  ],
  source: 'AI生成待专家审计（据《紫微斗数全书》传世文本整理）',
  note: 'AI 生成，待专家审计',
  confidence: 'legendary',
  engineRef: 'StarFact.name=武曲',
  reviewedBy: 'pending-review',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
