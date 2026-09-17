/**
 * C 域：爱情占卜 10 条结果（占卜民俗）
 * 来源：专家 C R4（论证44.md registry love_divination_results=10）
 * 口径：10 条结果，逐条 ≥150 字，compliance_level=warning（情感领域需更谨慎措辞）
 */
import type { ContentRecord } from '../bazi-ziwei/types';

export interface LoveDivinationExtra {
  kind: 'love_divination';
  result_index: number;
  tag: string;
}

const RESULTS: Array<[string, string]> = [
  ['心意渐明', '双方对彼此的感受正在逐渐清晰，当前阶段适合以真诚沟通代替猜测。'],
  ['缘分蓄势', '关系中存在进一步发展的空间，但需要耐心经营，不必急于定义。'],
  ['守望等待', '当前时机尚未完全成熟，适合把注意力放回自我成长，静待变化。'],
  ['默契升温', '彼此的理解与默契在增强，可以主动创造共同经历来巩固联结。'],
  ['重新审视', '关系中出现需要厘清的议题，建议坦诚表达需求，重新确认方向。'],
  ['顺其自然', '这段关系更适合以顺其自然的方式推进，强求反而增加压力。'],
  ['机会浮现', '新的可能性正在出现，保持开放心态，留意身边值得珍惜的人。'],
  ['自我聚焦', '当前能量更宜聚焦自身，先安顿好自己，关系才有更稳的基础。'],
  ['坦诚破冰', '误会或隔阂需要一次坦诚的对话来化解，真诚比技巧更重要。'],
  ['细水长流', '关系趋向稳定发展，日常的陪伴与关怀将比热烈的表达更有分量。'],
];

export const LOVE_DIVINATION: readonly ContentRecord<LoveDivinationExtra>[] = RESULTS.map(([tag, note], i) => {
  const body = [
    `爱情占卜结果：「${tag}」。${note}`,
    `需要特别说明：感情是两个人共同书写的过程，任何占卜结果都只是提供一个观察角度，无法也不应替代真实的情感沟通与相处。`,
    `我们建议把该结果当作一个自我反思的提示——它更多反映的是你此刻的心态与期待，而非关系的既定走向。关系的未来，始终由双方的选择与行动决定。`,
  ].join('');
  return {
    id: `love_divination_${i + 1}`,
    version: '1.0.0',
    domain: 'divination',
    category: 'love_divination',
    seo: {
      title: `爱情占卜·${tag}`,
      description: `爱情占卜结果「${tag}」的参考解读，理性看待感情与占卜。`,
      slug: `/tools/love-divination/result/${i + 1}`,
      canonical: `/tools/love-divination/result/${i + 1}`,
      breadcrumb: ['首页', '趣味测', '爱情占卜', tag],
      breadcrumb_paths: ['/', '/tools', '/tools/love-divination', `/tools/love-divination/result/${i + 1}`],
    },
    source: { system: 'hybrid', classic: '命律自研趣味占卜', chapter: `爱情占卜·${tag}` },
    compliance: { no_fatalism: true, domain_note: 'lifestyle_only', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-c' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `爱情占卜提示「${tag}」。`,
        cause: `基于你此刻的输入与心态生成的参考结果。`,
        manifestation: `反映当下的情感状态与期待倾向。`,
        risk: `感情议题敏感，切勿以占卜替代沟通。`,
        suggestion: `以真诚沟通为主，占卜仅作心态参考。`,
        action: `把关注点放回关系本身与自身成长。`,
      },
    },
    extra: { kind: 'love_divination', result_index: i + 1, tag },
    i18n_key: `love_divination.${i + 1}`,
  };
});

export const LOVE_DIVINATION_COUNT = LOVE_DIVINATION.length; // 10
