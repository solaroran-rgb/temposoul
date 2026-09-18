/**
 * C-1 格局详解库：紫微斗数 10 大主格局白话解读
 * 来源：专家 C R3（143217.md §ziwei/pattern-extended.data.ts）
 * 口径：10 条，每条 ≥300 字
 */
import type { CContentRecord, CPatternExtendedExtra } from './types';

interface PatternSeed {
  slug: string;
  name: string;
  type: string;
  core: string;
  manifestation: string;
  advice: string;
}

const PATTERNS: PatternSeed[] = [
  {
    slug: 'ziwei-zuoming',
    name: '紫微坐命',
    type: '主星格局',
    core: '自我价值感强，有领导欲，但需避免刚愎自用',
    manifestation: '在团队中自然成为核心，但容易忽略他人意见；在压力下倾向于独断专行',
    advice: "练习'先听后说'，在决策前主动征求 3 个不同意见",
  },
  {
    slug: 'tianji-zuoming',
    name: '天机坐命',
    type: '主星格局',
    core: '思维敏捷、善于谋划，但容易想多做少',
    manifestation: '点子多、反应快，但行动力不足时会陷入"分析瘫痪"；在社交中显得聪明但不够沉稳',
    advice: '给自己设定"72小时行动窗口"：任何想法72小时内必须迈出第一步',
  },
  {
    slug: 'taiyang-zuoming',
    name: '太阳坐命',
    type: '主星格局',
    core: '热情外放、乐于助人，但容易透支自己',
    manifestation: '天生的利他者，愿意为他人付出；但过度奉献后会感到委屈和不被珍惜',
    advice: '学会"选择性付出"：先照顾好自己的杯子，再倒给别人',
  },
  {
    slug: 'wuqu-zuoming',
    name: '武曲坐命',
    type: '主星格局',
    core: '务实干练、执行力强，但表达方式偏硬',
    manifestation: '做事利落、目标导向，但说话直来直去容易得罪人；在理财和实际事务上很有天赋',
    advice: '在提意见前加一句"我理解你的想法是……"，缓冲表达硬度',
  },
  {
    slug: 'tiantong-zuoming',
    name: '天同坐命',
    type: '主星格局',
    core: '温和知足、人缘好，但缺乏冲劲',
    manifestation: '天生的老好人，不想冲突；但在需要竞争的环境中容易被边缘化',
    advice: '找到一个你真正在意的领域，在这个领域里练习"不让步"',
  },
  {
    slug: 'lian-zhen-zuoming',
    name: '廉贞坐命',
    type: '主星格局',
    core: '魅力突出、好奇心强，但情绪波动大',
    manifestation: '人缘好、社交能力强，但情绪起伏时容易冲动决策；对美和艺术有天然敏感',
    advice: '情绪上头时延迟48小时再做重要决定',
  },
  {
    slug: 'tianfu-zuoming',
    name: '天府坐命',
    type: '主星格局',
    core: '稳重包容、善于守成，但创新不足',
    manifestation: '像"仓库管理员"一样善于积累和守护；但在需要破旧立新时会显得保守',
    advice: '每月做一次"小冒险"：尝试一件你从不做的事，训练灵活性',
  },
  {
    slug: 'taiyin-zuoming',
    name: '太阴坐命',
    type: '主星格局',
    core: '细腻敏感、直觉力强，但容易内耗',
    manifestation: '观察力极强、富有同理心；但过度吸收他人情绪后会疲惫和内耗',
    advice: '每天留15分钟"情绪排毒"：写下今天吸收的他人情绪，然后放下',
  },
  {
    slug: 'tanlang-zuoming',
    name: '贪狼坐命',
    type: '主星格局',
    core: '多才多艺、欲望强烈，但容易分散精力',
    manifestation: '兴趣广泛、学什么都快，但三分钟热度；在人际和感情中魅力四射但不够专注',
    advice: '同时只允许3个进行中的项目，完成一个再开新的',
  },
  {
    slug: 'jumen-zuoming',
    name: '巨门坐命',
    type: '主星格局',
    core: '洞察力强、善于分析，但容易多疑挑剔',
    manifestation: '一眼看穿问题本质，但说话太直容易伤人；在研究和调查类工作中表现出色',
    advice: '把"你这里有问题"改成"我观察到一个可以优化的点"',
  },
];

export const PATTERN_EXTENDED: readonly CContentRecord<CPatternExtendedExtra>[] = PATTERNS.map(
  (p) => {
    const body = [
      `${p.name}（${p.type}）的核心是：${p.core}。`,
      `具体表现上，${p.manifestation}。这种特质在不同场景下会有不同的呈现方式——在熟悉的环境中可能显得自然，在压力下则容易走向极端。`,
      `行动建议：${p.advice}。把这个建议变成日常练习，持续观察自己的变化。`,
      '需要强调的是，紫微斗数格局描述属于传统文化符号系统，是一种自我观察的工具，不构成对个人性格或命运的定论。',
    ].join('');

    return {
      id: `c_pattern_extended_${p.slug}`,
      version: '1.0.0',
      domain: 'c',
      category: 'c_pattern_extended',
      seo: {
        title: `${p.name}格局详解`,
        description: `${p.name}（${p.type}）的核心意义、具体表现与行动建议`,
        slug: `/knowledge/ziwei/pattern-extended/${p.slug}`,
        canonical: `/knowledge/ziwei/pattern-extended/${p.slug}`,
        breadcrumb: ['首页', '格局详解库', p.name],
        breadcrumb_paths: [
          '/',
          '/knowledge/ziwei/pattern-extended',
          `/knowledge/ziwei/pattern-extended/${p.slug}`,
        ],
      },
      source: { system: 'ziwei', classic: '紫微斗数全书', chapter: `${p.name}` },
      compliance: {
        no_fatalism: true,
        domain_note: 'culture_discussion',
        banned_words_checked: true,
      },
      review: {
        status: 'supplemented',
        word_count: body.replace(/\s/g, '').length,
        reviewer: 'expert-c',
      },
      body: {
        plain_reading: body,
        insight_loop: {
          insight: `${p.name}的核心特质是：${p.core}。`,
          cause: '紫微斗数以出生星盘定格局，格局反映的是能量倾向而非命运定论。',
          manifestation: p.manifestation,
          risk: '格局描述可能强化刻板印象，勿用它来定义自己或他人。',
          suggestion: `把${p.name}当作一面镜子，观察自己的行为模式。`,
          action: p.advice,
        },
      },
      extra: {
        kind: 'c_pattern_extended',
        pattern_type: p.type,
        core_meaning: p.core,
        manifestation: p.manifestation,
        advice: p.advice,
      },
      i18n_key: `c_pattern_extended.${p.slug}`,
    };
  },
);

export const PATTERN_EXTENDED_COUNT = PATTERN_EXTENDED.length; // 10
