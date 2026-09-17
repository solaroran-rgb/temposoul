//  ClassicMeta + classicsArticles (KnowledgeArticle), 含【原文】/【注】heading
// ============================================================
import type { KnowledgeArticle, ContentBlock } from '@/data/knowledge/schema';

export interface ClassicMeta {
  readonly slug: string;
  readonly title: string;
  readonly author: string;
  readonly dynasty: string;
  readonly description: string;
  readonly chapterCount: number;
  readonly ready: boolean;
}

export const CLASSICS_META: ReadonlyArray<ClassicMeta> = [
  { slug: 'zhouyi', title: '周易', author: '历代先贤整理', dynasty: '先秦', description: '群经之首，以卦爻系统阐述变化之道。', chapterCount: 64, ready: true },
  { slug: 'shangshu', title: '尚书', author: '历代史官与学者编订', dynasty: '先秦', description: '上古政事之书，保存夏商周诰命典谟。', chapterCount: 58, ready: true },
  { slug: 'shijing', title: '诗经', author: '西周至春秋乐官与民间', dynasty: '先秦', description: '中国最早的诗歌总集，分风雅颂。', chapterCount: 305, ready: true },
  { slug: 'liji', title: '礼记', author: '西汉戴圣编选', dynasty: '西汉', description: '记载先秦礼制的文献汇编。', chapterCount: 49, ready: true },
  { slug: 'daodejing', title: '道德经', author: '老子', dynasty: '春秋', description: '道家核心经典，以五千言阐述道与德。', chapterCount: 81, ready: true },
  { slug: 'zhuangzi', title: '庄子', author: '庄子及其后学', dynasty: '战国', description: '道家重要典籍，以寓言探讨自由与自然。', chapterCount: 33, ready: true },
];

// 原文/【注】通过 heading 前缀识别, 渲染层加前缀样式, 禁新增块类型 (契约约束)
const zhouyiBlocks: ContentBlock[] = [
  { kind: 'paragraph', text: '天尊地卑，乾坤定矣。卑高以陈，贵贱位矣。动静有常，刚柔断矣。' },
  { kind: 'paragraph', text: '此章以天地、尊卑、动静等对立范畴说明宇宙秩序，是《系辞》开篇的纲领性论述。' },
];

