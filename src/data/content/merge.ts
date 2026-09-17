import type {
  BaseContentRecord,
  ContentCompleteness,
  ContentPatch,
  ContentSkeleton,
  MergeMeta,
} from './types';
import { isDrift } from './fingerprint';

/** 判定 full 所需的最少 blocks 数 */
export const FULL_BLOCK_THRESHOLD = 2;

export function deriveCompleteness(patch: ContentPatch | undefined): ContentCompleteness {
  if (!patch) return 'stub';
  return (patch.blocks?.length ?? 0) >= FULL_BLOCK_THRESHOLD ? 'full' : 'partial';
}

export function mergeContent(
  skeletons: ContentSkeleton[],
  patches: ContentPatch[],
  meta: MergeMeta
): BaseContentRecord[] {
  const patchMap = new Map<string, ContentPatch>();
  patches.forEach((p) => patchMap.set(p.id, p));

  const records = skeletons.map<BaseContentRecord>((s) => {
    const patch = patchMap.get(s.id);
    const drift = isDrift(s.engineRef, patch);
    const completeness = deriveCompleteness(patch);
    return {
      id: s.id,
      slug: s.slug,
      title: s.title,
      category: s.category,
      summary: patch?.summary,
      blocks: patch?.blocks ?? [],
      confidence: patch?.confidence ?? 'legendary',
      ready: completeness !== 'stub',
      completeness,
      contentVersion: meta.contentVersion,
      sourceRef: patch?.sourceRef ?? [...meta.defaultSourceRef],
      updatedAt: meta.updatedAt,
      order: s.order,
      engineRef: s.engineRef,
      drift,
      domainFields: { ...(s.domainFields ?? {}), ...(patch?.domainFields ?? {}) },
    };
  });

  assertContentInvariant(records);
  return records;
}

/** 不变式：ready === (completeness !== 'stub') */
export function assertContentInvariant(records: BaseContentRecord[]): void {
  records.forEach((r) => {
    if (r.ready !== (r.completeness !== 'stub')) {
      throw new Error(
        `[content-invariant] ${r.id}: ready=${String(r.ready)} 与 completeness=${r.completeness} 矛盾`
      );
    }
  });
}
