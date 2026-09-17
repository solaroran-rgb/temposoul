
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

