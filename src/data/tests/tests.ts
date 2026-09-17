import { TestDef } from './types';

export const TESTS: TestDef[] = [
  {
    id: 'test-energy',
    title: '能量节奏小测',
    description: '观察你近期能量起伏的趣味测试。',
    totalRange: [0, 20],
    ready: true,
    disclaimer: '本测试仅供自我反思与娱乐，不构成人格定论或心理判断。',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: `q${i + 1}`,
      text: `第${i + 1}题：面对新计划时，你通常？`,
      options: [
        { label: '先行动再调整', score: 2 },
        { label: '先观察再决定', score: 1 },
        { label: '等别人推动', score: 0 },
      ],
    })),
    outcomes: [
      { min: 0, max: 6, title: '低耗观察期', observation: '你可能更倾向保存能量。', reflection: '什么情况下你会主动投入？', action: '本周选一件小事立即行动。' },
      { min: 7, max: 13, title: '弹性调节期', observation: '你似乎能在行动与观察间切换。', reflection: '哪种节奏最让你舒服？', action: '记录三天的能量变化。' },
      { min: 14, max: 20, title: '高能推进期', observation: '你可能更容易进入行动状态。', reflection: '如何避免过度消耗？', action: '安排一次主动休息。' },
    ],
  },
  {
    id: 'test-social',
    title: '社交偏好小测',
    description: '观察你社交充电方式的趣味测试。',
    totalRange: [0, 20],
    ready: true,
    disclaimer: '本测试仅供自我反思与娱乐，不构成人格定论或心理判断。',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: `s${i + 1}`,
      text: `第${i + 1}题：周末更想？`,
      options: [
        { label: '和朋友外出', score: 2 },
        { label: '看情况', score: 1 },
        { label: '独处休息', score: 0 },
      ],
    })),
    outcomes: [
      { min: 0, max: 6, title: '独处充电型', observation: '你可能通过独处恢复精力。', reflection: '独处时你通常在想什么？', action: '安排一段无打扰时间。' },
      { min: 7, max: 13, title: '灵活社交型', observation: '你可能根据状态选择社交。', reflection: '什么社交最滋养你？', action: '主动约一次高质量见面。' },
      { min: 14, max: 20, title: '社交充电型', observation: '你可能在人群中获得能量。', reflection: '如何保留自己的空间？', action: '尝试一次小型聚会。' },
    ],
  },
];
