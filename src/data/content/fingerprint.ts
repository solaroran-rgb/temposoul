import { stableHash } from './deterministic';
import type { EngineRef } from './types';

export function makeEngineRef(source: string, keyFields: unknown): EngineRef {
  return {
    source,
    fingerprint: String(stableHash(`${source}::${JSON.stringify(keyFields)}`)),
  };
}

/** 引擎指纹与 patch 绑定指纹不一致 → 内容漂移 */
export function isDrift(
  skeleton: EngineRef,
  patch?: { bindsToFingerprint?: string }
): boolean {
  if (!patch) return false;
  if (!patch.bindsToFingerprint) return false;
  return patch.bindsToFingerprint !== skeleton.fingerprint;
}
