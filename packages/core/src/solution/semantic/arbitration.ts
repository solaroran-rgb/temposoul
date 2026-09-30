/**
 * 命律 · 冲突仲裁引擎 v2（R3-14）
 *
 * 基于特色论证2 v2.0 共识方案，实现多体系（八字/紫微/奇门/六爻/塔罗/西占）
 * 命理结论的冲突仲裁：
 * - 任务1 时间层分离：跨时间层不做融合仲裁，只并列展示
 * - 任务2 同域归一 + 去重：same(time_scope, domain, canonical_factor, 极性方向) 合并
 * - 任务3 相关性标定：heavy / light / independent 三级依赖
 * - 任务4 高冲突检测：三条件同时满足 + D-S 冲突质量 K
 * - 任务5 三层仲裁输出：共识 / 张力 / 条件（条件层非命令式语气）
 * - 任务6 体系权重矩阵 SYSTEM_WEIGHTS 初始值
 */
import type { AtomicConclusion, EpistemicModality, FactPolarity } from './types';
import type { DsMass } from './confidence';

// ============================================================
// 0. 输入增强类型（在 AtomicConclusion 上扩展仲裁所需字段）
// ============================================================

/** 体系标识 */
export type SystemId = 'bazi' | 'ziwei' | 'qimen' | 'liuyao' | 'tarot' | 'western';

/** 领域标识（权重矩阵列） */
export type DomainId = 'career' | 'wealth' | 'relationship' | 'health' | 'decision' | 'timing';

/**
 * 仲裁原子 = AtomicConclusion + 仲裁所需扩展字段（全部可选，向后兼容）。
 * 现有 AtomicConclusion 可直接作为 ArbitratedAtom 传入。
 */
export interface ArbitratedAtom extends AtomicConclusion {
  /** 来源体系（如 bazi / tarot / western） */
  source?: string;
  /** 领域（如 wealth / career / decision）；缺省时从 canonical_factors 首个前缀推导 */
  domain?: string;
  /** 输入完整度（0-1）：核心字段与证据填充率；缺省时按原子自身信息量推导 */
  input_completeness?: number;
  /** 领域适配权重（0-1）：体系在该领域的适配度；缺省时从 SYSTEM_WEIGHTS 推导 */
  domain_fit_weight?: number;
}

// ============================================================
// 1. 极性方向 + 模态强度
// ============================================================

/** 极性方向（归一为 +/-/0，'0' 与 '++/--' 归入对应方向） */
export type PolarityDirection = '+' | '-' | '0';

/** 极性归一：'++'→'+'，'--'→'-'，'-'→'-'，'+'→'+'，'0'→'0' */
export function polarityDirection(p: FactPolarity): PolarityDirection {
  if (p === '++' || p === '+') return '+';
  if (p === '--' || p === '-') return '-';
  return '0';
}

/** 模态五档 → 强度序（越大越强） */
const MODALITY_RANK: Record<EpistemicModality, number> = {
  unknown: 0,
  possible: 1,
  tend: 2,
  likely: 3,
  assert: 4,
};

/** 模态强度（unknown=0 … assert=4） */
export function modalityRank(m: EpistemicModality): number {
  return MODALITY_RANK[m];
}

// ============================================================
// 2. 体系权重矩阵（任务6 · 初始值）
// ============================================================

/**
 * 体系权重矩阵：行=体系，列=领域。
 * 用于：条件层权重判定（domain_fit_weight 推导）/ 仲裁时的体系优先级。
 */
