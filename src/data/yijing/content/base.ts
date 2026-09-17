import type { ContentBlock } from '@/data/knowledge/schema';
import type { ContentPatch } from '@/data/content/types';

/**
 * 首批 5 卦白话释义（乾/坤/屯/蒙/需）。
 * 卦辞、爻辞、用爻原文由引擎 hexagramsData 提供，此处只写白话释义与应用场景，不复述古籍原文。
 */
export const HEXAGRAM_PATCHES: ContentPatch[] = [
  {
    id: '01-qian',
    summary: '乾：纯阳之卦，讲「持续而有力的行动」如何在不同阶段保持分寸。',
    confidence: 'legendary',
    sourceRef: ['《周易》通行注疏白话归纳（原文由引擎提供，此处不复述）'],
    domainFields: {
      modernText:
        '乾卦以龙的六种状态讲同一件事：力量在增长时，什么时候该潜、什么时候该现、什么时候该收。',
      usageScenarios: ['长期项目的节奏判断', '个人能力积累阶段的自我定位', '强势局面下的分寸把握'],
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '乾卦的核心是「刚健而不冒进」：它不否定进取，而是提醒进取要配得上所处的位置与时机。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '读这一卦，重点不在吉凶，而在辨认自己正处在积累、显现、上升还是收敛的阶段。',
      } as ContentBlock,
    ],
  },
  {
    id: '02-kun',
    summary: '坤：纯阴之卦，讲承载、配合与顺势而为的力量。',
    confidence: 'legendary',
    sourceRef: ['《周易》通行注疏白话归纳（原文由引擎提供，此处不复述）'],
    domainFields: {
      modernText: '坤卦以大地为象，强调容纳与执行：不是主导方向，而是把方向落到实处。',
      usageScenarios: ['团队协作中的角色定位', '资源与流程的承载设计', '长期投入的耐心判断'],
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '坤卦的力量来自稳定与包容：它让事情得以持续，而不是让事情立刻改变。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒：配合不等于被动，选择承载什么、拒绝什么，本身就是一种判断。',
      } as ContentBlock,
    ],
  },
  {
    id: '03-zhun',
    summary: '屯：初生之难，讲事情刚起步时的阻滞与破解。',
    confidence: 'legendary',
    sourceRef: ['《周易》通行注疏白话归纳（原文由引擎提供，此处不复述）'],
    domainFields: {
      modernText: '屯卦描述草木初生的状态：方向是对的，但条件尚未齐备，因此处处受阻。',
      usageScenarios: ['创业或新项目初期', '资源不足时的推进策略', '关系建立初期的磨合'],
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '屯卦不主张硬闯：它建议在条件未成时先建立秩序、寻找可依靠的支点。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它的价值在于把「起步期的混乱」正常化——难是阶段特征，不是方向错误。',
      } as ContentBlock,
    ],
  },
  {
    id: '04-meng',
    summary: '蒙：蒙昧未开，讲学习、请教与教育的双向关系。',
    confidence: 'legendary',
    sourceRef: ['《周易》通行注疏白话归纳（原文由引擎提供，此处不复述）'],
    domainFields: {
      modernText: '蒙卦讲的是求知的状态：一方面需要主动发问，另一方面也需要尊重知识与引导者。',
      usageScenarios: ['进入陌生领域的学习路径', '带教与培训关系', '信息过载时的取舍'],
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '蒙卦强调「问」的质量：含糊的问题只能换来含糊的答复。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它同时提醒教的一方：对方没有准备好时，灌输越多效果越差。',
      } as ContentBlock,
    ],
  },
  {
    id: '05-xu',
    summary: '需：等待与养育，讲在条件成熟前如何自处。',
    confidence: 'legendary',
    sourceRef: ['《周易》通行注疏白话归纳（原文由引擎提供，此处不复述）'],
    domainFields: {
      modernText: '需卦以「等待」为主题：不是消极拖延，而是在等待中补充实力与资源。',
      usageScenarios: ['时机未到时的准备', '长期目标的节奏管理', '外部条件受限时的替代方案'],
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '需卦的关键在「等待期间做什么」：维持状态与储备，而非消耗自己。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提供了一个判断标准：如果等待让你更有准备，那就是有效的等待。',
      } as ContentBlock,
    ],
  },
];
