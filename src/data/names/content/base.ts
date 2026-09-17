import type { ContentBlock } from '@/data/knowledge/schema';
import type { ContentPatch } from '@/data/content/types';

/** 首批 12 字档案（字义为通行字义，不附会吉凶断言） */
export const NAME_CHAR_PATCHES: ContentPatch[] = [
  {
    id: '安',
    summary: '安：安定、安稳，常用作表达平稳与守护之意。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '安定、平安、安置', pairSuggestions: ['安辰', '安宇', '安恩'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「安」本义为安定、平稳，在名字中多表达生活与心绪的稳定感。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '搭配上宜避免与字义相冲的字并列，整体读音以顺口、无歧义为要。',
      } as ContentBlock,
    ],
  },
  {
    id: '辰',
    summary: '辰：时辰、星辰，也指地支第五位。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '时辰、星辰、清晨', pairSuggestions: ['辰宇', '辰安', '辰瑞'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「辰」兼有时间与星象两层含义，用于名字常见取「时光、星辰」的意象。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '因与地支相关，部分民俗命名习惯会结合生辰考量，此处不作吉凶判断。',
      } as ContentBlock,
    ],
  },
  {
    id: '恩',
    summary: '恩：恩惠、情义，表达感念与厚待。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '恩惠、情义、厚待', pairSuggestions: ['恩宇', '恩泽', '恩琳'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「恩」以情义为核心，常用于表达受惠与回馈的价值取向。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '此类字寓意明确，搭配时宜注意整体气质是否过于直白。',
      } as ContentBlock,
    ],
  },
  {
    id: '涵',
    summary: '涵：包容、涵养，也有浸润之意。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '包容、涵养、浸润', pairSuggestions: ['涵宇', '涵恩', '涵婷'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「涵」强调内在的容纳与修养，是名字中偏内敛的一类用字。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '其水部意象常与流动、柔和的表达相配。',
      } as ContentBlock,
    ],
  },
  {
    id: '杰',
    summary: '杰：才能出众之人，也指特异、突出。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '杰出、出众、才能', pairSuggestions: ['杰辰', '杰宇', '杰瑞'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「杰」本义为才智出众，是表达期许的常用字。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '注意：此类字属于价值取向表达，不构成对未来成就的判断。',
      } as ContentBlock,
    ],
  },
  {
    id: '琳',
    summary: '琳：美玉，也指珍贵之物。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '美玉、珍贵', pairSuggestions: ['琳涵', '琳婷', '琳恩'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「琳」以玉为意象，常用于表达珍贵、温润的气质。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '玉部字在名字中偏雅致，搭配宜避免同部首重复过多。',
      } as ContentBlock,
    ],
  },
  {
    id: '明',
    summary: '明：明亮、清楚，也有懂得、明达之意。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '明亮、清楚、明达', pairSuggestions: ['明宇', '明辰', '明泽'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「明」兼有光亮与清明的双重意象，是跨性别通用的常见字。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '其语义清晰，不易产生歧义，搭配宽容度高。',
      } as ContentBlock,
    ],
  },
  {
    id: '瑞',
    summary: '瑞：祥瑞、吉兆，也指玉制信物。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '祥瑞、吉兆、信物', pairSuggestions: ['瑞辰', '瑞泽', '瑞琳'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「瑞」传统上指祥瑞之兆，在现代用字中多取其美好寓意。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '提示：字义为文化寓意，不代表对现实结果的推断。',
      } as ContentBlock,
    ],
  },
  {
    id: '婷',
    summary: '婷：美好、亭亭玉立的样子。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '美好、姿态优美', pairSuggestions: ['婷涵', '婷琳', '婷恩'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「婷」形容姿态美好，多用于表达柔美、端庄的气质。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '此类形容字搭配时宜配一个语义较实的字以平衡。',
      } as ContentBlock,
    ],
  },
  {
    id: '宇',
    summary: '宇：屋檐、空间，引申为气度与天地。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '空间、气度、天地', pairSuggestions: ['宇辰', '宇安', '宇泽'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「宇」由屋檐引申为空间与气度，是名字中取「开阔」意象的常用字。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '笔画少、读音稳，与其他字组合的兼容度较高。',
      } as ContentBlock,
    ],
  },
  {
    id: '泽',
    summary: '泽：水聚集之地，引申为润泽、恩泽。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '润泽、恩泽、光泽', pairSuggestions: ['泽宇', '泽辰', '泽恩'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「泽」兼具水的润泽与惠及他人两层意思，是寓意柔和的常用字。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '康熙笔画按繁体字形计为 17 画，页面已明示计法。',
      } as ContentBlock,
    ],
  },
  {
    id: '志',
    summary: '志：心意、志向，也有记载之意。',
    confidence: 'probable',
    sourceRef: ['《康熙字典》通行笔画与五行归类', '汉语通用字义'],
    domainFields: { meaning: '志向、心意、记志', pairSuggestions: ['志明', '志宇', '志杰'] },
    blocks: [
      {
        kind: 'paragraph',
        text: '「志」指向内心的方向与坚持，是表达自我要求的常用字。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '搭配宜避免与含义过于相近的字叠加导致语义重复。',
      } as ContentBlock,
    ],
  },
];
