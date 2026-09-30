// A11-4 · src/data/ziwei-stars/tianfu.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tianfu',
  starName: '天府',
  nature:
    '天府属阳土，为南斗主星，主库藏、财帛与包容。象征稳重务实、善于积累与调度资源，重安全感、善守成；庙旺则财库丰盈、福禄厚重，落陷则过度保守、安逸而少开创。',
  brightness: [
    { level: '庙', note: '得地最旺，主财库丰盈、福禄厚重、善守成' },
    { level: '旺', note: '得地较旺，守成有道，理财稳健' },
    { level: '平', note: '平稳，财库平平，宜量入为出、稳扎稳打' },
    { level: '陷', note: '失地，库藏虚耗、过度保守，需借对宫与禄存' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '稳重务实、善理财守成，宜金融、行政与后勤' },
    { palace: '财帛宫', note: '财库星入财帛，靠积累与稳健进财，不主投机' },
    { palace: '田宅宫', note: '田宅宫得天府，宜置产守家、不动产稳' },
    { palace: '官禄宫', note: '宜财务、保管、行政等守成型岗位' },
    { palace: '福德宫', note: '注重享受与安全感，晚年安适、重生活质感' },
  ],
  combos: [
    { partner: '紫微', note: '紫府同宫，贵重有库，地位与资源并足、能守能贵' },
    { partner: '武曲', note: '府武同度，财星会库，理财经营与调度能力强' },
    { partner: '天相', note: '府相朝垣，稳重得辅，福禄双全、宜公职' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '传统星曜象征释义，非个体断言；已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=天府',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-20',
  ready: true,
};

export default doc;
