/**
 * C12-知识库文章：置信度体系：verified / probable / legendary 是什么意思
 * 文件路径：src/data/knowledge/content/why-confidence.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-confidence',
  title: '置信度体系：verified / probable / legendary 是什么意思',
  metaDescription: '命律为每个维度标注可核验/较可靠/民俗，本文解释三级置信度的含义。',
  h1: '置信度体系：verified / probable / legendary 是什么意思',
  category: 'boundary',
  tags: ['置信度', '产品理念'],
  sections: [
    {
      heading: '为什么要给每条结论贴标签',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命理内容天然混杂着三类东西：一类是可以用历法规则复算的，比如某年某月的干支、某个节气的交节时刻；一类是历代文献反复出现、但没有现代实证依据的说法，比如十神性情、神煞吉凶；还有一类是民间口耳相传、版本不一的附会。如果把它们混在一起讲，读者无法判断哪些该当真、哪些只是文化背景。',
        },
        {
          kind: 'paragraph',
          text: '命律因此引入三级置信度标签，挂在文章、维度和引用来源上。它不是科学真伪的判决，而是一个"证据强度提示"：告诉你这条内容更接近哪一类。',
        },
      ],
    },
    {
      heading: '三级标签的含义',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '三级置信度对照',
          header: ['标签', '含义', '典型内容', '可否复算'],
          rows: [
            [
              'verified',
              '可核验、有公开规则',
              '干支换算、节气、真太阳时校正、历法日期',
              '可逐项复算',
            ],
            [
              'probable',
              '较可靠、文献主流但无实证',
              '十神关系、五行生克顺序、纳音查法',
              '可按规则推导，解释属传统',
            ],
            ['legendary', '民俗/传说/附会', '神煞吉凶、宜忌断语、改运说法', '无统一规则，版本不一'],
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '置信度只表示"证据与规则的明确程度"，不表示内容是否真实有效。legendary 不等于错误，probable 也不等于被科学证实，它只是提醒你这是一类传统说法。',
        },
      ],
    },
    {
      heading: '怎么读这个标签',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '看到 verified，你可以把它当成一个可以自己验算的计算结果：输入出生时间，按规则应得这组干支。看到 probable，你可以理解为"这是传统命理内部相对一致的规则推导"，比如日主庚金遇乙木为正财，这是按五行生克定义出来的关系标签。看到 legendary，则应把它放回文化语境里阅读：古人这么说过，流传至今，但它既不可复算，也不应被当成事实。',
        },
        {
          kind: 'list',
          items: [
            '不要把 legendary 当建议去执行（如"今天忌出行"）。',
            '可以把 verified 当工具去核对（如节气、日柱）。',
            '对 probable 保持"这是一种解释框架"的意识。',
          ],
        },
      ],
    },
    {
      heading: '标签会被误用吗',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '会。最大的误用是把 verified 误读成"命律认证为真"。事实上 verified 只针对"计算是否符合历法规则"，不针对"命运是否如此"。排盘正确不等于预测正确。这也是为什么我们把置信度和边界提示放在同一层：规则可核对，解释永远是民俗。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '置信度标签不构成医疗、法律、投资或任何人生决策依据。它只帮助你判断一条内容应被当成计算结果、传统规则还是民间传说来读。',
        },
      ],
    },
  ],
  sources: [
    { text: '命律内容分级规范（内部）', confidence: 'verified' },
    { text: '传统历法与干支规则可复算部分据通行历表整理', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'why-no-fortune-score',
    'why-folk-vs-fact',
    'why-data-source',
    'why-rational-decl',
  ],
  confidence: 'verified',
  disclaimer: '本文为产品方法论说明，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