export const SYSTEM_WEIGHTS: Record<string, Record<string, number>> = {
  bazi:     { career: 0.9, wealth: 0.9, relationship: 0.8, health: 0.7, decision: 0.6, timing: 0.7 },
  ziwei:    { career: 0.85, wealth: 0.85, relationship: 0.9, health: 0.6, decision: 0.5, timing: 0.6 },
  qimen:    { career: 0.5, wealth: 0.6, relationship: 0.4, health: 0.3, decision: 0.9, timing: 0.95 },
  liuyao:   { career: 0.4, wealth: 0.5, relationship: 0.4, health: 0.3, decision: 0.95, timing: 0.8 },
  tarot:    { career: 0.3, wealth: 0.3, relationship: 0.7, health: 0.2, decision: 0.5, timing: 0.4 },
  western:  { career: 0.7, wealth: 0.7, relationship: 0.8, health: 0.5, decision: 0.4, timing: 0.7 },
};

/** 取体系在领域下的适配权重（缺省 0） */
export function systemWeight(system: string, domain: string): number {
  return SYSTEM_WEIGHTS[system]?.[domain] ?? 0;
}

// ============================================================
// 3. 字段推导
// ============================================================

/** domain 推导：显式字段优先，否则取 canonical_factors 首个前缀（如 'wealth:structural_wealth' → 'wealth'） */
export function atomDomain(a: ArbitratedAtom): string {
  if (a.domain) return a.domain;
  const cf = a.canonical_factors?.[0] ?? '';
  const idx = cf.indexOf(':');
  return idx > 0 ? cf.slice(0, idx) : 'general';
}

/** 来源体系列表（兼容 string | string[]，去重保序） */
export function atomSources(a: ArbitratedAtom): string[] {
  const raw = (a.evidence as { source?: string | string[] }).source ?? a.source;
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return [...new Set(list.filter((s): s is string => typeof s === 'string'))];
}

/** 极性方向（委托 polarityDirection） */
export function atomPolarityDirection(a: ArbitratedAtom): PolarityDirection {
  return polarityDirection(a.polarity);
}

/**
 * 输入完整度（0-1）：显式字段优先；否则按原子自身信息量推导：
 * 核心字段（polarity/confidence/modality/evidence/canonical_factors）填充率 × 0.5 + 证据丰富度 × 0.5。
 */
export function atomCompleteness(a: ArbitratedAtom): number {
  if (typeof a.input_completeness === 'number') return a.input_completeness;
  const core: Array<boolean> = [
    !!a.atomicId,
    !!a.polarity,
    typeof a.confidence === 'number',
    !!a.modality,
    Object.keys(a.evidence ?? {}).length > 0,
    !!a.canonical_factors?.length,
  ];
  const coreScore = core.filter(Boolean).length / core.length;
  const evidenceKeys = Object.keys(a.evidence ?? {}).length;
  const evidenceScore = Math.min(evidenceKeys, 4) / 4;
  return Math.round((coreScore * 0.5 + evidenceScore * 0.5) * 100) / 100;
}

/**
 * 领域适配权重（0-1）：显式字段优先；否则从 SYSTEM_WEIGHTS[体系][domain] 推导；
 * 体系或领域缺省时取该体系各领域权重的中位数（兜底）。
 */
export function atomFitWeight(a: ArbitratedAtom): number {
  if (typeof a.domain_fit_weight === 'number') return a.domain_fit_weight;
  const src = atomSources(a)[0] ?? a.source;
  const dom = atomDomain(a);
  if (src && SYSTEM_WEIGHTS[src]) {
    const w = SYSTEM_WEIGHTS[src][dom];
    if (typeof w === 'number') return w;
    // 领域未知：取该体系权重中位数
    const vals = Object.values(SYSTEM_WEIGHTS[src]).sort((x, y) => x - y);
    const mid = Math.floor(vals.length / 2);
    return vals.length % 2 === 1 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
  }
  return 0;
}

/**
 * D-S Mass 构造：正方向 → support=confidence；负方向 → oppose=confidence；
 * 中性（'0'）→ support=confidence×0.2（弱支持）。
 */
