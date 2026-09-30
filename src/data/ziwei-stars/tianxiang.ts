// A11-4 · src/data/ziwei-stars/tianxiang.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tianxiang',
  starName: '天相',
  nature:
    '天相属壬水，为南斗第五星，主印与辅佐，又称印星。象征稳重踏实、善辅佐、重衣食与仪表，随和而缺主见，易受同宫星影响。',
  brightness: [
    { level: '庙', note: '得地最旺，主辅佐得力' },
    { level: '旺', note: '得地较旺，稳重可靠' },
    { level: '平', note: '平稳，随波逐流' },
    { level: '陷', note: '失地，优柔、受人摆布' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '稳重随和、善辅佐，宜副手与行政' },
    { palace: '官禄宫', note: '宜幕僚、行政、辅佐型岗位' },
    { palace: '财帛宫', note: '主衣食，收入平稳' },
    { palace: '夫妻宫', note: '配偶稳重顾家，但主见较弱' },
  ],
  combos: [
    { partner: '紫微', note: '紫相组合，重规则、善辅佐领导' },
    { partner: '天府', note: '府相朝垣，稳重有守' },
    { partner: '破军', note: '相破对照，辅佐中带变动' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=天相',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
