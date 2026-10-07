/**
 * 免费层闸门纯函数判定（修复批次2 P0-2）
 *
 * 冻结口径：免费层 = 0 次 LLM 深度解读（规则骨架版，见 FREE_LAYER_DEEP_LLM_CALLS=0 / freeSkeleton.ts）；
 * AI 深度解读（report.deep）为订阅/单次权益，服务端由 consumeEntitlement 闸口判定。
 *
 * 本模块只做「tier → 门态」的纯函数映射，不触碰 localStorage、不写任何客户端 LLM 配额计数，
 * 便于 PremiumGate 与单测共用。
 */

export type PremiumTier = 'free' | 'premium' | 'unknown';
export type GateState = 'checking' | 'unlocked' | 'locked';

/** 免费层 LLM 深度解读配额（冻结真值：0）。与 types.FREE_LAYER_DEEP_LLM_CALLS 对齐。 */
export const FREE_TIER_LLM_QUOTA = 0;

/**
 * tier → 门态：
 * - unknown   → checking（正在向 /api/v1/subscription 判定档位）
 * - premium   → unlocked（订阅/单次权益放行）
 * - free/匿名 → locked（进入规则骨架版引导；不再有客户端每日 N 次 LLM 放行）
 */
export function freeTierGateState(tier: PremiumTier): GateState {
  if (tier === 'unknown') return 'checking';
  if (tier === 'premium') return 'unlocked';
  return 'locked';
}