export function atomToMass(a: ArbitratedAtom): DsMass {
  const c = Math.max(0, Math.min(1, a.confidence));
  const dir = atomPolarityDirection(a);
  const support = dir === '+' ? c : dir === '0' ? c * 0.2 : 0;
  const oppose = dir === '-' ? c : 0;
  return { support, oppose, uncertain: Math.max(0, 1 - support - oppose) };
}

// ============================================================
// 4. 时间层分离（任务1）
// ============================================================

export interface TimeLayeredAtoms {
  long_term: AtomicConclusion[];
  current: AtomicConclusion[];
  event: AtomicConclusion[];
  general: AtomicConclusion[];
}

/**
 * 时间层分离：按 time_scope 分四层。
 * 未标注 time_scope 的原子归入 general（通用倾向）。
 * 跨时间层不做融合仲裁，只做并列展示。
 */
export function separateByTimeScope(atoms: AtomicConclusion[]): TimeLayeredAtoms {
  const result: TimeLayeredAtoms = { long_term: [], current: [], event: [], general: [] };
  for (const atom of atoms) {
    switch (atom.time_scope) {
      case 'long_term':
        result.long_term.push(atom);
        break;
      case 'current':
        result.current.push(atom);
        break;
      case 'event':
        result.event.push(atom);
        break;
      default:
        result.general.push(atom);
        break;
    }
  }
  return result;
}

// ============================================================
// 5. 同域归一 + 去重（任务2）
// ============================================================

export interface DedupResult {
  /** 去重后的原子（保留置信度最高一条，source/evidence 合并） */
  atoms: ArbitratedAtom[];
  /** 审计记录：每条含保留 atom 与被合并 atom_ids */
  audit: {
    atomicId: string;
    domain: string;
    canonical_factor: string;
    merged_ids: string[];
    sources: string[];
  }[];
}

const EMPTY_FACTOR = '__no_canonical_factor__';

/**
 * 去重判定（同时满足）：
 * 1. 相同 time_scope
 * 2. 相同 domain
 * 3. 相同 canonical_factor（取首个）
 * 4. 相同极性方向（'+'/'-'/'0'）
 *
 * 去重策略：保留置信度最高一条；合并来源（source 合并为数组）；
 * 记录被合并 atom_id（审计用）。
 */
export function dedupByCanonicalFactor(atoms: ArbitratedAtom[]): DedupResult {
  const groups = new Map<string, ArbitratedAtom[]>();
  const keyOf = (a: ArbitratedAtom) =>
    [
      a.time_scope ?? 'general',
      atomDomain(a),
      a.canonical_factors?.[0] ?? EMPTY_FACTOR,
      atomPolarityDirection(a),
    ].join('|');

  for (const a of atoms) {
    const key = keyOf(a);
    const list = groups.get(key) ?? [];
    list.push(a);
    groups.set(key, list);
  }

  const out: ArbitratedAtom[] = [];
  const audit: DedupResult['audit'] = [];

  for (const list of groups.values()) {
    if (list.length === 1) {
      out.push(list[0]);
      continue;
    }
    // 保留置信度最高一条（同分取先出现）
    let keeper = list[0];
    for (const a of list) if (a.confidence > keeper.confidence) keeper = a;
    const mergedIds = list.filter((a) => a.atomicId !== keeper.atomicId).map((a) => a.atomicId);

    const merged: ArbitratedAtom = { ...keeper };
    if (list.length > 1) {
      // 来源合并为数组（evidence 通道 + source 字段双通道）
      const sources = list.flatMap((a) => atomSources(a));
      merged.evidence = { ...merged.evidence, source: sources };
      merged.source = sources.join(',');
    }
    out.push(merged);
    audit.push({
      atomicId: keeper.atomicId,
      domain: atomDomain(keeper),
      canonical_factor: keeper.canonical_factors?.[0] ?? '',
      merged_ids: mergedIds,
      sources: atomSources(merged),
    });
  }
  return { atoms: out, audit };
}

