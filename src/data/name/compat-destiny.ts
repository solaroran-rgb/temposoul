// src/data/name/compat-destiny.ts
export interface DestinyDimensionCopy {
  readonly key: string;
  readonly label: string;
  readonly text: string;
}

export const DESTINY_COPY: readonly DestinyDimensionCopy[] = [
  { key: 'mutual', label: '互助维度', text: '两组姓名在字义倾向上呈现互补意象，宜理解为相处节奏的文化比喻。' },
  { key: 'growth', label: '成长维度', text: '姓名用字所承载的期望意象偏向共同成长，属象征语言而非定论。' },
  { key: 'communication', label: '沟通维度', text: '字义组合在民俗语感中偏向顺畅表达，仅供娱乐参考。' },
  { key: 'values', label: '价值维度', text: '用字取向在文化意象上偏向价值共鸣，不作性格或关系断言。' },
];
