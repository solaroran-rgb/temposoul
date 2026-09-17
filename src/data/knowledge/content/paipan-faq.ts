/**
 * C12-知识库文章：排盘常见问题 FAQ
 * 文件路径：src/data/knowledge/content/paipan-faq.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'paipan-faq',
  title: '排盘常见问题 FAQ',
  metaDescription:
    '立春前出生属什么？农历生日怎么排？23点后生时按哪天？真太阳时要不要校？本问答集中解答排盘最常被问到的十个问题。',
  h1: '排盘常见问题 FAQ',
  category: 'paipan',
  tags: ['FAQ', '排盘', '常见问题'],
  sections: [
    {
      heading: '关于换年、换月',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '问：1 月出生，年柱按今年还是去年？答：按是否过立春。立春前出生，年柱归上一年。',
            '问：农历正月初一就换年吗？答：不换。命理换年看立春，不看春节。',
            '问：公历每月 1 日换月吗？答：不换。月令按十二"节"切换。',
            '问：闰月怎么排？答：先把农历闰月换算回公历那一天，再按节气排月令，不认闰月。',
          ],
        },
        {
          kind: 'paragraph',
          text: '这些问题的根源都是同一处混淆：把公历或农历的"自然分界"当成了干支历分界。一旦记住"年看立春、月看节气"，大部分疑问就迎刃而解。',
        },
      ],
    },
    {
      heading: '关于时辰与时间校正',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '问：23 点后出生，时柱和日柱怎么算？答：涉及早夜子时争议，不同排盘口径不同，需按所用体系明确说明。',
            '问：一定要校真太阳时吗？答：东部接近东经120度者差别小；西部出生者校正量大，建议校。',
            '问：1986–1991 年出生要注意什么？答：当年实行夏令时，报的钟点可能被拨快过，需回拨校正。',
            '问：在国外出生怎么排？答：先把当地时间按时区转成对应北京时间，再做真太阳时校正。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '时间校正只改变排盘数据（主要是时柱），不改变命运。不必因为"没校真太阳时"而怀疑整个排盘；也不必因为校了时就得到什么新结论。',
        },
      ],
    },
    {
      heading: '关于结果与使用边界',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '问：同年同月同日同时生的人命运一样吗？答：不一样。八字相同只说明时间符号相同，时代、地域、家庭、选择都不同。',
            '问：排盘软件说我"缺五行"，要补吗？答：缺某五行只表示原局不出现，不等于要补，更不对应健康问题。',
            '问：排完盘能直接看运势吗？答：排盘只给干支，后续十神、大运、格局属民俗解释，无唯一答案。',
            '问：八字能看病、看官司、看投资吗？答：不能。健康找医生、法律找律师、投资靠研究，命理不越界。',
          ],
        },
        {
          kind: 'paragraph',
          text: '把这十条记住，你就不会被花里胡哨的排盘宣传带偏。排盘是一件可以核对的技术事，把数据弄对，然后清醒地对待后面的民俗解释——这就是最理性的用法。',
        },
      ],
    },
  ],
  sources: [{ text: '据本站排盘各篇及《渊海子平》排起四柱法通说汇总', confidence: 'legendary' }],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'paipan-overview',
    'paipan-jieqi',
    'paipan-shichen',
    'paipan-true-solar-time',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为排盘科普问答，不构成医疗、法律、投资或任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
