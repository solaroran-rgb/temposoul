
// A11-4 · src/data/ziwei-stars/tianfu.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tianfu',
  starName: '天府',
  nature: '天府属土，主库藏、稳定与包容；象征积累与调度资源的能力，气质偏稳妥务实。',
  brightness: [
    { level: '庙', note: '得地最旺，主富厚' },
    { level: '旺', note: '得地较旺' },
    { level: '平', note: '平稳' },
    { level: '陷', note: '失地，需借对宫' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '主稳健与积累' },
    { palace: '身宫', note: '中年后主稳中求进' },
    { palace: '夫妻宫', note: '配偶偏重安全感' },
  ],
  combos: [
    { partner: '紫微', note: '紫府同宫，贵重' },
    { partner: '武曲', note: '府武组合，财库' },
  ],
  source: '据《紫微斗数全书》等传世文本整理',
  note: '传世文献转述，非本平台独创',
  confidence: 'legendary',
  engineRef: 'StarFact.name=天府',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-16',
  ready: true,
};

export default doc;