// ============================================================
// 6. 相关性标定（任务3）
// ============================================================

export interface DependencyCheckResult {
  atom_a: string;
  atom_b: string;
  dependency_level: 'independent' | 'light' | 'heavy';
  reason: string;
}

/** 共享出生时间假设的体系（吃同一生辰）→ 轻度相关 */
const BIRTH_BASED_SYSTEMS: ReadonlySet<string> = new Set(['bazi', 'ziwei']);
/** 干支文化源头的体系 → 互相轻度相关 */
const GANZHI_SOURCES: ReadonlySet<string> = new Set(['bazi', 'qimen', 'liuyao']);

/**
 * 相关性判定规则：
 * - heavy（重度）：同体系 + 同规则（rule_trace.rule_id 相同）+ 同极性方向
 *   （同事实 → 应合并为一条，dedup 已处理）
 * - light（轻度）：同文化源头（八字/奇门/六爻同基于干支；八字/紫微共享同一生辰假设）
 * - independent（近似独立）：输入来源完全不同（如八字 vs 塔罗 vs 西占）→ 可 D-S Yager 融合
 */
export function checkDependencyPair(a: ArbitratedAtom, b: ArbitratedAtom): DependencyCheckResult {
  const sysA = atomSources(a)[0] ?? 'unknown';
  const sysB = atomSources(b)[0] ?? 'unknown';
  const ruleA = a.rule_trace?.rule_id;
  const ruleB = b.rule_trace?.rule_id;

  if (sysA === sysB && sysA !== 'unknown') {
    // 同体系：同规则且同极性方向 → 重度（应合并）
    if (
      (ruleA && ruleA === ruleB) ||
      (ruleA === undefined && ruleB === undefined &&
        a.termId === b.termId &&
        (a.comboId ?? null) === (b.comboId ?? null))
    ) {
      if (atomPolarityDirection(a) === atomPolarityDirection(b)) {
        return {
          atom_a: a.atomicId,
          atom_b: b.atomicId,
          dependency_level: 'heavy',
          reason: `同体系（${sysA}）同规则同事实，应合并为一条`,
        };
      }
      return {
        atom_a: a.atomicId,
        atom_b: b.atomicId,
        dependency_level: 'light',
        reason: `同体系（${sysA}）同规则但极性方向不同，按轻度相关处理`,
      };
    }
  }

  if (sysA !== sysB) {
    // 不同体系：共享出生时间假设（八字/紫微都吃同一生辰）→ 轻度
    if (BIRTH_BASED_SYSTEMS.has(sysA) && BIRTH_BASED_SYSTEMS.has(sysB)) {
      return {
        atom_a: a.atomicId,
        atom_b: b.atomicId,
        dependency_level: 'light',
        reason: `${sysA} 与 ${sysB} 共享同一出生时间假设（同一生辰），融合时按相关性系数折减`,
      };
    }
    // 同一文化源头（干支系：八字/奇门/六爻）→ 轻度
    if (GANZHI_SOURCES.has(sysA) && GANZHI_SOURCES.has(sysB)) {
      return {
        atom_a: a.atomicId,
        atom_b: b.atomicId,
        dependency_level: 'light',
        reason: `${sysA} 与 ${sysB} 同一文化源头（干支），融合时按相关性系数折减`,
      };
    }
    // 输入来源完全不同 → 近似独立
    return {
      atom_a: a.atomicId,
      atom_b: b.atomicId,
      dependency_level: 'independent',
      reason: `输入来源完全不同（${sysA} vs ${sysB}），可用 D-S Yager 融合`,
    };
  }

  return {
    atom_a: a.atomicId,
    atom_b: b.atomicId,
    dependency_level: 'independent',
    reason: '体系不明，按近似独立处理',
  };
}

/**
 * 两两相关性标定（全对）
 */
