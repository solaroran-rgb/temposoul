import { useEffect } from 'react';

/**
 * SeoHead —— 页面级 SEO 基础设施（SPA 客户端注入）
 *
 * 职责：
 *  - 用 useEffect 写 document.title、meta[name=description]、og:* / twitter:* 与 canonical；
 *  - 可选注入 JSON-LD（Organization / WebSite / FAQPage 三种 schema）；
 *  - 可选注入七语言 hreflang alternate link（zh-CN / en / es / ja / ko / th / vi）。
 *
 * 约定：
 *  - 已存在的静态标签（index.html 里的 description / og:* / twitter:* / hreflang / canonical）
 *    会被原地更新；本组件新建的标签带 data-seo-dynamic 标记，卸载时仅清理自建标签，
 *    不破坏 index.html 的默认兜底。
 *  - JSON-LD 脚本带 data-seo-jsonld 标记，卸载时按标记清理，不影响 index.html 的静态 WebSite 脚本。
 */

/** 七语言 hreflang 语种码（与 index.html 静态 hreflang 对齐） */
export type HrefLangCode = 'zh-CN' | 'en' | 'es' | 'ja' | 'ko' | 'th' | 'vi';

/** hreflang 映射：语种码 → 该语言版本对应 URL；可另带 x-default */
export interface HrefLangMap extends Partial<Record<HrefLangCode, string>> {
  'x-default'?: string;
}

/** Open Graph / Twitter 字段（twitter:* 自动镜像 og 标题/描述/图） */
export interface SeoOg {
  /** og:type，默认 website */
  type?: string;
  /** og:title / twitter:title */
  title?: string;
  /** og:description / twitter:description */
  description?: string;
  /** og:image / twitter:image（建议传绝对 URL） */
  image?: string;
  /** og:url */
  url?: string;
  /** og:site_name */
  siteName?: string;
  /** og:locale，如 zh_CN */
  locale?: string;
}

/** JSON-LD · Organization */
export interface SeoOrganizationJsonLd {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

/** JSON-LD · WebSite（可选带 SearchAction 站内搜索） */
export interface SeoWebsiteJsonLd {
  name: string;
  url: string;
  description?: string;
  /** 搜索目标模板，如 https://www.temposoul.com/?q={search_term_string} */
  searchAction?: string;
}

/** JSON-LD · FAQPage 问答项 */
export interface SeoFaqItem {
  question: string;
  answer: string;
}

/** 三种 schema 按需开启 */
export interface SeoJsonLd {
  organization?: SeoOrganizationJsonLd;
  website?: SeoWebsiteJsonLd;
  faq?: SeoFaqItem[];
}

export interface SeoHeadProps {
  /** 页面标题（写入 document.title） */
  title: string;
  /** meta[name=description] */
  description?: string;
  /** link[rel=canonical] */
  canonical?: string;
  /** og:* / twitter:* 字段 */
  og?: SeoOg;
  /** 七语言 hreflang alternate link */
  hreflang?: HrefLangMap;
  /** 可选结构化数据（Organization / WebSite / FAQPage） */
  jsonLd?: SeoJsonLd;
}

const DYNAMIC_MARK = 'data-seo-dynamic';
const JSONLD_MARK = 'data-seo-jsonld';

const HREFLANG_CODES: readonly HrefLangCode[] = [
  'zh-CN',
  'en',
  'es',
  'ja',
  'ko',
  'th',
  'vi',
];

/** 原地更新或新建 meta 标签；新建的打动态标记以便卸载清理 */
function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(DYNAMIC_MARK, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** 原地更新或新建 hreflang alternate link */
function upsertHreflang(code: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${code}"]`,
  );
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', code);
    link.setAttribute(DYNAMIC_MARK, '');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute(DYNAMIC_MARK, '');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function buildJsonLdNode(kind: string, node: Record<string, unknown>): HTMLScriptElement {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.seoJsonld = kind;
  script.textContent = JSON.stringify(node);
  return script;
}

function buildOrganizationScript(o: SeoOrganizationJsonLd): HTMLScriptElement {
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: o.name,
  };
  if (o.url) node.url = o.url;
  if (o.logo) node.logo = o.logo;
  if (o.sameAs && o.sameAs.length > 0) node.sameAs = o.sameAs;
  return buildJsonLdNode('organization', node);
}

function buildWebsiteScript(w: SeoWebsiteJsonLd): HTMLScriptElement {
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: w.name,
    url: w.url,
  };
  if (w.description) node.description = w.description;
  if (w.searchAction) {
    node.potentialAction = {
      '@type': 'SearchAction',
      target: w.searchAction,
      'query-input': 'required name=search_term_string',
    };
  }
  return buildJsonLdNode('website', node);
}

function buildFaqScript(items: SeoFaqItem[]): HTMLScriptElement {
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
  return buildJsonLdNode('faq', node);
}

/**
 * 页面级 SEO 头管理组件（不渲染任何 UI，返回 null）。
 * 用法：在路由组件内 <SeoHead title="..." description="..." canonical="..." og={{...}} />
 */
export function SeoHead(props: SeoHeadProps): null {
  const { title, description, canonical, og, hreflang, jsonLd } = props;

  useEffect(() => {
    document.title = title;

    if (description) {
      upsertMeta('name', 'description', description);
    }

    if (canonical) {
      upsertCanonical(canonical);
    }

    if (og) {
      if (og.type) upsertMeta('property', 'og:type', og.type);
      if (og.title) upsertMeta('property', 'og:title', og.title);
      if (og.description) upsertMeta('property', 'og:description', og.description);
      if (og.image) upsertMeta('property', 'og:image', og.image);
      if (og.url) upsertMeta('property', 'og:url', og.url);
      if (og.locale) upsertMeta('property', 'og:locale', og.locale);
      if (og.siteName) upsertMeta('property', 'og:site_name', og.siteName);
      // twitter 镜像
      if (og.title) upsertMeta('name', 'twitter:title', og.title);
      if (og.description) upsertMeta('name', 'twitter:description', og.description);
      if (og.image) upsertMeta('name', 'twitter:image', og.image);
    }

    if (hreflang) {
      for (const code of HREFLANG_CODES) {
        const url = hreflang[code];
        if (url) upsertHreflang(code, url);
      }
      if (hreflang['x-default']) {
        upsertHreflang('x-default', hreflang['x-default']);
      }
    }

    // JSON-LD：先清理本组件旧脚本，再注入新的
    document.head
      .querySelectorAll(`script[type="application/ld+json"][${JSONLD_MARK}]`)
      .forEach((n) => n.remove());

    const scripts: HTMLScriptElement[] = [];
    if (jsonLd?.organization) scripts.push(buildOrganizationScript(jsonLd.organization));
    if (jsonLd?.website) scripts.push(buildWebsiteScript(jsonLd.website));
    if (jsonLd?.faq && jsonLd.faq.length > 0) scripts.push(buildFaqScript(jsonLd.faq));
    for (const s of scripts) document.head.appendChild(s);

    return () => {
      // 仅清理本组件自建标签，保留 index.html 静态默认
      document.head.querySelectorAll(`[${DYNAMIC_MARK}]`).forEach((n) => n.remove());
      document.head
        .querySelectorAll(`script[type="application/ld+json"][${JSONLD_MARK}]`)
        .forEach((n) => n.remove());
    };
  }, [title, description, canonical, og, hreflang, jsonLd]);

  return null;
}
