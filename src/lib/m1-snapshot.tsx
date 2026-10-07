/**
 * m1 排盘页共享：参数快照 / 可复现 URL / 引擎版本角标
 *
 * 修复批次 2 · P1-① —— A6 P0-3「参数快照分享链接（带引擎 semver）」在 14 个 m1 新板块落地。
 *
 * 用法（页面模式，见 00_修复批次2_m1快照模式_冻结版.md）：
 *   1. 页面用 useSearchParams 读取初始参数（readParam 带校验，失败回落默认值）；
 *   2. 提交时 setSearchParams(..., { replace: true }) 写回 URL —— 分享链接可复现；
 *   3. 结果区渲染 <ParamSnapshot params={...} engineName={...} /> 展示快照与引擎版本角标。
 * 引擎版本规则：优先引擎输出的 version 字段；缺省回落到 CORE_ENGINE_VERSION（包版本，如实标注）。
 */
import { type CSSProperties } from 'react';

/** @temposoul/core 包版本（packages/core/package.json version，构建期冻结，全站引擎共版） */
export const CORE_ENGINE_VERSION = '0.1.26';

const wrapStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.68,
  lineHeight: 1.7,
  border: '1px dashed rgba(140,150,180,0.3)',
  borderRadius: 8,
  padding: '8px 12px',
  marginBottom: 14,
  wordBreak: 'break-all',
};

/**
 * 从 URL 读取带校验的初始值；URL 无该键或校验失败时回落默认值。
 * @param validate 返回合法值或 null（null = 非法 → 回落默认值）
 */
export function readParam<T extends string | number>(
  sp: URLSearchParams,
  key: string,
  fallback: T,
  validate?: (v: string) => T | null,
): T {
  const raw = sp.get(key);
  if (raw === null) return fallback;
  if (validate) {
    const v = validate(raw);
    if (v !== null) return v;
    return fallback;
  }
  return raw as unknown as T;
}

/** 数字参数校验器（Number.isFinite） */
export function numParam(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * 参数快照组件：展示输入参数键值 + 引擎名 + 版本角标。
 * engineVersion 缺省用 CORE_ENGINE_VERSION；engineName 缺省显示 '—'（页面应传实际引擎名）。
 */
export function ParamSnapshot({
  params,
  engineName,
  engineVersion,
}: {
  params: Record<string, string | number | boolean>;
  engineName?: string;
  engineVersion?: string;
}) {
  const version = engineVersion || CORE_ENGINE_VERSION;
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '' && v !== false,
  );
  return (
    <div style={wrapStyle} data-m1-snapshot="true">
      <b>参数快照</b>　
      {entries.length ? entries.map(([k, v]) => `${k}=${String(v)}`).join(' · ') : '（默认参数）'}
      <span>　·　引擎：{engineName ?? '—'} v{version}</span>
    </div>
  );
}
