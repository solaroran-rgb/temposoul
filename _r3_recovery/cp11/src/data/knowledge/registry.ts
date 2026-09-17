
/**

* C11-registry 修复段（替换原 tags 兜底逻辑）
  */
  export function knowledgeArticles(): ArticleMeta[] {
  return MANIFEST.map((m) => {
   const data = loadContent(m.slug);
   return {
     slug: m.slug,
     title: m.title,
     category: m.category,
     // ✅ 修复：未就绪也不污染 tag
     tags: m.tags ?? [],
     ready: data?.ready ?? false,
     confidence: data?.confidence ?? m.confidence ?? 'legendary',
   };
  });
  }

export function ganzhiArticles(): ArticleMeta[] {
  return knowledgeArticles().filter(
    (a) => a.category === 'ganzhi' || GANZHI_SLUG_SET.has(a.slug),
  );
}

