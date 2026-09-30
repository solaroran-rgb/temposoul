/**
 * 知识库文章：生肖传说——十二生肖排位的民间故事
 * 文件路径：src/data/knowledge/content/zodiac-culture/legend.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-legend',
  title: '生肖传说：十二生肖为什么这样排',
  metaDescription: '十二生肖的顺序从何而来？本文梳理"动物排位赛"等民间传说与真实的干支纪年起源。',
  h1: '生肖传说：十二生肖为什么这样排',
  category: 'zodiac-culture',
  tags: ['生肖', '传说', '民俗'],
  sections: [
    {
      heading: '最流行的说法：排位赛与渡河',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '民间流传最广的版本，是说玉皇大帝要选十二种动物当生肖，定下渡河比赛的名次。鼠悄悄骑在牛背上，快到终点时跳下抢了第一，牛屈居第二；虎、兔随后赶到；龙本应最快，却因中途降雨救人而迟到；蛇、马、羊、猴、鸡依次过了河；狗贪玩戏水排第十一；猪半路贪吃睡觉，成了最后一名。',
        },
        {
          kind: 'paragraph',
          text: '这个故事版本众多，各地细节不一：有的说猫本在参赛名单上，因被鼠骗睡过了头而落选，从此猫鼠成仇。这类传说把生肖排序讲成了一场生动的童话，但它是后人附会的民间文学，不是历史记载。',
        },
      ],
    },
    {
      heading: '更可信的起源：与十二地支相配',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '从文献看，十二生肖与十二地支的对应，至迟在汉代已经定型。出土于战国的睡虎地秦简、放马滩秦简中，已出现用动物配地支的记载，只是当时的配法与今天略有出入。到东汉王充《论衡·物势篇》，十二种动物与子丑寅卯的对应已与今日基本一致。',
        },
        {
          kind: 'paragraph',
          text: '学者普遍认为，动物配地支最初与古人对动物活动时辰的观察有关：鼠子夜活跃、牛凌晨反刍、虎清晨出穴、兔望月捣药、龙时辰行云布雨……生肖更像是一套"时辰的动物注解"，而不是一场天帝主持的比赛。',
        },
      ],
    },
    {
      heading: '传说的价值：为什么我们还爱讲',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '无论排序的真实起源是什么，"渡河排位"的传说之所以流传两千年，是因为它把抽象的纪年符号变成了有性格、有恩怨的角色——机灵的鼠、勤劳的牛、威猛的虎、灵巧的兔。这正是生肖文化能跨越年龄和地域的原因。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '排位赛故事属民间文学与民俗想象，不代表历史事实。了解传说的乐趣，不必把它当作真实发生过的事件。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《论衡·物势篇》及睡虎地、放马滩秦简相关研究整理', confidence: 'legendary' },
    { text: '生肖排序传说采自各地通行民间故事版本', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['zodiac-rat', 'ganzhi-overview', 'ganzhi-jiazi', 'why-folk-vs-fact'],
  confidence: 'legendary',
  disclaimer: '本文为生肖民俗传说科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 4,
};

export default article;
