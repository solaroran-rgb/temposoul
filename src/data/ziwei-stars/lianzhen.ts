// A11-4 · src/data/ziwei-stars/lianzhen.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'lianzhen',
  starName: '廉贞',
  nature:
    '廉贞属丁火（又属木），为北斗第五星，主官禄，次桃花。象征能屈能伸、好胜有交际手腕，情绪起伏大、易走极端。',
  brightness: [
    { level: '庙', note: '得地最旺，主干练、掌权' },
    { level: '旺', note: '得地较旺，交际出众' },
    { level: '平', note: '平稳，情绪略波动' },
    { level: '陷', note: '失地，是非、桃花纠纷、情绪失控' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '能干好胜、擅长交际，需控情绪' },
    { palace: '官禄宫', note: '主官禄，宜管理、公关、公职' },
    { palace: '夫妻宫', note: '感情浓烈，桃花与摩擦并存' },
    { palace: '福德宫', note: '内心起伏，追求刺激与新鲜感' },
  ],
  combos: [
    { partner: '天府', note: '廉府同宫，能干而有守' },
    { partner: '贪狼', note: '廉贪同宫，桃花与欲望交织，宜才艺' },
    { partner: '七杀', note: '廉杀同宫，刚柔并济，魄力过人' },
  ],
  source: 'AI生成待专家审计（据《紫微斗数全书》传世文本整理）',
  note: 'AI 生成，待专家审计',
  confidence: 'legendary',
  engineRef: 'StarFact.name=廉贞',
  reviewedBy: 'pending-review',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
