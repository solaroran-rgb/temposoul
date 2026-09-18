/**
 * 命律 · 消歧三件套
 *
 * D-1 裁决：规则树硬消歧 + 评分卡软排序 + 决策表组合条件
 */
import type { TermSchema, SemanticFactor, ComboCondition } from './types';
import { dempsterCombine, strongEvidence, mediumEvidence, weakEvidence, type DsMass } from './confidence';

// ============================================================
// 1. 规则树硬消歧
// ============================================================

/**
 * 规则树：结构可能性唯一则短路
 * 如果只有一个因子能命中，直接返回该因子
 */
export function ruleTreeDisambiguate(
  candidates: SemanticFactor[],
  context: Record<string, unknown>
): SemanticFactor | null {
  const hits = candidates.filter((f) => evaluateTrigger(f.trigger, context));
  if (hits.length === 1) return hits[0];
  return null; // 多义项，走评分卡
}

// ============================================================
// 2. 评分卡软排序
// ============================================================

/**
 * 评分卡：totalScore = 0.5×因子分 + 0.3×组合条件分 + 0.2×流派分
 * 权重不含画像（D-3）
 */
export function scoreFactors(
  candidates: SemanticFactor[],
  context: Record<string, unknown>,
  school: 'ziping' | 'mangpai' | 'xinpai' = 'ziping'
): { factor: SemanticFactor; score: number }[] {
  return candidates
    .map((factor) => {
      const factorScore = evaluateTrigger(factor.trigger, context) ? 1 : 0;
      const comboScore = 0.5; // 简化：实际由组合条件评估
      const schoolScore = factor.schools[school];
      const totalScore = 0.5 * factorScore + 0.3 * comboScore + 0.2 * schoolScore;
      return { factor, score: totalScore };
    })
    .sort((a, b) => b.score - a.score);
}

// ============================================================
// 3. 决策表组合条件
// ============================================================

/**
 * 决策表：评估组合条件，按优先级排序，处理互斥
 */
export function evaluateCombos(
  combos: ComboCondition[],
  context: Record<string, unknown>
): ComboCondition[] {
  const hits = combos.filter((c) => evaluateTrigger(c.trigger, context));
  // 按优先级排序
  hits.sort((a, b) => a.priority - b.priority);
  // 处理互斥
  const selected: ComboCondition[] = [];
  for (const combo of hits) {
    if (selected.every((s) => !s.mutex.includes(combo.id) && !combo.mutex.includes(s.id))) {
      selected.push(combo);
    }
  }
  return selected;
}

// ============================================================
// 4. 触发器评估
// ============================================================

/**
 * 评估触发条件
 * 支持：And / Or / Not / has / in_pillar / contains / equals
 */
export function evaluateTrigger(
  trigger: { op: string; args: string[] }[],
  context: Record<string, unknown>
): boolean {
  // 简化实现：第一个条件为 And，全部满足
  // 实际实现应为递归解析器
  return trigger.every((cond) => evalOp(cond.op, cond.args, context));
}

function evalOp(op: string, args: string[], context: Record<string, unknown>): boolean {
  const [path, value] = args;

  switch (op) {
    case 'has': {
      // has(field, value)
      // 语义：field 的值中是否包含 value（对 Record<string,string> 检查 values）
      const field = getNested(context, path);
      if (typeof field === 'string') return field === value;
      if (Array.isArray(field)) {
        if (field.includes(value)) return true;
        // 对象数组（stemRelations / classicPatterns / patternCombos 等）：
        // includes 在对象上恒不成立，故投影元素字符串值后匹配（相等或子串，
        // 因 pattern 形如「青龙返首：戊为青龙天乙…」）
        return field.some((item) => {
          if (!item || typeof item !== 'object') return false;
          return Object.values(item as Record<string, unknown>).some(
            (v) => typeof v === 'string' && (v === value || v.includes(value)),
          );
        });
      }
      if (typeof field === 'object' && field !== null) {
        // 对 Record<string, string>（如 tenGods）：检查 values 是否包含 value
        return Object.values(field).includes(value);
      }
      return false;
    }
    case 'in_pillar': {
      // in_pillar(pillar, tenGod)
      // 语义：某柱（year/month/day/hour）的十神是否等于 tenGod
      const pillar = path; // year/month/day/hour
      const tenGod = value;
      const tenGods = context.tenGods as Record<string, string>;
      return tenGods?.[pillar] === tenGod;
    }
    case 'in_luck': {
      // in_luck(field, value)
      // 语义：大运/流年中是否包含 value
      // field = luckInfo.cycles 或 liunian
      const cycles = getNested(context, path) as Array<{ tenGod?: string; ganZhi?: string }> | undefined;
      if (!Array.isArray(cycles)) return false;
      return cycles.some((c) => c.tenGod === value || c.ganZhi?.includes(value));
    }
    case 'contains': {
      // contains(field, value)
      const field = getNested(context, path);
      if (Array.isArray(field)) return field.includes(value);
      if (typeof field === 'string') return field.includes(value);
      return false;
    }
    case 'equals': {
      const field = getNested(context, path);
      return field === value;
    }
    case 'Not': {
      return !evalOp(args[0], args.slice(1), context);
    }
    default:
      return false;
  }
}

/** 安全读取嵌套字段 */
function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ============================================================
// 5. 消歧主流程
// ============================================================

/**
 * 完整消歧流程：
 * 1. 规则树硬消歧 → 唯一则短路
 * 2. 评分卡软排序 → 取 top N
 * 3. 决策表组合条件 → 按优先级+互斥
 */
export function disambiguate(
  term: TermSchema,
  context: Record<string, unknown>,
  topN: number = 3
): { factors: SemanticFactor[]; combos: ComboCondition[]; confidence: DsMass } {
  // 1. 规则树
  const ruleHit = ruleTreeDisambiguate(term.factors, context);
  if (ruleHit) {
    return {
      factors: [ruleHit],
      combos: evaluateCombos(term.combos, context),
      confidence: strongEvidence(),
    };
  }

  // 2. 评分卡
  const scored = scoreFactors(term.factors, context);
  const topFactors = scored.slice(0, topN).map((s) => s.factor);

  // 3. 组合条件
  const combos = evaluateCombos(term.combos, context);

  // 4. 置信度
  const masses: DsMass[] = [];
  for (const f of topFactors) {
    if (evaluateTrigger(f.trigger, context)) {
      masses.push(mediumEvidence());
    }
  }
  const confidence = masses.length > 0 ? combine(masses) : weakEvidence();

  return { factors: topFactors, combos, confidence };
}

function combine(masses: DsMass[]): DsMass {
  return masses.reduce((acc, m) => dempsterCombine(acc, m), {
    support: 0,
    oppose: 0,
    uncertain: 1,
  });
}
