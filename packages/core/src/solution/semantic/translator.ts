/**
 * translator.ts — 三级转译流水线（R3-15 · 任务包07 7.3）
 *
 * 一级：词语（canonical_factors / termId 归一化）
 * 二级：语句（prose_generator 白话句）
 * 三级：报告（多原子聚合 → 分域报告）
 *
 * 设计原则（YAGNI）：复用 prose_generator / anti_barnum 现有能力，
 * 本文件只做「编排 + 聚合」，不重复意象/反巴纳姆实现。
 */
import type { TermSchema } from './types';
import {
  generateProsePoem,
  type ProseAtom,
  type ProseLine,
  type ProsePoem,
  type ProseGloss,
  type ProseOptions,
} from './prose_generator';
import type { UserProfile } from './solution';
import type { ArchetypeSelectorProfile } from './archetype_select';

/* ────────────────────────────────────────────────
   类型
   ─────────────────────────────────────────────── */

/** 一级：归一化词语（每个原子贡献一个） */
export interface L1Term {
  atom_id: string;
  term_id: string;
  term_name: string;
  plain_name: string;
  domain: string;
  /** 归一化因子列表（来自 canonical_factors，可能为空） */
  canonical_factors: string[];
}

/** 二级：白话语句（一行一句，可回溯原子） */
export interface L2Sentence {
  atom_id: string;
  text: string;
  image: string;
  body_target: string;
}

/** 三级：分域报告段落 */
export interface ReportSection {
  domain: string;
  title: string;
  sentences: L2Sentence[];
  gloss: ProseGloss[];
}

/** 三级：完整报告 */
export interface TranslatorReport {
  l1_terms: L1Term[];
  l2_poem: ProsePoem;
  l3_sections: ReportSection[];
  l3_anchor: string;
  degraded: boolean;
  degradation_reason?: string;
  anti_barnum_passed: boolean;
  generated_at: string;
}

/** 转译入参 */
export interface TranslateInput {
  atoms: ProseAtom[];
  userProfile: UserProfile;
  archetypeProfile?: ArchetypeSelectorProfile;
  options?: ProseOptions;
  /** 术语本体（用于一级归一化；缺省按 termId 回退） */
  termRegistry?: TermSchema[];
}

/* ────────────────────────────────────────────────
   一级：词语归一化
   ─────────────────────────────────────────────── */

/** termId → 白话词名（无本体时的兜底映射） */
const FALLBACK_TERM_NAMES: Record<string, string> = {
  // 事业
  career: '事业',
  decision: '决策',
  direction: '方向',
  // 财运
  wealth: '财运',
  // 关系
  relationship: '关系',
  marriage: '婚姻',
  parents: '父母缘',
  children: '子女缘',
  // 健康
  health: '健康',
  mind: '心境',
  // 节奏
  timing: '时机',
  travel: '出行',
};

/**
 * 一级转译：从原子结论抽取归一化词语。
 * 规则：
 * - 优先使用 canonical_factors（CIR v2）的归一化因子
 * - 否则按 termId 走本体 / 兜底映射
 */
export function translateL1Terms(atoms: ProseAtom[], registry?: TermSchema[]): L1Term[] {
  const registryMap = new Map(registry?.map((t) => [t.id, t]) ?? []);
  return atoms.map((atom) => {
    const termId = atom.termId;
    const term = registryMap.get(termId);
    const domain = atom.domain ?? inferDomain(atom);
    // canonical_factors 是 string[]，取第一个作为主因子
    const canonicalFactors = atom.canonical_factors ?? [];
    // 白话名：本体 → 兜底 → termId
    const plainName = term?.name ?? FALLBACK_TERM_NAMES[termId] ?? termId;
    return {
      atom_id: atom.atomicId,
      term_id: termId,
      term_name: plainName,
      plain_name: plainName,
      domain,
      canonical_factors: canonicalFactors,
    };
  });
}

/** termId → 域（无 domain 字段时按前缀推断） */
function inferDomain(atom: ProseAtom): string {
  const d = atom.domain;
  if (d) return d;
  const tid = atom.termId ?? '';
  if (tid.includes('career') || tid.includes('decision')) return 'career';
  if (tid.includes('wealth')) return 'wealth';
  if (tid.includes('rel') || tid.includes('mar')) return 'relationship';
  if (tid.includes('health') || tid.includes('mind')) return 'health';
  if (tid.includes('timing') || tid.includes('travel')) return 'rhythm';
  return 'general';
}

