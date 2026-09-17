
/**

* C9-终版：知识库注册表（唯一真源）
* 修复：
* ① 正文按需 import（显式映射表，删掉 index.ts 里 8 个不存在的 import → build 不再失败）
* ② 干支 22 页由真值表编译注入 ARTICLES → 修掉 GanzhiMatrix 死链
* ③ 引入 manifest，列表页不加载正文
* ④ 三方注册表：概念 ↔ 引擎 ↔ 功能
  */
  import type { ArticleMeta, KnowledgeArticle, KnowledgeCategory } from './schema';
  import { ARTICLE_MANIFEST } from './manifest';
  import { TIANGAN, DIZHI, buildJiazi } from './ganzhi';
  import type { GanzhiEntry } from './ganzhi';

/** ① 正文按需 loader（显式映射表，符合裁决2 精神；未就绪 slug 不登记） */
const CONTENT_LOADERS: Record<string, () => Promise<{ default: KnowledgeArticle }>> = {
  'why-not-predict': () => import('./content/why-not-predict'),
  'why-no-fortune-score': () => import('./content/why-no-fortune-score'),
  'wuxing-basics': () => import('./content/wuxing-basics'),
  // 后续文章按"数据追加轮"逐条登记，未登记=未就绪，不产生构建错误
};

/** ② 干支真值表 → 文章编译器（1 表驱动 22 页，永不与引擎分叉） */
function ganzhiToArticle(e: GanzhiEntry): KnowledgeArticle {
  const isGan = e.kind === 'tiangan';
  const label = isGan ? '天干' : '地支';
  return {
    slug: isGan ? `ganzhi-${e.id}` : `ganzhi-zhi-${e.id}`,
    title: `${label}「${e.char}」详解：五行阴阳、性情与类象`,
    metaDescription: `${label}${e.char}的阴阳五行归属、传统性情描述、常见类象与十神配合关系，据传世文献整理。`,
    h1: `${label}「${e.char}」详解`,
    category: 'ganzhi',
    tags: [label, e.char, e.structure.wuxing || '五行'].filter(Boolean),
    sections: [
      {
        heading: '结构性事实', level: 2,
        blocks: [
          { kind: 'paragraph', text: `${e.char}为${isGan ? '十' : '十二'}${label}之一，序号第 ${e.index + 1} 位。` },
          {
            kind: 'table', text: `${e.char} 结构属性`,
            header: ['属性', '值'],
            rows: [
              ['阴阳', e.structure.yinYang],
              ['五行', e.structure.wuxing || '—'],
              ['方位', e.structure.direction || '—'],
              ['季节', e.structure.season || '—'],
              ['藏干', (e.structure.hiddenStems ?? []).join('、') || '—'],
            ],
          },
          {
            kind: 'callout', tone: 'boundary',
            text: '以上为结构性字段，与命律排盘引擎口径一致，可复算核验。',
          },
        ],
      },
      {
        heading: '文化解读（民俗参考）', level: 2,
        blocks: [
          { kind: 'paragraph', text: e.culture.temperament || '内容整理中。' },
          ...(e.culture.images.length
            ? [{ kind: 'list' as const, items: e.culture.images.map((i) => `类象：${i}`) }]
            : []),
          ...(e.culture.shishenFit.length
            ? [{ kind: 'list' as const, items: e.culture.shishenFit.map((s) => `十神配合：${s}`) }]
            : []),
          ...(e.culture.relations.length
            ? [{ kind: 'list' as const, items: e.culture.relations.map((r) => `关系：${r}`) }]
            : []),
          ...(e.culture.organNote
            ? [{ kind: 'callout' as const, tone: 'boundary' as const, text: `${e.culture.organNote}（传统文化关联观念，非医疗建议）` }]
            : []),
        ],
      },
      {
        heading: '在命局中的位置', level: 2,
        blocks: [
          {
            kind: 'paragraph',
            text: `${label}${e.char}在四柱中出现在不同位置时，传统命理有不同解读路径。具体需结合日主、十神与格局综合判断，单一${label}不构成结论。`,
          },
          {
            kind: 'callout', tone: 'boundary',
            text: '本页不提供吉凶判断，也不承诺任何改运效果。',
          },
        ],
      },
    ],
    sources: e.sources.length
      ? e.sources.map((s) => ({ text: s, confidence: 'legendary' as const }))
      : [{ text: '据传统文献通行说法整理', confidence: 'legendary' as const }],
    citationStrategy: 'paraphrase',
    reviewedBy: e.reviewedBy || '待审',
    ready: e.ready,
    engineModule: { module: '@temposoul/core/ganzhi', exports: ['getBranchRelations', 'getStemRelations'], note: '干支关系字段以引擎为准（导出名待 GC-18 回填后直连）' },
    relatedFeatures: [{ label: '八字排盘', url: '/result?system=bazi' }],
    relatedSlugs: [],
    confidence: 'legendary',
    disclaimer: '本文含传统文化内容，属民俗参考，非事实结论。',
    updatedAt: '2026-09-16',
    readingMinutes: 4,
  };
}

