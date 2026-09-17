import { useEffect } from 'react';

export interface DocumentSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

function ensureMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): HTMLMetaElement {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
  return el;
}

/**
 * 内容页统一 SEO：设置 <title>、description、OG。noindex 页面不要调用本 hook。
 */
export function useDocumentSeo(seo: DocumentSeo): void {
  useEffect(() => {
    document.title = seo.title;
    ensureMeta('description', seo.description);
    if (seo.ogTitle) ensureMeta('og:title', seo.ogTitle, 'property');
    if (seo.ogDescription) ensureMeta('og:description', seo.ogDescription, 'property');
  }, [seo.title, seo.description, seo.ogTitle, seo.ogDescription]);
}
