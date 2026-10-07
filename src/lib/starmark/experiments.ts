/**
 * experiments.ts —— P0-2 实验开关（B3 七 E1-E4）
 *
 * B3 冻结：样本量由基线率反算、未达 MDE 不出结论；本模块只承载「当前跑哪个变体」
 * 的确定性开关位，不新建并行分析通道（事件仍走 analytics.trackStarMark）。
 *
 * 当前上线变体（B3 主控裁决后冻结）：
 *  - E1 参数预设入口（默认）vs 四步表单；
 *  - E2 先 30s 免费旋转预览再出墙（默认）vs 进入即墙；
 *  - E3 回流钩子；
 *  - E4 L3 定位为「可发抖音素材」（默认）vs「纪念视频增值」。
 */

export type E1FormFriction = 'preset' | 'form';
export type E2PaywallPosition = 'preview30s' | 'immediate';
export type E4L3Position = 'douyin_clip' | 'memorial_video';

export interface ExperimentFlags {
  /** E1 主指标：生成完成率；护栏：参数准确率 / TTFV */
  e1_formFriction: E1FormFriction;
  /** E2 主指标：L2 付费转化；护栏：分享率 / 退款率 */
  e2_paywallPosition: E2PaywallPosition;
  /** E3 回流钩子 */
  e3_reflowHook: boolean;
  /** E4 主指标：L3 购买率；护栏：L2 付费转化 */
  e4_l3Position: E4L3Position;
}

/** 冻结的上线变体（只读常量） */
export const STARMARK_EXPERIMENTS: ExperimentFlags = {
  e1_formFriction: 'preset',
  e2_paywallPosition: 'preview30s',
  e3_reflowHook: true,
  e4_l3Position: 'douyin_clip',
};

/** 取当前实验开关（返回副本，防调用方误改冻结值） */
export function getExperimentFlags(): ExperimentFlags {
  return { ...STARMARK_EXPERIMENTS };
}
