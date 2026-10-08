// src/lib/growth/ai-credits.ts
// S-6b B2 邀请制冷启动片 · AI 解读额度记账（规格 §2.2 冻结签名）。
//
// 设计：
//   - 纯前端 MVP：余额存 localStorage `growth:aiCredits`（整数，>=0）；
//   - 损坏 / 非整数 / 负数 → 0 兜底；
//   - 激励来源：邀请结算（双方各 +1，见 invite.ts）等成长事件；
//   - 无现金 / 无代币措辞；额度有日上限（由调用方控制日发放节奏，本模块只管余额）。
//   - resetAiCredits 仅用于测试与本地排障，不在产品路径调用。

const STORAGE_KEY = 'growth:aiCredits';

/** 读取余额；缺失 / 损坏 / 非有限数 / 负数一律兜底为 0。 */
function readBalance(): number {
  try {
    if (typeof localStorage === 'undefined') return 0;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
  } catch {
    return 0;
  }
}

function writeBalance(n: number): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(n))));
  } catch {
    /* localStorage 不可用（隐私模式等）时静默降级 */
  }
}

/** 当前 AI 解读额度余额（>=0）。 */
export function getAiCredits(): number {
  return readBalance();
}

/**
 * 发放 n 次额度（n 必须为正整数，否则按 0 处理）。
 * 返回发放后的新余额。
 */
export function grantAiCredits(n: number): number {
  const delta = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  const next = readBalance() + delta;
  writeBalance(next);
  return next;
}

/**
 * 消费 1 次额度：余额 >0 扣 1 并返回 true；余额为 0 返回 false（不扣成负数）。
 */
export function consumeAiCredit(): boolean {
  const cur = readBalance();
  if (cur <= 0) return false;
  writeBalance(cur - 1);
  return true;
}

/** 重置余额为 0（仅测试 / 排障用）。 */
export function resetAiCredits(): void {
  writeBalance(0);
}
