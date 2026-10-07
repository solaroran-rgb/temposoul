/**
 * cert-summary.ts —— 证书校验页「一键可截图」参数明细（B3 二 复现验证）
 *
 * B3 冻结：复现验证「一键完成且结果可截图（不能只是服务端说通过）」。
 * 本模块把 verifyReproduction 结果 + 证书版本 + 场景指纹组装成截图友好的报告结构，
 * detailLines 含逐星比对星数 / 超差星数 / 最大漂移 / 全部版本指纹，可直接截图留证。
 *
 * 纯函数；不发请求、不读 DOM，便于 node:test 与浏览器同构。
 */
import type { VerifyResult } from './verify';
import type { CertificateContent } from './version';
import { DISCLAIMER_TEXT } from './templates';

export interface CertReport {
  certId: string;
  /** 复现一致 */
  passed: boolean;
  /** 大字结论（截图首屏） */
  headline: string;
  /** 截图友好的逐行参数明细 */
  detailLines: string[];
  /** 场景指纹（可截图） */
  fingerprint: string;
  /** 强制娱乐参考口径（合规红线） */
  disclaimer: string;
  /** 恒为 true：声明本结构即为可截图快照 */
  screenshotReady: true;
}

export function buildCertReport(input: {
  certId: string;
  verify: VerifyResult;
  fingerprint: string;
  cert: CertificateContent;
}): CertReport {
  const { certId, verify, fingerprint, cert } = input;
  const passed = verify.pass;
  const headline = passed ? '复现一致 ✓' : '参数已被修改 ✗';
  const driftText = Number.isFinite(verify.maxDriftPx)
    ? `${verify.maxDriftPx.toFixed(2)} px`
    : '超限';

  const detailLines = [
    `证书编号：${certId}`,
    `校验结果：${headline}`,
    `比对星数：${verify.comparedStars}`,
    `超差星数：${verify.driftStars}`,
    `最大屏幕偏差：${driftText}`,
    `星表版本：${cert.catalogVersion}`,
    `算法版本：${cert.algorithmVersion}`,
    `投影：${cert.projection}｜色标：${cert.colorSystem}`,
    `历元：${cert.epoch}｜时间尺度：${cert.timeScale}`,
    `渲染指纹：${fingerprint}`,
  ];

  return {
    certId,
    passed,
    headline,
    detailLines,
    fingerprint,
    disclaimer: DISCLAIMER_TEXT,
    screenshotReady: true,
  };
}
