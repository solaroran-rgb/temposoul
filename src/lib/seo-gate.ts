// src/lib/seo-gate.ts
export interface IndexableEntry {
  readonly ready: boolean;
  readonly completeness: 'full' | 'partial' | 'stub';
}

export type PageKind = 'content-article' | 'static-topic' | 'personal-result' | 'tool-placeholder';
export type IndexPolicy = 'index' | 'noindex';

export interface SeoGateApi {
  shouldIndex(entry: IndexableEntry): boolean;
  policyFor(kind: PageKind, entry?: IndexableEntry): IndexPolicy;
  applyToDocument(policy: IndexPolicy): void;
}

function shouldIndexEntry(entry: IndexableEntry): boolean {
  return entry.ready && entry.completeness === 'full';
}

function policyForKind(kind: PageKind, entry?: IndexableEntry): IndexPolicy {
  if (kind === 'content-article') {
    return entry !== undefined && shouldIndexEntry(entry) ? 'index' : 'noindex';
  }
  if (kind === 'static-topic') return 'index';
  return 'noindex';
}

function applyToDocument(policy: IndexPolicy): void {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="robots"]');
  if (meta === null) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', policy === 'index' ? 'index,follow' : 'noindex,nofollow');
}

export const seoGate: SeoGateApi = {
  shouldIndex: shouldIndexEntry,
  policyFor: policyForKind,
  applyToDocument,
};
