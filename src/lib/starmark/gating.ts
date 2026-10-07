/**
 * gating.ts —— preview 门控 MVP 简化（B3 P0-1）
 *
 * 完整设计：未付费开放 360° 环视 + 缩放，锁定「穿行」与「星体信息卡」。
 * MVP 简化（本卡）：降级为布尔门控 { unlocked }，能力开关由布尔推导；
 * 复杂的飞行时序/定格帧按钮留波 2 M1（见文件尾注释）。
 */

export interface PreviewGate {
  /** 是否已付费解锁（单次 L2 解锁） */
  unlocked: boolean;
  /** 免费：360° 环视 */
  orbit: boolean;
  /** 免费：缩放 */
  zoom: boolean;
  /** 付费：穿行（空间感） */
  walkthrough: boolean;
  /** 付费：星体信息卡 */
  infoCard: boolean;
}

/** 由布尔解锁态推导能力矩阵（MVP 简化点：用单一布尔而非多特性开关） */
export function previewGate(unlocked: boolean): PreviewGate {
  return {
    unlocked,
    orbit: true, // 免费开放
    zoom: true, // 免费开放
    walkthrough: unlocked, // 付费解锁
    infoCard: unlocked, // 付费解锁
  };
}

/*
 * 【波 2 M1 待接】完整门控（本卡不实现，仅留接口位）：
 *  - 解锁成功后立即触发 6-8s 穿行飞行，终点弹「定格分享帧」按钮；
 *  - E2 实验：先 30s 免费旋转预览再出墙 vs 进入即墙；
 *  - 飞行完成事件 FlyCompleted 上抛（对齐 analytics l2_unlock_fly_done）。
 */
