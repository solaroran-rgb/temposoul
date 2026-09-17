/**
 * 断言治理条（契约 v3.2 决策 16：统一词表由本地侧维护，A/B/C/D 共同引用）
 * 页面级常驻：禁止吉凶总分 / 成功率 / 必然事件断言；民俗内容必须带限定。
 */
import React from 'react';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';
import { guardText, STRONG_ASSERTIONS } from '../../../lib/assertions-guard';

/** 统一词表单一来源（契约决策 16）；组件内仅做再导出，便于本地侧替换一份词表全站生效 */
export { guardText, STRONG_ASSERTIONS as FORBIDDEN_ASSERTIONS };

export function AssertionGuardBar(): React.ReactElement {
  const { t } = useNameI18n();
  return (
    <div className="name-guard-bar" role="note" aria-label={t('guard.title')}>
      <span className="name-guard-bar__icon" aria-hidden="true">
        ⓘ
      </span>
      <div className="name-guard-bar__body">
        <strong className="name-guard-bar__title">{t('guard.title')}</strong>
        <p className="name-guard-bar__text">{t('guard.text')}</p>
      </div>
    </div>
  );
}

export default AssertionGuardBar;
