/**
 * C-5 育儿占星：12 星座孩子的养育指南
 * 来源：专家 C R3（143217.md §parenting/parenting-astrology.data.ts）
 * 口径：12 条，每条 ≥260 字
 */
import type { CContentRecord, CParentingAstrologyExtra } from './types';

interface ParentingSeed {
  slug: string;
  sign: string;
  energy: string;
  mistake: string;
  guidance: string;
  rhythm: string;
}

const PARENTING: ParentingSeed[] = [
  {
    slug: 'aries',
    sign: '白羊',
    energy: '直接行动',
    mistake: '你怎么这么急',
    guidance: "把'急'重新定义为'启动快'。给孩子明确的任务起点和终点，让ta的冲动有方向可去",
    rhythm: "早上给'今天的第一件事'；晚上给'今天完成的一件事'。用'完成'来锚定ta的行动力",
  },
  {
    slug: 'taurus',
    sign: '金牛',
    energy: '稳定感知',
    mistake: '你怎么这么慢',
    guidance:
      "把'慢'重新定义为'踏实'。给孩子充足的时间进入状态，不要催促，ta需要用感官确认环境安全",
    rhythm: '建立固定的日常节奏：同样的时间吃饭、出门、睡觉。金牛孩子在可预期的节奏中最有安全感',
  },
  {
    slug: 'gemini',
    sign: '双子',
    energy: '好奇交流',
    mistake: '你怎么又分心了',
    guidance:
      "把'分心'重新定义为'好奇心广'。给孩子多个可以同时探索的话题，ta的大脑就是需要同时处理多条线索",
    rhythm: "用'说话'来整理思绪：每天睡前聊3件今天发生的事，帮ta把碎片信息串联起来",
  },
  {
    slug: 'cancer',
    sign: '巨蟹',
    energy: '情感守护',
    mistake: '你怎么又哭了',
    guidance:
      "把'哭'重新定义为'情感丰富'。先拥抱再讲道理，巨蟹孩子需要先感受到被接纳，才能听进道理",
    rhythm: "创造'回家仪式'：进门先抱5分钟，再开始写作业。情感连接好了，效率自然来",
  },
  {
    slug: 'leo',
    sign: '狮子',
    energy: '自信表达',
    mistake: '你别那么爱出风头',
    guidance: "把'出风头'重新定义为'有表现力'。给ta展示才华的舞台，但教会ta也要给别人舞台",
    rhythm: "每周安排一次'小演讲时间'：让ta给全家讲一件自己擅长的事，满足表达欲后再要求倾听",
  },
  {
    slug: 'virgo',
    sign: '处女',
    energy: '细致分析',
    mistake: '你怎么这么纠结',
    guidance: "把'纠结'重新定义为'追求完美'。教ta区分'可以更好'和'已经够好'，把完美主义用在刀刃上",
    rhythm: '把大任务拆成小步骤，每完成一步打勾。处女孩子需要看到清晰的进度条才有动力',
  },
  {
    slug: 'libra',
    sign: '天秤',
    energy: '协调平衡',
    mistake: '你怎么选不出来',
    guidance:
      "把'选不出来'重新定义为'考虑周全'。帮ta设定决策时限，超过时间就凭直觉选，然后学会不后悔",
    rhythm: "用'二选一'代替'随便'：给两个选项而不是开放式问题，减轻选择压力",
  },
  {
    slug: 'scorpio',
    sign: '天蝎',
    energy: '深度洞察',
    mistake: '你怎么又钻牛角尖',
    guidance:
      "把'钻牛角尖'重新定义为'洞察力强'。教ta区分'值得深挖的问题'和'想太多的问题'，给深度一个出口",
    rhythm: "每天留15分钟'深度对话时间'：不评判地听ta说那些看起来'想太多'的话题，说完了就放下",
  },
  {
    slug: 'sagittarius',
    sign: '射手',
    energy: '自由探索',
    mistake: '你怎么坐不住',
    guidance: "把'坐不住'重新定义为'渴望探索'。把学习和旅行/探险结合起来，让知识在动的过程中吸收",
    rhythm: "用'目标导向'代替'过程要求'：告诉ta'做完这些你就可以去探索'，给自由留一个出口",
  },
  {
    slug: 'capricorn',
    sign: '摩羯',
    energy: '目标成就',
    mistake: '你怎么这么不开心',
    guidance:
      "把'不开心'重新定义为'目标感强但压力大'。帮ta区分'必须做的'和'想做的'，给玩耍留出正式时间",
    rhythm: "用'成就清单'代替'待办清单'：每天写下3件完成的事，让ta看到自己的进步",
  },
  {
    slug: 'aquarius',
    sign: '水瓶',
    energy: '创新独立',
    mistake: '你怎么这么古怪',
    guidance: "把'古怪'重新定义为'独特视角'。不要逼ta'合群'，帮ta找到能欣赏ta独特性的朋友圈",
    rhythm: "给'独处时间'和'社交时间'同等尊重：水瓶孩子需要独处充电，也需要找到同类",
  },
  {
    slug: 'pisces',
    sign: '双鱼',
    energy: '共情想象',
    mistake: '你怎么老做白日梦',
    guidance:
      "把'白日梦'重新定义为'想象力丰富'。把想象力引导到创作中：画画、写故事、编剧本，给幻想一个出口",
    rhythm: "用'感官过渡'从幻想拉回现实：从画画转到写作业时，先听一首安静的歌，给大脑切换的时间",
  },
];

