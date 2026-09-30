/**
 * 命律 · 散文诗生成器（骨架版）
 * ============================================================
 * R3-13 · 任务 2 + 任务 3（降级逻辑）
 *
 * 生成流程（任务卡 v1）：
 *   ① 筛选 atoms：modality ≠ 'unknown' 且 redline = false
 *   ② 按领域配额：事业/财富/感情/健康/节律 各最多 1 个意象
 *   ③ 原型映射：R3-12 selectArchetype
 *   ④ 意象选择：从原型 safe_imagery 中选 3-4 个
 *   ⑤ 模板拼装：生成结构化诗骨
 *   ⑥ 反巴纳姆校验：R3-13 validateAntiBarnum
 *   ⑦ 输出：诗骨 + 白话注解
 *
 * ------------------------------------------------------------------
 * 【接线裁决 · 2026-09-19】
 * R3-12（archetypes.ts / archetype_types.ts / archetype_select.ts / imagery.ts）已落盘，
 * 本文件直接调用其 `selectArchetype`，不再自建原型表 —— 避免同名结构双写与数据漂移。
 *
 * 两处对任务卡签名的工程化调整（理由随附）：
 *   1. 第 3 参 archetypeMapping: ArchetypeMapping[] → archetypeProfile: ArchetypeSelectorProfile。
 *      原因：原型映射表由 R3-12 模块持有（ARCHETYPE_MAPPINGS），外部注入一份副本只会双写。
 *      参数数量与调用形态不变（atoms, userProfile, 画像, options）。
 *   2. 领域配额按「5 域配额桶」归并 R3-12 的 12 域（禁止另造领域名，桶只是配额统计口径）：
 *      career←career/decision/direction｜wealth←wealth｜relationship←relationship/marriage/parents/children
 *      ｜health←health/mind｜rhythm←timing/travel
 *
 * 【诚实原则】诗行中的命盘锚点（方位 / 节气 / 数字）**只能从 atom.evidence 抽取**，
 * 绝不凭空编造 —— 这正是反巴纳姆校验要守住的东西。
 */

import type { AtomicConclusion, FactPolarity } from './types';
import type { UserProfile } from './solution';
import { selectArchetype, type ArchetypeResult, type ArchetypeSelectorProfile } from './archetype_select';
import type { ArchetypeDomain } from './archetype_types';
import type { ImageryEntry } from './imagery';
import { normalizeShishenId, getArchetypeMapping } from './archetypes';
import { validateAntiBarnum, extractImageryElements, type AntiBarnumResult } from './anti_barnum';

// ============================================================
// 1. 类型
// ============================================================

/** 领域配额桶（任务卡 5 域口径，映射到 R3-12 的 12 域） */
export type QuotaBucket = 'career' | 'wealth' | 'relationship' | 'health' | 'rhythm';

export const QUOTA_BUCKETS: Record<QuotaBucket, ArchetypeDomain[]> = {
  career: ['career', 'decision', 'direction'],
  wealth: ['wealth'],
  relationship: ['relationship', 'marriage', 'parents', 'children'],
  health: ['health', 'mind'],
  rhythm: ['timing', 'travel'],
};

export const QUOTA_ORDER: QuotaBucket[] = ['career', 'wealth', 'relationship', 'health', 'rhythm'];

/** 原子结论（散文诗视角；redline = 合规红线，true 则该原子不得入诗） */
export interface ProseAtom extends AtomicConclusion {
  redline?: boolean;
  /** 归属领域（R3-12 十二域）；缺省按 termId 推断 */
  domain?: ArchetypeDomain;
  /** 该原子的白话文本（用于注解；缺省时自动生成） */
  text?: string;
}

export interface ProseLine {
  atom_id: string;
  image: string;
  body_target: string;
  text: string;
}

/** 白话注解（每行可回溯到原子结论） */
export interface ProseGloss {
  atom_id: string;
  term_name: string;
  text: string;
}