/* ────────────────────────────────────────────────
   二级：白话语句（调用现有 prose_generator）
   ─────────────────────────────────────────────── */

/**
 * 二级转译：调用 generateProsePoem 得到白话行。
 * 返回语句列表（每行 = 一个原子的一句话）。
 */
export function translateL2(poem: ProsePoem): L2Sentence[] {
  return poem.lines.map((l: ProseLine) => ({
    atom_id: l.atom_id,
    text: l.text,
    image: l.image,
    body_target: l.body_target,
  }));
}

/* ────────────────────────────────────────────────
   三级：聚合报告（按域分组 + 锚点 + 注解）
   ─────────────────────────────────────────────── */

/** 域 → 报告段落标题 */
const SECTION_TITLES: Record<string, string> = {
  career: '事业与决策',
  wealth: '财运',
  relationship: '关系与家庭',
  health: '健康与心境',
  rhythm: '节奏与出行',
  general: '其他',
};

/**
 * 三级转译：把 L1 词语 + L2 语句 聚合成分域报告。
 * - 按域分组（career/wealth/relationship/health/rhythm/general）
 * - 每段 = 标题 + 语句列表 + 注解
 * - 锚点语 = poem.anchor_line
 * - 降级时所有段落折叠为单段「陪伴短句」
 */
export function buildL3Report(
  l1Terms: L1Term[],
  l2Poem: ProsePoem,
): {
  sections: ReportSection[];
  anchor: string;
  degraded: boolean;
  degradation_reason?: string;
} {
  const termByAtom = new Map(l1Terms.map((t) => [t.atom_id, t]));

  const domainGroups = new Map<string, ReportSection>();
  for (const line of l2Poem.lines) {
    const term = termByAtom.get(line.atom_id);
    const domain = term?.domain ?? 'general';
    if (!domainGroups.has(domain)) {
      domainGroups.set(domain, {
        domain,
        title: SECTION_TITLES[domain] ?? '其他',
        sentences: [],
        gloss: [],
      });
    }
    domainGroups.get(domain)!.sentences.push({
      atom_id: line.atom_id,
      text: line.text,
      image: line.image,
      body_target: line.body_target,
    });
  }

  // 注解按域挂载
  for (const g of l2Poem.gloss) {
    const term = termByAtom.get(g.atom_id);
    const domain = term?.domain ?? 'general';
    const sec = domainGroups.get(domain);
    if (sec) sec.gloss.push(g);
  }

  // 降级：只保留有语句的段；无语句时给单段陪伴
  const sections = Array.from(domainGroups.values()).filter((s) => s.sentences.length > 0);
  if (l2Poem.degraded && sections.length === 0) {
    sections.push({
      domain: 'general',
      title: '陪伴',
      sentences: [],
      gloss: [],
    });
  }

  return {
    sections,
    anchor: l2Poem.anchor_line,
    degraded: l2Poem.degraded,
    degradation_reason: l2Poem.degradation_reason,
  };
}

/* ────────────────────────────────────────────────
   一站式入口
   ─────────────────────────────────────────────── */

/**
 * 完整三级转译：原子结论 → 词语 → 语句 → 报告。
 * 幂等：同 atoms + options.seed 同输出。
 */
export function translate(input: TranslateInput): TranslatorReport {
  const { atoms, userProfile, archetypeProfile, options, termRegistry } = input;

  // L2 先行（poem 决定 L1 的 domain 与 L3 的分组）
  const poem = generateProsePoem(atoms, userProfile, archetypeProfile, options);
  const l1 = translateL1Terms(atoms, termRegistry);
  const l3 = buildL3Report(l1, poem);

  return {
    l1_terms: l1,
    l2_poem: poem,
    l3_sections: l3.sections,
    l3_anchor: l3.anchor,
    degraded: l3.degraded,
    degradation_reason: l3.degradation_reason,
    anti_barnum_passed: poem.passed_barnum_check,
    generated_at: new Date().toISOString(),
  };
}
