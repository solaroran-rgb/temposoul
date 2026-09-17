// src/data/knowledge/content/fengshui-shop.ts
import type { KnowledgeArticle } from '@/data/knowledge/schema';

// 6 篇：2 精编（大门/陈列）+ 4 骨架（收银台/试衣间/仓库/橱窗）
export const fengshuiShopArticles: KnowledgeArticle[] = [
  {
    slug: 'fengshui-shop-entrance',
    title: '商铺大门风水布局指南：纳气与招客',
    metaDescription: '商铺大门风水布局要点：纳气、招客、明堂开阔。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '商铺大门风水布局指南',
    category: 'fengshui',
    tags: ['商铺', '大门', '纳气'],
    sections: [
      {
        heading: '什么是商铺大门风水',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '商铺大门是顾客进入的第一印象，传统风水学认为大门是"纳气"的主要通道，直接影响商铺的客流量与经营状况。' },
          { kind: 'paragraph', text: '在现代商业环境中，商铺大门的设计强调醒目、整洁与易达性，这与传统风水学的"明堂开阔"理念一致。' }
        ]
      },
      {
        heading: '传统怎么用',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '传统风水学认为，商铺大门宜开阔明亮，避免被遮挡或狭窄。大门前方宜保持整洁，避免堆放杂物，以利于"纳气"。' },
          { kind: 'table', header: ['布局要素', '传统建议', '现代对应'], rows: [['大门', '开阔明亮', '宽敞入口'], ['前方', '整洁', '无遮挡'], ['招牌', '醒目', '清晰可见']] }
        ]
      },
      {
        heading: '常见误解',
        level: 2,
        blocks: [
          { kind: 'callout', tone: 'boundary', text: '商铺大门风水布局不能保证客流量或经营成功。传统风水学属于民俗文化范畴，不具备科学验证基础。' }
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
    relatedSlugs: ['fengshui-shop-display'],
    confidence: 'verified',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-shop-display',
    title: '商铺陈列风水布局指南：展示与吸引',
    metaDescription: '商铺陈列风水布局要点：展示、吸引、动线。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '商铺陈列风水布局指南',
    category: 'fengshui',
    tags: ['商铺', '陈列', '展示'],
    sections: [
      {
        heading: '什么是商铺陈列风水',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '商铺陈列是商品展示的核心，传统风水学认为陈列布局应吸引顾客注意，促进购买行为。' }
        ]
      },
      {
        heading: '传统怎么用',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '传统风水学认为，商品陈列宜层次分明，主推商品宜放在显眼位置。' }
        ]
      },
      {
        heading: '常见误解',
        level: 2,
        blocks: [
          { kind: 'callout', tone: 'boundary', text: '商铺陈列风水布局不能保证销售额，仅供参考。' }
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
    relatedSlugs: ['fengshui-shop-entrance'],
    confidence: 'verified',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  // 骨架 4 篇（收银台/试衣间/仓库/橱窗）
  {
    slug: 'fengshui-shop-cashier',
    title: '收银台风水布局指南',
    metaDescription: '收银台风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '收银台风水布局指南',
    category: 'fengshui',
    tags: ['商铺', '收银台'],
    sections: [
      { heading: '什么是收银台风水', level: 2, blocks: [{ kind: 'paragraph', text: '收银台是交易核心，传统风水学认为收银台宜位于财位，保持整洁。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '收银台宜避免正对大门或卫生间。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '收银台风水布局不能保证营业额，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-shop-entrance'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-shop-fitting-room',
    title: '试衣间风水布局指南',
    metaDescription: '试衣间风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '试衣间风水布局指南',
    category: 'fengshui',
    tags: ['商铺', '试衣间'],
    sections: [
      { heading: '什么是试衣间风水', level: 2, blocks: [{ kind: 'paragraph', text: '试衣间是顾客体验的空间，传统风水学认为试衣间宜保持私密与舒适。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '试衣间宜光线柔和，保持整洁。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '试衣间风水布局不能保证成交率，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-shop-entrance'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-shop-warehouse',
    title: '仓库风水布局指南',
    metaDescription: '仓库风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '仓库风水布局指南',
    category: 'fengshui',
    tags: ['商铺', '仓库'],
    sections: [
      { heading: '什么是仓库风水', level: 2, blocks: [{ kind: 'paragraph', text: '仓库是商品存储的空间，传统风水学认为仓库宜保持整洁有序。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '仓库宜分类存放，避免杂乱堆积。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '仓库风水布局不能保证库存安全，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-shop-entrance'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-shop-window',
    title: '橱窗风水布局指南',
    metaDescription: '橱窗风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '橱窗风水布局指南',
    category: 'fengshui',
    tags: ['商铺', '橱窗'],
    sections: [
      { heading: '什么是橱窗风水', level: 2, blocks: [{ kind: 'paragraph', text: '橱窗是展示商品与吸引顾客的重要窗口，传统风水学认为橱窗宜保持明亮整洁。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '橱窗宜定期更换展示，保持新鲜感。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '橱窗风水布局不能保证客流量，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-shop-entrance'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  }
];

export default fengshuiShopArticles;
