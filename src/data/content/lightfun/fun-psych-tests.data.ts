import type { LightFunEnvelope } from './lightfun.types';

export interface QuizOption {
  readonly label: string;
  readonly score: number;
}
export interface QuizQuestion {
  readonly id: string;
  readonly text: string;
  readonly options: readonly QuizOption[];
}
export interface Quiz {
  readonly quiz_id: string;
  readonly title: string;
  readonly intro: string;
  readonly questions: readonly QuizQuestion[];
  readonly results: readonly {
    readonly type: string;
    readonly min_score: number;
    readonly title: string;
    readonly reading: string;
  }[];
}

export interface FunPsychContent {
  readonly flow: readonly string[];
  readonly quizzes: readonly Quiz[];
  readonly disclaimer_pack_keys: readonly string[];
}

function opts(a: string, b: string, c: string): readonly QuizOption[] {
  return [
    { label: a, score: 1 },
    { label: b, score: 2 },
    { label: c, score: 3 },
  ];
}

export const QUIZZES: readonly Quiz[] = [
  {
    quiz_id: 'q-energy',
    title: '能量补给偏好',
    intro: '10 道小题，看看你更习惯从哪里获取能量。',
    questions: [
      { id: 'e1', text: '周末更想怎么过？', options: opts('约朋友出门', '在家安静待着', '看心情') },
      { id: 'e2', text: '聊天时你通常？', options: opts('说得较多', '听得较多', '一半一半') },
      {
        id: 'e3',
        text: '累了一天之后？',
        options: opts('找人聊聊回血', '独处充电', '做点喜欢的事'),
      },
      { id: 'e4', text: '到新场合你会？', options: opts('主动认识人', '观察再加入', '看当天状态') },
      { id: 'e5', text: '休息最理想是？', options: opts('热闹聚会', '完全安静', '短途出门') },
      { id: 'e6', text: '想法多的时候？', options: opts('立刻说出来', '先写下来', '找信任的人聊') },
      { id: 'e7', text: '被打断思路会？', options: opts('有点烦躁', '还好能接上', '看内容重要度') },
      { id: 'e8', text: '做决定更依赖？', options: opts('第一感觉', '反复权衡', '问别人意见') },
      { id: 'e9', text: '假期结束你？', options: opts('更想社交', '更想独处', '刚刚好') },
      { id: 'e10', text: '别人常说你？', options: opts('热情外放', '安静内敛', '看场合切换') },
    ],
    results: [
      {
        type: 'out',
        min_score: 10,
        title: '向外补给型',
        reading: '你习惯从人际与外界获得能量，记得也留一点独处时间。',
      },
      {
        type: 'mid',
        min_score: 18,
        title: '灵活切换型',
        reading: '你在独处与社交间切换自如，留意别让两边都透支。',
      },
      {
        type: 'in',
        min_score: 24,
        title: '向内补给型',
        reading: '你需要安静来充电，把休息排进日程，而不是最后才想起。',
      },
    ],
  },
  {
    quiz_id: 'q-decision',
    title: '决策风格小测',
    intro: '9 道小题，看看你做决定时更偏哪种方式。',
    questions: [
      { id: 'd1', text: '选餐厅你通常？', options: opts('很快定下来', '反复比较', '让别人选') },
      { id: 'd2', text: '重要决定你？', options: opts('凭直觉', '列清单分析', '问家人朋友') },
      { id: 'd3', text: '临时变计划？', options: opts('欣然接受', '有点不适', '看影响多大') },
      { id: 'd4', text: '信息很多时？', options: opts('抓重点快决', '继续搜集', '求助筛选') },
      { id: 'd5', text: '害怕选错？', options: opts('不太担心', '会犹豫', '常纠结') },
      { id: 'd6', text: '做决定后？', options: opts('很少回头想', '偶尔复盘', '容易后悔') },
      { id: 'd7', text: '团队意见不一？', options: opts('推动定案', '再等等看', '找折中方案') },
      { id: 'd8', text: '时间紧时？', options: opts('先做了再说', '仍按流程', '快速问关键人') },
      { id: 'd9', text: '你欣赏的决策？', options: opts('果断', '稳妥', '开放') },
    ],
    results: [
      {
        type: 'fast',
        min_score: 9,
        title: '果断型',
        reading: '你决策快，偶尔可以多留一步确认细节。',
      },
      {
        type: 'careful',
        min_score: 16,
        title: '稳妥型',
        reading: '你权衡充分，给自己设一个决策截止时间更轻松。',
      },
      {
        type: 'relational',
        min_score: 22,
        title: '协作型',
        reading: '你重视他人意见，记得最后由自己拍板。',
      },
    ],
  },
  {
    quiz_id: 'q-rhythm',
    title: '日常节奏小测',
    intro: '8 道小题，看看你的生活节奏更像哪一种。',
    questions: [
      { id: 'r1', text: '早起状态？', options: opts('越早起越清醒', '需要缓一缓', '看前一晚') },
      { id: 'r2', text: '高效时段？', options: opts('上午', '下午', '晚上') },
      { id: 'r3', text: '待办清单你？', options: opts('必须列', '偶尔列', '靠脑子记') },
      { id: 'r4', text: '多任务？', options: opts('同时做几件', '一次一件', '看复杂度') },
      { id: 'r5', text: '截止日前？', options: opts('提前完成', '赶点完成', '最后冲刺') },
      { id: 'r6', text: '留白时间？', options: opts('必须留一点', '经常排满', '随缘') },
      { id: 'r7', text: '计划被打乱？', options: opts('重新排就行', '会很崩', '慢慢调整') },
      { id: 'r8', text: '理想一天？', options: opts('充实有节奏', '放松无安排', '一半一半') },
    ],
    results: [
      {
        type: 'structured',
        min_score: 8,
        title: '秩序型',
        reading: '你偏好节奏与计划，偶尔留白也没关系。',
      },
      {
        type: 'flow',
        min_score: 14,
        title: '流动型',
        reading: '你随状态调整，给关键事项留固定时间更稳。',
      },
      { type: 'flex', min_score: 18, title: '弹性型', reading: '你灵活度高，定期复盘能避免遗漏。' },
    ],
  },
];

