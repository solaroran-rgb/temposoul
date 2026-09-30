/**
 * 命律 · 信息增量法（IG）反巴纳姆校验器
 * ============================================================
 * R3-13 · 任务 1
 *
 * 目标：判定一首散文诗是「真个性化」还是「通用鸡汤（巴纳姆效应）」。
 *
 * ------------------------------------------------------------------
 * 核心公式（任务卡 v1）
 * ------------------------------------------------------------------
 *   IG = 个性化版本独有「具体化元素」数 / 个性化版本「具体化元素」总数
 *
 * ------------------------------------------------------------------
 * 【工程化修正 · R3-13 实现裁决 2026-09-19】
 * ------------------------------------------------------------------
 * 任务卡 v1 的原始口径存在致命退化：若「通用版本」由「把具体元素机械替换为泛化
 * 表述」生成（任务卡给出的替换规则正是如此：西北→远方 / 三次→几次 / 铁与盐的
 * 气味→某种锐利的气息 / 第二个秋天→某个季节），则通用版本必然不含任何具体元
 * 素 → 独有数 ≡ 总数 → IG ≡ 1.0，校验器对任何文本都判「通过」，判别力为零。
 * 实测：`calculateInformationGain(text, generalizePoem(text))` 恒返回 1。
 *
 * 本实现把「独有」重新定义为「不可被通用模板复制的具体元素」：
 *
 *   unique(e) = NOT isReplaceable(e) OR anchored(e, atoms.evidence)
 *
 *   - isReplaceable(e)：该元素命中泛化替换表（即任务卡给出的那类替换）。
 *     这类元素是「伪具体」——任何模板都能随手复制。再多也不构成信息增量。
 *   - anchored(e, evidence)：该元素在原子结论的证据快照（命盘数据）中真实出现。
 *     同一个「西北」，若命盘证据里真有西北方位信息，它就是真信息而非套话。
 *   - 分母保底：元素总数 < 3 时按 3 计，抑制「只检出 1 个元素即满分」的小样本虚高。
 *
 * 判别力验证（见 prose_demo.ts 负样本对照）：
 *   - 通用鸡汤（无具体元素）               → IG = 0.00 → 不通过
 *   - 伪个性化（全是可泛化套话）           → IG = 0.00 → 不通过
 *   - 真个性化（含命盘锚定的时节/细节/意象）→ IG ≥ 0.30 → 通过
 */

import type { AtomicConclusion } from './types';

// ============================================================
// 1. 类型
// ============================================================

/** 具体化元素类型（任务卡 5 类） */
export type ImageryElementType =
  | 'direction' // 具体方位
  | 'number' // 具体数字
  | 'sensory' // 具体感官细节
  | 'time_node' // 具体时间节点
  | 'life_detail'; // 生活细节关联

export interface ImageryElement {
  type: ImageryElementType;
  value: string;
  /** 是否来自用户命盘数据（vs 通用描述） */
  is_personal: boolean;
  /** 命中证据快照的原文片段（可追溯） */
  evidence_hit?: string;
}

export interface AntiBarnumResult {
  passed: boolean;
  ig_score: number;
  elements: ImageryElement[];
  /** 泛化对照版（可复现校验过程） */
  generic_poem: string;
  /** 边界区标记（0.20 ≤ IG < 0.30） */
  needs_review: boolean;
  reason: string;
}

// ============================================================
// 2. 判定阈值（任务卡 v1）
// ============================================================

export const IG_PASS_THRESHOLD = 0.3;
export const IG_REVIEW_THRESHOLD = 0.2;

/** IG 分母的最小样本量（元素总数少于此值按此值计，抑制小样本虚高） */
const MIN_IG_DENOMINATOR = 3;

// ============================================================
// 3. 词典（5 类具体化元素的识别依据）
// ============================================================

/** 具体方位（长词优先，避免「东北偏东」被「东北」截断） */
const DIRECTION_WORDS = [
  '东北偏北',
  '东北偏东',
  '东南偏东',
  '东南偏南',
  '西南偏南',
  '西南偏西',
  '西北偏西',
  '西北偏北',
  '东北',
  '东南',
  '西南',
  '西北',
  '正东',
  '正南',
  '正西',
  '正北',
  '乾位',
  '坤位',
  '震位',
  '巽位',
  '坎位',
  '离位',
  '艮位',
  '兑位',
];

