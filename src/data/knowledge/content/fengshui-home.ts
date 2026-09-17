// src/data/knowledge/content/fengshui-home.ts
import type { KnowledgeArticle } from '@/data/knowledge/schema';

// 6 篇：2 精编（客厅/卧室）+ 4 骨架（书房/厨房/卫生间/阳台）
export const fengshuiHomeArticles: KnowledgeArticle[] = [
  {
    slug: 'fengshui-home-living-room',
    title: '客厅风水布局指南：明堂开阔与气场流通',
    metaDescription: '客厅风水布局要点：明堂开阔、光线充足、动线流畅。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '客厅风水布局指南',
    category: 'fengshui',
    tags: ['家居', '客厅', '明堂'],
    sections: [
      {
        heading: '什么是客厅风水',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '客厅是家庭活动的核心区域，传统风水学认为客厅代表家中的"明堂"，是气场汇聚与流通的主要场所。明堂开阔则气聚，气聚则家和，这是传统风水学对客厅功能的基本认知。' },
          { kind: 'paragraph', text: '在现代居住环境中，客厅不仅是家庭成员日常交流的空间，也是接待客人的场所。传统风水学中的许多理念，如"藏风聚气""明堂开阔"等，与现代室内设计中的"空间通透""动线合理"有异曲同工之处。' },
          { kind: 'list', items: ['明堂开阔：客厅宜宽敞明亮，避免过度堆砌家具', '光线充足：自然采光与人工照明结合，避免阴暗角落', '动线流畅：行走路径畅通，避免家具阻挡主要通道'] }
        ]
      },
      {
        heading: '传统怎么用',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '传统风水学中，客厅布局讲究"藏风聚气"，通过家具摆放与空间规划营造舒适的气场环境。具体而言，沙发宜靠实墙摆放，象征"有靠山"，避免背对门窗造成不安感。' },
          { kind: 'paragraph', text: '电视柜与沙发之间宜保持适当距离，既保证观看舒适度，又避免空间压迫感。绿植点缀可增加生气，但应避免过多尖锐植物，如仙人掌等，以免形成"尖角煞"。' },
          { kind: 'table', header: ['布局要素', '传统建议', '现代对应'], rows: [['沙发位置', '靠实墙', '靠墙摆放，稳固舒适'], ['采光', '光线充足', '自然光+暖光照明'], ['动线', '流畅无阻', '通道宽度≥90cm']] },
          { kind: 'paragraph', text: '此外，客厅的色彩搭配也讲究五行平衡。传统风水学认为，客厅主色宜根据家庭成员命卦选择，如命卦属木者宜用绿色系，属火者宜用红色系等。但现代设计更注重整体美感与个人喜好，五行色彩可作为参考而非绝对准则。' }
        ]
      },
      {
        heading: '常见误解',
        level: 2,
        blocks: [
          { kind: 'callout', tone: 'boundary', text: '客厅风水布局不能保证财运、健康或家庭和睦。传统风水学属于民俗文化范畴，其理念源于古人对居住环境的经验总结，不具备科学验证基础。本文所有内容仅供文化参考，不构成现实决策依据。' },
          { kind: 'paragraph', text: '特别提醒：切勿因风水布局而忽视实际居住安全，如电线布置、消防通道等。任何风水建议都应以安全、舒适、实用为前提。' }
        ]
      },
      {
        heading: '在命律里怎么呈现',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '如需进一步了解个人住宅的风水格局分析，可尝试以下工具：' },
          { kind: 'engineRef', enginePath: '/divination/fengshui-test' }
        ]
      }
    ],
    sources: [{ text: '《阳宅三要》赵九峰，清', confidence: 'verified' }, { text: '《八宅明镜》通书本', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: true,
    relatedSlugs: ['fengshui-home-bedroom', 'fengshui-home-study'],
    confidence: 'verified',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-home-bedroom',
    title: '卧室风水布局指南：安宁与私密',
    metaDescription: '卧室风水布局要点：安宁、私密、光线柔和。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '卧室风水布局指南',
    category: 'fengshui',
    tags: ['家居', '卧室', '安宁'],
    sections: [
      {
        heading: '什么是卧室风水',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '卧室是休息与恢复精力的核心空间，传统风水学认为卧室应保持安宁、私密，避免外界干扰。床的位置、朝向、光线与色彩都会影响居住者的睡眠质量与精神状态。' },
          { kind: 'paragraph', text: '在现代居住环境中，卧室设计强调舒适与私密，这与传统风水学的"静养"理念高度一致。合理的空间规划、柔和的光线、适宜的温湿度，都是优质睡眠的基础。' },
          { kind: 'list', items: ['床宜靠墙：象征稳定与安全感', '避免对门：减少外界干扰', '光线柔和：避免强光直射'] }
        ]
      },
      {
        heading: '传统怎么用',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '传统风水学认为，床的摆放是卧室布局的核心。床宜靠实墙摆放，象征"有靠山"，床头不宜对门、对窗，避免气流直冲。床底宜保持整洁，避免堆放杂物，以免影响气场流通。' },
          { kind: 'paragraph', text: '卧室色彩宜柔和温暖，避免过于鲜艳或暗沉。传统风水学认为，暖色调有助于放松身心，冷色调则可能影响睡眠质量。但现代研究表明，色彩偏好因人而异，应以个人舒适度为优先。' },
          { kind: 'table', header: ['布局要素', '传统建议', '现代对应'], rows: [['床的位置', '靠实墙', '靠墙摆放，稳固舒适'], ['光线', '柔和', '可调节灯光'], ['色彩', '暖色', '柔和中性色']] }
        ]
      },
      {
        heading: '常见误解',
        level: 2,
        blocks: [
          { kind: 'callout', tone: 'boundary', text: '卧室风水布局不能保证睡眠质量或健康。传统风水学属于民俗文化范畴，不具备科学验证基础。睡眠质量受多种因素影响，包括作息规律、环境噪音、心理状态等。' },
          { kind: 'paragraph', text: '特别提醒：切勿因风水布局而忽视实际健康问题。如长期失眠或身体不适，应及时就医。' }
        ]
      },
      {
        heading: '在命律里怎么呈现',
        level: 2,
        blocks: [
          { kind: 'paragraph', text: '如需进一步了解个人住宅的风水格局分析，可尝试以下工具：' },
          { kind: 'engineRef', enginePath: '/divination/fengshui-test' }
        ]
      }
    ],
    sources: [{ text: '《阳宅三要》赵九峰，清', confidence: 'verified' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: true,
    relatedSlugs: ['fengshui-home-living-room', 'fengshui-home-study'],
    confidence: 'verified',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  // 骨架 4 篇（书房/厨房/卫生间/阳台）
  {
    slug: 'fengshui-home-study',
    title: '书房风水布局指南',
    metaDescription: '书房风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '书房风水布局指南',
    category: 'fengshui',
    tags: ['家居', '书房'],
    sections: [
      { heading: '什么是书房风水', level: 2, blocks: [{ kind: 'paragraph', text: '书房是学习与工作的空间，传统风水学认为书房应保持安静、明亮，避免干扰。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '书桌宜靠墙摆放，座位背后宜有靠山，避免背对门窗。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '书房风水布局不能保证学业或事业成功，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-home-living-room'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-home-kitchen',
    title: '厨房风水布局指南',
    metaDescription: '厨房风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '厨房风水布局指南',
    category: 'fengshui',
    tags: ['家居', '厨房'],
    sections: [
      { heading: '什么是厨房风水', level: 2, blocks: [{ kind: 'paragraph', text: '厨房是烹饪与饮食的空间，传统风水学认为厨房代表家庭的"财库"，宜保持整洁与明亮。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '炉灶宜靠墙摆放，避免对门对窗。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '厨房风水布局不能保证财运，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-home-living-room'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-home-bathroom',
    title: '卫生间风水布局指南',
    metaDescription: '卫生间风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '卫生间风水布局指南',
    category: 'fengshui',
    tags: ['家居', '卫生间'],
    sections: [
      { heading: '什么是卫生间风水', level: 2, blocks: [{ kind: 'paragraph', text: '卫生间是清洁与排污的空间，传统风水学认为卫生间宜保持干燥与通风。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '卫生间门宜常闭，保持通风干燥。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '卫生间风水布局不能保证健康，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-home-living-room'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  },
  {
    slug: 'fengshui-home-balcony',
    title: '阳台风水布局指南',
    metaDescription: '阳台风水布局要点。本文为传统文化科普，非科学断言，仅供参考。',
    h1: '阳台风水布局指南',
    category: 'fengshui',
    tags: ['家居', '阳台'],
    sections: [
      { heading: '什么是阳台风水', level: 2, blocks: [{ kind: 'paragraph', text: '阳台是连接室内外的空间，传统风水学认为阳台宜保持开阔与整洁。' }] },
      { heading: '传统怎么用', level: 2, blocks: [{ kind: 'paragraph', text: '阳台宜避免堆放杂物，保持通风。' }] },
      { heading: '常见误解', level: 2, blocks: [{ kind: 'callout', tone: 'boundary', text: '阳台风水布局不能保证运势，仅供参考。' }] },
      { heading: '在命律里怎么呈现', level: 2, blocks: [{ kind: 'engineRef', enginePath: '/divination/fengshui-test' }] }
    ],
    sources: [{ text: '《阳宅三要》', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: 'content-team',
    ready: false,
    relatedSlugs: ['fengshui-home-living-room'],
    confidence: 'probable',
    disclaimer: '本文为传统文化科普，不构成科学断言或现实决策建议。',
    readingMinutes: 3,
    updatedAt: '2026-09-16'
  }
];

export default fengshuiHomeArticles;
