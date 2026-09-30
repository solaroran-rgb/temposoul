// A11-4 · src/data/ziwei-stars/pojun.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'pojun',
  starName: '破军',
  nature:
    '破军属癸水，为北斗第七星，主耗与先破后成。象征求新求变、破坏力强、敢打敢冲，人生多起伏，常在破旧中立新。',
  brightness: [
    { level: '庙', note: '得地最旺，主开创、先破后成' },
    { level: '旺', note: '得地较旺，行动力强' },
    { level: '平', note: '平稳，变动频繁' },
    { level: '陷', note: '失地，破耗过度、起伏剧烈' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '求新求变、敢冲，人生多开创' },
    { palace: '官禄宫', note: '宜开创性、变动性强的工作' },
    { palace: '财帛宫', note: '财来财去，靠变动生财' },
    { palace: '夫妻宫', note: '感情多波折，宜晚婚与包容' },
  ],
  combos: [
    { partner: '七杀', note: '杀破狼格，变动开创格局' },
    { partner: '贪狼', note: '杀破狼格，多变动、多机遇' },
    { partner: '武曲', note: '武破同宫，财先破后成' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=破军',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