/** 二十四节气（具体时间节点） */
const SOLAR_TERMS = [
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
  '小寒',
  '大寒',
];

/** 其他时间节点词 */
const TIME_NODE_WORDS = ['本命年', '交运', '换运', '岁运交替', '起运', '逢九年'];

/** 身体部位（感官细节的锚点） */
const BODY_PARTS = [
  '胸口',
  '指尖',
  '鼻腔',
  '肩背',
  '后背',
  '喉咙',
  '手心',
  '掌心',
  '脚底',
  '眉间',
  '后颈',
  '膝盖',
  '额头',
  '太阳穴',
  '脊背',
  '手腕',
  '眼底',
];

/** 感官名词 */
const SENSORY_WORDS = [
  '气味',
  '气息',
  '凉意',
  '灼热',
  '紧绷',
  '沉重',
  '发烫',
  '刺痛',
  '酸胀',
  '余温',
  '触感',
  '眩晕',
  '耳鸣',
  '战栗',
  '发麻',
];

/** 身体部位 + 感官名词的邻接组合（如「掌心的凉意」「肩背发麻」） */
const SENSORY_COMBO_PATTERN = new RegExp(
  `(?:${BODY_PARTS.join('|')})(?:的|中|里|间)?(?:${SENSORY_WORDS.join('|')})`,
  'g'
);

/** 感官短语（长匹配优先，任务卡示例：铁与盐的气味 / 指尖的凉意 / 胸口的紧绷） */
const SENSORY_PHRASES = [
  '铁与盐的气味',
  '指尖的凉意',
  '胸口的紧绷',
  '鼻腔的刺痛',
  '肩背的酸胀',
  '掌心的汗',
  '后颈的凉',
  '喉头的紧',
  '眼底的酸',
];

/** 感官套话判定：身体部位 + 可选「的」+ 感官名词（通用模板随手可复制的形态） */
const SENSORY_GENERIC_PATTERN = new RegExp(
  `^(?:${BODY_PARTS.join('|')})的?(?:${SENSORY_WORDS.join('|')})$`
);

/** 泛指数量词黑名单（不构成「具体数字」） */
const NUMBER_STOPWORDS = new Set([
  '一个',
  '一种',
  '一样',
  '一些',
  '一时',
  '一面',
  '一定',
  '一边',
  '一刻',
  '一次',
  '一场',
]);

/** 「清明」等兼类节气词：前字为视觉/心境类词时按普通词处理（如「眼底清明」） */
const AMBIGUOUS_TIME_NODES = new Set(['清明']);
const MENTAL_VIEW_PREFIXES = ['眼', '目', '眸', '神', '心', '气', '思', '头', '底'];

/** 具体数字：中文序数+量词 / 阿拉伯数字+量词 */
const NUMBER_PATTERN =
  /(?:第)?[零一二三四五六七八九十百千万两]+(?:次|回|遍|场|番|个|轮|层|重|年|岁|月|日)|[0-9]+(?:次|回|遍|场|番|个|轮|层|重|年|岁|月|日)/g;

// ============================================================
// 4. 泛化替换表（任务卡 v1 规则；同时充当「伪具体」名单）
// ============================================================

interface GeneralizeRule {
  /** 匹配模式（全局） */
  pattern: RegExp;
  /** 泛化表述 */
  replacement: string;
  /** 该规则识别出的元素类型 */
  type: ImageryElementType;
  /** 泛化后的替代表述（供 isReplaceable 判定与对照版生成共用） */
  genericWord: string;
}

