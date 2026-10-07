/**
 * fingerprint.ts —— 确定性场景指纹 getSceneFingerprint()（B3 L2 确定性钩子）
 *
 * = URL 复现参数 + three 版本 + 星表版本 + shader 版本 的哈希。
 * 交证书：任何一处变了，指纹必变，复现校验立即不通过。
 * 纯函数，可在 node 测试。
 */
import { STAR_CATALOG_VERSION, STAR_SHADER_VERSION, THREE_VERSION_LOCK } from './version';

export interface FingerprintInput {
  /** URL 复现参数（规范化 canonicalString） */
  urlParams: string;
  /** 覆盖星表/shader/three 版本（默认取 version.ts 单源） */
  catalogVersion?: string;
  shaderVersion?: string;
  threeVersion?: string;
}

function fnv1aHex(input: string): string {
  let h = 0x811c9dc5 >>> 0;
  const bytes = new TextEncoder().encode(input);
  for (let i = 0; i < bytes.length; i++) {
    h = (h ^ bytes[i]) >>> 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function getSceneFingerprint(input: FingerprintInput): string {
  const parts = [
    input.urlParams,
    input.catalogVersion ?? STAR_CATALOG_VERSION,
    input.shaderVersion ?? STAR_SHADER_VERSION,
    input.threeVersion ?? THREE_VERSION_LOCK,
  ].join('|');
  return fnv1aHex(parts);
}
