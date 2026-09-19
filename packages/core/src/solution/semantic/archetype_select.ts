/**
 * 命律 · 原型选择规则（R3-12 · 任务3）
 *
 * 三级规则（共识 v2.0 · 系统5 双轨原型系统）：
 *   规则1 状态轴：旺衰 × 用忌 → 主原型 / 失衡态原型（primary / shadow）
 *   规则2 轨道轴：用户 NFC 水平 → 东方文化轨 / 动力学轨
 *   规则3 意象轴：domains_of_interest → 意象域过滤（过滤后为空则放宽并留痕）
 *
 * 设计要点：
 * - 返回结果全部可审计（trace.matched_rules 逐条记录命中规则）；
 * - 未知十神不抛错，走兜底原型并置 fallback = true；
 * - 命中禁忌语境（如 grief / health_crisis）→ redline = true，禁止意象化叙事，
 *   由 R3-13 散文诗生成器转为「需注意、可借力」降级分支。
 */
import {
  ARCHETYPE_MAPPINGS,
  getArchetypeMapping,
  normalizeShishenId,
  type ArchetypeMapping,
  type LifecycleEvolution,
} from './archetypes';
import { ARCHETYPE_DOMAINS, type ArchetypeDomain, type ForbiddenContext } from './archetype_types';
import { listImagery, type ImageryEntry } from './imagery';

// ============================================================
// 1. 输入 / 输出契约
// ============================================================

/** 旺衰 */
export type Strength = 'strong' | 'weak';
/** 用忌 */
export type UseType = 'yong' | 'ji';
/** 轨道 */
export type ArchetypeTrackKey = 'eastern' | 'dynamic';
/** 原型状态（用忌决定） */
export type ArchetypeState = 'primary' | 'shadow';
/** 显化程度（旺衰决定） */
export type ArchetypeActivation = 'active' | 'latent';

/** 选择器用户画像（D-3：只影响展示层，不进置信度 / 极性 / 规则） */
export interface ArchetypeSelectorProfile {
  /** NFC 水平：high = 传统偏好（东方轨），low = 现代偏好（动力学轨） */
  nfc_level?: 'high' | 'low';
  /** 关注领域 */
  domains_of_interest?: ArchetypeDomain[];
  /** 当前语境（红线过滤输入） */
  context?: ForbiddenContext | string;
}

/** 选择结果 */
export interface ArchetypeResult {
  shishen_id: string;
  shishen_name: string;
  track: ArchetypeTrackKey;
  state: ArchetypeState;
  activation: ArchetypeActivation;
  /** 原型名 */
  name: string;
  /** 原型描述（latent 时附未显化提示） */
  description: string;
  /** 原型适用领域（已按 domains_of_interest 收窄） */
  suitable_domains: ArchetypeDomain[];
  /** 核心意象域（正向） */
  safe_imagery: string[];
  /** 反意象（警示） */
  caution_imagery: string[];
  /** 精选意象（含身体目标感受，已按领域 / 语境过滤） */
  imagery: ImageryEntry[];
  /** 禁忌语境 */
  forbidden_contexts: ForbiddenContext[];
  /** 生命周期演化 */
  lifecycle_evolution: LifecycleEvolution;
  /** 是否命中禁忌语境（true = 禁止意象化叙事，走降级分支） */
  redline: boolean;
  /** 未知十神兜底标记 */
  fallback: boolean;
  /** 决策留痕 */
  trace: {
    input: {
      shishen_id: string;
      strength: Strength;
      useType: UseType;
      nfc_level: 'high' | 'low' | 'unset';
      domains_of_interest: ArchetypeDomain[];
      context: string | null;
    };
    matched_rules: string[];
  };
}

// ============================================================
// 2. 常量
// ============================================================

/** 无画像时默认轨道：东方轨（共识「最稳定的默认」） */
export const DEFAULT_TRACK: ArchetypeTrackKey = 'eastern';

/** NFC → 轨道映射 */
const NFC_TO_TRACK: Record<'high' | 'low', ArchetypeTrackKey> = {
  high: 'eastern',
  low: 'dynamic',
};

/** 休眠态（衰）附加提示：原型存在但未显化 */
const LATENT_HINT = '目前尚未显化，需要条件触发才会成形';

/** 兜底原型（未知十神） */
const FALLBACK_TRACKS: Record<ArchetypeTrackKey, { name: string; description: string }> = {
  eastern: { name: '行者', description: '尚未定型的能量：路在脚下，按当下选择显化' },
  dynamic: { name: '行进者', description: '尚未定型的动能：变量仍在，结果由选择书写' },
};

// ============================================================
// 3. 主函数
// ============================================================

/**
 * 原型选择
 * @param shishenId 十神 ID，接受 'QS' / 'qi_sha' / '七杀'
 * @param strength 旺衰
 * @param useType 用忌
 * @param userProfile 用户画像（NFC / 关注领域 / 语境）
 */