const GENERALIZE_RULES: GeneralizeRule[] = [
  { pattern: /铁与盐的气味/g, replacement: '某种锐利的气息', type: 'sensory', genericWord: '某种锐利的气息' },
  { pattern: /指尖的凉意/g, replacement: '某种清冷的感觉', type: 'sensory', genericWord: '某种清冷的感觉' },
  { pattern: /胸口的紧绷/g, replacement: '某种收紧的感觉', type: 'sensory', genericWord: '某种收紧的感觉' },
  {
    // 通用形态：身体部位 + 可选「的」+ 感官名词（覆盖「胸口紧绷」「掌心的凉」等所有同形套话）
    pattern: new RegExp(`(?:${BODY_PARTS.join('|')})的?(?:${SENSORY_WORDS.join('|')})`, 'g'),
    replacement: '某种感觉',
    type: 'sensory',
    genericWord: '某种感觉',
  },
  {
    // 任务卡示例：「第二个秋天」→「某个季节」（须先于通用数字规则）
    pattern: /第[一二三四五六七八九十]个(?:春天|夏天|秋天|冬天|季节)/g,
    replacement: '某个季节',
    type: 'time_node',
    genericWord: '某个季节',
  },
  { pattern: /(?:东北偏北|东北偏东|东南偏东|东南偏南|西南偏南|西南偏西|西北偏西|西北偏北|东北|东南|西南|西北|正东|正南|正西|正北)/g, replacement: '远方', type: 'direction', genericWord: '远方' },
  { pattern: /(?:第)?[零一二三四五六七八九十百千万两]+(?:次|回|遍|场|番|个|轮|层|重|年|岁|月|日)/g, replacement: '几次', type: 'number', genericWord: '几次' },
  { pattern: /(?:立春|雨水|惊蛰|春分|清明|谷雨|立夏|小满|芒种|夏至|小暑|大暑|立秋|处暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至|小寒|大寒)/g, replacement: '某个季节', type: 'time_node', genericWord: '某个季节' },
  { pattern: /本命年/g, replacement: '某一年', type: 'time_node', genericWord: '某一年' },
];

/** 泛化后的替代表述集合（这些词本身不算具体元素） */
const GENERIC_WORDS = new Set(GENERALIZE_RULES.map((r) => r.genericWord));

// ============================================================
// 5. 元素抽取
// ============================================================

interface Span {
  start: number;
  end: number;
}

function overlaps(spans: Span[], start: number, end: number): boolean {
  return spans.some((s) => start < s.end && end > s.start);
}

/** 上下文接受判据（用于剔除兼类词/泛指词的假阳性） */
type AcceptFn = (word: string, index: number, text: string) => boolean;

/** 「清明」等兼类节气词：前字为视觉/心境类词时按普通词处理（如「眼底清明」） */
function acceptTimeNode(word: string, index: number, text: string): boolean {
  if (!AMBIGUOUS_TIME_NODES.has(word)) return true;
  const prev = index > 0 ? text[index - 1] : '';
  return !MENTAL_VIEW_PREFIXES.includes(prev);
}

function collectByDict(
  text: string,
  words: string[],
  type: ImageryElementType,
  spans: Span[],
  used: Set<string>,
  evidenceCorpus: string,
  out: ImageryElement[],
  accept?: AcceptFn
): void {
  // 长词优先
  const sorted = [...words].sort((a, b) => b.length - a.length);
  for (const w of sorted) {
    let from = 0;
    for (;;) {
      const idx = text.indexOf(w, from);
      if (idx < 0) break;
      const end = idx + w.length;
      from = end;
      if (accept && !accept(w, idx, text)) continue;
      if (overlaps(spans, idx, end)) continue;
      spans.push({ start: idx, end });
      const key = `${type}::${w}`;
      if (used.has(key)) continue;
      used.add(key);
      out.push(buildElement(type, w, evidenceCorpus));
    }
  }
}

function collectByPattern(
  text: string,
  pattern: RegExp,
  type: ImageryElementType,
  spans: Span[],
  used: Set<string>,
  evidenceCorpus: string,
  out: ImageryElement[],
  accept?: AcceptFn
): void {
  // 每次使用新实例，避免 /g lastIndex 残留
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  for (const m of text.matchAll(re)) {
    const value = m[0];
    const idx = m.index ?? 0;
    const end = idx + value.length;
    if (accept && !accept(value, idx, text)) continue;
    if (overlaps(spans, idx, end)) continue;
    spans.push({ start: idx, end });
    const key = `${type}::${value}`;
    if (used.has(key)) continue;
    used.add(key);
    out.push(buildElement(type, value, evidenceCorpus));
  }
}

function buildElement(type: ImageryElementType, value: string, evidenceCorpus: string): ImageryElement {
  const hit = evidenceCorpus.length > 0 && evidenceCorpus.includes(value);
  return {
    type,
    value,
    is_personal: hit,
    ...(hit ? { evidence_hit: value } : {}),
  };
}

export interface ExtractOptions {
  /** 命盘证据快照（atoms.evidence 序列化文本 + 用户问卷答案），用于判定 is_personal */
  evidenceCorpus?: string;
}

