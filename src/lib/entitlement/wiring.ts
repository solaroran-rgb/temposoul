/**
 * LLM 调用点接线（修复批次2 P1-②）
 *
 * 在放行上游 LLM（report.deep 深度解读）之前做「权益校验 + 配额扣减」：
 *   - 有权益 → allowed:true（consumeEntitlement 已完成扣减/窗口判定），调用方放行 LLM；
 *   - 无权益 / 配额耗尽 / 过期 / 匿名 → allowed:false，调用方必须降级 buildFreeSkeleton（0 次 LLM），
 *     不得静默空白、不得回退 LLM。
 *
 * 向后兼容：当 KV 未绑定（本地开发 / 单测未注入 KV）时，返回 allowed:true(deducted:false)，
 * 保持既有行为不变，避免误伤无 KV 的环境。生产环境 CF Pages 绑定 AUTH_KV 后闸口自动生效。
 */
import { consumeEntitlement } from './gate';
import { buildFreeSkeleton, type FreeChartInput, type FreeSkeleton } from './freeSkeleton';
import type { AccessCheck } from './types';
import type { EntitlementKv } from './store';

export type DeepGateDecision =
  | {
      allowed: true;
      /** 扣减后剩余次数（KV 未绑定时为 Infinity，表示未受配额约束） */
      remainingCount: number;
      source: string;
      /** 是否真正对 KV 执行了扣减（KV 未绑定时为 false） */
      deducted: boolean;
    }
  | { allowed: false; reason: AccessCheck['reason']; skeleton: FreeSkeleton };

export interface DeepGateInput {
  /** 权益 KV（AUTH_KV）；未传/为 null 时按「未绑定」放行，保持向后兼容。 */
  kv?: EntitlementKv | null;
  /** 已解析的用户身份 sub；匿名/未登录传 null/''。 */
  userId?: string | null;
  /** 排盘结构（用于生成规则骨架）；缺省给一个通用骨架。 */
  chart?: FreeChartInput;
}

const DEFAULT_CHART: FreeChartInput = {
  mode: 'single',
  system: '排盘解读',
  structureTags: [],
};

export async function decideDeepInterpretation(input: DeepGateInput): Promise<DeepGateDecision> {
  // KV 未绑定：保持既有行为（不误伤本地/测试）。
  if (!input.kv) {
    return { allowed: true, remainingCount: Number.POSITIVE_INFINITY, source: 'unbound', deducted: false };
  }

  const result = await consumeEntitlement(input.kv, input.userId ?? '', 'report.deep');
  if (result.allowed) {
    return {
      allowed: true,
      remainingCount: result.remainingCount,
      source: result.source,
      deducted: true,
    };
  }

  const skeleton = buildFreeSkeleton(input.chart ?? DEFAULT_CHART);
  // -b 构建模式下 allowed 字面量判别收窄偶发失效，用 in 运算符显式收窄拒绝变体
  if ('reason' in result) {
    return { allowed: false, reason: result.reason, skeleton };
  }
  return { allowed: false, reason: 'no_entitlement', skeleton };
}
