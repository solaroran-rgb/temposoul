import type { ContentPatch, ContentSkeleton } from './types';
import { isDrift } from './fingerprint';

export interface DriftItem {
  id: string;
  oldFingerprint: string;
  newFingerprint: string;
}

/** 构建期调用：输出漂移清单，交由人工重绑 fingerprint */
export function detectDrift(
  skeletons: ContentSkeleton[],
  patches: ContentPatch[]
): DriftItem[] {
  const patchMap = new Map<string, ContentPatch>();
  patches.forEach((p) => patchMap.set(p.id, p));
  const out: DriftItem[] = [];
  skeletons.forEach((s) => {
    const patch = patchMap.get(s.id);
    if (patch && isDrift(s.engineRef, patch)) {
      out.push({
        id: s.id,
        oldFingerprint: patch.bindsToFingerprint ?? '',
        newFingerprint: s.engineRef.fingerprint,
      });
    }
  });
  return out;
}

export function buildDriftReport(items: DriftItem[]): string {
  return JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2);
}
