/**
 * star_card · 缓存与开关
 * 双层缓存 key（A5 卡 P1/P2 冻结）：
 *  - 全局层：star_card_{dateKey}*{tz}*{ruleVersion} —— 无个人信息，可 CDN。
 *  - 个人层：star_card_{uidHash}*{dateKey} —— uid 哈希物理隔离；仅影响呈现顺序与侧重，不进内容。
 *  - 已看幂等：seen_{uidHash}*{dateKey} —— 跨渠道（邮件/分享回来）共用。
 * feature flag 四开关（回滚开关，P0 必建，可不发版关闭）。
 */

export interface StarCardCacheKeys {
  global: string;
  personal: string | null;
  seen: string | null;
}

/** ruleVersion 语义：规则表变更即失效（如 20261007-1 → 20261007-2） */
export function buildCacheKeys(
  dateKey: string,
  ruleVersion: string,
  tz: string,
  uidHash?: string,
): StarCardCacheKeys {
  const global = `star_card_${dateKey}*${tz}*${ruleVersion}`;
  if (!uidHash) {
    return { global, personal: null, seen: null };
  }
  return {
    global,
    personal: `star_card_${uidHash}*${dateKey}`,
    seen: `seen_${uidHash}*${dateKey}`,
  };
}

/** 四开关（feature flag；均可经环境变量/配置关闭，关闭即回滚） */
export interface StarCardFlags {
  /** 弹卡（关闭=仅首页常驻入口） */
  modal: boolean;
  /** 实时天气（P1；关闭=纯静态气候带） */
  weather: boolean;
  /** 邮件晨报（P1；关闭=不发） */
  email: boolean;
  /** 分享（P1；关闭=隐藏分享入口） */
  share: boolean;
}

export const DEFAULT_FLAGS: StarCardFlags = {
  modal: true,
  weather: false,
  email: false,
  share: false,
};
