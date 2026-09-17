
// A11-4 · src/data/ziwei-stars/ziwei.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'ziwei',
  starName: '紫微',
  nature: '紫微属土，为北斗主星，主尊贵、稳定与统御；象征中正、领导气质与自我期许。',
  brightness: [
    { level: '庙', note: '得地最旺，主尊贵' },
    { level: '旺', note: '得地较旺' },
    { level: '平', note: '平稳无过' },
    { level: '陷', note: '失地，需借对宫' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '主领导气质与自我期许' },
    { palace: '身宫', note: '中年后主事沉稳' },
    { palace: '夫妻宫', note: '配偶偏重格局与体面' },
  ],
  combos: [
    { partner: '天府', note: '紫府同宫，稳重有守' },
    { partner: '天相', note: '紫相组合，重规则' },
    { partner: '破军', note: '紫破并见，格局有变' },
  ],
  source: '据《紫微斗数全书》等传世文本整理',
  note: '传世文献转述，非本平台独创',
  confidence: 'legendary',
  engineRef: 'StarFact.name=紫微',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-16',
  ready: true,
};

export default doc;

