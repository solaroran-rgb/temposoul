import type { ContentBlock } from '@/data/knowledge/schema';
import type { ContentPatch } from '@/data/content/types';

/** 小阿卡纳四组 Ace（首批 4 条） */
export const MINOR_PATCHES: ContentPatch[] = [
  {
    id: 'wands-ace',
    summary: '权杖首牌：一股新的行动冲动，代表灵感与开始的能量。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['灵感', '启动', '热情', '机会', '开创'],
      suit: '权杖',
      element: '火',
      uprightText: '正位时，一个新想法带着足够的热量出现，适合尽快做小规模尝试。',
      reversedText: '逆位时，热情未找到出口，或启动后缺乏持续供给。',
      symbolism: '从云中伸出的手递出枝条，象征机会来自外部，需要主动接住。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '权杖首牌是火元素的开端：能量真实存在，但它只给开始，不保证结果。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '最佳用法是把这股冲动拆成一个可在短期内验证的小动作。',
      } as ContentBlock,
    ],
  },
  {
    id: 'cups-ace',
    summary: '圣杯首牌：情感的开启，代表感受、连接与新的关系契机。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['情感', '连接', '接纳', '共鸣', '开始'],
      suit: '圣杯',
      element: '水',
      uprightText: '正位时，情感通道打开，适合表达真实感受与修复关系。',
      reversedText: '逆位时，情感被压抑或表达错位，需要先澄清自己的需要。',
      symbolism: '溢出的杯与水象征情感丰沛，也暗示需要容器承接。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '圣杯首牌代表一段情感或创作灵感的源头出现。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒保持开放：感受本身没有对错，被忽略才会变成负担。',
      } as ContentBlock,
    ],
  },
  {
    id: 'swords-ace',
    summary: '宝剑首牌：清晰的判断，代表突破混沌的洞见。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['清晰', '判断', '突破', '真相', '决断'],
      suit: '宝剑',
      element: '风',
      uprightText: '正位时，思路突然清明，适合做出需要理性的决定。',
      reversedText: '逆位时，判断被情绪或信息偏差干扰，需要更多证据。',
      symbolism: '剑与皇冠象征穿透表象的思维力量。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '宝剑首牌代表心智层面的突破：问题仍在，但你看清了它的结构。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒：清晰是工具，表达时仍需顾及听者的处境。',
      } as ContentBlock,
    ],
  },
  {
    id: 'pentacles-ace',
    summary: '星币首牌：具体的开始，代表资源、健康与实际可行的计划。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['务实', '资源', '起步', '稳定', '机会'],
      suit: '星币',
      element: '土',
      uprightText: '正位时，出现可落地的机会，适合从财务状况与实际条件入手。',
      reversedText: '逆位时，计划停留在构想，缺乏可执行的下一步。',
      symbolism: '从云中递出的钱币，象征现实层面的机会需要被接住并经营。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '星币首牌是四组 Ace 中最落地的一张：它关心的是能不能做成。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒把愿景换算成资源、时间与步骤，而不是停留在期待。',
      } as ContentBlock,
    ],
  },
];