export interface ProsePoem {
  lines: ProseLine[];
  /** 锚点语（可回溯到原子结论） */
  anchor_line: string;
  archetype: string;
  archetype_description: string;
  archetype_track: 'eastern' | 'dynamic' | 'none';
  ig_score: number;
  passed_barnum_check: boolean;
  needs_review: boolean;
  /** 白话注解 */
  gloss: ProseGloss[];
  /** 降级标记 */
  degraded: boolean;
  degradation_reason?: 'insufficient_atoms' | 'negative_cluster' | 'no_archetype';
  /** 意象新鲜度（连续 2 次相同主象 → 0.7） */
  freshness_factor: number;
  anti_barnum: AntiBarnumResult;
}

export interface ProseOptions {
  /** 确定性随机种子（同 seed 同诗） */
  seed?: string;
  /** 用户采访问卷答案（参与证据锚定与生活细节泛化） */
  questionnaire?: Record<string, unknown>;
  /** 历史意象记录（同月不重复同一主象 / 连续 2 次相同 → 新鲜度衰减 30%） */
  history?: {
    month_images?: string[];
    last_images?: string[];
  };
}

/** 极端情况①：低置信 / 全 unknown 时的通用陪伴短句（不出「假装懂你」的诗） */
export const GENERIC_COMPANION_LINE = '当前信息较少，补全出生时间可获得更个性化表达。';

/** 锚点语（按十神；R3-12 未持有此字段，由散文诗层提供） */
const ANCHOR_LINES: Record<string, string> = {
  QS: '此刻，你正站在「破」与「立」的交界线上。',
  ZG: '此刻，你正站在「守」与「立」的接缝上。',
  SG: '此刻，你正站在「说」与「不说」的钢丝上。',
  ZY: '此刻，你正站在「受」与「予」的渡口。',
  PY: '此刻，你正站在「入」与「出」的岔口。',
  BJ: '此刻，你正站在「同行」与「独行」的路口。',
  JC: '此刻，你正站在「取」与「守」的边界上。',
  SS: '此刻，你正站在「尝」与「酿」的中间。',
  ZC: '此刻，你正站在「种」与「收」的田垄上。',
  PC: '此刻，你正站在「守成」与「出手」的岔路上。',
};

const DEFAULT_ANCHOR_LINE = '此刻，你正站在一个还没有定型的路口上。';

// ============================================================
// 2. 确定性伪随机（同 seed 同诗，可复现）
// ============================================================

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function defaultSeed(atoms: ProseAtom[], profile: UserProfile): string {
  return [atoms.map((a) => a.atomicId).join(','), profile.ageRange ?? '', profile.gender ?? ''].join('|');
}

// ============================================================
// 3. 基础映射
// ============================================================

function isNegative(polarity: FactPolarity): boolean {
  return polarity === '-' || polarity === '--';
}

/** 十神 id 解析（termId / atomicId / 别名 / 中文名 → 'QS' 等） */
function toShishenId(atom: ProseAtom): string | null {
  const byTerm = normalizeShishenId(String(atom.termId ?? ''));
  if (byTerm) return byTerm;
  const m = /^ATOM-([A-Z]{2})-/.exec(atom.atomicId);
  return m ? normalizeShishenId(m[1]) ?? null : null;
}

/** 十神 → 默认领域（无显式 domain 时的推断依据） */
const TERM_DOMAIN_HINT: Record<string, ArchetypeDomain> = {
  QS: 'career',
  ZG: 'career',
  SG: 'mind',
  SS: 'mind',
  ZY: 'mind',
  PY: 'mind',
  BJ: 'wealth',
  JC: 'wealth',
  ZC: 'wealth',
  PC: 'wealth',
};

function inferDomain(atom: ProseAtom): ArchetypeDomain {
  if (atom.domain) return atom.domain;
  const id = toShishenId(atom);
  if (id && TERM_DOMAIN_HINT[id]) return TERM_DOMAIN_HINT[id];
  const d = (atom.evidence as Record<string, unknown> | undefined)?.domain;
  if (typeof d === 'string' && isArchetypeDomain(d)) return d;
  return 'timing';
}

function isArchetypeDomain(v: string): v is ArchetypeDomain {
  return Object.values(QUOTA_BUCKETS).some((list) => (list as string[]).includes(v));
}

