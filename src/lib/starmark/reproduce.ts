/**
 * reproduce.ts —— URL 复现接口（B3 四：/starmark/sky/:cert_id 同参数可复现）
 *
 * 说明：sky_id 是单向哈希，无法反解参数；因此生成时把 (skyId -> SkyParams)
 *       登记到证书库，复现时按 cert_id 取回参数重渲染。
 * P0 用内存证书库（确定性、可测）；波 2 M1 接持久化（KV/DB）后本接口不变。
 *
 * 本文件提供「输入 sky_id -> 输出同参数渲染结果」的可调用接口。
 */
import type { SkyParams } from './astro-view';
import { buildCertificate, type SkyCertificate } from './skyId';
import { renderL1, type L1Output } from './renderer-l1';

interface CertRecord {
  params: SkyParams;
  cert: SkyCertificate;
  templateId: string;
  snapshot: string;
}

/** 进程内证书库（P0；波 2 替换为持久层） */
const certStore = new Map<string, CertRecord>();

export interface GeneratedCard {
  cert: SkyCertificate;
  skyId: string;
  l1: L1Output;
}

/** 生成一张卡：算证书 + 登记 + 渲染 L1 */
export async function generateCard(
  params: SkyParams,
  templateId: string,
  name: string,
): Promise<GeneratedCard> {
  const cert = buildCertificate(params, params.magLimit, 0);
  const l1 = await renderL1({ params, templateId, name });
  const record: CertRecord = { params, cert, templateId, snapshot: l1.snapshot };
  certStore.set(cert.skyId, record);
  return { cert, skyId: cert.skyId, l1 };
}

/** 按 cert_id 复现：取回同参数重渲染，返回 L1 + 是否与原快照一致 */
export async function reproduceBySkyId(skyId: string): Promise<{
  found: boolean;
  l1?: L1Output;
  matchesOriginal?: boolean;
} > {
  const rec = certStore.get(skyId);
  if (!rec) return { found: false };
  const l1 = await renderL1({ params: rec.params, templateId: rec.templateId });
  return { found: true, l1, matchesOriginal: l1.snapshot === rec.snapshot };
}

/** 测试/诊断用：清空证书库 */
export function _resetCertStore(): void {
  certStore.clear();
}