export const FUN_PSYCH_WHITELIST: ReadonlySet<string> = new Set(QUIZZES.map((q) => q.quiz_id));

export const FUN_PSYCH_DATA: LightFunEnvelope<FunPsychContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-6',
  slug: 'fun-psych-tests',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '心理趣味小测', description: '三套轻量自我觉察小测' },
    en: { title: 'Fun Quizzes', description: 'Three light self-reflection quizzes' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '心理趣味小测｜三套自我觉察',
    description: '能量、决策、日常节奏三套轻量小测，结果仅供自我观察，不构成诊断。',
    canonical: '/tools/fun-psych-tests',
    keywords: ['心理测试', '趣味测试', '自我觉察'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '心理趣味小测',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['pick_quiz', 'answer', 'score', 'result', 'close_loop'],
    quizzes: QUIZZES,
    disclaimer_pack_keys: ['general', 'health'],
  },
  ui: {
    theme: 'dark-ide',
    components: ['QuizPicker', 'QuestionCard', 'ResultCard', 'ShareButton'],
  },
  share_card: {
    title: '我刚做完小测',
    subtitle: '轻量自我觉察，图个乐',
    tags: ['#心理测试', '#自我觉察'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '心理趣味小测结果卡片',
    alt_text: '三套轻量小测的结果与解读',
    reading_order: ['quiz_title', 'result_title', 'reading'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'medium',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'health', text: '不构成诊断；如有持续不适，请咨询专业医生。' },
    ],
    disclaimer_slots: ['result_card', 'page_footer'],
    forbidden_terms: ['断言', '保证', '抑郁', '焦虑症', '必然', '一定'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/fun-psych-tests',
    params: ['[test_id]', '[test_id]/result/[type]'],
    whitelist: 'content.quizzes',
    conflicts_with_884: false,
  },
};
