/**
 * D-7 创作者共生计划（联盟营销：分润 + 归因 + 反作弊）
 * 来源：专家 D R3（143217.md §5）
 * 口径：商业信封（kind='lightfun-commercial'），强制 monetization 字段
 */
import type { LightFunCommercialEnvelope } from './types';

// ── 归因与反作弊底层类型 ──
export interface AttributionParams {
  pid: string; // 推广者 ID
  cid: string; // 活动 ID
  medium: 'article' | 'video' | 'social_post';
  click_id: string; // 唯一点击指纹（UUID v4）
}

export interface ConversionEvent {
  event_id: string;
  click_id: string;
  user_id: string;
  event_type: 'register' | 'purchase' | 'subscribe';
  amount: number;
  timestamp: string;
  risk_score: number; // 0-100，风控系统实时计算
}

// ── 反作弊规则引擎配置 ──
export const ANTI_FRAUD_RULES = [
  {
    rule_id: 'AF_001',
    condition: 'risk_score > 80',
    action: 'freeze_commission',
    description: '高风险作弊嫌疑，冻结佣金',
  },
  {
    rule_id: 'AF_002',
    condition: 'click_id duplicates > 5 in 1 min',
    action: 'block_ip',
    description: '短时间高频点击，拦截 IP',
  },
  {
    rule_id: 'AF_003',
    condition: 'conversion_amount > 10000 & new_user',
    action: 'manual_review',
    description: '新用户大额转化，转人工审核',
  },
] as const;

export interface CompliantAsset {
  asset_id: string;
  type: 'image' | 'video' | 'copywriting';
  url: string;
  required_disclosure: string; // 强制披露文案
  hash: string; // 素材防篡改哈希
}

export interface SyndicatePayload {
  models: Array<{
    id: string;
    base_rate: number;
    tiers: Array<{ threshold: number; rate: number }>;
  }>;
  compliance_rules: Array<{ id: string; text: string; penalty: string }>;
  anti_fraud_rules: typeof ANTI_FRAUD_RULES;
  assets: CompliantAsset[];
}

export const creatorSyndicateData: LightFunCommercialEnvelope<SyndicatePayload> = {
  id: 'creator-syndicate',
  kind: 'lightfun-commercial',
  seo: {
    title: '创作者共生计划：联盟营销与合规赋能',
    description: '了解分润模型、合规素材与反作弊规则，携手推广 TempoSoul。',
    keywords: ['联盟营销', '创作者计划', '合规推广'],
  },
  payload: {
    models: [
      { id: 'cps', base_rate: 0.15, tiers: [{ threshold: 5000, rate: 0.2 }] },
      { id: 'cpa', base_rate: 0, tiers: [{ threshold: 0, rate: 30 }] },
    ],
    compliance_rules: [
      {
        id: 'disclosure',
        text: '必须在显著位置标注「广告」或「TempoSoul 合作推荐」。',
        penalty: '首次警告，二次扣除当月佣金',
      },
      {
        id: 'redline',
        text: '严禁使用「改命」「包治百病」等绝对化或迷信话术。',
        penalty: '立即封号并扣除所有未结佣金',
      },
    ],
    anti_fraud_rules: ANTI_FRAUD_RULES,
    assets: [
      {
        asset_id: 'IMG-01',
        type: 'image',
        url: '/assets/affiliate/img01.jpg',
        required_disclosure: "需在图片右下角添加'广告'水印",
        hash: 'sha256:e3b0c44298fc1c14',
      },
      {
        asset_id: 'TXT-01',
        type: 'copywriting',
        url: '/assets/affiliate/txt01.md',
        required_disclosure: "需在文末添加'TempoSoul 合作推荐'",
        hash: 'sha256:d7a8fbb307d78094',
      },
    ],
  },
  metadata: {
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
    version: '1.0.0',
    tags: ['affiliate', 'commercial'],
  },
  monetization: {
    type: 'affiliate',
    cta: { text: '立即申请成为创作者', action: '/partners/apply', is_primary: true },
  },
};
