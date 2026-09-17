/**
 * C12-知识库文章：五行与脏腑类象
 * 文件路径：src/data/knowledge/content/wuxing-zangxiang.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-zangxiang',
  title: '五行与脏腑类象',
  metaDescription: '传统文化中五行与脏腑的关联观念（非医疗建议）。',
  h1: '五行与脏腑类象',
  category: 'wuxing',
  tags: ['五行', '脏腑', '中医'],
  sections: [
    {
      heading: '中医里的五行配脏腑',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '在《黄帝内经》奠定的传统医学框架里，五脏也被纳入五行模型：肝属木、心属火、脾属土、肺属金、肾属水，并对应五官、五体、情志等。这是古人用同一套类比体系解释人体与自然的尝试，是中医理论的历史组成部分。',
        },
        {
          kind: 'paragraph',
          text: '需要强调：这是一种历史上的理论模型，属于传统医学与文化范畴，与现代解剖学、生理学不是同一套语言。它不能替代现代医学诊断。',
        },
      ],
    },
    {
      heading: '五行脏腑对应表',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '五行脏腑类象对照',
          header: ['五行', '脏（阴）', '腑（阳）', '开窍', '情志', '形体'],
          rows: [
            ['木', '肝', '胆', '目', '怒', '筋'],
            ['火', '心', '小肠', '舌', '喜', '脉'],
            ['土', '脾', '胃', '口', '思', '肉'],
            ['金', '肺', '大肠', '鼻', '悲', '皮毛'],
            ['水', '肾', '膀胱', '耳', '恐', '骨'],
          ],
        },
        {
          kind: 'paragraph',
          text: '例如"肝属木、其志为怒"，是把肝的生理功能与情绪活动在类比框架里联系起来。这套语言对理解中医古籍有帮助，但不能直接拿来自我诊断。',
        },
      ],
    },
    {
      heading: '常见误用：从五行跳到"身体有病"',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '这是命律必须重点划界的地方：八字里"木弱"或"水少"，绝不等于你的肝或肾有问题，更不能据此吃药、进补或调理。命理五行与中医脏腑是两套不同语境下的类比，不能互相诊断。',
        },
        {
          kind: 'list',
          items: [
            '不要因为八字"缺木"就认为自己肝不好。',
            '不要因为"水弱"就自行补肾。',
            '身体不适请就医，靠化验、影像与医生判断。',
            '中医调理请由正规中医师辨证，而非网上排盘。',
          ],
        },
      ],
    },
    {
      heading: '为什么命律要专门写这一篇',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '五行与脏腑的对应，是命理网站最容易越界成"健康恐吓"的地方。我们选择把它写清楚：它是一段值得了解的传统医学史知识，但它不是体检报告。任何把八字五行直接对应到身体器官、并据此推销产品或吓唬用户的做法，命律明确反对。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为传统文化科普，不构成任何医疗诊断、治疗、用药或养生建议。如有健康问题，请及时就医。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《黄帝内经·素问》脏象、阴阳应象诸篇整理', confidence: 'legendary' },
    { text: '五行配脏腑类象据传统中医通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['wuxing-basics', 'wuxing-color', 'wuxing-misunderstand', 'why-bazi-limits'],
  confidence: 'legendary',
  disclaimer: '本文为传统文化科普，不构成任何医疗诊断、治疗或养生建议，身体不适请就医。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