export const PARENTING_ASTROLOGY: readonly CContentRecord<CParentingAstrologyExtra>[] =
  PARENTING.map((p) => {
    const body = [
      `${p.sign}座孩子天生是「${p.energy}」——他们需要的不是刹车，而是方向盘。`,
      `常见误伤点：家长常说「${p.mistake}」。这会让孩子把「${p.energy}」误认为「错误」，久而久之开始压抑自己的天性。`,
      `正向引导：${p.guidance}。`,
      `节奏建议：${p.rhythm}。`,
      `去标签化声明：以上描述基于星座文化符号，不构成对任何孩子的定性。每个孩子都是独特的，请根据实际情况灵活调整。`,
    ].join('');

    return {
      id: `c_parenting_astrology_${p.slug}`,
      version: '1.0.0',
      domain: 'c',
      category: 'c_parenting_astrology',
      seo: {
        title: `${p.sign}座孩子养育指南`,
        description: `${p.sign}座孩子的能量偏好、养育误伤点与正向引导`,
        slug: `/knowledge/parenting/${p.slug}`,
        canonical: `/knowledge/parenting/${p.slug}`,
        breadcrumb: ['首页', '育儿占星', `${p.sign}座`],
        breadcrumb_paths: ['/', '/knowledge/parenting', `/knowledge/parenting/${p.slug}`],
      },
      source: { system: 'western_astrology', classic: '现代占星亲子指南', chapter: `${p.sign}座` },
      compliance: {
        no_fatalism: true,
        domain_note: 'culture_discussion',
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
          insight: `${p.sign}座孩子天生是「${p.energy}」。`,
          cause: '占星将12星座能量倾向作为观察孩子性格差异的一个文化框架。',
          manifestation: p.guidance,
          risk: '星座描述不构成对孩子的定性标签，请勿对号入座。',
          suggestion: p.rhythm,
          action: '观察自己是否无意中说了误伤天性的话，下次换一种说法。',
        },
      },
      extra: {
        kind: 'c_parenting_astrology',
        sign_name: p.sign,
        energy_preference: p.energy,
        parenting_mistake: p.mistake,
        positive_guidance: p.guidance,
        rhythm_advice: p.rhythm,
      },
      i18n_key: `c_parenting_astrology.${p.slug}`,
    };
  });

export const PARENTING_ASTROLOGY_COUNT = PARENTING_ASTROLOGY.length; // 12