export function checkDependencies(atoms: ArbitratedAtom[]): DependencyCheckResult[] {
  const results: DependencyCheckResult[] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      results.push(checkDependencyPair(atoms[i], atoms[j]));
    }
  }
  return results;
}

// ============================================================
// 7. 高冲突检测（任务4）
// ============================================================

export interface ConflictDetectionResult {
  has_high_conflict: boolean;
  conflict_atoms: AtomicConclusion[];
  conflict_type: 'high' | 'low' | 'none';
  conflict_index_K: number;
}

/**
 * 高冲突判定（三条件同时满足，同域同时层内逐对）：
 * 1. 至少两条极性相反的高模态原子（一条 '+'，一条 '-'）
 * 2. 两侧 modality 都 ≥ likely（0.60），且 belief mass ≥ 0.6
 * 3. 两侧输入完整度 ≥ 0.7，且领域适配权重 ≥ 0.6
 *
 * 冲突指数 K = 该对原子 D-S Mass 正交组合的冲突质量：
 * K = m1.support × m2.oppose + m1.oppose × m2.support
 * K > 0.35 → 高冲突；K ≤ 0.35 → 低冲突。
 */
export function detectConflicts(timeLayer: TimeLayeredAtoms): ConflictDetectionResult {
  let bestK = 0;
  let bestPair: [ArbitratedAtom, ArbitratedAtom] | null = null;
  let metAll = false;

  const layers = [timeLayer.long_term, timeLayer.current, timeLayer.event, timeLayer.general];
  for (const layer of layers) {
    const items = layer as ArbitratedAtom[];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        if (atomDomain(a) !== atomDomain(b)) continue;

        const dirA = atomPolarityDirection(a);
        const dirB = atomPolarityDirection(b);
        // 条件1：极性相反
        if (!((dirA === '+' && dirB === '-') || (dirA === '-' && dirB === '+'))) continue;

        // 条件2：两侧模态 ≥ likely 且 belief mass ≥ 0.6
        const cond2 =
          modalityRank(a.modality) >= modalityRank('likely') &&
          modalityRank(b.modality) >= modalityRank('likely') &&
          a.confidence >= 0.6 &&
          b.confidence >= 0.6;
        if (!cond2) continue;

        // 条件3：输入完整度 ≥ 0.7 且领域适配权重 ≥ 0.6
        const cond3 =
          atomCompleteness(a) >= 0.7 && atomCompleteness(b) >= 0.7 &&
          atomFitWeight(a) >= 0.6 && atomFitWeight(b) >= 0.6;
        if (!cond3) continue;

        const K = massConflictK(a, b);
        if (K > bestK) {
          bestK = K;
          bestPair = [a, b];
          metAll = true;
        }
      }
    }
  }

  if (!metAll || !bestPair) {
    return { has_high_conflict: false, conflict_atoms: [], conflict_type: 'none', conflict_index_K: 0 };
  }

  const high = bestK > 0.35;
  return {
    has_high_conflict: high,
    conflict_atoms: high ? [bestPair[0], bestPair[1]] : [bestPair[0], bestPair[1]],
    conflict_type: high ? 'high' : 'low',
    conflict_index_K: Math.round(bestK * 1000) / 1000,
  };
}

/**
 * 两原子 D-S 冲突质量 K（正交组合的冲突质量，未归一化）
 */
export function massConflictK(a: ArbitratedAtom, b: ArbitratedAtom): number {
  const m1 = atomToMass(a);
  const m2 = atomToMass(b);
  return m1.support * m2.oppose + m1.oppose * m2.support;
}

// ============================================================
// 8. 三层仲裁输出（任务5）
// ============================================================

export interface ConsensusItem {
  domain: string;
  canonical_factor: string;
  polarity: PolarityDirection;
  modality: 'assert' | 'likely' | 'tend';
  sources: string[];
  confidence: number;
  summary: string;
}

