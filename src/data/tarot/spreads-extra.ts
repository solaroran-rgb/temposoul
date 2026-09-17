// A11-6 · src/data/tarot/spreads-extra.ts · 6 阵前端常量
export interface SpreadPosition {
  index: number;
  label: string;
  meaning: string;
}
export interface SpreadLayoutPoint {
  x: number;
  y: number;
  rotation?: number;
}

export interface SpreadDef {
  spreadId: string;
  spreadName: string;
  scene: string;
  cardCount: number;
  positions: SpreadPosition[];
  layout: SpreadLayoutPoint[];
  steps: string[];
  source: string;
  confidence: 'legendary';
}

export const NEW_SPREADS: SpreadDef[] = [
  {
    spreadId: 'holy-triangle',
    spreadName: '圣三角',
    scene: '起因/现状/建议',
    cardCount: 3,
    positions: [
      { index: 1, label: '起因', meaning: '问题根源' },
      { index: 2, label: '现状', meaning: '当前状态' },
      { index: 3, label: '建议', meaning: '行动方向' },
    ],
    layout: [
      { x: 0.5, y: 0.15 },
      { x: 0.2, y: 0.8 },
      { x: 0.8, y: 0.8 },
    ],
    steps: ['洗牌', '切牌', '依次摆放三张', '按位置解读'],
    source: '通行牌阵，据 Rider-Waite 体系整理',
    confidence: 'legendary',
  },
  {
    spreadId: 'relationship',
    spreadName: '关系牌阵',
    scene: '双方关系深度',
    cardCount: 7,
    positions: [
      { index: 1, label: '本人', meaning: '本人状态' },
      { index: 2, label: '对方', meaning: '对方状态' },
      { index: 3, label: '关系现状', meaning: '当前关系' },
      { index: 4, label: '阻碍', meaning: '关系阻碍' },
      { index: 5, label: '优势', meaning: '关系优势' },
      { index: 6, label: '走向', meaning: '发展趋势' },
      { index: 7, label: '建议', meaning: '行动建议' },
    ],
    layout: [
      { x: 0.2, y: 0.5 },
      { x: 0.8, y: 0.5 },
      { x: 0.5, y: 0.35 },
      { x: 0.5, y: 0.15 },
      { x: 0.5, y: 0.55 },
      { x: 0.5, y: 0.75 },
      { x: 0.5, y: 0.9 },
    ],
    steps: ['洗牌', '切牌', '依序摆放七张', '从本人/对方读起'],
    source: '通行牌阵，据 Rider-Waite 体系整理',
    confidence: 'legendary',
  },
  {
    spreadId: 'yes-no',
    spreadName: '是非牌阵',
    scene: '二元问题',
    cardCount: 5,
    positions: [
      { index: 1, label: '当下', meaning: '当前状况' },
      { index: 2, label: '有利', meaning: '有利因素' },
      { index: 3, label: '不利', meaning: '不利因素' },
      { index: 4, label: '结果倾向', meaning: '倾向方向' },
      { index: 5, label: '建议', meaning: '行动建议' },
    ],
    layout: [
      { x: 0.5, y: 0.5 },
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.2, y: 0.8 },
      { x: 0.8, y: 0.8 },
    ],
    steps: ['洗牌', '切牌', '摆放五张', '综合有利/不利给出倾向'],
    source: '通行牌阵，据 Rider-Waite 体系整理',
    confidence: 'legendary',
  },
  {
    spreadId: 'horseshoe',
    spreadName: '马蹄铁',
    scene: '综合',
    cardCount: 7,
    positions: [
      { index: 1, label: '过去', meaning: '过去因' },
      { index: 2, label: '现在', meaning: '当前状' },
      { index: 3, label: '未来', meaning: '未来势' },
      { index: 4, label: '答案', meaning: '应对' },
      { index: 5, label: '周围', meaning: '环境' },
      { index: 6, label: '希望', meaning: '期待' },
      { index: 7, label: '结果', meaning: '结果' },
    ],
    layout: [
      { x: 0.1, y: 0.1 },
      { x: 0.2, y: 0.3 },
      { x: 0.3, y: 0.5 },
      { x: 0.5, y: 0.7 },
      { x: 0.7, y: 0.5 },
      { x: 0.8, y: 0.3 },
      { x: 0.9, y: 0.1 },
    ],
    steps: ['洗牌', '切牌', '依次摆放', '按时序综合解读'],
    source: '通行牌阵，据 Rider-Waite 体系整理',
    confidence: 'legendary',
  },
  {
    spreadId: 'mindBodySpirit',
    spreadName: '身心灵',
    scene: '三维平衡',
    cardCount: 3,
    positions: [
      { index: 1, label: '身', meaning: '身体/行动' },
      { index: 2, label: '心', meaning: '心理/情绪' },
      { index: 3, label: '灵', meaning: '精神/价值观' },
    ],
    layout: [
      { x: 0.2, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: 0.8, y: 0.5 },
    ],
    steps: ['洗牌', '切牌', '摆放三张', '按身心灵次序解读'],
    source: '通行牌阵，据 Rider-Waite 体系整理',
    confidence: 'legendary',
  },
  {
    spreadId: 'chakra',
    spreadName: '脉轮',
    scene: '能量中心',
    cardCount: 7,
    positions: [
      { index: 1, label: '根轮', meaning: '安全/生存' },
      { index: 2, label: '脐轮', meaning: '情绪/欲望' },
      { index: 3, label: '太阳轮', meaning: '意志/自尊' },
      { index: 4, label: '心轮', meaning: '爱/关系' },
      { index: 5, label: '喉轮', meaning: '表达/真实' },
      { index: 6, label: '眉心轮', meaning: '洞察/直觉' },
      { index: 7, label: '顶轮', meaning: '灵性/连接' },
    ],
    layout: [
      { x: 0.5, y: 0.9 },
      { x: 0.5, y: 0.78 },
      { x: 0.5, y: 0.66 },
      { x: 0.5, y: 0.54 },
      { x: 0.5, y: 0.42 },
      { x: 0.5, y: 0.3 },
      { x: 0.5, y: 0.18 },
    ],
    steps: ['洗牌', '切牌', '自下而上摆放', '自下而上解读'],
    source: '通行牌阵，据 Rider-Waite 体系整理',
    confidence: 'legendary',
  },
];

export function findSpread(id: string): SpreadDef | null {
  return NEW_SPREADS.find((s) => s.spreadId === id) ?? null;
}

/** 主仓既有牌阵中文名（供列表页/详情页回退使用，10 键对齐 tarot-data） */
export const CORE_SPREAD_LABELS: Record<string, string> = {
  single: '单牌指引',
  three: '时间流牌阵',
  love: '爱情牌阵',
  career: '事业牌阵',
  decision: '选择牌阵',
  celtic: '凯尔特十字',
  chakra: '七脉轮牌阵',
  year: '年运牌阵',
  mindBodySpirit: '身心灵牌阵',
  horseshoe: '马蹄铁牌阵',
};

export function listAllSpreadIds(): string[] {
  return [...Object.keys(CORE_SPREAD_LABELS), ...NEW_SPREADS.map((s) => s.spreadId)];
}
