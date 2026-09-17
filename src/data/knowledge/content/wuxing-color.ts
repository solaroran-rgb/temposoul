/**
 * C12-知识库文章：五行与颜色、方位的对应关系
 * 文件路径：src/data/knowledge/content/wuxing-color.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-color',
  title: '五行与颜色、方位的对应关系',
  metaDescription: '五行配五色五方，本文列出对照表并说明其文化来源。',
  h1: '五行与颜色、方位的对应关系',
  category: 'wuxing',
  tags: ['五行', '类象'],
  sections: [
    {
      heading: '五行配类象：一张古老的对照表',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '古人把五行延伸到颜色、方位、季节、味道、脏腑等一整套对应关系上，形成所谓"类象"系统。这套对应在《吕氏春秋》《淮南子》《黄帝内经》中已有较完整的记载，是古代思维用一个模型统一解释世界的尝试。',
        },
        {
          kind: 'paragraph',
          text: '它本质上是一种分类法：把性质相近的事物归入同一行，再用生克关系解释它们之间的联系。理解为"文化分类"即可，不必当成现代科学的因果关系。',
        },
      ],
    },
    {
      heading: '五色五方对照表',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '五行类象对照',
          header: ['五行', '五色', '五方', '五季', '五味', '五音'],
          rows: [
            ['木', '青/绿', '东', '春', '酸', '角'],
            ['火', '赤/红', '南', '夏', '苦', '徵'],
            ['土', '黄', '中', '长夏/四季', '甘', '宫'],
            ['金', '白', '西', '秋', '辛', '商'],
            ['水', '黑/玄', '北', '冬', '咸', '羽'],
          ],
        },
        {
          kind: 'paragraph',
          text: '例如木配东方、春天、青色、酸味——因为东方春来草木青绿。这套对应更多是联想与象征，而非实测结论。',
        },
      ],
    },
    {
      heading: '怎么看待"幸运色"说法',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"你五行缺木所以要穿绿色"这类说法，是把类象表庸俗化成穿搭处方。类象表是文化隐喻，不是穿搭指南；喜欢什么颜色，按审美与场合决定即可。',
        },
        {
          kind: 'paragraph',
          text: '现代生活中，颜色与方位的选择受实用、审美、安全等因素影响远大于这套象征体系。把它当作传统文化知识了解即可，不必上升为必须遵守的规则。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律在五行类象相关页面会列出这张表，并注明其文化来源与象征性质。我们不基于它生成"今日幸运色""宜去东方"之类的指令，也不销售相关颜色商品。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为五行类象文化科普。颜色、方位对应属传统象征体系，不构成任何穿搭、出行、装修或投资建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《黄帝内经·素问》《吕氏春秋》《淮南子》五行配类章节整理', confidence: 'legendary' },
    { text: '五色五方对应据传统通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['wuxing-basics', 'wuxing-zangxiang', 'wuxing-buyi', 'wuxing-misunderstand'],
  confidence: 'legendary',
  disclaimer: '本文为传统文化科普，类象对应不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
