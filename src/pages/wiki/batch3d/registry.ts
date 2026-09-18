/**
 * batch3d 注册表：D 域（起名与商业变现）7 页 kind → 信封元数据
 * 不改动 batch2/registry.ts；kind 统一 naming_* 前缀
 */
import type {
  LightFunContentEnvelope,
  LightFunCommercialEnvelope,
  DdKind,
} from '@/data/content/naming/types';
import { englishNameData } from '@/data/content/naming/english-name.data';
import { brandNamingData } from '@/data/content/naming/brand-naming.data';
import { artisanalNamingData } from '@/data/content/naming/artisanal-naming.data';
import { nameConsultantData } from '@/data/content/naming/name-consultant.data';
import { namePopularityData } from '@/data/content/naming/name-popularity.data';
import { rhythmCalendarData } from '@/data/content/naming/rhythm-calendar.data';
import { creatorSyndicateData } from '@/data/content/naming/creator-syndicate.data';

/** 异质信封统一类型（payload 作 unknown 读取，渲染层按 id 收窄） */
export type AnyDdEnvelope = LightFunContentEnvelope<unknown> | LightFunCommercialEnvelope<unknown>;

export interface DdPageMeta {
  kind: DdKind;
  /** 路由 pageId（DdRoutes 用 key 查找） */
  pageId: string;
  /** 对应路由路径 */
  path: string;
  title: string;
  desc: string;
  /** 是否静态路径（R5 D-A3：静态优先于同前缀动态路由） */
  isStatic: boolean;
  envelope: AnyDdEnvelope;
}

export const DD_PAGES: Record<string, DdPageMeta> = {
  'english-name': {
    kind: 'naming_english_name',
    pageId: 'english-name',
    path: '/tools/english-name-persona',
    title: '英文名测试',
    desc: '双轴心理情境测试，匹配契合气场与特质的英文名',
    isStatic: true,
    envelope: englishNameData as unknown as AnyDdEnvelope,
  },
  brand: {
    kind: 'naming_brand',
    pageId: 'brand',
    path: '/tools/brand-naming-engine',
    title: '公司起名引擎',
    desc: '品牌定位与命名方法论、案例',
    isStatic: true,
    envelope: brandNamingData as unknown as AnyDdEnvelope,
  },
  artisanal: {
    kind: 'naming_artisanal',
    pageId: 'artisanal',
    path: '/tools/artisanal-naming',
    title: '手工起名',
    desc: '50 个汉字的心理意象与字形参考',
    isStatic: true,
    envelope: artisanalNamingData as unknown as AnyDdEnvelope,
  },
  consultant: {
    kind: 'naming_consultant',
    pageId: 'consultant',
    path: '/services/senior-name-consultant',
    title: '资深顾问测名',
    desc: '多维度解读与咨询流程',
    isStatic: true,
    envelope: nameConsultantData as unknown as AnyDdEnvelope,
  },
  popularity: {
    kind: 'naming_popularity',
    pageId: 'popularity',
    path: '/insights/name-popularity-trends',
    title: '名字热度榜',
    desc: '命名趋势洞察与重名率参考',
    isStatic: true, // R5 D-A3：必须优先于 /insights/:article_id
    envelope: namePopularityData as unknown as AnyDdEnvelope,
  },
  rhythm: {
    kind: 'naming_rhythm',
    pageId: 'rhythm',
    path: '/tools/life-rhythm-calendar',
    title: '生命节律月历',
    desc: '2026 节气能量与每日行动参考',
    isStatic: true,
    envelope: rhythmCalendarData as unknown as AnyDdEnvelope,
  },
  syndicate: {
    kind: 'naming_syndicate',
    pageId: 'syndicate',
    path: '/partners/creator-syndicate',
    title: '创作者共生计划',
    desc: '联盟营销与合规赋能',
    isStatic: true,
    envelope: creatorSyndicateData as unknown as AnyDdEnvelope,
  },
};

/** 静态优先路由顺序（R5 D-A3：静态路径写在动态之前） */
export const DD_STATIC_PAGE_IDS = Object.keys(DD_PAGES).filter((k) => DD_PAGES[k].isStatic);

export const DD_PAGE_COUNT = Object.keys(DD_PAGES).length; // 7
