/**
 * 知识库文章：神煞在命理中的参考权重
 * 文件路径：src/data/knowledge/content/shensha-rational.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-rational',
  title: '神煞在命理中的参考权重',
  metaDescription: '神煞不能替代五行与十神分析，本文说明它的合理定位。',
  h1: '神煞在命理中的参考权重',
  category: 'shensha',
  tags: ['神煞', '方法论'],
  sections: [
    {
      heading: '为什么神煞只能当辅助：权重的三层排序',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统命理内部对各要素权重的排序其实有共识。较严谨的子平派主张：第一看日主强弱与月令旺衰（五行层），第二看十神配置与格局（关系层），第三看用神取舍，最后才把神煞当作旁注。也就是说，神煞在整个分析链条里处于最末位，只在主结构确定后起点缀、印证作用，而不能反过来主导判断。',
        },
        {
          kind: 'list',
          items: [
            '第一层（主）：五行旺衰——日主在月令得令与否、根气深浅。',
            '第二层（主）：十神格局——官、印、财、食、比劫的配置与组合。',
            '第三层（辅）：神煞符号——桃花、驿马、贵人等查表命中项。',
          ],
        },
        {
          kind: 'paragraph',
          text: '为什么这样排？因为五行生克和十神关系是一套自洽的推演系统，内部有规则可循；而神煞名目庞杂、来源不一、说法互相矛盾，缺乏统一推演逻辑。把权重倒置，用一堆神煞标签覆盖掉五行十神的主结构，等于丢掉主干去数枝叶。',
        },
      ],
    },
    {
      heading: '神煞为什么容易被滥用：神秘感与营销',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '神煞之所以在民间流行，恰恰因为它好讲、好听、有画面感。"你命带桃花""你有天乙贵人""你带羊刃要注意血光"——这类话简单直接、戏剧化，容易制造神秘感和紧迫感，非常适合营销话术。相比之下，"日主偏弱、用神取印"这类五行十神分析枯燥、需要解释，传播性差。于是江湖话术倾向于堆砌神煞，用恐吓或许愿来博取信任。',
        },
        {
          kind: 'paragraph',
          text: '识别这种滥用有一个简单标准：凡是只讲神煞、不分析五行十神主结构的，凡是拿单个神煞直接下"你某年必发生某事"结论的，凡是借神煞吓唬你花钱化解的，基本都属于把辅助符号当成了生意道具。真正负责任的命理讨论，一定会先把主结构讲清楚，再把神煞放在"仅供参考"的位置。',
        },
      ],
    },
    {
      heading: '命律怎么定位神煞：只呈现结构，不做断言',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '神煞在命律中只是"查表命中了哪一项"的结构化旁注，权重低于五行与十神。我们不会因为命中某个神煞就给你贴性格、婚恋、祸福标签，更不会推销"化解""改运"服务。神煞是传统文化的一部分，了解它有助于读懂命理话语，但它不能替代对现实的理性判断。',
        },
        {
          kind: 'paragraph',
          text: '在产品呈现上，命律把神煞单独成区，与五行、十神模块视觉上区分开，并统一标注"辅助参考、民俗说法"。命中列表只列查表结果，解释文字简短中性，不放大、不恐吓。这样既尊重传统文献，又不让读者把符号误读成命运判决。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《子平真诠》重五行十神、轻神煞的方法论整理', confidence: 'legendary' },
    { text: '对神煞滥用与营销话术的批判参考现代理性命理普及读物', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shensha-overview',
    'shishen-overview',
    'wuxing-wangshuai',
    'why-folk-vs-fact',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理方法论科普，神煞定位仅作文化说明，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
