/**
 * P0-3 PaymentConsent 双同意挂载门控测试（修复批次2 · 任务2）
 *
 * 覆盖：
 *  1) 门控逻辑：未勾选「娱乐参考+虚拟商品不退款」→ canSubmit=false；勾选后 → true。
 *  2) 提交闸门契约：PaymentConsent 组件的提交按钮 disabled={!canSubmit} 且
 *     onClick 仅在 canSubmit 时才调用 onSubmit —— 未勾选时真实 checkout（=onSubmit）不可能发出。
 *  3) 真实下单路径已挂载：PricingPage 三个付费档位 / PremiumGate 升级订阅，
 *     其 checkout 触发均经 PaymentConsent 的 onSubmit 回调；免费路径（¥0 当前方案 / unlocked 放行）不强制勾选。
 *  4) P2 顺手项：entitlement.ts 响应带 CORS 头、OPTIONS 预检 204（与 catch-all 同构）。
 *
 * 注：无真实支付凭证，Lemon Squeezy 托管页跳转/真实扣款不在此验证（见交付报告【待凭证】）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { checkPaymentConsent } from '../src/components/commerce/consentLogic';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
function readSrc(rel: string): string {
  return readFileSync(join(repoRoot, rel), 'utf8');
}

// ---------- 1) 门控逻辑 ----------

test('未勾选支付免责 → canSubmit=false 且带 blocker', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: false,
    enteringThirdParty: false,
    thirdPartyConsentAccepted: false,
  });
  assert.equal(r.canSubmit, false);
  assert.ok(r.blockers.includes('payment_disclaimer_not_accepted'));
});

test('勾选支付免责、非第三方场景 → canSubmit=true', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: true,
    enteringThirdParty: false,
    thirdPartyConsentAccepted: false,
  });
  assert.equal(r.canSubmit, true);
  assert.equal(r.blockers.length, 0);
});

// ---------- 2) 提交闸门契约：未勾选时 checkout 不发出 ----------

test('组件提交闸门：源码断言未勾选时 onSubmit（=真实 checkout）不可能被调用', () => {
  const src = readSrc('src/components/commerce/PaymentConsent.tsx');
  // 提交按钮在未勾选时 disabled，且 onClick 显式判 canSubmit 才调 onSubmit
  assert.match(src, /disabled=\{!canSubmit\}/, '提交按钮必须在未勾选时 disabled');
  assert.match(
    src,
    /onClick=\{\(\)\s*=>\s*canSubmit\s*&&\s*onSubmit\(\)\}/,
    'onClick 必须经 canSubmit 门控后才调用 onSubmit',
  );
});

test('模拟组件提交派发：未勾选不调 onSubmit，勾选后才调', () => {
  // 复刻 PaymentConsent 提交按钮的精确派发契约：() => canSubmit && onSubmit()
  const fire = (consent: Parameters<typeof checkPaymentConsent>[0], spy: () => void) => {
    const { canSubmit } = checkPaymentConsent(consent);
    // 与组件 onClick={() => canSubmit && onSubmit()} 等价
    if (canSubmit) spy();
  };

  let calls = 0;
  const spy = () => {
    calls += 1;
  };

  // 未勾选：真实 checkout 不得发出
  fire(
    { paymentDisclaimerAccepted: false, enteringThirdParty: false, thirdPartyConsentAccepted: false },
    spy,
  );
  assert.equal(calls, 0, '未勾选时 onSubmit/checkout 不得被调用');

  // 勾选后：才允许发出
  fire(
    { paymentDisclaimerAccepted: true, enteringThirdParty: false, thirdPartyConsentAccepted: false },
    spy,
  );
  assert.equal(calls, 1, '勾选后 onSubmit/checkout 应被调用一次');
});

// ---------- 3) 真实下单路径挂载 ----------

test('PricingPage：已挂载 PaymentConsent，付费按钮不再直连 checkout', () => {
  const src = readSrc('src/pages/platform/PricingPage.tsx');
  assert.match(src, /import\s*\{\s*PaymentConsent\s*\}\s*from\s*'[^']*commerce\/PaymentConsent'/, '必须 import PaymentConsent');
  // 三个付费卡片按钮改为先挂起待提交商品（门控面板），不再直接发 checkout
  assert.doesNotMatch(
    src,
    /onClick=\{\(\)\s*=>\s*startCheckout\(/,
    '付费卡片按钮不得再直接调用 startCheckout（须先过同意门控）',
  );
  // 真正的 checkout 触发收束在 PaymentConsent 的 onSubmit 回调里
  assert.match(
    src,
    /onSubmit=\{\(\)\s*=>\s*startCheckout\(pendingProduct\.id/,
    '真实 checkout 必须由 PaymentConsent 的 onSubmit 门控触发',
  );
});

test('PricingPage：免费档（¥0 当前方案）不进入同意流程、不触发 checkout', () => {
  const src = readSrc('src/pages/platform/PricingPage.tsx');
  // 免费卡片按钮保持 disabled「当前方案」
  const freeCardBlock = src.slice(
    src.indexOf('pricing-card--free'),
    src.indexOf('pricing-card--single', src.indexOf('pricing-card--free')),
  );
  assert.ok(freeCardBlock.includes('当前方案'), '免费档应展示「当前方案」');
  assert.ok(!freeCardBlock.includes('startCheckout'), '免费档不得触发 checkout');
  assert.ok(!freeCardBlock.includes('PaymentConsent'), '免费档不强制勾选同意');
});

test('PremiumGate：locked 升级订阅经 PaymentConsent 门控，unlocked 放行不强制勾选', () => {
  const src = readSrc('src/components/PremiumGate.tsx');
  assert.match(src, /import\s*\{\s*PaymentConsent\s*\}\s*from\s*'\.\/commerce\/PaymentConsent'/, '必须 import PaymentConsent');
  assert.match(src, /<PaymentConsent[\s\S]*?onSubmit=\{startCheckout\}/, '真实订阅 checkout 必须接到 PaymentConsent 的 onSubmit');
  // unlocked 分支仍直接渲染 children（免费额度内/已订阅用户不被拦去勾选）
  assert.match(src, /if\s*\(state === 'unlocked'\)\s*\{\s*return\s*<>\{children\}<\/>/, 'unlocked 路径应直接放行 children，不经门控');
});

// ---------- 4) P2：entitlement.ts CORS ----------

test('entitlement.ts：OPTIONS 预检返回 204 且带 CORS 头', async () => {
  const mod = await import('../functions/api/v1/entitlement');
  assert.equal(typeof mod.onRequestOptions, 'function', '必须导出 onRequestOptions 预检处理');
  const res = await mod.onRequestOptions({
    request: new Request('https://x/api/v1/entitlement', { method: 'OPTIONS' }),
    env: {},
  } as never);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(res.headers.get('Access-Control-Allow-Methods'), 'GET,POST,OPTIONS');
  assert.ok(res.headers.get('Access-Control-Allow-Headers')?.includes('Authorization'));
});

test('entitlement.ts：普通响应（未授权 401）也带 CORS 头', async () => {
  const mod = await import('../functions/api/v1/entitlement');
  const res = await mod.onRequestGet({
    request: new Request('https://x/api/v1/entitlement', { method: 'GET' }),
    env: {},
  } as never);
  assert.equal(res.status, 401);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
});
