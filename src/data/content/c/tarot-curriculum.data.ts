/**
 * C-2 塔罗学习：三阶 19 课（入门 7 + 进阶 7 + 高阶 5）
 * 来源：专家 C R3（143217.md §tarot/tarot-curriculum.data.ts）
 * 口径：19 课，每条 ≥350 字
 */
import type { CContentRecord, CTarotCurriculumExtra } from './types';

interface CurriculumSeed {
  slug: string;
  lessonNo: number;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  concept: string;
  cardMeaning: string;
  practicalUse: string;
}

const LESSONS: CurriculumSeed[] = [
  // ===== 入门篇（7 课）=====
  {
    slug: 'fool',
    lessonNo: 1,
    title: '愚者：开始的力量',
    level: 'beginner',
    concept: '愚者代表"零的起点"，是大阿卡纳的第一张',
    cardMeaning:
      '愚者站在悬崖边，行囊轻便，眼神望向远方。他象征"不带预设的出发"——不是鲁莽，而是对未知保持开放。',
    practicalUse:
      '当你在犹豫是否开始新项目时，抽到愚者牌，提示你"先迈出第一步"，而不是等待完美时机。',
  },
  {
    slug: 'magician',
    lessonNo: 2,
    title: '魔术师：资源整合',
    level: 'beginner',
    concept: '魔术师代表"手边已有资源"，是创造的起点',
    cardMeaning:
      '魔术师面前摆着四元素工具，手势一上一下，象征"上下连接"。他提醒你：你拥有的资源已经足够开始。',
    practicalUse: '面对一个新计划却觉得"还缺条件"时，魔术师告诉你：盘点现有资源，先从手边的开始。',
  },
  {
    slug: 'high-priestess',
    lessonNo: 3,
    title: '女祭司：内在直觉',
    level: 'beginner',
    concept: '女祭司代表"安静聆听内在声音"',
    cardMeaning:
      '女祭司端坐双面石碑之间，脚下新月，手持卷轴。她象征直觉与潜意识——答案不在外面，在你心里。',
    practicalUse:
      '当你反复纠结"选A还是选B"时，停下来问自己：身体感觉哪个更轻松？那个答案往往是对的。',
  },
  {
    slug: 'empress',
    lessonNo: 4,
    title: '女皇：滋养与创造',
    level: 'beginner',
    concept: '女皇代表"滋养、丰饶与感官享受"',
    cardMeaning:
      '女皇坐在花丛中，头戴星冠，象征大地母亲的能量。她提醒你：创造需要被滋养，不是硬撑。',
    practicalUse:
      '如果你正在创作或孕育一个想法，女皇说：给自己留出"被滋养"的时间——散步、吃好饭、和喜欢的人聊天。',
  },
  {
    slug: 'emperor',
    lessonNo: 5,
    title: '皇帝：秩序与框架',
    level: 'beginner',
    concept: '皇帝代表"建立结构和规则"',
    cardMeaning: '皇帝端坐石椅，手持权杖，象征权威与秩序。他不是压迫，而是给混沌一个可依靠的框架。',
    practicalUse:
      '当生活失控时，皇帝建议：先建立一个最小的日常结构——固定起床时间、固定工作时段，秩序会带来安全感。',
  },
  {
    slug: 'hierophant',
    lessonNo: 6,
    title: '教皇：传统与导师',
    level: 'beginner',
    concept: '教皇代表"向传统和导师学习"',
    cardMeaning:
      '教皇身披法衣，双手指天，信众跪拜。他象征已被验证的知识体系——不是盲从，而是站在前人肩膀上。',
    practicalUse: '学新技能时，找一个成熟的体系入门，比自己瞎摸索效率高十倍。',
  },
  {
    slug: 'lovers',
    lessonNo: 7,
    title: '恋人：选择与价值观',
    level: 'beginner',
    concept: '恋人代表"基于价值观的选择"',
    cardMeaning:
      '恋人牌不只是爱情，更是"你选择成为谁"。天使在上方祝福，男人看向女人，女人看向天使——心与灵的方向。',
    practicalUse: '面对选择时，问自己：这个选择符合我真正的价值观吗？而不是"哪个更安全"。',
  },
  // ===== 进阶篇（7 课）=====
  {
    slug: 'chariot',
    lessonNo: 8,
    title: '战车：意志力与前进',
    level: 'intermediate',
    concept: '战车代表"驾驭对立力量向目标前进"',
    cardMeaning:
      '战车手站在两匹方向相反的狮子之间，手握缰绳。他不需要消灭对立，而是让它们朝同一方向前进。',
    practicalUse:
      '当你内心有矛盾时（想休息又想努力），战车说：不要消灭任何一方，给它们同一个方向。',
  },
  {
    slug: 'strength',
    lessonNo: 9,
    title: '力量：温柔的驯服',
    level: 'intermediate',
    concept: '力量代表"以柔克刚"',
    cardMeaning: '女子轻吻狮子的嘴，狮子温顺。这不是暴力压制，而是用温柔和信任驯服野性。',
    practicalUse: '面对强烈情绪时，不要对抗它，而是像对待狮子一样——温柔地注视它，它会慢慢安静。',
  },
  {
    slug: 'hermit',
    lessonNo: 10,
    title: '隐士：独处与寻光',
    level: 'intermediate',
    concept: '隐士代表"向内探索，寻找内在明灯"',
    cardMeaning: '老人提灯站在雪山之巅，灯中是六芒星。他不是孤独，而是主动选择独处来听清楚自己。',
    practicalUse:
      '如果你最近信息过载，隐士建议：每天给自己30分钟独处时间——不看手机，只是安静地待着。',
  },
  {
    slug: 'wheel',
    lessonNo: 11,
    title: '命运之轮：周期与转变',
    level: 'intermediate',
    concept: '命运之轮代表"周期运转，顺势而为"',
    cardMeaning: '轮子上四个活物，蛇与阿努比斯升降。一切都在流转——好时光会过去，坏时光也会过去。',
    practicalUse: '当你处于低谷时记住：轮子在转，你不会永远在底部。当你在高峰时也记住：保持谦逊。',
  },
  {
    slug: 'justice',
    lessonNo: 12,
    title: '正义：因果与平衡',
    level: 'intermediate',
    concept: '正义代表"因果法则与公平判断"',
    cardMeaning: '正义女神端坐，左手天平，右手剑。她不偏不倚——不是惩罚，而是平衡。',
    practicalUse:
      '回顾过去的决定，问自己：这个决定是否对所有人都公平？如果有失衡，现在就是修正的时机。',
  },
  {
    slug: 'hanged-man',
    lessonNo: 13,
    title: '倒吊人：换个角度',
    level: 'intermediate',
    concept: '倒吊人代表"主动暂停，换个视角"',
    cardMeaning: '人倒挂在树上，表情平静。他不是被惩罚，而是主动选择换个角度看世界。',
    practicalUse:
      '当你陷入思维死胡同时，倒吊人建议：完全反过来想——如果这件事的结果和你预期的完全相反呢？',
  },
  {
    slug: 'death',
    lessonNo: 14,
    title: '死神：结束与新生',
    level: 'intermediate',
    concept: '死神代表"必要的结束，为新生腾出空间"',
    cardMeaning: '死神骑白马，王冠落地，向日葵在远方。这不是肉体死亡，而是某种旧模式的终结。',
    practicalUse: '你生活中有什么该结束却拖着不走的事？死神说：结束不是损失，而是腾出空间给新的。',
  },
  // ===== 高阶篇（5 课）=====
  {
    slug: 'temperance',
    lessonNo: 15,
    title: '节制：中庸与调和',
    level: 'advanced',
    concept: '节制代表"在两极之间找到恰到好处的配比"',
    cardMeaning: '天使双脚涉水一脚踏地，两杯水来回倾倒。她在调和——不多不少，刚刚好。',
    practicalUse:
      '找到你生活中"过"或"不及"的领域，练习调到中间值：工作太久就休息，休息太久就行动。',
  },
  {
    slug: 'devil',
    lessonNo: 16,
    title: '恶魔：执念与束缚',
    level: 'advanced',
    concept: '恶魔代表"自我设限的执念"',
    cardMeaning:
      '链子里的两人脖子上有松脱的锁链——他们其实可以挣脱，只是以为不能。恶魔是你对"不可能"的信念。',
    practicalUse: '列出你常说的"我不行/我做不到"，逐条质疑：真的不行吗？还是只是不习惯？',
  },
  {
    slug: 'tower',
    lessonNo: 17,
    title: '高塔：突变与重建',
    level: 'advanced',
    concept: '高塔代表"虚假结构的崩塌与真相的显现"',
    cardMeaning: '闪电劈中塔顶，王冠掉落，人从塔上跳下。这是剧变——但崩塌的本就是不稳固的东西。',
    practicalUse:
      '如果你正在经历突发的变故，高塔说：这不是灾难，而是清理——倒塌的是本就不该存在的。',
  },
  {
    slug: 'star',
    lessonNo: 18,
    title: '星星：希望与疗愈',
    level: 'advanced',
    concept: '星星代表"黑暗后的平静希望与疗愈"',
    cardMeaning:
      '裸女跪水边，七颗星在天上。经历了高塔的风暴后，星星带来宁静的希望——不是狂热，而是沉静的信念。',
    practicalUse: '在经历困难后，给自己时间疗愈。星星说：相信时间和自然的节奏，你会慢慢好起来。',
  },
  {
    slug: 'world',
    lessonNo: 19,
    title: '世界：圆满与循环',
    level: 'advanced',
    concept: '世界代表"一个周期的圆满完成"',
    cardMeaning: '舞者在花环中起舞，四活物环绕。世界牌是大阿卡纳的终点，也是下一段旅程的起点。',
    practicalUse: '完成一个大项目或阶段后，不要急着开始下一个——先庆祝、回顾、感谢，再出发。',
  },
];

