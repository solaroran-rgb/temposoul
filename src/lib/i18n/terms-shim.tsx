import { useEffect, useState } from 'react';
import { useI18nOptional } from '@/i18n';
import type { Locale } from '@/i18n';
import type { TermLocale } from '@/data/terms-7lang';

/**
 * L0 查表 shim（T3·M2）：中文源术语 → 当前界面语言标签。
 * 数据来自懒加载的 src/data/terms-7lang.ts（tier1 355 条，动态 import 控包体）。
 * 查不到返回 null——调用方保留原文展示（M3 起补「未翻译」徽标，禁止静默伪装成已翻译）。
 * ko-KN→ko-KR：界面 Locale 仍为 ko-KN，术语数据键已迁移为 ko-KR（提交 6b08810/27160a3），
 *   此处做等价映射以保证类型与运行时一致（韩语语义相同）。
 */
let terms7langModule: Promise<typeof import('@/data/terms-7lang')> | null = null;

function loadTerms7lang() {
  terms7langModule ??= import('@/data/terms-7lang');
  return terms7langModule;
}

/** Locale（含 ko-KN）→ TermLocale（已迁移为 ko-KR）等价映射。 */
function toTermLocale(locale: Locale): TermLocale {
  return locale === 'ko-KN' ? 'ko-KR' : locale;
}

export function useTermLabel(zh: string): string | null {
  const locale = useI18nOptional()?.locale ?? 'zh-CN';
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (locale === 'zh-CN') return;
    let active = true;
    loadTerms7lang().then((mod) => {
      if (active) setLabel(mod.translateTerm(zh, toTermLocale(locale)));
    });
    return () => {
      active = false;
    };
  }, [zh, locale]);
  return label;
}

/** 通用术语文本：有译文渲染译文，无译文渲染中文源术语。 */
export function TermText(props: { zh: string; className?: string }) {
  const label = useTermLabel(props.zh);
  return <span className={props.className}>{label ?? props.zh}</span>;
}
