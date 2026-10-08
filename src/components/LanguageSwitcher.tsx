import { useEffect, useRef, useState } from 'react';
import { useI18n, type Locale } from '@/i18n';

/**
 * 语言切换器（AN-20261009-008 合并版）。
 * 所有宽度统一为「单一语言按钮」：显示当前语言 + 箭头，点击展开下拉列表，
 * 不再在宽屏下横向平铺全部语言选项，避免顶栏语言入口过长。
 * 点击组件外部自动收起。
 */
export function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 点击组件外部时收起下拉
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // 切换语言后收起下拉
  const handleSelect = (id: Locale) => {
    setLocale(id);
    setOpen(false);
  };

  const current = locales.find((l) => l.id === locale) ?? locales[0];

  return (
    <div className="lang-switcher lang-switcher--narrow" ref={rootRef}>
      <button
        type="button"
        className="lang-option is-active"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        {current.label}
        <span className="lang-caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="lang-dropdown" role="listbox" aria-label={t('lang.label')}>
          {locales.map((l) => (
            <button
              key={l.id}
              type="button"
              role="option"
              aria-selected={locale === l.id}
              className={`lang-dropdown-item${locale === l.id ? ' is-active' : ''}`}
              onClick={() => handleSelect(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
