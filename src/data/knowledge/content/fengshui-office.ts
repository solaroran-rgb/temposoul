// src/data/knowledge/content/fengshui-office.ts
import type { KnowledgeArticle } from '@/data/knowledge/schema';

// 6 篇：2 精编（布局/会议室）+ 4 骨架（工位/前台/茶水间/走廊）
export const fengshuiOfficeArticles: KnowledgeArticle[] = [
  {
    slug: 'fengshui-office-layout',
    title: '办公室风水布局指南：气场与效率',
    metaDescription: '办公室风水布局要点：气场流通、动线合理、光线充足。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '办公室风水布局指南',
    category: 'fengshui',
    tags: ['办公', '布局', '效率'],
    sections: [
      {
        heading: '什么是办公室风水',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '办公室是工作与协作的核心空间，传统风水学认为办公室的布局会影响团队的气场与效率。合理的空间规划、光线与动线设计，有助于营造积极的工作氛围。' },
          { kind: 'paragraph', text: '在现代办公环境中，办公室设计强调开放、协作与高效，这与传统风水学的"气流通畅"理念有相通之处。' }
        ]
      },
      {
        heading: '传统怎么用',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '传统风水学认为，办公室的入口宜开阔明亮，象征"纳气"。办公桌宜靠墙摆放，座位背后宜有靠山，避免背对门或窗。' },
          { kind: 'table', header: ['布局要素', '传统建议', '现代对应'], rows: [['入口', '开阔明亮', '宽敞入口'], ['办公桌', '靠墙', '稳固摆放'], ['动线', '流畅', '通道畅通']] }
        ]
      },
      {
        heading: '常见误解',
        level: 2,
        blocks: [
          { kind: 'callout', tone: 'boundary', text: '办公室风水布局不能保证工作效率或职业成功。传统风水学属于民俗文化范畴，不具备科学验证基础。' }
        ]
      },
      {
        heading: '在命律里怎么呈现',
        level: 2,
        blocks: [
          { kind: 'engineRef', enginePath: '/divination/fengshui-test' }
        ]
      }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'verified' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: true,
    relatedSlugs: ['fengshui-office-meeting-room'],
    confidence: 'verified',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-office-meeting-room',
    title: '会议室风水布局指南：沟通与决策',
    metaDescription: '会议室风水布局要点：沟通顺畅、决策高效。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '会议室风水布局指南',
    category: 'fengshui',
    tags: ['办公', '会议室', '沟通'],
    sections: [
      {
        heading: '什么是会议室风水',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '会议室是团队沟通与决策的空间，传统风水学认为会议室的布局应促进交流与协作。' }
        ]
      },
      {
        heading: '传统怎么用',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '会议桌宜采用圆形或椭圆形，象征平等与协作。座位宜均匀分布，避免主次分明。' }
        ]
      },
      {
        heading: '常见误解',
        level: 2,
        blocks: [
          { kind: 'callout', tone: 'boundary', text: '会议室风水布局不能保证决策质量，仅供参考。' }
        ]
      },
      {
        heading: '在命律里怎么呈现',
        level: 2,
        blocks: [
          { kind: 'engineRef', enginePath: '/divination/fengshui-test' }
        ]
      }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'verified' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: true,
    relatedSlugs: ['fengshui-office-layout'],
    confidence: 'verified',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  // 骨架 4 篇（工位/前台/茶水间/走廊）
  {
    slug: 'fengshui-office-workstation',
    title: '工位风水布局指南',
    metaDescription: '工位风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '工位风水布局指南',
    category: 'fengshui',
    tags: ['办公', '工位'],
    sections: [
      { heading: '什么是工位风水', level: 2, blocks: [{ kind: 'paragraph', text: '工位是个人工作的空间，传统风水学认为工位宜保持整洁与舒适。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '工位宜靠墙摆放，避免背对门或窗。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '工位风水布局不能保证工作效率，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-office-layout'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-office-front-desk',
    title: '前台风水布局指南',
    metaDescription: '前台风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '前台风水布局指南',
    category: 'fengshui',
    tags: ['办公', '前台'],
    sections: [
      { heading: '什么是前台风水', level: 2, blocks: [{ kind: 'paragraph', text: '前台是公司的门面，传统风水学认为前台宜开阔明亮。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '前台宜正对入口，保持整洁与明亮。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '前台风水布局不能保证公司形象，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-office-layout'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-office-tea-room',
    title: '茶水间风水布局指南',
    metaDescription: '茶水间风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '茶水间风水布局指南',
    category: 'fengshui',
    tags: ['办公', '茶水间'],
    sections: [
      { heading: '什么是茶水间风水', level: 2, blocks: [{ kind: 'paragraph', text: '茶水间是员工休息与交流的空间，传统风水学认为茶水间宜保持温馨与舒适。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '茶水间宜保持整洁，避免堆放杂物。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '茶水间风水布局不能保证员工满意度，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-office-layout'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-office-corridor',
    title: '走廊风水布局指南',
    metaDescription: '走廊风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '走廊风水布局指南',
    category: 'fengshui',
    tags: ['办公', '走廊'],
    sections: [
      { heading: '什么是走廊风水', level: 2, blocks: [{ kind: 'paragraph', text: '走廊是连接各空间的通道，传统风水学认为走廊宜保持畅通与明亮。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '走廊宜避免堆放杂物，保持光线充足。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '走廊风水布局不能保证公司运势，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-office-layout'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  }
];

export default fengshuiOfficeArticles;