/**
 * 抽取文本中的所有「具体化元素」（5 类）。
 * 同类型同值去重；跨类型允许重复（如「第三个本命年」同时命中 number 与 time_node）。
 */
export function extractImageryElements(text: string, options: ExtractOptions = {}): ImageryElement[] {
  const evidenceCorpus = options.evidenceCorpus ?? '';
  const out: ImageryElement[] = [];
  const used = new Set<string>();
  const spans: Span[] = [];

  // ① 感官短语（最具体，优先占用区间）
  collectByDict(text, SENSORY_PHRASES, 'sensory', spans, used, evidenceCorpus, out);
  // ② 方位
  collectByDict(text, DIRECTION_WORDS, 'direction', spans, used, evidenceCorpus, out);
  // ③ 时间节点（节气 + 其他；「清明」等兼类词按上下文过滤）
  collectByDict(text, SOLAR_TERMS, 'time_node', spans, used, evidenceCorpus, out, acceptTimeNode);
  collectByDict(text, TIME_NODE_WORDS, 'time_node', spans, used, evidenceCorpus, out);
  // ④ 数字（剔除「一个/一种」等泛指数量词）
  collectByPattern(text, NUMBER_PATTERN, 'number', spans, used, evidenceCorpus, out, (w) => !NUMBER_STOPWORDS.has(w));
  // ⑤ 感官细节：只认「身体部位+感官名词」的完整邻接短语；
  //    单独的部位词 / 感官词属词汇级噪声，不计入具体化元素
  collectByPattern(text, SENSORY_COMBO_PATTERN, 'sensory', spans, used, evidenceCorpus, out);

  return out;
}

/**
 * 从原子结论 + 用户问卷构造证据语料（is_personal 判定依据）。
 */
export function buildEvidenceCorpus(
  atoms: AtomicConclusion[],
  questionnaire: Record<string, unknown> = {}
): string {
  const parts: string[] = [];
  for (const a of atoms) {
    try {
      parts.push(JSON.stringify(a.evidence ?? {}));
    } catch {
      // 循环引用等异常忽略
    }
    parts.push(a.atomicId, a.termId);
  }
  try {
    parts.push(JSON.stringify(questionnaire));
  } catch {
    // 同上
  }
  return parts.join(' | ');
}

// ============================================================
// 6. 泛化（生成对照版 + 判定「伪具体」）
// ============================================================

/** 把个性化版本中的具体化元素替换为泛化表述 */
export function generalizePoem(poem: string, questionnaire: Record<string, unknown> = {}): string {
  let out = poem;
  for (const rule of GENERALIZE_RULES) {
    out = out.replace(new RegExp(rule.pattern.source, rule.pattern.flags), rule.replacement);
  }
  // 问卷命中的生活细节同样泛化（避免把用户隐私细节当作可复制的「具体」）
  for (const v of Object.values(questionnaire)) {
    if (typeof v === 'string' && v.length >= 2 && !GENERIC_WORDS.has(v)) {
      out = out.split(v).join('某种境况');
    }
  }
  return out;
}

/** 判定某元素是否为「可被通用模板复制的伪具体」 */
export function isReplaceable(element: ImageryElement): boolean {
  if (GENERIC_WORDS.has(element.value)) return false; // 泛化词本身不是具体元素
  for (const rule of GENERALIZE_RULES) {
    if (rule.type !== element.type) continue;
    const re = new RegExp(`^(?:${rule.pattern.source})$`);
    if (re.test(element.value)) return true;
  }
  // 方位/数字/节气三类只要命中词典，即视为可泛化
  if (element.type === 'direction') return true;
  if (element.type === 'number') return true;
  if (element.type === 'time_node') return SOLAR_TERMS.includes(element.value) || TIME_NODE_WORDS.includes(element.value);
  // 感官：凡是「身体部位+感官名词」形态或任务卡示例短语，都属通用模板可复制形态
  if (element.type === 'sensory') {
    return SENSORY_GENERIC_PATTERN.test(element.value) || SENSORY_PHRASES.includes(element.value);
  }
  return false;
}

// ============================================================
// 7. IG 计算
// ============================================================

/**
 * 信息增量：IG = 独有具体化元素数 / 具体化元素总数
 *
 * @param poem 个性化版本
 * @param generic_poem 通用版本（通常由 generalizePoem(poem) 生成）
 *
 * 独有判定 = 「不可泛化」∧「未出现在通用版本中」。
 */
