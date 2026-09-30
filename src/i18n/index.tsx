import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { safeStorage } from '@/lib/safe-storage';
import { zhCN, type Dict } from './locales/zh-CN';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { koKN } from './locales/ko-KN';
import { viVN } from './locales/vi-VN';
import { thTH } from './locales/th-TH';
import { esES } from './locales/es-ES';
import { UI_OVERLAYS } from './body/ui-overlays';

export type Locale = 'zh-CN' | 'en' | 'ja' | 'ko-KN' | 'vi-VN' | 'th-TH' | 'es-ES';
const RAW_DICTS: Record<Locale, Dict> = {
  'zh-CN': zhCN,
  en,
  ja,
  'ko-KN': koKN,
  'vi-VN': viVN,
  'th-TH': thTH,
  'es-ES': esES,
};

/**
 * T07 · UI 词典点位覆盖
 * 第 4 轮新增的 block（bazi/ziwei/astrolabe/almanac/search/pricing）在五语中仍是英文占位，
 * 译文由 T07 流水线生成（docs/i18n/T07/translated/<locale>-ui.json），运行前合并到词典上。
 * 只在点路径完整命中时写入，保证 zh-CN / en 既有译文零改动。
 */
function applyOverlay(dict: Dict, overlay: Record<string, string> | undefined): void {
  if (!overlay) return;
  for (const [key, value] of Object.entries(overlay)) {
    const parts = key.split('.');
    let cur: Record<string, unknown> = dict as unknown as Record<string, unknown>;
    let ok = true;
    for (let i = 0; i < parts.length - 1; i++) {
      const node = cur[parts[i]];
      if (node && typeof node === 'object') cur = node as Record<string, unknown>;
      else {
        ok = false;
        break;
      }
    }
    const leaf = parts[parts.length - 1];
    if (ok && typeof cur[leaf] === 'string') cur[leaf] = value;
  }
}

const DICTS: Record<Locale, Dict> = RAW_DICTS;
for (const loc of Object.keys(DICTS) as Locale[]) applyOverlay(DICTS[loc], UI_OVERLAYS[loc]);

const LOCALE_KEY = 'ts_locale';
const SUPPORTED_LOCALES: Locale[] = ['zh-CN', 'en', 'ja', 'ko-KN', 'vi-VN', 'th-TH', 'es-ES'];
function readStoredLocale(): Locale {
  const v = safeStorage.get(LOCALE_KEY);
  if (v != null && (SUPPORTED_LOCALES as string[]).includes(v)) return v as Locale;
  // 无效/过期 locale：回退中文并清掉错误 localStorage，避免中韩混杂
  if (v != null) safeStorage.remove(LOCALE_KEY);
  return 'zh-CN';
}
function translate(dict: Dict, key: string, fallback?: string): string {
  const parts = key.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return fallback ?? key;
    }
  }
  return typeof cur === 'string' ? cur : (fallback ?? key);
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
  locales: { id: Locale; label: string }[];
};

const I18nContext = createContext<I18nContextValue | null>(null);
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale());
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    safeStorage.set(LOCALE_KEY, l);
  }, []);
  const t = useCallback((key: string, fallback?: string) => translate(DICTS[locale], key, fallback), [locale]);
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      locales: [
        { id: 'zh-CN', label: DICTS['zh-CN'].lang.zh },
        { id: 'en', label: DICTS.en.lang.en },
        { id: 'ja', label: DICTS.ja.lang.ja },
        { id: 'ko-KN', label: DICTS['ko-KN'].lang.ko },
        { id: 'vi-VN', label: DICTS['vi-VN'].lang.vi },
        { id: 'th-TH', label: DICTS['th-TH'].lang.th },
        { id: 'es-ES', label: DICTS['es-ES'].lang.es },
      ],
    }),
    [locale, setLocale, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
/**
 * 可选读取：无 Provider 时返回 null 而非抛错。
 * 用于纯展示增强（如术语译文 shim）—— 缺 Provider 应退化为中文原文，不应让整棵子树崩溃。
 */
export function useI18nOptional(): I18nContextValue | null {
  return useContext(I18nContext);
}
