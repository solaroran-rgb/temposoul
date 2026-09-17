import type { BaseContentRecord } from './types';

/** 仅 ready && full 可索引；stub/partial 一律 noindex */
export function shouldIndex(
  r: Pick<BaseContentRecord, 'ready' | 'completeness'>
): boolean {
  return r.ready && r.completeness === 'full';
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  priority: number;
}

export function toSitemapEntry(
  r: BaseContentRecord,
  base: string,
  pathPrefix: string
): SitemapEntry {
  const priority = r.completeness === 'full' ? 0.7 : r.completeness === 'partial' ? 0.4 : 0.2;
  return {
    loc: `${base}${pathPrefix}/${r.slug}`,
    lastmod: r.updatedAt.slice(0, 10),
    priority,
  };
}

export function buildSitemap(
  records: BaseContentRecord[],
  base: string,
  pathPrefix: string
): string {
  const entries = records.filter(shouldIndex).map((r) => toSitemapEntry(r, base, pathPrefix));
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
