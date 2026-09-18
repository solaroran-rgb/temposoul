/**
 * D 域（起名与商业变现内容）严格可辨识联合信封类型
 * 来源：专家 D R3 编码轮（143217.md §1）+ R5（150722.md §三）
 * 说明：域内私有类型，纯内容信封与商业信封在编译期严格互斥，杜绝字段污染
 */

export interface BaseSEO {
  title: string;
  description: string;
  keywords?: string[];
}

export interface BaseMetadata {
  created_at: string;
  updated_at: string;
  tags: string[];
  version: string;
}

/** 1. 纯内容信封（严禁包含商业字段） */
export interface LightFunContentEnvelope<T> {
  id: string;
  kind: 'lightfun'; // 判别值
  seo: BaseSEO;
  payload: T;
  metadata: BaseMetadata;
}

/** 2. 商业内容信封（强制包含商业字段） */
export interface LightFunCommercialEnvelope<T> {
  id: string;
  kind: 'lightfun-commercial'; // 判别值
  seo: BaseSEO;
  payload: T;
  metadata: BaseMetadata;
  monetization: {
    type: 'freemium' | 'premium_service' | 'affiliate';
    cta: { text: string; action: string; is_primary: boolean };
  };
}

/** 联合类型导出，供路由注册表使用 */
export type LightFunEnvelope<T> = LightFunContentEnvelope<T> | LightFunCommercialEnvelope<T>;

/** D 域路由 kind 前缀（batch3d 注册表使用） */
export type DdKind =
  | 'naming_english_name'
  | 'naming_brand'
  | 'naming_artisanal'
  | 'naming_consultant'
  | 'naming_popularity'
  | 'naming_rhythm'
  | 'naming_syndicate';
