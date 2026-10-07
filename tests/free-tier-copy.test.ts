/**
 * 免费层口径统一测试（修复批次2 P0-2）
 * 冻结口径：免费层 = 0 次 LLM 深度解读（规则骨架版）；AI 深度解读 = 订阅/单次权益。
 * 断言：
 *  1) buildFreeSkeleton 产出 llmCalls=0；
 *  2) zh-CN 定价免费档文案不再宣称「免费 AI 深度解读」（保留 3 次免费排盘语义）；
 *  3) 闸门纯函数：free/匿名 → locked（不授予客户端 LLM 配额），FREE_TIER_LLM_QUOTA=0；
 *  4) PremiumGate 源码不再写 localStorage LLM 配额（ts_ai_quota / 扣减逻辑）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildFreeSkeleton } from '../src/lib/entitlement/freeSkeleton';
import { freeTierGateState, FREE_TIER_LLM_QUOTA } from '../src/lib/entitlement/freeTierGate';
import { zhCN } from '../src/i18n/locales/zh-CN';

test('freeSkeleton 固定 llmCalls=0（免费层 0 次 LLM）', () => {
  const s = buildFreeSkeleton({ mode: 'single', system: 'bazi', structureTags: ['十神'] });
  assert.equal(s.llmCalls, 0);
  assert.equal(s.unlockKey, 'report.deep');
  assert.equal(s.truncated, true);
});

test('zh-CN 定价免费档文案不含「免费 AI 深度解读」，且保留 3 次免费排盘语义', () => {
  const feature1 = zhCN.pricing.free.feature_1;
  assert.ok(
    !feature1.includes('免费 AI 深度解读'),
    `文案仍宣称免费 AI 深度解读: ${feature1}`,
  );
  assert.ok(feature1.includes('3 次免费'), `应保留 3 次免费排盘语义: ${feature1}`);
});

test('premium.quotaHint 改为规则骨架口径，不再宣称「今日剩余免费次数」', () => {
  const hint = zhCN.premium.quotaHint;
  assert.ok(!hint.includes('今日剩余免费次数'), `hint 仍宣称今日剩余免费次数: ${hint}`);
  assert.ok(hint.includes('规则骨架'), `hint 未体现规则骨架口径: ${hint}`);
});

test('闸门：free/匿名 → locked（不授予客户端 LLM 配额）；premium → unlocked', () => {
  assert.equal(freeTierGateState('free'), 'locked');
  assert.equal(freeTierGateState('unknown'), 'checking');
  assert.equal(freeTierGateState('premium'), 'unlocked');
});

test('免费层 LLM 配额冻结为 0', () => {
  assert.equal(FREE_TIER_LLM_QUOTA, 0);
});

test('PremiumGate 源码不再写 localStorage LLM 配额（免费路径不产生 LLM quota）', () => {
  const src = readFileSync(
    fileURLToPath(new URL('../src/components/PremiumGate.tsx', import.meta.url)),
    'utf8',
  );
  assert.ok(!src.includes('ts_ai_quota'), '仍存在 ts_ai_quota 客户端配额键');
  assert.ok(!src.includes('persistRemaining'), '仍存在 persistRemaining 写计数');
  assert.ok(!/remaining\s*-\s*1/.test(src), '仍存在 remaining-1 扣减');
});
