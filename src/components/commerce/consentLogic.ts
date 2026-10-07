/**
 * 支付前强制勾选 + 第三方生辰双同意（A9 P14 / P0⑤）
 *
 * 纯逻辑层（React 组件与单测共用）：
 *  - 支付前强制勾选：「本人已知晓本报告仅供娱乐参考，虚拟数字商品一经生成不支持退款」
 *    未勾选不可提交（门控）。
 *  - 第三方生辰双同意：合婚/送礼录入他人生辰前，必须勾选「本人确认已获对方同意」
 *    + 隐私说明，并提供对方数据删除入口。
 *  - 不出具「关系判定」式断言（文案约束）。
 *
 * i18n：当前文案内联中文；标注需 i18n 接入处见组件注释（波 2 接 7 语种 locale）。
 */

export interface ConsentState {
  /** 是否已勾选「娱乐参考 + 虚拟商品不退款」 */
  paymentDisclaimerAccepted: boolean;
  /** 是否进入第三方生辰录入场景（合婚/送礼） */
  enteringThirdParty: boolean;
  /** 第三方场景：是否勾选「已获对方同意 + 隐私说明」 */
  thirdPartyConsentAccepted: boolean;
}

export interface ConsentCheckResult {
  canSubmit: boolean;
  /** 未通过的原因（可直接用于提示/埋点） */
  blockers: string[];
}

/**
 * 门控判定：是否允许提交支付。
 * 规则：
 *  1) paymentDisclaimerAccepted 必须为 true（一票否决）
 *  2) 若 enteringThirdParty=true，则 thirdPartyConsentAccepted 必须为 true
 */
export function checkPaymentConsent(state: ConsentState): ConsentCheckResult {
  const blockers: string[] = [];
  if (!state.paymentDisclaimerAccepted) {
    blockers.push('payment_disclaimer_not_accepted');
  }
  if (state.enteringThirdParty && !state.thirdPartyConsentAccepted) {
    blockers.push('third_party_consent_not_accepted');
  }
  return { canSubmit: blockers.length === 0, blockers };
}

/** 第三方数据删除入口文案（组件渲染「删除对方数据」按钮时使用） */
export const THIRD_PARTY_DELETE_LABEL = '删除我录入的对方生辰数据';

/** 第三方同意勾选文案 */
export const THIRD_PARTY_CONSENT_LABEL =
  '本人确认已获得对方同意录入其生辰信息，并知悉该数据仅用于本次报告、可随时删除';

/** 支付前强制勾选文案 */
export const PAYMENT_DISCLAIMER_LABEL =
  '本人已知晓本报告仅供娱乐参考，虚拟数字商品一经生成不支持退款';

/** 自动续费披露（FTC + 国内消保：周期/价格/下次扣款日/取消方式；缺失一票否决） */
export const AUTO_RENEWAL_DISCLOSURE = {
  cycle: '月付/年付自动续费',
  priceNote: '价格以结算页为准',
  nextCharge: '下次自动扣款日 = 当前周期到期日',
  cancelHow: '取消路径 ≤2 次点击，期末生效、不即时断供',
};