export function calculateInformationGain(poem: string, generic_poem: string): number {
  const elements = extractImageryElements(poem);
  if (elements.length === 0) return 0;

  const genericValues = new Set(extractImageryElements(generic_poem).map((e) => e.value));
  const unique = elements.filter((e) => !isReplaceable(e) && !genericValues.has(e.value));

  return round4(unique.length / elements.length);
}

/**
 * 带证据锚定的 IG（validateAntiBarnum 内部使用）。
 *
 * 与 calculateInformationGain 的差异（三处修正）：
 *   ① 命盘证据（含生成器注入的意象锚定短语）中真实出现的元素，从「伪具体」中救回；
 *   ② 交叉核验通用版本：泛化替换后仍出现的同值元素不计增量；
 *   ③ 最小样本保底：元素总数 < 3 时按 3 计，避免「只检出 1 个元素 → IG 满分」的虚高。
 */
function infoGainWithEvidence(
  poem: string,
  genericPoem: string,
  evidenceCorpus: string
): { score: number; elements: ImageryElement[]; uniqueCount: number; denominator: number } {
  const elements = extractImageryElements(poem, { evidenceCorpus });
  if (elements.length === 0) return { score: 0, elements, uniqueCount: 0, denominator: 0 };

  const genericValues = new Set(extractImageryElements(genericPoem).map((e) => e.value));
  const unique = elements.filter((e) => {
    if (genericValues.has(e.value)) return false;
    return !isReplaceable(e) || e.is_personal;
  });

  const denominator = Math.max(elements.length, MIN_IG_DENOMINATOR);
  return {
    score: round4(unique.length / denominator),
    elements,
    uniqueCount: unique.length,
    denominator,
  };
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

// ============================================================
// 8. 校验器（三档判定）
// ============================================================

export interface ValidateOptions {
  /**
   * 生成器注入的「锚定短语」：本诗实际使用的意象 / 身体感受短语。
   * 它们由「命盘原子结论 → 原型 → 意象词典」推导而来，属于该命盘的条件化产物，
   * 因此计入增量（不计入则意象词典对 IG 无任何贡献）。
   */
  anchored_phrases?: string[];
}

/**
 * 反巴纳姆校验。
 *
 * - IG ≥ 0.30           → 通过
 * - 0.20 ≤ IG < 0.30    → 边界区，needs_review = true
 * - IG < 0.20           → 判为「鸡汤」，passed = false
 */
export function validateAntiBarnum(
  poem: string,
  atoms: AtomicConclusion[],
  questionnaire: Record<string, unknown> = {},
  options: ValidateOptions = {}
): AntiBarnumResult {
  const anchorText = (options.anchored_phrases ?? []).join(' | ');
  const evidenceCorpus = [buildEvidenceCorpus(atoms, questionnaire), anchorText]
    .filter(Boolean)
    .join(' | ');
  const genericPoem = generalizePoem(poem, questionnaire);
  const { score, elements, uniqueCount, denominator } = infoGainWithEvidence(
    poem,
    genericPoem,
    evidenceCorpus
  );

  const passed = score >= IG_PASS_THRESHOLD;
  const needsReview = !passed && score >= IG_REVIEW_THRESHOLD;

  let reason: string;
  if (elements.length === 0) {
    reason = '未检出任何具体化元素：文本为可套用于任何人的通用表述，判定为巴纳姆鸡汤';
  } else if (passed) {
    reason = `信息增量 ${score.toFixed(2)} ≥ ${IG_PASS_THRESHOLD}：命盘锚定元素 ${uniqueCount} 个 / 计分分母 ${denominator}（检出 ${elements.length} 个），通过`;
  } else if (needsReview) {
    reason = `信息增量 ${score.toFixed(2)} 处于边界区（[${IG_REVIEW_THRESHOLD}, ${IG_PASS_THRESHOLD})）：具体化元素偏少，建议补充命盘锚定细节后复检`;
  } else {
    reason = `信息增量 ${score.toFixed(2)} < ${IG_REVIEW_THRESHOLD}：具体化元素多为可泛化套话（如方位/序数/季节），判定为鸡汤`;
  }

  return {
    passed,
    ig_score: score,
    elements,
    generic_poem: genericPoem,
    needs_review: needsReview,
    reason,
  };
}
