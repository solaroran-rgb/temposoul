
// A11-4 · src/data/ziwei-stars/qisha.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'qisha',
  starName: '七杀',
  nature: '七杀属金，主决断、果敢、破旧立新；象征开创与阻力并存，气质偏硬朗。',
  brightness: [
    { level: '庙', note: '得地最旺，主威权' },
    { level: '旺', note: '得地较旺' },
    { level: '平', note: '平稳' },
    { level: '陷', note: '失地，宜缓行' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '主开创气质' },
    { palace: '身宫', note: '中年后主执行' },
    { palace: '夫妻宫', note: '配偶性格较强' },
  ],
  combos: [
    { partner: '紫微', note: '紫杀组合，威权' },
    { partner: '破军', note: '杀破狼主变' },
  ],
  source: '据《紫微斗数全书》等传世文本整理',
  note: '传世文献转述，非本平台独创',
  confidence: 'legendary',
  engineRef: 'StarFact.name=七杀',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-16',
  ready: true,
};

export default doc;

