/**
 * URBAN 客户端参数单点。
 * 三态阈值 150/20 为 v4 裁定初始值；预热完成后按 P15/P85 校准流程一次性锁定，
 * 此后变更须主审单签（第二轮契约 §2.2）。
 * 服务端数值一律转引 SERVER_CFG，禁止双写（单一事实源纪律）。
 */
import { SERVER_CFG } from "./osmCore.js";

export const CITY_CONFIG = {
  // —— 城市数据三态（C6：数据三态 ≠ REALTIME 加载时序）——
  FULL_THRESHOLD: 150,
  HYBRID_THRESHOLD: 20,
  // —— 批次与画质（裁定 C1/C7）——
  MAX_BUILDINGS: SERVER_CFG.MAX_BUILDINGS,   // 800（high 档）
  MAX_BUILDINGS_MID: 400,                    // mid/low 档上限
  MOBILE_BUCKETS: 2,                         // 预留：D4 off 后仅 REALTIME drawRange 分段降级用
  LAYER_NEAR: 60,                            // aLayer 0（近景 0.85 档）半径 u
  LAYER_MID: 120,                            // aLayer 1（中景 0.5 档）；其余=2（远景 0.28 档）
  NODE_SAMPLE_MOBILE: 2,                     // 移动端 nodes 顶点采样步长
  WARM_POINTS_MAX: 48,                       // 地标暖橙窗点全局上限（C4 次级 <0.5% 面积）
  // —— 占位城（B4）——
  PLACEHOLDER_COUNT: 30,
  PLACEHOLDER_COUNT_MOBILE: 15,
  // —— 时序 ——
  GEO_API_TIMEOUT_MS: 15000,
  FADE_IN_MS: 500,                           // 裁定 D4：首帧终态 + 0.5s fade in（执行归 E3）
} as const;

export { SERVER_CFG };

export type CityMode = "FULL" | "HYBRID" | "PLACEHOLDER+";

export function classifyMode(buildingCount: number): CityMode {
  if (buildingCount >= CITY_CONFIG.FULL_THRESHOLD) return "FULL";
  if (buildingCount >= CITY_CONFIG.HYBRID_THRESHOLD) return "HYBRID";
  return "PLACEHOLDER+";
}