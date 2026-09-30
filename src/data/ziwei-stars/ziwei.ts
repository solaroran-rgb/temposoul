// A11-4 · src/data/ziwei-stars/ziwei.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'ziwei',
  starName: '紫微',
  nature:
    '紫微属阴土，为北斗主星，号称「斗数之主」，主尊贵、统御与稳定。象征领导气质、自我期许与责任感，好面子、喜受人敬重；庙旺则气度恢宏、能服众，落陷则易孤高自许、眼高手低。',
  brightness: [
    { level: '庙', note: '得地最旺，主尊贵显达、领袖气度，能服众' },
    { level: '旺', note: '得地较旺，稳重有领导力，易得地位' },
    { level: '平', note: '平稳，贵气待引，需辅弼昌曲提携方显' },
    { level: '陷', note: '失地，孤高自许、眼高手低，需借对宫与吉星' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '领导气质强、好面子，宜管理与独当一面，喜被敬重' },
    { palace: '官禄宫', note: '事业上宜主管、创业或需权威与格局的岗位' },
    { palace: '财帛宫', note: '理财重格局与体面消费，宜守成而非投机' },
    { palace: '夫妻宫', note: '配偶条件体面、有地位，感情偏重门第与匹配' },
    { palace: '田宅宫', note: '居家讲究品味排场，与长辈、上司缘深' },
  ],
  combos: [
    { partner: '天府', note: '紫府同宫（寅申），一帝一库，稳重有守、贵而能富' },
    { partner: '天相', note: '紫相组合，重规则制度，宜行政辅佐与管理岗' },
    { partner: '破军', note: '紫破并见，贵中带变，先稳后破、格局多起伏' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '传统星曜象征释义，非个体断言；已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=紫微',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-20',
  ready: true,
};

export default doc;