export function selectArchetype(
  shishenId: string,
  strength: Strength,
  useType: UseType,
  userProfile: ArchetypeSelectorProfile = {},
): ArchetypeResult {
  const matched: string[] = [];
  const nfc = userProfile.nfc_level;
  const context = userProfile.context ?? null;
  const requestedDomains = sanitizeDomains(userProfile.domains_of_interest);

  // ── 规则2：NFC → 轨道 ──
  const track: ArchetypeTrackKey = nfc ? NFC_TO_TRACK[nfc] : DEFAULT_TRACK;
  matched.push(nfc ? `R2_track_by_nfc:${nfc}→${track}` : `R2_track_default:${track}`);

  const mapping = getArchetypeMapping(shishenId);

  // ── 兜底：未知十神 ──
  if (!mapping) {
    const fb = FALLBACK_TRACKS[track];
    return {
      shishen_id: shishenId,
      shishen_name: '未知十神',
      track,
      state: useType === 'yong' ? 'primary' : 'shadow',
      activation: strength === 'strong' ? 'active' : 'latent',
      name: fb.name,
      description: fb.description,
      suitable_domains: requestedDomains.length > 0 ? requestedDomains : [...ARCHETYPE_DOMAINS],
      safe_imagery: [],
      caution_imagery: [],
      imagery: [],
      forbidden_contexts: [],
      lifecycle_evolution: { dayun_shift: 'unknown', liunian_shift: ['观察', '观察', '观察'] },
      redline: false,
      fallback: true,
      trace: {
        input: {
          shishen_id: shishenId,
          strength,
          useType,
          nfc_level: nfc ?? 'unset',
          domains_of_interest: requestedDomains,
          context,
        },
        matched_rules: [...matched, `FALLBACK:unresolved_shishen_id:${shishenId}`],
      },
    };
  }

  // ── 规则1：旺衰 × 用忌 → 状态 + 显化程度 ──
  const state: ArchetypeState = useType === 'yong' ? 'primary' : 'shadow';
  const activation: ArchetypeActivation = strength === 'strong' ? 'active' : 'latent';
  matched.push(`R1_state:${strength}×${useType}→${state}/${activation}`);

  const t = track === 'eastern' ? mapping.eastern_archetype : mapping.dynamic_archetype;
  const useShadow = state === 'shadow';
  const baseName = useShadow ? t.shadow_name : t.name;
  const baseDesc = useShadow ? t.shadow_description : t.description;
  const baseDomains = useShadow ? t.shadow_domains : t.suitable_domains;
  if (useShadow) matched.push('R1_variant:shadow');

  // ── 规则3：领域过滤 ──
  let domains = requestedDomains.length
    ? baseDomains.filter((d) => requestedDomains.includes(d))
    : baseDomains;

  const domainOverlapVoid = requestedDomains.length > 0 && domains.length === 0;
  if (domainOverlapVoid) {
    domains = baseDomains;
    matched.push(`R3_domain_filter_relaxed:no_overlap_with:${requestedDomains.join('|')}`);
  } else if (requestedDomains.length > 0) {
    matched.push(`R3_domain_filter:${domains.join('|')}`);
  }

  // ── 意象取象（规则3 作用于意象层，同时做禁忌语境过滤） ──
  let imagery = listImagery(mapping.shishen_id, {
    domains: requestedDomains.length > 0 ? requestedDomains : undefined,
    context: context ?? undefined,
  });

  if (imagery.length === 0) {
    imagery = listImagery(mapping.shishen_id, { context: context ?? undefined });
    if (imagery.length > 0) matched.push('R3_imagery_relaxed:domain_no_match');
  }
  matched.push(`R3_imagery_selected:${imagery.length}`);

  // ── 红线：禁忌语境 ──
  const redline =
    context !== null && mapping.forbidden_contexts.includes(context as ForbiddenContext);
  if (redline) matched.push(`REDLINE:forbidden_context:${context}`);

  return {
    shishen_id: mapping.shishen_id,
    shishen_name: mapping.shishen_name,
    track,
    state,
    activation,
    name: baseName,
    description: activation === 'latent' ? `${baseDesc}（${LATENT_HINT}）` : baseDesc,
    suitable_domains: domains,
    safe_imagery: mapping.safe_imagery,
    caution_imagery: mapping.caution_imagery,
    imagery,
    forbidden_contexts: mapping.forbidden_contexts,
    lifecycle_evolution: mapping.lifecycle_evolution,
    redline,
    fallback: false,
    trace: {
      input: {
        shishen_id: normalizeShishenId(shishenId) ?? shishenId,
        strength,
        useType,
        nfc_level: nfc ?? 'unset',
        domains_of_interest: requestedDomains,
        context,
      },
      matched_rules: matched,
    },
  };
}

// ============================================================
// 4. 批量与工具
// ============================================================

/** 批量选择（按映射表顺序，输入命中的十神列表） */
export function selectArchetypes(
  inputs: Array<{ shishenId: string; strength: Strength; useType: UseType }>,
  userProfile: ArchetypeSelectorProfile = {},
): ArchetypeResult[] {
  return inputs.map((i) => selectArchetype(i.shishenId, i.strength, i.useType, userProfile));
}

/** 列出全部十神的双轨原型（供前端原型库页面 / 自检用） */
export function listAllArchetypes(): ArchetypeMapping[] {
  return ARCHETYPE_MAPPINGS;
}

/** 领域入参清洗：丢弃非受控领域名 */
function sanitizeDomains(domains?: ArchetypeDomain[]): ArchetypeDomain[] {
  if (!domains?.length) return [];
  return domains.filter((d) => (ARCHETYPE_DOMAINS as readonly string[]).includes(d));
}
