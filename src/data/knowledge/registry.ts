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
import { FENGSHUI_ARTICLES } from './fengshui-manifest';

/** ① 正文按需 loader（显式映射表；2026-09-16 全量接线：56 篇正文全部登记） */
const CONTENT_LOADERS: Record<string, () => Promise<{ default: KnowledgeArticle }>> = {
  // 首批 5 篇
  'why-not-predict': () => import('./content/why-not-predict'),
  'bazi-intro': () => import('./content/bazi-intro'),
  'shensha-intro': () => import('./content/shensha-intro'),
  'zhuge-intro': () => import('./content/zhuge-intro'),
  'almanac-intro': () => import('./content/almanac-intro'),
  // B16-补交 · 节气科普（4）
  'lichun': () => import('./content/solar-terms/lichun'),
  'chunfen': () => import('./content/solar-terms/chunfen'),
  'liqiu': () => import('./content/solar-terms/liqiu'),
  'dongzhi': () => import('./content/solar-terms/dongzhi'),
  // B16-补交 · 生肖文化（4）
  'zodiac-rat': () => import('./content/zodiac-culture/rat'),
  'zodiac-ox': () => import('./content/zodiac-culture/ox'),
  'zodiac-tiger': () => import('./content/zodiac-culture/tiger'),
  'zodiac-rabbit': () => import('./content/zodiac-culture/rabbit'),
  // boundary 理性专栏（7）
  'why-no-fortune-score': () => import('./content/why-no-fortune-score'),
  'why-confidence': () => import('./content/why-confidence'),
  'why-bazi-limits': () => import('./content/why-bazi-limits'),
  'why-ai-boundary': () => import('./content/why-ai-boundary'),
  'why-folk-vs-fact': () => import('./content/why-folk-vs-fact'),
  'why-data-source': () => import('./content/why-data-source'),
  'why-rational-decl': () => import('./content/why-rational-decl'),
  // wuxing 五行（7）
  'wuxing-shengke': () => import('./content/wuxing-shengke'),
  'wuxing-wangshuai': () => import('./content/wuxing-wangshuai'),
  'wuxing-buyi': () => import('./content/wuxing-buyi'),
  'wuxing-nayin': () => import('./content/wuxing-nayin'),
  'wuxing-color': () => import('./content/wuxing-color'),
  'wuxing-zangxiang': () => import('./content/wuxing-zangxiang'),
  'wuxing-misunderstand': () => import('./content/wuxing-misunderstand'),
  // ganzhi 干支专题（8）
  'ganzhi-overview': () => import('./content/ganzhi-overview'),
  'ganzhi-jiazi': () => import('./content/ganzhi-jiazi'),
  'ganzhi-sanhe': () => import('./content/ganzhi-sanhe'),
  'ganzhi-sixhe': () => import('./content/ganzhi-sixhe'),
  'ganzhi-clash': () => import('./content/ganzhi-clash'),
  'ganzhi-canggan': () => import('./content/ganzhi-canggan'),
  'ganzhi-shengwang': () => import('./content/ganzhi-shengwang'),
  'ganzhi-nayin-table': () => import('./content/ganzhi-nayin-table'),
  // shishen 十神（9）
  'shishen-overview': () => import('./content/shishen-overview'),
  'shishen-bijian': () => import('./content/shishen-bijian'),
  'shishen-shishang': () => import('./content/shishen-shishang'),
  'shishen-caixing': () => import('./content/shishen-caixing'),
  'shishen-guansha': () => import('./content/shishen-guansha'),
  'shishen-yinxing': () => import('./content/shishen-yinxing'),
  'shishen-combo': () => import('./content/shishen-combo'),
  'shishen-liuqin': () => import('./content/shishen-liuqin'),
  'shishen-misunderstand': () => import('./content/shishen-misunderstand'),
  // paipan 排盘（9）
  'paipan-overview': () => import('./content/paipan-overview'),
  'paipan-sizhu': () => import('./content/paipan-sizhu'),
  'paipan-jieqi': () => import('./content/paipan-jieqi'),
  'paipan-shichen': () => import('./content/paipan-shichen'),
  'paipan-lunar-solar': () => import('./content/paipan-lunar-solar'),
  'paipan-daymaster': () => import('./content/paipan-daymaster'),
  'paipan-true-solar-time': () => import('./content/paipan-true-solar-time'),
  'paipan-tools': () => import('./content/paipan-tools'),
  'paipan-faq': () => import('./content/paipan-faq'),
  // shensha 神煞（8）
  'shensha-overview': () => import('./content/shensha-overview'),
  'shensha-taohua': () => import('./content/shensha-taohua'),
  'shensha-yima': () => import('./content/shensha-yima'),
  'shensha-huagai': () => import('./content/shensha-huagai'),
  'shensha-tianyi': () => import('./content/shensha-tianyi'),
  'shensha-wenchang': () => import('./content/shensha-wenchang'),
  'shensha-yangren': () => import('./content/shensha-yangren'),
  'shensha-rational': () => import('./content/shensha-rational'),
  // dayun 大运流年（8）
  'dayun-overview': () => import('./content/dayun-overview'),
  'dayun-qiyun': () => import('./content/dayun-qiyun'),
  'dayun-liunian': () => import('./content/dayun-liunian'),
  'dayun-xiaoyun': () => import('./content/dayun-xiaoyun'),
  'dayun-suiyun': () => import('./content/dayun-suiyun'),
  'dayun-jiaoyun': () => import('./content/dayun-jiaoyun'),
  'dayun-liuyue': () => import('./content/dayun-liuyue'),
  'dayun-boundary': () => import('./content/dayun-boundary'),
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
        heading: '结构性事实',
        level: 2,
        blocks: [
          {
            kind: 'paragraph',
            text: `${e.char}为${isGan ? '十' : '十二'}${label}之一，序号第 ${e.index + 1} 位。`,
          },
          {
            kind: 'table',
            text: `${e.char} 结构属性`,
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
            kind: 'callout',
            tone: 'boundary',
            text: '以上为结构性字段，与命律排盘引擎口径一致，可复算核验。',
          },
        ],
      },
      {
        heading: '文化解读（民俗参考）',
        level: 2,
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
            ? [
                {
                  kind: 'callout' as const,
                  tone: 'boundary' as const,
                  text: `${e.culture.organNote}（传统文化关联观念，非医疗建议）`,
                },
              ]
            : []),
        ],
      },
      {
        heading: '在命局中的位置',
        level: 2,
        blocks: [
          {
            kind: 'paragraph',
            text: `${label}${e.char}在四柱中出现在不同位置时，传统命理有不同解读路径。具体需结合日主、十神与格局综合判断，单一${label}不构成结论。`,
          },
          {
            kind: 'callout',
            tone: 'boundary',
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
    engineModule: {
      module: '@temposoul/core/ganzhi',
      exports: ['getBranchRelations', 'getStemRelations'],
      note: '干支关系字段以引擎为准（导出名待 GC-18 回填后直连）',
    },
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

/** 合并后的全量元数据（手写 manifest + 干支编译 + 批4 C23 风水 18 篇） */
export function allArticleMeta(): ArticleMeta[] {
  const fromGanzhi: ArticleMeta[] = ganzhiArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    metaDescription: a.metaDescription,
    category: a.category,
    tags: a.tags,
    confidence: a.confidence,
    ready: a.ready,
    updatedAt: a.updatedAt,
    readingMinutes: a.readingMinutes,
  }));
  const fromFengshui: ArticleMeta[] = FENGSHUI_ARTICLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    metaDescription: a.metaDescription,
    category: a.category,
    tags: a.tags,
    confidence: a.confidence,
    ready: a.ready,
    updatedAt: a.updatedAt,
    readingMinutes: a.readingMinutes,
  }));
  return [...ARTICLE_MANIFEST, ...fromGanzhi, ...fromFengshui];
}

export function getMeta(slug: string): ArticleMeta | undefined {
  return allArticleMeta().find((m) => m.slug === slug);
}

export function listMeta(category?: KnowledgeCategory): ArticleMeta[] {
  const all = allArticleMeta();
  return category ? all.filter((m) => m.category === category) : all;
}

/** 详情页按需加载：手写正文优先，其次风水 18 篇，最后干支编译 */
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
  const fengshui = FENGSHUI_ARTICLES.find((a) => a.slug === slug);
  if (fengshui) return fengshui;
  const compiled = ganzhiArticles().find((a) => a.slug === slug);
  return compiled ?? null;
}

/** ③ 三方注册表：概念 ↔ 引擎 ↔ 功能（防 URL 漂移） */
export interface FeatureEntry {
  id: string;
  label: string;
  url: string;
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
    id: m.slug,
    title: m.title,
    summary: m.metaDescription,
    url: `/knowledge/${m.slug}`,
    keywords: m.tags,
  }));
}

export { buildJiazi };
