interface CostCheckResult {
  ok: boolean;
  reason?: string;
  estimatedCost?: number;
}

// P0 Static Token Budget Limits (aligned with PRODUCT_CATALOG productIds)
// 成本闸门：预估成本 > 售价×70% 时熔断降级（专家C 定价表 + 详细部署计划书 M1 门禁）
const PRODUCT_TOKEN_BUDGETS: Record<string, number> = {
  event_9_9: 2000, // ¥9.9 首单事件报告
  report_39_9: 4000, // ¥39.9 十维深度报告
  premium_88: 9000, // ¥88 精批旗舰版
  sub_monthly_19_9: 6000, // ¥19.9 月订阅报告
  sub_yearly_168: 6000, // ¥168 年订阅报告
};

export async function checkCostGate(_env: Env, productId: string): Promise<CostCheckResult> {
  const budget = PRODUCT_TOKEN_BUDGETS[productId];

  if (!budget) {
    return { ok: false, reason: `unknown_product_budget: ${productId}` };
  }

  // P0 Implementation: We rely on the system prompt length + expected output length
  // being within the budget. In P1, we will implement actual token counting via tiktoken
  // before sending to LLM, and stream-cutoff if output exceeds budget.
  // For P0, passing this gate means the product is recognized and allowed to proceed.

  return {
    ok: true,
    estimatedCost: budget * 0.00001, // Dummy estimation for logging
  };
}
