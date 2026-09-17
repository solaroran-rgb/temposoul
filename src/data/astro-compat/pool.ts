// B'11-4 src/data/astro-compat/pool.ts
/**
 * 星座配对语料池 (首批6对真实语料)
 * @module B'11-4
 */
export interface CompatCorpus {
  summary: string;
  attraction: string;
  communication: string;
  risk: string;
  values: string;
}

export const COMPAT_POOL: Record<string, Record<string, CompatCorpus>> = {
  aries: {
    leo: {
      summary: '火象双燃，彼此激发热情',
      attraction: '强烈吸引，节奏同步',
      communication: '直来直往少猜忌',
      risk: '双方强势互不相让',
      values: '共同追求成就',
    },
    libra: {
      summary: '火风相助，社交与行动互补',
      attraction: '新鲜感强',
      communication: '思维碰撞活跃',
      risk: '节奏差异需磨合',
      values: '社交价值一致',
    },
  },
  taurus: {
    virgo: {
      summary: '土象稳固，务实默契',
      attraction: '安全感充足',
      communication: '细节沟通顺畅',
      risk: '固执叠加难妥协',
      values: '物质与秩序共识',
    },
    cancer: {
      summary: '土水滋养，情感与稳定交融',
      attraction: '温暖包容',
      communication: '非言语理解深',
      risk: '情绪积压需疏导',
      values: '家庭与安全优先',
    },
  },
  gemini: {
    aquarius: {
      summary: '风象共鸣，智识自由',
      attraction: '精神契合度高',
      communication: '话题无穷尽',
      risk: '情感深度不足',
      values: '自由与探索至上',
    },
  },
  cancer: {
    pisces: {
      summary: '水象共情，直觉与温柔',
      attraction: '灵魂层面连接',
      communication: '无需多言即懂',
      risk: '边界模糊易消耗',
      values: '情感与灵性优先',
    },
  },
};

export function getCompatCorpus(a: string, b: string): CompatCorpus | null {
  return COMPAT_POOL[a]?.[b] ?? COMPAT_POOL[b]?.[a] ?? null;
}
