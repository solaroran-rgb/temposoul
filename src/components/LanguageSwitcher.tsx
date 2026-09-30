import { useEffect, useState } from 'react';
import { useI18n, type Locale } from '@/i18n';

/**
 * 语言切换器。
 * 宽屏（>900px）：横向展开全部语言按钮。
 * 窄屏（<=900px）：折叠为「当前语言」胶囊，点击展开下拉列表，
 *   避免与中央导航（SiteNav）争抢宽度导致导航项被挤出视口。
 */
export function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();
  const [narrow, setNarrow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1280px)');
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // 切换语言后收起窄屏下拉
  const handleSelect = (id: Locale) => {
    setLocale(id);
    setOpen(false);
  };

  if (!narrow) {
    return (
      <div className="lang-switcher" role="group" aria-label={t('lang.label')}>
        {locales.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`lang-option${locale === l.id ? ' is-active' : ''}`}
            aria-pressed={locale === l.id}
            onClick={() => handleSelect(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  const current = locales.find((l) => l.id === locale) ?? locales[0];

  return (
    <div className="lang-switcher lang-switcher--narrow">
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
