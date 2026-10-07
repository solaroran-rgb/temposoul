/**
 * star_card · 合规规则（A5 卡 · 合规五条一票否决项）
 * 1) 全站定性「传统文化与生活方式的参考信息」，不作预测/断言/承诺。
 * 2) 禁用词表命中 → 替换中性兜底表述。
 * 3) 六爻统一「传统随机提问的参考解读」。
 * 4) 每卡片与每段解读固定附免责口径句。
 * 5) 极端天气 → 保守分支（禁止鼓励外出/远行）。
 */

/** 禁用词（命中即替换为中性兜底） */
export const FORBIDDEN_WORDS: readonly string[] = [
  '算命', '占卜', '预测', '必然', '肯定', '化解', '转运', '改命', '招财', '升官', '消灾',
];

/** 中性兜底替换词 */
export const FORBIDDEN_REPLACEMENT = '传统参考';

/** 医/法/金敏感拦截（六爻不起卦不出解；每日星图不输出相关表述） */
export const SENSITIVE_KEYWORDS: readonly string[] = [
  // 医疗
  '医生', '医院', '手术', '治疗', '病情', '疾病', '药', '康复', '怀孕', '体检',
  // 法律
  '官司', '诉讼', '律师', '警察', '坐牢', '法院', '起诉', '拘留',
  // 金融
  '投资', '股票', '基金', '买房', '贷款', '炒股', '赌博', '借贷', '理财', '比特币',
];

/** 敏感拦截统一话术（不起卦不出解） */
export const SENSITIVE_BLOCK_MESSAGE =
  '此类问题不提供参考解读，建议咨询相关专业人士。';

/** 固定免责句（每卡片/每段解读必附） */
export const DISCLAIMER =
  '以上内容基于传统文化与生活方式的参考信息整理，仅供娱乐参考，不构成任何决策建议。';

/** 六爻免责句 */
export const LIUYAO_DISCLAIMER =
  '六爻为传统随机提问的参考解读，仅供娱乐参考，不构成任何决策建议。';

/** 极端天气保守分支：命中则不鼓励外出/远行 */
export const EXTREME_WEATHER_TRIGGERS: readonly string[] = [
  '暴雨', '台风', '高温', '寒潮', '大风', '暴雪', '冰雹',
];

export const EXTREME_WEATHER_SAFE_SUFFIX =
  '今日天气极端，建议减少外出，注意安全，保持室内活动。';

/**
 * 合规扫描：将文本中的禁用词替换为中性表述。
 * 返回 { text: 处理后的文本, hit: 是否命中禁用词 }
 */
export function sanitizeForbidden(text: string): { text: string; hit: boolean } {
  let hit = false;
  let out = text;
  for (const word of FORBIDDEN_WORDS) {
    if (out.includes(word)) {
      hit = true;
      out = out.split(word).join(FORBIDDEN_REPLACEMENT);
    }
  }
  return { text: out, hit };
}

/** 敏感拦截判定（医/法/金） */
export function isSensitiveHit(text: string): boolean {
  const t = (text || '').toLowerCase();
  return SENSITIVE_KEYWORDS.some((kw) => t.includes(kw.toLowerCase()));
}

/** 极端天气保守分支判定 */
export function isExtremeWeather(text: string): boolean {
  const t = text || '';
  return EXTREME_WEATHER_TRIGGERS.some((w) => t.includes(w));
}

/** 段落合规化：免责句装配（除免责段自身） */
export function withDisclaimer(text: string): string {
  return `${text}${DISCLAIMER}`;
}
