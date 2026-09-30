// A11-4 · src/data/ziwei-stars/tongtian.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'tongtian',
  starName: '天同',
  nature:
    '天同属壬水，为南斗第四星，主福德与享受。象征温和乐观、随和有福、懂得享受生活，偏懒、进取心不足。',
  brightness: [
    { level: '庙', note: '得地最旺，主享福、性情温和' },
    { level: '旺', note: '得地较旺，随和乐观' },
    { level: '平', note: '平稳，偏安逸' },
    { level: '陷', note: '失地，懒散拖延、沉溺享乐' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '温和有福、好享受，需防安逸丧志' },
    { palace: '福德宫', note: '主精神享受与福分，心情愉悦' },
    { palace: '夫妻宫', note: '配偶温吞随和，感情平淡温馨' },
    { palace: '子女宫', note: '子女乖巧，亲子缘柔和' },
  ],
  combos: [
    { partner: '天机', note: '机月同梁格，稳而不冲' },
    { partner: '太阴', note: '同阴同宫，情绪细腻、晚发之格' },
    { partner: '巨门', note: '同巨同宫，乐中带是非，多思多叹' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=天同',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
