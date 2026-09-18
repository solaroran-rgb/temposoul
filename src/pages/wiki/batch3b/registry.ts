/**
 * 批 3b-B 页面注册表：kind（b_* 前缀）→ 模块元数据
 * 与 batch2/registry.ts 物理隔离，不改其任何内容。
 */
import type { BDomainRecord } from '@/data/content/b/types';

export type B3bKind =
  'b_crystal' | 'b_palmistry' | 'b_astrology_term' | 'b_podcast' | 'b_fortune' | 'b_expert';

export interface B3bKindMeta {
  kind: B3bKind;
  /** 对应 BDomainRecord.module */
  module: BDomainRecord['module'];
  title: string;
  desc: string;
  listPath: string;
}

export const B3B_KIND_META: Record<B3bKind, B3bKindMeta> = {
  b_crystal: {
    kind: 'b_crystal',
    module: 'crystal',
    title: '水晶宝石图鉴',
    desc: '12 种常见晶石的色彩、硬度与文化寓意参考',
    listPath: '/gems',
  },
  b_palmistry: {
    kind: 'b_palmistry',
    module: 'palmistry',
    title: '手相文化辞典',
    desc: '三大掌纹的民俗释义与现代心理视角',
    listPath: '/tools/palmistry',
  },
  b_astrology_term: {
    kind: 'b_astrology_term',
    module: 'astrology_term',
    title: '占星百科',
    desc: '行星 / 相位 / 宫位 27 个基础词条',
    listPath: '/knowledge/astrology-terms',
  },
  b_podcast: {
    kind: 'b_podcast',
    module: 'podcast',
    title: '民俗轻谈 · 播客',
    desc: '30 期心理学与民俗学对谈',
    listPath: '/podcast',
  },
  b_fortune: {
    kind: 'b_fortune',
    module: 'fortune',
    title: '节气运讯',
    desc: '节气与天象周期的生活节奏参考',
    listPath: '/insights',
  },
  b_expert: {
    kind: 'b_expert',
    module: 'expert',
    title: '文化顾问团',
    desc: '团队身份与资质公示',
    listPath: '/experts',
  },
};
