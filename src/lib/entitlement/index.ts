/**
 * Entitlement 权益层统一出口
 * 五条业务线（单次报告 / 订阅 / StarMark / 合婚送礼 / 咨询）共用此 API，禁止各线自造权限判断。
 */
export * from './types';
export {
  evaluateAccess,
  consumeEntitlement,
  summarizeEntitlements,
  isGrantValid,
  effectiveRemaining,
  aggregateRemaining,
} from './gate';
export { grantEntitlement, readBag, writeBag, grantsFor, type EntitlementKv } from './store';
export { buildFreeSkeleton, shouldUseFreeSkeleton, type FreeSkeleton, type FreeChartInput } from './freeSkeleton';
export { decideDeepInterpretation, type DeepGateDecision, type DeepGateInput } from './wiring';
export { freeTierGateState, FREE_TIER_LLM_QUOTA, type PremiumTier, type GateState } from './freeTierGate';
