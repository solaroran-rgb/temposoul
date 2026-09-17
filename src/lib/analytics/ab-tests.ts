/**
 * A/B 实验分组与事件埋点（终版）
 * 分组逻辑：确定性 hash（userId → bucket）
 * 全链路追踪：分组信息写入支付 custom_data
 */

declare global {
  interface Window {
    _cf?: {
      push: (args: unknown[]) => void;
    };
  }
}

export type ExperimentId = 'paywall_position' | 'price_9_9_vs_19_9' | 'social_proof' | 'scarcity';

interface ExperimentConfig {
  enabled: boolean;
  bucketSize: number;
  description: string;
}

const EXPERIMENTS: Record<ExperimentId, ExperimentConfig> = {
  paywall_position: {
    enabled: true,
    bucketSize: 2,
    description: '付费墙位置：0=末尾, 1=中途',
  },
  price_9_9_vs_19_9: {
    enabled: true,
    bucketSize: 2,
    description: '价格：0=¥9.9, 1=¥19.9',
  },
  social_proof: {
    enabled: true,
    bucketSize: 2,
    description: '社会证明：0=无, 1=有',
  },
  scarcity: {
    enabled: true,
    bucketSize: 2,
    description: '稀缺性：0=无, 1=有（需合规确认）',
  },
};

/** FNV-1a 哈希（确定性） */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/** 获取实验分组（确定性） */
export function getExperimentBucket(userId: string, experimentId: ExperimentId): number {
  const config = EXPERIMENTS[experimentId];
  if (!config || !config.enabled) return 0;

  const input = `${userId}:${experimentId}`;
  return fnv1a(input) % config.bucketSize;
}

/** 获取全部实验配置（供前端渲染决策） */
export function getExperimentConfig(userId: string): Record<ExperimentId, number> {
  return {
    paywall_position: getExperimentBucket(userId, 'paywall_position'),
    price_9_9_vs_19_9: getExperimentBucket(userId, 'price_9_9_vs_19_9'),
    social_proof: getExperimentBucket(userId, 'social_proof'),
    scarcity: getExperimentBucket(userId, 'scarcity'),
  };
}

/** 埋点：实验曝光 */
export function trackExperimentView(experimentId: ExperimentId, bucket: number): void {
  if (typeof window === 'undefined') return;
  window._cf?.push?.([
    'event',
    {
      name: 'ab_experiment_view',
      experiment: experimentId,
      bucket,
      ts: new Date().toISOString(),
    },
  ]);
}

/** 埋点：实验转化 */
export function trackExperimentConversion(
  experimentId: ExperimentId,
  bucket: number,
  action: string,
): void {
  if (typeof window === 'undefined') return;
  window._cf?.push?.([
    'event',
    {
      name: 'ab_experiment_conversion',
      experiment: experimentId,
      bucket,
      action,
      ts: new Date().toISOString(),
    },
  ]);
}

/** 埋点：支付实验（含分组信息） */
export function trackPaymentExperiment(
  experimentId: ExperimentId,
  bucket: number,
  productId: string,
  outcome: 'checkout_started' | 'checkout_completed' | 'checkout_failed',
): void {
  if (typeof window === 'undefined') return;
  window._cf?.push?.([
    'event',
    {
      name: 'ab_payment_' + outcome,
      experiment: experimentId,
      bucket,
      productId,
      ts: new Date().toISOString(),
    },
  ]);
}
