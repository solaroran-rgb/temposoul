import { useEffect, useState } from 'react';
import { useI18nOptional } from '@/i18n';

/**
 * L0 查表 shim（T3·M2）：中文源术语 → 当前界面语言标签。
 * 数据来自懒加载的 src/data/terms-7lang.ts（tier1 355 条，动态 import 控包体）。
 * 查不到返回 null——调用方保留原文展示（M3 起补「未翻译」徽标，禁止静默伪装成已翻译）。
 */
let terms7langModule: Promise<typeof import('@/data/terms-7lang')> | null = null;

function loadTerms7lang() {
  terms7langModule ??= import('@/data/terms-7lang');
  return terms7langModule;
}

export function useTermLabel(zh: string): string | null {
  const locale = useI18nOptional()?.locale ?? 'zh-CN';
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (locale === 'zh-CN') return;
    let active = true;
    loadTerms7lang().then((mod) => {
      if (active) setLabel(mod.translateTerm(zh, locale));
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
