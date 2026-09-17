
// A11-6 · packages/core/src/divination/tarot-data.ts · 塔罗牌阵完整定义（完整文件，非 diff）
// 说明：既有 6 键（single/three/love/career/decision/celtic）保留；本轮新增 6 键
//      （holy-triangle/relationship/yes-no/horseshoe/mind-body-spirit/chakra）。
//      既有 6 键的 description 文本如与本地实际不一致，请本地合并时保留原值。
// 字段结构对齐既有 { name, description, positions, cardCount }。

export interface TarotSpread {
  name: string;
  description: string;
  positions: string[];
  cardCount: number;
}

export const tarotSpreads = {
  // ===== 既有 6 键（保留） =====
  single: {
    name: '单张牌阵',
    description: '抽取一张牌，回答当下的核心问题。',
    positions: ['核心指引'],
    cardCount: 1,
  } as TarotSpread,

  three: {
    name: '三张牌阵',
    description: '过去/现在/未来，呈现事情的时间脉络。',
    positions: ['过去', '现在', '未来'],
    cardCount: 3,
  } as TarotSpread,

  love: {
    name: '爱情牌阵',
    description: '聚焦感情关系中的双方状态与发展。',
    positions: ['本人', '对方', '关系现状', '关系走向'],
    cardCount: 4,
  } as TarotSpread,

  career: {
    name: '事业牌阵',
    description: '聚焦职业发展与工作情境。',
    positions: ['当前状况', '挑战', '优势', '发展方向'],
    cardCount: 4,
  } as TarotSpread,

  decision: {
    name: '选择牌阵',
    description: '在二选一或多选情境下提供参考。',
    positions: ['现状', '选项A', '选项B', '建议'],
    cardCount: 4,
  } as TarotSpread,

  celtic: {
    name: '凯尔特十字',
    description: '经典十张牌阵，全面剖析问题。',
    positions: ['现状', '阻碍', '根基', '过去', '目标', '未来', '态度', '环境', '希望与恐惧', '结果'],
    cardCount: 10,
  } as TarotSpread,

  // ===== 本轮新增 6 键 =====
  'holy-triangle': {
    name: '圣三角',
    description: '起因/现状/建议，适合快速定位问题根源。',
    positions: ['起因', '现状', '建议'],
    cardCount: 3,
  } as TarotSpread,

  relationship: {
    name: '关系牌阵',
    description: '深入剖析双人关系状态、阻碍与走向。',
    positions: ['本人', '对方', '关系现状', '阻碍', '优势', '走向', '建议'],
    cardCount: 7,
  } as TarotSpread,

  'yes-no': {
    name: '是非牌阵',
    description: '在二元问题中综合有利与不利因素。',
    positions: ['当下', '有利', '不利', '结果倾向', '建议'],
    cardCount: 5,
  } as TarotSpread,

  horseshoe: {
    name: '马蹄铁',
    description: '七张综合牌阵，覆盖过去到结果的完整脉络。',
    positions: ['过去', '现在', '未来', '答案', '周围', '希望', '结果'],
    cardCount: 7,
  } as TarotSpread,

  'mind-body-spirit': {
    name: '身心灵',
    description: '从身体、心理、精神三个维度平衡分析。',
    positions: ['身', '心', '灵'],
    cardCount: 3,
  } as TarotSpread,

  chakra: {
    name: '脉轮',
    description: '七张牌对应七大脉轮，检视能量流动。',
    positions: ['根轮', '脐轮', '太阳轮', '心轮', '喉轮', '眉心轮', '顶轮'],
    cardCount: 7,
  } as TarotSpread,
};

export type TarotSpreadType = keyof typeof tarotSpreads;

export interface DrawnSpread {
  spreadType: TarotSpreadType;
  spreadName: string;
  cards: string[];
  timestamp: number;
}

export function drawSpreadCards(
  spreadType: TarotSpreadType,
  options?: { seed?: string },
): DrawnSpread {
  const spread = tarotSpreads[spreadType];
  void options;
  return {
    spreadType,
    spreadName: spread.name,
    cards: [],
    timestamp: Date.now(),
  };
}

