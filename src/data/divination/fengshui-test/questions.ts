import type { FsQuestion } from './types';

const DIRS = ['east', 'south', 'west', 'north', 'southeast', 'southwest', 'northeast', 'northwest'];
const DIR_LABELS = ['东', '南', '西', '北', '东南', '西南', '东北', '西北'];
const dirOptions = DIRS.map((v, i) => ({ value: v, label: DIR_LABELS[i], ruleParam: { direction: v } }));

export const FS_QUESTIONS: FsQuestion[] = [
  { id: 'q1', kind: 'sitting-direction', text: '房屋坐向？', options: dirOptions, required: true, i18nKey: 'fs.question.sitting.label' },
  { id: 'q2', kind: 'birth-year', text: '入住者出生年（干支支序）？', options: Array.from({ length: 12 }, (_, i) => ({ value: `branch-${i}`, label: `支${i + 1}`, ruleParam: { branch: i } })), required: true, i18nKey: 'fs.question.birthyear.label' },
  { id: 'q3', kind: 'floor', text: '楼层数字？', options: Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} 层`, ruleParam: { floor: i + 1 } })), required: true, i18nKey: 'fs.question.floor.label' },
  { id: 'q4', kind: 'room-orientation', text: '主卧方位？', options: dirOptions, required: true, i18nKey: 'fs.question.bedroom.label' },
  { id: 'q5', kind: 'room-orientation', text: '大门方位？', options: dirOptions, required: true, i18nKey: 'fs.question.door.label' },
  { id: 'q6', kind: 'room-orientation', text: '厨房方位？', options: dirOptions, required: true, i18nKey: 'fs.question.kitchen.label' },
  { id: 'q7', kind: 'room-orientation', text: '卫生间方位？', options: dirOptions, required: true, i18nKey: 'fs.question.bathroom.label' },
  { id: 'q8', kind: 'layout', text: '户型形状？', options: [
    { value: 'square', label: '方正', ruleParam: { layout: 'square' } },
    { value: 'l-shape', label: 'L 形', ruleParam: { layout: 'l-shape' } },
    { value: 'missing', label: '缺角', ruleParam: { layout: 'missing' } },
    { value: 'long', label: '长条', ruleParam: { layout: 'long' } },
  ], required: true, i18nKey: 'fs.question.layout.label' },
];

export const FS_QUESTION_IDS = FS_QUESTIONS.map((q) => q.id);
