/**
 * index.ts —— 星刻 StarMark 模块公共出口
 *
 * 本模块完全隔离在 src/lib/starmark/：
 *   - 不改共享路由（functions/api/[[path]].ts、src/App.tsx、wrangler.toml、环境变量）
 *   - 不动 A9 的 payments/entitlement 区域
 *   - 复用 A5 src/lib/sky 坐标/星表作为一致性锚点（只读 import）
 * 路由挂接留波 2 M1：本模块只提供纯函数 + 可调用接口 + 接入说明。
 */
export * from './version';
export * from './catalog';
export * from './astro-view';
export * from './skyId';
export * from './templates';
export * from './verify';
export * from './gating';
export * from './analytics';
export * from './picking';
export * from './fingerprint';
export * from './pixel-surface';
export * from './renderer-l1';
export * from './reproduce';
// scene-l2（three 浏览器端）不在 barrel 内导出，避免 node 侧误 import three