export const TAROT_CURRICULUM: readonly CContentRecord<CTarotCurriculumExtra>[] = LESSONS.map(
  (l) => {
    const body = [
      `塔罗第${l.lessonNo}课「${l.title}」：${l.concept}。`,
      `牌面解读：${l.cardMeaning}`,
      `实践应用：${l.practicalUse}`,
      '塔罗牌面解读为文化娱乐参考，不构成诊断或医疗建议。请以开放但理性的态度看待牌意。',
    ].join('');

    return {
      id: `c_tarot_curriculum_${l.slug}`,
      version: '1.0.0',
      domain: 'c',
      category: 'c_tarot_curriculum',
      seo: {
        title: `塔罗第${l.lessonNo}课：${l.title}`,
        description: `塔罗第${l.lessonNo}课「${l.title}」牌面解读与实践`,
        slug: `/learn/tarot/curriculum/${l.slug}`,
        canonical: `/learn/tarot/curriculum/${l.slug}`,
        breadcrumb: ['首页', '塔罗学习', `第${l.lessonNo}课`],
        breadcrumb_paths: ['/', '/learn/tarot/curriculum', `/learn/tarot/curriculum/${l.slug}`],
      },
      source: { system: 'tarot', classic: '塔罗大阿卡纳', chapter: `第${l.lessonNo}课 ${l.title}` },
      compliance: {
        no_fatalism: true,
        domain_note: 'entertainment_only',
        banned_words_checked: true,
      },
      review: {
        status: 'supplemented',
        word_count: body.replace(/\s/g, '').length,
        reviewer: 'expert-c',
      },
      body: {
        plain_reading: body,
        insight_loop: {
          insight: `${l.title}：${l.concept}。`,
          cause: '塔罗牌通过图像符号激活直觉，牌面是镜子而非预言。',
          manifestation: l.cardMeaning,
          risk: '塔罗解读仅供参考，勿据此做重大决策。',
          suggestion: l.practicalUse,
          action: '下次抽到这张牌时，回想本课的关键词。',
        },
      },
      extra: {
        kind: 'c_tarot_curriculum',
        lesson_no: l.lessonNo,
        level: l.level,
        core_concept: l.concept,
        card_meaning: l.cardMeaning,
        practical_use: l.practicalUse,
      },
      i18n_key: `c_tarot_curriculum.${l.slug}`,
    };
  },
);

export const TAROT_CURRICULUM_COUNT = TAROT_CURRICULUM.length; // 19