export interface TensionItem {
  domain: string;
  perspectives: {
    system: string;
    claim: string;
    polarity: '+' | '-';
    modality: string;
    confidence: number;
  }[];
  explanation: string;
}

export interface ConditionItem {
  domain: string;
  condition: string;
  recommendation: string;
  source_system: string;
}

export interface ArbitrationResult {
  consensus: ConsensusItem[];
  tension: TensionItem[];
  condition: ConditionItem[];
}

/** 共识模态下限（tend） */
const CONSENSUS_MIN_RANK = modalityRank('tend');

/**
 * 共识层：同域同时层内方向一致、模态 ≥ tend 的原子按
 * (domain, canonical_factor, 极性方向) 分组；
 * 多体系指向同一 canonical factor 且极性一致 → 提级为"多体系互验共识"。
 * 组内置信度取最大值（证据独立性未知，不做乘性提升）。
 */
function buildConsensus(atoms: ArbitratedAtom[]): ConsensusItem[] {
  const groups = new Map<string, ArbitratedAtom[]>();
  const keyOf = (a: ArbitratedAtom) =>
    [atomDomain(a), a.canonical_factors?.[0] ?? EMPTY_FACTOR, atomPolarityDirection(a)].join('|');

  // 按 (domain, canonical_factor, 极性方向) 将原子归组（修复：原先漏了灌入循环，groups 恒空 → 共识恒为 []）
  for (const a of atoms) {
    const k = keyOf(a);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(a);
  }

  const out: ConsensusItem[] = [];
  for (const [key, list] of groups) {
    // 取模态 ≥ tend 的成员；组内取最高模态（≥tend）
    const members = list.filter((a) => modalityRank(a.modality) >= CONSENSUS_MIN_RANK);
    if (members.length === 0) continue;

    const strongest = members.reduce((m, a) => (a.confidence > m.confidence ? a : m), members[0]);
    const dir = polarityDirection(strongest.polarity);
    const sources = [...new Set(members.flatMap((a) => atomSources(a)))].filter((s) => s !== 'unknown');
    const isCrossSystem = sources.length > 1;
    const domain = key.split('|')[0] ?? atomDomain(strongest);
    const factor = key.split('|')[1] === EMPTY_FACTOR ? '' : (key.split('|')[1] ?? '');

    out.push({
      domain,
      canonical_factor: factor,
      polarity: dir,
      modality: strongest.modality as 'assert' | 'likely' | 'tend',
      sources,
      confidence: Math.round(strongest.confidence * 100) / 100,
      summary:
        isCrossSystem
          ? `多体系互验共识：${domain} 域「${factor || strongest.termId}」方向 ${dir === '+' ? '正向' : '负向'}（${sources.join('、')} 共同支持）`
          : `${sources[0] ?? '未知'} 体系在 ${domain} 域「${factor || strongest.termId}」给出 ${dir === '+' ? '正向' : '负向'}判断（${strongest.modality}，置信 ${strongest.confidence}）`,
    });
  }
  return out;
}

/**
 * 张力层：同域同时层内极性相反、且两侧模态 ≥ likely 的原子对；
 * 展示各自主张的体系、模态、置信度，不判定谁对谁错。
 */