/** 干支编译文章（22 页，含未就绪骨架） */
export function ganzhiArticles(): KnowledgeArticle[] {
  return [...TIANGAN, ...DIZHI].map(ganzhiToArticle);
}

/** 合并后的全量元数据（手写 manifest + 干支编译） */
export function allArticleMeta(): ArticleMeta[] {
  const fromGanzhi: ArticleMeta[] = ganzhiArticles().map((a) => ({
    slug: a.slug, title: a.title, metaDescription: a.metaDescription,
    category: a.category, tags: a.tags, confidence: a.confidence,
    ready: a.ready, updatedAt: a.updatedAt, readingMinutes: a.readingMinutes,
  }));
  return [...ARTICLE_MANIFEST, ...fromGanzhi];
}

export function getMeta(slug: string): ArticleMeta | undefined {
  return allArticleMeta().find((m) => m.slug === slug);
}

export function listMeta(category?: KnowledgeCategory): ArticleMeta[] {
  const all = allArticleMeta();
  return category ? all.filter((m) => m.category === category) : all;
}

/** 详情页按需加载：手写正文优先，其次干支编译 */
export async function loadArticle(slug: string): Promise<KnowledgeArticle | null> {
  const loader = CONTENT_LOADERS[slug];
  if (loader) {
    try {
      const mod = await loader();
      return mod.default;
    } catch {
      return null;
    }
  }
  const compiled = ganzhiArticles().find((a) => a.slug === slug);
  return compiled ?? null;
}

/** ③ 三方注册表：概念 ↔ 引擎 ↔ 功能（防 URL 漂移） */
export interface FeatureEntry {
  id: string; label: string; url: string;
  system: 'bazi' | 'ziwei' | 'astrolabe' | 'name' | 'divination' | 'almanac';
}
export const FEATURES: FeatureEntry[] = [
  { id: 'bazi-result', label: '八字排盘', url: '/result?system=bazi', system: 'bazi' },
  { id: 'bazi-five-elements', label: '五行缺失查询', url: '/bazi/five-elements', system: 'bazi' },
  { id: 'bazi-marriage', label: '婚姻桃花', url: '/bazi/marriage', system: 'bazi' },
  { id: 'name-test', label: '姓名测试', url: '/name-test', system: 'name' },
  { id: 'name-compat', label: '姓名配对', url: '/name/compatibility', system: 'name' },
];

const CONCEPT_FEATURE_MAP: Record<string, string[]> = {
  'wuxing-basics': ['bazi-five-elements'],
  'wuxing-shengke': ['bazi-five-elements'],
  'wuxing-buyi': ['bazi-five-elements'],
  'shensha-taohua': ['bazi-marriage'],
  'ganzhi-overview': ['bazi-result'],
};

export function featuresByConcept(slug: string): FeatureEntry[] {
  return (CONCEPT_FEATURE_MAP[slug] ?? [])
    .map((id) => FEATURES.find((f) => f.id === id))
    .filter((f): f is FeatureEntry => Boolean(f));
}

/** 供 /search Fuse 索引（本地侧接线） */
export function toSearchItems() {
  return allArticleMeta().map((m) => ({
    type: 'article' as const,
    id: m.slug, title: m.title, summary: m.metaDescription,
    url: `/knowledge/${m.slug}`, keywords: m.tags,
  }));
}

export { buildJiazi };

