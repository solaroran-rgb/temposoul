import { useEffect } from 'react';

export interface DocumentMetaOptions {
  title?: string;
  noIndex?: boolean;
}

/** 声明式文档头：title 与 noindex 统一入口，避免页面各自操作 DOM */
export function useDocumentMeta(options: DocumentMetaOptions): void {
  const { title, noIndex } = options;
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (title) {
      document.title = title;
    }
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noIndex) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        document.head.appendChild(meta);
      }
      meta.content = 'noindex,follow';
    } else if (meta) {
      meta.remove();
    }
  }, [title, noIndex]);
}
