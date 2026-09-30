// A11-4 · src/data/ziwei-stars/jumen.ts
import type { StarArticleData } from './types';

const doc: StarArticleData = {
  starId: 'jumen',
  starName: '巨门',
  nature:
    '巨门属癸水（阴水），为北斗第二星，主口舌与是非，又称暗星。象征观察力强、善质疑、口才犀利，易招口舌纠纷，也宜以口生财。',
  brightness: [
    { level: '庙', note: '得地最旺，主口才、研究、辨是非' },
    { level: '旺', note: '得地较旺，思辨犀利' },
    { level: '平', note: '平稳，言语须谨慎' },
    { level: '陷', note: '失地，是非口舌、猜疑破财' },
  ],
  keyPalaces: [
    { palace: '命宫', note: '善观察质疑，宜靠口/专业吃饭' },
    { palace: '官禄宫', note: '宜律师、销售、教育、研究等口舌业' },
    { palace: '夫妻宫', note: '易因言语伤感情，需多包容' },
    { palace: '福德宫', note: '内心多疑，易钻牛角尖' },
  ],
  combos: [
    { partner: '太阳', note: '日巨同宫，靠口才专业立身' },
    { partner: '天机', note: '机巨同宫，善分析、宜研究' },
    { partner: '天同', note: '同巨同宫，乐中带是非、多思叹' },
  ],
  source: '据《紫微斗数全书》等传世文本整理，已审核',
  note: '已审核，温和表述',
  confidence: 'legendary',
  engineRef: 'StarFact.name=巨门',
  reviewedBy: 'content-team',
  updatedAt: '2026-09-18',
  ready: true,
};

export default doc;
