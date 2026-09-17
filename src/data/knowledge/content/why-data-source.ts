/**
 * C12-知识库文章：我们的排盘数据从哪来
 * 文件路径：src/data/knowledge/content/why-data-source.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-data-source',
  title: '我们的排盘数据从哪来',
  metaDescription: '历法、节气、真太阳时校正——命律排盘数据链路与校验方式说明。',
  h1: '我们的排盘数据从哪来',
  category: 'boundary',
  tags: ['数据', '排盘'],
  sections: [
    {
      heading: '排盘的第一步：把时间转成干支',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律排盘的输入是公历（或可转公历的农历）出生日期与时间。系统先把它换算成儒略日或连续计数，再按六十甲子循环推算日柱；年柱以立春为界、月柱以节气中的"节"为界，时柱按十二时辰并可选真太阳时校正。整条链路不依赖"大师经验"，而是靠公开的历法规则与天文数据。',
        },
        {
          kind: 'paragraph',
          text: '这意味着：如果你怀疑某一柱排错了，可以拿同一天的万年历核对——对得上就是数据正确，对不上就是我们的算法有 bug，应当报给我们修。',
        },
      ],
    },
    {
      heading: '数据来源与校验',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '数据链路一览',
          header: ['环节', '依据', '可校验性'],
          rows: [
            ['节气交节时刻', '现代天文算法（太阳黄经）', '可与权威历表比对'],
            ['年柱换年', '立春为界（传统规则）', '可按交节时刻判断'],
            ['月柱换月', '十二节（立春/惊蛰…）', '可按节气表核对'],
            ['日柱干支', '六十甲子连续循环', '可对照万年历'],
            ['时柱', '十二时辰 + 可选真太阳时', '经度校正可复算'],
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '真太阳时是可选项，仅影响时柱及其衍生判断；不影响年月日三柱。我们默认按地方平时排盘，并在页面上明确标注是否做了真太阳时校正。',
        },
      ],
    },
    {
      heading: '哪些不是"数据"，是解释',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '五行缺什么、十神是什么、用神取什么，这些不是"输入数据"，而是在排好的干支之上按流派规则做的推导。不同流派对用神、调候、格局的取法可能不同，因此这部分我们标注为民俗解释，置信度多为 probable 或 legendary，而不是 verified。',
        },
        {
          kind: 'list',
          items: [
            '排盘干支 = 数据层（可核对）。',
            '五行计数 = 由数据直接统计（可核对）。',
            '十神/用神/格局 = 解释层（流派差异，民俗参考）。',
          ],
        },
      ],
    },
    {
      heading: '发现排错了怎么办',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '如果你对照万年历发现年、月、日、时柱与排盘结果不一致，请记下出生公历时间、出生地经度（用于真太阳时判断）和你看到的错误结果，反馈给我们。数据层的错误是 bug，应当被修复；解释层的分歧则会以"多流派参考"的方式呈现，不会被包装成唯一答案。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为数据来源说明。排盘结果属民俗参考，不构成任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '现代天文历算与二十四节气算法普及资料', confidence: 'verified' },
    { text: '《协纪辨方书》《渊海子平》关于节气换月、立春换年的传统规则', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['why-confidence', 'paipan-overview', 'paipan-jieqi', 'paipan-true-solar-time'],
  confidence: 'verified',
  disclaimer: '本文为数据链路说明，排盘内容属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
