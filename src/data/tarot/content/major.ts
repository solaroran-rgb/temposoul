import type { ContentBlock } from '@/data/knowledge/schema';
import type { ContentPatch } from '@/data/content/types';

/** 大阿卡纳首批 6 条（id 与 codegen 骨架 slug 对齐） */
export const MAJOR_PATCHES: ContentPatch[] = [
  {
    id: 'the-fool',
    summary: '愚者：一段旅程的起点，象征未经雕琢的可能性与愿承担的未知。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['开始', '冒险', '天真', '未知', '信任'],
      element: '风',
      astrology: '天王星',
      uprightText:
        '正位时，这张牌指向一个新阶段的开启。它鼓励以开放、未被经验束缚的心态迈出第一步，接受计划之外的变化。',
      reversedText:
        '逆位时，提示准备不足：不是不能出发，而是需要先看清脚下的路，避免把鲁莽误当作勇气。',
      symbolism: '悬崖边的旅人、小包袱与白玫瑰，分别代表行囊、纯真与本能的提醒。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '愚者是大阿卡纳序列的起点，象征一段旅程尚未展开时的状态：你拥有出发的可能，但还没有经验带来的包袱。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒的是一种姿态——愿意在信息不完全时行动，同时对自己的选择负责。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-magician',
    summary: '魔术师：把已有的资源转化为行动，强调专注与意志的落地。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['创造', '专注', '资源', '沟通', '行动力'],
      element: '风',
      astrology: '水星',
      uprightText: '正位时，表示你需要的条件大多已具备，关键在于聚焦与执行。',
      reversedText: '逆位时，提示精力分散或夸大其词：能量未落到具体事情上。',
      symbolism: '桌上的四元素象征可用资源，一手向上一手向下，寓意念头落地为行动。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '魔术师的核心是「转化」：想法、资源、能力都在手边，缺的是把它们串起来的专注。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它常出现在需要主动沟通、主动争取的情境中，强调先做再完善。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-high-priestess',
    summary: '女祭司：尚未说出的答案，代表直觉、等待与内在的秩序。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['直觉', '静默', '内在', '等待', '潜意识'],
      element: '水',
      astrology: '月亮',
      uprightText: '正位时，提示先向内看：答案已在，只是尚未到说出口的时机。',
      reversedText: '逆位时，提示忽视内在声音，或被表面的信息牵着走。',
      symbolism: '两根柱子与帷幕代表显与隐的分界，书卷半掩象征未完全揭示的知识。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '女祭司代表一种「不急于表态」的智慧：事情还在成形，过早定义反而失真。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它鼓励记录感受、留出安静的时间，让判断在沉淀后自然浮现。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-empress',
    summary: '皇后：生长与滋养，代表丰盛、耐心与对过程的照料。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['丰盛', '滋养', '耐心', '创造', '安稳'],
      element: '土',
      astrology: '金星',
      uprightText: '正位时，表示付出正在积累成果，适合以长期心态培育人与事。',
      reversedText: '逆位时，提示过度付出或照料失衡，需要先照顾好自己。',
      symbolism: '麦田与河流象征生长的周期，提醒收获需要时间而非催促。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '皇后的丰盛不是突然降临，而是被持续照料之后的结果。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒关注生活中的滋养来源：休息、关系、身体的感受，都是长期生产力的基础。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-hierophant',
    summary: '教皇：规则与传承，代表学习、体系与被验证过的方法。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['传统', '学习', '规范', '指引', '体系'],
      element: '土',
      astrology: '金星',
      uprightText: '正位时，适合寻求经验者的建议，或回到被验证过的方法上。',
      reversedText: '逆位时，提示规则已不合时宜，需要审视是否只是惯性在维持。',
      symbolism: '两把钥匙象征可被传授的知识，也暗示学习需要被引领。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '教皇代表「体系化」：当个人经验不足时，借鉴成熟路径往往更高效。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它同时提醒：体系是工具而非答案，适用性需要随时间重新检验。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-lovers',
    summary: '恋人：选择与一致，代表价值判断与关系的方向。',
    confidence: 'legendary',
    sourceRef: ['塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      keywords: ['选择', '一致', '关系', '价值', '结合'],
      element: '风',
      astrology: '水星',
      uprightText: '正位时，指向需要明确站位的抉择：按真实的价值取向选择，而非只权衡得失。',
      reversedText: '逆位时，提示价值不一致或回避选择，导致关系与事情悬而未决。',
      symbolism: '两条路径与天使的形象，寓意选择后的整合与承担。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '恋人牌的核心不是感情本身，而是「你愿意为什么负责」的选择。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒把选择说清楚：模糊的善意往往比明确的拒绝更消耗关系。',
      } as ContentBlock,
    ],
  },
];
