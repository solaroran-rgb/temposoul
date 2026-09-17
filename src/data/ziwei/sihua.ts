// src/data/ziwei/sihua.ts
import type {
  ContentEntryBase,
  ContentPack,
  ContentBlockParagraph,
} from '@/data/content/entry-types';

export type HuaKind = '禄' | '权' | '科' | '忌';
export interface SihuaEntry extends ContentEntryBase {
  star: string;
  starSlug: string;
  hua: HuaKind;
  meaning: string;
  classicRef: string;
}

export const SIWEI_STARS = [
  { name: '紫微', slug: 'ziwei' },
  { name: '天机', slug: 'tianji' },
  { name: '太阳', slug: 'taiyang' },
  { name: '武曲', slug: 'wuqu' },
  { name: '天同', slug: 'tiantong' },
  { name: '廉贞', slug: 'lianzhen' },
  { name: '天府', slug: 'tianfu' },
  { name: '太阴', slug: 'taiyin' },
  { name: '贪狼', slug: 'tanlang' },
  { name: '巨门', slug: 'jumen' },
  { name: '天相', slug: 'tianxiang' },
  { name: '天梁', slug: 'tianliang' },
  { name: '七杀', slug: 'qisha' },
  { name: '破军', slug: 'pojun' },
] as const;

export const HUA_KINDS: readonly HuaKind[] = ['禄', '权', '科', '忌'];

const U = '2026-09-18';
const P = (text: string): ContentBlockParagraph => ({ kind: 'paragraph', text });

/** 每星在化禄/化权/化科/化忌下的传统白话释义（AI 生成待专家审计） */
const HUA_MAP: Record<
  string,
  { nature: string; lu: string; quan: string; ke: string; ji: string }
> = {
  ziwei: {
    nature: '尊贵领导',
    lu: '尊贵中资源顺遂，地位与财力同旺',
    quan: '掌握领导实权，决策力强',
    ke: '声名远播，以稳重得人敬重',
    ji: '好高骛远、孤高自许，反为地位所累',
  },
  tianji: {
    nature: '智慧机变',
    lu: '灵感与谋略带来实际收益',
    quan: '把谋略转化为掌控与执行力',
    ke: '以智谋与分析能力得名',
    ji: '多思多虑、计划反复生变',
  },
  taiyang: {
    nature: '光明博爱',
    lu: '声名与资源并至，付出有回报',
    quan: '掌握对外曝光与话语权',
    ke: '文采声名外显，贵人相助',
    ji: '劳而无功，为人心力交瘁，注意父缘',
  },
  wuqu: {
    nature: '财帛刚直',
    lu: '正财顺遂，靠实干进财',
    quan: '掌握财务与执行实权',
    ke: '以理财能力与信用得名',
    ji: '财务阻滞、刚愎破财，注意理财',
  },
  tiantong: {
    nature: '福分享受',
    lu: '福气与享受顺遂，心情宽裕',
    quan: '在安逸中仍能掌握主导',
    ke: '以随和与福气得人缘名声',
    ji: '懒散沉迷、福薄劳碌，贪图享受',
  },
  lianzhen: {
    nature: '官禄次桃花',
    lu: '应酬交际生财，人脉变现',
    quan: '掌握规则与约束之权',
    ke: '官声与专业声名提升',
    ji: '桃花是非、官非纠纷，情绪失控',
  },
  tianfu: {
    nature: '库藏稳重',
    lu: '库藏丰盈，理财有道',
    quan: '掌握财库与资源调度权',
    ke: '以稳重可信得名',
    ji: '库藏耗损、过度保守，财气不畅',
  },
  taiyin: {
    nature: '富柔田宅',
    lu: '财禄顺遂、利于置产储蓄',
    quan: '在柔性领域掌握实权',
    ke: '以文艺与细腻得名',
    ji: '情绪隐忧、田宅或母缘有损',
  },
  tanlang: {
    nature: '欲望桃花',
    lu: '人缘与欲望变现，财源自交际',
    quan: '把欲望转化为执行与开拓力',
    ke: '以才艺与人缘得名',
    ji: '桃花是非、贪多嚼不烂',
  },
  jumen: {
    nature: '口舌暗星',
    lu: '靠口才与专业生财',
    quan: '以口才掌握话语权',
    ke: '以研究与专业能力得名',
    ji: '口舌是非、暗昧猜疑，谨防破财',
  },
  tianxiang: {
    nature: '印星辅佐',
    lu: '衣食资源丰足，得贵人接济',
    quan: '掌握印信与辅佐实权',
    ke: '以稳重辅佐得名',
    ji: '受人连累、印星失势，优柔误事',
  },
  tianliang: {
    nature: '荫寿逢凶化吉',
    lu: '长辈荫庇带来资源',
    quan: '掌握教化与庇佑之权',
    ke: '以清贵与德行得名',
    ji: '荫过反孤、为长辈或旧理所累',
  },
  qisha: {
    nature: '刚决冲劲',
    lu: '冲劲转化为进财机会',
    quan: '掌杀伐决断之权，魄力十足',
    ke: '以武职与果决得名',
    ji: '冲动招灾、孤克，注意血光',
  },
  pojun: {
    nature: '先破后成',
    lu: '破旧立新中迸发财源',
    quan: '掌开创与变革之权',
    ke: '以破旧立新的行动得名',
    ji: '破耗过度、财来财去，起伏剧烈',
  },
};

const HUA_SUFFIX: Record<
  HuaKind,
  { short: string; block: (star: string, nature: string, m: string) => string }
> = {
  禄: {
    short: '资源顺遂',
    block: (star, nature, m) =>
      `${star}主${nature}，化禄时传统命理中主顺遂、财源与机会偏向此星所主的领域：${m}。`,
  },
  权: {
    short: '掌控掌权',
    block: (star, nature, m) => `${star}主${nature}，化权时传统命理中主执行力与掌控力增强：${m}。`,
  },
  科: {
    short: '声名贵人',
    block: (star, nature, m) =>
      `${star}主${nature}，化科时传统命理中主声名、贵人与文教助力：${m}。`,
  },
  忌: {
    short: '阻滞执念',
    block: (star, nature, m) =>
      `${star}主${nature}，化忌时传统命理中主阻滞、执念与情绪拉扯：${m}。需有意识地收束，不必恐慌。`,
  },
};

export const sihuaPack: ContentPack<SihuaEntry> = {
  version: '1.1.0',
  ready: true,
  entries: SIWEI_STARS.flatMap((star) =>
    HUA_KINDS.map((hua) => {
      const row = HUA_MAP[star.slug];
      const meaningKey = ({ 禄: 'lu', 权: 'quan', 科: 'ke', 忌: 'ji' } as const)[hua];
      const meaning = row[meaningKey];
      return {
        key: `${star.slug}-${({ 禄: 'lu', 权: 'quan', 科: 'ke', 忌: 'ji' } as const)[hua]}`,
        title: `${star.name}化${hua}`,
        summary: `${star.name}逢化${hua}：${HUA_SUFFIX[hua].short}。`,
        blocks: [P(HUA_SUFFIX[hua].block(star.name, row.nature, meaning))],
        citations: ['AI生成待专家审计', '《紫微斗数全书》传世四化口诀白话整理'],
        confidence: 'probable',
        completeness: 'full',
        ready: true,
        status: 'published' as const,
        updatedAt: U,
        star: star.name,
        starSlug: star.slug,
        hua,
        meaning,
        classicRef: '《紫微斗数全书》四化篇（白话转述）',
      } satisfies SihuaEntry;
    }),
  ),
};