function buildTension(atoms: ArbitratedAtom[]): TensionItem[] {
  const out: TensionItem[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a = atoms[i];
      const b = atoms[j];
      if (atomDomain(a) !== atomDomain(b)) continue;
      const dirA = atomPolarityDirection(a);
      const dirB = atomPolarityDirection(b);
      if (!((dirA === '+' && dirB === '-') || (dirA === '-' && dirB === '+'))) continue;
      // 至少一侧模态 ≥ likely 才构成可见张力（过低置信度视为噪声，不入张力层）
      if (modalityRank(a.modality) < modalityRank('likely') &&
          modalityRank(b.modality) < modalityRank('likely')) {
        continue;
      }
      const pairKey = [a.atomicId, b.atomicId].sort().join('|');
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      const sysA = atomSources(a)[0] ?? a.source ?? '未知';
      const sysB = atomSources(b)[0] ?? b.source ?? '未知';
      out.push({
        domain: atomDomain(a),
        perspectives: [
          {
            system: sysA,
            claim: `${a.canonical_factors?.[0] ?? a.termId}`,
            polarity: dirA === '+' ? '+' : '-',
            modality: a.modality,
            confidence: Math.round(a.confidence * 100) / 100,
          },
          {
            system: sysB,
            claim: `${b.canonical_factors?.[0] ?? b.termId}`,
            polarity: dirB === '+' ? '+' : '-',
            modality: b.modality,
            confidence: Math.round(b.confidence * 100) / 100,
          },
        ],
        explanation: `${sysA} 与 ${sysB} 在「${atomDomain(a)}」域给出相反判断，差异源于两套体系的输入来源与推演路径不同；此处仅并列呈现，不判定何者成立。`,
      });
    }
  }
  return out;
}

const CONDITION_LABEL: Record<string, string> = {
  long_term: '长期/大运流年视角',
  current: '近期/流月运势视角',
  event: '具体事项决策视角',
  general: '通用倾向视角',
};

/**
 * 条件层：对每个模态 ≥ likely 的原子（按 (time_scope, domain) 归并）生成
 * 非命令式条件句。格式遵循任务卡：
 * "如果满足 X 条件，则参考体系A的判断"。
 * 禁止命令式词汇（一定 / 必须 / 不要）。
 */
function buildCondition(atoms: ArbitratedAtom[]): ConditionItem[] {
  const groups = new Map<string, ArbitratedAtom>();
  for (const a of atoms) {
    if (modalityRank(a.modality) < modalityRank('likely')) continue;
    const key = [a.time_scope ?? 'general', atomDomain(a)].join('|');
    const existing = groups.get(key);
    // 同组保留置信度最高者（条件句以最强证据表述）
    if (!existing || a.confidence > existing.confidence) groups.set(key, a);
  }

  const out: ConditionItem[] = [];
  for (const a of groups.values()) {
    const dir = atomPolarityDirection(a);
    const label = CONDITION_LABEL[a.time_scope ?? 'general'] ?? '通用视角';
    const sys = atomSources(a)[0] ?? a.source ?? '相关';
    const domain = atomDomain(a);
    const factor = a.canonical_factors?.[0] ?? a.termId;
    const polarityText = dir === '+' ? '正向' : dir === '-' ? '负向' : '中性';
    out.push({
      domain,
      condition: `若关注${label}的「${domain}」问题`,
      recommendation: `可参考 ${sys} 对「${factor}」的${polarityText}判断（${a.modality}，置信 ${Math.round(a.confidence * 100) / 100}），与其余体系结论对照理解`,
      source_system: sys,
    });
  }
  return out;
}

/**
 * 三层仲裁主入口：输入已完成时间层分离的四层原子，输出共识/张力/条件三层。
 * 跨时间层不融合——各层内部独立仲裁，结果并列返回。
 */
export function arbitrate(timeLayer: TimeLayeredAtoms): ArbitrationResult {
  const all = [...timeLayer.long_term, ...timeLayer.current, ...timeLayer.event, ...timeLayer.general];
  const items = all as ArbitratedAtom[];
  // 每层内部按域分组仲裁：跨层不融合，跨层并列
  const layers = [timeLayer.long_term, timeLayer.current, timeLayer.event, timeLayer.general];
  const consensus: ConsensusItem[] = [];
  const tension: TensionItem[] = [];
  const condition: ConditionItem[] = [];
  for (const layer of layers) {
    consensus.push(...buildConsensus(layer as ArbitratedAtom[]));
    tension.push(...buildTension(layer as ArbitratedAtom[]));
  }
  condition.push(...buildCondition(items));
  return { consensus, tension, condition };
}