export const classicsArticles: KnowledgeArticle[] = [
  {
    slug: 'zhouyi',
    title: '周易',
    metaDescription: '群经之首，以卦爻系统阐述变化之道。',
    h1: '周易',
    category: 'boundary',
    tags: ['周易', '易经', '先秦'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '《周易》是中国古代最重要的经典之一，以阴阳爻组成的六十四卦系统为核心。' }] },
      // heading 以【原文】/【注】开头 → 渲染层自动加前缀样式
      { heading: '【原文】系辞上传·第一章', level: 2, blocks: [{ kind: 'paragraph', text: zhouyiBlocks[0].text }] },
      { heading: '【注】', level: 2, blocks: [{ kind: 'paragraph', text: zhouyiBlocks[1].text }] },
    ],
    sources: [
      { text: '《周易正义》（孔颖达疏）', confidence: 'verified' },
      { text: '《周易本义》（朱熹）', confidence: 'verified' },
    ],
    citationStrategy: 'public-domain',
    reviewedBy: '国学编辑组',
    ready: true,
    relatedSlugs: ['shangshu', 'shijing'],
    confidence: 'verified',
    disclaimer: '本条目为典籍导读，不提供占断服务。',
    updatedAt: '2026-09-16',
  readingMinutes: 5,
  },
  {
    slug: 'shangshu',
    title: '尚书',
    metaDescription: '上古政事之书，保存夏商周诰命典谟。',
    h1: '尚书',
    category: 'boundary',
    tags: ['尚书', '书经', '先秦'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '《尚书》是现存最早的中国上古历史文献汇编。' }] },
      { heading: '【原文】尧典（节选）', level: 2, blocks: [{ kind: 'paragraph', text: '曰若稽古帝尧，曰放勋，钦明文思安安，允恭克让，光被四表，格于上下。' }] },
      { heading: '【注】', level: 2, blocks: [{ kind: 'paragraph', text: '此段记述尧帝的德行与功业，是研究上古帝王叙事的重要文本。' }] },
    ],
    sources: [{ text: '《尚书正义》（孔颖达疏）', confidence: 'verified' }],
    citationStrategy: 'public-domain',
    reviewedBy: '国学编辑组',
    ready: true,
    relatedSlugs: ['zhouyi'],
    confidence: 'verified',
    disclaimer: '本条目为典籍导读，供学术与文化学习参考。',
    updatedAt: '2026-09-15',
  readingMinutes: 5,
  },
  {
    slug: 'shijing',
    title: '诗经',
    metaDescription: '中国最早的诗歌总集，分风雅颂。',
    h1: '诗经',
    category: 'boundary',
    tags: ['诗经', '诗歌', '先秦'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '《诗经》收录自西周初年至春秋中叶的诗歌三百零五篇。' }] },
      { heading: '【原文】关雎（节选）', level: 2, blocks: [{ kind: 'paragraph', text: '关关雎鸠，在河之洲。窈窕淑女，君子好逑。' }] },
      { heading: '【注】', level: 2, blocks: [{ kind: 'paragraph', text: '《关雎》以雎鸠和鸣起兴，表达对美好情感的向往。' }] },
    ],
    sources: [{ text: '《毛诗正义》', confidence: 'verified' }],
    citationStrategy: 'public-domain',
    reviewedBy: '国学编辑组',
    ready: true,
    relatedSlugs: ['zhouyi'],
    confidence: 'verified',
    disclaimer: '本条目为典籍导读，供学术与文化学习参考。',
    updatedAt: '2026-09-14',
  readingMinutes: 5,
  },
  {
    slug: 'liji',
    title: '礼记',
    metaDescription: '记载先秦礼制的文献汇编。',
    h1: '礼记',
    category: 'boundary',
    tags: ['礼记', '礼制', '西汉'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '《礼记》内容涵盖礼仪制度、教育思想、政治理念与日常生活规范。' }] },
      { heading: '【原文】礼运·大同（节选）', level: 2, blocks: [{ kind: 'paragraph', text: '大道之行也，天下为公。选贤与能，讲信修睦。' }] },
      { heading: '【注】', level: 2, blocks: [{ kind: 'paragraph', text: '此段描述儒家理想中的大同社会，是理解儒家政治理想的重要文本。' }] },
    ],
    sources: [{ text: '《礼记正义》（孔颖达疏）', confidence: 'verified' }],
    citationStrategy: 'public-domain',
    reviewedBy: '国学编辑组',
    ready: true,
    relatedSlugs: ['shangshu'],
    confidence: 'verified',
    disclaimer: '本条目为典籍导读，供学术与文化学习参考。',
    updatedAt: '2026-09-13',
  readingMinutes: 5,
  },
  {
    slug: 'daodejing',
    title: '道德经',
    metaDescription: '道家核心经典，以五千言阐述道与德。',
    h1: '道德经',
    category: 'boundary',
    tags: ['道德经', '老子', '道家'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '《道德经》以简洁的语言阐述道、德、无为等核心概念。' }] },
      { heading: '【原文】第一章', level: 2, blocks: [{ kind: 'paragraph', text: '道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。' }] },
      { heading: '【注】', level: 2, blocks: [{ kind: 'paragraph', text: '此章为全书总纲，"道"既指终极真实，也指言说与规律。' }] },
    ],
    sources: [{ text: '《老子道德经注》（王弼）', confidence: 'verified' }],
    citationStrategy: 'public-domain',
    reviewedBy: '国学编辑组',
    ready: true,
    relatedSlugs: ['zhuangzi'],
    confidence: 'verified',
    disclaimer: '本条目为典籍导读，供学术与文化学习参考。',
    updatedAt: '2026-09-12',
  readingMinutes: 5,
  },
  {
    slug: 'zhuangzi',
    title: '庄子',
    metaDescription: '道家重要典籍，以寓言探讨自由与自然。',
    h1: '庄子',
    category: 'boundary',
    tags: ['庄子', '道家', '战国'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '《庄子》以寓言与思辨探讨自由、生死与自然之道。' }] },
      { heading: '【原文】逍遥游（节选）', level: 2, blocks: [{ kind: 'paragraph', text: '北冥有鱼，其名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。' }] },
      { heading: '【注】', level: 2, blocks: [{ kind: 'paragraph', text: '鲲鹏之喻旨在破除大小、物我的执念，彰显精神之自由。' }] },
    ],
    sources: [{ text: '《庄子集释》（郭庆藩）', confidence: 'verified' }],
    citationStrategy: 'public-domain',
    reviewedBy: '国学编辑组',
    ready: true,
    relatedSlugs: ['daodejing'],
    confidence: 'verified',
    disclaimer: '本条目为典籍导读，供学术与文化学习参考。',
    updatedAt: '2026-09-11',
  readingMinutes: 5,
  },
];
