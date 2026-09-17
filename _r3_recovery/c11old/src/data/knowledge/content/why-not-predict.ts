
/**

* C9-终版：知识库正文 · 理性专栏
* 存放于 content/ 供按需 import；注册表登记后生效
  */
  import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-not-predict',
  title: '为什么命律不做吉凶预测与事件断言',
  metaDescription: '命律不做吉凶打分、不预测具体事件。本文说明我们为什么这样设计，以及命理能提供什么、不能提供什么。',
  h1: '为什么命律不做吉凶预测与事件断言',
  category: 'boundary',
  tags: ['产品理念', '边界说明', '理性命理'],
  sections: [
    {
      heading: '我们的立场', level: 2,
      blocks: [
        { kind: 'paragraph', text: '命律 TempoSoul 不提供"吉/凶"总分，不预测"某月会发生某事"，也不承诺任何改运效果。这不是保守，而是我们对用户负责的底线。' },
        { kind: 'callout', tone: 'boundary', text: '命理可以描述一种倾向性框架，但无法、也不应该替代你对具体事件的判断。' },
      ],
    },
    {
      heading: '三个具体原因', level: 2,
      blocks: [{
        kind: 'list',
        items: [
          '可验证性：排盘中的节气、干支、藏干等属于可复算的结构性事实；而"吉凶""运势高低"属于解释性判断，无法通过数据核验。',
          '责任边界：断言型输出（如"本月必破财"）可能引发焦虑或被用于不当决策，我们不承担、也不制造这类风险。',
          '方法论：传统命理本身是一套解释系统，不同流派对同一命局常有不同读法，我们选择并列呈现多口径，而非给出唯一"正确答案"。',
        ],
      }],
    },
    {
      heading: '我们提供什么', level: 2,
      blocks: [{
        kind: 'list',
        items: [
          '结构性事实：四柱、五行分布、十神、神煞等（可核验、可复算）。',
          '文化解读：传统文献与民俗中的对应说法（标注为民俗参考）。',
          '置信度标识：每个维度明确标注"可核验 / 较可靠 / 民俗"，让你知道哪些能信、哪些只是文化传统。',
        ],
      }],
    },
  ],
  sources: [{ text: '本文为命律编辑部产品立场说明，非古籍引文', confidence: 'verified' }],
  citationStrategy: 'paraphrase',
  reviewedBy: '命律编辑部',
  ready: true,
  relatedFeatures: [{ label: '八字排盘', url: '/result?system=bazi' }],
  relatedSlugs: ['why-confidence', 'why-bazi-limits', 'why-folk-vs-fact'],
  confidence: 'verified',
  disclaimer: '本文为产品理念说明，不构成任何建议或承诺。',
  pinned: true,
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;

⑪ scripts/verify-citations.ts（运行时 import 版，修复 P2-11）

/**

* C9-终版 / GC-24：引文与合规校验（构建期挂 build 前置）
* 修复：由"正则扫源码"改为"运行时 import 真值校验"，变量赋值/双引号不再漏检
* 用法：tsx scripts/verify-citations.ts（失败 exit 1）
  */
  import { ARTICLE_MANIFEST } from '../src/data/knowledge/manifest';
  import { TIANGAN, DIZHI, ORGAN_FORBIDDEN_VERBS } from '../src/data/knowledge/ganzhi';
  import { CITATION_WHITELIST } from '../src/data/knowledge/citation-whitelist';

const errors: string[] = [];
const allowed = new Set(CITATION_WHITELIST.map((e) => e.id));

function checkArticle(art: { slug: string; sources: { citationId?: string }[]; reviewedBy: string }, scope: string): void {
  if (!art.reviewedBy || !art.reviewedBy.trim()) {
    errors.push(`${scope}/${art.slug}: 缺少 reviewedBy（人工核验签字必填）`);
  }
  for (const s of art.sources) {
    if (s.citationId && !allowed.has(s.citationId)) {
      errors.push(`${scope}/${art.slug}: 引文 ${s.citationId} 未命中白名单，请登记或改为转述`);
    }
  }
}

function main(): void {
  // 1. manifest 元数据层校验（reviewedBy 在正文，此处校验 slug 唯一性）
  const slugs = new Set<string>();
  for (const m of ARTICLE_MANIFEST) {
    if (slugs.has(m.slug)) errors.push(`manifest: slug 重复「${m.slug}」`);
    slugs.add(m.slug);
    if (m.metaDescription.length > 120) {
      errors.push(`manifest/${m.slug}: metaDescription 超过 120 字（${m.metaDescription.length}）`);
    }
  }

  // 2. 已就绪正文按需校验（只 import 就绪的，未就绪不阻塞）
  void (async () => {
    for (const m of ARTICLE_MANIFEST.filter((x) => x.ready)) {
      try {
        const mod = await import(`../src/data/knowledge/content/${m.slug}`);
        checkArticle(mod.default as never, 'content');
      } catch {
        errors.push(`content/${m.slug}: 标记 ready=true 但正文文件缺失`);
      }
    }

    // 3. 干支脏腑医疗动词黑名单（真值校验）
    for (const e of [...TIANGAN, ...DIZHI]) {
      const note = e.culture.organNote ?? '';
      for (const v of ORGAN_FORBIDDEN_VERBS) {
        if (note.includes(v)) {
          errors.push(`ganzhi/${e.id}: 脏腑文案出现医疗动词「${v}」，违反合规要求`);
        }
      }
      if (e.ready && (!e.reviewedBy || !e.reviewedBy.trim())) {
        errors.push(`ganzhi/${e.id}: 标记 ready=true 但缺少 reviewedBy`);
      }
    }
    
    if (errors.length) {
      console.error('[verify-citations] 校验失败：');
      for (const e of errors) console.error('  - ' + e);
      process.exit(1);
    }
    console.log(`[verify-citations] 校验通过（${ARTICLE_MANIFEST.length} 篇元数据 + ${TIANGAN.length + DIZHI.length} 干支条目）`);

  })();
}

main();

四、路由注册（⚠️ 顺序关键）

const NameCompatibilityPage = lazy(async () => { const m = await import('./pages/name/NameCompatibilityPage'); return { default: m.NameCompatibilityPage }; });
const KnowledgeListPage = lazy(async () => { const m = await import('./pages/knowledge/KnowledgeListPage'); return { default: m.KnowledgeListPage }; });
const GanzhiHubPage = lazy(async () => { const m = await import('./pages/knowledge/GanzhiHubPage'); return { default: m.GanzhiHubPage }; });
const KnowledgeDetailPage = lazy(async () => { const m = await import('./pages/knowledge/KnowledgeDetailPage'); return { default: m.KnowledgeDetailPage }; });

<Route path="/name/compatibility" element={<Suspense fallback={<RouteFallback />}><NameCompatibilityPage /></Suspense>} />
<Route path="/knowledge" element={<Suspense fallback={<RouteFallback />}><KnowledgeListPage /></Suspense>} />
{/* ⚠️ /knowledge/ganzhi 必须在 /knowledge/:slug 之前 */}
<Route path="/knowledge/ganzhi" element={<Suspense fallback={<RouteFallback />}><GanzhiHubPage /></Suspense>} />
<Route path="/knowledge/:slug" element={<Suspense fallback={<RouteFallback />}><KnowledgeDetailPage /></Suspense>} />

五、自审六项

