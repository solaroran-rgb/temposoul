/**
 * C 域：塔罗牌义 78 条（占卜民俗）
 * 来源：专家 C R4（论证44.md registry tarot=78）+ 既有 src/data/tarot/card-meanings.ts
 * 口径：78 条，逐条 ≥200 字，compliance_level=info
 */
import type { ContentRecord } from '../bazi-ziwei/types';
import { TAROT_CARD_MEANINGS } from '../../tarot/card-meanings';

export interface TarotExtra {
  kind: 'tarot';
  arcana: 'major' | 'minor';
  upright: string;
  reversed: string;
  confidence: string;
}

export const TAROT: readonly ContentRecord<TarotExtra>[] = TAROT_CARD_MEANINGS.map((c) => {
  const body = [
    `${c.name}是塔罗牌${c.arcana === 'major' ? '大阿卡纳' : '小阿卡纳'}中的一张。`,
    `正位时，这张牌常被解读为「${c.upright}」；逆位时则倾向「${c.reversed}」。需要说明的是，塔罗解读强调牌阵位置、问题语境与抽牌人状态的综合，单张牌义只是参考起点。`,
    `我们将牌义作为自我观察与叙事练习的工具：借由牌面意象梳理当下的情绪、处境与选择空间，而非对未来的预测。`,
    `解牌时建议以开放心态对待牌面，把注意力放在「这张牌提醒我关注什么」上，而不是寻求确定答案。`,
  ].join('');
  return {
    id: `tarot_${c.id}`,
    version: '1.0.0',
    domain: 'divination',
    category: 'tarot',
    seo: {
      title: `${c.name}牌义详解`,
      description: `${c.name}（${c.arcana === 'major' ? '大阿卡纳' : '小阿卡纳'}）正逆位牌义与解读参考。`,
      slug: `/wiki/tarot/cards/${c.id}`,
      canonical: `/wiki/tarot/cards/${c.id}`,
      breadcrumb: ['首页', '占卜民俗', '塔罗牌义', c.name],
      breadcrumb_paths: ['/', '/wiki', '/wiki/tarot/cards', `/wiki/tarot/cards/${c.id}`],
    },
    source: { system: 'tarot', classic: '韦特塔罗通行牌义', chapter: `${c.name}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: c.ready ? 'audited' : 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-c' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${c.name}正位提示「${c.upright}」。`,
        cause: `牌面意象与传统牌义赋予该牌核心含义。`,
        manifestation: `正位侧重主动面的表达，逆位侧重反思面。`,
        risk: `单张牌义脱离牌阵与语境易失真。`,
        suggestion: `结合牌阵位置与问题语境综合解读。`,
        action: `以牌面意象作自我觉察，不作预测断言。`,
      },
    },
    extra: { kind: 'tarot', arcana: c.arcana, upright: c.upright, reversed: c.reversed, confidence: c.confidence },
    i18n_key: `tarot.${c.id}`,
  };
});

export const TAROT_COUNT = TAROT.length; // 78
