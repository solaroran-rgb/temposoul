/**
 * wechat.ts —— wechat_in 必埋检测（B3 六：微信内 H5 分享路径与转化率差异极大）
 *
 * B3 冻结：wechat_in 为必埋字段。detectWechatIn(ua) 为纯函数可在 node:test 断言；
 * isWechatIn() 在浏览器读 navigator.userAgent，node 侧返回 false（不抛错）。
 */

/** 纯函数：由 UA 串判定是否微信内置浏览器 */
export function detectWechatIn(userAgent: string): boolean {
  return /micromessenger/i.test(String(userAgent ?? ''));
}

/** 浏览器侧：读 navigator.userAgent；非浏览器环境返回 false */
export function isWechatIn(): boolean {
  if (typeof navigator === 'undefined' || !navigator.userAgent) return false;
  return detectWechatIn(navigator.userAgent);
}
