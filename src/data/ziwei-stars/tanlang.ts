// A11-4 · src/data/ziwei-stars/tanlang.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tanlang',
  starName: '贪狼',
  nature:
    '贪狼属甲木（又属水），为北斗第一星，主桃花、欲望与多才多艺。象征聪明活络、欲望强、交际广、兴趣杂，需防贪多与桃花是非。',
  brightness: [
    { level: '庙', note: '得地最旺，主人缘佳、多才多艺' },
    { level: '旺', note: '得地较旺，交际手腕强' },
    { level: '平', note: '平稳，欲望明显' },
    { level: '陷', note: '失地，桃花是非、贪多嚼不烂' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '聪明活络、人缘好，须节制欲望' },
    { palace: '福德宫', note: '享受欲强，兴趣广泛' },
    { palace: '夫妻宫', note: '桃花旺，感情多彩需专一' },
    { palace: '官禄宫', note: '宜公关、艺术、娱乐、人际型工作' },
  ],
  combos: [
    { partner: '廉贞', note: '廉贪同宫，桃花欲望交织、宜才艺' },
    { partner: '武曲', note: '武贪同宫，晚发格局、横发横破' },
    { partner: '火星/铃星', note: '火贪/铃贪格，突发机遇' },
  ],
  source: 'AI生成待专家审计（据《紫微斗数全书》传世文本整理）',
  note: 'AI 生成，待专家审计',
  confidence: 'legendary',
  engineRef: 'StarFact.name=贪狼',
  reviewedBy: 'pending-review',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
