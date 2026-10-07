/**
 * PaymentConsent 组件（A9 P0⑤）
 *
 * 渲染：
 *  1) 支付前强制勾选框（娱乐参考 + 虚拟商品不退款）——未勾选禁用提交
 *  2) 自动续费披露（周期/价格/下次扣款日/取消方式）
 *  3) 第三方生辰双同意（合婚/送礼场景）+ 对方数据删除入口
 *
 * 模块隔离：本组件为自含 UI，不注册共享路由表；由价格墙/结算页在波 2 挂载。
 * i18n：文案暂为内联中文（标注 `// TODO(i18n): 接入 7 语种 locale`）。
 */
import { useState } from 'react';
import {
  checkPaymentConsent,
  PAYMENT_DISCLAIMER_LABEL,
  THIRD_PARTY_CONSENT_LABEL,
  THIRD_PARTY_DELETE_LABEL,
  AUTO_RENEWAL_DISCLOSURE,
  type ConsentState,
} from './consentLogic';

export interface PaymentConsentProps {
  /** 是否处于第三方生辰录入场景（合婚/送礼） */
  enteringThirdParty?: boolean;
  /** 用户点击提交（此时已通过门控） */
  onSubmit: () => void;
  /** 用户点击「删除对方数据」 */
  onDeleteThirdPartyData?: () => void;
  /** 提交按钮文案 */
  submitLabel?: string;
}

export function PaymentConsent({
  enteringThirdParty = false,
  onSubmit,
  onDeleteThirdPartyData,
  submitLabel = '确认并支付',
}: PaymentConsentProps) {
  const [state, setState] = useState<ConsentState>({
    paymentDisclaimerAccepted: false,
    enteringThirdParty,
    thirdPartyConsentAccepted: false,
  });

  const { canSubmit, blockers } = checkPaymentConsent({ ...state, enteringThirdParty });

  return (
    <div className="payment-consent" data-testid="payment-consent">
      {/* 自动续费披露（FTC/消保：缺失一票否决） */}
      <div className="payment-consent__disclosure" role="note">
        <strong>自动续费说明：</strong>
        {AUTO_RENEWAL_DISCLOSURE.cycle}｜{AUTO_RENEWAL_DISCLOSURE.priceNote}｜
        {AUTO_RENEWAL_DISCLOSURE.nextCharge}｜{AUTO_RENEWAL_DISCLOSURE.cancelHow}
      </div>

      {/* 支付前强制勾选 */}
      <label className="payment-consent__check" style={{ display: 'block', margin: '8px 0' }}>
        <input
          type="checkbox"
          checked={state.paymentDisclaimerAccepted}
          onChange={(e) =>
            setState((s) => ({ ...s, paymentDisclaimerAccepted: e.target.checked }))
          }
          data-testid="consent-disclaimer"
        />
        <span>{PAYMENT_DISCLAIMER_LABEL}</span>
      </label>

      {/* 第三方生辰双同意（合婚/送礼场景） */}
      {enteringThirdParty && (
        <div className="payment-consent__thirdparty">
          <label style={{ display: 'block', margin: '8px 0' }}>
            <input
              type="checkbox"
              checked={state.thirdPartyConsentAccepted}
              onChange={(e) =>
                setState((s) => ({ ...s, thirdPartyConsentAccepted: e.target.checked }))
              }
              data-testid="consent-thirdparty"
            />
            <span>{THIRD_PARTY_CONSENT_LABEL}</span>
          </label>
          <button
            type="button"
            className="payment-consent__delete"
            onClick={onDeleteThirdPartyData}
            data-testid="consent-delete"
          >
            {THIRD_PARTY_DELETE_LABEL}
          </button>
          <p style={{ fontSize: 12, opacity: 0.7 }}>
            本产品仅提供文化参考，不出具「两人关系是否合适/注定」式判定。
          </p>
        </div>
      )}

      <button
        type="button"
        className="payment-consent__submit"
        disabled={!canSubmit}
        onClick={() => canSubmit && onSubmit()}
        data-testid="consent-submit"
      >
        {submitLabel}
      </button>

      {blockers.length > 0 && (
        <p className="payment-consent__blockers" data-testid="consent-blockers" style={{ color: '#b00' }}>
          请先完成必要勾选（{blockers.join(', ')}）
        </p>
      )}
    </div>
  );
}

export default PaymentConsent;