function bucketOf(domain: ArchetypeDomain): QuotaBucket {
  for (const b of QUOTA_ORDER) {
    if ((QUOTA_BUCKETS[b] as string[]).includes(domain)) return b;
  }
  return 'rhythm';
}

/** focusArea → 关注领域（R3-12 十二域） */
function focusToDomains(focus?: string): ArchetypeDomain[] {
  switch (focus) {
    case 'career':
      return ['career', 'decision'];
    case 'wealth':
      return ['wealth'];
    case 'relationship':
    case 'family':
      return ['relationship', 'marriage'];
    case 'health':
      return ['health', 'mind'];
    case 'study':
      return ['career', 'mind'];
    default:
      return [];
  }
}

/** 画像 → NFC 水平（无显式声明时的保守推断：家庭/学业导向 = 传统轨） */
function inferNfc(profile: UserProfile): 'high' | 'low' {
  return profile.focusArea === 'family' || profile.focusArea === 'study' ? 'high' : 'low';
}

// ============================================================
// 4. 句式模板
// ============================================================

/** 配额桶开场（首行限定语境） */
const BUCKET_OPENERS: Record<QuotaBucket, string> = {
  career: '在要走的那条路上，',
  wealth: '在手边这些实在的东西里，',
  relationship: '在人与人之间，',
  health: '在身体的节奏里，',
  rhythm: '在年月的推移中，',
};

/** 正向句式（占位符：{image} 意象 / {body} 身体目标 / {anchor} 命盘锚点） */
const POS_TEMPLATES: string[] = [
  '你是{image}，{body}。',
  '{image}还在原处，{body}——你只是还没用上它。',
  '风从{anchor}来的时候，{image}会先动一下。',
  '这一刻，{image}还在，{body}，它还没有用完。',
];

/** 高负极性集中 / 命中禁忌语境时的句式：只写「需注意、可借力」，不写灾祸与断定 */
const NEG_TEMPLATES: string[] = [
  '可以留意{image}，{body}——先看清，再借力。',
  '{image}还在原处，{body}。不必急。',
  '风从{anchor}来的时候，{image}会先提醒你。',
  '{image}可以借来用一用，{body}——这不是坏事。',
];

/** 恐惧 / 断定类禁词（渲染后防御性扫描，命中即换句） */
const FORBIDDEN_TONE_WORDS = ['死亡', '死', '灾祸', '凶', '绝症', '分离', '丧', '杀身', '血光'];

const DEFAULT_ANCHOR = '远处';

function renderTemplate(template: string, entry: ImageryEntry, anchor: string): string {
  const bodyHead = entry.body_target.split('、')[0].split('，')[0];
  return template
    .split('{image}')
    .join(entry.image)
    .split('{body}')
    .join(bodyHead)
    .split('{anchor}')
    .join(anchor);
}

function sanitizeLine(text: string, entry: ImageryEntry, anchor: string): string {
  if (FORBIDDEN_TONE_WORDS.some((w) => text.includes(w))) {
    return renderTemplate('你是{image}，{body}。', entry, anchor);
  }
  return text;
}

// ============================================================
// 5. 命盘锚点抽取（只从 evidence 取，绝不编造）
// ============================================================

function evidenceCorpusOf(atoms: ProseAtom[]): string {
  const parts: string[] = [];
  for (const a of atoms) {
    try {
      parts.push(JSON.stringify(a.evidence ?? {}));
    } catch {
      // 循环引用等异常忽略
    }
  }
  return parts.join(' | ');
}

/** 从证据快照抽取方位 / 时间节点锚点（可入诗的真具体元素） */
function extractAnchors(atoms: ProseAtom[]): string[] {
  const elems = extractImageryElements(evidenceCorpusOf(atoms));
  const out: string[] = [];
  for (const e of elems) {
    if (e.type !== 'direction' && e.type !== 'time_node') continue;
    if (!out.includes(e.value)) out.push(e.value);
  }
  return out.slice(0, 2);
}

