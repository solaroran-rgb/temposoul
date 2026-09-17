/**
 * 冲突并列提示：不同口径结论同时呈现，不替用户取舍（契约 v3.2 §2.4）
 */
import React from 'react';
import type { ConflictItem } from '@temposoul/core/onomastics';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';

export interface ConflictNoticeProps {
  conflicts: ConflictItem[];
}

export function ConflictNotice({ conflicts }: ConflictNoticeProps): React.ReactElement | null {
  const { t } = useNameI18n();
  if (!conflicts.length) return null;
  return (
    <div className="name-conflict" role="note">
      <strong className="name-conflict__title">{t('conflict.title')}</strong>
      <ul className="name-conflict__list">
        {conflicts.map((c, i) => (
          <li key={i} className="name-conflict__item">
            <span className="name-conflict__dims">
              {c.a} ↔ {c.b}
            </span>
            <p className="name-conflict__desc">{c.note}</p>
          </li>
        ))}
      </ul>
      <p className="name-conflict__foot">{t('conflict.foot')}</p>
    </div>
  );
}

export default ConflictNotice;
