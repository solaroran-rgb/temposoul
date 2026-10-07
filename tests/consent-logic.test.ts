/**
 * 支付前强制勾选 + 第三方生辰双同意 逻辑测试（A9 P0⑤）
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPaymentConsent } from '../src/components/commerce/consentLogic';

test('未勾选支付免责 → 不可提交', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: false,
    enteringThirdParty: false,
    thirdPartyConsentAccepted: false,
  });
  assert.equal(r.canSubmit, false);
  assert.ok(r.blockers.includes('payment_disclaimer_not_accepted'));
});

test('已勾选支付免责、非第三方场景 → 可提交', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: true,
    enteringThirdParty: false,
    thirdPartyConsentAccepted: false,
  });
  assert.equal(r.canSubmit, true);
  assert.equal(r.blockers.length, 0);
});

test('第三方场景：未勾选双同意 → 不可提交', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: true,
    enteringThirdParty: true,
    thirdPartyConsentAccepted: false,
  });
  assert.equal(r.canSubmit, false);
  assert.ok(r.blockers.includes('third_party_consent_not_accepted'));
});

test('第三方场景：两项都勾选 → 可提交', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: true,
    enteringThirdParty: true,
    thirdPartyConsentAccepted: true,
  });
  assert.equal(r.canSubmit, true);
});

test('第三方场景：双同意勾了但支付免责没勾 → 仍不可提交（双阻断）', () => {
  const r = checkPaymentConsent({
    paymentDisclaimerAccepted: false,
    enteringThirdParty: true,
    thirdPartyConsentAccepted: true,
  });
  assert.equal(r.canSubmit, false);
  assert.ok(r.blockers.includes('payment_disclaimer_not_accepted'));
});