// ============================================================
// 6. 主生成器（七步流程 + 三类降级）
// ============================================================

export function generateProsePoem(
  atoms: ProseAtom[],
  userProfile: UserProfile,
  archetypeProfile: ArchetypeSelectorProfile = {},
  options: ProseOptions = {}
): ProsePoem {
  const questionnaire = options.questionnaire ?? {};
  const rand = mulberry32(hashSeed(options.seed ?? defaultSeed(atoms, userProfile)));

  // ① 筛选 atoms：modality ≠ 'unknown' 且 redline = false
  const candidates = atoms.filter(
    (a) => a.modality !== 'unknown' && a.redline !== true && Math.abs(a.confidence) >= 0.25
  );

  // ② 领域配额：5 桶各最多 1 个原子（取 |confidence| 最高）
  const byBucket = new Map<QuotaBucket, ProseAtom>();
  for (const a of candidates) {
    const b = bucketOf(inferDomain(a));
    const prev = byBucket.get(b);
    if (!prev || Math.abs(a.confidence) > Math.abs(prev.confidence)) byBucket.set(b, a);
  }
  const picked = QUOTA_ORDER.map((b) => byBucket.get(b)).filter((a): a is ProseAtom => Boolean(a));
  picked.sort((a, b) => Math.abs(b.confidence) - Math.abs(a.confidence));

  // 降级①：全量 unknown / 低置信 —— 不出「假装懂你」的诗
  if (picked.length === 0) return degradedPoem('insufficient_atoms');

  // ②.5 高负极性集中判定（负极性原子占比 ≥ 60%）
  const negativeCount = picked.filter((a) => isNegative(a.polarity)).length;
  const negativeCluster = negativeCount / picked.length >= 0.6;

  // ③ 原型映射（R3-12）
  const primary = picked[0];
  const shishenId = toShishenId(primary);
  const useType: 'yong' | 'ji' = isNegative(primary.polarity) ? 'ji' : 'yong';
  const strength: 'strong' | 'weak' = Math.abs(primary.confidence) >= 0.6 ? 'strong' : 'weak';

  const profile: ArchetypeSelectorProfile = {
    nfc_level: archetypeProfile.nfc_level ?? inferNfc(userProfile),
    domains_of_interest: archetypeProfile.domains_of_interest ?? focusToDomains(userProfile.focusArea),
    ...(archetypeProfile.context ? { context: archetypeProfile.context } : {}),
  };

  const archetype: ArchetypeResult = selectArchetype(
    shishenId ?? String(primary.termId),
    strength,
    useType,
    profile
  );

  // 降级②：术语不在 R3-12 原型映射覆盖范围，或无可选意象
  if (archetype.fallback || archetype.imagery.length === 0) {
    const dg = degradedPoem('no_archetype');
    dg.anti_barnum.reason += `（术语 ${primary.termId} 无可用原型 / 意象；fallback=${archetype.fallback}）`;
    return dg;
  }

  // 语体降级：高负极性集中 OR 命中禁忌语境（R3-12 redline）
  const negativeTone = negativeCluster || archetype.redline;

  // ④ 意象选择（3-4 个；同月不重复主象 + 语体降级时只取 safe）
  const history = options.history ?? {};
  const monthImages = new Set(history.month_images ?? []);
  const lastImages = history.last_images ?? [];

  const safetyPool = archetype.imagery.filter((e) => !negativeTone || e.cultural_safety === 'safe');
  let pool = safetyPool.filter((e) => !monthImages.has(e.image));
  // 同月意象全部用尽时才退回；退回即视为「不得不复用」，标记待复核
  const historyExhausted = pool.length === 0;
  if (historyExhausted) pool = safetyPool;

  const desired = picked.length >= 4 ? 4 : 3;
  const targetCount = Math.min(desired, picked.length, pool.length);

  const pairs: Array<{ atom: ProseAtom; image: ImageryEntry }> = [];
  for (const atom of picked.slice(0, targetCount)) {
    const d = inferDomain(atom);
    const used = new Set(pairs.map((p) => p.image.image));
    const preferred = pool.filter((e) => !used.has(e.image) && e.suitable_domains.includes(d));
    const rest = pool.filter((e) => !used.has(e.image));
    const chooser = preferred.length > 0 ? preferred : rest;
    if (chooser.length === 0) break;
    pairs.push({ atom, image: chooser[Math.floor(rand() * chooser.length)] });
  }

  // ⑤ 模板拼装（锚点只从 evidence 抽取，无则退化为「远处」）
  const anchor = extractAnchors(picked)[0] ?? DEFAULT_ANCHOR;
  const templatePool = negativeTone ? NEG_TEMPLATES : POS_TEMPLATES;
  const offset = Math.floor(rand() * templatePool.length);

  const lines: ProseLine[] = pairs.map((p, i) => {
    const template = templatePool[(i + offset) % templatePool.length];
    let text = sanitizeLine(renderTemplate(template, p.image, anchor), p.image, anchor);
    if (i === 0) text = `${BUCKET_OPENERS[bucketOf(inferDomain(p.atom))]}${text}`;
    return { atom_id: p.atom.atomicId, image: p.image.image, body_target: p.image.body_target, text };
  });

  const baseAnchorLine = ANCHOR_LINES[archetype.shishen_id] ?? DEFAULT_ANCHOR_LINE;
  const anchorLine = negativeTone ? `${baseAnchorLine}（需注意，也可借力。）` : baseAnchorLine;

  // ⑥ 反巴纳姆校验（整首：诗行 + 锚点语；本诗使用的意象作为锚定短语注入）
  const poemText = lines.map((l) => l.text).join('') + anchorLine;
  const anchoredPhrases = pairs.flatMap((p) => [p.image.image, p.image.body_target.split('、')[0]]);
  const anti = validateAntiBarnum(poemText, picked, questionnaire, {
    anchored_phrases: anchoredPhrases,
  });

  // ⑦ 新鲜度（连续 2 次相同主象 → 衰减 30%）
  const mainImage = pairs[0]?.image.image ?? '';
  const consecutiveHits = lastImages.filter((x) => x === mainImage).length;
  const freshnessFactor = consecutiveHits >= 2 ? 0.7 : 1;

  // ⑧ 白话注解（每行可回溯到原子结论）
  const gloss: ProseGloss[] = pairs.map((p) => {
    const id = toShishenId(p.atom);
    return {
      atom_id: p.atom.atomicId,
      term_name: (id ? getArchetypeMapping(id)?.shishen_name : undefined) ?? p.atom.termId,
      text:
        p.atom.text ??
        `对应原子结论 ${p.atom.atomicId}（模态 ${p.atom.modality} / 极性 ${p.atom.polarity}）`,
    };
  });

  return {
    lines,
    anchor_line: anchorLine,
    archetype: archetype.name,
    archetype_description: archetype.description,
    archetype_track: archetype.track,
    ig_score: anti.ig_score,
    passed_barnum_check: anti.passed,
    needs_review: anti.needs_review || (anti.passed && freshnessFactor < 1) || historyExhausted,
    gloss,
    degraded: false,
    freshness_factor: freshnessFactor,
    anti_barnum: anti,
  };
}

/** 降级输出：不产诗，只给陪伴短句 */
function degradedPoem(reason: ProsePoem['degradation_reason']): ProsePoem {
  return {
    lines: [],
    anchor_line: GENERIC_COMPANION_LINE,
    archetype: 'none',
    archetype_description: '',
    archetype_track: 'none',
    ig_score: 0,
    passed_barnum_check: false,
    needs_review: false,
    gloss: [],
    degraded: true,
    degradation_reason: reason,
    freshness_factor: 1,
    anti_barnum: {
      passed: false,
      ig_score: 0,
      elements: [],
      generic_poem: '',
      needs_review: false,
      reason:
        reason === 'insufficient_atoms'
          ? '原子结论不足（全量为 unknown / 低置信）：不出「假装懂你」的诗，改用通用陪伴短句'
          : '无可用原型 / 意象：该术语未被 R3-12 原型表覆盖，改用通用陪伴短句',
    },
  };
}
