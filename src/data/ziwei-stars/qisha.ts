// A11-4 · src/data/ziwei-stars/qisha.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'qisha',
  starName: '七杀',
  nature:
    '七杀属阳金，为将星，主决断、冲劲与肃杀。象征敢于开创、行动力强、能担重任，但性刚急躁、孤克独立，一生多起伏变动；庙旺则威权有成，落陷则冲动鲁莽、易招波折。',
  brightness: [
    { level: '庙', note: '得地最旺，主威权魄力、能担大任、开创有成' },
    { level: '旺', note: '得地较旺，冲劲有成，宜竞争性领域' },
    { level: '平', note: '平稳，刚柔需并济，宜收敛锋芒' },
    { level: '陷', note: '失地，冲动鲁莽、孤克波折，宜缓行、忌冒进' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '果决刚毅、敢冲敢拼，宜武职、技术与开创性工作' },
    { palace: '官禄宫', note: '事业宜开创性、竞争性强的领域，能扛压' },
    { palace: '财帛宫', note: '动中求财、横发横破，财来财去不稳' },
    { palace: '夫妻宫', note: '配偶性刚，感情多波折，宜迟婚、互相包容' },
    { palace: '迁移宫', note: '出外有冲劲，异地发展、动中易遇机会' },
  ],
  combos: [
    { partner: '紫微', note: '紫微制七杀（紫朝斗），帝星制将，威权有节而不乱' },
    { partner: '武曲', note: '武杀同宫，刚决过人，宜武职、财经与技术硬领域' },
    { partner: '破军', note: '杀破狼三方会照，一生多开创变动、横发横破' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '传统星曜象征释义，非个体断言；已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=七杀',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-20',
  ready: true,
};

export default doc;
