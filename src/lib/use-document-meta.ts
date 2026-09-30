import { useEffect } from 'react';

export interface DocumentMetaOptions {
  title?: string;
  noIndex?: boolean;
}

const PREVIOUS_ROBOTS = 'data-document-meta-previous';
const CREATED_ROBOTS = 'data-document-meta-created';

function normalizeUrl(value: string): string {
  return value.replace(/[?#].*$/, '').replace(/\/$/, '');
}

/**
 * Keep a richer build-time title when the prerendered canonical matches the
 * current route. Client-side navigation changes location before this effect,
 * so stale metadata from the previous route is not preserved.
 */
function hasCurrentPrerenderedTitle(): boolean {
  const prerendered = document.head.querySelector('script[data-prerender-seo]');
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  if (!prerendered || !canonical) return false;
  return normalizeUrl(canonical) === normalizeUrl(`${window.location.origin}${window.location.pathname}`);
}

/** 声明式文档头：title 与 noindex 统一入口，避免页面各自操作 DOM */
export function useDocumentMeta(options: DocumentMetaOptions): void {
  const { title, noIndex } = options;
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (title && !hasCurrentPrerenderedTitle()) {
      document.title = title;
    }

    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noIndex) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        meta.setAttribute(CREATED_ROBOTS, 'true');
        document.head.appendChild(meta);
      } else if (!meta.hasAttribute(PREVIOUS_ROBOTS)) {
        meta.setAttribute(PREVIOUS_ROBOTS, meta.content);
      }
      meta.content = 'noindex,follow';
    } else if (meta?.hasAttribute(PREVIOUS_ROBOTS)) {
      meta.content = meta.getAttribute(PREVIOUS_ROBOTS) || 'index, follow, max-image-preview:large';
      meta.removeAttribute(PREVIOUS_ROBOTS);
    } else if (meta?.getAttribute(CREATED_ROBOTS) === 'true') {
      meta.remove();
    }
  }, [title, noIndex]);
}
